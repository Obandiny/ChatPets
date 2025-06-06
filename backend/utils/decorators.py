from functools import wraps
from flask import request, jsonify
import jwt
import os
from Models.app_usuarios import User
from database import db

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
            data = jwt.decode(token, os.environ.get('JWT_SECRET_KEY'), algorithms=["HS256"])
            current_user = db.session.get(Usuario, data['id'])
        except Exception as e:
            print(f"Token invalido: {e}")
            return jsonify({'mensaje': 'Token Invalido'}), 401
        
        return f(current_user, *args, **kwargs)          
    return decorated  