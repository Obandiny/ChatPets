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
        
        registros_nuevos = 0

        for _, fila in df.iterrows():
            existe = RelacionTablas.query.filter_by(
                sintoma=str(fila["sintoma"]).strip(),
                enfermedad=str(fila["enfermedad"]).strip()
            ).first()

            if not existe:
                nuevo = RelacionTablas(
                    sintomas=str(fila["sintoma"]).strip(),
                    enfermedad=str(fila["enfermedad"]).strip(),
                    recomendacion=str(fila["recomendacion"]).strip(),
                    prioridad=str(fila["prioridad"]).strip().lower()
                )
                db.session.add(nuevo)
                registros_nuevos += 1
        
        db.session.commit()
        
        resultado_modelo = entrenar_modelo_bd()
        
        return jsonify({
            "mensaje": "Excel importado correctamente",
            "registros_nuevos": registros_nuevos,
            "modelo": resultado_modelo
        }), 200
    
    except Exception as e:
        db.session.rollback()
        print("Error al importar", e)
        return jsonify({
            "error": "Error al procesar archivo", 
            "detalle": str(e)
        }), 500    