import requests
from flask import Blueprint, jsonify, request
import os
from utils import token_required

news_bp = Blueprint('noticias', __name__)

NEWS_API_KEY = os.environ.get("NEWS_API_KEY")

def es_relevante(articulo):
    texto = (
        (articulo.get("title") or "") + " " +
        (articulo.get("description") or "") + " " +
        (articulo.get("content") or "")
    ).lower()

    palabras_clave = [
        "mascota", "mascotas",
        "perro", "perros",
        "gato", "gatos",
        "veterinario", "veterinaria",
        "salud animal", "cuidado animal",
        "vacunas para mascotas", "alimento para perros", "alimento para gatos"
    ]

    return any(p in texto for p in palabras_clave)

@news_bp.route('/', methods=['GET'])
# @token_required
def obtener_noticias():
    try:
        url = "https://newsapi.org/v2/everything"
        temas = ["mascotas", "veterinaria", "perros"]

        noticias = []
        page = request.args.get("page", default=1, type=int)

        for tema in temas:
            params = {
                "q": tema,
                "language": "es",
                "page": page,
                "pageSize": 4,
                "apiKey": NEWS_API_KEY
            }

            response = requests.get(url, params=params)
            data = response.json()

            for articulo in data.get("articles", []):
                if es_relevante(articulo):
                    noticias.append({
                        "titulo": articulo.get("title", "Sin título"),
                        "descripcion": articulo.get("description", "Sin descripción"),
                        "imagen": articulo.get("urlToImage") or "",
                        "url": articulo.get("url"),
                        "fecha": articulo.get("publishedAt"),
                        "fuente": articulo.get("source", {}).get("name", "Desconocido")
                    })

        # Eliminar duplicados por URL
        noticias_unicas = {n["url"]: n for n in noticias}.values()

        return jsonify({"noticias": list(noticias_unicas)}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
