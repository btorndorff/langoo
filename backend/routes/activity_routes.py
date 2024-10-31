from flask import Blueprint, request, jsonify, current_app
from models.activity import Activity
from datetime import datetime
from utils.s3_utils import upload_file, AWS_S3_PREFIX

activity_bp = Blueprint("activities", __name__)


@activity_bp.route("/", methods=["GET"])
def get_activities():
    query = {"userId": request.args.get("userId")}
    if language := request.args.get("language"):
        query["language"] = language
    activities = current_app.db.activities.find(query)
    return jsonify([Activity.from_dict(activity).to_dict() for activity in activities])


@activity_bp.route("/", methods=["POST"])
def create_activity():
    title = request.form.get("title")
    language = request.form.get("language")
    category = request.form.get("category")
    user_id = request.form.get("userId")
    entry = request.form.get("entry")
    date = request.form.get("date")

    audio_url = None
    if "audioFile" in request.files:
        audio_file = request.files["audioFile"]
        if audio_file.filename != "":
            upload_file(audio_file, current_app.config["BUCKET"])
            audio_url = f"{AWS_S3_PREFIX}/{audio_file.filename}"

    activity = Activity(
        title=title,
        language=language,
        category=category,
        user_id=user_id,
        entry=entry,
        date=date,
        audio_url=audio_url,
    )

    current_app.db.activities.insert_one(activity.to_dict())
    return jsonify(activity.to_dict()), 201


@activity_bp.route("/<activity_id>", methods=["PUT"])
def update_activity(activity_id):
    title = request.form.get("title")
    language = request.form.get("language")
    category = request.form.get("category")
    user_id = request.form.get("userId")
    entry = request.form.get("entry")
    date = request.form.get("date")

    # First check if activity exists
    existing = current_app.db.activities.find_one({"_id": activity_id})
    if not existing:
        return jsonify({"error": "Activity not found"}), 404

    audio_url = existing.get("audioUrl")
    if "audioFile" in request.files:
        audio_file = request.files["audioFile"]
        if audio_file.filename != "":
            upload_file(audio_file, current_app.config["BUCKET"])
            audio_url = f"{AWS_S3_PREFIX}/{audio_file.filename}"

    # Create updated activity
    updated_data = {
        **existing,  # Keep existing data
        "title": title,
        "language": language,
        "category": category,
        "entry": entry,
        "date": date,
        "updatedAt": datetime.utcnow(),
        "audioUrl": audio_url,
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


@activity_bp.route("/<activity_id>/audio", methods=["DELETE"])
def delete_activity_audio(activity_id):
    # Get existing activity
    activity = current_app.db.activities.find_one({"_id": activity_id})
    if not activity:
        return jsonify({"error": "Activity not found"}), 404

    updated_data = {
        **activity,
        "updatedAt": datetime.utcnow(),
        "audioUrl": None,
    }

    # Save updated activity
    result = current_app.db.activities.update_one(
        {"_id": activity_id}, {"$set": updated_data}
    )

    if result.modified_count:
        return jsonify({"message": "Activity audio deleted"})
    return jsonify({"error": "Failed to delete activity audio"}), 500
