from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
import pandas as pd
import os

from database import db
from Models.relaciones import RelacionTablas
from Services.model_trainer import entrenar_modelo_bd
from utils import token_required
from dotenv import load_dotenv

load_dotenv()

entrenamiento_bp = Blueprint('entrenamiento_bp', __name__)

UPLOAD_FOLDER = os.getenv('UPLOAD_FOLDER')
ALLOWED_EXTENSIONS = os.getenv('ALLOWED_EXTENSIONS')

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@entrenamiento_bp.route('/importar-excel', methods=['POST'])
def importar_excel():
    try:
        if 'archivo' not in request.files:
            return jsonify({"error": "No se envio ningun archivo"}), 400
        
        archivo = request.files['archivo']
        
        if archivo.filename == "":
            return jsonify({"error": "El archivo esta vacio"}), 400
        
        if not allowed_file(archivo.filename):
            return jsonify({"error": "Formato no permitido. Debe ser .xlsx"}), 400
        
        filename = secure_filename(archivo.filename)
        filepath = os.path.join(UPLOAD_FOLDER, filename)
        archivo.save(filepath)
        
        df = pd.read_excel(filepath)
        
        columnas_requeridas = {"sintoma", "enfermedad", "recomendacion", "prioridad"}

        if not columnas_requeridas.issubset(df.columns):
            return jsonify({
                "error": "El archivo no tiene las columnas requeridas",
                "columnas_requeridad": list(columnas_requeridas),
                "columnas_encontradas": list(df.columns)
            }), 400 
        
        RelacionTablas.query.delete()
        db.session.commit()
        
        registros = []
        for _, fila in df.iterrows():
            reg = RelacionTablas(
                sintoma=fila["sintoma"],
                enfermedad=fila["enfermedad"],
                recomendacion=fila["recomendacion"],
                prioridad=fila["prioridad"]
            )
            registros.append(reg)
        
        db.session.bulk_save_objects(registros)
        db.session.commit()
        
        resultado = entrenar_modelo_bd()
        
        return jsonify({
            "mensaje": "Archivo procesado, datos guardados y modelo reentrenado",
            "filas_guardadas": len(registros),
            "modelo": resultado
        }), 200
    except Exception as e:
        db.session.rollback()
        print("Error al importar", e)
        return jsonify({"error": "Error al procesar archivo", "detalle": str(e)}), 500    