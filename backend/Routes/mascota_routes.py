from flask import Blueprint,  request, jsonify
from Models.mascota import Mascota
from utils import token_required
from database import db

import jwt
from config import Config

mascota_bp = Blueprint('mascota', __name__)

@mascota_bp.route('/registrar', methods=['POST'])
@token_required
def registrar_mascota(current_user):
    if request.method == 'OPTIONS':
        return '', 200
    
    data = request.get_json()
    print('Datos Requeridos:', data)

    nombre = data.get('nombre', '').strip()
    raza = data.get('raza', '').strip()
    edad = data.get('edad')
    tamano = data.get('tamano', '').strip()
    peso = data.get('peso')

    if not nombre or not raza or not edad or not tamano:
        return jsonify({'message': 'Todos los campos son obligatorios.'}), 400
    
    mascota = Mascota(
        nombre=nombre,
        raza=raza,
        edad=edad,
        tamano=tamano,
        peso=peso,
        usuario_id=current_user.id
    )
    db.session.add(mascota)
    db.session.commit()

    return jsonify({'message': 'Mascota registrado con exito.'})
