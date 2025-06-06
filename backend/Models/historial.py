from sqlalchemy import Column, Integer, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from database import db

class HistorialDiagnostico(db.Model):
    __tablename__ = "historial_diagnostico"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("usuarios.id"), nullable=False)
    mascota_id = Column(Integer, ForeignKey("mascotas.id"), nullable=False)
    sintomas = Column(Text, nullable=False)
    recomendacion = Column(Text, nullable=False)
    fecha = Column(DateTime, default=datetime.utcnow)

    usuario = relationship("Usuario", back_populates="historiales")
    mascota = relationship("Mascota", back_populates="historiales")
