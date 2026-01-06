import pandas as pd
import sqlite3
import os

def import_data():
    conn = None
    try:
        # Re-initialize the database schema
        # import init_db
        # init_db.init_db()
        # print("Database schema re-initialized.")

        # Initialize the secure user table
        # import secure_init
        # secure_init.secure_init()
        # print("Secure user table initialized.")

        conn = sqlite3.connect('safelearn.db')
        c = conn.cursor()

        # # --- Import accredited_schools.csv ---
        # try:
        #     schools_df = pd.read_csv('accredited schools.csv')
        #     schools_df.columns = schools_df.columns.str.strip().str.lower().str.replace(' ', '_').str.replace('.', '', regex=False)
            
        #     schools_df = schools_df.rename(columns={
        #         'trade_test_centre': 'school_name',
        #         'accreditation_number': 'accreditation_number',
        #         'physical_address': 'physical_address',
        #         'contact_no': 'contact_number',
        #         'email_address': 'email',
        #         'start_date': 'accreditation_date',
        #         'end_date': 'expiry_date'
        #     })
            
        #     schools_df['qualifications_accredited_for'] = schools_df['saqa_id'].astype(str) + ' - ' + schools_df['trade_title'].fillna('')

        #     def extract_location_info(address):
        #         province = None
        #         city = None
        #         if pd.notna(address):
        #             address_str = str(address).replace('\n', ', ').strip()
        #             parts = [p.strip() for p in address_str.split(',') if p.strip()]

        #             sa_provinces = ['gauteng', 'western cape', 'eastern cape', 'limpopo', 
        #                             'mpumalanga', 'kwazulu-natal', 'northern cape', 
        #                             'north west', 'free state']
                    
        #             temp_parts = list(parts) # Work on a copy
        #             for i in reversed(range(len(temp_parts))):
        #                 for prov in sa_provinces:
        #                     if prov in temp_parts[i].lower():
        #                         province = temp_parts[i]
        #                         del temp_parts[i]
        #                         break
        #                 if province:
        #                     break
                    
        #             if temp_parts: # If there are remaining parts after extracting province
        #                 # Simple heuristic for city - last remaining part if it's not a number (like a zip code)
        #                 last_part = temp_parts[-1]
        #                 if not any(char.isdigit() for char in last_part):
        #                     city = last_part
        #                 elif len(temp_parts) > 1 and not any(char.isdigit() for char in temp_parts[-2]):
        #                     city = temp_parts[-2]
                            
        #             # Clean up city/province from potential zip codes (e.g., 'Gauteng 0184' -> 'Gauteng')
        #             if city and any(char.isdigit() for char in str(city)):
        #                 city = ' '.join([word for word in str(city).split() if not word.isdigit()])
        #             if province and any(char.isdigit() for char in str(province)):
        #                 province = ' '.join([word for word in str(province).split() if not word.isdigit()])

        #         return pd.Series([province, city])

        #     schools_df[['province', 'city']] = schools_df['physical_address'].apply(extract_location_info)

        #     schools_df['website'] = None
        #     schools_df['postal_address'] = None

        #     for index, row in schools_df.iterrows():
        #         try:
        #             c.execute('''
        #                 INSERT INTO accredited_schools (
        #                     school_name, accreditation_number, status, physical_address,
        #                     postal_address, province, city, contact_number, email, website,
        #                     accreditation_date, expiry_date, qualifications_accredited_for
        #                 ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        #             ''', (
        #                 row['school_name'],
        #                 row['accreditation_number'],
        #                 'Active',
        #                 row['physical_address'],
        #                 row['postal_address'],
        #                 row['province'],
        #                 row['city'],
        #                 row['contact_number'],
        #                 row['email'],
        #                 row['website'],
        #                 row['accreditation_date'],
        #                 row['expiry_date'],
        #                 row['qualifications_accredited_for']
        #             ))
        #         except sqlite3.IntegrityError:
        #             if pd.isna(row['accreditation_number']):
        #                 print(f"Skipping accredited_schools row due to NaN accreditation_number: {row.to_dict()}")
        #             else:
        #                 print(f"Duplicate accreditation_number: {row['accreditation_number']}. Skipping.")
        #         except KeyError as ke:
        #             print(f"Missing key in accredited_schools: {ke} for row {row.to_dict()}")
        #     print(f"Successfully imported {len(schools_df)} records from accredited schools.csv")
        # except FileNotFoundError:
        #     print("accredited schools.csv not found. Skipping import for this file.")
        # except Exception as e:
        #     print(f"Error importing accredited schools.csv: {e}")

        # # --- Import Registered Quals & Part-Reg Quals with SAQA links.csv ---
        # try:
        #     qual_df = pd.read_csv('Registered Quals & Part-Reg Quals with SAQA links.csv')
        #     qual_df.columns = qual_df.columns.str.strip().str.lower().str.replace(' ', '_').str.replace('.', '', regex=False)
            
        #     qual_df = qual_df.rename(columns={
        #         'saqa_qual_id': 'saqa_id',
        #         'qualification_title': 'title',
        #         'qualification_type': 'type',
        #         'nqf_level': 'nqf_level',
        #         'credits': 'credits',
        #         'saqa_link': 'saqa_link',
        #         'quality_partner': 'quality_partner'
        #     })

        #     qual_df['duration'] = None
        #     qual_df['category'] = None
        #     qual_df['status'] = 'Registered'
        #     qual_df['registration_date'] = None
        #     qual_df['end_date'] = None
        #     qual_df['description'] = None
        #     qual_df['entry_requirements'] = None
        #     qual_df['components'] = None

        #     for index, row in qual_df.iterrows():
        #         try:
        #             c.execute('''
        #                 INSERT INTO qualifications (
        #                     saqa_id, title, type, nqf_level, credits, duration, category,
        #                     status, registration_date, end_date, saqa_link, description,
        #                     entry_requirements, components, quality_partner, attachments
        #                 ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        #             ''', (
        #                 row['saqa_id'],
        #                 row['title'],
        #                 row['type'],
        #                 row['nqf_level'],
        #                 row['credits'],
        #                 row['duration'],
        #                 row['category'],
        #                 row['status'],
        #                 row['registration_date'],
        #                 row['end_date'],
        #                 row['saqa_link'],
        #                 row['description'],
        #                 row['entry_requirements'],
        #                 row['components'],
        #                 row['quality_partner'],
        #                 row['attachments']
        #             ))
        #         except sqlite3.IntegrityError:
        #             if pd.isna(row['saqa_id']):
        #                 print(f"Skipping qualifications row due to NaN SAQA ID: {row.to_dict()}")
        #             else:
        #                 print(f"Duplicate SAQA ID: {row['saqa_id']}. Skipping.")
        #         except KeyError as ke:
        #             print(f"Missing key in qualifications: {ke} for row {row.to_dict()}")
        #     print(f"Successfully imported {len(qual_df)} records from Registered Quals & Part-Reg Quals with SAQA links.csv")
        # except FileNotFoundError:
        #     print("Registered Quals & Part-Reg Quals with SAQA links.csv not found. Skipping import for this file.")
        # except Exception as e:
        #     print(f"Error importing Registered Quals & Part-Reg Quals with SAQA links.csv: {e}")

        # # --- Import skill_programes.csv ---
        # try:
        #     skills_df = pd.read_csv('skill programes.csv')
        #     skills_df.columns = skills_df.columns.str.strip().str.lower().str.replace(' ', '_').str.replace('.', '', regex=False)
            
        #     skills_df = skills_df.rename(columns={
        #         'sp_id': 'programme_id',
        #         'skills_programme_title': 'title',
        #         'nqf_level': 'nqf_level',
        #         'credits': 'credits'
        #     })

        #     skills_df['duration'] = None
        #     skills_df['category'] = None
        #     skills_df['status'] = 'Active'
        #     skills_df['description'] = None
        #     skills_df['entry_requirements'] = None

        #     for index, row in skills_df.iterrows():
        #         try:
        #             c.execute('''
        #                 INSERT INTO skills_programmes (
        #                     programme_id, title, nqf_level, credits, duration, category,
        #                     status, description, entry_requirements, attachments
        #                 ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        #             ''', (
        #                 row['programme_id'],
        #                 row['title'],
        #                 row['nqf_level'],
        #                 row['credits'],
        #                 row['duration'],
        #                 row['category'],
        #                 row['status'],
        #                 row['description'],
        #                 row['entry_requirements'],
        #                 row['attachments']
        #             ))
        #         except sqlite3.IntegrityError:
        #             if pd.isna(row['programme_id']):
        #                 print(f"Skipping skills_programmes row due to NaN programme_id: {row.to_dict()}")
        #             else:
        #                 print(f"Duplicate programme_id: {row['programme_id']}. Skipping.")
        #         except KeyError as ke:
        #             print(f"Missing key in skills_programmes: {ke} for row {row.to_dict()}")
        #     print(f"Successfully imported {len(skills_df)} records from skill programes.csv")
        # except FileNotFoundError:
        #     print("skill programes.csv not found. Skipping import for this file.")
        # except Exception as e:
        #     print(f"Error importing skill programes.csv: {e}")

        # --- Import accommodations.csv ---
        try:
            c.execute("DELETE FROM accommodations")
            accom_df = pd.read_csv('accommodations.csv')
            accom_df.columns = accom_df.columns.str.strip().str.lower().str.replace(' ', '_').str.replace('-', '_')
            
            def get_province_from_city(city):
                if not city or pd.isna(city): return "Uncategorized"
                city = str(city).lower().strip()
                mapping = {
                    'gauteng': ['johannesburg', 'pretoria', 'soweto', 'vanderbijlpark', 'midrand', 'centurion', 'hatfield', 'auckland park', 'braamfontein', 'doornfontein', 'hillbrow', 'parktown'],
                    'western cape': ['cape town', 'bellville', 'stellenbosch', 'salt river', 'foreshore'],
                    'mpumalanga': ['mbombela', 'nelspruit', 'mataffin', 'mattafin'],
                    'kwazulu-natal': ['durban', 'pietermaritzburg', 'umlazi', 'westville', 'kwaduzuza', 'scottsville', 'reservoir hills', 'carrington heights'],
                    'free state': ['bloemfontein', 'welkom', 'universitas', 'willows'],
                    'eastern cape': ['gqeberha', 'port elizabeth', 'mthatha', 'grahamstown', 'alice', 'east london', 'richmond hill'],
                    'limpopo': ['thohoyandou', 'polokwane', 'sovenga', 'ngovhela'],
                    'north west': ['mahikeng', 'potchefstroom', 'molatlhwa'],
                    'northern cape': ['kimberly', 'upington']
                }
                for province, cities in mapping.items():
                    if any(c in city for c in cities):
                        return province.title()
                return "Uncategorized"

            for index, row in accom_df.iterrows():
                try:
                    province = get_province_from_city(row.get('city'))
                    c.execute('''
                        INSERT INTO accommodations (
                            province, suburb, city, accommodation_name, payment_nsfas, 
                            payment_bursary, payment_cash, monthly_pay
                        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                    ''', (
                        province,
                        row.get('sub') or row.get('suburb'),
                        row['city'],
                        row['accommodation_name'],
                        row['payment_method___nsfas'],
                        row['payment_method___bursary'],
                        row['payment_method___cash'],
                        row['monthly_pay']
                    ))
                except sqlite3.Error as ex:
                    print(f"Error inserting accommodation data: {ex} for row {row.to_dict()}")
            print(f"Successfully imported {len(accom_df)} records from accommodations.csv")
        except FileNotFoundError:
            print("accommodations.csv not found. Skipping import for this file.")
        except Exception as e:
            print(f"Error importing accommodations.csv: {e}")

        # # --- Import Tvet Colleges.csv ---
        # try:
        #     tvet_df = pd.read_csv('Tvet Colleges.csv')
        #     tvet_df.columns = tvet_df.columns.str.strip().str.lower().str.replace(' ', '_')

        #     for index, row in tvet_df.iterrows():
        #         try:
        #             c.execute('''
        #                 INSERT INTO tvet_colleges (
        #                     province, college_name, postal_address, physical_address, tel, web
        #                 ) VALUES (?, ?, ?, ?, ?, ?)
        #             ''', (
        #                 row['province'],
        #                 row['college_name'],
        #                 row['postal'],
        #                 row['physical'],
        #                 row['tel'],
        #                 row['web']
        #             ))
        #         except sqlite3.Error as ex:
        #             print(f"Error inserting TVET college data: {ex} for row {row.to_dict()}")
        #     print(f"Successfully imported {len(tvet_df)} records from Tvet Colleges.csv")
        # except FileNotFoundError:
        #     print("Tvet Colleges.csv not found. Skipping import for this file.")
        # except Exception as e:
        #     print(f"Error importing Tvet Colleges.csv: {e}")

        # --- Import SETAs (Hardcoded with Rich Data) ---
        try:
            c.execute("DELETE FROM setas") # Clear existing SETA data
            
            setas_data = [
                {
                    "seta_name": "Agricultural Sector Education and Training Authority (AgriSETA)",
                    "postal_address": "PO Box 23378, Gezina, 0031",
                    "physical_address": "AgriSETA House, 529 Belvedere Road, Arcadia, Pretoria",
                    "telephone": "012 301 5600",
                    "website": "www.agriseta.co.za",
                    "description": "AgriSETA creates opportunities in the agricultural sector, focusing on skills development for farming and related industries.",
                    "purpose": "To promote and facilitate skills development within the agricultural sector, ensuring a skilled workforce for sustainable food production."
                },
                {
                    "seta_name": "Banking Sector Education and Training Authority (BANKSETA)",
                    "postal_address": "PO Box 11678, Vorna Valley, 1686",
                    "physical_address": "Building C2, Eco Origin Office Park, Eco-Park Estate, 349 Witch-Hazel Ave, Highveld, Centurion, 0144",
                    "telephone": "011 805 9661",
                    "website": "bankseta.org.za",
                    "description": "BANKSETA provides training and development for careers in banking and microfinance, supporting the financial sector's growth.",
                    "purpose": "To develop skills for individuals interested in or currently working in the banking and microfinance sectors."
                },
                {
                    "seta_name": "Chemical Industries Education and Training Authority (CHIETA)",
                    "postal_address": "72 New Road, Glen Austin AH (Grand Central), Midrand, 1685",
                    "physical_address": "72 New Road, Glen Austin AH (Grand Central), Midrand, 1685",
                    "telephone": "011 628 7000 / 087 357 6608",
                    "website": "chieta.org.za",
                    "description": "CHIETA offers learnerships and bursaries in the chemical industries, including petroleum, pharmaceuticals, and manufacturing.",
                    "purpose": "To facilitate skills development in the chemical industries sector, contributing to sustainable development and growth."
                },
                {
                    "seta_name": "Construction Education and Training Authority (CETA)",
                    "postal_address": "PO Box 1955, Halfway House, 1685",
                    "physical_address": "52 14th Road, Noordwyk, Midrand, 1687",
                    "telephone": "011 265 5900/1",
                    "website": "www.ceta.org.za",
                    "description": "CETA facilitates training and job opportunities for youth within the construction industry, covering various trades.",
                    "purpose": "To provide skills development services to the construction sector, ensuring a competent workforce."
                },
                {
                    "seta_name": "Culture, Arts, Tourism, Hospitality and Sport Sector Education and Training Authority (CATHSSETA)",
                    "postal_address": "PO Box 1329, Rivonia, 2128",
                    "physical_address": "270 George Road, Noordwyk, Midrand 1687",
                    "telephone": "011 217 0600",
                    "website": "cathsseta.org.za",
                    "description": "CATHSSETA provides training for careers in arts, culture, tourism, hospitality, and sport.",
                    "purpose": "To develop skills required for the diverse and vibrant arts, culture, tourism, hospitality, and sport sub-sectors."
                },
                {
                    "seta_name": "Education, Training and Development Practices Sector Education and Training Authority (ETDP SETA)",
                    "postal_address": "Private Bag X105, Melville, 2109",
                    "physical_address": "Hosken’s House, 45 Mooi Street, Johannesburg",
                    "telephone": "011 372 3300",
                    "website": "www.etdpseta.org.za",
                    "description": "ETDP SETA enables youth to pursue careers in teaching, facilitation, and educational management.",
                    "purpose": "To develop skills within the Education, Training, and Development sector, improving the quality of education."
                },
                {
                    "seta_name": "Energy and Water Sector Education and Training Authority (EWSETA)",
                    "postal_address": "PO Box 5983, Johannesburg, 2000",
                    "physical_address": "22 Wellington Road, Parktown, Johannesburg",
                    "telephone": "011 274 4700",
                    "website": "ewseta.org.za",
                    "description": "EWSETA equips youth with specialized skills for energy generation, distribution, and water management.",
                    "purpose": "To provide learning opportunities and skills development for the energy and water sectors."
                },
                {
                    "seta_name": "Fibre Processing and Manufacturing Sector Education and Training Authority (FP&M SETA)",
                    "postal_address": "PO Box 31276, Braamfontein, 2017",
                    "physical_address": "Thynk Park, 1st Floor, 8 Summit Road, Dunkeld West, Randburg, Johannesburg",
                    "telephone": "011 403 1700",
                    "website": "www.fpmseta.org.za",
                    "description": "FP&M SETA supports training in manufacturing, textiles, footwear, and forestry industries.",
                    "purpose": "To focus on skills development within the fibre processing and manufacturing industries."
                },
                {
                    "seta_name": "Finance and Accounting Services Sector Education and Training Authority (FASSET)",
                    "postal_address": "PO Box 6801, Cresta, 2118",
                    "physical_address": "1st Floor, 296 Kent Avenue, Ferndale, Randburg",
                    "telephone": "011 476 8570 / 087 821 2680",
                    "website": "www.fasset.org.za",
                    "description": "FASSET offers learnerships and bursaries for careers in finance, accounting, and auditing.",
                    "purpose": "To be responsible for skills development in the finance and accounting services sector."
                },
                {
                    "seta_name": "Food and Beverage Manufacturing Industry Sector Education and Training Authority (FoodBev SETA)",
                    "postal_address": "PO Box 245, Gallo Manor, 2052",
                    "physical_address": "7 Wessel Road, Rivonia",
                    "telephone": "011 253 7300",
                    "website": "www.foodbev.co.za",
                    "description": "FoodBev SETA helps youth build careers in the production and processing of food and beverages.",
                    "purpose": "To promote and facilitate skills development in the food and beverage manufacturing sector."
                },
                {
                    "seta_name": "Health and Welfare Sector Education and Training Authority (HWSETA)",
                    "postal_address": "Private Bag X15, Gardenview, 2047",
                    "physical_address": "17 Bradford Road, Bedfordview, Johannesburg",
                    "telephone": "011 607 6900",
                    "website": "www.hwseta.org.za",
                    "description": "HWSETA funds programs for health, social development, and veterinary careers, helping to care for the nation.",
                    "purpose": "To create a skilled workforce for the health, social development, and veterinary sectors."
                },
                {
                    "seta_name": "Insurance Sector Education and Training Authority (INSETA)",
                    "postal_address": "PO Box 32035, Braamfontein, 2017",
                    "physical_address": "18 Fricker Road, Illovo, Sandton, 2196",
                    "telephone": "011 381 8900",
                    "website": "inseta.org.za",
                    "description": "INSETA encourages youth to pursue careers in insurance and financial risk management.",
                    "purpose": "To focus on developing scarce and critical skills within the insurance sector."
                },
                {
                    "seta_name": "Local Government Sector Education and Training Authority (LGSETA)",
                    "postal_address": "PO Box 1964, Bedfordview, 2008",
                    "physical_address": "Gillooly's View Office Park, 1 Osborne Lane, Bedfordview",
                    "telephone": "011 456 8579",
                    "website": "lgseta.org.za",
                    "description": "LGSETA empowers youth with skills for municipal administration and local government services.",
                    "purpose": "To facilitate education and training within the local government sector to enhance efficiency."
                },
                {
                    "seta_name": "Manufacturing, Engineering and Related Services Sector Education and Training Authority (merSETA)",
                    "postal_address": "PO Box 61826, Marshalltown, 2107",
                    "physical_address": "Metropolitan Park, Block C, 8 Hillside Road, Parktown, Johannesburg, 2193",
                    "telephone": "0861 637 738",
                    "website": "www.merseta.org.za",
                    "description": "merSETA trains young people for technical and engineering roles in manufacturing and related industries.",
                    "purpose": "To facilitate training and development within the manufacturing, engineering, and related services sectors."
                },
                {
                    "seta_name": "Media, Information and Communication Technologies Sector Education and Training Authority (MICT SETA)",
                    "postal_address": "PO Box 5585, Halfway House, 1685",
                    "physical_address": "Gallagher House, Gallagher Convention Centre, 19 Richards Drive, Halfway House, Midrand, 1685",
                    "telephone": "011 207 2600/3",
                    "website": "www.mict.org.za",
                    "description": "MICT SETA empowers youth with digital skills for IT, media, advertising, and electronics careers.",
                    "purpose": "To develop critical skills in the ICT and media sectors, bridging the digital divide."
                },
                {
                    "seta_name": "Mining Qualifications Authority (MQA)",
                    "postal_address": "Private Bag X118, Marshalltown, 2107",
                    "physical_address": "7 Anerley Road, Parktown",
                    "telephone": "011 547 2600",
                    "website": "mqa.org.za",
                    "description": "MQA provides qualifications and safety training for the mining and mineral sector.",
                    "purpose": "To ensure the mining and mineral sector has enough skilled workers and improved health and safety."
                },
                {
                    "seta_name": "Public Service Sector Education and Training Authority (PSETA)",
                    "postal_address": "PO Box 11303, Hatfield, 0028",
                    "physical_address": "Woodpecker Building, Hillcrest Office Park, 177 Dyer Road, Hillcrest, Pretoria, 0083",
                    "telephone": "012 423 5700",
                    "website": "pseta.org.za",
                    "description": "PSETA develops a professional workforce for government departments and public entities.",
                    "purpose": "To drive skills development across the public sector for efficient service delivery."
                },
                {
                    "seta_name": "Safety and Security Sector Education and Training Authority (SASSETA)",
                    "postal_address": "PO Box 7612, Halfway House, 1685",
                    "physical_address": "Building 2, Waterfall Corporate Campus, 74 Waterfall Drive, Midrand",
                    "telephone": "011 087 5555/5500",
                    "website": "www.sasseta.org.za",
                    "description": "SASSETA trains youth for careers in policing, defense, private security, and corrections.",
                    "purpose": "To create opportunities for skills development within the safety and security sector."
                },
                {
                    "seta_name": "Services Sector Education and Training Authority (SSETA)",
                    "postal_address": "PO Box 3322, Houghton, Johannesburg, 2193",
                    "physical_address": "15 Sherborne Road, Parktown, Johannesburg",
                    "telephone": "011 276 9600",
                    "website": "www.servicesseta.org.za",
                    "description": "Services SETA empowers youth with skills for business, marketing, real estate, and project management.",
                    "purpose": "To address skills needs in a broad range of service industries and support SMMEs."
                },
                {
                    "seta_name": "Transport Education Training Authority (TETA)",
                    "postal_address": "Private Bag X10016, Randburg, 2125",
                    "physical_address": "344 Pretoria Avenue, TETA House, Randburg, Gauteng",
                    "telephone": "011 577 7000",
                    "website": "www.teta.org.za",
                    "description": "TETA offers training for careers in rail, aerospace, maritime, and road transport logistics.",
                    "purpose": "To build a skilled, competitive, and competent workforce for the transport industry."
                },
                {
                    "seta_name": "Wholesale and Retail Sector Education and Training Authority (W&RSETA)",
                    "postal_address": "Private Bag X106, Centurion, 0046",
                    "physical_address": "Riverside Office Park, Hennops House, 1303 Heuwel Avenue, Cnr Lenchen South & Heuwel Avenue, Centurion, Pretoria",
                    "telephone": "012 622 9500",
                    "website": "www.wrseta.org.za",
                    "description": "W&RSETA helps youth enter the retail sector with skills for shopkeeping, supply chain, and merchandising.",
                    "purpose": "To facilitate skills development in the wholesale and retail sector and support small businesses."
                }
            ]

            for seta in setas_data:
                try:
                    c.execute('''
                        INSERT INTO setas (
                            seta_name, postal_address, physical_address, telephone, website, description, purpose
                        ) VALUES (?, ?, ?, ?, ?, ?, ?)
                    ''', (
                        seta['seta_name'],
                        seta['postal_address'],
                        seta['physical_address'],
                        seta['telephone'],
                        seta['website'],
                        seta['description'],
                        seta['purpose']
                    ))
                except sqlite3.Error as ex:
                    print(f"Error inserting SETA data: {ex}")
            print(f"Successfully imported {len(setas_data)} records for SETAs.")
        except Exception as e:
            print(f"Error importing SETAs: {e}")

        # --- Import Universities (Hardcoded Rich Data) ---
        try:
            c.execute("DELETE FROM universities")
            universities_data = [
                {
                    "university_name": "University of Cape Town (UCT)",
                    "province": "Western Cape",
                    "website": "www.uct.ac.za",
                    "physical_address": "Rondebosch, Cape Town, 7700",
                    "tel": "021 650 9111",
                    "email": "admission@uct.ac.za",
                    "specialties": "Research Excellence, Commerce, Law, Engineering, Health Sciences, Humanities.",
                    "courses": "Actuarial Science, MBChB (Medicine), Chemical Engineering, LLB (Law), Computer Science, Psychology."
                },
                {
                    "university_name": "University of the Witwatersrand (Wits)",
                    "province": "Gauteng",
                    "website": "www.wits.ac.za",
                    "physical_address": "1 Jan Smuts Avenue, Braamfontein, Johannesburg, 2000",
                    "tel": "011 717 1000",
                    "email": "admission.central@wits.ac.za",
                    "specialties": "Mining Engineering, Health Sciences, Business, Social Sciences, Science.",
                    "courses": "Aeronautical Engineering, Mining Engineering, Data Science, Accounting, Clinical Medical Practice."
                },
                {
                    "university_name": "University of Pretoria (UP)",
                    "province": "Gauteng",
                    "website": "www.up.ac.za",
                    "physical_address": "Lynnwood Rd, Hatfield, Pretoria, 0002",
                    "tel": "012 420 4111",
                    "email": "csc@up.ac.za",
                    "specialties": "Veterinary Science (Onderstepoort), Engineering, Law, Health Sciences, Theology.",
                    "courses": "BVSc (Veterinary Science), BEng (Electrical/Civil/Mechanical), LLB, BCom (Investment Management), Informatics."
                },
                {
                    "university_name": "Stellenbosch University (SU)",
                    "province": "Western Cape",
                    "website": "www.sun.ac.za",
                    "physical_address": "Stellenbosch, 7600",
                    "tel": "021 808 9111",
                    "email": "info@sun.ac.za",
                    "specialties": "AgriSciences, Viticulture and Oenology, Engineering, Science, Arts.",
                    "courses": "Viticulture and Oenology, Food Science, Mechatronic Engineering, International Studies, Biodiversity and Ecology."
                },
                {
                    "university_name": "University of Johannesburg (UJ)",
                    "province": "Gauteng",
                    "website": "www.uj.ac.za",
                    "physical_address": "Cnr Kingsway and University Rd, Auckland Park, Johannesburg, 2092",
                    "tel": "011 559 4555",
                    "email": "mylife@uj.ac.za",
                    "specialties": "Commerce, Art & Design, Architecture, Engineering, Humanities.",
                    "courses": "Fashion Production, Interior Design, Quantity Surveying, Optometry, Sports Science, Transport Management."
                },
                {
                    "university_name": "University of KwaZulu-Natal (UKZN)",
                    "province": "KwaZulu-Natal",
                    "website": "www.ukzn.ac.za",
                    "physical_address": "University Road, Westville, 3600",
                    "tel": "031 260 1111",
                    "email": "enquiries@ukzn.ac.za",
                    "specialties": "Health Sciences (Medicine/Pharmacy), Agriculture, Engineering, Law, Architecture.",
                    "courses": "Audiology, Speech-Language Therapy, Housing, Music, Land Surveying, Occupational Therapy."
                },
                {
                    "university_name": "University of South Africa (UNISA)",
                    "province": "Gauteng",
                    "website": "www.unisa.ac.za",
                    "physical_address": "Preller St, Muckleneuk, Pretoria, 0002",
                    "tel": "012 429 3111",
                    "email": "infoservices@unisa.ac.za",
                    "specialties": "Open Distance e-Learning (ODeL), Education, Law, Human Sciences, Agriculture.",
                    "courses": "Bachelor of Education (BEd), LLB (Law), Social Work, Environmental Management, Accounting Sciences."
                },
                {
                    "university_name": "University of the Western Cape (UWC)",
                    "province": "Western Cape",
                    "website": "www.uwc.ac.za",
                    "physical_address": "Robert Sobukwe Rd, Bellville, 7535",
                    "tel": "021 959 2911",
                    "email": "admissions@uwc.ac.za",
                    "specialties": "Community Health, Dentistry, Law, Arts, Economic and Management Sciences.",
                    "courses": "BDS (Dentistry), Nursing, Complementary Health Sciences, Public Health, Women’s and Gender Studies."
                },
                {
                    "university_name": "University of the Free State (UFS)",
                    "province": "Free State",
                    "website": "www.ufs.ac.za",
                    "physical_address": "205 Nelson Mandela Dr, Park West, Bloemfontein, 9301",
                    "tel": "051 401 9111",
                    "email": "info@ufs.ac.za",
                    "specialties": "Agriculture, Law, Theology, Humanities, Education.",
                    "courses": "Agriculture (Genetics), Forensic Sciences, Drama and Theatre Arts, Philosophy, Strategic Management."
                },
                {
                    "university_name": "Nelson Mandela University (NMU)",
                    "province": "Eastern Cape",
                    "website": "www.mandela.ac.za",
                    "physical_address": "University Way, Summerstrand, Gqeberha, 6001",
                    "tel": "041 504 1111",
                    "email": "info@mandela.ac.za",
                    "specialties": "Marine Studies, Engineering, Health Sciences, Business, Arts.",
                    "courses": "Oceanography, Mechatronics, Pharmacy, Human Movement Science, Architectural Technology."
                },
                {
                    "university_name": "Rhodes University (RU)",
                    "province": "Eastern Cape",
                    "website": "www.ru.ac.za",
                    "physical_address": "Drostdy Rd, Grahamstown, Makhanda, 6139",
                    "tel": "046 603 8111",
                    "email": "registrar@ru.ac.za",
                    "specialties": "Journalism and Media Studies, Pharmacy, Humanities, Science, Law.",
                    "courses": "Journalism, BPharm (Pharmacy), Marine Biology, Classical Studies, Drama."
                },
                {
                    "university_name": "University of Fort Hare (UFH)",
                    "province": "Eastern Cape",
                    "website": "www.ufh.ac.za",
                    "physical_address": "1 King Williamstown Rd, Alice, 5700",
                    "tel": "040 602 2011",
                    "email": "admissions@ufh.ac.za",
                    "specialties": "Social Sciences, Law, Agriculture, Management & Commerce, Education.",
                    "courses": "Politics, Agricultural Economics, Law, Public Management, Fine Arts."
                },
                {
                    "university_name": "University of Limpopo (UL)",
                    "province": "Limpopo",
                    "website": "www.ul.ac.za",
                    "physical_address": "Old Mamre Rd, Sovenga, 0727",
                    "tel": "015 268 9111",
                    "email": "enrolment@ul.ac.za",
                    "specialties": "Humanities, Science & Agriculture, Management & Law, Health Sciences.",
                    "courses": "MBChB (Medicine), Optometry, Water and Sanitation, Criminology, Media Studies."
                },
                {
                    "university_name": "University of Venda (UNIVEN)",
                    "province": "Limpopo",
                    "website": "www.univen.ac.za",
                    "physical_address": "University Road, Thohoyandou, 0950",
                    "tel": "015 962 8000",
                    "email": "admissions@univen.ac.za",
                    "specialties": "Environmental Sciences, Agriculture, Health Sciences, Law, Management.",
                    "courses": "Ecology, Rural Development, Nursing, Criminal Justice, Youth Development."
                },
                {
                    "university_name": "University of Zululand (UNIZULU)",
                    "province": "KwaZulu-Natal",
                    "website": "www.unizulu.ac.za",
                    "physical_address": "Kwa-Dlangezwa, 3886",
                    "tel": "035 902 6000",
                    "email": "registrar@unizulu.ac.za",
                    "specialties": "Commerce, Administration and Law, Education, Humanities and Social Sciences, Science and Agriculture.",
                    "courses": "Logistics Management, Consumer Sciences, Tourism, Hydrology, Social Work."
                },
                {
                    "university_name": "Walter Sisulu University (WSU)",
                    "province": "Eastern Cape",
                    "website": "www.wsu.ac.za",
                    "physical_address": "Nelson Mandela Dr, Mthatha, 5117",
                    "tel": "047 502 2844",
                    "email": "info@wsu.ac.za",
                    "specialties": "Health Sciences, Business, Management Sciences and Law, Education, Science, Engineering and Technology.",
                    "courses": "Clinical Medicine, Internal Audit, Building Science, Fashion Design, Hospitality Management."
                },
                {
                    "university_name": "Sefako Makgatho Health Sciences University (SMU)",
                    "province": "Gauteng",
                    "website": "www.smu.ac.za",
                    "physical_address": "Molotlegi St, Ga-Rankuwa, Pretoria, 0208",
                    "tel": "012 521 4111",
                    "email": "apply@smu.ac.za",
                    "specialties": "Medicine, Pharmacy, Nursing, Physiotherapy, Occupational Therapy.",
                    "courses": "MBChB (Medicine), BPharm (Pharmacy), Nursing, Physiotherapy, Dietetics, Radiography."
                },
                {
                    "university_name": "Sol Plaatje University (SPU)",
                    "province": "Northern Cape",
                    "website": "www.spu.ac.za",
                    "physical_address": "Chapel St, Kimberley, 8301",
                    "tel": "053 491 0000",
                    "email": "enquiries@spu.ac.za",
                    "specialties": "Data Science, Heritage Studies, Education, Humanities, Natural and Applied Sciences.",
                    "courses": "Data Science, Heritage Studies, Creative Writing, ICT (Applications Development), BSc (Biological Sciences)."
                },
                {
                    "university_name": "University of Mpumalanga (UMP)",
                    "province": "Mpumalanga",
                    "website": "www.ump.ac.za",
                    "physical_address": "Bester St, Mbombela, 1200",
                    "tel": "013 002 0001",
                    "email": "info@ump.ac.za",
                    "specialties": "Agricultural Management, Hospitality Management, Education, Environmental Science.",
                    "courses": "Agricultural Management, Nature Conservation, Hospitality Management, BEd (Foundation Phase), BSc (General)."
                },
                {
                    "university_name": "Tshwane University of Technology (TUT)",
                    "province": "Gauteng",
                    "website": "www.tut.ac.za",
                    "physical_address": "Staatsartillerie Rd, Pretoria West, 0183",
                    "tel": "012 382 5911",
                    "email": "general@tut.ac.za",
                    "specialties": "Engineering Technologies, ICT, Arts and Design, Humanities, Management Sciences.",
                    "courses": "Software Engineering, Multimedia Design, Film and Television Production, Forensic Investigation, Mechatronics."
                },
                {
                    "university_name": "Cape Peninsula University of Technology (CPUT)",
                    "province": "Western Cape",
                    "website": "www.cput.ac.za",
                    "physical_address": "Keizersgracht St, District Six, Cape Town, 8001",
                    "tel": "021 959 6767",
                    "email": "info@cput.ac.za",
                    "specialties": "Applied Sciences, Business and Management Sciences, Education, Engineering, Health and Wellness Sciences.",
                    "courses": "Analytical Chemistry, Biotechnology, Food Technology, Maritime Studies, Industrial Design, Jewellery Design."
                },
                {
                    "university_name": "Durban University of Technology (DUT)",
                    "province": "KwaZulu-Natal",
                    "website": "www.dut.ac.za",
                    "physical_address": "41 Steve Biko Rd, Musgrave, Durban, 4001",
                    "tel": "031 373 2000",
                    "email": "info@dut.ac.za",
                    "specialties": "Arts and Design, Accounting and Informatics, Applied Sciences, Engineering and the Built Environment, Health Sciences.",
                    "courses": "Graphic Design, Video Technology, Somatology, Chiropractic, Emergency Medical Care, Nautical Science."
                },
                {
                    "university_name": "Vaal University of Technology (VUT)",
                    "province": "Gauteng",
                    "website": "www.vut.ac.za",
                    "physical_address": "Andries Potgieter Blvd, Vanderbijlpark, 1911",
                    "tel": "016 950 9000",
                    "email": "admissions@vut.ac.za",
                    "specialties": "Engineering and Technology, Applied and Computer Sciences, Management Sciences, Human Sciences.",
                    "courses": "Metallurgical Engineering, Polymer Technology, Logistics, Public Relations Management, Safety Management."
                },
                {
                    "university_name": "Central University of Technology (CUT)",
                    "province": "Free State",
                    "website": "www.cut.ac.za",
                    "physical_address": "20 Pres Brand St, Bloemfontein Central, Bloemfontein, 9301",
                    "tel": "051 507 3911",
                    "email": "info@cut.ac.za",
                    "specialties": "Engineering, Information Technology, Applied Sciences, Health and Environmental Sciences.",
                    "courses": "Renewable Energy Technologies, Biomedical Technology, Tourism Management, Radiography, Construction Management."
                },
                {
                    "university_name": "Mangosuthu University of Technology (MUT)",
                    "province": "KwaZulu-Natal",
                    "website": "www.mut.ac.za",
                    "physical_address": "511 Mangosuthu Hwy, Umlazi, 4031",
                    "tel": "031 907 7111",
                    "email": "info@mut.ac.za",
                    "specialties": "Engineering, Management Sciences, Natural Sciences.",
                    "courses": "Surveying, Building Services, Marketing, Community Extension, Nature Conservation, Environmental Health."
                },
                {
                    "university_name": "North-West University (NWU)",
                    "province": "North West",
                    "website": "www.nwu.ac.za",
                    "physical_address": "11 Hoffman St, Potchefstroom, 2531",
                    "tel": "018 299 1111",
                    "email": "studies@nwu.ac.za",
                    "specialties": "Education, Economic and Management Sciences, Engineering, Health Sciences, Law, Theology.",
                    "courses": "Chartered Accountancy, Nuclear Engineering, Pharmacy, Psychology, Sports Science, Music."
                }
            ]

            for uni in universities_data:
                try:
                    c.execute('''
                        INSERT INTO universities (province, university_name, website, physical_address, tel, email, specialties, courses)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                    ''', (
                        uni['province'],
                        uni['university_name'],
                        uni['website'],
                        uni['physical_address'],
                        uni['tel'],
                        uni['email'],
                        uni['specialties'],
                        uni['courses']
                    ))
                except sqlite3.Error as ex:
                    print(f"Error inserting university data: {ex}")
            print(f"Successfully imported {len(universities_data)} records for Universities.")
        except Exception as e:
            print(f"Error importing universities: {e}")

        # --- Import Legit Learnerships (SETA & Private) ---
        try:
            c.execute("DELETE FROM learnerships")
            learnerships_data = [
                # 5 SETA Learnerships
                {
                    "title": "Letsema Learnership 2024/25",
                    "company": "BankSETA",
                    "stipend": 4500.0,
                    "duration": "12 Months",
                    "nqf_level": 5,
                    "location": "National",
                    "url": "https://www.bankseta.org.za",
                    "phone_number": "011 372 3300"
                },
                {
                    "title": "IT Systems Support Learnership",
                    "company": "MICT SETA",
                    "stipend": 5000.0,
                    "duration": "12 Months",
                    "nqf_level": 4,
                    "location": "Gauteng",
                    "url": "https://www.mict.org.za",
                    "phone_number": "011 207 2600"
                },
                {
                    "title": "Business Administration Services",
                    "company": "Services SETA",
                    "stipend": 3500.0,
                    "duration": "12 Months",
                    "nqf_level": 4,
                    "location": "Western Cape",
                    "url": "https://www.servicesseta.org.za",
                    "phone_number": "011 276 9600"
                },
                {
                    "title": "Livestock Production Learnership",
                    "company": "AgriSETA",
                    "stipend": 3000.0,
                    "duration": "12 Months",
                    "nqf_level": 3,
                    "location": "Mpumalanga",
                    "url": "https://www.agriseta.co.za",
                    "phone_number": "012 301 5600"
                },
                {
                    "title": "Freight Handling Learnership",
                    "company": "TETA",
                    "stipend": 3200.0,
                    "duration": "12 Months",
                    "nqf_level": 3,
                    "location": "KwaZulu-Natal",
                    "url": "https://www.teta.org.za",
                    "phone_number": "011 577 7000"
                },
                # 5 Private Sector Learnerships
                {
                    "title": "WorkReady Learnership Program",
                    "company": "Standard Bank",
                    "stipend": 6000.0,
                    "duration": "12 Months",
                    "nqf_level": 5,
                    "location": "Gauteng",
                    "url": "https://www.standardbank.com/sbcps/careers",
                    "phone_number": "0860 123 000"
                },
                {
                    "title": "Wealth Management Learnership",
                    "company": "Discovery",
                    "stipend": 5500.0,
                    "duration": "12 Months",
                    "nqf_level": 5,
                    "location": "Sandton",
                    "url": "https://www.discovery.co.za/corporate/careers",
                    "phone_number": "011 529 2888"
                },
                {
                    "title": "Early Careers Internship",
                    "company": "Vodacom",
                    "stipend": 7500.0,
                    "duration": "12 Months",
                    "nqf_level": 6,
                    "location": "Midrand",
                    "url": "https://www.vodacom.com/careers.php",
                    "phone_number": "011 653 5000"
                },
                {
                    "title": "YES Retail Learnership",
                    "company": "Shoprite",
                    "stipend": 3500.0,
                    "duration": "12 Months",
                    "nqf_level": 2,
                    "location": "National",
                    "url": "https://www.shopriteholdings.co.za/careers.html",
                    "phone_number": "0800 010 709"
                },
                {
                    "title": "Banking Operations Learnership",
                    "company": "Nedbank",
                    "stipend": 5000.0,
                    "duration": "12 Months",
                    "nqf_level": 5,
                    "location": "Gauteng",
                    "url": "https://www.nedbank.co.za/careers",
                    "phone_number": "011 294 4444"
                }
            ]
            for l in learnerships_data:
                c.execute('''
                    INSERT INTO learnerships (title, company, stipend, duration, nqf_level, location, url, phone_number)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                ''', (l['title'], l['company'], l['stipend'], l['duration'], l['nqf_level'], l['location'], l['url'], l['phone_number']))
            print(f"Successfully imported {len(learnerships_data)} legit learnerships.")
        except Exception as e:
            print(f"Error importing learnerships: {e}")

        # --- Import Legit Bursaries (Government & Private) ---
        try:
            c.execute("DELETE FROM bursaries")
            bursaries_data = [
                # Government Bursaries
                {
                    "name": "NSFAS Financial Aid",
                    "provider": "Department of Higher Education",
                    "field_of_study": "All Undergraduate Fields",
                    "eligibility": "South African citizens, Household income < R350k",
                    "closing_date": "2025-01-31",
                    "link": "https://www.nsfas.org.za",
                    "phone_number": "0800 067 327"
                },
                {
                    "name": "Funza Lushaka Bursary",
                    "provider": "Department of Basic Education",
                    "field_of_study": "Education / Teaching",
                    "eligibility": "South African citizens, committed to teaching in public schools",
                    "closing_date": "2025-01-26",
                    "link": "https://www.funzalushaka.doe.gov.za",
                    "phone_number": "012 357 3000"
                },
                {
                    "name": "Provincial Health Bursary",
                    "provider": "Department of Health",
                    "field_of_study": "Medicine, Nursing, Pharmacy",
                    "eligibility": "Residents of specific provinces, merit-based",
                    "closing_date": "2025-09-30",
                    "link": "https://www.health.gov.za",
                    "phone_number": "012 395 8000"
                },
                {
                    "name": "CSIR Undergraduate Bursary",
                    "provider": "CSIR / DSI",
                    "field_of_study": "Science, Engineering, Technology (STEM)",
                    "eligibility": "South African citizens, strong academic record in Math/Science",
                    "closing_date": "2024-09-30",
                    "link": "https://www.csir.co.za/bursaries",
                    "phone_number": "012 841 2911"
                },
                # Private Sector Bursaries
                {
                    "name": "Allan Gray Orbis Fellowship",
                    "provider": "Allan Gray Orbis Foundation",
                    "field_of_study": "Commerce, Engineering, Science, Arts, Law",
                    "eligibility": "Entrepreneurial mindset, high academic achievement",
                    "closing_date": "2025-05-31",
                    "link": "https://www.allangrayorbis.org",
                    "phone_number": "0861 239 237"
                },
                {
                    "name": "Investec Bursary",
                    "provider": "Investec Bank",
                    "field_of_study": "Commerce, IT, Engineering",
                    "eligibility": "Financial need with high academic potential",
                    "closing_date": "2025-08-31",
                    "link": "https://www.investec.com/bursary",
                    "phone_number": "011 286 7000"
                },
                {
                    "name": "Old Mutual Actuarial Bursary",
                    "provider": "Old Mutual",
                    "field_of_study": "Actuarial Science, Accounting",
                    "eligibility": "A in Mathematics, high academic merit",
                    "closing_date": "2025-07-31",
                    "link": "https://www.oldmutual.co.za/careers/bursaries",
                    "phone_number": "021 509 9111"
                }
            ]
            for b in bursaries_data:
                c.execute('''
                    INSERT INTO bursaries (name, provider, field_of_study, eligibility, closing_date, link, phone_number)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                ''', (b['name'], b['provider'], b['field_of_study'], b['eligibility'], b['closing_date'], b['link'], b['phone_number']))
            print(f"Successfully imported {len(bursaries_data)} legit bursaries.")
        except Exception as e:
            print(f"Error importing bursaries: {e}")

        # # --- Insert sample career_paths data ---
        # try:
        #     career_paths_data = [
        #         ('101817', 'Software Developer', 800000, 'High', 'Python, Java, SQL'),
        #         ('63333', 'Network Engineer', 600000, 'Medium', 'Cisco, Juniper, TCP/IP'),
        #     ]
        #     for qual_id, career_name, salary, demand, skills in career_paths_data:
        #         try:
        #             c.execute("INSERT INTO career_paths (qualification_id, career_name, average_salary, job_demand, required_skills) VALUES (?, ?, ?, ?, ?)",
        #                       (qual_id, career_name, salary, demand, skills))
        #         except sqlite3.IntegrityError:
        #             print(f"Duplicate career path: {career_name}. Skipping.")
        #     print(f"Successfully inserted {len(career_paths_data)} sample career paths.")
        # except Exception as e:
        #     print(f"Error inserting sample career paths: {e}")

        conn.commit()
        print("All data imported and changes committed.")

    except Exception as e:
        print(f"An error occurred during data import: {e}")
        if conn:
            conn.rollback()
            print("Transaction rolled back.")
    finally:
        if conn:
            conn.close()
            print("Database connection closed.")

if __name__ == '__main__':
    import_data()
    print("Data import process completed.")