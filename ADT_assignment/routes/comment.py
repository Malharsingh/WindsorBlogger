from fastapi import APIRouter, Depends, HTTPException
from models.comment import Comment
from schema.comment import commentEntity, commentsEntity
from config.db import conn
from bson import ObjectId

commentcrud = APIRouter()


# Get all comments
@commentcrud.get('/comments')
async def get_all_comments():
    comments = conn.Blogdb.Comments.find()
    return commentsEntity(comments)


# Create a new comment
@commentcrud.post('/comment')
async def create_comment(comment: Comment):
    comment_dict = comment.dict()
    result = conn.Blogdb.Comments.insert_one(comment_dict)
    created_comment = conn.Blogdb.Comments.find_one({"_id": result.inserted_id})
    return commentEntity(created_comment)




# Get a single comment by ID
@commentcrud.get('/comment/{id}')
async def get_comment(id: str):
    comment = conn.Blogdb.Comments.find_one({"_id": ObjectId(id)})
    if comment:
        return commentEntity(comment)
    raise HTTPException(status_code=404, detail="Comment not found")

# Update a comment by ID
@commentcrud.put('/comment/{id}', operation_id='update_comment')
async def update_comment(id: str, comment: Comment):
    conn.Blogdb.Comments.find_one_and_update({"_id": ObjectId(id)}, {"$set": comment.dict()})
    updated_comment = conn.Blogdb.Comments.find_one({"_id": ObjectId(id)})
    if updated_comment:
        return commentEntity(updated_comment)
    raise HTTPException(status_code=404, detail="Comment not found")

# Delete a comment by ID
@commentcrud.delete('/comment/{id}', operation_id='delete_comment')
async def delete_comment(id: str):
    deleted_comment = conn.Blogdb.Comments.find_one_and_delete({"_id": ObjectId(id)})
    if deleted_comment:
        return commentEntity(deleted_comment)
    raise HTTPException(status_code=404, detail="Comment not found")
