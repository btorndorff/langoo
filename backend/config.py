import os
from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv()


class Config:
    MONGO_URI = os.getenv("MONGO_URI")

    @staticmethod
    def init_app(app):
        client = MongoClient(app.config["MONGO_URI"])
        app.db = client.langoo
