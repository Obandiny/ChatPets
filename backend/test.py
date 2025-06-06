import os
from dotenv import load_dotenv

load_dotenv()

credencial = os.getenv('GOOGLE_APPLICATION_CREDENTIALS')

if credencial:
    print("Ruta de la credencial:")
    print(credencial)
else:
    print("❌ No se encontró la variable GOOGLE_APPLICATION_CREDENTIALS")    