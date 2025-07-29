from sqlalchemy.orm import relationship
from datetime import datetime
from database import db
from Models.app_usuarios import Usuario
from Models.mascota import Mascota

class HistorialDiagnostico(db.Model):
    __tablename__ = "historial_diagnostico"

    id = db.Column(db.Integer, primary_key=True, index=True)

    usuario_id = db.Column(db.Integer, db.ForeignKey("usuarios.id"), nullable=False)
    usuario = db.relationship("Usuario", back_populates="historiales")

    mascota_id = db.Column(db.Integer, db.ForeignKey("mascotas.id"), nullable=False)
    mascota = db.relationship("Mascota", back_populates="historiales")

    sintomas = db.Column(db.Text, nullable=False)
    recomendacion = db.Column(db.Text, nullable=False)
    contexto_anterior = db.Column(db.Text, nullable=False)

    enfermedad = db.Column(db.Text, nullable=False)
    alerta = db.Column(db.String(255))

    fecha = db.Column(db.DateTime, default=datetime.utcnow)


