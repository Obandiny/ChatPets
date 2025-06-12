from flask import Blueprints,  request, jsonify
from Models.mascota import Mascota
from utils import token_required
from database import db

import jwt
from config import Config

mascota_bp = Blueprints('auth', __name__)

@mascota_bp.route('/registrar', methods=['POST'])
@token_required
def registrar_mascota():
    if request.method == 'OPTIONS':
        return '', 200
    
    data = request.get_json()
    print('Datos Requeridos:', data)

    nombre = data.get('nombre', '').strip()
    raza = data.get('raza', '').strip()
    edad = data.get('edad', '').strip()
    tamano = data.get('tamano', '').strip()

    if not nombre or not raza or not edad or not tamano:
        return jsonify({'message': 'Todos los campos son obligatorios.'}), 400
    
    mascota = Mascota(
        nombre=nombre,
        raza=raza,
        edad=edad,
        tamano=tamano,
        # usuario_id=user_id
    )
    db.session.add(mascota)
    db.session.commit()

    return jsonify({'message', 'Mascota registrado con exito.'})
