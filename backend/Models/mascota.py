from database import db
from sqlalchemy.orm import relationship

class Mascota(db.Model):
    __tablename__ = 'mascotas'
    
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), nullable=False)
    raza = db.Column(db.String(100))
    edad = db.Column(db.Integer)
    peso = db.Column(db.Float)
    tamano = db.Column(db.String(50))

    imagen_url = db.Column(db.String(255))

    usuario_id = db.Column(db.Integer, db.ForeignKey('usuarios.id'), nullable=False)
    historiales = db.relationship("HistorialDiagnostico", back_populates="mascota")
