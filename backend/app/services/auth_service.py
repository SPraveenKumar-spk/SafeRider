from app.models.user_model import User
from app import db
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def register_user(name, email, password):
    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        return None

    new_user = User(name=name, email=email, role='user')
    new_user.set_password(password)

    try:
        db.session.add(new_user)
        db.session.commit()
        return new_user
    except Exception as e:
        db.session.rollback()
        logger.error(f"Error during user registration: {e}")
        return None

def authenticate_user(email, password):
    user = User.query.filter_by(email=email).first()
    if user and user.check_password(password):
        return user
    return None