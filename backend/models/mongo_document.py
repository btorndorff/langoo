from bson import ObjectId
from datetime import datetime


class MongoDocument:
    def __init__(self):
        self._id = str(ObjectId())
        self.created_at = datetime.utcnow()
        self.updated_at = datetime.utcnow()

    @property
    def id(self):
        return self._id

    @id.setter
    def id(self, value):
        self._id = str(value)

    def to_dict(self):
        return {
            "_id": self._id,
            "createdAt": self.created_at,
            "updatedAt": self.updated_at,
        }

    @classmethod
    def from_dict(cls, data):
        instance = cls()
        instance._id = str(data.get("_id", ObjectId()))
        instance.created_at = data.get("createdAt", datetime.utcnow())
        instance.updated_at = data.get("updatedAt", datetime.utcnow())
        return instance

    def update(self):
        self.updated_at = datetime.utcnow()
