from typing import List, Optional

from pydantic import BaseModel
from datetime import datetime


from models.blog import Blog


class Comment(BaseModel):
    commenter_name: str
    commenter_text: str
    creation_date: datetime = datetime.now()
    blog: Blog  # Reference to the user who created the post

