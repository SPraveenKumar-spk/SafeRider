from app.extensions import db
from datetime import datetime

class Fine(db.Model):
    __tablename__ = 'fines'
    id = db.Column(db.Integer, primary_key=True)
    plate_number = db.Column(db.String(20), db.ForeignKey('vehicles.plate_number'), nullable=False)
    violation_type = db.Column(db.String(100), nullable=False)
    fine_amount = db.Column(db.Numeric(10, 2), nullable=False)
    status = db.Column(db.Enum('pending', 'paid'), default='pending', nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    detection_id = db.Column(db.Integer, db.ForeignKey('detections.id'), nullable=False)
    image_data = db.Column(db.LargeBinary, nullable=False)
    image_mime_type = db.Column(db.String(50), nullable=False)
    date_issued = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'plate_number': self.plate_number,
            'violation_type': self.violation_type,
            'fine_amount': float(self.fine_amount),
            'status': self.status,
            'user_id': self.user_id,
            'detection_id': self.detection_id,
            'date_issued': self.date_issued.isoformat(),
            'image_mime_type': self.image_mime_type
        }