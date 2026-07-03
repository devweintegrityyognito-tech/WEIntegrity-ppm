from flask import Blueprint, request
from config.db import db
from bson import ObjectId

tasks_bp = Blueprint("tasks", __name__)


# GET all tasks
@tasks_bp.route("/api/tasks", methods=["GET"])
def get_tasks():

    tasks = []

    for task in db.tasks.find():
        task["_id"] = str(task["_id"])
        tasks.append(task)

    return tasks


# CREATE task
@tasks_bp.route("/api/tasks", methods=["POST"])
def create_task():

    data = request.json

    result = db.tasks.insert_one(data)

    return {
        "message": "Task created",
        "id": str(result.inserted_id)
    }


# DELETE task
@tasks_bp.route("/api/tasks/<id>", methods=["DELETE"])
def delete_task(id):

    db.tasks.delete_one({
        "_id": ObjectId(id)
    })

    return {
        "message": "Task deleted"
    }