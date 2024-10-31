from flask import Blueprint, request, jsonify, current_app
from datetime import datetime, timedelta
import pytz

streak_bp = Blueprint("streaks", __name__)


@streak_bp.route("/current", methods=["GET"])
def get_current_streak():
    user_id = request.args.get("userId")
    language = request.args.get("language")
    if not user_id:
        return jsonify({"error": "userId is required"}), 400
    if not language:
        return jsonify({"error": "language is required"}), 400

    utc = pytz.UTC
    now = datetime.now(utc)

    current_app.db.activities.update_many(
        {"date": {"$type": "string"}}, [{"$set": {"date": {"$toDate": "$date"}}}]
    )

    pipeline = [
        {"$match": {"userId": user_id, "language": language}},
        {
            "$addFields": {
                "dateOnly": {
                    "$dateToString": {
                        "format": "%Y-%m-%d",
                        "date": {"$toDate": {"$ifNull": ["$date", now]}},
                    }
                }
            }
        },
        {"$group": {"_id": "$dateOnly"}},
        {"$sort": {"_id": -1}},
    ]

    distinct_dates = list(current_app.db.activities.aggregate(pipeline))

    if not distinct_dates:
        return jsonify({"streak": 0})

    activity_dates = {date["_id"] for date in distinct_dates}

    today = now.strftime("%Y-%m-%d")
    yesterday = (now - timedelta(days=1)).strftime("%Y-%m-%d")

    if today not in activity_dates and yesterday not in activity_dates:
        return jsonify({"streak": 0})

    current_date = now if today in activity_dates else now - timedelta(days=1)
    streak = 0

    while True:
        date_str = current_date.strftime("%Y-%m-%d")
        if date_str not in activity_dates:
            break

        streak += 1
        current_date -= timedelta(days=1)

    return jsonify({"streak": streak})
