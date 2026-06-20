from flask import Blueprint, request
from config.db import db
from bson import ObjectId

stories_bp = Blueprint("stories", __name__)


# GET all stories
@stories_bp.route("/api/stories", methods=["GET"])
def get_stories():

    stories = []

    for story in db.stories.find():
        story["id"] = str(story["_id"])
        del story["_id"]
        stories.append(story)

    return stories


# CREATE story
@stories_bp.route("/api/stories", methods=["POST"])
def create_story():

    data = request.json

    count = db.stories.count_documents({})

    data["key"] = f"ST-{count + 1}"

    result = db.stories.insert_one(data)

    return {
        "message": "Story created",
        "key": data["key"],
        "title": data["title"],
        "id": str(result.inserted_id)
    }


# DELETE story
@stories_bp.route("/api/stories/<id>", methods=["DELETE"])
def delete_story(id):

    db.stories.delete_one({
        "_id": ObjectId(id)
    })

    return {
        "message": "Story deleted"
    }