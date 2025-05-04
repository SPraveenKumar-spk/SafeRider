from dotenv import dotenv_values

# Load values from .env file
env = dotenv_values()

class Config:
    SECRET_KEY = env['SECRET_KEY']
    JWT_SECRET_KEY = env['JWT_SECRET_KEY']
    SQLALCHEMY_DATABASE_URI = env['DATABASE_URI']
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    MAIL_SERVER = env['MAIL_SERVER']
    MAIL_PORT = int(env['MAIL_PORT'])
    MAIL_USE_TLS = env['MAIL_USE_TLS'].lower() == 'true'
    MAIL_USERNAME = env['SENDER_EMAIL']
    MAIL_PASSWORD = env['SENDER_PASSWORD']
    MAIL_DEFAULT_SENDER = env['SENDER_EMAIL']
