from flask import Blueprint, request, jsonify
from Services.chat_service import procesar_diagnostico
from Models import Mascota
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
    
