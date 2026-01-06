from app import app, db
from models import * # Import all models to ensure they are registered with SQLAlchemy

def init_db():
    with app.app_context():
        db.create_all()
        print("Database initialized with schema (PostgreSQL).")

if __name__ == '__main__':
    init_db()