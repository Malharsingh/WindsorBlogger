import bcrypt


def userEntity(item) -> dict:
    return {
        "id": str(item["_id"]),
        "username": item["username"],
        "email": item["email"],
        "password": item["password"],
    }


def usersEntity(entity) -> list:
    print(entity)
    return [userEntity(item) for item in entity]


def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed_password.decode("utf-8")
