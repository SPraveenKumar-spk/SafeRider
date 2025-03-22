import cv2
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.image import MIMEImage
from email.mime.text import MIMEText
import os

SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587
SENDER_EMAIL = os.getenv("SENDER_EMAIL")
SENDER_PASSWORD = os.getenv("SENDER_PASSWORD")

def send_violation_email(plate_number, image_array):
    """ Send an email with the violation details and image. """
    msg = MIMEMultipart()
    msg["From"] = SENDER_EMAIL
    msg["To"] = "admin@safedriver.com"
    msg["Subject"] = f"Violation Detected: {plate_number}"

    body = f"Violation detected for vehicle {plate_number}.\nFine issued: ₹500"
    msg.attach(MIMEText(body, "plain"))

    _, img_encoded = cv2.imencode(".jpg", image_array)
    image = MIMEImage(img_encoded.tobytes(), name="violation.jpg")
    msg.attach(image)

    try:
        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls()
        server.login(SENDER_EMAIL, SENDER_PASSWORD)
        server.sendmail(SENDER_EMAIL, "admin@safedriver.com", msg.as_string())
        server.quit()
    except Exception as e:
        print(f"Failed to send email: {e}")
