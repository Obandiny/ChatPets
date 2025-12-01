import google.generativeai as genai
import os
from Models.historial import HistorialDiagnostico
from Models.relaciones import RelacionTablas
from Models.relaciones import Sintoma
from Models.mascota import Mascota
from database import db
import logging
import re
import pickle

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def cargar_modelo():
    try:
        model, vectorizer = pickle.load(open("modelo_learning/ml/model.pkl", "rb"))
        return model, vectorizer
    except Exception as e:
        print(f"[ERROR] No se pudo cargar el modelo: {e}")
        return None, None

def extraer_campos_ia(texto_respuesta):
    """
    Extrae los campos 'enfermedad', 'recomendacion' y 'alerta' desde el texto devuelto por Gemini.
    """
    
    enfermedad = ""
    recomendacion = ""
    alerta = ""
    
    # Expresiones regulares para capturar los bloques
    enfermedad_match = re.search(r"ENFERMEDAD PROBABLE:\s*(.+?)(?:\n|RECOMENDACION:)", texto_respuesta, re.DOTALL | re.IGNORECASE)
    recomendacion_match = re.search(r"RECOMENDACION:\s*(.+?)(?:\n|ALERTA:)", texto_respuesta, re.DOTALL | re.IGNORECASE)
    alerta_match = re.search(r"ALERTA:\s*(.+)", texto_respuesta, re.DOTALL | re.IGNORECASE)
    
    if enfermedad_match:
        enfermedad = enfermedad_match.group(1).strip()
    if recomendacion_match:
        recomendacion = recomendacion_match.group(1).strip()
    if alerta_match:
        alerta = alerta_match.group(1).strip()
    
    return enfermedad, recomendacion, alerta

def configurar_gemini():
    genai.configure(api_key=os.environ.get("GOOGLE_API_KEY"))
    
    generation_config = {
        "temperature": 0.15,
        "top_p": 0.95,
        "top_k": 40,
        "max_output_tokens": 800,
        "response_mime_type": "text/plain"
    }
    
    model = genai.GenerativeModel(
        model_name="gemini-1.5-flash-002",
        generation_config=generation_config
    )
    
    return model

def construir_prompt(respuestas, mascotas):
    texto = "\n".join(f"- {r}" for r in respuestas)
    
    prompt = f"""
    Eres un veterinario virtual. El usuario reporta los datos de una mascota y sus sintomas. Usa esto para sugerir un posible diagnostico y recomendaciones claras para su dueño.
    
    📌 Información de la mascota:
    - Nombre: {mascotas.nombre}
    - Edad: {mascotas.edad} años
    - Raza: {mascotas.raza}
    - Tamaño: {mascotas.tamano}
    - Peso: {mascotas.peso} kg

    🩺 Síntomas reportados:
    { texto }

    ENFERMEDAD PROBABLE:
    [escribe aqui]

    RECOMENDACION:
    [escribe aqui en lenguaje claro y directo]

    ALERTA:
    [clasifica la prioridad del caso como Alta, Media o Baja, justifica brevemente]
    """
    
    return prompt

def consultar_database(respuestas):
    for r in respuestas:
        resultado = RelacionTablas.query.join(Sintoma).filter(
            Sintoma.sintomas.ilike(f"%{r}")
        ).first()
        
        if resultado:
            return (
                f"Segun nuestros registros:\n"
                f"- Sintoma: {resultado.sintoma}\n"
                f"- Enfermedad: {resultado.enfermedad}\n"
                f"- Recomendacion: {resultado.recomendacion}"
            )
    return "No se encontró una recomendación en la base de datos para los síntomas proporcionados."  

def predecir_local(sintomas):
    model, vectorizer = cargar_modelo()
    if model is None:
        return None
    
    try:
        X_vec = vectorizer.transform([sintomas])
        prediccion = model.predict(X_vec)[0]
        return prediccion
    except Exception as e:
        print(f"[ERROR] Fallo al predecir localmente: {e}")
        return None  

def procesar_diagnostico(usuario_actual, respuestas, mascota_id, mascotas):
    try:
        # Aquí, "mascotas" es el objeto de la mascota que pasas
        logger.info("Iniciando diagnóstico para usuario_id=%s, mascota_id=%s", usuario_actual.id, mascota_id)

        # Validar existencia y pertenencia de la mascota
        if not mascotas:
            logger.error("Mascota no encontrada o no pertenece al usuario.")
            raise ValueError("Mascota no encontrada o no pertenece al usuario")

        prompt = construir_prompt(respuestas, mascotas)  # Se pasa el objeto mascota
        logger.debug("Prompt generado: %s", prompt)

        model = configurar_gemini()
        chat = model.start_chat(history=[])
        response = chat.send_message(prompt)
        texto_respuesta = response.text

        enfermedad, recomendacion, alerta = extraer_campos_ia(texto_respuesta)

        logger.info("Respuesta de Gemini recibida.")

        # Guardar historial
        historial = HistorialDiagnostico(
            usuario_id=usuario_actual.id,
            mascota_id=mascota_id,
            sintomas=", ".join(respuestas),
            recomendacion=recomendacion,
            enfermedad=enfermedad,
            prioridad=alerta,
            contexto_anterior=texto_respuesta
        )
        db.session.add(historial)
        db.session.commit()
        logger.info("Historial guardado exitosamente: id=%s", historial.id)

        return texto_respuesta
    
    except Exception as e:
        logger.exception("Error al procesar diagnóstico con Gemini: %s", e)
        texto_fallback = consultar_database(respuestas)

        # Guarda en historial con la respuesta fallback
        try:
            historial = HistorialDiagnostico(
                usuario_id=usuario_actual.id,
                mascota_id=mascota_id,
                sintomas=", ".join(respuestas),
                recomendacion=texto_fallback,
                contexto_anterior=texto_fallback
            )
            db.session.add(historial)
            db.session.commit()
            logger.warning("Respuesta alternativa guardada en historial.")
        except Exception as db_error:
            logger.exception("Error al guardar historial en modo fallback: %s", db_error)

        return texto_fallback


