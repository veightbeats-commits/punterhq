from flask import Flask, jsonify, render_template, request, g, send_from_directory, session, redirect, url_for, flash
import os
import json
from werkzeug.security import check_password_hash, generate_password_hash
from functools import wraps
from extensions import db # Import db from extensions.py
from models import * # Import all models from models.py

app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'a_default_secret_key_if_not_set')
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///safelearn.db') # Fallback to SQLite for local dev if URL not set
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

UPLOAD_FOLDER = os.environ.get('UPLOAD_FOLDER', 'uploads')
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# --- Database Functions (Modified for SQLAlchemy session) ---
def query_db(query, args=(), one=False):
    # This function will be replaced by direct SQLAlchemy queries/models
    # For now, it will use a raw connection if SQLAlchemy isn't fully set up yet for all queries
    # or if raw SQL is explicitly needed.
    # We will aim to remove this helper function entirely.
    if "sqlite" in app.config['SQLALCHEMY_DATABASE_URI']: # Legacy SQLite path
        conn = db.engine.raw_connection()
        cursor = conn.cursor()
        cursor.execute(query, args)
        rv = cursor.fetchall()
        conn.close()
        return (rv[0] if rv else None) if one else rv
    else: # Attempt to use SQLAlchemy engine for raw SQL
        with db.engine.connect() as conn:
            result = conn.execute(db.text(query), args)
            if one:
                row = result.fetchone()
                return dict(row._mapping) if row else None
            else:
                return [dict(row._mapping) for row in result.fetchall()]


# --- Auth Decorator ---
def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    return decorated_function

def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session or not session.get('is_admin'):
            flash("You do not have permission to access this page.")
            return redirect(url_for('index'))
        return f(*args, **kwargs)
    return decorated_function

# --- Frontend Routes ---
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/landing')
def landing():
    return render_template('landing.html')

@app.route('/smarty/<filename>')
def smarty_video(filename):
    return send_from_directory(os.path.join(app.root_path, 'smarty'), filename)

@app.route('/favicon.ico')
def favicon():
    return send_from_directory(os.path.join(app.root_path, 'static'),
                               'favicon.ico', mimetype='image/vnd.microsoft.icon')

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

@app.route('/login')
def login_page():
    return render_template('login.html')

@app.route('/register')
def register_page():
    return render_template('register.html')

@app.route('/profile')
@login_required
def profile():
    return render_template('profile.html')

# --- Admin Routes ---
@app.route('/admin')
@admin_required
def admin_dashboard():
    return render_template('admin.html')

# --- API Endpoints ---

# A dictionary to store user's favorite items
# In a real application, this would be stored in the database
user_favorites = {}

# --- USER AUTHENTICATION AND DATA ---
 
@app.route('/api/register', methods=['POST'])
def api_register():
    username = request.form['username']
    email = request.form['email']
    password = request.form['password']
    
    # Check if user or email already exists
    existing_user = User.query.filter((User.username == username) | (User.email == email)).first()
    if existing_user:
        flash("Username or email already exists.")
        return redirect(url_for('register_page'))

    new_user = User(username=username, email=email)
    new_user.set_password(password)
    
    db.session.add(new_user)
    db.session.commit()
    
    # Send a welcome message
    subject = "Welcome to SafeLearner.online!"
    message_body = f"Hi {username},\n\nWelcome to SafeLearner.online! We are excited to have you on board. Explore our platform to find qualifications, career paths, and educational resources tailored for you.\n\nHappy learning!\n\nThe SafeLearner.online Team"
    
    welcome_message = Message(
        recipient_id=new_user.id,
        sender_name="SafeLearner.online Team",
        subject=subject,
        message=message_body,
        is_from_contact_form=False
    )
    db.session.add(welcome_message)
    db.session.commit()
    
    flash(f"Welcome, {username}! Your registration was successful. A welcome message has been sent to your profile inbox.", 'success')
    return redirect(url_for('login_page'))

@app.route('/api/login', methods=['POST'])
def login():
    username = request.form['username']
    password = request.form['password']
    
    user = User.query.filter_by(username=username).first()

    if not user:
        flash('User not found.')
        return redirect(url_for('login_page'))

    if user.check_password(password):
        session['user_id'] = user.id
        session['username'] = user.username
        session['is_admin'] = user.is_admin
        
        if user.is_admin:
            return redirect(url_for('admin_dashboard'))
        return redirect(url_for('index'))
    
    flash('Incorrect password.')
    return redirect(url_for('login_page'))

@app.route('/api/logout')
def logout():
    session.clear()
    return redirect(url_for('index'))

# Blog Posts
@app.route('/api/posts', methods=['GET'])
def get_posts():
    posts = Post.query.order_by(Post.created_at.desc()).all()
    return jsonify([{
        'id': post.id,
        'title': post.title,
        'content': post.content,
        'image_path': post.image_path,
        'likes': post.likes,
        'created_at': post.created_at.isoformat() # Convert datetime to string
    } for post in posts])

@app.route('/api/posts', methods=['POST'])
@admin_required
def create_post():
    title = request.form['title']
    content = request.form['content']
    image = request.files.get('image')
    image_path = None

    if image:
        if not os.path.exists(app.config['UPLOAD_FOLDER']):
            os.makedirs(app.config['UPLOAD_FOLDER'])
        image_path = os.path.join(app.config['UPLOAD_FOLDER'], image.filename)
        image.save(image_path)

    new_post = Post(title=title, content=content, image_path=image_path)
    db.session.add(new_post)
    db.session.commit()
    
    return redirect(url_for('admin_dashboard'))

@app.route('/api/posts/<int:post_id>/like', methods=['POST'])
def like_post(post_id):
    post = Post.query.get_or_404(post_id)
    post.likes += 1
    db.session.commit()
    return jsonify({"message": "Post liked"})

@app.route('/api/posts/<int:post_id>/comment', methods=['POST'])
@login_required
def add_comment(post_id):
    comment_text = request.json.get('comment')
    parent_id = request.json.get('parent_id')

    if not comment_text:
        return jsonify({"message": "Comment cannot be empty"}), 400

    new_comment = Comment(
        post_id=post_id,
        user_id=session['user_id'],
        comment=comment_text,
        parent_id=parent_id
    )
    db.session.add(new_comment)
    db.session.commit()
    return jsonify({"message": "Comment added"})

@app.route('/api/posts/<int:post_id>/comments', methods=['GET'])
def get_comments(post_id):
    comments = db.session.query(Comment, User.username)\
                     .join(User, Comment.user_id == User.id)\
                     .filter(Comment.post_id == post_id)\
                     .order_by(Comment.created_at.asc()).all()
    
    comments_data = []
    for comment, username in comments:
        comment_dict = {
            'id': comment.id,
            'post_id': comment.post_id,
            'user_id': comment.user_id,
            'parent_id': comment.parent_id,
            'comment': comment.comment,
            'created_at': comment.created_at.isoformat(),
            'username': username
        }
        comments_data.append(comment_dict)
    
    return jsonify(comments_data)

@app.route('/api/posts/<int:post_id>', methods=['DELETE'])
@admin_required
def delete_post(post_id):
    post = Post.query.get_or_404(post_id)
    db.session.delete(post)
    db.session.commit()
    return jsonify({"message": "Post and associated comments deleted successfully"}), 200

@app.route('/api/posts/<int:post_id>', methods=['PUT', 'POST'])
@admin_required
def update_post(post_id):
    post = Post.query.get_or_404(post_id)

    title = request.form['title']
    content = request.form['content']
    image = request.files.get('image')
    image_path = post.image_path # Start with existing image path

    if image:
        if not os.path.exists(app.config['UPLOAD_FOLDER']):
            os.makedirs(app.config['UPLOAD_FOLDER'])
        image_path = os.path.join(app.config['UPLOAD_FOLDER'], image.filename)
        image.save(image_path)
        # Delete old image if it exists and a new one is uploaded
        if post.image_path and os.path.exists(post.image_path) and post.image_path != image_path:
            os.remove(post.image_path)

    post.title = title
    post.content = content
    post.image_path = image_path
    
    db.session.commit()
    return jsonify({"message": "Post updated successfully"}), 200


