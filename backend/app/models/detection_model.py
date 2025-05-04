from app.extensions import db
from datetime import datetime

class Violation(db.Model):
    __tablename__ = 'detections'
    id = db.Column(db.Integer, primary_key=True)
    plate_number = db.Column(db.String(20), db.ForeignKey('vehicles.plate_number'), nullable=False)
    image_data = db.Column(db.LargeBinary, nullable=False)
    image_mime_type = db.Column(db.String(50), nullable=False)
    helmet_detected = db.Column(db.Boolean, default=False, nullable=False)
    date_detected = db.Column(db.DateTime, default=datetime.utcnow)
    admin_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'plate_number': self.plate_number,
            'helmet_detected': self.helmet_detected,
            'date_detected': self.date_detected.isoformat(),
            'admin_id': self.admin_id,
            'image_mime_type': self.image_mime_type
        }