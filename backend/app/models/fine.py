
from app.extensions import db
# /app/models/fine.py
class Fine(db.Model):
    __tablename__ = 'fines'

    id = db.Column(db.Integer, primary_key=True)
    plate_number = db.Column(db.String(20), db.ForeignKey('vehicles.plate_number'), nullable=False)
    violation_type = db.Column(db.String(100), nullable=False)
    fine_amount = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(20), default='pending', nullable=False)  # Added nullable=False for safety
    date_issued = db.Column(db.DateTime, default=db.func.current_timestamp())
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    def to_dict(self):
        """Return fine data as a dictionary."""
        return {
            'id': self.id,
            'plate_number': self.plate_number,
            'violation_type': self.violation_type,
            'fine_amount': self.fine_amount,
            'status': self.status,
            'date_issued': self.date_issued,
            'user_id': self.user_id
        }
