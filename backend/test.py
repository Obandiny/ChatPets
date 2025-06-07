import os
import datetime
import jwt
import requests
from dotenv import load_dotenv
import google.generativeai as genai

from database import db
from app_flask import app
from Models.app_usuarios import Usuario
from Services.chat_service import procesar_diagnostico
from app_flask import create_app

load_dotenv()

def limpiar_respuesa(texto):
    lineas = texto.splitlines()
    resultado = []
    vistos = set()
    
    for linea in lineas:
        linea_limpia = linea.strip()
        if linea_limpia and linea_limpia not in vistos:
            resultado.append(linea_limpia)
            vistos.add(linea_limpia)
    return "\n".join(resultado)     

app = create_app()   

# print("\n============== VERIFICACIÓN .ENV ==============")
# print("SECRET_KEY:", os.getenv("SECRET_KEY"))
# print("JWT_SECRET_KEY:", os.getenv("JWT_SECRET_KEY"))
# print("GOOGLE_API_KEY:", os.getenv("GOOGLE_API_KEY"))
# print("GOOGLE_APPLICATION_CREDENTIALS:", os.getenv("GOOGLE_APPLICATION_CREDENTIALS"))

# print("\n============== PRUEBA DE CONEXIÓN A GEMINI ==============")
# try:
#     genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
#     model = genai.GenerativeModel('gemini-1.5-flash-002')
#     response = model.generate_content("¿Cómo cuidar un perro con diarrea?")
#     print("✅ Gemini respondió:\n", response.text)
# except Exception as e:
#     print("❌ Error al conectar con Gemini:", e)  

# print("\n============== PRUEBA DE CONEXIÓN A BASE DE DATOS ==============")
# with app.app_context():
#     try:
#         usuarios = Usuario.query.all()
#         print(f"✅ Base de datos conectada. Usuarios registrados: {len(usuarios)}")
#     except Exception as e:
#         print("❌ Error al conectar con la base de datos:", e)

# print("\n============== PRUEBA DE ENDPOINT FLASK ==============")
# try:
#     url = "http://localhost:5000/api/usuarios"  # Cambia este endpoint según tu ruta
#     res = requests.get(url)
#     if res.status_code == 200:
#         print("✅ Backend respondió correctamente con datos:")
#         print(res.json())
#     else:
#         print(f"❌ El backend respondió con código {res.status_code}")
# except Exception as e:
#     print("❌ Error al conectar al backend:", e)    

# print("\n============== PRUEBA DE GENERACIÓN DE JWT ==============")
# try:
#     payload = {
#         'id': 1,
#         'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1)
#     }
#     token = jwt.encode(payload, os.getenv("JWT_SECRET_KEY"), algorithm='HS256')
#     print("✅ Token generado:\n", token)
# except Exception as e:
#     print("❌ Error al generar JWT:", e)

with app.app_context():
    print("\n============== PRUEBA DE FUNCIÓN DE DIAGNÓSTICO ==============")
    try:
        usuario_mock = type("Usuario", (), {"id": 1})  # Mock de un usuario
        respuestas = ["Tiene fiebre", "No quiere comer", "Vomita espuma"]
        respuesta_ai = procesar_diagnostico(usuario_mock, respuestas)
        respuesta_limpia = limpiar_respuesa(respuesta_ai)
        print("✅ Diagnóstico generado:\n")
        print("🧠 RESPUESTA FORMATEADA 🧠")
        print("-" * 50)
        print(respuesta_limpia)
        print("-" * 50)
    except Exception as e:
        print("❌ Error al procesar el diagnóstico:", e)