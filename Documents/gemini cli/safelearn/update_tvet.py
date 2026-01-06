import sqlite3

def update_tvet_colleges():
    conn = None
    try:
        conn = sqlite3.connect('safelearn.db')
        c = conn.cursor()

        # Update Lephalale TVET
        lephalale_data = {
            'postal_address': 'Private Bag X210, Lephalale, 0555',
            'physical_address': 'Cnr Nelson Mandela & Ngwako Ramatlhodi Street, Onverwacht',
            'tel': '014 763 2252/1014',
            'web': 'leptvetcol.edu.za'
        }
        c.execute('''
            UPDATE tvet_colleges
            SET postal_address = ?, physical_address = ?, tel = ?, web = ?
            WHERE college_name = 'Lephalale TVET College'
        ''', (lephalale_data['postal_address'], lephalale_data['physical_address'], lephalale_data['tel'], lephalale_data['web']))
        
        if c.rowcount == 0:
            print("Lephalale TVET College not found or no update needed.")
        else:
            print(f"Updated Lephalale TVET College: {c.rowcount} row(s)")

        # Update Letaba TVET
        letaba_data = {
            'postal_address': 'Private Bag X4017, Tzaneen, 0850',
            'physical_address': '1 Claude Wheatley Street, Abor Park, Tzaneen, 0850',
            'tel': '015 307 5440',
            'web': 'www.letcol.co.za'
        }
        c.execute('''
            UPDATE tvet_colleges
            SET postal_address = ?, physical_address = ?, tel = ?, web = ?
            WHERE college_name = 'Letaba TVET College'
        ''', (letaba_data['postal_address'], letaba_data['physical_address'], letaba_data['tel'], letaba_data['web']))

        if c.rowcount == 0:
            print("Letaba TVET College not found or no update needed.")
        else:
            print(f"Updated Letaba TVET College: {c.rowcount} row(s)")

        conn.commit()
        print("TVET colleges update complete.")

    except sqlite3.Error as e:
        print(f"Database error: {e}")
        if conn:
            conn.rollback()
    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        if conn:
            conn.close()

if __name__ == '__main__':
    update_tvet_colleges()
