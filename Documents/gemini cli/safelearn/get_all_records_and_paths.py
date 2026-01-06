from app import app
from models import Learnership, Bursary, Post
from extensions import db

with app.app_context():
    print("--- Learnership Records ---")
    learnerships = Learnership.query.all()
    if learnerships:
        for learnership in learnerships:
            print(f"ID: {learnership.id}, Title: {learnership.title}, Picture Path: {learnership.picture_path}, All Data: {learnership.__dict__}")
    else:
        print("No Learnership records found.")
    print(f"Total Learnership records: {len(learnerships)}\n")

    print("--- Bursary Records ---")
    bursaries = Bursary.query.all()
    if bursaries:
        for bursary in bursaries:
            print(f"ID: {bursary.id}, Name: {bursary.name}, Picture Path: {bursary.picture_path}, All Data: {bursary.__dict__}")
    else:
        print("No Bursary records found.")
    print(f"Total Bursary records: {len(bursaries)}\n")

    print("--- Post Records ---")
    posts = Post.query.all()
    if posts:
        for post in posts:
            print(f"ID: {post.id}, Title: {post.title}, Image Path: {post.image_path}, All Data: {post.__dict__}")
    else:
        print("No Post records found.")
    print(f"Total Post records: {len(posts)}\n")
