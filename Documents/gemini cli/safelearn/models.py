from extensions import db
from datetime import datetime

class Qualification(db.Model):
    __tablename__ = 'qualifications'
    id = db.Column(db.Integer, primary_key=True)
    saqa_id = db.Column(db.String(255), unique=True, nullable=False)
    title = db.Column(db.Text, nullable=False)
    type = db.Column(db.String(255))
    nqf_level = db.Column(db.Integer)
    credits = db.Column(db.Integer)
    duration = db.Column(db.String(255))
    category = db.Column(db.String(255))
    status = db.Column(db.String(255))
    registration_date = db.Column(db.Text) # Storing as text for simplicity, could be Date
    end_date = db.Column(db.Text) # Storing as text for simplicity, could be Date
    saqa_link = db.Column(db.Text)
    description = db.Column(db.Text)
    entry_requirements = db.Column(db.Text)
    components = db.Column(db.Text) # Stored as comma-separated string or JSON string
    quality_partner = db.Column(db.Text)
    attachments = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f"<Qualification {self.title}>"

class SkillsProgramme(db.Model):
    __tablename__ = 'skills_programmes'
    id = db.Column(db.Integer, primary_key=True)
    programme_id = db.Column(db.String(255), unique=True)
    title = db.Column(db.Text, nullable=False)
    nqf_level = db.Column(db.Integer)
    credits = db.Column(db.Integer)
    duration = db.Column(db.String(255))
    category = db.Column(db.String(255))
    status = db.Column(db.String(255))
    description = db.Column(db.Text)
    entry_requirements = db.Column(db.Text)
    attachments = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f"<SkillsProgramme {self.title}>"

class AccreditedSchool(db.Model):
    __tablename__ = 'accredited_schools'
    id = db.Column(db.Integer, primary_key=True)
    school_name = db.Column(db.Text, nullable=False)
    accreditation_number = db.Column(db.String(255), unique=True)
    status = db.Column(db.String(255))
    physical_address = db.Column(db.Text)
    postal_address = db.Column(db.Text)
    province = db.Column(db.String(255))
    city = db.Column(db.String(255))
    contact_number = db.Column(db.String(255))
    email = db.Column(db.String(255))
    website = db.Column(db.Text)
    accreditation_date = db.Column(db.Text)
    expiry_date = db.Column(db.Text)
    qualifications_accredited_for = db.Column(db.Text) # Stored as comma-separated string or JSON string
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f"<AccreditedSchool {self.school_name}>"

class Accommodation(db.Model):
    __tablename__ = 'accommodations'
    id = db.Column(db.Integer, primary_key=True)
    province = db.Column(db.String(255))
    suburb = db.Column(db.String(255))
    city = db.Column(db.String(255))
    accommodation_name = db.Column(db.Text)
    payment_nsfas = db.Column(db.Text)
    payment_bursary = db.Column(db.Text)
    payment_cash = db.Column(db.Text)
    monthly_pay = db.Column(db.Float)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f"<Accommodation {self.accommodation_name}>"

class TvetCollege(db.Model):
    __tablename__ = 'tvet_colleges'
    id = db.Column(db.Integer, primary_key=True)
    province = db.Column(db.String(255))
    college_name = db.Column(db.Text)
    postal_address = db.Column(db.Text)
    physical_address = db.Column(db.Text)
    tel = db.Column(db.String(255))
    web = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f"<TvetCollege {self.college_name}>"

class Seta(db.Model):
    __tablename__ = 'setas'
    id = db.Column(db.Integer, primary_key=True)
    seta_name = db.Column(db.Text)
    postal_address = db.Column(db.Text)
    physical_address = db.Column(db.Text)
    telephone = db.Column(db.String(255))
    website = db.Column(db.Text)
    description = db.Column(db.Text)
    purpose = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f"<Seta {self.seta_name}>"

class University(db.Model):
    __tablename__ = 'universities'
    id = db.Column(db.Integer, primary_key=True)
    province = db.Column(db.String(255))
    university_name = db.Column(db.Text)
    website = db.Column(db.Text)
    physical_address = db.Column(db.Text)
    tel = db.Column(db.String(255))
    email = db.Column(db.String(255))
    specialties = db.Column(db.Text)
    courses = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f"<University {self.university_name}>"

