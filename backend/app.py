from flask import Flask, jsonify, Response, request
from flask_cors import CORS
from config import Config
from routes import register_routes


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    Config.init_app(app)

    CORS(app)

    @app.before_request
    def handle_preflight():
        if request.method.lower() == "options":
            return Response()

    register_routes(app)

    @app.route("/", methods=["GET"])
    def home():
        return jsonify({"message": "Welcome to the Langoo API"})

    return app


app = create_app()

if __name__ == "__main__":
    app.run(debug=True)
