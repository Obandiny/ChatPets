from database import db
from sqlalchemy.orm import relationship

class Sintoma(db.Model):
    __tablename__ = 'sintomas'

    id_sintomas = db.Column(db.Integer, primary_key=True)
    sintomas = db.Column(db.Text, nullable=False)
    relaciones = relationship('RelacionTablas', back_populates='sintoma')

class Enfermedad(db.Model):
    __tablename__ = 'enfermedades'

    id_enfermedad = db.Column(db.Integer, primary_key=True)
    enfermedad = db.Column(db.String(255), nullable=False)
    relaciones = relationship('RelacionTablas', back_populates='enfermedad')

class Recomendacion(db.Model):
    __tablename__ = 'recomendaciones'

    id_recomendacion = db.Column(db.Integer, primary_key=True)
    recomendacion = db.Column(db.Text, nullable=False)
    relaciones = relationship('RelacionTablas', back_populates='recomendacion')

class RelacionTablas(db.Model):
    __tablename__ = 'relacion_tablas'
    id = db.Column(db.Integer, primary_key=True)
    
    sintoma_id = db.Column(db.Integer, db.ForeignKey('sintomas.id_sintomas'), nullable=False)
    enfermedad_id = db.Column(db.Integer, db.ForeignKey('enfermedades.id_enfermedad'), nullable=False)
    recomendacion_id = db.Column(db.Integer, db.ForeignKey('recomendaciones.id_recomendacion'), nullable=False)
    
    sintoma = db.relationship("Sintoma", back_populates="relaciones")
    enfermedad = db.relationship("Enfermedad", back_populates="relaciones")
    recomendacion = db.relationship("Recomendacion", back_populates="relaciones")
