import pickle
from Models.relaciones import RelacionTablas, Sintoma, Enfermedad, Recomendacion
from database import db
import os
from dotenv import load_dotenv
# from sklearn.naive_bayes import MultinomialNB
# from sklearn.feature_extraction.text import CountVectorizer

load_dotenv()

MODEL_PATH = os.getenv('MODEL_PATH')

def cargar_modelo():
    try:
        with open(MODEL_PATH, "rb") as f:
            model, vectorizer = pickle.load(f)
        return model, vectorizer
    except Exception as e:
        print(f"[ERROR] No se pudo cargar el modelo: {e}")
        return None, None

def modelo_datos_suficientes():
    return RelacionTablas.query.count() >= 10

def predecir_local(texto_sintomas):
    model, vectorizer = cargar_modelo()

    if not model or not modelo_datos_suficientes():
        return None
    
    try:
        X_vec = vectorizer.transform([texto_sintomas])
        prediccion = model.predict_proba(X_vec)[0]
        mejor_prob = max(prediccion)
        
        if mejor_prob < 0.60:
            return None
        
        enfermedad_id = model.predict(X_vec)[0]

        enfermedad = Enfermedad.query.get(enfermedad_id)
        recomendacion = Recomendacion.query.filter_by(
            enfermedad_id=enfermedad_id
        ).first()
        
        if not enfermedad or not recomendacion:
            return None
        
        return {
            "enfermedad": enfermedad.enfermedad,
            "recomendacion": recomendacion.recomendacion,
            "alerta": "MEDIA",
            "confianza": round(float(mejor_prob), 2)
        }
    except Exception as e:
        print(f"[ERROR] Fallo al predecir localmente: {e}")
        return None

def alimentar_db_gemini(sintoma_texto, enfermedad_txt, recomendacion_txt):
    # Sintoma
    sintoma = Sintoma.query.filter_by(sintomas=sintoma_texto).first()
    if not sintoma:
        sintoma = Sintoma(sintomas=sintoma_texto)
        db.session.add(sintoma)
        db.session.commit()
    
    # Enfermedad
    enfermedad = Enfermedad.query.filter_by(enfermedad=enfermedad_txt).first()
    if not enfermedad:
        enfermedad = Enfermedad(enfermedad=enfermedad_txt)
        db.session.add(enfermedad)
        db.session.commit()
    
    # Recomendacion
    recomendacion = Recomendacion.query.filter_by(
        recomendacion=recomendacion_txt
    ).first()

    if not recomendacion:
        recomendacion = Recomendacion(
            recomendacion=recomendacion_txt,
            enfermedad_id=enfermedad.id_enfermedad
        )
        db.session.add(recomendacion)
        db.session.commit()
    
    # Relacion
    existe = RelacionTablas.query.filter_by(
        sintoma_id=sintoma.id_sintomas,
        enfermedad_id=enfermedad.id_enfermedad,
        recomendacion_id=recomendacion.id_recomendacion
    ).first()

    if not existe:
        relacion = RelacionTablas(
            sintoma_id=sintoma.id_sintomas,
            enfermedad_id=enfermedad.id_enfermedad,
            recomendacion_id=recomendacion.id_recomendacion
        )
        db.session.add(relacion)
        db.session.commit()

    print("Datos de Gemini integrados correctamente al modelo")