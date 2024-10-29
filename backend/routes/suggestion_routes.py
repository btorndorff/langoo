from flask import Blueprint, request, jsonify, current_app
from utils.openai import generate_learning_suggestions
from models.suggestions import Suggestion

suggestion_bp = Blueprint("suggestions", __name__)


@suggestion_bp.route("/", methods=["POST"])
def generate_suggestions():
    try:
        data = request.json

        activity_data = {
            "title": data.get("title"),
            "language": data.get("language"),
            "category": data.get("category"),
            "entry": data.get("entry"),
            "userId": data.get("userId"),
            "date": data.get("date"),
        }

        suggestions = generate_learning_suggestions(activity_data)

        if "activityId" in data and data["activityId"]:
            current_app.db.suggestions.update_many(
                {"activityId": data["activityId"]}, {"$set": {"deprecated": True}}
            )

            for suggestion in suggestions:
                suggestion = Suggestion(
                    activity_id=data["activityId"],
                    textPart=suggestion.textPart,
                    suggestion=suggestion.suggestion,
                    user_id=data["userId"],
                )
                current_app.db.suggestions.insert_one(suggestion.to_dict())

        serializable_suggestions = [
            {"textPart": suggestion.textPart, "suggestion": suggestion.suggestion}
            for suggestion in suggestions
        ]

        return jsonify({"suggestions": serializable_suggestions}), 200

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@suggestion_bp.route("/<activity_id>", methods=["GET"])
def get_suggestions_for_activity(activity_id):
    suggestions = list(current_app.db.suggestions.find({"activityId": activity_id}))
    if suggestions:
        return jsonify(
            {
                "suggestions": [
                    Suggestion.from_dict(suggestion).to_dict()
                    for suggestion in suggestions
                ]
            }
        )
    return jsonify({"suggestions": []}), 200  # Return empty array instead of error
