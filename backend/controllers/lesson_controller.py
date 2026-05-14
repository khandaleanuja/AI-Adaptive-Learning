from flask import jsonify, request
from firebase_config import db


# GET ALL LESSONS
def get_all_lessons():

    lessons = []

    docs = db.collection("lessons").stream()

    for doc in docs:

        lesson = doc.to_dict()
        lesson["id"] = doc.id

        lessons.append(lesson)

    return jsonify(lessons)


# GET SINGLE LESSON
def get_single_lesson(id):

    doc = db.collection("lessons").document(id).get()

    if doc.exists:

        lesson = doc.to_dict()
        lesson["id"] = doc.id

        return jsonify(lesson)

    return jsonify({
        "message": "Lesson not found"
    }), 404


# CATEGORY FILTER
def get_by_category(category):

    lessons = []

    docs = db.collection("lessons") \
        .where("category", "==", category) \
        .stream()

    for doc in docs:

        lesson = doc.to_dict()
        lesson["id"] = doc.id

        lessons.append(lesson)

    return jsonify(lessons)


# SEARCH LESSONS
def search_lessons():

    query = request.args.get("q", "").lower()

    docs = db.collection("lessons").stream()

    results = []

    for doc in docs:

        lesson = doc.to_dict()

        title = lesson.get("title", "").lower()

        if query in title:

            lesson["id"] = doc.id

            results.append(lesson)

    return jsonify(results)


# ADD LESSON
def add_lesson():

    data = request.json

    lesson_ref = db.collection("lessons").add(data)

    return jsonify({
        "message": "Lesson added"
    })


# UPDATE LESSON
def update_lesson(id):

    data = request.json

    db.collection("lessons").document(id).update(data)

    return jsonify({
        "message": "Lesson updated"
    })


# DELETE LESSON
def delete_lesson(id):

    db.collection("lessons").document(id).delete()

    return jsonify({
        "message": "Lesson deleted"
    })