import pickle

def cargar_modelo():
    try:
        model, vectorizer = pickle.load(open("modelo_learning/ml/model.pkl", "rb"))
        return model, vectorizer
    except Exception as e:
        print(f"[ERROR] No se pudo cargar el modelo: {e}")
        return None, None

def predecir_local(sintomas):
    model, vectorizer = cargar_modelo()
    if model is None:
        return None
    
    try:
        X_vec = vectorizer.transform([sintomas])
        prediccion = model.predict(X_vec)[0]
        return prediccion
    except Exception as e:
        print(f"[ERROR] Fallo al predecir localmente: {e}")
        return None