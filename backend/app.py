from flask import Flask, jsonify, Response, request
from flask_cors import CORS
from config import Config
from routes import register_routes
import asyncio
import threading
import logging
from livekit.agents import (
    WorkerOptions,
    cli,
)
from utils.agent import entrypoint

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def run_agent():
    """Run the LiveKit agent in a separate thread"""
    try:
        logger.info("Starting LiveKit agent thread...")
        cli.run_app(
            WorkerOptions(
                entrypoint_fnc=entrypoint,
            )
        )
        logger.info("LiveKit agent thread started successfully")
    except Exception as e:
        logger.error(f"Error starting LiveKit agent: {str(e)}")


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    Config.init_app(app)

    logger.info("Initializing Flask app with config:")
    logger.info(f"LIVEKIT_WS_URL: {app.config['LIVEKIT_WS_URL']}")
    logger.info(
        f"LIVEKIT_API_KEY: {app.config['LIVEKIT_API_KEY'][:4]}..."
    )  # Only log first 4 chars

    CORS(app)

    @app.before_request
    def handle_preflight():
        if request.method.lower() == "options":
            return Response()

    register_routes(app)

    @app.route("/", methods=["GET"])
    def home():
        return jsonify({"message": "Welcome to the Langoo API"})

    # Start the agent in a separate thread
    logger.info("Creating agent thread...")
    agent_thread = threading.Thread(target=run_agent, daemon=True)
    agent_thread.start()
    logger.info("Agent thread created and started")

    return app


app = create_app()

if __name__ == "__main__":
    logger.info("Starting Flask application...")
    app.run(debug=True)
