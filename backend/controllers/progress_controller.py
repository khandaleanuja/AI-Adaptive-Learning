from flask import request, jsonify
from firebase_config import db
from adaptive_ai.adaptive_engine import adaptive_learning
from datetime import datetime


def save_progress():

    try:

        data = request.json

        print("Received Data:", data)

        user_id = data["userId"]

        lesson_id = data["lessonId"]

        score = data["score"]

        percentage = int(data["percentage"])

        response_time = data["responseTime"]

        watch_count = data["videoWatchCount"]


        print("Score:", score)
        print("Percentage:", percentage)

        # ------------------------------------
        # GET CURRENT USER LEVEL
        # ------------------------------------

        user_doc = db.collection("users") \
            .document(user_id).get()
        
        if not user_doc.exists:
            return jsonify({
                "error": "User not found"
            }), 404

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

        elif current_level == "Level 3":
            current_level = 3

        else:
            current_level = 1

        # ------------------------------------
        # AI ADAPTATION
        # ------------------------------------

        adaptation = adaptive_learning(

            percentage,

            response_time,

            watch_count,

            current_level

        )

        # ------------------------------------
        # SAVE PROGRESS
        # ------------------------------------


        progress_data = {

            "userId": user_id,

            "lessonId": lesson_id,

            # original correct answers
            "score": score,

            # percentage
            "percentage": percentage,

            "responseTime": response_time,

            "videoWatchCount": watch_count,

            "adaptiveLevel":
                f"Level {adaptation['adaptiveLevel']}",

            "difficultyLevel":
                adaptation["difficultyLevel"],

            "contentMode":
                adaptation["contentMode"],

            "recommendation":
                adaptation["recommendation"],

            "completedAt":
                datetime.utcnow()

        }

        print("SAVING TO FIRESTORE")
        print(progress_data)

        progress_id = f"{user_id}_{lesson_id}"

        doc_ref = db.collection("progress").document(
            progress_id
        )

        doc_ref.set(progress_data)
        

        print("Firestore Saved")
        print("Document ID:", progress_id)

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
                "Progress Saved Successfully",

            "savedData":
                progress_data,

            "adaptation":
                adaptation

        }),200

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500
    

def get_progress(user_id):

    try:

        docs = db.collection(
            "progress"
        ).where(
            "userId",
            "==",
            user_id
        ).stream()

        progress_list = []

        for doc in docs:

            item = doc.to_dict()

            item["id"] = doc.id

            progress_list.append(item)

        return jsonify(progress_list)

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500