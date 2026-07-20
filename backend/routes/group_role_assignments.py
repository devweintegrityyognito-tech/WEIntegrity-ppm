from flask import Blueprint, request
from config.db import db
from bson import ObjectId
from datetime import datetime

group_role_assignments_bp = Blueprint(
    "group_role_assignments",
    __name__
)


# ==========================
# GET ALL ASSIGNMENTS
# ==========================
@group_role_assignments_bp.route(
    "/api/group-role-assignments",
    methods=["GET"]
)
def get_group_role_assignments():

    assignments = []

    for assignment in db.group_role_assignments.find().sort("_id", -1):

        assignment["id"] = str(assignment["_id"])
        del assignment["_id"]

        assignments.append(assignment)

    return assignments


# ==========================
# CREATE ASSIGNMENT
# ==========================
@group_role_assignments_bp.route(
    "/api/group-role-assignments",
    methods=["POST"]
)
def create_group_role_assignment():

    data = request.json

    now = datetime.utcnow()

    data["createdBy"] = "Admin User"
    data["createdDate"] = now
    data["updatedBy"] = "Admin User"
    data["updatedDate"] = now

    duplicate = db.group_role_assignments.find_one({
        "groupId": data["groupId"],
        "roleId": data["roleId"]
    })

    if duplicate:
        return {
            "message": "Role is already assigned to this group"
        }, 400

    team = db.teams.find_one({
        "_id": ObjectId(data["groupId"])
    })

    role = db.roles.find_one({
        "_id": ObjectId(data["roleId"])
    })

    if not team:
        return {
            "message": "Group not found"
        }, 404

    if not role:
        return {
            "message": "Role not found"
        }, 404

    data["groupName"] = team.get("name", "")
    data["roleName"] = role.get("roleName", "")

    result = db.group_role_assignments.insert_one(data)

    return {
        "message": "Group role assigned successfully",
        "id": str(result.inserted_id)
    }, 201


# ==========================
# GET SINGLE ASSIGNMENT
# ==========================
@group_role_assignments_bp.route(
    "/api/group-role-assignments/<id>",
    methods=["GET"]
)
def get_group_role_assignment(id):

    assignment = db.group_role_assignments.find_one({
        "_id": ObjectId(id)
    })

    if not assignment:
        return {
            "message": "Assignment not found"
        }, 404

    assignment["id"] = str(assignment["_id"])
    del assignment["_id"]

    return assignment


# ==========================
# UPDATE ASSIGNMENT
# ==========================
@group_role_assignments_bp.route(
    "/api/group-role-assignments/<id>",
    methods=["PUT"]
)
def update_group_role_assignment(id):

    data = request.json

    existing = db.group_role_assignments.find_one({
        "_id": ObjectId(id)
    })

    if existing:
        data["createdBy"] = existing.get("createdBy")
        data["createdDate"] = existing.get("createdDate")

    data["updatedBy"] = "Admin User"
    data["updatedDate"] = datetime.utcnow()

    duplicate = db.group_role_assignments.find_one({
        "_id": {"$ne": ObjectId(id)},
        "groupId": data["groupId"],
        "roleId": data["roleId"]
    })

    if duplicate:
        return {
            "message": "Role is already assigned to this group"
        }, 400

    team = db.teams.find_one({
        "_id": ObjectId(data["groupId"])
    })

    role = db.roles.find_one({
        "_id": ObjectId(data["roleId"])
    })

    if team:
        data["groupName"] = team.get("name", "")

    if role:
        data["roleName"] = role.get("roleName", "")

    db.group_role_assignments.update_one(
        {
            "_id": ObjectId(id)
        },
        {
            "$set": data
        }
    )

    return {
        "message": "Assignment updated successfully"
    }


# ==========================
# DELETE ASSIGNMENT
# ==========================
@group_role_assignments_bp.route(
    "/api/group-role-assignments/<id>",
    methods=["DELETE"]
)
def delete_group_role_assignment(id):

    result = db.group_role_assignments.delete_one({
        "_id": ObjectId(id)
    })

    if result.deleted_count == 0:
        return {
            "message": "Assignment not found"
        }, 404

    return {
        "message": "Assignment deleted successfully"
    }