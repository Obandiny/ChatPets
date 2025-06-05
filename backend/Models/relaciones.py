from database import db
from sqlalchemy.orm import relationship

class Sintoma(db.Model):
    __tablename__ = 'sintomas'
    id_sintomas = db.Column(db.Integer, primary_key=True)
    sintomas = db.Column(db.Text, nullable=False)
    enfermedades = relationship('SintomaEnfermedad', back_populates='sintoma')

class Enfermedad(db.Model):
    __tablename__ = 'enfermedades'
    id_enfermedad = db.Column(db.Integer, primary_key=True)
    enfermedad = db.Column(db.String(255), nullable=False)
    sintomas = relationship('SintomaEnfermedad', back_populates='enfermedad')
    recomendaciones = relationship('EnfermedadRecomendacion', back_populates='enfermedad')

class Recomendacion(db.Model):
    __tablename__ = 'recomendaciones'
    id_recomendacion = db.Column(db.Integer, primary_key=True)
    recomendacion = db.Column(db.String(255), nullable=False)
    enfermedades_relacionadas = relationship('EnfermedadRecomendacion', back_populates='recomendacion')

# class RelacionTablas(db.Model):
#     __bind_key__ = 'sys'
#     __tablename__ = 'relacion_tablas'
#     id_relacion = db.Column(db.Integer, primary_key=True)

class SintomaEnfermedad(db.Model):
    __tablename__ = 'sintomas_enfermedades'
    sintomas_id = db.Column(db.Integer, db.ForeignKey('sintomas.id_sintomas'), primary_key=True)
    enfermedad_id = db.Column(db.Integer, db.ForeignKey('enfermedades.id_enfermedad'), primary_key=True)
    sintoma = relationship('Sintoma', back_populates='enfermedades')
    enfermedad = relationship('Enfermedad', back_populates='sintomas')

class EnfermedadRecomendacion(db.Model):
    __tablename__ = 'enfermedades_recomendaciones'
    enfermedad_id = db.Column(db.Integer, db.ForeignKey('enfermedades.id_enfermedad'), primary_key=True)
    recomendacion_id = db.Column(db.Integer, db.ForeignKey('recomendaciones.id_recomendacion'), primary_key=True)
    enfermedad = relationship('Enfermedad', back_populates='recomendaciones')
    recomendacion = relationship('Recomendacion', back_populates='enfermedades_relacionadas')   