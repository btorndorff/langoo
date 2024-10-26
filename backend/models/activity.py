from datetime import datetime
from .mongo_document import MongoDocument


class Activity(MongoDocument):
    def __init__(self, title, language, category, user_id, entry, date):
        super().__init__()
        self.title = title
        self.language = language
        self.category = category
        self.user_id = user_id
        self.entry = entry
        self.date = date

    def to_dict(self):
        base_dict = super().to_dict()
        activity_dict = {
            "title": self.title,
            "language": self.language,
            "category": self.category,
            "userId": self.user_id,
            "entry": self.entry,
            "date": self.date,
        }
        return {**base_dict, **activity_dict}

    @classmethod
    def from_dict(cls, data):
        activity = cls(
            title=data.get("title"),
            language=data.get("language"),
            category=data.get("category"),
            user_id=data.get("userId"),
            entry=data.get("entry"),
            date=data.get("date"),
        )

        if "_id" in data:
            activity.id = data["_id"]
        if "createdAt" in data:
            activity.created_at = data["createdAt"]
        if "updatedAt" in data:
            activity.updated_at = data["updatedAt"]

        return activity
