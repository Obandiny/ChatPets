from flask import Flask, request, jsonify, render_template
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.neural_network import MLPClassifier
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import relationship
from sqlalchemy import text
import google.generativeai as genai
import os

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:4200"}})
   
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:SQL#pass2000@localhost/sys'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "C:\\ProyectChat\\JSON\\chatpets-447422-74d12ad55a99.json"
os.environ["GOOGLE_API_KEY"] = "AIzaSyD1PorqaIDwXplr-fVR42NmhUDG3W2LQoM"

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


def cargar_datos_db():
    sintomas = db.session.query(Sintoma).all()
    sintomas_texto = [str(s.sintomas) for s in sintomas]
    recomendaciones_texto = []
    
    for sintoma in sintomas:
        for relacion in sintoma.enfermedades:
            for recomendacion in relacion.enfermedad.recomendaciones:
                recomendaciones_texto.append(recomendacion.recomendacion)
    
    # Asegúrate de que todas las recomendaciones sean cadenas
    recomendaciones_texto = [str(r) for r in recomendaciones_texto]
    return sintomas_texto, recomendaciones_texto

# def entrenar_modelo(sintomas, recomendaciones):

#     if len(sintomas) != len(recomendaciones):
#         raise ValueError("El número de síntomas y recomendaciones no coincide.")
    
#     data = list(zip(sintomas, recomendaciones))
#     data = [(s, r) for s, r in data if s and r] 
#     sintomas, recomendaciones = zip(*data)

#     # Codificar etiquetas
#     label_encoder = LabelEncoder()
#     y = label_encoder.fit_transform(recomendaciones)

#     # Vectorizar los textos
#     vectorizer = TfidfVectorizer(max_features=5000)
#     X = vectorizer.fit_transform(sintomas)

#     # Crear y entrenar el modelo
#     model = MLPClassifier(hidden_layer_sizes=(128,), max_iter=500, solver='adam', random_state=42)
#     X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
#     model.fit(X_train, y_train)
    
#     return model, vectorizer, label_encoder

with app.app_context():
    sintomas = cargar_datos_db()
    # model, vectorizer, label_encoder = entrenar_modelo(sintomas, recomendaciones)

    # Consultar modelo preentrenado de Machine Learning 
    def consultar_google_ai(sintomas):
        genai.configure(api_key=os.environ["GOOGLE_API_KEY"])
        
        generation_config = {
            "temperature": 0.15,
            "top_p": 0.95,
            "top_k": 40,
            "max_output_tokens": 800,
            "response_mime_type": "text/plain"
        }
        model = genai.GenerativeModel(
            model_name= "gemini-1.5-flash-002",
            generation_config=generation_config
        )
        
        chat_session = model.start_chat(history=[]) 

        # sintomas_form = ', '.join(sintomas)    

        prompt = f"""
        Un usuario dueño de mascota ha reportado los siguientes síntomas en su mascota: {sintomas}.
        Responde con una breve información sobre las posibles enfermedades que podría padecer y las recomendaciones que debe seguir. 
        No le indiques que se debe hacer un diagnóstico mejor, solo responde de manera informativa. 
        """            
        message = {
            "parts": [
                {"text": prompt}
            ]
        }
        
        try:
            response = chat_session.send_message(message)

            respuesta_final = response.text
            return respuesta_final
        except Exception as e:
            print(f"Error al consultar: {e}")
            return "Hubo un problema al generar la respuesta."
            
    # Funcion de recomendacion
    def obtener_recomendacion(sintomas):
         # Consulta de la base de datos
        try:
            # Aquí se ejecuta la consulta que trae los datos de la base de datos
            resultado = db.session.execute(
                text("""
                SELECT 
                    s.sintomas,
                    e.enfermedad,
                    r.recomendacion
                FROM 
                    relacion_tablas rt
                JOIN 
                    sintomas s ON rt.sintomas_id = s.id_sintomas
                JOIN 
                    enfermedades e ON rt.enfermedad_id = e.id_enfermedad
                JOIN 
                    recomendaciones r ON rt.recomendacion_id = r.id_recomendacion
                WHERE 
                    s.sintomas LIKE :sintomas
                """),
                {"sintomas": f"%{sintomas}%"})
            
            rows = resultado.fetchall()

            resultado_dict = [dict(row) for row in rows]

            return jsonify(resultado_dict)

        except Exception as e:
            return jsonify({"error": str(e)}), 500
       
@app.route('/api/chat', methods=['POST'])
def chatbot_respuesta():
    data = request.get_json()
    sintomas = data['sintomas']

    try:
        # Consultar base de datos
        respuesta_base = obtener_recomendacion(sintomas)

        # Consultar Gemini
        respuesta_gemini = consultar_google_ai(sintomas)

        # Si Gemini devuleve algo, retornar respuesta 
        if respuesta_gemini:
            return jsonify({ 'respuesta_mejorada': respuesta_gemini })
        # Si no hay resultados de ninguna fuente mensaje generico
        return jsonify({ 'respuesta_mejorada': respuesta_base })
    except Exception as e:
        print(f"Error al procesar: {e}.")
        return jsonify({'respuesta_mejorada': 'Hubo un problema al procesar la solicitud.'}), 500
     
@app.route('/', defaults={'path': ''})

@app.route('/<path:path>')
def serve_static(path):
     return render_template('index.html')

with app.app_context():
    db.create_all()
   
if __name__ == '__main__':
    app.run(debug=True)

