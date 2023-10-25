

import bcrypt
from fastapi import APIRouter, FastAPI, HTTPException

from models.user import UserData
from config.db import conn
from schema.user import userEntity, usersEntity, hash_password
from bson import ObjectId

user = APIRouter()


@user.get('/user')
async def find_all_users():
    return usersEntity(conn.Blogdb.UserData.find())


@user.get('/user/{id}')
async def find_one_user(id):
    return userEntity(conn.Blogdb.UserData.find_one({"_id": ObjectId(id)}))


@user.post('/user')
async def create_user(users: UserData):
    existing_user = conn.Blogdb.UserData.find_one({"username": users.username})
    existing_email = conn.Blogdb.UserData.find_one({"email": users.email})

    if existing_user:
        raise HTTPException(status_code=400, detail="Username is already taken")
    elif existing_email:
        raise HTTPException(status_code=400, detail="Email is already taken")
    else:
        hashed_password = hash_password(users.password)
        user_data_dict = dict(users)
        user_data_dict['password'] = hashed_password
        conn.Blogdb.UserData.insert_one(user_data_dict)
        return usersEntity(conn.Blogdb.UserData.find({"username": user_data_dict.get("username")}))


@user.put('/user/{id}')
async def update_user(id, users: UserData):
    conn.Blogdb.UserData.find_one_and_update({"_id": ObjectId(id)}, {"$set": dict(users)})
    return userEntity(conn.Blogdb.UserData.find({"_id": ObjectId(id)}))


@user.delete('/user/{id}')
async def delete_user(id):
    return userEntity(conn.Blogdb.UserData.find_one_and_delete({"_id": ObjectId(id)}))


@user.post('/login')
async def login(cred: dict):
    user_data = conn.Blogdb.UserData.find_one({"username": cred.get("username")})
    print(user_data)
    if user_data and bcrypt.checkpw(cred.get("password").encode('utf-8'), user_data['password'].encode('utf-8')):
        return {"message": "Login successful"}
    return {"message": "Login failed"}

# @user.get('/user')
