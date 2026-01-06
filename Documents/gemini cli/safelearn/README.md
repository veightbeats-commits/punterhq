# SafeLearner.online Web Application

## Project Description
SafeLearner.online is a Flask-based web application designed to provide user authentication features including registration, login, profile management, and the ability to change passwords. It also includes an administrative panel for managing the application. Users can upload profile pictures, which are stored and served by the application.

## Features
-   User Registration
-   User Login and Logout
-   User Profile Management (password change, profile picture upload)
-   Admin Panel (access restricted)
-   Secure Password Hashing
-   Session Management
-   Static file serving
-   Uploaded file serving
-   Forum for questions and answers
-   Messaging system for users and admin
-   Recommendation engine ("The Mind") for career and educational paths
-   Dynamic content for Qualifications, Skills Programmes, Accredited Schools, Accommodations, TVET Colleges, SETAs, Universities, Learnerships, and Bursaries.

## Technologies Used
-   **Backend:** Python, Flask, Flask-SQLAlchemy
-   **Database:** PostgreSQL (production), SQLite (development fallback). Configured via `DATABASE_URL` environment variable.
-   **Frontend:** HTML, CSS (e.g., `static/landing.css`), Jinja2 Templating
-   **Dependencies:**
    -   Flask
    -   Flask-SQLAlchemy
    -   pandas
    -   gunicorn
    -   blinker
    -   click
    -   colorama
    -   itsdangerous
    -   Jinja2
    -   MarkupSafe
    -   Werkzeug

## Setup Instructions

### 1. Clone the Repository
```bash
git clone <repository_url>
cd safelearn
```

### 2. Create a Virtual Environment
It's recommended to use a virtual environment to manage project dependencies.
```bash
python -m venv venv
```

### 3. Activate the Virtual Environment

-   **Windows:**
    ```bash
    .\venv\Scripts\activate
    ```
-   **macOS/Linux:**
    ```bash
    source venv/bin/activate
    ```

### 4. Install Dependencies
```bash
pip install -r requirements.txt
```

### 5. Database Setup (PostgreSQL)

The application uses PostgreSQL as its primary database. For development, it can fall back to SQLite if the `DATABASE_URL` environment variable is not set.

#### A. For PostgreSQL:
1.  **Install PostgreSQL:** Ensure you have PostgreSQL installed and running on your system or have access to a PostgreSQL database server.
2.  **Create a Database and User:** Create a new database and a user with appropriate permissions for this project.
    ```sql
    CREATE DATABASE safelearn_db;
    CREATE USER safelearn_user WITH PASSWORD 'your_password';
    GRANT ALL PRIVILEGES ON DATABASE safelearn_db TO safelearn_user;
    ```
3.  **Set `DATABASE_URL` Environment Variable:**
    Set the `DATABASE_URL` environment variable to point to your PostgreSQL database.
    Example:
    -   **Windows (Command Prompt):**
        ```bash
        set DATABASE_URL="postgresql://safelearn_user:your_password@localhost/safelearn_db"
        ```
    -   **Windows (PowerShell):**
        ```bash
        $env:DATABASE_URL="postgresql://safelearn_user:your_password@localhost/safelearn_db"
        ```
    -   **macOS/Linux:**
        ```bash
        export DATABASE_URL="postgresql://safelearn_user:your_password@localhost/safelearn_db"
        ```
    *(Replace `your_password`, `localhost`, and `safelearn_db` with your actual credentials and host/database name.)*

4.  **Initialize Database Tables:**
    Run the `create_db.py` script to create all necessary tables in your PostgreSQL database.
    ```bash
    python create_db.py
    ```
    *(Note: This uses Flask-SQLAlchemy to create tables based on the models defined in `models.py`. If you have existing data from SQLite, you will need to migrate it separately.)*

#### B. For SQLite (Development Fallback):
If you do not set the `DATABASE_URL` environment variable, the application will default to using an SQLite database named `safelearn.db`.
To initialize the SQLite database:
```bash
python init_db.py
```
*(This script contains SQLite-specific table creation commands.)*

### 6. Run the Application
You can run the application using Flask's development server:
```bash
flask run
```
Alternatively, for production environments, you might use Gunicorn (as it's in `requirements.txt`):
```bash
gunicorn -w 4 app:app
```
(Adjust `-w 4` based on your server's CPU cores for optimal performance)

## Database Migration Notes
The application has transitioned from exclusively using SQLite to supporting PostgreSQL as the primary database. Flask-SQLAlchemy is used for ORM, allowing for easier database switching. For local development, SQLite is still supported as a fallback. When migrating from an existing SQLite database to PostgreSQL, you will need to perform a data migration as `create_db.py` only creates the schema.

## File Structure Overview
-   `app.py`: The main Flask application file, defining routes, logic, and database interactions. Now uses Flask-SQLAlchemy with `DATABASE_URL` for configuration.
-   `models.py`: Defines all database models (tables) using Flask-SQLAlchemy.
-   `requirements.txt`: Lists all Python dependencies, including `Flask-SQLAlchemy`.
-   `safelearn.db`: (SQLite) The SQLite database file (used if `DATABASE_URL` is not set).
-   `init_db.py`: **Legacy script** for initializing the SQLite database schema.
-   `create_db.py`: **New script** for initializing PostgreSQL (or any SQLAlchemy-supported) database schema.
-   `templates/`: Contains HTML template files for different pages.
-   `static/`: Contains static assets like CSS, JavaScript, and images.
-   `uploads/`: Directory for user-uploaded files, such as profile pictures.
-   `update_db*.py`: Scripts possibly used for database migrations or updates (may require review for PostgreSQL compatibility).

## Usage
-   Navigate to the application URL in your browser (usually `http://127.0.0.1:5000/` if running with `flask run`).
-   Register a new account.
-   Log in with your credentials.
-   Access your profile to update information or change your profile picture.
-   If you have admin privileges, you can access the `/admin` route.
-   Explore various educational resources, forum, and recommendation features.

## Contributing
(Optional: Add guidelines for contributing if this were an open-source project)

## License
(Optional: Specify the project's license)