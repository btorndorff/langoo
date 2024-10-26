from flask import Blueprint, request, jsonify, current_app
from models.activity import Activity
from datetime import datetime


activity_bp = Blueprint("activities", __name__)


@activity_bp.route("/", methods=["GET"])
def get_activities():
    activities = current_app.db.activities.find({"userId": request.args.get("userId")})
    return jsonify([Activity.from_dict(activity).to_dict() for activity in activities])


@activity_bp.route("/", methods=["POST"])
def create_activity():
    data = request.json
    activity = Activity(
        title=data["title"],
        language=data["language"],
        category=data["category"],
        user_id=data["userId"],
        entry=data["entry"],
        date=data["date"],
    )
    current_app.db.activities.insert_one(activity.to_dict())
    return jsonify(activity.to_dict()), 201


@activity_bp.route("/<activity_id>", methods=["PUT"])
def update_activity(activity_id):
    data = request.json

    # First check if activity exists
    existing = current_app.db.activities.find_one({"_id": activity_id})
    if not existing:
        return jsonify({"error": "Activity not found"}), 404

    # Create updated activity
    updated_data = {
        **existing,  # Keep existing data
        "title": data.get("title", existing["title"]),
        "language": data.get("language", existing["language"]),
        "category": data.get("category", existing["category"]),
        "entry": data.get("entry", existing["entry"]),
        "date": data.get("date", existing["date"]),
        "updatedAt": datetime.utcnow(),
    }

    # Update in database
    result = current_app.db.activities.update_one(
        {"_id": activity_id}, {"$set": updated_data}
    )

    if result.modified_count:
        return jsonify(updated_data)

    return jsonify({"error": "Failed to update activity"}), 500


@activity_bp.route("/<activity_id>", methods=["GET"])
def get_activity(activity_id):
    activity = current_app.db.activities.find_one({"_id": activity_id})
    if activity:
        return jsonify(Activity.from_dict(activity).to_dict())
    return jsonify({"error": "Activity not found"}), 404


@activity_bp.route("/<activity_id>", methods=["DELETE"])
def delete_activity(activity_id):
    result = current_app.db.activities.delete_one({"_id": activity_id})
    if result.deleted_count:
        return jsonify({"message": "Activity deleted"})
    return jsonify({"error": "Activity not found"}), 404
