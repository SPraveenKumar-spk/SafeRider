import cv2
import numpy as np
from ultralytics import YOLO
from paddleocr import PaddleOCR
from utils.email_service import send_violation_email
from models.violation import Violation
from app.extensions import db

# Load YOLO model

model = YOLO("../ml_model/best.pt")
classNames = ["with helmet", "without helmet", "rider", "number plate"]
ocr = PaddleOCR(use_angle_cls=True, lang='en')

def process_image_and_detect(image_array):
    """ Process image and detect helmet and number plate. """
    results = model(image_array)
    detected_plates = set()
    violations = []

    for r in results:
        boxes = r.boxes
        for box in boxes:
            x1, y1, x2, y2 = map(int, box.xyxy[0].tolist())
            cls = int(box.cls[0].item())
            conf = float(box.conf[0].item())
            label = classNames[cls]

            if label == "number plate" and conf > 0.5:
                cropped_plate = image_array[y1:y2, x1:x2]
                plate_number = perform_ocr(cropped_plate)

                if plate_number not in detected_plates:
                    detected_plates.add(plate_number)
                    helmet_status = check_helmet_status(boxes)

                    # Calculate fine
                    fine_amount = 500 if helmet_status == "without helmet" else 0
                    violation = Violation(
                        rider_id="unknown",
                        helmet_status=helmet_status,
                        plate_number=plate_number,
                        fine_amount=fine_amount
                    )
                    db.session.add(violation)
                    db.session.commit()

                    # Send email for violations
                    if fine_amount > 0:
                        send_violation_email(plate_number, image_array)
                    violations.append(violation)

    return violations


def check_helmet_status(boxes):
    """ Check if rider has a helmet or not """
    for box in boxes:
        cls = int(box.cls[0].item())
        label = classNames[cls]
        if label == "without helmet":
            return "without helmet"
    return "with helmet"


def perform_ocr(cropped_plate):
    """ Perform OCR to detect the plate number """
    result = ocr.ocr(cropped_plate, rec=True)
    detected_text = []
    if result and result[0]:
        for res in result[0]:
            text = res[1][0]
            detected_text.append(text)
    return " ".join(detected_text)
