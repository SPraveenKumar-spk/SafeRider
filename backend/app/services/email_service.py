from flask_mail import Message
from app.extensions import mail
import logging

logger = logging.getLogger(__name__)

def send_fine_notification(email, fine):
    """
    Send a fine notification email to the user.

    Args:
        email (str): Recipient's email address
        fine (Fine): Fine object containing violation details
    """
    try:
        msg = Message(
            subject='Traffic Violation Fine Notification',
            recipients=[email],
            body=f"""
            Dear User,

            You have been issued a fine for a traffic violation.

            Violation Details:
            - Plate Number: {fine.plate_number}
            - Violation Type: {fine.violation_type}
            - Fine Amount: ₹{fine.fine_amount}
            - Date: {fine.date_issued}

            Please pay the fine at your earliest convenience.

            Regards,
            SafeRider Team
            """
        )
        mail.send(msg)
        logger.info(f"Email sent successfully to {email} for fine ID: {fine.id}")
    except Exception as e:
        logger.error(f"Error sending email to {email}: {str(e)}")
        raise
