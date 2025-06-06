from database import db

from .app_usuarios import *
from .diagnostico import *
from .historial import *
from .relaciones import *
from .mascota import *

__all__ = [
    "User",
    "Diagnostico",
    "HistorialDiagnostico",
    "Sintoma",
    "Enfermedad",
    "Recomendacion",
    "RelacionTablas",
    "Mascota"
]