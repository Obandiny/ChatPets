from database import db
from sqlalchemy.orm import relationship
from datetime import datetime

class Diagnostico(db.Model):
    __tablename__ = 'diagnostico'
    
    id = db.Column(db.Integer, primary_key=True)
    sintomas = db.Column(db.Text, nullable=False)
    respuesta_ia = db.Column(db.Text, nullable=False)
    fecha = db.Column(db.DateTime, default=datetime.utcnow)
    
    usuario_id = db.Column(db.Integer, db.ForeignKey('usuarios.id'))
    usuario = relationship('usuarios', back_populates='diagnosticos')