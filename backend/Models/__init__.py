from database import db

from .app_usuarios import *
from .mascota import *
from .historial import *
from .relaciones import *

__all__ = [
    "User",
    "HistorialDiagnostico",
    "Sintoma",
    "Enfermedad",
    "Recomendacion",
    "RelacionTablas",
    "Mascota"
]