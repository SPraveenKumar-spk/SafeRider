from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from app.services.auth_service import register_user, authenticate_user
import logging

# Configure logging
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s %(levelname)s: %(message)s',
    handlers=[
        logging.StreamHandler(),
        logging.FileHandler('app.log')
    ]
)
logger = logging.getLogger(__name__)

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    if not data:
        logger.error("No input data provided for registration")
        return jsonify({'error': 'No input data provided'}), 400

    name = data.get('name')
    email = data.get('email')
    password = data.get('password')

    if not all([name, email, password]):
        logger.error("Missing required fields for registration")
        return jsonify({'error': 'Missing required fields'}), 400

    user = register_user(name, email, password)
    if not user:
        logger.error(f"User already exists: {email}")
        return jsonify({'error': 'User already exists'}), 400

    logger.info(f"User registered successfully: {email}")
    return jsonify({'message': 'User registered successfully'}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data:
        logger.error("No input data provided for login")
        return jsonify({'error': 'No input data provided'}), 400

    email = data.get('email')
    password = data.get('password')

    if not all([email, password]):
        logger.error("Missing email or password for login")
        return jsonify({'error': 'Missing email or password'}), 400

    user = authenticate_user(email, password)
    if not user:
        logger.error(f"Invalid credentials for email: {email}")
        return jsonify({'error': 'Invalid credentials'}), 401

    if user.id is None:
        logger.error(f"User ID is None for email: {email}")
        return jsonify({'error': 'Internal server error: User ID not set'}), 500

    logger.debug(f"Generating token for user ID: {user.id}, email: {email}")
    access_token = create_access_token(identity=str(user.id))
    logger.info(f"User logged in successfully: {email}")
    return jsonify({
        'access_token': access_token,
        'role': user.role
    }), 200