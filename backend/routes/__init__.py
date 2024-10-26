from .activity_routes import activity_bp
from .streak_routes import streak_bp


def register_routes(app):
    app.register_blueprint(activity_bp, url_prefix="/api/activities")
    app.register_blueprint(streak_bp, url_prefix="/api/streaks")
