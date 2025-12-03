from .auth_routes import auth_bp
from .chat_routes import chat_bp
from .mascota_routes import mascota_bp
from .diagnostico_routes import diagnostico_bp
from .historial_routes import historial_bp
from .admin.admin_users_routes import admin_user_bp
from .noticias_routes import news_bp
from .entrenar.entrenamiento import entrenamiento_bp

__all__ = ['auth_bp', 'chat_bp', 'mascota_bp', 'diagnostico_bp', 'historial_bp', 'admin_user_bp', 'news_bp', 'entrenamiento_bp']