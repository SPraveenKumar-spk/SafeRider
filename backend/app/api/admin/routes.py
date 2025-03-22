# /app/api/admin/routes.py
from flask import Blueprint, request, jsonify
from app.models.user import User
from app.models.fine import Fine
from app.models.violation import Violation
from app.utils.decorators import role_required
from app.extensions import db

admin_bp = Blueprint('admin', __name__, url_prefix='/api/admin')

# Get Dashboard Statistics
@admin_bp.route('/dashboard', methods=['GET'])
@role_required('admin')
def get_dashboard_stats():
    total_violations = Fine.query.count()
    fines_paid = Fine.query.filter_by(status='paid').count()
    pending_cases = Fine.query.filter_by(status='pending').count()

    return jsonify({
        "total_violations": total_violations,
        "fines_paid": fines_paid,
        "pending_cases": pending_cases
    })


# Get All Violations
@admin_bp.route('/violations', methods=['GET'])
@role_required('admin')
def get_violations():
    violations = Fine.query.all()
    data = [{
        "id": fine.id,
        "plate_number": fine.plate_number,
        "violation_type": fine.violation_type,
        "fine_amount": fine.fine_amount,
        "status": fine.status,
        "date_issued": fine.date_issued
    } for fine in violations]

    return jsonify({"violations": data})


# Get All Users
@admin_bp.route('/users', methods=['GET'])
@role_required('admin')
def get_users():
    users = User.query.all()
    data = [{
        "id": user.id,
        "username": user.name,  # Corrected from `username` to `name`
        "email": user.email,
        "role": user.role
    } for user in users]

    return jsonify({"users": data})


# Update User Role
@admin_bp.route('/user/<int:user_id>', methods=['PUT'])
@role_required('admin')
def update_user(user_id):
    data = request.json
    user = User.query.get(user_id)

    if not user:
        return jsonify({"error": "User not found"}), 404

    user.role = data.get('role', user.role)
    db.session.commit()
    return jsonify({"message": "User role updated successfully"})


# Delete User
@admin_bp.route('/user/<int:user_id>', methods=['DELETE'])
@role_required('admin')
def delete_user(user_id):
    user = User.query.get(user_id)

    if not user:
        return jsonify({"error": "User not found"}), 404

    # Delete associated records before user deletion
    for fine in user.fines:
        db.session.delete(fine)

    for vehicle in user.vehicles:
        db.session.delete(vehicle)

    db.session.delete(user)
    db.session.commit()
    return jsonify({"message": "User deleted successfully"})
