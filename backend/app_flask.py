from flask import Flask, request
from flask_cors import CORS
from dotenv import load_dotenv
from flask_migrate import Migrate
import os

from config import Config
from database import db
from Models import app_usuarios, mascota, historial, relaciones
from Routes import auth_bp, chat_bp, mascota_bp, diagnostico_bp, historial_bp, admin_user_bp, news_bp

# Cargar variables de entorno
load_dotenv()

migrate = Migrate()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Incializar extensiones
    CORS(app, supports_credentials=True, resources={
        r"/api/*": {
            "origins": ["http://localhost:4200"],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"]
        }
    })
    db.init_app(app)

    migrate.init_app(app, db)

    # Registrar Blueprints
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(chat_bp, url_prefix="/api/chat")
    app.register_blueprint(mascota_bp, url_prefix='/api/mascota')
    app.register_blueprint(diagnostico_bp, url_prefix='/api/diagnostico')
    app.register_blueprint(historial_bp, url_prefix='/api/historial')
    app.register_blueprint(admin_user_bp, url_prefix='/api/usuarios')
    app.register_blueprint(news_bp, url_prefix='/api/noticias')

    return app

app = create_app()

if __name__ == '__main__':
    # Crear tablas si no existen (SOLO EN DESARROLLO)
    # with app.app_context():
    #     db.create_all()
    @app.before_request
    def handle_option():
        if request.method == 'OPTIONS':
            return '', 200

    app.run(debug=True)    

# Usar con WSGI (gunicorn) o contenedor cuando sea en PRODUCCION. 