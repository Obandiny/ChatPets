from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
import pandas as pd
import os

from database import db
from Models.relaciones import RelacionTablas, Sintoma, Enfermedad
from Services.model_trainer import entrenar_modelo_bd
from utils import token_required
from dotenv import load_dotenv

load_dotenv()

entrenamiento_bp = Blueprint('entrenamiento_bp', __name__)

UPLOAD_FOLDER = os.getenv('UPLOAD_FOLDER')
ALLOWED_EXTENSIONS = set(os.getenv('ALLOWED_EXTENSIONS', 'xlsx').split(','))

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

            sintoma_texto = str(fila["sintoma"]).strip()
            enfermedad_texto = str(fila["enfermedad"]).strip()

            sintoma_obj = Sintoma.query.filter_by(sintomas=sintoma_texto).first()
            if not sintoma_obj:
                sintoma_obj = Sintoma(sintomas=sintoma_texto)
                db.session.add(sintoma_obj)
                db.session.flush()

            enfermedad_obj = Enfermedad.query.filter_by(enfermedad=enfermedad_texto).first()
            if not enfermedad_obj:
                enfermedad_obj = Enfermedad(enfermedad=enfermedad_texto)
                db.session.add(enfermedad_obj)
                db.session.flush()    

            existe = RelacionTablas.query.filter_by(
                sintoma_id=sintoma_obj.id_sintomas,
                enfermedad_id=enfermedad_obj.id_enfermedad
            ).first()

            if not existe:
                nuevo = RelacionTablas(
                    sintoma_id=sintoma_obj.id_sintomas,
                    enfermedad_id=enfermedad_obj.id_enfermedad,
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