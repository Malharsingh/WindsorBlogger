def blogEntity(item) -> dict:
    return {
        "id": str(item["_id"]),
        "title": item["title"],
        "content": item["content"],
        "author": item["author"],
        "creation_date": item["creation_date"],
        "tags": item["tags"],
    }

def blogsEntity(entity) -> list:
    return [blogEntity(item) for item in entity]
