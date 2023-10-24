from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from models.blog import BlogPost
from schema.blog import blogEntity, blogsEntity
from config.db import conn
from bson import ObjectId

blog = APIRouter()

# Create a new blog post
@blog.post('/blog')
async def create_blog_post(blog_post: BlogPost):
    blog_post_dict = blog_post.dict()
    blog_post_dict['creation_date'] = datetime.now()
    result = conn.Blogdb.BlogPosts.insert_one(blog_post_dict)
    created_blog = conn.Blogdb.BlogPosts.find_one({"_id": result.inserted_id})
    return blogEntity(created_blog)

# Get all blog posts
@blog.get('/blog')
async def get_all_blog_posts():
    blog_posts = conn.Blogdb.BlogPosts.find()
    return blogsEntity(blog_posts)

# Get a single blog post by ID
@blog.get('/blog/{id}')
async def get_blog_post(id: str):
    blog_post = conn.Blogdb.BlogPosts.find_one({"_id": ObjectId(id)})
    if blog_post:
        return blogEntity(blog_post)
    raise HTTPException(status_code=404, detail="Blog post not found")

# Update a blog post by ID
@blog.put('/blog/{id}', operation_id='update_blog_post')
async def update_blog_post(id: str, blog_post: BlogPost):
    conn.Blogdb.BlogPosts.find_one_and_update({"_id": ObjectId(id)}, {"$set": blog_post.dict()})
    updated_blog_post = conn.Blogdb.BlogPosts.find_one({"_id": ObjectId(id)})
    if updated_blog_post:
        return blogEntity(updated_blog_post)
    raise HTTPException(status_code=404, detail="Blog post not found")

# Delete a blog post by ID
@blog.delete('/blog/{id}', operation_id='delete_blog_post')
async def delete_blog_post(id: str):
    deleted_blog_post = conn.Blogdb.BlogPosts.find_one_and_delete({"_id": ObjectId(id)})
    if deleted_blog_post:
        return blogEntity(deleted_blog_post)
    raise HTTPException(status_code=404, detail="Blog post not found")
