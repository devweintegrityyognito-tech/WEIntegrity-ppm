from flask import Blueprint, request
from config.db import db
from bson import ObjectId

projects_bp = Blueprint("projects", __name__)

@projects_bp.route("/api/projects", methods=["GET"])
def get_projects():

    projects = []

    for project in db.projects.find():
        projects.append({
            "_id": str(project["_id"]),
            "name": project["name"],
            "status": project["status"]
        })

    return projects


@projects_bp.route("/api/projects", methods=["POST"])
def create_project():

    data = request.json

    project = {
    "key": "WEI",
    "name": data["name"],
    "client": "Internal",
    "status": data["status"],
    "priority": "Medium",
    "progress": 0,
    "lead": "u-2",
    "members": [],
    "tags": [],
    "budget": 0,
    "spent": 0,
    "endDate": "2026-12-31"
}

    result = db.projects.insert_one(project)

    return {
        "message": "Project Created",
        "id": str(result.inserted_id)
    }