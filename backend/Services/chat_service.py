import google.generativeai as genai
import os
from Models.historial import HistorialDiagnostico
from Models.relaciones import RelacionTablas
from Models.relaciones import Sintoma
from Models.mascota import Mascota
from database import db
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

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

def construir_prompt(respuestas):
    texto = "\n".join(f"- {r}" for r in respuestas)
    
    prompt = f"""
    Soy un asistente veterinario virtual. Se me ha proporcionado la siguiente información sobre los síntomas de una mascota:
    
    {texto}

    basado en estos sintomas, responde con:
    1. Una posible condición o enfermedad que podría estar ocurriendo.
    2. Recomendaciones claras para el dueño (sin lenguaje técnico).
    3. Responde con información útil que el usuario pueda aplicar.
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

def procesar_diagnostico(usuario_actual, respuestas, mascota_id):
    try:
        logger.info("Iniciando diagnostico para Mascota no encontrada o no pertenece al usuario_id=%s, mascota_id=%s", usuario_actual.id, mascota_id)

        # Validar existencia y pertenencia de la mascota
        mascota = Mascota.query.filter_by(id=mascota_id, usuario_id=usuario_actual.id).first()
        if not mascota:
            logger.error("Mascota no encontrada o no pertence al usuario.")
            raise ValueError("Mascota no encontrada o no pertenece al usuario")

        prompt = construir_prompt(respuestas)
        logger.debug("Prompt generado: %s", prompt)

        model = configurar_gemini()
        chat = model.start_chat(history=[])
        response = chat.send_message(prompt)
        texto_respuesta = response.text
        logger.info("Respuesta de Gemini recibida.")

        
        # Guardar historial
        historial = HistorialDiagnostico(
            usuario_id=usuario_actual.id,
            mascota_id=mascota_id,
            sintomas=", ".join(respuestas),
            recomendacion=texto_respuesta,
            contexto_anterior=prompt
        )
        db.session.add(historial)
        db.session.commit()
        logger.info("Historial guardado exitosamente: id=%s", historial.id)
        
        return texto_respuesta
    
    except Exception as e:
        logger.exception("Error al procesar diagnostico con Gemini: %s", e)
        
        texto_fallback = consultar_database(respuestas)
        
        try:
            historial = HistorialDiagnostico(
                usuario_id=usuario_actual.id,
                mascota_id=mascota_id,
                sintomas=", ".join(respuestas),
                recomendacion=texto_fallback,
                contexto_anterior="Fallo Gemini. Respuesta generada desde base de datos."
            )
            db.session.add(historial)
            db.session.commit()
            logger.warning("Respuesta alternativa guardada en historial.")
        except Exception as db_error:
            logger.exception("Error al guardar historial en modo fallback: %s", db_error)
        
        return texto_fallback
    
def continuar_conversacion(usuario_actual, historial_id, nueva_pregunta):
    historial = HistorialDiagnostico.query.filter_by(id=historial_id, usuario_id=usuario_actual.id).first()
    
    if not historial:
        raise ValueError("Historial no encontrado")
    
    nuevo_prompt = f"""
    CONTEXTO ANTERIOR:
    {historial.contexto_anterior}

    NUEVA PREGUNTA DEL USUARIO:
    {nueva_pregunta}

    ➤ IMPORTANTE: Responde únicamente en el contexto de salud veterinaria y para la mascota específica. Sé claro y sin lenguaje técnico.
    """
    
    model = configurar_gemini()
    chat = model.start_chat(history=[])
    respuesta = chat.send_message(nuevo_prompt).text
    
    nuevo_historial = HistorialDiagnostico(
        usuario_id=usuario_actual.id,
        mascota_id=historial.mascota_id,
        sintomas=nueva_pregunta,
        recomendacion=respuesta,
        contexto_anterior=nuevo_prompt
    )
    db.session.add(nuevo_historial)
    db.session.commit()
    
    return respuesta