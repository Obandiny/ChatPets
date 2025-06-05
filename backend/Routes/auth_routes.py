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

