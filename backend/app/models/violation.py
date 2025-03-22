from app.extensions import db
# /app/models/detection.py
class Violation(db.Model):
    __tablename__ = 'detections'

    id = db.Column(db.Integer, primary_key=True)
    plate_number = db.Column(db.String(20), db.ForeignKey('vehicles.plate_number'), nullable=False)
    image_path = db.Column(db.String(255), nullable=False)
    helmet_detected = db.Column(db.Boolean, default=False)
    date_detected = db.Column(db.DateTime, default=db.func.current_timestamp())

    def to_dict(self):
        """Return detection data as a dictionary."""
        return {
            'id': self.id,
            'plate_number': self.plate_number,
            'image_path': self.image_path,
            'helmet_detected': self.helmet_detected,
            'date_detected': self.date_detected
        }
