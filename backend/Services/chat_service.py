import google.generativeai as genai
import os
from Models.historial import HistorialDiagnostico
from Models.relaciones import RelacionTablas
from database import db

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
        resultado = RelacionTablas.query.filter(
            RelacionTablas.sintoma.ilike(f"%{r}")
        ).first()
        
        if resultado:
            return (
                f"Segun nuestros registros:\n"
                f"- Sintoma: {resultado.sintoma}\n"
                f"- Enfermedad: {resultado.enfermedad}\n"
                f"- Recomendacion: {resultado.recomendacion}"
            )
    return "No se encontró una recomendación en la base de datos para los síntomas proporcionados."    

def procesar_diagnostico(usuario_actual, respuestas):
    try:
        prompt = construir_prompt(respuestas)
        model = configurar_gemini()
        chat = model.start_chat(history=[])
        response = chat.send_message(prompt)
        texto_respuesta = response.text
        
        # Guardar historial
        historial = HistorialDiagnostico(
            usuario_id=usuario_actual.id,
            sintomas=", ".join(respuestas),
            recomendacion=texto_respuesta
        )
        db.session.add(historial)
        db.session.commit()
        
        return texto_respuesta
    except Exception as e:
        print(f"Error al procesar diagnostico: {e}")
        
        texto_fallback = consultar_database(respuestas)
        
        historial = HistorialDiagnostico(
            usuario_id=usuario_actual.id,
            sintomas=", ".join(respuestas),
            recomendacion=texto_fallback
        )
        db.session.add(historial)
        db.session.commit()
        
        return texto_fallback