# Qualifications
@app.route('/api/qualifications', methods=['GET'])
def get_qualifications():
    search_query = request.args.get('q', '')
    nqf_level = request.args.get('level', type=int)
    qual_type = request.args.get('type', '')
    category = request.args.get('category', '')

    qualifications_query = Qualification.query

    if search_query:
        qualifications_query = qualifications_query.filter(
            (Qualification.title.ilike(f"%{search_query}%")) |
            (Qualification.saqa_id.ilike(f"%{search_query}%")) |
            (Qualification.description.ilike(f"%{search_query}%"))
        )
    if nqf_level:
        qualifications_query = qualifications_query.filter(Qualification.nqf_level == nqf_level)
    if qual_type:
        qualifications_query = qualifications_query.filter(Qualification.type.ilike(f"%{qual_type}%"))
    if category:
        qualifications_query = qualifications_query.filter(Qualification.category.ilike(f"%{category}%"))

    qualifications = qualifications_query.all()
    return jsonify([{
        'id': qual.id,
        'saqa_id': qual.saqa_id,
        'title': qual.title,
        'type': qual.type,
        'nqf_level': qual.nqf_level,
        'credits': qual.credits,
        'duration': qual.duration,
        'category': qual.category,
        'status': qual.status,
        'registration_date': qual.registration_date,
        'end_date': qual.end_date,
        'saqa_link': qual.saqa_link,
        'description': qual.description,
        'entry_requirements': qual.entry_requirements,
        'components': qual.components,
        'quality_partner': qual.quality_partner,
        'attachments': qual.attachments,
        'created_at': qual.created_at.isoformat() if qual.created_at else None
    } for qual in qualifications])

@app.route('/api/qualifications/<saqa_id>', methods=['GET'])
def get_qualification(saqa_id):
    qualification = Qualification.query.filter_by(saqa_id=saqa_id).first()
    if qualification:
        return jsonify({
            'id': qualification.id,
            'saqa_id': qualification.saqa_id,
            'title': qualification.title,
            'type': qualification.type,
            'nqf_level': qualification.nqf_level,
            'credits': qualification.credits,
            'duration': qualification.duration,
            'category': qualification.category,
            'status': qualification.status,
            'registration_date': qualification.registration_date,
            'end_date': qualification.end_date,
            'saqa_link': qualification.saqa_link,
            'description': qualification.description,
            'entry_requirements': qualification.entry_requirements,
            'components': qualification.components,
            'quality_partner': qualification.quality_partner,
            'attachments': qualification.attachments,
            'created_at': qualification.created_at.isoformat() if qualification.created_at else None
        })
    return jsonify({"message": "Qualification not found"}), 404

# Skills Programmes
@app.route('/api/skills-programmes', methods=['GET'])
def get_skills_programmes():
    search_query = request.args.get('q', '')
    nqf_level = request.args.get('level', type=int)
    category = request.args.get('category', '')

    skills_query = SkillsProgramme.query

    if search_query:
        skills_query = skills_query.filter(
            (SkillsProgramme.title.ilike(f"%{search_query}%")) |
            (SkillsProgramme.programme_id.ilike(f"%{search_query}%")) |
            (SkillsProgramme.description.ilike(f"%{search_query}%"))
        )
    if nqf_level:
        skills_query = skills_query.filter(SkillsProgramme.nqf_level == nqf_level)
    if category:
        skills_query = skills_query.filter(SkillsProgramme.category.ilike(f"%{category}%"))

    skills_programmes = skills_query.all()
    return jsonify([{
        'id': skill.id,
        'programme_id': skill.programme_id,
        'title': skill.title,
        'nqf_level': skill.nqf_level,
        'credits': skill.credits,
        'duration': skill.duration,
        'category': skill.category,
        'status': skill.status,
        'description': skill.description,
        'entry_requirements': skill.entry_requirements,
        'attachments': skill.attachments,
        'created_at': skill.created_at.isoformat() if skill.created_at else None
    } for skill in skills_programmes])

@app.route('/api/skills-programmes/<programme_id>', methods=['GET'])
def get_skill_programme(programme_id):
    skill_programme = SkillsProgramme.query.filter_by(programme_id=programme_id).first()
    if skill_programme:
        return jsonify({
            'id': skill_programme.id,
            'programme_id': skill_programme.programme_id,
            'title': skill_programme.title,
            'nqf_level': skill_programme.nqf_level,
            'credits': skill_programme.credits,
            'duration': skill_programme.duration,
            'category': skill_programme.category,
            'status': skill_programme.status,
            'description': skill_programme.description,
            'entry_requirements': skill_programme.entry_requirements,
            'attachments': skill_programme.attachments,
            'created_at': skill_programme.created_at.isoformat() if skill_programme.created_at else None
        })
    return jsonify({"message": "Skills Programme not found"}), 404

# Accredited Schools
@app.route('/api/schools', methods=['GET'])
def get_schools():
    search_query = request.args.get('q', '')
    location = request.args.get('location', '')
    
    schools_query = AccreditedSchool.query

    if search_query:
        schools_query = schools_query.filter(
            (AccreditedSchool.school_name.ilike(f"%{search_query}%")) |
            (AccreditedSchool.accreditation_number.ilike(f"%{search_query}%"))
        )
    if location:
        schools_query = schools_query.filter(
            (AccreditedSchool.city.ilike(f"%{location}%")) |
            (AccreditedSchool.province.ilike(f"%{location}%")) |
            (AccreditedSchool.physical_address.ilike(f"%{location}%"))
        )

    schools = schools_query.all()
    return jsonify([{
        'id': school.id,
        'school_name': school.school_name,
        'accreditation_number': school.accreditation_number,
        'status': school.status,
        'physical_address': school.physical_address,
        'postal_address': school.postal_address,
        'province': school.province,
        'city': school.city,
        'contact_number': school.contact_number,
        'email': school.email,
        'website': school.website,
        'accreditation_date': school.accreditation_date,
        'expiry_date': school.expiry_date,
        'qualifications_accredited_for': school.qualifications_accredited_for,
        'created_at': school.created_at.isoformat() if school.created_at else None
    } for school in schools])

@app.route('/api/schools/<accreditation_number>', methods=['GET'])
def get_school(accreditation_number):
    school = AccreditedSchool.query.filter_by(accreditation_number=accreditation_number).first()
    if school:
        return jsonify({
            'id': school.id,
            'school_name': school.school_name,
            'accreditation_number': school.accreditation_number,
            'status': school.status,
            'physical_address': school.physical_address,
            'postal_address': school.postal_address,
            'province': school.province,
            'city': school.city,
            'contact_number': school.contact_number,
            'email': school.email,
            'website': school.website,
            'accreditation_date': school.accreditation_date,
            'expiry_date': school.expiry_date,
            'qualifications_accredited_for': school.qualifications_accredited_for,
            'created_at': school.created_at.isoformat() if school.created_at else None
        })
    return jsonify({"message": "School not found"}), 404

