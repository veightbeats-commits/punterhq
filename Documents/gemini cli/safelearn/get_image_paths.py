from app import app
from models import Learnership, Bursary, Post
from extensions import db

with app.app_context():
    print("--- Learnership Picture Paths ---")
    learnerships = Learnership.query.all()
    for learnership in learnerships:
        print(f"Learnership ID: {learnership.id}, Title: {learnership.title}, Picture Path: {learnership.picture_path}")

    print("\n--- Bursary Picture Paths ---")
    bursaries = Bursary.query.all()
    for bursary in bursaries:
        print(f"Bursary ID: {bursary.id}, Name: {bursary.name}, Picture Path: {bursary.picture_path}")

    print("\n--- Post Image Paths ---")
    posts = Post.query.all()
    for post in posts:
        print(f"Post ID: {post.id}, Title: {post.title}, Image Path: {post.image_path}")
