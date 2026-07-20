from flask import Blueprint, request
from config.db import db
from bson import ObjectId
from datetime import datetime

roles_bp = Blueprint("roles", __name__)


# ==========================
# GET ALL ROLES
# ==========================
@roles_bp.route("/api/roles", methods=["GET"])
def get_roles():

    roles = []

    for role in db.roles.find().sort("_id", -1):
        role["id"] = str(role["_id"])
        role["name"] = role.get("roleName", "")
        del role["_id"]
        roles.append(role)

    return roles


# ==========================
# CREATE ROLE
# ==========================
@roles_bp.route("/api/roles", methods=["POST"])
def create_role():

    data = request.json

    now = datetime.utcnow()

    data["createdDate"] = now
    data["updatedDate"] = now

    # Check duplicate role name
    existing_role_name = db.roles.find_one({
        "roleName": {
            "$regex": f"^{data['roleName']}$",
            "$options": "i"
        }
    })

    if existing_role_name:
        return {
            "message": "Role name already exists"
        }, 400

    # Check duplicate role code
    existing_role_code = db.roles.find_one({
        "roleCode": {
            "$regex": f"^{data['roleCode']}$",
            "$options": "i"
        }
    })

    if existing_role_code:
        return {
            "message": "Role code already exists"
        }, 400

    result = db.roles.insert_one(data)

    return {
        "message": "Role created successfully",
        "id": str(result.inserted_id)
    }, 201


# ==========================
# GET SINGLE ROLE
# ==========================
@roles_bp.route("/api/roles/<id>", methods=["GET"])
def get_role(id):

    role = db.roles.find_one({
        "_id": ObjectId(id)
    })

    if not role:
        return {
            "message": "Role not found"
        }, 404

    role["id"] = str(role["_id"])
    del role["_id"]

    return role


# ==========================
# UPDATE ROLE
# ==========================
@roles_bp.route("/api/roles/<id>", methods=["PUT"])
def update_role(id):

    data = request.json

    existing_role = db.roles.find_one({"_id": ObjectId(id)})

    if existing_role:
        data["createdDate"] = existing_role.get("createdDate")

    data["updatedDate"] = datetime.utcnow()

    # Check duplicate role name
    existing_role_name = db.roles.find_one({
        "_id": {"$ne": ObjectId(id)},
        "roleName": {
            "$regex": f"^{data['roleName']}$",
            "$options": "i"
        }
    })

    if existing_role_name:
        return {
            "message": "Role name already exists"
        }, 400

    # Check duplicate role code
    existing_role_code = db.roles.find_one({
        "_id": {"$ne": ObjectId(id)},
        "roleCode": {
            "$regex": f"^{data['roleCode']}$",
            "$options": "i"
        }
    })

    if existing_role_code:
        return {
            "message": "Role code already exists"
        }, 400

    db.roles.update_one(
        {"_id": ObjectId(id)},
        {
            "$set": data
        }
    )

    return {
        "message": "Role updated successfully"
    }


# ==========================
# DELETE ROLE
# ==========================
@roles_bp.route("/api/roles/<id>", methods=["DELETE"])
def delete_role(id):

    result = db.roles.delete_one({
        "_id": ObjectId(id)
    })

    if result.deleted_count == 0:
        return {
            "message": "Role not found"
        }, 404

    return {
        "message": "Role deleted successfully"
    }