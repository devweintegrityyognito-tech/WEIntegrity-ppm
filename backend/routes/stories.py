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

    max_number = 0

    for story in db.stories.find():
        key = story.get("key", "")
        if key.startswith("ST-"):
            try:
                number = int(key.split("-")[1])
                if number > max_number:
                    max_number = number
            except:
                pass

    next_number = max_number + 1

    data["key"] = f"ST-{next_number}"

    result = db.stories.insert_one(data)

    return {
        "message": "Story created",
        "key": data["key"],
        "title": data["title"],
        "id": str(result.inserted_id)
    }, 201

# UPDATE story
@stories_bp.route("/api/stories/<id>", methods=["PUT"])
def update_story(id):

    data = request.json

    db.stories.update_one(
        {"_id": ObjectId(id)},
        {"$set": data}
    )

    return {
        "message": "Story updated"
    }

# DELETE story
@stories_bp.route("/api/stories/<id>", methods=["DELETE"])
def delete_story(id):

    result = db.stories.delete_one({
    "_id": ObjectId(id)
    })

    if result.deleted_count == 0:
        return {"message": "Story not found"}, 404
    return {
    "message": "Story deleted"
}