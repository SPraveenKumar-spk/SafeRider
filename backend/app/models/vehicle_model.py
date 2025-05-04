from app import db
from datetime import datetime

class Vehicle(db.Model):
    __tablename__ = 'vehicles'
    id = db.Column(db.Integer, primary_key=True)
    owner_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), nullable=False)
    plate_number = db.Column(db.String(20), unique=True, nullable=False)
    address = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)

    detections = db.relationship('Violation', backref='vehicle', lazy=True, cascade="all, delete-orphan")
    user = db.relationship('User', backref=db.backref('vehicles', lazy=True))

    def to_dict(self):
        return {
            'id': self.id,
            'owner_name': self.owner_name,
            'email': self.email,
            'plate_number': self.plate_number,
            'address': self.address,
            'created_at': self.created_at.isoformat() + 'Z' if self.created_at else None,
            'user_id': self.user_id
        }

    def to_dict_basic(self):
        return {
            'plate_number': self.plate_number,
            'owner_name': self.owner_name
        }