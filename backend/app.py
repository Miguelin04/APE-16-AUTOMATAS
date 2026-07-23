import os
import logging
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger(__name__)

MAX_SOURCE_LENGTH = 500

load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))

from services.nlp_service import NLPService

app = Flask(__name__)

cors_origin = os.getenv("CORS_ORIGIN")
if not cors_origin:
    raise ValueError("La variable de entorno CORS_ORIGIN debe estar configurada en el .env")

CORS(app, resources={r"/*": {"origins": cors_origin.split(",")}})

nlp_service = NLPService()

@app.route("/", methods=["GET"])
def read_root():
    return jsonify({"message": "API Analisis NLP - Practica 16 funcionando."})

@app.route("/api/nlp", methods=["POST"])
def analyze_nlp():
    try:
        data = request.get_json(silent=True)
        if not data or 'source' not in data:
            return jsonify({"detail": "El campo 'source' es requerido."}), 400

        source = str(data['source'])
        if len(source) > MAX_SOURCE_LENGTH:
            return jsonify({"detail": f"La entrada no puede superar {MAX_SOURCE_LENGTH} caracteres."}), 400

        report = nlp_service.analyze(source)
        return jsonify(report)
    except Exception as e:
        logger.error("Error en /api/nlp: %s", e, exc_info=True)
        return jsonify({"detail": "Error interno del servidor. Intente de nuevo."}), 500

if __name__ == "__main__":
    host = os.getenv("APP_HOST")
    port = os.getenv("APP_PORT")

    if not host or not port:
        raise ValueError("Las variables APP_HOST y APP_PORT deben estar configuradas en el .env")

    app.run(host=host, port=int(port))
