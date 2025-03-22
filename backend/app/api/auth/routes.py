from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from app.services.auth_service import register_user, authenticate_user

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    user = register_user(name, email, password)
    if not user:
        return jsonify({'error': 'User already exists'}), 400
    return jsonify({'message': 'User registered successfully'}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    print(email)
    print(password)
    user = authenticate_user(email, password)
    print(user)
    if not user:
        return jsonify({'error': 'Invalid credentials'}), 401
    access_token = create_access_token(identity=user.id)
    print(access_token)
    return jsonify({
        'access_token': access_token,
        'role': user.role
    }), 200
