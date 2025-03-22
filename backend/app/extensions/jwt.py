from flask_jwt_extended import JWTManager

def init_jwt(app):
    jwt = JWTManager(app)

    @jwt.user_identity_loader
    def user_identity_lookup(user):
        return user.id

    @jwt.user_lookup_loader
    def user_lookup_callback(_jwt_header, jwt_data):
        from app.models.user import User
        identity = jwt_data["sub"]
        return User.query.get(identity)

    return jwt
