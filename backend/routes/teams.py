from flask import Blueprint, request
from config.db import db
from bson import ObjectId
from datetime import datetime

teams_bp = Blueprint("teams", __name__)


# GET all teams
@teams_bp.route("/api/teams", methods=["GET"])
def get_teams():

    teams = []

    for team in db.teams.find().sort("_id", -1):
        team["id"] = str(team["_id"])
        del team["_id"]
        teams.append(team)

    return teams


# CREATE team
@teams_bp.route("/api/teams", methods=["POST"])
def create_team():

    data = request.json
    data["createdBy"] = "Admin User"
    data["createdDate"] = datetime.utcnow()

    data["updatedBy"] = "Admin User"
    data["updatedDate"] = datetime.utcnow()
    
    # Check duplicate group name
    existing = db.teams.find_one({
        "name": {
            "$regex": f"^{data['name']}$",
            "$options": "i"
        }
    })

    if existing:
        return {
            "message": "Group name already exists"
        }, 400

    max_number = 0

    for team in db.teams.find():
        code = team.get("code", "")

        if code.startswith("TM"):
            try:
                number = int(code.replace("TM", ""))

                if number > max_number:
                    max_number = number

            except:
                pass

    next_number = max_number + 1

    data["code"] = f"TM{next_number:03d}"

    data.setdefault("members", 0)
    data.setdefault("projects", 0)
    data.setdefault("stories", 0)

    result = db.teams.insert_one(data)

    return {
        "message": "Team created",
        "code": data["code"],
        "name": data["name"],
        "id": str(result.inserted_id)
    }, 201


# GET single team
@teams_bp.route("/api/teams/<id>", methods=["GET"])
def get_team(id):

    team = db.teams.find_one({"_id": ObjectId(id)})

    if not team:
        return {"message": "Team not found"}, 404

    team["id"] = str(team["_id"])
    del team["_id"]

    return team


# UPDATE team
@teams_bp.route("/api/teams/<id>", methods=["PUT"])
def update_team(id):

    data = request.json
    data["updatedBy"] = "Admin User"
    data["updatedDate"] = datetime.utcnow()

    # Check duplicate group name (ignore current group)
    existing = db.teams.find_one({
        "_id": {"$ne": ObjectId(id)},
        "name": {
            "$regex": f"^{data['name']}$",
            "$options": "i"
        }
    })

    if existing:
        return {
            "message": "Group name already exists"
        }, 400

    db.teams.update_one(
        {"_id": ObjectId(id)},
        {"$set": data}
    )

    return {
        "message": "Team updated"
    }


# DELETE team
@teams_bp.route("/api/teams/<id>", methods=["DELETE"])
def delete_team(id):

    result = db.teams.delete_one({
        "_id": ObjectId(id)
    })

    if result.deleted_count == 0:
        return {"message": "Team not found"}, 404

    return {
        "message": "Team deleted"
    }