# General Search (across all databases)
@app.route('/api/search', methods=['GET'])
def general_search():
    search_query = request.args.get('q', '')
    if not search_query:
        return jsonify({"message": "Please provide a search query"}), 400

    results = []

    # Search Qualifications
    qual_results = Qualification.query.filter(
        (Qualification.title.ilike(f"%{search_query}%")) |
        (Qualification.saqa_id.ilike(f"%{search_query}%")) |
        (Qualification.description.ilike(f"%{search_query}%"))
    ).all()
    results.extend([{
        'type': 'qualification',
        'id': qual.saqa_id,
        'title': qual.title,
        'nqf_level': qual.nqf_level,
        'credits': qual.credits
    } for qual in qual_results])

    # Search Skills Programmes
    skill_results = SkillsProgramme.query.filter(
        (SkillsProgramme.title.ilike(f"%{search_query}%")) |
        (SkillsProgramme.programme_id.ilike(f"%{search_query}%")) |
        (SkillsProgramme.description.ilike(f"%{search_query}%"))
    ).all()
    results.extend([{
        'type': 'skill_programme',
        'id': skill.programme_id,
        'title': skill.title,
        'nqf_level': skill.nqf_level,
        'credits': skill.credits
    } for skill in skill_results])

    # Search Accredited Schools
    school_results = AccreditedSchool.query.filter(
        (AccreditedSchool.school_name.ilike(f"%{search_query}%")) |
        (AccreditedSchool.accreditation_number.ilike(f"%{search_query}%")) |
        (AccreditedSchool.physical_address.ilike(f"%{search_query}%"))
    ).all()
    results.extend([{
        'type': 'school',
        'id': school.accreditation_number,
        'title': school.school_name,
        'city': school.city,
        'province': school.province
    } for school in school_results])

    return jsonify(results)

# Accommodations
@app.route('/api/accommodations', methods=['GET'])
def get_accommodations():
    accommodations = Accommodation.query.order_by(Accommodation.province, Accommodation.city, Accommodation.accommodation_name).all()
    
    # Group by province
    grouped_by_province = {}
    for accom in accommodations:
        prov = accom.province or "Other"
        if prov not in grouped_by_province:
            grouped_by_province[prov] = []
        grouped_by_province[prov].append({
            'id': accom.id,
            'province': accom.province,
            'suburb': accom.suburb,
            'city': accom.city,
            'accommodation_name': accom.accommodation_name,
            'payment_nsfas': accom.payment_nsfas,
            'payment_bursary': accom.payment_bursary,
            'payment_cash': accom.payment_cash,
            'monthly_pay': accom.monthly_pay,
            'created_at': accom.created_at.isoformat() if accom.created_at else None
        })
        
    return jsonify(grouped_by_province)

@app.route('/api/accommodations', methods=['POST'])
@admin_required
def create_accommodation():
    new_accommodation = Accommodation(
        province=request.form.get('province'),
        accommodation_name=request.form.get('accommodation_name'),
        suburb=request.form.get('suburb'),
        city=request.form.get('city'),
        monthly_pay=float(request.form.get('monthly_pay', 0)),
        payment_nsfas=request.form.get('payment_nsfas'),
        payment_bursary=request.form.get('payment_bursary'),
        payment_cash=request.form.get('payment_cash')
    )
    db.session.add(new_accommodation)
    db.session.commit()
    return jsonify({"message": "Accommodation created successfully"}), 201

@app.route('/api/accommodations/<int:accommodation_id>', methods=['GET'])
def get_single_accommodation(accommodation_id):
    accom = Accommodation.query.get(accommodation_id)
    if not accom:
        return jsonify({"message": "Accommodation not found"}), 404
    return jsonify({
        'id': accom.id,
        'province': accom.province,
        'suburb': accom.suburb,
        'city': accom.city,
        'accommodation_name': accom.accommodation_name,
        'payment_nsfas': accom.payment_nsfas,
        'payment_bursary': accom.payment_bursary,
        'payment_cash': accom.payment_cash,
        'monthly_pay': accom.monthly_pay,
        'created_at': accom.created_at.isoformat() if accom.created_at else None
    })

@app.route('/api/accommodations/<int:accommodation_id>', methods=['POST'])
@admin_required
def update_accommodation(accommodation_id):
    accom = Accommodation.query.get_or_404(accommodation_id)

    accom.province = request.form.get('province')
    accom.accommodation_name = request.form.get('accommodation_name')
    accom.suburb = request.form.get('suburb')
    accom.city = request.form.get('city')
    accom.monthly_pay = float(request.form.get('monthly_pay', 0))
    accom.payment_nsfas = request.form.get('payment_nsfas')
    accom.payment_bursary = request.form.get('payment_bursary')
    accom.payment_cash = request.form.get('payment_cash')
    
    db.session.commit()
    return jsonify({"message": "Accommodation updated successfully"}), 200

@app.route('/api/accommodations/<int:accommodation_id>', methods=['DELETE'])
@admin_required
def delete_accommodation(accommodation_id):
    accom = Accommodation.query.get_or_404(accommodation_id)
    db.session.delete(accom)
    db.session.commit()
    return jsonify({"message": "Accommodation deleted successfully"}), 200

# TVET Colleges
@app.route('/api/tvet-colleges', methods=['GET'])
def get_tvet_colleges():
    colleges = TvetCollege.query.order_by(TvetCollege.province, TvetCollege.college_name).all()
    
    # Group by province
    grouped_by_province = {}
    for college in colleges:
        province = college.province
        if province not in grouped_by_province:
            grouped_by_province[province] = []
        grouped_by_province[province].append({
            'id': college.id,
            'province': college.province,
            'college_name': college.college_name,
            'postal_address': college.postal_address,
            'physical_address': college.physical_address,
            'tel': college.tel,
            'web': college.web,
            'created_at': college.created_at.isoformat() if college.created_at else None
        })
        
    return jsonify(grouped_by_province)

@app.route('/api/training-providers', methods=['GET'])
def get_training_providers():
    try:
        providers = AccreditedSchool.query.order_by(AccreditedSchool.province, AccreditedSchool.school_name).all()
        grouped = {}
        
        sa_provinces = [
            'Gauteng', 'Western Cape', 'Eastern Cape', 'KwaZulu-Natal', 
            'Free State', 'North West', 'Northern Cape', 'Mpumalanga', 'Limpopo'
        ]
        
        for p in providers:
            raw_prov = p.province or 'Uncategorized'
            normalized_prov = 'Uncategorized'
            
            for prov in sa_provinces:
                if prov.lower() in raw_prov.lower():
                    normalized_prov = prov
                    break
            
            if normalized_prov not in grouped:
                grouped[normalized_prov] = []
            grouped[normalized_prov].append({
                'id': p.id,
                'school_name': p.school_name,
                'accreditation_number': p.accreditation_number,
                'status': p.status,
                'physical_address': p.physical_address,
                'postal_address': p.postal_address,
                'province': p.province,
                'city': p.city,
                'contact_number': p.contact_number,
                'email': p.email,
                'website': p.website,
                'accreditation_date': p.accreditation_date,
                'expiry_date': p.expiry_date,
                'qualifications_accredited_for': p.qualifications_accredited_for,
                'created_at': p.created_at.isoformat() if p.created_at else None
            })
            
        return jsonify(grouped)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/occupational-qualifications', methods=['GET'])
