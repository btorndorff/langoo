import os
from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv()


class Config:
    MONGO_URI = os.getenv("MONGO_URI")
    LIVEKIT_API_KEY = os.getenv("LIVEKIT_API_KEY")
    LIVEKIT_API_SECRET = os.getenv("LIVEKIT_API_SECRET")
    LIVEKIT_WS_URL = os.getenv("LIVEKIT_WS_URL")

    @staticmethod
    def init_app(app):
        client = MongoClient(app.config["MONGO_URI"])
        app.db = client.langoo
