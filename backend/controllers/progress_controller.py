from flask import request, jsonify
from firebase_config import db
from adaptive_ai.adaptive_engine import adaptive_learning
from datetime import datetime


def save_progress():

    try:

        data = request.json

        user_id = data["userId"]

        lesson_id = data["lessonId"]

        score = data["score"]

        response_time = data["responseTime"]

        watch_count = data["videoWatchCount"]

        # ------------------------------------
        # GET CURRENT USER LEVEL
        # ------------------------------------

        user_doc = db.collection("users") \
            .document(user_id).get()

        user_data = user_doc.to_dict()

        current_level = user_data.get(
            "adaptiveLevel",
            1
        )

        # CONVERT LEVEL STRING TO NUMBER

        if current_level == "Level 1":
            current_level = 1

        elif current_level == "Level 2":
            current_level = 2

        else:
            current_level = 3

        # ------------------------------------
        # AI ADAPTATION
        # ------------------------------------

        adaptation = adaptive_learning(

            score,

            response_time,

            watch_count,

            current_level

        )

        # ------------------------------------
        # SAVE PROGRESS
        # ------------------------------------

        db.collection("progress").add({

            "userId": user_id,

            "lessonId": lesson_id,

            "score": score,

            "responseTime": response_time,

            "videoWatchCount": watch_count,

            "adaptiveLevel":
                f"Level {adaptation['adaptiveLevel']}",

            "difficultyLevel":
                adaptation["difficultyLevel"],

            "contentMode":
                adaptation["contentMode"],

            "completedAt":
                datetime.utcnow()

        })

        # ------------------------------------
        # UPDATE USER LEVEL
        # ------------------------------------

        db.collection("users") \
            .document(user_id) \
            .update({

                "adaptiveLevel":
                    f"Level {adaptation['adaptiveLevel']}"

            })

        return jsonify({

            "message":
                "Progress Saved",

            "adaptation":
                adaptation

        })

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500