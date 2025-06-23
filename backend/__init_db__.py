from flask import Flask
from config import Config
from database import db
from Models import app_usuarios, mascota, historial, relaciones, seguimientoMascota

app = Flask(__name__)
app.config.from_object(Config)
db.init_app(app)

with app.app_context():
    db.create_all()
    print("✅ Tablas creadas exitosamente en la base de datos.")