import sqlite3

def update_db_v3():
    conn = None
    try:
        conn = sqlite3.connect('safelearn.db')
        c = conn.cursor()

        # Add title column to posts table
        try:
            c.execute('ALTER TABLE posts ADD COLUMN title TEXT')
            print("Added 'title' column to 'posts' table.")
        except sqlite3.OperationalError as e:
            if "duplicate column name" in str(e):
                print("'title' column already exists in 'posts' table.")
            else:
                raise e

        conn.commit()

    except Exception as e:
        print(f"An error occurred: {e}")
        if conn:
            conn.rollback()
    finally:
        if conn:
            conn.close()

if __name__ == '__main__':
    update_db_v3()
