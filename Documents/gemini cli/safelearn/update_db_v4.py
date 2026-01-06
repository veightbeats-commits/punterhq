import sqlite3

def update_db():
    conn = sqlite3.connect('safelearn.db')
    c = conn.cursor()

    # Create user_mind_results table
    try:
        c.execute('''
            CREATE TABLE IF NOT EXISTS user_mind_results (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                result_json TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (id)
            )
        ''')
        print("Created table: user_mind_results")
    except Exception as e:
        print(f"Error creating user_mind_results: {e}")

    conn.commit()
    conn.close()

if __name__ == '__main__':
    update_db()
    print("Database updated successfully.")
