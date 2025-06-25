from flask import Blueprint, request, jsonify
from Models.app_usuarios import Usuario
from database import db
from utils import token_required

admin_user_bp = Blueprint('admin_users', __name__)

@admin_user_bp.route('/', methods=['GET'])
@token_required
def obtener_usuarios(current_user):
    if current_user.rol != 'admin':
        return jsonify({"mensaje": "Acceso denegado"}), 403
    
    usuarios = Usuario.query.all()
    return jsonify([
        {
            'id': u.id,
            'nombre': u.nombre,
            'apellido': u.apellido,
            'correo': u.correo,
            'rol': u.rol
        } for u in usuarios
    ])

@admin_user_bp.route('/<int:usuario_id>/rol', methods=['PUT'])
@token_required
def actualizar_rol(current_user, usuario_id):
    if current_user.rol != 'admin':
        return jsonify({'mensaje': 'Acceso denegado'}), 403

    data = request.get_json()
    nuevo_rol = data.get('rol')
    if nuevo_rol not in ['admin', 'usuario']:
        return jsonify({'mensaje': 'Rol inválido'}), 400

    usuario = Usuario.query.get(usuario_id)
    if not usuario:
        return jsonify({'mensaje': 'Usuario no encontrado'}), 404

    usuario.rol = nuevo_rol
    db.session.commit()
    return jsonify({'mensaje': 'Rol actualizado correctamente'})

@admin_user_bp.route('/<int:usuario_id>', methods=['DELETE'])
@token_required
def eliminar_usuario(current_user, usuario_id):
    if current_user.rol != 'admin':
        return jsonify({'mensaje': 'Acceso denegado'}), 403

    usuario = Usuario.query.get(usuario_id)
    if not usuario:
        return jsonify({'mensaje': 'Usuario no encontrado'}), 404

    db.session.delete(usuario)
    db.session.commit()
    return jsonify({'mensaje': 'Usuario eliminado correctamente'})