from flask import Blueprint, request, jsonify
from Models.app_usuarios import Usuario
from Services.chat_service import procesar_diagnostico
from utils import token_required  # o el archivo donde está tu decorador

diagnostico_bp = Blueprint('diagnostico', __name__)

@diagnostico_bp.route('/diagnostico', methods=['POST'])
@token_required
def realizar_diagnostico(current_user):
    try:
        data = request.get_json()
        sintomas = data.get('sintomas', [])
        mascota_id = data.get('mascota_id')

        if not sintomas or not mascota_id:
            return jsonify({'error': 'Faltan síntomas o ID de mascota'}), 400

        # Llama a la función principal con el usuario
        resultado = procesar_diagnostico(current_user, sintomas, mascota_id)

        return jsonify({
            'mensaje': 'Diagnóstico realizado correctamente',
            'resultado': resultado
        }), 200

    except Exception as e:
        print("Error en diagnóstico:", e)
        return jsonify({'error': 'Ocurrió un error al procesar el diagnóstico'}), 500
