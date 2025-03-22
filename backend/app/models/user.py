from app.extensions import db, bcrypt

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), default='user', nullable=False)
    fines = db.relationship('Fine', backref='user', lazy=True)

    def set_password(self, password):
        """Hash and set password using bcrypt."""
        self.password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

    def check_password(self, password):
        """Check password using bcrypt."""
        return bcrypt.check_password_hash(self.password_hash, password)

    def is_admin(self):
        """Check if user is admin."""
        return self.role == 'admin'

    def to_dict(self):
        """Return user data as a dictionary."""
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'role': self.role
        }

