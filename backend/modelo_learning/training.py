import sqlite3, pickle
import pandas as pd
import os
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.naive_bayes import MultinomialNB
from dotenv import load_dotenv

load_dotenv()

DB_PATH = os.getenv('DB_PATH')
MODEL_PATH = os.getenv('MODEL_PATH')

def cargar_datos_sqlite():
    """Cargar datos de sintomas, enfermedades y recomendaciones desde SQLite"""
    if not os.path.exists(DB_PATH):
        print("No se encontro la base de datos")
        return []
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute("""
            SELECT s.sintomas, e.id_enfermedad
            FROM relacion_tablas r
            JOIN sintomas s ON r.sintoma_id = s.id_sintomas
            JOIN enfermedades e ON r.enfermedad_id = e.id_enfermedad
        """)
        data = cursor.fetchall()
        conn.close()
        
        if data:
            print(f"Se cargaron {len(data)} registros desde la base de datos")
        else:
            print(f"La tabla 'relacion_tablas' no contiene datos suficientes")
    except Exception as e:
        print(f"Error al leer base de datos: {e}")
        return []

def entrenar_modelo():
    os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)
    
    data_sqlite = cargar_datos_sqlite()
    
    if len(data_sqlite) < 10:
        print("No hay suficientes datos para entrenar el modelo")
        return
    
    X, y = zip(*data_sqlite)

    vectorizer = CountVectorizer()
    X_vec = vectorizer.fit_transform(X)

    model = MultinomialNB()
    model.fit(X_vec, y)
    
    with open(MODEL_PATH, "wb") as f:
        pickle.dump((model, vectorizer), f)

    print(f"Modelo entrenado y guardado en {MODEL_PATH} con {len(data_total)} registros.")    

if __name__ == "__main__":
    entrenar_modelo()