from app import app, db
from models import User
from getpass import getpass
from werkzeug.security import generate_password_hash # Keep this for password hashing

def secure_init():
    with app.app_context():
        print("Admin user setup for SafeLearn.")
        username = input("Enter a username for the admin account: ")
        email = input("Enter an email for the admin account: ")
        password = getpass("Enter a password for the admin account: ")
        
        # Check if user already exists
        existing_user = User.query.filter((User.username == username) | (User.email == email)).first()

        if existing_user:
            print(f"User with username '{username}' or email '{email}' already exists.")
            update = input("Do you want to update this user to be an admin? (y/n): ")
            if update.lower() == 'y':
                existing_user.is_admin = True
                existing_user.set_password(password) # Update password as well
                db.session.commit()
                print(f"User '{username}' updated to an admin successfully.")
            return

        new_admin = User(username=username, email=email, is_admin=True)
        new_admin.set_password(password) # Set hashed password
        
        db.session.add(new_admin)
        db.session.commit()

        print(f"\nAdmin user '{username}' created successfully.")
        print("You can now use this username and password to log in to the admin panel.")

if __name__ == '__main__':
    secure_init()