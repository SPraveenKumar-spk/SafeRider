from app.extensions import db
class Vehicle(db.Model):
    __tablename__ = 'vehicles'

    id = db.Column(db.Integer, primary_key=True)
    plate_number = db.Column(db.String(20), unique=True, nullable=False)
    owner_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)  # Fixed foreign key reference
    violations = db.relationship('Fine', backref='vehicle', lazy=True)

    def to_dict(self):
        """Return vehicle data as a dictionary."""
        return {
            'id': self.id,
            'plate_number': self.plate_number,
            'owner_id': self.owner_id
        }
