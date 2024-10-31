from flask import Blueprint, request, jsonify, current_app
from livekit import api
import logging

logger = logging.getLogger(__name__)
livekit_bp = Blueprint("livekit", __name__)


@livekit_bp.route("/token", methods=["POST"])
def create_token():
    try:
        data = request.json
        room_name = data.get("room")
        participant_name = data.get("username")

        logger.info(
            f"Token request received for room: {room_name}, participant: {participant_name}"
        )

        if not room_name or not participant_name:
            logger.error("Missing room name or participant name")
            return jsonify({"error": "Room and username are required"}), 400

        # Create access token
        logger.info("Creating access token...")
        at = api.AccessToken(
            api_key=current_app.config["LIVEKIT_API_KEY"],
            api_secret=current_app.config["LIVEKIT_API_SECRET"],
        )

        # Grant access to the room
        grant = api.VideoGrant(
            room_join=True,
            room=room_name,
            can_publish=True,
            can_subscribe=True,
        )

        at.add_grant(grant)
        at.name = participant_name
        at.identity = participant_name

        # Set longer TTL for AI agent
        if participant_name == "ai-agent":
            at.ttl = 24 * 3600  # 24 hours
            logger.info("Setting extended TTL for AI agent")
        else:
            at.ttl = 3600  # 1 hour

        token = at.to_jwt()
        logger.info(f"Token created successfully for {participant_name}")

        # Create room if it doesn't exist (for AI agent)
        if participant_name == "ai-agent":
            try:
                logger.info(f"Attempting to create room: {room_name}")
                livekit_api = api.LiveKitAPI(
                    current_app.config["LIVEKIT_WS_URL"],
                    current_app.config["LIVEKIT_API_KEY"],
                    current_app.config["LIVEKIT_API_SECRET"],
                )
                livekit_api.create_room(
                    name=room_name,
                    empty_timeout=30,  # 30 seconds
                    max_participants=2,  # AI + 1 user
                )
                logger.info(f"Room created successfully: {room_name}")
            except Exception as e:
                logger.warning(f"Room creation attempt: {str(e)}")
                logger.info("Room might already exist, continuing...")

        response_data = {"token": token, "ws_url": current_app.config["LIVEKIT_WS_URL"]}
        logger.info(
            f"Returning token and ws_url: {current_app.config['LIVEKIT_WS_URL']}"
        )
        return jsonify(response_data)

    except Exception as e:
        logger.error(f"Error in create_token: {str(e)}", exc_info=True)
        return jsonify({"error": str(e)}), 500


@livekit_bp.route("/rooms", methods=["GET"])
def list_rooms():
    try:
        logger.info("Fetching list of rooms...")
        livekit_api = api.LiveKitAPI(
            current_app.config["LIVEKIT_WS_URL"],
            current_app.config["LIVEKIT_API_KEY"],
            current_app.config["LIVEKIT_API_SECRET"],
        )

        rooms = livekit_api.list_rooms()
        logger.info(f"Found {len(rooms)} rooms")
        return jsonify({"rooms": [room.dict() for room in rooms]})

    except Exception as e:
        logger.error(f"Error in list_rooms: {str(e)}", exc_info=True)
        return jsonify({"error": str(e)}), 500
