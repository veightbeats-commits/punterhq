from app import app
from models import Post, Bursary, Learnership
from extensions import db
from datetime import datetime

def add_sample_data():
    with app.app_context():
        print("Adding sample data...")

        # Add sample Posts
        post1 = Post(
            title="Exciting News in Education!",
            content="We are thrilled to announce new initiatives in the South African education sector...",
            image_path="uploads/Screenshot 2024-07-10 121414.png",
            likes=15,
            created_at=datetime.utcnow()
        )
        post2 = Post(
            title="Important Updates for Students",
            content="Stay informed about the latest policy changes affecting student funding and support.",
            image_path="uploads/POLO BLACK.jpeg",
            likes=22,
            created_at=datetime.utcnow()
        )
        post3 = Post(
            title="New Technologies in Learning",
            content="Explore how innovative tech is transforming classrooms and remote learning.",
            image_path="uploads/doo.jpg",
            likes=30,
            created_at=datetime.utcnow()
        )

        # Add sample Bursaries
        bursary1 = Bursary(
            name="Future Leaders Scholarship",
            provider="MegaCorp Foundation",
            field_of_study="Any STEM field",
            eligibility="Matriculants with 70%+ average",
            closing_date="2026-03-31",
            link="http://www.megacorp.com/scholarships",
            phone_number="0111234567",
            picture_path="uploads/Screenshot 2024-07-10 121705.png",
            created_at=datetime.utcnow()
        )
        bursary2 = Bursary(
            name="Community Development Fund",
            provider="Local Government",
            field_of_study="Social Sciences, Public Admin",
            eligibility="Students from disadvantaged backgrounds",
            closing_date="2026-04-15",
            link="http://www.localgov.org/bursaries",
            phone_number="0109876543",
            picture_path="uploads/Screenshot 2024-07-10 122234.png",
            created_at=datetime.utcnow()
        )

        # Add sample Learnerships
        learnership1 = Learnership(
            title="IT Support Learnership",
            company="Tech Solutions Inc.",
            stipend=5000.00,
            duration="12 Months",
            nqf_level=4,
            location="Gauteng",
            url="http://www.techsolutions.com/careers",
            phone_number="0123456789",
            picture_path="uploads/blue-water-bottle-png.webp",
            created_at=datetime.utcnow()
        )
        learnership2 = Learnership(
            title="Admin Assistant Learnership",
            company="Corporate Services",
            stipend=3500.00,
            duration="6 Months",
            nqf_level=3,
            location="Western Cape",
            url="http://www.corporate.com/jobs",
            phone_number="0218765432",
            picture_path="uploads/ice-cubes-plastic-bag-bagged-260nw-1105124246.webp",
            created_at=datetime.utcnow()
        )

        db.session.add_all([post1, post2, post3, bursary1, bursary2, learnership1, learnership2])
        db.session.commit()
        print("Sample data added successfully!")

if __name__ == '__main__':
    add_sample_data()
