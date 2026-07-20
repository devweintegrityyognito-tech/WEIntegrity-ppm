from flask import Blueprint, request
from config.db import db
from bson import ObjectId
from datetime import datetime

user_group_memberships_bp = Blueprint(
    "user_group_memberships",
    __name__
)


# ==========================
# GET ALL MEMBERSHIPS
# ==========================
@user_group_memberships_bp.route(
    "/api/user-group-memberships",
    methods=["GET"]
)
def get_user_group_memberships():

    memberships = []

    for membership in db.user_group_memberships.find().sort("_id", -1):

        membership["id"] = str(membership["_id"])
        del membership["_id"]

        memberships.append(membership)

    return memberships


# ==========================
# CREATE MEMBERSHIP
# ==========================
@user_group_memberships_bp.route(
    "/api/user-group-memberships",
    methods=["POST"]
)
def create_user_group_membership():

    data = request.json

    now = datetime.utcnow()

    data["createdBy"] = "Admin User"
    data["createdDate"] = now
    data["updatedBy"] = "Admin User"
    data["updatedDate"] = now

    # Check duplicate User + Group
    existing = db.user_group_memberships.find_one({
        "userId": data["userId"],
        "groupId": data["groupId"]
    })

    if existing:
        return {
            "message": "User is already assigned to this group"
        }, 400

    # Only one Primary Group per User
    if data.get("membershipType") == "Primary":

        primary_group = db.user_group_memberships.find_one({
            "userId": data["userId"],
            "membershipType": "Primary"
        })

        if primary_group:
            return {
                "message": "User already has a primary group"
            }, 400
            
# ==========================
# Get User and Group Names
# ==========================
    user = db.users.find_one({"_id": ObjectId(data["userId"])})
    team = db.teams.find_one({"_id": ObjectId(data["groupId"])})

    if not user:
        return {"message": "User not found"}, 404

    if not team:
        return {"message": "Group not found"}, 404

    data["userName"] = (
            f'{user.get("firstName", "")} {user.get("lastName", "")}'.strip()
        )

    data["groupName"] = team.get("name", "")

    result = db.user_group_memberships.insert_one(data)

    return {
            "message": "Membership created successfully",
            "id": str(result.inserted_id)
        }, 201


# ==========================
# GET SINGLE MEMBERSHIP
# ==========================
@user_group_memberships_bp.route(
    "/api/user-group-memberships/<id>",
    methods=["GET"]
)
def get_user_group_membership(id):

    membership = db.user_group_memberships.find_one({
        "_id": ObjectId(id)
    })

    if not membership:
        return {
            "message": "Membership not found"
        }, 404

    membership["id"] = str(membership["_id"])
    del membership["_id"]

    return membership


# ==========================
# UPDATE MEMBERSHIP
# ==========================
@user_group_memberships_bp.route(
    "/api/user-group-memberships/<id>",
    methods=["PUT"]
)
def update_user_group_membership(id):

    data = request.json

    existing_membership = db.user_group_memberships.find_one({
        "_id": ObjectId(id)
    })

    if existing_membership:
        data["createdBy"] = existing_membership.get("createdBy")
        data["createdDate"] = existing_membership.get("createdDate")

    data["updatedBy"] = "Admin User"
    data["updatedDate"] = datetime.utcnow()

    # Duplicate User + Group
    duplicate = db.user_group_memberships.find_one({
        "_id": {"$ne": ObjectId(id)},
        "userId": data["userId"],
        "groupId": data["groupId"]
    })

    if duplicate:
        return {
            "message": "User is already assigned to this group"
        }, 400

    # Only one Primary Group
    if data.get("membershipType") == "Primary":

        primary_group = db.user_group_memberships.find_one({
            "_id": {"$ne": ObjectId(id)},
            "userId": data["userId"],
            "membershipType": "Primary"
        })

        if primary_group:
            return {
                "message": "User already has a primary group"
            }, 400
# ==========================
# Refresh User and Group Names
# ==========================

    user = db.users.find_one({
        "_id": ObjectId(data["userId"])
    })

    team = db.teams.find_one({
        "_id": ObjectId(data["groupId"])
    })

    if user:
        data["userName"] = (
            f'{user.get("firstName", "")} {user.get("lastName", "")}'
        ).strip()

    if team:
        data["groupName"] = team.get("name", "")
        db.user_group_memberships.update_one(
            {
                "_id": ObjectId(id)
            },
            {
                "$set": data
            }
        )

        return {
            "message": "Membership updated successfully"
        }


# ==========================
# DELETE MEMBERSHIP
# ==========================
@user_group_memberships_bp.route(
    "/api/user-group-memberships/<id>",
    methods=["DELETE"]
)
def delete_user_group_membership(id):

    result = db.user_group_memberships.delete_one({
        "_id": ObjectId(id)
    })

    if result.deleted_count == 0:
        return {
            "message": "Membership not found"
        }, 404

    return {
        "message": "Membership deleted successfully"
    }