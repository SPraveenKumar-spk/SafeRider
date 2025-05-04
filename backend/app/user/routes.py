from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models.user_model import User
from app.models.fine_model import Fine
from app.models.vehicle_model import Vehicle
from app.models.detection_model import Violation
from datetime import datetime
import logging

user_bp = Blueprint('user', __name__)
logger = logging.getLogger(__name__)

def get_current_user():
    user_id = get_jwt_identity()
    return User.query.get(user_id)

@user_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    logger.debug("Entering /api/user/profile endpoint")
    user = get_current_user()
    if not user:
        logger.warning("User not found for profile request")
        return jsonify({'error': 'User not found'}), 404

    vehicle = Vehicle.query.filter_by(email=user.email).first()
    logger.info(f"Profile fetched for user_id: {user.id}")
    return jsonify({
        'name': user.name,
        'email': user.email,
        'role': user.role,
        'address': vehicle.address if vehicle else '',
        'plate_number': vehicle.plate_number if vehicle else ''
    })

@user_bp.route('/violations', methods=['GET'])
@jwt_required()
def get_violations():
    logger.debug("Entering /api/user/violations endpoint")
    user = get_current_user()
    if not user:
        logger.warning("User not found for violations request")
        return jsonify({'error': 'User not found'}), 404

    vehicle = Vehicle.query.filter_by(email=user.email).first()
    if not vehicle:
        logger.info(f"No vehicle found for user_id: {user.id}")
        return jsonify({'violations': []}), 200

    fines = Fine.query.filter_by(user_id=user.id).all()
    result = []
    for fine in fines:
        violation = Violation.query.get(fine.detection_id)
        result.append({
            'id': fine.id,
            'date_detected': violation.date_detected.isoformat() if violation else fine.date_issued.isoformat(),
            'plate_number': fine.plate_number,
            'violation_type': fine.violation_type,
            'fine_amount': float(fine.fine_amount),
            'status': fine.status,
            'detection_id': fine.detection_id,
            'image_mime_type': fine.image_mime_type
        })
    logger.info(f"Fetched {len(result)} violations for user_id: {user.id}")
    return jsonify({'violations': result}), 200

@user_bp.route('/notifications', methods=['GET'])
@jwt_required()
def get_notifications():
    logger.debug("Entering /api/user/notifications endpoint")
    user = get_current_user()
    if not user:
        logger.warning("User not found for notifications request")
        return jsonify({'error': 'User not found'}), 404

    # Simulated notifications for now
    notifications = [
        f"Your fine for plate {user.email} has been issued.",
        "New safety tips available!"
    ]
    logger.info(f"Fetched {len(notifications)} notifications for user_id: {user.id}")
    return jsonify(notifications), 200

@user_bp.route('/violations/<int:violation_id>/pay', methods=['POST'])
@jwt_required()
def pay_fine(violation_id):
    logger.debug(f"Entering /api/user/violations/{violation_id}/pay endpoint")
    user = get_current_user()
    if not user:
        logger.warning("User not found for payment request")
        return jsonify({'error': 'User not found'}), 404

    fine = Fine.query.get(violation_id)
    if not fine:
        logger.warning(f"Fine not found for violation_id: {violation_id}")
        return jsonify({'error': 'Violation not found'}), 404

    if fine.user_id != user.id:
        logger.warning(f"Unauthorized payment attempt by user_id: {user.id} for violation_id: {violation_id}")
        return jsonify({'error': 'Unauthorized'}), 403

    fine.status = 'paid'
    db.session.commit()
    logger.info(f"Fine marked as paid for violation_id: {violation_id}, user_id: {user.id}")
    return jsonify({'message': f'Fine for violation ID {violation_id} marked as paid'}), 200