from flask import Blueprint, jsonify, request, send_file
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models.vehicle_model import Vehicle
from app.models.detection_model import Violation
from app.models.fine_model import Fine
from app.models.user_model import User
from app.services.email_service import send_fine_notification
from app.services.ml_service import process_image
import logging
from datetime import datetime
import io
import imghdr
from PIL import Image
import cv2
import numpy as np

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

admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/detections', methods=['POST'])
@jwt_required()
def create_detection():
    logger.debug("Entering /api/admin/detections endpoint")
    try:
        user_id = get_jwt_identity()
        admin = User.query.get(user_id)
        if not admin or admin.role != 'admin':
            logger.warning(f"Unauthorized access attempt by user_id: {user_id}")
            return jsonify({'error': 'Unauthorized'}), 403

        if 'image' not in request.files:
            logger.error("No image provided in request")
            return jsonify({'error': 'No image provided'}), 400

        image_file = request.files['image']
        if image_file.filename == '':
            logger.error("No file selected")
            return jsonify({'error': 'No selected file'}), 400

        # Check file size
        image_file.seek(0, io.SEEK_END)
        file_size = image_file.tell()
        image_file.seek(0)
        if file_size == 0:
            logger.error("Uploaded file is empty")
            return jsonify({'error': 'Uploaded file is empty'}), 400
        if file_size > 10 * 1024 * 1024:  # Limit to 10MB
            logger.error("File size exceeds 10MB limit")
            return jsonify({'error': 'File size exceeds 10MB limit'}), 400
        logger.info(f"Received image file: {image_file.filename}, size: {file_size} bytes")

        # Read image data
        image_data = image_file.read()
        image_mime_type = image_file.mimetype  # e.g., image/png, image/jpeg
        allowed_mime_types = ['image/png', 'image/jpeg', 'image/jpg']
        if image_mime_type not in allowed_mime_types:
            logger.error(f"Invalid MIME type: {image_mime_type}")
            return jsonify({'error': f'Invalid image format. Allowed: {", ".join(allowed_mime_types)}'}), 422

        # Validate image with PIL
        try:
            with Image.open(io.BytesIO(image_data)) as img:
                pil_format = img.format.lower()
                if pil_format not in ['png', 'jpeg']:
                    logger.error(f"PIL detected invalid format: {pil_format}")
                    return jsonify({'error': f'Invalid image format (PIL): {pil_format}'}), 422
                logger.debug(f"PIL confirmed format: {pil_format}")
        except Exception as e:
            logger.error(f"PIL failed to open image: {e}")
            return jsonify({'error': f'Invalid image file (PIL validation failed): {str(e)}'}), 422

        # Read image with OpenCV
        image_array = cv2.imdecode(np.frombuffer(image_data, np.uint8), cv2.IMREAD_COLOR)
        if image_array is None:
            logger.error("Failed to read image with OpenCV")
            return jsonify({'error': 'Invalid image file (OpenCV could not read)'}), 422

        # Process image with ML model
        try:
            result = process_image(image_array)
            if not result:
                logger.error("Image processing failed: No result returned")
                return jsonify({'error': 'Image processing failed'}), 500

            plate_number = result['plate_number']
            helmet_detected = result['helmet_detected']
            confidence = result['confidence']
            logger.debug(f"ML result: plate_number={plate_number}, helmet_detected={helmet_detected}")

            if not plate_number:
                logger.error("No number plate detected")
                return jsonify({'error': 'No number plate detected'}), 422

            vehicle = Vehicle.query.filter_by(plate_number=plate_number).first()
            if not vehicle:
                logger.error(f"Vehicle not found for plate: {plate_number}")
                return jsonify({'error': 'Vehicle not found'}), 404

            detection = Violation(
                plate_number=plate_number,
                image_data=image_data,
                image_mime_type=image_mime_type,
                helmet_detected=helmet_detected,
                admin_id=admin.id,
                date_detected=datetime.utcnow()
            )
            db.session.add(detection)

            if not helmet_detected:
                user = User.query.filter_by(id=vehicle.user_id).first()
                if not user:
                    user = User.query.filter_by(email=vehicle.email).first()
                    if not user:
                        user = User(
                            name=vehicle.owner_name,
                            email=vehicle.email,
                            role='user'
                        )
                        user.set_password("123")
                        db.session.add(user)
                        db.session.flush()

                fine = Fine(
                    plate_number=plate_number,
                    violation_type='No helmet detected',
                    fine_amount=100.0,
                    status='pending',
                    user_id=user.id,
                    detection_id=detection.id,
                    image_data=image_data,
                    image_mime_type=image_mime_type,
                    date_issued=datetime.utcnow()
                )
                db.session.add(fine)

            try:
                db.session.commit()
                logger.info(f"Detection created: plate={plate_number}, helmet_detected={helmet_detected}")
                
                if not helmet_detected and user:
                    try:
                        send_fine_notification(user.email, fine)
                        logger.info(f"Email notification queued for {user.email}")
                    except Exception as e:
                        logger.error(f"Failed to send email notification to {user.email}: {str(e)}")
                
                return jsonify({
                    'detection': detection.to_dict(),
                    'helmet_detected': helmet_detected,
                    'plate_number': plate_number,
                    'confidence': confidence
                }), 201
            except Exception as e:
                db.session.rollback()
                logger.error(f"Database error creating detection: {e}")
                return jsonify({'error': 'Failed to create detection'}), 500

        except Exception as e:
            logger.error(f"ML processing error: {e}")
            return jsonify({'error': f'Image processing error: {str(e)}'}), 500

    except Exception as e:
        logger.error(f"Unexpected error in create_detection: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@admin_bp.route('/detection-image/<int:detection_id>')
@jwt_required()
def serve_detection_image(detection_id):
    logger.debug(f"Serving image for detection_id: {detection_id}")
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        if not user:
            logger.warning(f"Unauthorized access attempt by user_id: {user_id}")
            return jsonify({'error': 'Unauthorized'}), 403

        detection = Violation.query.get_or_404(detection_id)
        if not detection.image_data:
            logger.error(f"No image data for detection_id: {detection_id}")
            return jsonify({'error': 'No image data available'}), 404

        return send_file(
            io.BytesIO(detection.image_data),
            mimetype=detection.image_mime_type,
            as_attachment=False
        )
    except Exception as e:
        logger.error(f"Error serving image for detection_id {detection_id}: {str(e)}")
        return jsonify({'error': 'Failed to serve image'}), 500

@admin_bp.route('/violations', methods=['GET'])
@jwt_required()
def get_all_violations():
    logger.debug("Entering /api/admin/violations endpoint")
    try:
        user_id = get_jwt_identity()
        admin = User.query.get(user_id)
        if not admin or admin.role != 'admin':
            logger.warning(f"Unauthorized access attempt by user_id: {user_id}")
            return jsonify({'error': 'Unauthorized'}), 403

        violations = Violation.query.join(Fine, Violation.id == Fine.detection_id, isouter=True).all()
        violation_list = []
        for violation in violations:
            fine = Fine.query.filter_by(detection_id=violation.id).first()
            violation_data = violation.to_dict()
            violation_data['violation_type'] = fine.violation_type if fine else 'No helmet detected'
            violation_data['fine_amount'] = float(fine.fine_amount) if fine else 0.0
            violation_data['status'] = fine.status if fine else 'pending'
            violation_list.append(violation_data)
        
        logger.info(f"Fetched {len(violation_list)} violations")
        return jsonify({'violations': violation_list}), 200
    except Exception as e:
        logger.error(f"Error fetching violations: {str(e)}")
        return jsonify({'error': 'Failed to fetch violations'}), 500

@admin_bp.route('/violated-users', methods=['GET'])
@jwt_required()
def get_violated_users():
    logger.debug("Entering /api/admin/violated-users endpoint")
    try:
        user_id = get_jwt_identity()
        admin = User.query.get(user_id)
        if not admin or admin.role != 'admin':
            logger.warning(f"Unauthorized access attempt by user_id: {user_id}")
            return jsonify({'error': 'Unauthorized'}), 403

        users = User.query.join(Fine, User.id == Fine.user_id).distinct().all()
        user_list = []
        for user in users:
            fines = Fine.query.filter_by(user_id=user.id).all()
            violations = Violation.query.join(Fine, Violation.id == Fine.detection_id).filter(Fine.user_id == user.id).all()
            user_data = {
                'id': user.id,
                'username': user.name,
                'email': user.email,
                'role': user.role,
                'violations': [{
                    'id': violation.id,
                    'plate_number': violation.plate_number,
                    'violation_type': fine.violation_type,
                    'fine_amount': float(fine.fine_amount),
                    'status': fine.status,
                    'date_detected': violation.date_detected.isoformat(),
                    'image_mime_type': violation.image_mime_type
                } for violation, fine in [(v, f) for v in violations for f in fines if f.detection_id == v.id]]
            }
            user_list.append(user_data)
        
        logger.info(f"Fetched {len(user_list)} violated users")
        return jsonify({'users': user_list}), 200
    except Exception as e:
        logger.error(f"Error fetching violated users: {str(e)}")
        return jsonify({'error': 'Failed to fetch violated users'}), 500

@admin_bp.route('/dashboard', methods=['GET'])
@jwt_required()
def get_dashboard_stats():
    logger.debug("Entering /api/admin/dashboard endpoint")
    try:
        user_id = get_jwt_identity()
        admin = User.query.get(user_id)
        if not admin or admin.role != 'admin':
            logger.warning(f"Unauthorized access attempt by user_id: {user_id}")
            return jsonify({'error': 'Unauthorized'}), 403

        total_violations = Violation.query.count()
        fines_paid = Fine.query.filter_by(status='paid').count()
        pending_cases = Fine.query.filter_by(status='pending').count()
        
        recent_violations = Violation.query.join(Fine, Violation.id == Fine.detection_id, isouter=True)\
            .order_by(Violation.date_detected.desc()).limit(5).all()
        recent_violation_list = []
        for violation in recent_violations:
            fine = Fine.query.filter_by(detection_id=violation.id).first()
            violation_data = violation.to_dict()
            violation_data['violation_type'] = fine.violation_type if fine else 'No helmet detected'
            violation_data['fine_amount'] = float(fine.fine_amount) if fine else 0.0
            violation_data['status'] = fine.status if fine else 'pending'
            recent_violation_list.append(violation_data)

        stats = {
            'total_violations': total_violations,
            'fines_paid': fines_paid,
            'pending_cases': pending_cases,
            'recent_violations': recent_violation_list
        }
        
        logger.info("Fetched dashboard stats")
        return jsonify(stats), 200
    except Exception as e:
        logger.error(f"Error fetching dashboard stats: {str(e)}")
        return jsonify({'error': 'Failed to fetch dashboard stats'}), 500