from functools import wraps
from flask import request, jsonify
import jwt
import os
from Models.app_usuarios import Usuario
from database import db
from config import Config

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            if auth_header.startswith("Bearer "):
                token = auth_header.split(" ")[1]
        
        if not token:
            return jsonify({'mensaje': 'Token no proporcionado'}), 401
        
        try:
            data = jwt.decode(token, Config.SECRET_KEY, algorithms=["HS256"])
            print(f"Payload decodificado: {data}")
            current_user = db.session.get(Usuario, data['user_id'])
        except Exception as e:
            print(f"Token inválido: {str(e)}")
            return jsonify({'mensaje': 'Token Invalido'}), 401
        
        return f(current_user, *args, **kwargs)          
    return decorated  