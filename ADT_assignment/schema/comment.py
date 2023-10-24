def commentEntity(item) -> dict:
    comment_dict = {
        "id": str(item["_id"]),
        "commenter_name": item["commenter_name"],
        "commenter_text": item["commenter_text"],
        "creation_date": item["creation_date"],
        "blog": item["blog"]
    }

    # Check if the "title" field exists in the document
    if "title" in item:
        comment_dict["title"] = item["title"]

    return comment_dict


def commentsEntity(entity) -> list:
    return [commentEntity(item) for item in entity]
