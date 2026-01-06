import sqlite3

def update_db_v2():
    conn = None
    try:
        conn = sqlite3.connect('safelearn.db')
        c = conn.cursor()

        # Add parent_id column to comments table
        try:
            c.execute('ALTER TABLE comments ADD COLUMN parent_id INTEGER')
            print("Added 'parent_id' column to 'comments' table.")
        except sqlite3.OperationalError as e:
            if "duplicate column name" in str(e):
                print("'parent_id' column already exists in 'comments' table.")
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
    update_db_v2()
