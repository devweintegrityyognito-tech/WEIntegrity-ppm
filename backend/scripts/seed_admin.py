import sys
import os

# Allow importing from backend/config
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from config.db import db

admin = {
    "name": "Administrator",
    "email": "admin@weintegrity.com",
    "password": "Admin@123",
    "role": "Admin",
    "isActive": True
}

existing_admin = db.users.find_one({
    "email": admin["email"]
})

if existing_admin:
    print("Admin already exists.")
else:
    db.users.insert_one(admin)
    print("Admin created successfully.")