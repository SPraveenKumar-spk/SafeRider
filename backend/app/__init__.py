from flask import Flask
from config import Config
from app.extensions import db, bcrypt, jwt
from sqlalchemy import text
from flask_cors import CORS

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    # Initialize extensions
    db.init_app(app)
    bcrypt.init_app(app)
    jwt.init_app(app)

    # Check DB connection
    with app.app_context():
        try:
            db.session.execute(text('SELECT 1'))
            print("✅ Database connection successful!")
        except Exception as e:
            print(f"❌ Error connecting to the database: {e}")

    # Register blueprints
    from app.api.auth.routes import auth_bp
    from app.api.user.routes import user_bp

    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(user_bp, url_prefix='/api/user')

    return app