class Learnership(db.Model):
    __tablename__ = 'learnerships'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.Text, nullable=False)
    company = db.Column(db.Text)
    stipend = db.Column(db.Float)
    duration = db.Column(db.String(255))
    nqf_level = db.Column(db.Integer)
    location = db.Column(db.String(255))
    url = db.Column(db.Text)
    phone_number = db.Column(db.String(255))
    picture_path = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f"<Learnership {self.title}>"

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(255), unique=True, nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    is_admin = db.Column(db.Boolean, default=False, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Required for Flask-Login
    @property
    def is_authenticated(self):
        return True

    @property
    def is_active(self):
        return True

    @property
    def is_anonymous(self):
        return False

    def get_id(self):
        return str(self.id)

    def set_password(self, password):
        from werkzeug.security import generate_password_hash
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        from werkzeug.security import check_password_hash
        return check_password_hash(self.password_hash, password)

    def __repr__(self):
        return f"<User {self.username}>"

class Review(db.Model):
    __tablename__ = 'reviews'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    item_id = db.Column(db.Text, nullable=False) # Generic ID for the item being reviewed
    item_type = db.Column(db.Text, nullable=False) # 'school', 'qualification', 'accommodation', etc.
    rating = db.Column(db.Integer, nullable=False)
    comment = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship('User', backref=db.backref('reviews', lazy=True))

    def __repr__(self):
        return f"<Review {self.id} by User {self.user_id}>"

class CareerPath(db.Model):
    __tablename__ = 'career_paths'
    id = db.Column(db.Integer, primary_key=True)
    qualification_id = db.Column(db.String(255), nullable=False) # saqa_id from Qualification
    career_name = db.Column(db.Text, nullable=False)
    average_salary = db.Column(db.Float)
    job_demand = db.Column(db.Text)
    required_skills = db.Column(db.Text)

    def __repr__(self):
        return f"<CareerPath {self.career_name}>"

class Bursary(db.Model):
    __tablename__ = 'bursaries'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Text, nullable=False)
    provider = db.Column(db.Text)
    field_of_study = db.Column(db.Text)
    eligibility = db.Column(db.Text)
    closing_date = db.Column(db.Text) # Store as text, could be Date
    link = db.Column(db.Text)
    phone_number = db.Column(db.String(255))
    picture_path = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f"<Bursary {self.name}>"

class UserFavorite(db.Model):
    __tablename__ = 'user_favorites'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    item_id = db.Column(db.Text, nullable=False)
    item_type = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship('User', backref=db.backref('favorites', lazy=True))

    def __repr__(self):
        return f"<UserFavorite {self.id} for User {self.user_id} - {self.item_type}:{self.item_id}>"

class ForumQuestion(db.Model):
    __tablename__ = 'forum_questions'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    provider_id = db.Column(db.Text) # Optional: link question to a specific provider
    title = db.Column(db.Text, nullable=False)
    body = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship('User', backref=db.backref('questions', lazy=True))
    answers = db.relationship('ForumAnswer', backref='question', lazy=True, cascade="all, delete-orphan")

    def __repr__(self):
        return f"<ForumQuestion {self.id} - {self.title}>"

class ForumAnswer(db.Model):
    __tablename__ = 'forum_answers'
    id = db.Column(db.Integer, primary_key=True)
    question_id = db.Column(db.Integer, db.ForeignKey('forum_questions.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    body = db.Column(db.Text, nullable=False)
    is_provider_answer = db.Column(db.Boolean, default=False, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship('User', backref=db.backref('answers', lazy=True))

    def __repr__(self):
        return f"<ForumAnswer {self.id} for Question {self.question_id}>"

class Post(db.Model):
    __tablename__ = 'posts'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.Text, nullable=False)
    content = db.Column(db.Text, nullable=False)
    image_path = db.Column(db.Text)
    likes = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    comments = db.relationship('Comment', backref='post', lazy=True, cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Post {self.id} - {self.title}>"

class Comment(db.Model):
    __tablename__ = 'comments'
    id = db.Column(db.Integer, primary_key=True)
    post_id = db.Column(db.Integer, db.ForeignKey('posts.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    parent_id = db.Column(db.Integer, db.ForeignKey('comments.id')) # For nested comments
    comment = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship('User', backref=db.backref('comments', lazy=True))
    parent = db.relationship('Comment', remote_side=[id], backref='replies', lazy=True)

    def __repr__(self):
        return f"<Comment {self.id} on Post {self.post_id} by User {self.user_id}>"

class Message(db.Model):
    __tablename__ = 'messages'
    id = db.Column(db.Integer, primary_key=True)
    sender_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    recipient_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    sender_name = db.Column(db.Text)
    sender_email = db.Column(db.Text)
    subject = db.Column(db.Text, nullable=False)
    message = db.Column(db.Text, nullable=False)
    is_from_contact_form = db.Column(db.Boolean, default=False)
    is_read = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    sender = db.relationship('User', foreign_keys=[sender_id], backref=db.backref('sent_messages', lazy=True))
    recipient = db.relationship('User', foreign_keys=[recipient_id], backref=db.backref('received_messages', lazy=True))

    def __repr__(self):
        return f"<Message {self.id} - Subject: {self.subject}>"

class UserMindResult(db.Model):
    __tablename__ = 'user_mind_results'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), unique=True, nullable=False) # One result per user
    result_json = db.Column(db.Text, nullable=False) # Store the JSON string of the result
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship('User', backref=db.backref('mind_result', uselist=False, lazy=True))

    def __repr__(self):
        return f"<UserMindResult for User {self.user_id}>"







