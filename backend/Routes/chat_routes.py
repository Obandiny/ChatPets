from flask import Blueprint, request, jsonify
from Services.chat_service import procesar_diagnostico
from Models import Mascota
from Services.chat_service import continuar_conversacion
from utils.decorators import token_required

chat_bp = Blueprint('chat', __name__)

@chat_bp.route('/api/chat', methods=['POST'])
@token_required
def chat(usuario_actual):
    data = request.get_json()
    respuestas = data.get('respuestas')
    mascota_id = data.get('mascota_id')
    
    if not respuestas or not isinstance(respuestas, list):
        return jsonify({'error': 'Formato de datos invalido. Se espera una lista de respuestas.'}), 400
    
    if not mascota_id:
        return jsonify({'error': 'mascot_id es requerido'}), 400
    
    mascota = Mascota.query.filter_by(id=mascota_id, usuario_id=usuario_actual.id).first()
    
    try:
        respuesta_ai = procesar_diagnostico(usuario_actual, respuestas, mascota_id)
        return jsonify({'respuesta': respuesta_ai})
    except ValueError as e:
        return jsonify({'error': str(e)}), 403
    except Exception:
        return jsonify({'error': 'Error interno al procesar diagnostico'}), 500
    
@chat_bp.route('/api/continuar-chat', methods=['POST'])
@token_required
def continuar_chat(usuario_actual):
    try:
        data = request.get_json()
        pregunta = data.get('pregunta')
        diagnotico_id = data.get('diagnostico_id')
        
        if not pregunta or not diagnotico_id:
            return jsonify({"error": "Faltan datos"}), 400
        
        respuesta = continuar_conversacion(usuario_actual, diagnotico_id, pregunta)
        return jsonify({"respuesta": respuesta}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
