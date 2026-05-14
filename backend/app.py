from flask import Flask
from flask_cors import CORS
from routes.lesson_routes import lesson_bp

app = Flask(__name__)

CORS(app)

app.register_blueprint(lesson_bp)

if __name__ == "__main__":
    app.run(debug=True)