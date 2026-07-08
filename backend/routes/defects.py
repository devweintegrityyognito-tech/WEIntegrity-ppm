from flask import Blueprint, request
from config.db import db
from bson import ObjectId

defects_bp = Blueprint("defects", __name__)


# GET all defects
@defects_bp.route("/api/defects", methods=["GET"])
def get_defects():

    defects = []

    for defect in db.defects.find().sort("_id", -1):
        defect["id"] = str(defect["_id"])
        del defect["_id"]
        defects.append(defect)

    return defects


# GET SINGLE DEFECT
@defects_bp.route("/api/defects/<id>", methods=["GET"])
def get_defect(id):

    defect = db.defects.find_one({
        "_id": ObjectId(id)
    })

    if not defect:
        return {"message": "Defect not found"}, 404

    defect["_id"] = str(defect["_id"])

    return defect


# CREATE DEFECT
@defects_bp.route("/api/defects", methods=["POST"])
def create_defect():

    data = request.json

    result = db.defects.insert_one(data)

    return {
        "message": "Defect created",
        "id": str(result.inserted_id)
    }
    
# UPDATE DEFECT
@defects_bp.route("/api/defects/<id>", methods=["PUT"])
def update_defect(id):

    data = request.json

    db.defects.update_one(
        {"_id": ObjectId(id)},
        {"$set": data}
    )

    return {
        "message": "Defect updated"
    }


# DELETE DEFECT
@defects_bp.route("/api/defects/<id>", methods=["DELETE"])
def delete_defect(id):

    db.defects.delete_one({
        "_id": ObjectId(id)
    })

    return {
        "message": "Defect deleted"
    }