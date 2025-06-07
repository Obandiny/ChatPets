from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
from flask_migrate import Migrate
import os

from config import Config
from database import db
from Models import app_usuarios, mascota, historial, relaciones
from Routes import auth_bp, chat_bp

# Cargar variables de entorno
load_dotenv()

migrate = Migrate()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Incializar extensiones
    CORS(app, resources={r"/api/*": {"origins": "*"}})
    db.init_app(app)

    migrate.init_app(app, db)

    # Registrar Blueprints
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(chat_bp, url_prefix="/api/chat")

    return app

app = create_app()

if __name__ == '__main__':
    # Crear tablas si no existen (SOLO EN DESARROLLO)
    # with app.app_context():
    #     db.create_all()
    
    app.run(debug=True)    

# Usar con WSGI (gunicorn) o contenedor cuando sea en PRODUCCION. 