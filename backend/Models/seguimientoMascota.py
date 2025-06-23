from database import db
from sqlalchemy.orm import relationship
from datetime import datetime
from Models.mascota import Mascota

class SeguimientoMascota(db.Model):
    __tablename__ = 'seguimiento_mascota'
    
    id = db.Column(db.Integer, primary_key=True)
    mascota_id = db.Column(db.Integer, db.ForeignKey('mascotas.id'), nullable=False)
    nombre = db.Column(db.String(120))
    edad = db.Column(db.Integer)
    raza = db.Column(db.String(120))
    peso = db.Column(db.Float)
    fecha_modificacion = db.Column(db.DateTime, default=datetime.utcnow)
    
    mascota = db.relationship('Mascota', back_populates='seguimientos')

