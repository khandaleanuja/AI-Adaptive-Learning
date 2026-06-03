from flask import Blueprint

from controllers.progress_controller import (
    save_progress,
    get_progress
)

progress_bp = Blueprint(
    "progress_bp",
    __name__
)

# SAVE PROGRESS
progress_bp.route(
    "/progress/save",
    methods=["POST"]
)

def save_progress_route():
    return save_progress()


# GET PROGRESS
progress_bp.route(
    "/progress/<user_id>",
    methods=["GET"]
)

def get_progress_route(user_id):
    return get_progress(user_id)