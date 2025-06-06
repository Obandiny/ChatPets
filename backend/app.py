from flask import Flask
from flask_cors import CORS
from config import Config
from database import db

from Routes.auth_routes import auth_bp
from Routes.chat_routes import chat_bp

app = Flask(__name__)
app.config.from_object(Config)

CORS(app, resources={r"/api/*": {"origins": "*"}})
db.init_app(app)

app.register_blueprint(auth_bp)
app.register_blueprint(chat_bp)

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)    