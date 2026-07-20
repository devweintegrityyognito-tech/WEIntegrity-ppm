from flask import Flask
from flask_cors import CORS
from config.db import db
from routes.projects import projects_bp
from routes.stories import stories_bp
from routes.tasks import tasks_bp
from routes.defects import defects_bp
from routes.auth import auth_bp
from routes.teams import teams_bp
from routes.users import users_bp
from routes.roles import roles_bp
from routes.user_group_memberships import user_group_memberships_bp
from routes.group_role_assignments import group_role_assignments_bp
from routes.permissions import permissions_bp

app = Flask(__name__)
CORS(app)

app.register_blueprint(projects_bp)
app.register_blueprint(stories_bp)
app.register_blueprint(tasks_bp)
app.register_blueprint(defects_bp)
app.register_blueprint(auth_bp)
app.register_blueprint(teams_bp)
app.register_blueprint(users_bp)
app.register_blueprint(roles_bp)
app.register_blueprint(user_group_memberships_bp)
app.register_blueprint(group_role_assignments_bp)
app.register_blueprint(permissions_bp)

@app.route("/")
def home():
    return {
        "message": "WEIntegrity Backend Running",
        "database": db.name
    }


@app.route("/add-project")
def add_project():

    project = {
        "key": "WEI",
        "name": "WEIntegrity PPM",
        "client": "Internal",
        "status": "On Track",
        "priority": "High",
        "progress": 75,
        "lead": "u-2",
        "members": ["u-4", "u-5"],
        "tags": ["React", "MongoDB"],
        "budget": 100000,
        "spent": 50000,
        "endDate": "2026-12-31"
    }

    result = db.projects.insert_one(project)

    return {
        "message": "Project Added",
        "id": str(result.inserted_id)
    }


if __name__ == "__main__":
    app.run(debug=True)