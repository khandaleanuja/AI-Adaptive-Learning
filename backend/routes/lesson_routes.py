from flask import Blueprint
from controllers.lesson_controller import *

lesson_bp = Blueprint("lesson_bp", __name__)

lesson_bp.route("/lessons/all", methods=["GET"])(get_all_lessons)

lesson_bp.route("/lessons/<id>", methods=["GET"])(get_single_lesson)

lesson_bp.route("/lessons/category/<category>", methods=["GET"])(get_by_category)

lesson_bp.route("/lessons/search", methods=["GET"])(search_lessons)

lesson_bp.route("/lessons/add", methods=["POST"])(add_lesson)

lesson_bp.route("/lessons/update/<id>", methods=["PUT"])(update_lesson)

lesson_bp.route("/lessons/delete/<id>", methods=["DELETE"])(delete_lesson)