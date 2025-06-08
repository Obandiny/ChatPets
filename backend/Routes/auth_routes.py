from flask import Blueprint, request, jsonify
from Models.app_usuarios import Usuario
from database import db
import jwt
import datetime
from config import Config

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    if request.method == 'OPTIONS':
        return '', 200

    data = request.get_json()
    nombre = data.get('nombre')
    apellido = data.get('apellido')
    correo = data.get('correo')
    password = data.get('password')
    
    if Usuario.query.filter_by(correo=correo).first():
        return jsonify({'message': 'El correo ya esta registrado.'}), 400
    
    new_user = Usuario(nombre=nombre, apellido=apellido, correo=correo)
    new_user.set_password(password)
    db.session.add(new_user)
    db.session.commit()
    
    return jsonify({'message': 'Usuario registrado con exito.'})

@auth_bp.route('/login', methods=['POST'])
def login():
    data =request.get_json()
    correo = data.get('correo')
    password = data.get('password')
    
    user = Usuario.query.filter_by(correo=correo).first()
    
    if user and user.check_password(password):
        token = jwt.encode({
            'user_id': user.id,
            'rol': user.rol,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=6)
        }, Config.SECRET_KEY, algorithm='HS256')  
        
        return jsonify({
            'token': token,
            'usuario': {
                'id': user.id,
                'nombre': user.nombre,
                'correo': user.correo,
                'rol': user.rol
            }
        })
    return jsonify({'message': 'Credenciales invalidas'}), 401