def get_occupational_qualifications():
    try:
        quals = Qualification.query.order_by(Qualification.title).all()
        skills = SkillsProgramme.query.order_by(SkillsProgramme.title).all()
        return jsonify({
            "qualifications": [{
                'id': q.id,
                'saqa_id': q.saqa_id,
                'title': q.title,
                'type': q.type,
                'nqf_level': q.nqf_level,
                'credits': q.credits,
                'duration': q.duration,
                'category': q.category,
                'status': q.status,
                'registration_date': q.registration_date,
                'end_date': q.end_date,
                'saqa_link': q.saqa_link,
                'description': q.description,
                'entry_requirements': q.entry_requirements,
                'components': q.components,
                'quality_partner': q.quality_partner,
                'attachments': q.attachments,
                'created_at': q.created_at.isoformat() if q.created_at else None
            } for q in quals],
            "skills_programmes": [{
                'id': s.id,
                'programme_id': s.programme_id,
                'title': s.title,
                'nqf_level': s.nqf_level,
                'credits': s.credits,
                'duration': s.duration,
                'category': s.category,
                'status': s.status,
                'description': s.description,
                'entry_requirements': s.entry_requirements,
                'attachments': s.attachments,
                'created_at': s.created_at.isoformat() if s.created_at else None
            } for s in skills]
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# SETAs
@app.route('/api/setas', methods=['GET'])
def get_setas():
    try:
        setas = Seta.query.order_by(Seta.seta_name).all()
        quals = Qualification.query.with_entities(Qualification.title, Qualification.quality_partner).all()
        
        # Prepare a list of dictionaries for setas
        seta_list = [{
            'id': s.id,
            'seta_name': s.seta_name,
            'postal_address': s.postal_address,
            'physical_address': s.physical_address,
            'telephone': s.telephone,
            'website': s.website,
            'description': s.description,
            'purpose': s.purpose,
            'created_at': s.created_at.isoformat() if s.created_at else None
        } for s in setas]
        
        # Match qualifications to SETAs
        import re
        for seta in seta_list:
            name = seta['seta_name']
            # Extract abbreviation from parenthesis, e.g., "Agricultural Sector ... (AgriSETA)"
            match = re.search(r'\((.*?)\)', name)
            abbrev = match.group(1).strip().upper() if match else name.upper()
            
            linked_quals = []
            for q_title, q_partner in quals:
                qp = (q_partner or "").strip().upper()
                if abbrev in qp or qp in abbrev: # Flexible matching
                    linked_quals.append(q_title)
            
            seta['linked_qualifications'] = sorted(list(set(linked_quals)))[:30] # Limit to 30 for UI sanity
            
        return jsonify(seta_list)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/universities', methods=['GET'])
def get_universities():
    try:
        universities = University.query.order_by(University.province, University.university_name).all()
        
        # Group by province
        grouped_by_province = {}
        for uni in universities:
            province = uni.province if uni.province is not None else 'Uncategorized'
            if province not in grouped_by_province:
                grouped_by_province[province] = []
            grouped_by_province[province].append({
                'id': uni.id,
                'province': uni.province,
                'university_name': uni.university_name,
                'website': uni.website,
                'physical_address': uni.physical_address,
                'tel': uni.tel,
                'email': uni.email,
                'specialties': uni.specialties,
                'courses': uni.courses,
                'created_at': uni.created_at.isoformat() if uni.created_at else None
            })
            
        return jsonify(grouped_by_province)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/learnerships', methods=['GET'])
def get_learnerships():
    learnerships = Learnership.query.order_by(Learnership.created_at.desc()).all()
    return jsonify([{
        'id': learn.id,
        'title': learn.title,
        'company': learn.company,
        'stipend': learn.stipend,
        'duration': learn.duration,
        'nqf_level': learn.nqf_level,
        'location': learn.location,
        'url': learn.url,
        'phone_number': learn.phone_number,
        'picture_path': learn.picture_path,
        'created_at': learn.created_at.isoformat() if learn.created_at else None
    } for learn in learnerships])

@app.route('/api/learnerships', methods=['POST'])
@admin_required
def create_learnership():
    try:
        picture = request.files.get('picture')
        picture_path = None
        if picture:
            if not os.path.exists(app.config['UPLOAD_FOLDER']):
                os.makedirs(app.config['UPLOAD_FOLDER'])
            picture_path = os.path.join(app.config['UPLOAD_FOLDER'], picture.filename)
            picture.save(picture_path)

        new_learnership = Learnership(
            title=request.form['title'],
            company=request.form['company'],
            stipend=request.form.get('stipend', type=float),
            duration=request.form['duration'],
            nqf_level=request.form.get('nqf_level', type=int),
            location=request.form['location'],
            url=request.form['url'],
            phone_number=request.form['phone_number'],
            picture_path=picture_path
        )
        db.session.add(new_learnership)
        db.session.commit()
        return jsonify({"message": "Learnership created successfully"}), 201
    except Exception as e:
        db.session.rollback() # Rollback in case of error
        return jsonify({"error": str(e)}), 500
@app.route('/api/learnerships/<int:learnership_id>', methods=['GET'])
def get_single_learnership(learnership_id):
    learn = Learnership.query.get(learnership_id)
    if not learn:
        return jsonify({"message": "Learnership not found"}), 404
    return jsonify({
        'id': learn.id,
        'title': learn.title,
        'company': learn.company,
        'stipend': learn.stipend,
        'duration': learn.duration,
        'nqf_level': learn.nqf_level,
        'location': learn.location,
        'url': learn.url,
        'phone_number': learn.phone_number,
        'picture_path': learn.picture_path,
        'created_at': learn.created_at.isoformat() if learn.created_at else None
    })

@app.route('/api/learnerships/<int:learnership_id>', methods=['POST'])
@admin_required
def update_learnership(learnership_id):
    try:
        learn = Learnership.query.get_or_404(learnership_id)
            
        picture = request.files.get('picture')
        picture_path = learn.picture_path
        if picture:
            if not os.path.exists(app.config['UPLOAD_FOLDER']):
                os.makedirs(app.config['UPLOAD_FOLDER'])
            picture_path = os.path.join(app.config['UPLOAD_FOLDER'], picture.filename)
            picture.save(picture_path)

        learn.title = request.form['title']
        learn.company = request.form['company']
        learn.stipend = request.form.get('stipend', type=float)
        learn.duration = request.form['duration']
        learn.nqf_level = request.form.get('nqf_level', type=int)
        learn.location = request.form['location']
        learn.url = request.form['url']
        learn.phone_number = request.form['phone_number']
        learn.picture_path = picture_path
        
        db.session.commit()
        return jsonify({"message": "Learnership updated successfully"}), 200
    except Exception as e:
        db.session.rollback() # Rollback in case of error
        return jsonify({"error": str(e)}), 500

@app.route('/api/learnerships/<int:learnership_id>', methods=['DELETE'])
@admin_required
def delete_learnership(learnership_id):
    learn = Learnership.query.get_or_404(learnership_id)
    db.session.delete(learn)
    db.session.commit()
    return jsonify({"message": "Learnership deleted successfully"}), 200

# Reviews
@app.route('/api/reviews', methods=['POST'])
@login_required
def submit_review():
    user_id = session['user_id']
    item_id = request.json.get('item_id')
    item_type = request.json.get('item_type') # e.g., 'school', 'accommodation', 'qualification', 'tvet_college', 'seta'
    rating = request.json.get('rating', type=int)
    comment = request.json.get('comment')

    if not all([item_id, item_type, rating]) or not (1 <= rating <= 5):
        return jsonify({"message": "Missing required fields or invalid rating (1-5)"}), 400

    new_review = Review(
        user_id=user_id,
        item_id=item_id,
        item_type=item_type,
        rating=rating,
        comment=comment
    )
    db.session.add(new_review)
    db.session.commit()
    return jsonify({"message": "Review submitted successfully"}), 201

@app.route('/api/reviews/<item_type>/<item_id>', methods=['GET'])
def get_reviews_for_item(item_type, item_id):
    # Fetch reviews for the specific item
    reviews = db.session.query(Review, User.username)\
                      .join(User, Review.user_id == User.id)\
                      .filter(Review.item_type == item_type, Review.item_id == item_id)\
                      .order_by(Review.created_at.desc()).all()
    
    # Calculate average rating
    avg_rating_result = db.session.query(db.func.avg(Review.rating))\
                               .filter(Review.item_type == item_type, Review.item_id == item_id).scalar()
    
    reviews_data = []
    for review, username in reviews:
        reviews_data.append({
            'id': review.id,
            'user_id': review.user_id,
            'item_id': review.item_id,
            'item_type': review.item_type,
            'rating': review.rating,
            'comment': review.comment,
            'created_at': review.created_at.isoformat(),
            'username': username
        })

    return jsonify({
        "reviews": reviews_data,
        "average_rating": avg_rating_result if avg_rating_result else 0
    })

@app.route('/api/users/<int:user_id>/reviews', methods=['GET'])
@login_required
def get_user_reviews(user_id):
    if session['user_id'] != user_id and not session.get('is_admin'):
        return jsonify({"message": "Unauthorized"}), 403

    reviews = db.session.query(Review, User.username)\
                     .join(User, Review.user_id == User.id)\
                     .filter(Review.user_id == user_id)\
                     .order_by(Review.created_at.desc()).all()
    
    reviews_data = []
    for review, username in reviews:
        reviews_data.append({
            'id': review.id,
            'user_id': review.user_id,
            'item_id': review.item_id,
            'item_type': review.item_type,
            'rating': review.rating,
            'comment': review.comment,
            'created_at': review.created_at.isoformat(),
            'username': username
        })
    return jsonify(reviews_data)

# Favorites
@app.route('/api/favorites', methods=['POST'])
@login_required
def add_favorite():
    user_id = session['user_id']
    item_id = request.json.get('item_id')
    item_type = request.json.get('item_type')

    if not all([item_id, item_type]):
        return jsonify({"message": "Missing item_id or item_type"}), 400

    # Check if already favorited
    existing_favorite = UserFavorite.query.filter_by(
        user_id=user_id, item_id=item_id, item_type=item_type
    ).first()
    if existing_favorite:
        return jsonify({"message": "Item already favorited"}), 409 # Conflict

    new_favorite = UserFavorite(
        user_id=user_id,
        item_id=item_id,
        item_type=item_type
    )
    db.session.add(new_favorite)
    db.session.commit()
    return jsonify({"message": "Item added to favorites"}), 201

@app.route('/api/favorites/<item_type>/<item_id>', methods=['DELETE'])
@login_required
def remove_favorite(item_type, item_id):
    user_id = session['user_id']

    favorite = UserFavorite.query.filter_by(
        user_id=user_id, item_id=item_id, item_type=item_type
    ).first()

    if not favorite:
        return jsonify({"message": "Favorite not found or not owned by user"}), 404
        
    db.session.delete(favorite)
    db.session.commit()
    return jsonify({"message": "Item removed from favorites"}), 200

@app.route('/api/users/<int:user_id>/favorites', methods=['GET'])
@login_required
def get_user_favorites(user_id):
    if session['user_id'] != user_id and not session.get('is_admin'):
        return jsonify({"message": "Unauthorized"}), 403

    favorites = UserFavorite.query.filter_by(user_id=user_id).all()
    
    detailed_favorites = []
    for fav in favorites:
        item_details = None
        item_dict = {
            'id': fav.id,
            'user_id': fav.user_id,
            'item_id': fav.item_id,
            'item_type': fav.item_type,
            'created_at': fav.created_at.isoformat() if fav.created_at else None
        }

        if fav.item_type == 'qualification':
            item_details = Qualification.query.filter_by(saqa_id=fav.item_id).first()
            if item_details:
                item_dict.update({
                    'saqa_id': item_details.saqa_id,
                    'title': item_details.title,
                })
        elif fav.item_type == 'skill_programme':
            item_details = SkillsProgramme.query.filter_by(programme_id=fav.item_id).first()
            if item_details:
                item_dict.update({
                    'programme_id': item_details.programme_id,
                    'title': item_details.title,
                })
        elif fav.item_type == 'school':
            item_details = AccreditedSchool.query.get(fav.item_id)
            if item_details:
                item_dict.update({
                    'school_name': item_details.school_name,
                    'city': item_details.city,
                    'province': item_details.province
                })
        elif fav.item_type == 'accommodation':
            item_details = Accommodation.query.get(fav.item_id)
            if item_details:
                item_dict.update({
                    'accommodation_name': item_details.accommodation_name,
                    'suburb': item_details.suburb,
                    'city': item_details.city
                })
        elif fav.item_type == 'tvet_college':
            item_details = TvetCollege.query.get(fav.item_id)
            if item_details:
                item_dict.update({
                    'college_name': item_details.college_name,
                    'province': item_details.province,
                    'city': item_details.city
                })
        elif fav.item_type == 'seta':
            item_details = Seta.query.get(fav.item_id)
            if item_details:
                item_dict.update({
                    'seta_name': item_details.seta_name,
                })
        elif fav.item_type == 'university':
            item_details = University.query.get(fav.item_id)
            if item_details:
                item_dict.update({
                    'university_name': item_details.university_name,
                })
        elif fav.item_type == 'learnership':
            item_details = Learnership.query.get(fav.item_id)
            if item_details:
                item_dict.update({
                    'title': item_details.title,
                    'company': item_details.company
                })
        elif fav.item_type == 'career_path':
            item_details = CareerPath.query.get(fav.item_id)
            if item_details:
                item_dict.update({
                    'career_name': item_details.career_name,
                })
        elif fav.item_type == 'bursary':
            item_details = Bursary.query.get(fav.item_id)
            if item_details:
                item_dict.update({
                    'name': item_details.name,
                    'provider': item_details.provider
                })

        detailed_favorites.append(item_dict)
            
    return jsonify(detailed_favorites)

# Bursaries
@app.route('/api/bursaries', methods=['GET'])
def get_bursaries():
    bursaries = Bursary.query.order_by(Bursary.closing_date.desc(), Bursary.name).all()
    return jsonify([{
        'id': b.id,
        'name': b.name,
        'provider': b.provider,
        'field_of_study': b.field_of_study,
        'eligibility': b.eligibility,
        'closing_date': b.closing_date,
        'link': b.link,
        'phone_number': b.phone_number,
        'picture_path': b.picture_path,
        'created_at': b.created_at.isoformat() if b.created_at else None
    } for b in bursaries])

@app.route('/api/bursaries', methods=['POST'])
@admin_required
def create_bursary():
    try:
        picture = request.files.get('picture')
        picture_path = None
        if picture:
            if not os.path.exists(app.config['UPLOAD_FOLDER']):
                os.makedirs(app.config['UPLOAD_FOLDER'])
            picture_path = os.path.join(app.config['UPLOAD_FOLDER'], picture.filename)
            picture.save(picture_path)

        new_bursary = Bursary(
            name=request.form['name'],
            provider=request.form['provider'],
            field_of_study=request.form['field_of_study'],
            eligibility=request.form['eligibility'],
            closing_date=request.form['closing_date'],
            link=request.form['link'],
            phone_number=request.form['phone_number'],
            picture_path=picture_path
        )
        db.session.add(new_bursary)
        db.session.commit()
        return jsonify({"message": "Bursary created successfully"}), 201
    except Exception as e:
        db.session.rollback() # Rollback in case of error
        return jsonify({"error": str(e)}), 500
@app.route('/api/bursaries/<int:bursary_id>', methods=['GET'])
def get_single_bursary(bursary_id):
    bursary = Bursary.query.get(bursary_id)
    if not bursary:
        return jsonify({"message": "Bursary not found"}), 404
    return jsonify({
        'id': bursary.id,
        'name': bursary.name,
        'provider': bursary.provider,
        'field_of_study': bursary.field_of_study,
        'eligibility': bursary.eligibility,
        'closing_date': bursary.closing_date,
        'link': bursary.link,
        'phone_number': bursary.phone_number,
        'picture_path': bursary.picture_path,
        'created_at': bursary.created_at.isoformat() if bursary.created_at else None
    })

@app.route('/api/bursaries/<int:bursary_id>', methods=['POST'])
@admin_required
def update_bursary(bursary_id):
    try:
        bursary = Bursary.query.get_or_404(bursary_id)
            
        picture = request.files.get('picture')
        picture_path = bursary.picture_path
        if picture:
            if not os.path.exists(app.config['UPLOAD_FOLDER']):
                os.makedirs(app.config['UPLOAD_FOLDER'])
            picture_path = os.path.join(app.config['UPLOAD_FOLDER'], picture.filename)
            picture.save(picture_path)

        bursary.name = request.form['name']
        bursary.provider = request.form['provider']
        bursary.field_of_study = request.form['field_of_study']
        bursary.eligibility = request.form['eligibility']
        bursary.closing_date = request.form['closing_date']
        bursary.link = request.form['link']
        bursary.phone_number = request.form['phone_number']
        bursary.picture_path = picture_path
        
        db.session.commit()
        return jsonify({"message": "Bursary updated successfully"}), 200
    except Exception as e:
        db.session.rollback() # Rollback in case of error
        return jsonify({"error": str(e)}), 500

@app.route('/api/bursaries/<int:bursary_id>', methods=['DELETE'])
@admin_required
def delete_bursary(bursary_id):
    bursary = Bursary.query.get_or_404(bursary_id)
    db.session.delete(bursary)
    db.session.commit()
    return jsonify({"message": "Bursary deleted successfully"}), 200

# Career Paths
@app.route('/api/career-paths', methods=['GET'])
def get_career_paths():
    career_paths = CareerPath.query.order_by(CareerPath.career_name).all()
    return jsonify([{
        'id': cp.id,
        'qualification_id': cp.qualification_id,
        'career_name': cp.career_name,
        'average_salary': cp.average_salary,
        'job_demand': cp.job_demand,
        'required_skills': cp.required_skills
    } for cp in career_paths])

@app.route('/api/career-paths/<int:career_id>', methods=['GET'])
def get_career_path(career_id):
    career_path = CareerPath.query.get(career_id)
    if career_path:
        return jsonify({
            'id': career_path.id,
            'qualification_id': career_path.qualification_id,
            'career_name': career_path.career_name,
            'average_salary': career_path.average_salary,
            'job_demand': career_path.job_demand,
            'required_skills': career_path.required_skills
        })
    return jsonify({"message": "Career Path not found"}), 404

@app.route('/api/qualifications/<saqa_id>/career-paths', methods=['GET'])
def get_career_paths_for_qualification(saqa_id):
    career_paths = CareerPath.query.filter_by(qualification_id=saqa_id).all()
    return jsonify([{
        'id': cp.id,
        'qualification_id': cp.qualification_id,
        'career_name': cp.career_name,
        'average_salary': cp.average_salary,
        'job_demand': cp.job_demand,
        'required_skills': cp.required_skills
    } for cp in career_paths])

# The Mind - Recommendation Engine
@app.route('/api/mind/save', methods=['POST'])
@login_required
def save_mind_result():
    user_id = session['user_id']
    result_json = json.dumps(request.json)
    
    existing_result = UserMindResult.query.filter_by(user_id=user_id).first()
    
    if existing_result:
        existing_result.result_json = result_json
        existing_result.created_at = datetime.utcnow()
    else:
        new_result = UserMindResult(user_id=user_id, result_json=result_json)
        db.session.add(new_result)
        
    db.session.commit()
    return jsonify({"message": "Result saved to profile"}), 201

@app.route('/api/users/<int:user_id>/mind', methods=['GET'])
@login_required
def get_mind_result(user_id):
    if session['user_id'] != user_id and not session.get('is_admin'):
        return jsonify({"message": "Unauthorized"}), 403

    result = UserMindResult.query.filter_by(user_id=user_id).order_by(UserMindResult.created_at.desc()).first()
    if result:
        return jsonify({
            "result": json.loads(result.result_json),
            "created_at": result.created_at.isoformat()
        })
    return jsonify({"message": "No results found"}), 404

@app.route('/api/mind/recommend', methods=['POST'])
def mind_recommend():
    data = request.json
    highest_grade = data.get('highest_grade')
    interests = data.get('interests', [])
    goal = data.get('goal')
    location = data.get('location')
    path_preference = data.get('path_preference')
    institution_type = data.get('institution_type')

    suggestions = {
        "paths": [],
        "schools": [],
        "insight_message": ""
    }
    
    # --- 1. Filter Paths (Qualifications & Skills) ---
    qual_query = Qualification.query
    skill_query = SkillsProgramme.query

    # Map Interests to Categories/Descriptions
    interest_filters = []
    for interest in interests:
        interest_filters.append(Qualification.category.ilike(f"%{interest}%"))
        interest_filters.append(Qualification.title.ilike(f"%{interest}%"))
        interest_filters.append(Qualification.description.ilike(f"%{interest}%"))

    # SMME / Business Goal Logic
    if goal == 'business':
        interest_filters.append(Qualification.title.ilike('%Business%'))
        interest_filters.append(Qualification.title.ilike('%Management%'))
        interest_filters.append(Qualification.title.ilike('%Venture%'))

    if interest_filters:
        qual_query = qual_query.filter(db.or_(*interest_filters))
        skill_query = skill_query.filter(db.or_(*interest_filters))

    # Map Highest Grade to NQF Level (Heuristic)
    min_nqf = 1
    if highest_grade == 'Grade 9 or lower': min_nqf = 1
    elif highest_grade == 'Grade 10': min_nqf = 2
    elif highest_grade == 'Grade 11': min_nqf = 3
    elif highest_grade == 'Grade 12 (Matric)': min_nqf = 4
    elif highest_grade == 'Diploma / Certificate': min_nqf = 5
    elif highest_grade == 'Degree': min_nqf = 7
    
    qual_query = qual_query.filter(Qualification.nqf_level >= min_nqf, Qualification.nqf_level <= min_nqf + 2)
    skill_query = skill_query.filter(SkillsProgramme.nqf_level >= min_nqf, SkillsProgramme.nqf_level <= min_nqf + 2)
    
    # Fetch Qualifications
    quals = qual_query.order_by(db.func.random()).limit(3).all()
    suggestions['paths'].extend([{
        'type': 'qualification',
        'id': q.saqa_id,
        'title': q.title,
        'nqf_level': q.nqf_level,
        'credits': q.credits,
        'quality_partner': q.quality_partner
    } for q in quals])

    # Fetch Skills Programmes
    if goal in ['skill', 'upskill', 'bursary', 'business']:
        skills = skill_query.order_by(db.func.random()).limit(2).all()
        suggestions['paths'].extend([{
            'type': 'skill_programme',
            'id': s.programme_id,
            'title': s.title,
            'nqf_level': s.nqf_level,
            'credits': s.credits
        } for s in skills])

    # --- 2. Filter Schools & Universities ---
    suggestions['schools'] = []
    
    # Institution Type Logic
    fetch_unis = institution_type in ['university', 'any', '']
    fetch_tvet = institution_type in ['tvet', 'any', '']
    fetch_private = institution_type in ['private', 'any', '']

    if fetch_private:
        schools = AccreditedSchool.query.filter(AccreditedSchool.province.ilike(f"%{location}%")).order_by(db.func.random()).limit(2).all()
        suggestions['schools'].extend([{
            'type': 'school',
            'id': s.id,
            'school_name': s.school_name,
            'city': s.city,
            'province': s.province
        } for s in schools])

    if fetch_unis and (min_nqf >= 3 or goal in ['degree', 'upskill', 'business']):
        unis = University.query.filter(University.province.ilike(f"%{location}%")).order_by(db.func.random()).limit(2).all()
        suggestions['schools'].extend([{
            'type': 'university',
            'id': u.id,
            'university_name': u.university_name,
            'province': u.province,
            'specialties': u.specialties
        } for u in unis])

    if fetch_tvet:
        tvets = TvetCollege.query.filter(TvetCollege.province.ilike(f"%{location}%")).order_by(db.func.random()).limit(2).all()
        suggestions['schools'].extend([{
            'type': 'tvet',
            'id': t.id,
            'college_name': t.college_name,
            'province': t.province,
            'web': t.web
        } for t in tvets])

    # --- 3. Filter Bursaries (Financial Status) ---
    financial_status = data.get('financial_status')
    suggestions['bursaries'] = []
    if financial_status in ['partial', 'full', 'bursary'] or goal == 'bursary':
       nsfas = Bursary.query.filter(Bursary.name.ilike('%NSFAS%')).limit(1).all()
       others = Bursary.query.filter(Bursary.name.not_ilike('%NSFAS%')).order_by(db.func.random()).limit(2).all()
       suggestions['bursaries'] = [{
           'type': 'bursary',
           'id': b.id,
           'name': b.name,
           'provider': b.provider,
           'field_of_study': b.field_of_study
       } for b in (nsfas + others)]

    # --- 4. Learnerships ---
    suggestions['learnerships'] = []
    if goal in ['skill', 'upskill', 'bursary', 'business'] or min_nqf <= 4:
        seta_learns = Learnership.query.filter(
            (Learnership.location.ilike(f"%{location}%")) | (Learnership.location == 'National'),
            Learnership.company.ilike('%SETA%')
        ).order_by(db.func.random()).limit(2).all()
        priv_learns = Learnership.query.filter(
            (Learnership.location.ilike(f"%{location}%")) | (Learnership.location == 'National'),
            Learnership.company.not_ilike('%SETA%')
        ).order_by(db.func.random()).limit(1).all()
        suggestions['learnerships'] = [{
            'type': 'learnership',
            'id': l.id,
            'title': l.title,
            'company': l.company,
            'location': l.location
        } for l in (seta_learns + priv_learns)]

    # --- 5. Accommodations ---
    suggestions['accommodations'] = []
    # Try to find accommodations in the SAME province as the study location
    accom_query = Accommodation.query.filter(Accommodation.province.ilike(f"%{location}%")).order_by(db.func.random()).limit(3)
    accommodations = accom_query.all()
    
    # Fallback: if no accommodations in that province, try city/suburb LIKE location (though less likely now)
    if not accommodations:
        accom_query = Accommodation.query.filter(db.or_(Accommodation.city.ilike(f"%{location}%"), Accommodation.suburb.ilike(f"%{location}%"))).order_by(db.func.random()).limit(3)
        accommodations = accom_query.all()
        
    suggestions['accommodations'] = [{
        'type': 'accommodation',
        'id': a.id,
        'accommodation_name': a.accommodation_name,
        'city': a.city,
        'province': a.province
    } for a in accommodations]

    # --- 6. Special Business Support (SETAs) & Governing Bodies ---
    suggestions['business_support'] = []
    if goal == 'business':
        # Prioritize key SETAs for SMMEs
        business_setas = Seta.query.filter(
            db.or_(
                Seta.seta_name.ilike('%Services%'),
                Seta.seta_name.ilike('%Wholesale%'),
                Seta.seta_name.ilike('%Banking%'),
                Seta.seta_name.ilike('%Finance%')
            )
        ).limit(4).all()
        suggestions['business_support'] = [{
            'type': 'seta',
            'id': s.id,
            'seta_name': s.seta_name
        } for s in business_setas]

    # --- 6b. Link Governing Bodies (SETAs) for recommended paths ---
    suggestions['governing_bodies'] = []
    quality_partners = set()
    for item in suggestions['paths']:
        if item.get('quality_partner'):
            quality_partners.add(item['quality_partner'])
    
    if quality_partners:
        import re
        all_setas = Seta.query.all()
        matched_setas = []
        for seta in all_setas:
            name = seta.seta_name
            match = re.search(r'\((.*?)\)', name)
            abbrev = match.group(1).strip().upper() if match else name.upper()
            if any(abbrev in qp.upper() or qp.upper() in abbrev for qp in quality_partners):
                seta_dict = {
                    'type': 'seta',
                    'id': seta.id,
                    'seta_name': seta.seta_name
                }
                matched_setas.append(seta_dict)
        suggestions['governing_bodies'] = matched_setas[:3]


    # --- 7. Insight Message ---
    if not any([suggestions['paths'], suggestions['schools'], suggestions['bursaries']]):
         suggestions['insight_message'] = f"We couldn't find exact matches in {location}, but keep exploring!"
    else:
        # Check if we have a top university to mention its specialty
        top_uni = next((s for s in suggestions['schools'] if s.get('type') == 'university'), None)
        
        if goal == 'business':
              msg = "Starting a business is a bold move! We've found qualifications and SETAs that support entrepreneurs and SMMEs."
              if top_uni and top_uni.get('specialties'):
                  msg += f" {top_uni['university_name']} is particularly strong in {top_uni['specialties'].split(',')[0]}."
              suggestions['insight_message'] = msg
        else:
              interest_str = interests[0] if interests else "your profile"
              msg = f"Based on your interest in {interest_str}, here are your personalized recommendations."
              if top_uni and top_uni.get('specialties'):
                  msg += f" {top_uni['university_name']} is a great choice with its focus on {top_uni['specialties'].split(',')[0]}."
              suggestions['insight_message'] = msg

    return jsonify(suggestions)

# Forum
@app.route('/api/forum/questions', methods=['GET'])
def get_forum_questions():
    questions = db.session.query(ForumQuestion, User.username)\
                        .join(User, ForumQuestion.user_id == User.id)\
                        .order_by(ForumQuestion.created_at.desc()).all()
    
    questions_data = []
    for question, username in questions:
        questions_data.append({
            'id': question.id,
            'user_id': question.user_id,
            'provider_id': question.provider_id,
            'title': question.title,
            'body': question.body,
            'created_at': question.created_at.isoformat(),
            'username': username
        })
    return jsonify(questions_data)

@app.route('/api/forum/questions', methods=['POST'])
@login_required
def post_forum_question():
    user_id = session['user_id']
    title = request.json.get('title')
    body = request.json.get('body')
    provider_id = request.json.get('provider_id') # Optional: if question is directed to a specific provider

    if not all([title, body]):
        return jsonify({"message": "Title and body are required"}), 400

    new_question = ForumQuestion(
        user_id=user_id,
        provider_id=provider_id,
        title=title,
        body=body
    )
    db.session.add(new_question)
    db.session.commit()
    return jsonify({"message": "Question posted successfully"}), 201

@app.route('/api/forum/questions/<int:question_id>', methods=['GET'])
def get_single_forum_question(question_id):
    question = ForumQuestion.query.get_or_404(question_id)

    answers = db.session.query(ForumAnswer, User.username)\
                      .join(User, ForumAnswer.user_id == User.id)\
                      .filter(ForumAnswer.question_id == question_id)\
                      .order_by(ForumAnswer.created_at.asc()).all()
    
    answers_data = []
    for answer, username in answers:
        answers_data.append({
            'id': answer.id,
            'question_id': answer.question_id,
            'user_id': answer.user_id,
            'body': answer.body,
            'is_provider_answer': answer.is_provider_answer,
            'created_at': answer.created_at.isoformat(),
            'username': username
        })
    
    return jsonify({
        "question": {
            'id': question.id,
            'user_id': question.user_id,
            'provider_id': question.provider_id,
            'title': question.title,
            'body': question.body,
            'created_at': question.created_at.isoformat(),
            'username': question.user.username # Access username via relationship
        },
        "answers": answers_data
    })

@app.route('/api/forum/questions/<int:question_id>/answers', methods=['POST'])
@login_required
def post_forum_answer(question_id):
    user_id = session['user_id']
    body = request.json.get('body')
    is_provider_answer = request.json.get('is_provider_answer', False) # For designated provider accounts

    if not body:
        return jsonify({"message": "Answer body is required"}), 400

    # Check if question exists
    if not ForumQuestion.query.get(question_id):
        return jsonify({"message": "Question not found"}), 404

    new_answer = ForumAnswer(
        question_id=question_id,
        user_id=user_id,
        body=body,
        is_provider_answer=is_provider_answer
    )
    db.session.add(new_answer)
    db.session.commit()
    return jsonify({"message": "Answer posted successfully"}), 201

@app.route('/api/users/<int:user_id>/forum/questions', methods=['GET'])
@login_required
def get_user_forum_questions(user_id):
    if session['user_id'] != user_id and not session.get('is_admin'):
        return jsonify({"message": "Unauthorized"}), 403
    questions = db.session.query(ForumQuestion, User.username)\
                        .join(User, ForumQuestion.user_id == User.id)\
                        .filter(ForumQuestion.user_id == user_id)\
                        .order_by(ForumQuestion.created_at.desc()).all()
    
    questions_data = []
    for question, username in questions:
        questions_data.append({
            'id': question.id,
            'user_id': question.user_id,
            'provider_id': question.provider_id,
            'title': question.title,
            'body': question.body,
            'created_at': question.created_at.isoformat(),
            'username': username
        })
    return jsonify(questions_data)

@app.route('/api/users/<int:user_id>/forum/answers', methods=['GET'])
@login_required
def get_user_forum_answers(user_id):
    if session['user_id'] != user_id and not session.get('is_admin'):
        return jsonify({"message": "Unauthorized"}), 403
    answers = db.session.query(ForumAnswer, ForumQuestion.title, User.username)\
                      .join(ForumQuestion, ForumAnswer.question_id == ForumQuestion.id)\
                      .join(User, ForumAnswer.user_id == User.id)\
                      .filter(ForumAnswer.user_id == user_id)\
                      .order_by(ForumAnswer.created_at.desc()).all()
    
    answers_data = []
    for answer, question_title, username in answers:
        answers_data.append({
            'id': answer.id,
            'question_id': answer.question_id,
            'user_id': answer.user_id,
            'body': answer.body,
            'is_provider_answer': answer.is_provider_answer,
            'created_at': answer.created_at.isoformat(),
            'question_title': question_title,
            'username': username
        })
    return jsonify(answers_data)


# Statistics
@app.route('/api/stats', methods=['GET'])
def get_stats():
    qual_count = db.session.query(db.func.count(Qualification.id)).scalar()
    skill_count = db.session.query(db.func.count(SkillsProgramme.id)).scalar()
    school_count = db.session.query(db.func.count(AccreditedSchool.id)).scalar()
    accom_count = db.session.query(db.func.count(Accommodation.id)).scalar()
    bursary_count = db.session.query(db.func.count(Bursary.id)).scalar()
    learn_count = db.session.query(db.func.count(Learnership.id)).scalar()
    user_count = db.session.query(db.func.count(User.id)).scalar()
    
    return jsonify({
        "total_qualifications": qual_count,
        "total_skills_programmes": skill_count,
        "total_accredited_schools": school_count,
        "total_accommodations": accom_count,
        "total_bursaries": bursary_count,
        "total_learnerships": learn_count,
        "total_users": user_count
    })

# --- Messaging System API ---
@app.route('/api/contact', methods=['POST'])
def submit_contact():
    """Public endpoint for contact form submissions"""
    data = request.json
    name = data.get('name')
    email = data.get('email')
    subject = data.get('subject')
    message_body = data.get('message') # Renamed to avoid conflict with Message model

    if not all([name, email, subject, message_body]):
        return jsonify({'error': 'All fields are required'}), 400
    
    new_message = Message(
        sender_name=name,
        sender_email=email,
        subject=subject,
        message=message_body,
        is_from_contact_form=True
    )
    db.session.add(new_message)
    db.session.commit()
    
    return jsonify({'success': True, 'message': 'Message sent successfully'}), 201

@app.route('/api/admin/messages', methods=['GET'])
@admin_required
def get_admin_messages():
    """Get all messages for admin dashboard"""
    filter_type = request.args.get('filter', 'all')  # all, contact, user, unread
    
    messages_query = db.session.query(Message, User.username).outerjoin(User, Message.sender_id == User.id)
    
    # Only show messages sent to admin (recipient_id is None) or to the current admin user (if any)
    # The original query was complex, let's simplify based on typical admin message flow
    # Assuming contact form messages have recipient_id as NULL, and direct user messages have recipient_id
    messages_query = messages_query.filter(
        db.or_(Message.recipient_id == None, Message.recipient_id == session.get('user_id'))
    )
    
    if filter_type == 'contact':
        messages_query = messages_query.filter(Message.is_from_contact_form == True)
    elif filter_type == 'user':
        messages_query = messages_query.filter(Message.is_from_contact_form == False)
    elif filter_type == 'unread':
        messages_query = messages_query.filter(Message.is_read == False)
    
    messages = messages_query.order_by(Message.created_at.desc()).all()
    
    return jsonify([{
        'id': msg.id,
        'sender_id': msg.sender_id,
        'sender_name': msg.sender_name or sender_username,
        'sender_email': msg.sender_email,
        'subject': msg.subject,
        'message': msg.message,
        'is_from_contact_form': msg.is_from_contact_form,
        'is_read': msg.is_read,
        'created_at': msg.created_at.isoformat() if msg.created_at else None
    } for msg, sender_username in messages])

@app.route('/api/admin/messages/send', methods=['POST'])
@admin_required
def admin_send_message():
    """Admin sends message to a user"""
    data = request.json
    recipient_id = data.get('recipient_id')
    subject = data.get('subject')
    message_body = data.get('message')
    
    if not all([recipient_id, subject, message_body]):
        return jsonify({'error': 'All fields are required'}), 400
    
    # Verify recipient exists
    user = User.query.get(recipient_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    new_message = Message(
        sender_id=session.get('user_id'),
        recipient_id=recipient_id,
        subject=subject,
        message=message_body,
        is_from_contact_form=False
    )
    db.session.add(new_message)
    db.session.commit()
    
    return jsonify({'success': True, 'message': 'Message sent successfully'}), 201

@app.route('/api/admin/messages/<int:message_id>/read', methods=['PATCH'])
@admin_required
def mark_admin_message_read(message_id):
    """Mark a message as read/unread"""
    data = request.json
    is_read = data.get('is_read', True)
    
    message = Message.query.get_or_404(message_id)
    message.is_read = is_read
    db.session.commit()
    
    return jsonify({'success': True})

@app.route('/api/user/messages', methods=['GET'])
@login_required
def get_user_messages():
    """Get messages for logged-in user"""
    user_id = session.get('user_id')
    
    messages = db.session.query(Message, User.username)\
                       .outerjoin(User, Message.sender_id == User.id)\
                       .filter(Message.recipient_id == user_id)\
                       .order_by(Message.created_at.desc()).all()
    
    return jsonify([{
        'id': msg.id,
        'sender_name': sender_username or 'Admin', # Fallback to 'Admin' if sender_username is None (e.g., from contact form)
        'subject': msg.subject,
        'message': msg.message,
        'is_read': msg.is_read,
        'created_at': msg.created_at.isoformat() if msg.created_at else None
    } for msg, sender_username in messages])

@app.route('/api/user/messages/<int:message_id>/read', methods=['PATCH'])
@login_required
def mark_user_message_read(message_id):
    """Mark user's message as read"""
    user_id = session.get('user_id')
    
    # Verify message belongs to user
    message = Message.query.filter_by(id=message_id, recipient_id=user_id).first()
    if not message:
        return jsonify({'error': 'Message not found'}), 404
    
    message.is_read = True
    db.session.commit()
    
    return jsonify({'success': True})

@app.route('/api/users/list', methods=['GET'])
@admin_required
def get_users_list():
    """Get list of users for admin to send messages"""
    users = User.query.filter_by(is_admin=False).order_by(User.username).all()
    
    return jsonify([{
        'id': user.id,
        'username': user.username,
        'email': user.email
    } for user in users])

if __name__ == '__main__':
    app.run(debug=True, port=5001)
