# Import necessary modules
from datetime import datetime
from faker import Faker  # You might need to install the 'Faker' library
from models.blog import BlogPost
from models.comment import Comment
from models.user import User
from config.db import conn
from schema.user import hash_password
import bcrypt

# Initialize Faker to generate random data
fake = Faker()


# Function to create sample users
def create_sample_users():
    users = []
    for _ in range(3):  # Create 5 sample users
        username = fake.user_name()
        email = fake.email()
        password = "password123"  # You can set a common password for all users or generate random ones
        hashed_password = hash_password(password)
        user_data = {
            "username": username,
            "email": email,
            "password": hashed_password
        }
        users.append(user_data)
    conn.Blogdb.UserData.insert_many(users)


def create_sample_blog_posts():
    blog_posts = []
    for _ in range(3):  # Create 5 sample blog posts
        title = fake.sentence()
        content = fake.paragraph()

        # Create a placeholder user
        author = User(username=fake.user_name())

        creation_date = fake.date_time_this_decade()

        # Replace with your desired static tags
        tags = "your_static_tags_here"

        blog_post = BlogPost(title=title, content=content, author=author, creation_date=creation_date, tags=tags)
        blog_posts.append(blog_post.dict())
    conn.Blogdb.BlogPosts.insert_many(blog_posts)


def create_sample_comments():
    # Retrieve some blog posts (assuming you have already created them)
    blog_posts = conn.Blogdb.BlogPosts.find()

    # Iterate through blog posts and create comments for each
    for blog_post in blog_posts:
        # You can use the Fake library to generate sample data
        commenter_name = fake.name()
        commenter_text = fake.text()

        # Create a comment with the required fields
        comment = Comment(commenter_name=commenter_name, commenter_text=commenter_text, blog=blog_post)

        # Add the comment to the database
        # conn.Blogdb.Comments.insert_one(comment.dict())

    print("Sample comments created")


# Call the function to create sample comments
create_sample_comments()

if __name__ == "__main__":
    # Create sample users
    create_sample_users()
    print("Sample users created")

    # Create sample blog posts
    create_sample_blog_posts()
    print("Sample blog posts created")

    # Create sample comments
    create_sample_comments()
    print("Sample comments created")
