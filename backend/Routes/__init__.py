from .auth_routes import auth_bp
from .chat_routes import chat_bp
from .mascota_routes import mascota_bp
from .diagnostico_routes import diagnostico_bp
from .historial_routes import historial_bp

__all__ = ['auth_bp', 'chat_bp', 'mascota_bp', 'diagnostico_bp', 'historial_bp']