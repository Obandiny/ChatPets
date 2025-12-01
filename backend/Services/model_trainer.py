import pandas as pd
from database import db
from Models.relaciones import RelacionTablas
import pickle

def entrenar_modelo_bd():
    registros = RelacionTablas.query.all()
    
    data = {
        "sintoma": [r.sintoma for r in registros],
        "enfermedad": [r.enfermedad for r in registros],
        "recomendaciop": [r.recomendacion for r in registros],
        "prioridad": [r.prioridad for r in registros]
    }
    
    df = pd.DataFrame(data)
    
    modelo = {
        "dataframe": df.to_dict(),
        "total_registros": len(df)
    }
    
    with open("modelo.pkl", "wb") as f:
        pickle.dump(modelo, f)
    
    return {
        "registros": len(df),
        "archivo": "modelo.pkl"
    }
