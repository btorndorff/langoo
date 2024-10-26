from flask import Blueprint, request, jsonify, current_app
from datetime import datetime, timedelta
import pytz

streak_bp = Blueprint("streaks", __name__)


@streak_bp.route("/current", methods=["GET"])
def get_current_streak():
    user_id = request.args.get("userId")
    if not user_id:
        return jsonify({"error": "userId is required"}), 400

    utc = pytz.UTC
    now = datetime.now(utc)

    # First convert string dates to proper MongoDB dates
    current_app.db.activities.update_many(
        {"date": {"$type": "string"}}, [{"$set": {"date": {"$toDate": "$date"}}}]
    )

    # Get distinct dates of activities, sorted in descending order
    pipeline = [
        {"$match": {"userId": user_id}},
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

    # Convert to set of date strings for easier lookup
    activity_dates = {date["_id"] for date in distinct_dates}

    # Get today and yesterday's date strings
    today = now.strftime("%Y-%m-%d")
    yesterday = (now - timedelta(days=1)).strftime("%Y-%m-%d")

    # If no activity today or yesterday, streak is 0
    if today not in activity_dates and yesterday not in activity_dates:
        return jsonify({"streak": 0})

    # Start counting from today or yesterday
    current_date = now if today in activity_dates else now - timedelta(days=1)
    streak = 0

    while True:
        date_str = current_date.strftime("%Y-%m-%d")
        if date_str not in activity_dates:
            break

        streak += 1
        current_date -= timedelta(days=1)

    return jsonify({"streak": streak})
