from typing import Optional, List

from pydantic import BaseModel
from datetime import datetime

from models.user import User

class Blog(BaseModel):
    title: str

class BlogPost(Blog):
    content: str
    author: User  # Reference to the user who created the post
    creation_date: datetime = datetime.now()
    tag: Optional[List[str]] = None
