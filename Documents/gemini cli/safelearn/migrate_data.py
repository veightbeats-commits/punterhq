import sqlite3
import os
import json
from app import app, db
import models
from models import *
from datetime import datetime
from werkzeug.security import generate_password_hash

# SQLite database file path
SQLITE_DATABASE = 'safelearn.db'

# --- Helper to get table names from SQLite ---
def get_sqlite_table_names(sqlite_conn):
    cursor = sqlite_conn.cursor()
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
    return [row[0] for row in cursor.fetchall()]

# --- Main migration function ---
def migrate_data():
    with app.app_context():
        # Ensure the PostgreSQL tables are created (should have been done by init_db.py)
        db.create_all()

        # Clear existing data in PostgreSQL tables to ensure a clean migration
        print("Clearing existing data in PostgreSQL tables...")
        # Delete in reverse order of dependencies where applicable
        db.session.query(Comment).delete()
        db.session.query(ForumAnswer).delete()
        db.session.query(ForumQuestion).delete()
        db.session.query(UserFavorite).delete()
        db.session.query(Review).delete()
        db.session.query(Post).delete()
        db.session.query(Message).delete()
        db.session.query(UserMindResult).delete()
        db.session.query(CareerPath).delete()
        db.session.query(Bursary).delete()
        db.session.query(Learnership).delete()
        db.session.query(University).delete()
        db.session.query(Seta).delete()
        db.session.query(TvetCollege).delete()
        db.session.query(Accommodation).delete()
        db.session.query(AccreditedSchool).delete()
        db.session.query(SkillsProgramme).delete()
        db.session.query(Qualification).delete()
        db.session.query(User).delete() # User is often parent to many others
        db.session.commit()
        print("Existing data cleared.")

        sqlite_conn = None
        try:
            sqlite_conn = sqlite3.connect(SQLITE_DATABASE)
            sqlite_conn.row_factory = sqlite3.Row # To access columns by name

            table_names = get_sqlite_table_names(sqlite_conn)
            
            # Exclude tables that are automatically managed or not needed for direct migration
            # 'sqlite_sequence' is SQLite internal
            tables_to_migrate = [
                'users', 'qualifications', 'skills_programmes', 'accredited_schools',
                'accommodations', 'tvet_colleges', 'setas', 'universities',
                'learnerships', 'reviews', 'career_paths', 'bursaries',
                'user_favorites', 'forum_questions', 'forum_answers', 'posts',
                'comments', 'messages', 'user_mind_results'
            ]
            
            # Adjust table_names to only include those in models.py
            # And iterate in an order that respects foreign key dependencies (e.g., users before reviews)
            ordered_tables = [
                'users', 
                'qualifications', 
                'skills_programmes',
                'accredited_schools',
                'accommodations',
                'tvet_colleges',
                'setas',
                'universities',
                'learnerships',
                'bursaries',
                'career_paths', # Depends on qualifications
                'user_mind_results', # Depends on users
                'messages', # Depends on users
                'posts',
                'reviews', # Depends on users
                'forum_questions', # Depends on users
                'forum_answers', # Depends on users, forum_questions
                'user_favorites', # Depends on users
                'comments' # Depends on users, posts, comments (parent_id)
            ]

            print(f"Starting data migration from {SQLITE_DATABASE} to PostgreSQL...")

            for table_name in ordered_tables:
                if table_name not in table_names:
                    print(f"Skipping table '{table_name}' as it does not exist in SQLite database.")
                    continue
                    
                print(f"Migrating data for table: {table_name}")
                cursor = sqlite_conn.execute(f"SELECT * FROM {table_name}")
                rows = cursor.fetchall()

                if not rows:
                    print(f"No data in table '{table_name}'. Skipping.")
                    continue

                model_class = None
                try:
                    # Dynamically get the model class from models.py
                    class_name_parts = table_name.split('_')
                    # Heuristic to singularize the last part, if it's a common plural
                    if class_name_parts[-1].endswith('s') and class_name_parts[-1] not in ['users', 'posts', 'messages', 'bursaries', 'universities', 'skills']: # Added exceptions for actual table names that are plural but map to plural models, or don't simply remove 's'
                         if class_name_parts[-1] == 'programmes': # Special case for programmes
                             pass # Keep as is, maps to SkillsProgramme
                         elif class_name_parts[-1] == 'classes':
                             class_name_parts[-1] = class_name_parts[-1][:-2] + 's' # 'classes' -> 'class' (but this doesn't exist)
                         else:
                             class_name_parts[-1] = class_name_parts[-1][:-1] # Remove 's'
                    
                    # Special case for "users" table name -> "User" model
                    if table_name == 'users':
                        class_name_str = 'User'
                    # Special case for "posts" table name -> "Post" model
                    elif table_name == 'posts':
                        class_name_str = 'Post'
                    # Special case for "messages" table name -> "Message" model
                    elif table_name == 'messages':
                        class_name_str = 'Message'
                    # Special case for "bursaries" table name -> "Bursary" model
                    elif table_name == 'bursaries':
                        class_name_str = 'Bursary'
                    # Special case for "universities" table name -> "University" model
                    elif table_name == 'universities':
                        class_name_str = 'University'
                    # Special case for "skills_programmes" table name -> "SkillsProgramme" model
                    elif table_name == 'skills_programmes':
                        class_name_str = 'SkillsProgramme'
                    # Default for other cases
                    else:
                        class_name_str = "".join([part.title() for part in class_name_parts])

                    model_class = getattr(models, class_name_str)
                except AttributeError:
                    print(f"Warning: No SQLAlchemy model found for table '{table_name}'. Skipping.")
                    continue
                
                # Special handling for tables with relationships or specific data types
                if table_name == 'users':
                    for row in rows:
                        existing_user = User.query.filter_by(username=row['username']).first()
                        email_to_use = row['email'] if row['email'] else f"no_email_{row['id']}@example.com"
                        created_at_dt = datetime.strptime(row['created_at'], '%Y-%m-%d %H:%M:%S') if row['created_at'] else None

                        if existing_user:
                            # Update existing user
                            existing_user.email = email_to_use
                            existing_user.is_admin = bool(row['is_admin'])
                            existing_user.password_hash = row['password_hash']
                            existing_user.created_at = created_at_dt
                            db.session.add(existing_user) # Re-add for update tracking
                        else:
                            # Create new user
                            new_user = User(
                                id=row['id'], # Attempt to preserve IDs
                                username=row['username'],
                                email=email_to_use,
                                is_admin=bool(row['is_admin']),
                                created_at=created_at_dt
                            )
                            new_user.password_hash = row['password_hash'] 
                            db.session.add(new_user)

                elif table_name == 'messages':
                    for row in rows:
                        # Handle potential foreign key issue if sender_id/recipient_id doesn't exist yet
                        sender_id = row['sender_id'] if User.query.get(row['sender_id']) else None
                        recipient_id = row['recipient_id'] if User.query.get(row['recipient_id']) else None

                        created_at_dt = None
                        if row['created_at']:
                            try:
                                created_at_dt = datetime.strptime(str(row['created_at']), '%Y-%m-%d %H:%M:%S.%f')
                            except ValueError:
                                try:
                                    created_at_dt = datetime.strptime(str(row['created_at']), '%Y-%m-%d %H:%M:%S')
                                except ValueError:
                                    try: # Fallback for date-only formats
                                        created_at_dt = datetime.strptime(str(row['created_at']), '%Y-%m-%d')
                                    except ValueError:
                                        print(f"Warning: Could not parse created_at '{row['created_at']}' for messages. Setting to None.")
                                        created_at_dt = None

                        message = Message(
                            id=row['id'],
                            sender_id=sender_id,
                            recipient_id=recipient_id,
                            sender_name=row['sender_name'],
                            sender_email=row['sender_email'],
                            subject=row['subject'],
                            message=row['message'],
                            is_from_contact_form=bool(row['is_from_contact_form']),
                            is_read=bool(row['is_read']),
                            created_at=created_at_dt
                        )
                        db.session.add(message)
                
                elif table_name == 'reviews':
                    for row in rows:
                        # Ensure user_id exists
                        if not User.query.get(row['user_id']):
                            print(f"Warning: Skipping review {row['id']} due to non-existent user_id {row['user_id']}")
                            continue
                        review = Review(
                            id=row['id'],
                            user_id=row['user_id'],
                            item_id=row['item_id'],
                            item_type=row['item_type'],
                            rating=row['rating'],
                            comment=row['comment'],
                            created_at=row['created_at']
                        )
                        db.session.add(review)

                elif table_name == 'user_favorites':
                    for row in rows:
                        if not User.query.get(row['user_id']):
                            print(f"Warning: Skipping user_favorite {row['id']} due to non-existent user_id {row['user_id']}")
                            continue
                        
                        created_at_dt = None
                        if row['created_at']:
                            try:
                                created_at_dt = datetime.strptime(str(row['created_at']), '%Y-%m-%d %H:%M:%S.%f')
                            except ValueError:
                                try:
                                    created_at_dt = datetime.strptime(str(row['created_at']), '%Y-%m-%d %H:%M:%S')
                                except ValueError:
                                    try: # Fallback for date-only formats
                                        created_at_dt = datetime.strptime(str(row['created_at']), '%Y-%m-%d')
                                    except ValueError:
                                        print(f"Warning: Could not parse created_at '{row['created_at']}' for user_favorites. Setting to None.")
                                        created_at_dt = None

                        favorite = UserFavorite(
                            id=row['id'],
                            user_id=row['user_id'],
                            item_id=row['item_id'],
                            item_type=row['item_type'],
                            created_at=created_at_dt # Use the converted datetime object
                        )
                        db.session.add(favorite)

                elif table_name == 'forum_questions':
                    for row in rows:
                        if not User.query.get(row['user_id']):
                            print(f"Warning: Skipping forum_question {row['id']} due to non-existent user_id {row['user_id']}")
                            continue
                        question = ForumQuestion(
                            id=row['id'],
                            user_id=row['user_id'],
                            provider_id=row['provider_id'],
                            title=row['title'],
                            body=row['body'],
                            created_at=row['created_at']
                        )
                        db.session.add(question)

                elif table_name == 'forum_answers':
                    for row in rows:
                        if not User.query.get(row['user_id']):
                            print(f"Warning: Skipping forum_answer {row['id']} due to non-existent user_id {row['user_id']}")
                            continue
                        if not ForumQuestion.query.get(row['question_id']):
                             print(f"Warning: Skipping forum_answer {row['id']} due to non-existent question_id {row['question_id']}")
                             continue
                        answer = ForumAnswer(
                            id=row['id'],
                            question_id=row['question_id'],
                            user_id=row['user_id'],
                            body=row['body'],
                            is_provider_answer=bool(row['is_provider_answer']),
                            created_at=row['created_at']
                        )
                        db.session.add(answer)
                
                elif table_name == 'posts':
                    for row in rows:
                        created_at_dt = None
                        if row['created_at']:
                            try:
                                created_at_dt = datetime.strptime(str(row['created_at']), '%Y-%m-%d %H:%M:%S.%f')
                            except ValueError:
                                try:
                                    created_at_dt = datetime.strptime(str(row['created_at']), '%Y-%m-%d %H:%M:%S')
                                except ValueError:
                                    try: # Fallback for date-only formats
                                        created_at_dt = datetime.strptime(str(row['created_at']), '%Y-%m-%d')
                                    except ValueError:
                                        print(f"Warning: Could not parse created_at '{row['created_at']}' for posts. Setting to None.")
                                        created_at_dt = None

                        post = Post(
                            id=row['id'],
                            title=row['title'],
                            content=row['content'],
                            image_path=row['image_path'],
                            likes=row['likes'],
                            created_at=created_at_dt # Use the converted datetime object
                        )
                        db.session.add(post)

                elif table_name == 'comments':
                    for row in rows:
                        if not Post.query.get(row['post_id']):
                            print(f"Warning: Skipping comment {row['id']} due to non-existent post_id {row['post_id']}")
                            continue
                        if not User.query.get(row['user_id']):
                            print(f"Warning: Skipping comment {row['id']} due to non-existent user_id {row['user_id']}")
                            continue
                        
                        parent_id = row['parent_id']
                        if parent_id and not Comment.query.get(parent_id):
                            print(f"Warning: Skipping comment {row['id']} due to non-existent parent_id {row['parent_id']}. Setting parent_id to None.")
                            parent_id = None # Set to None if parent doesn't exist

                        created_at_dt = None
                        if row['created_at']:
                            try:
                                created_at_dt = datetime.strptime(str(row['created_at']), '%Y-%m-%d %H:%M:%S.%f')
                            except ValueError:
                                try:
                                    created_at_dt = datetime.strptime(str(row['created_at']), '%Y-%m-%d %H:%M:%S')
                                except ValueError:
                                    try: # Fallback for date-only formats
                                        created_at_dt = datetime.strptime(str(row['created_at']), '%Y-%m-%d')
                                    except ValueError:
                                        print(f"Warning: Could not parse created_at '{row['created_at']}' for comments. Setting to None.")
                                        created_at_dt = None

                        comment = Comment(
                            id=row['id'],
                            post_id=row['post_id'],
                            user_id=row['user_id'],
                            parent_id=parent_id,
                            comment=row['comment'],
                            created_at=created_at_dt # Use the converted datetime object
                        )
                        db.session.add(comment)

                elif table_name == 'user_mind_results':
                    for row in rows:
                        if not User.query.get(row['user_id']):
                            print(f"Warning: Skipping user_mind_result {row['id']} due to non-existent user_id {row['user_id']}")
                            continue
                        
                        created_at_dt = None
                        if row['created_at']:
                            try:
                                created_at_dt = datetime.strptime(str(row['created_at']), '%Y-%m-%d %H:%M:%S.%f')
                            except ValueError:
                                try:
                                    created_at_dt = datetime.strptime(str(row['created_at']), '%Y-%m-%d %H:%M:%S')
                                except ValueError:
                                    try: # Fallback for date-only formats
                                        created_at_dt = datetime.strptime(str(row['created_at']), '%Y-%m-%d')
                                    except ValueError:
                                        print(f"Warning: Could not parse created_at '{row['created_at']}' for user_mind_results. Setting to None.")
                                        created_at_dt = None

                        mind_result = UserMindResult(
                            id=row['id'],
                            user_id=row['user_id'],
                            result_json=row['result_json'],
                            created_at=created_at_dt # Use the converted datetime object
                        )
                        db.session.add(mind_result)

                # General case for other tables where column names directly match model attributes
                else:
                    for row in rows:
                        data = {k: row[k] for k in row.keys()}
                        
                        # Convert known datetime strings to datetime objects
                        datetime_cols = ['created_at', 'registration_date', 'end_date', 'accreditation_date', 'expiry_date', 'closing_date'] # Add any other DateTime columns here
                        for col in datetime_cols:
                            if col in data and data[col] and isinstance(data[col], str):
                                try:
                                    # Try parsing with microseconds
                                    data[col] = datetime.strptime(data[col], '%Y-%m-%d %H:%M:%S.%f')
                                except ValueError:
                                    try: # Fallback for formats without microseconds
                                        data[col] = datetime.strptime(data[col], '%Y-%m-%d %H:%M:%S')
                                    except ValueError:
                                        try: # Fallback for date-only formats
                                            data[col] = datetime.strptime(data[col], '%Y-%m-%d')
                                        except ValueError:
                                            print(f"Warning: Could not parse '{col}' '{data[col]}' for table '{table_name}'. Setting to None.")
                                            data[col] = None

                        # Try to preserve original IDs for foreign key consistency if possible
                        if 'id' in data and data['id'] is not None:
                            instance = model_class.query.get(data['id'])
                            if instance: # If object with this ID already exists, update it
                                for key, value in data.items():
                                    if hasattr(instance, key):
                                        setattr(instance, key, value)
                                db.session.add(instance)
                            else: # Else, create new instance
                                new_instance = model_class(**data)
                                db.session.add(new_instance)
                        else: # No ID to preserve, just create new instance
                            new_instance = model_class(**data)
                            db.session.add(new_instance)

                db.session.commit()
                print(f"Successfully migrated {len(rows)} rows for table: {table_name}")

        except Exception as e:
            db.session.rollback()
            print(f"An error occurred during migration: {e}")
        finally:
            if sqlite_conn:
                sqlite_conn.close()
            print("Data migration process finished.")

if __name__ == '__main__':
    migrate_data()
