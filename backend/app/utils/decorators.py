from functools import wraps
from flask_jwt_extended import get_jwt_identity
from flask import jsonify
from app.models.user import User

def role_required(required_role):
    """Decorator to restrict access based on role (admin/user)."""
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            user_id = get_jwt_identity()
            user = User.query.get(user_id)

            if not user:
                return jsonify({'error': 'User not found'}), 404

            # Check if the user has the required role
            if user.role != required_role:
                return jsonify({'error': f'{required_role.capitalize()} access required'}), 403

            return f(*args, **kwargs)

        return decorated_function
    return decorator

# Usage example:
# For admin routes
@role_required('admin')
def admin_route():
    return jsonify({'message': 'Admin access granted'})

# For user routes (if needed in the future)
@role_required('user')
def user_route():
    return jsonify({'message': 'User access granted'})
