from flask import Blueprint, request, jsonify
from Models.app_usuarios import User
from database import db
import jwt
import datetime
from config import Config

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    nombre = data.get('nombre')
    apellido = data.get('correo')
    correo = data.get('correo')
    password = data.get('password')
    
    if User.query.filter_by(correo=correo).first():
        return jsonify({'message': 'El correo ya esta registrado.'}), 400
    
    new_user = User(nombre=nombre, correo=correo)
    new_user.set_password(password)
    db.session.add(new_user)
    db.session.commit()
    
    return jsonify({'message': 'Usuario registrado con exito.'})

@auth_bp.route('/api/login', methods=['POST'])
def login():
    data =request.get_json()
    correo = data.get('correo')
    password = data.get('password')
    
    user = User.query.filter_by(correo=correo).first()
    
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
