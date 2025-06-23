from flask import Blueprint,  request, jsonify
from Models.mascota import Mascota
from Models.seguimientoMascota import SeguimientoMascota
from utils import token_required
import logging as logger
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

@mascota_bp.route('/mis-mascotas', methods=['GET'])
@token_required
def obtener_mis_mascotas(current_user):
    mascotas = Mascota.query.filter_by(usuario_id=current_user.id).all()
    resultado = [{
        'id': m.id,
        'nombre': m.nombre,
        'raza': m.raza,
        'edad': m.edad,
        'tamano': m.tamano,
        'peso': m.peso,
        'imagen_url': m.imagen_url
    } for m in mascotas]
    return jsonify(resultado), 200

@mascota_bp.route('/<int:id>', methods=['GET'])
@token_required
def obtener_mascota_por_id(current_user, id):
    mascota = Mascota.query.filter_by(id=id, usuario_id=current_user.id).first()
    
    if not mascota:
        return jsonify({"mensaje": "Mascota no encontrada"}), 404

    return jsonify({
        "id": mascota.id,
        "nombre": mascota.nombre,
        "raza": mascota.raza,
        "edad": mascota.edad,
        "tamano": mascota.tamano,
        "peso": mascota.peso,
        "imagen_url": mascota.imagen_url  # si tienes este campo
    }), 200

@mascota_bp.route('/seguimiento', methods=['POST'])
@token_required
def guardar_seguimiento(current_user):
    try:
        data = request.json
        mascota_id = data.get('mascota_id')

        # Buscar la mascota original
        mascota = db.session.get(Mascota, mascota_id)
        if not mascota:
            return jsonify({"error": "Mascota no encontrada"}), 404
        
        # Validar que la mascota sea del usuario actual
        if mascota.usuario_id != current_user.id:
            return jsonify({"error": "No autorizado para modificar esta mascota"}), 403

        # Guardar seguimiento
        seguimiento = SeguimientoMascota(
            mascota_id=mascota_id,
            nombre=mascota.nombre,
            edad=mascota.edad,
            raza=mascota.raza,
            peso=mascota.peso
        )
        db.session.add(seguimiento)

        # Actualizar tabla mascota
        mascota.nombre = data['nombre']
        mascota.edad = data['edad']
        mascota.raza = data['raza']
        mascota.peso = data['peso']

        db.session.commit()

        return jsonify({"message": "Seguimiento guardado y mascota modificada"}), 200
    
    except Exception as e:
        import traceback
        print("Error", traceback.format_exc())
        logger.error("Error al guardar seguimiento", e), 400    