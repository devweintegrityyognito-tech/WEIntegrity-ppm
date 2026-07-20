from flask import Blueprint, request
from config.db import db
from bson import ObjectId
from datetime import datetime

permissions_bp = Blueprint("permissions", __name__)


# ==========================
# GET ALL PERMISSIONS
# ==========================
@permissions_bp.route("/api/permissions", methods=["GET"])
def get_permissions():

    permissions = []

    for permission in db.permissions.find().sort("_id", -1):
        permission["id"] = str(permission["_id"])
        permission["name"] = permission.get("permissionName", "")
        del permission["_id"]
        permissions.append(permission)

    return permissions


# ==========================
# CREATE PERMISSION
# ==========================
@permissions_bp.route("/api/permissions", methods=["POST"])
def create_permission():

    data = request.json

    now = datetime.utcnow()

    data["createdDate"] = now
    data["updatedDate"] = now

    # Check duplicate permission name
    existing_permission_name = db.permissions.find_one({
        "permissionName": {
            "$regex": f"^{data['permissionName']}$",
            "$options": "i"
        }
    })

    if existing_permission_name:
        return {
            "message": "Permission name already exists"
        }, 400

    # Check duplicate permission code
    existing_permission_code = db.permissions.find_one({
        "permissionCode": {
            "$regex": f"^{data['permissionCode']}$",
            "$options": "i"
        }
    })

    if existing_permission_code:
        return {
            "message": "Permission code already exists"
        }, 400

    result = db.permissions.insert_one(data)

    return {
        "message": "Permission created successfully",
        "id": str(result.inserted_id)
    }, 201


# ==========================
# GET SINGLE PERMISSION
# ==========================
@permissions_bp.route("/api/permissions/<id>", methods=["GET"])
def get_permission(id):

    permission = db.permissions.find_one({
        "_id": ObjectId(id)
    })

    if not permission:
        return {
            "message": "Permission not found"
        }, 404

    permission["id"] = str(permission["_id"])
    del permission["_id"]

    return permission


# ==========================
# UPDATE PERMISSION
# ==========================
@permissions_bp.route("/api/permissions/<id>", methods=["PUT"])
def update_permission(id):

    data = request.json

    existing_permission = db.permissions.find_one({"_id": ObjectId(id)})

    if existing_permission:
        data["createdDate"] = existing_permission.get("createdDate")

    data["updatedDate"] = datetime.utcnow()

    # Check duplicate permission name
    existing_permission_name = db.permissions.find_one({
        "_id": {"$ne": ObjectId(id)},
        "permissionName": {
            "$regex": f"^{data['permissionName']}$",
            "$options": "i"
        }
    })

    if existing_permission_name:
        return {
            "message": "Permission name already exists"
        }, 400

    # Check duplicate permission code
    existing_permission_code = db.permissions.find_one({
        "_id": {"$ne": ObjectId(id)},
        "permissionCode": {
            "$regex": f"^{data['permissionCode']}$",
            "$options": "i"
        }
    })

    if existing_permission_code:
        return {
            "message": "Permission code already exists"
        }, 400

    db.permissions.update_one(
        {"_id": ObjectId(id)},
        {
            "$set": data
        }
    )

    return {
        "message": "Permission updated successfully"
    }


# ==========================
# DELETE PERMISSION
# ==========================
@permissions_bp.route("/api/permissions/<id>", methods=["DELETE"])
def delete_permission(id):

    result = db.permissions.delete_one({
        "_id": ObjectId(id)
    })

    if result.deleted_count == 0:
        return {
            "message": "Permission not found"
        }, 404

    return {
        "message": "Permission deleted successfully"
    }