from app import app, db
from models import * # Import all models

def create_database_tables():
    with app.app_context():
        db.create_all()
        print("Database tables created successfully using SQLAlchemy.")

if __name__ == '__main__':
    create_database_tables()
