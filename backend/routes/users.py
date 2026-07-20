from flask import Blueprint, request
from config.db import db
from bson import ObjectId
from datetime import datetime

users_bp = Blueprint("users", __name__)


# ==========================
# GET ALL USERS
# ==========================
@users_bp.route("/api/users", methods=["GET"])
def get_users():

    users = []

    for user in db.users.find().sort("_id", -1):
        user["id"] = str(user["_id"])
        del user["_id"]

        users.append(user)

    return users


# ==========================
# CREATE USER
# ==========================
@users_bp.route("/api/users", methods=["POST"])
def create_user():

    data = request.json

    now = datetime.utcnow()

    data["createdDate"] = now
    data["updatedDate"] = now    

    # Check duplicate username
    existing_username = db.users.find_one({
        "username": {
            "$regex": f"^{data['username']}$",
            "$options": "i"
        }
    })

    if existing_username:
        return {
            "message": "Username already exists"
        }, 400

    # Check duplicate email
    existing_email = db.users.find_one({
        "email": {
            "$regex": f"^{data['email']}$",
            "$options": "i"
        }
    })

    if existing_email:
        return {
            "message": "Email already exists"
        }, 400

    result = db.users.insert_one(data)

    return {
        "message": "User created successfully",
        "id": str(result.inserted_id)
    }, 201
    
    # ==========================
# GET SINGLE USER
# ==========================
@users_bp.route("/api/users/<id>", methods=["GET"])
def get_user(id):

    user = db.users.find_one({
        "_id": ObjectId(id)
    })

    if not user:
        return {
            "message": "User not found"
        }, 404

    user["id"] = str(user["_id"])
    del user["_id"]

    return user


# ==========================
# UPDATE USER
# ==========================
@users_bp.route("/api/users/<id>", methods=["PUT"])
def update_user(id):

    data = request.json

    # Preserve original created date
    existing_user = db.users.find_one({"_id": ObjectId(id)})

    if existing_user:
        data["createdDate"] = existing_user.get("createdDate")

        data["updatedDate"] = datetime.utcnow()

    # Check duplicate username
    existing_username = db.users.find_one({
        "_id": {"$ne": ObjectId(id)},
        "username": {
            "$regex": f"^{data['username']}$",
            "$options": "i"
        }
    })

    if existing_username:
        return {
            "message": "Username already exists"
        }, 400

    # Check duplicate email
    existing_email = db.users.find_one({
        "_id": {"$ne": ObjectId(id)},
        "email": {
            "$regex": f"^{data['email']}$",
            "$options": "i"
        }
    })

    if existing_email:
        return {
            "message": "Email already exists"
        }, 400

    db.users.update_one(
        {"_id": ObjectId(id)},
        {
            "$set": data
        }
    )

    return {
        "message": "User updated successfully"
    }
    
    # ==========================
# DELETE USER
# ==========================
@users_bp.route("/api/users/<id>", methods=["DELETE"])
def delete_user(id):

    result = db.users.delete_one({
        "_id": ObjectId(id)
    })

    if result.deleted_count == 0:
        return {
            "message": "User not found"
        }, 404

    return {
        "message": "User deleted successfully"
    }