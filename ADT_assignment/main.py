from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.comment import commentcrud
from routes.user import user
from routes.blog import blog

app = FastAPI()
origins = ["http://localhost:7000"]  # Update this list with the allowed origins

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(user)
app.include_router(blog)
app.include_router(commentcrud)
