from app.models.user import User
from app.extensions import db

def register_user(name, email, password, role='user'):
    if User.query.filter_by(email=email).first():
        return None
    user = User(name=name, email=email, role=role)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()
    return user

def authenticate_user(email, password):
    user = User.query.filter_by(email=email).first()
    if user and user.check_password(password):
        return user
    return None
