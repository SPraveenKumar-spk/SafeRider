from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
from app.extensions import db, bcrypt, jwt, mail
from app.config import Config

load_dotenv()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    bcrypt.init_app(app)
    jwt.init_app(app)
    mail.init_app(app)
    CORS(app)

    from app.auth.routes import auth_bp
    from app.admin.routes import admin_bp
    from app.user.routes import user_bp
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(admin_bp, url_prefix='/api/admin')
    app.register_blueprint(user_bp, url_prefix='/api/user')

    return app
