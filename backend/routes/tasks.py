from flask import Blueprint, request
from config.db import db
from bson import ObjectId

tasks_bp = Blueprint("tasks", __name__)


# GET all tasks
@tasks_bp.route("/api/tasks", methods=["GET"])
def get_tasks():

    tasks = []

    for task in db.tasks.find().sort("_id", -1):
        task["id"] = str(task["_id"])
        del task["_id"]
        tasks.append(task)

    return tasks

# GET SINGLE TASK
@tasks_bp.route("/api/tasks/<id>", methods=["GET"])
def get_task(id):

    task = db.tasks.find_one({
        "_id": ObjectId(id)
    })

    if not task:
        return {"message": "Task not found"}, 404

    task["_id"] = str(task["_id"])

    return task


# CREATE task
@tasks_bp.route("/api/tasks", methods=["POST"])
def create_task():

    data = request.json

    required = [
        "title",
        "description",
        "projectId",
        "storyId",
        "sprintId",
        "type",
        "assigneeId",
        "priority",
        "originalEstimate",
        "remainingHours"
    ]

    for field in required:
        if not data.get(field):
            return {
                "message": f"{field} is required"
            },400

    data["status"]="Todo"

    result=db.tasks.insert_one(data)

    return{
        "message":"Task created successfully",
        "id":str(result.inserted_id)
    },201


# DELETE task
@tasks_bp.route("/api/tasks/<id>", methods=["DELETE"])
def delete_task(id):

    db.tasks.delete_one({
        "_id": ObjectId(id)
    })

    return {
        "message": "Task deleted"
    }

# UPDATE task
@tasks_bp.route("/api/tasks/<id>", methods=["PUT"])
def update_task(id):

    data = request.json

    # Blocked validation
    if data.get("status") == "Blocked" and not data.get("blockedReason"):
        return {
            "message": "Blocked Reason is required"
        }, 400

    # Estimate validation
    if "originalEstimate" in data:
        if data["originalEstimate"] < 0:
            return {
                "message": "Original Estimate cannot be negative"
            }, 400

    if "remainingHours" in data:
        if data["remainingHours"] < 0:
            return {
                "message": "Remaining Hours cannot be negative"
            }, 400

    db.tasks.update_one(
        {"_id": ObjectId(id)},
        {"$set": data}
    )

    return {
        "message": "Task updated successfully"
    }