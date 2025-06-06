from flask import Blueprint, request, jsonify
from Services.chat_service import procesar_diagnostico
from utils.decorators import token_required

chat_bp = Blueprint('chat', __name__)

@chat_bp.route('/api/chat', methods=['POST'])
@token_required
def chat(usuario_actual):
    data = request.get_json()
    respuestas = data.get('respuestas')
    
    if not respuestas or not isinstance(respuestas, list):
        return jsonify({'error': 'Formato de datos invalido. Se espera una lista de respuestas.'}), 400
    
    respuesta_ai = procesar_diagnostico(usuario_actual, respuestas)
    
    return jsonify({'respuesta': respuesta_ai})