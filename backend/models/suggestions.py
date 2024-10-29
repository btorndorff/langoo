from datetime import datetime
from .mongo_document import MongoDocument


class Suggestion(MongoDocument):
    def __init__(self, activity_id, textPart, suggestion, user_id, deprecated=False):
        super().__init__()
        self.activity_id = activity_id
        self.textPart = textPart
        self.suggestion = suggestion
        self.user_id = user_id
        self.deprecated = deprecated

    def to_dict(self):
        base_dict = super().to_dict()
        suggestion_dict = {
            "activityId": self.activity_id,
            "textPart": self.textPart,
            "suggestion": self.suggestion,
            "userId": self.user_id,
            "deprecated": self.deprecated,
        }
        return {**base_dict, **suggestion_dict}

    @classmethod
    def from_dict(cls, data):
        suggestion = cls(
            activity_id=data.get("activityId"),
            textPart=data.get("textPart"),
            suggestion=data.get("suggestion"),
            user_id=data.get("userId"),
            deprecated=data.get("deprecated", False),
        )

        if "_id" in data:
            suggestion.id = data["_id"]
        if "createdAt" in data:
            suggestion.created_at = data["createdAt"]
        if "updatedAt" in data:
            suggestion.updated_at = data["updatedAt"]

        return suggestion
