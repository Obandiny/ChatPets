import pickle
from Models.relaciones import RelacionTablas, Sintoma, Enfermedad, Recomendacion
from database import db
from sklearn.naive_bayes import MultinomialNB
from sklearn.feature_extraction.text import CountVectorizer

def cargar_modelo():
    try:
        model, vectorizer = pickle.load(open("modelo_learning/ml/model.pkl", "rb"))
        return model, vectorizer
    except Exception as e:
        print(f"[ERROR] No se pudo cargar el modelo: {e}")
        return None, None

def modelo_datos_suficientes():
    total = RelacionTablas.query.count()
    return total >= 10

def predecir_local(texto_sintomas):
    model, vectorizer = cargar_modelo()
    if not model or not modelo_datos_suficientes():
        return None
    
    try:
        X_vec = vectorizer.transform([texto_sintomas])
        prediccion = model.predict(X_vec)[0]
        prob = max(model.predict_proba(X_vec)[0])
        
        if prob < 0.60:
            return None
        
        enfermedad = Enfermedad.query.get(prediccion)
        recomendacion = Recomendacion.query.filter_by(enfermedad_id=prediccion).first()
        
        if not enfermedad or not recomendacion:
            return None
        
        return {
            "enfermedad": enfermedad.enfermedad,
            "recomendacion": recomendacion.recomendacion,
            "alerta": "MEDIA"
        }
    except Exception as e:
        print(f"[ERROR] Fallo al predecir localmente: {e}")
        return None

def alimentar_db_gemini(sintoma_texto, enfermedad, recomendacion):
    """Guardar datos en relacion_tablas"""
    sintoma = Sintoma(sintomas=sintoma_texto)
    db.session.add(sintoma)
    db.session.commit()
    
    enf = Enfermedad(enfermedad=enfermedad)
    rec = Recomendacion(recomendacion=recomendacion)
    db.session.add(enf)
    db.session.add(rec)
    db.session.commit()
    
    relacion = RelacionTablas(
        sintoma_id=sintoma.id_sintomas,
        enfermedad_id=enf.id_enfermedad,
        recomendacion_id=rec.id_recomendacion
    )
    db.session.add(relacion)
    db.session.commit()
    
    print(f"Nueva relacion añadida para mejorar el modelo.")