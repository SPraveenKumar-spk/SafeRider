import cv2
import cvzone
import torch
import csv
import os
import numpy as np
from ultralytics import YOLO
from paddleocr import PaddleOCR
from app.models.violation import Violation
from app.extensions import db
from app.utils.email_service import send_email

# Model Setup
model = YOLO("./runs/detect/train3/weights/best.pt")
device = torch.device("cpu")
classNames = ["with helmet", "without helmet", "rider", "number plate"]
ocr = PaddleOCR(use_angle_cls=True, lang='en')

# Set to track detected plates
detected_plates = set()

def process_image_array(image_array, image_path):
    """Process an image for helmet and license plate Violation."""
    if image_array is None or not isinstance(image_array, np.ndarray):
        print("Invalid image array provided.")
        return None

    new_img = cv2.cvtColor(image_array, cv2.COLOR_BGR2RGB)
    results = model(new_img, stream=True, device="cpu")
    
    for r in results:
        boxes = r.boxes
        li = dict()
        rider_box = list()
        xy = boxes.xyxy
        confidences = boxes.conf
        classes = boxes.cls
        new_boxes = torch.cat((xy.to(device), confidences.unsqueeze(1).to(device), classes.unsqueeze(1).to(device)), 1)

        try:
            new_boxes = new_boxes[new_boxes[:, -1].sort()[1]]
            indices = torch.where(new_boxes[:, -1] == 2)  # Rider class
            rows = new_boxes[indices]
            for box in rows:
                x1, y1, x2, y2 = map(int, box[:4].tolist())
                rider_box.append((x1, y1, x2, y2))
        except:
            pass

        for i, box in enumerate(new_boxes):
            x1, y1, x2, y2 = map(int, box[:4].tolist())
            conf = float(box[4].item())
            cls = int(box[5].item())
            w, h = x2 - x1, y2 - y1

            if classNames[cls] in ["with helmet", "without helmet", "number plate"] and conf >= 0.5:
                cvzone.cornerRect(image_array, (x1, y1, w, h), l=15, rt=5, colorR=(255, 0, 0))
                cvzone.putTextRect(image_array, f"{classNames[cls].upper()} {conf*100:.2f}%", (x1 + 10, y1 - 10), 
                                   scale=1.5, offset=10, thickness=2, colorT=(39, 40, 41), colorR=(248, 222, 34))

                if classNames[cls] == "number plate":
                    crop = image_array[y1:y2, x1:x2]
                    try:
                        # Perform OCR
                        results = ocr.ocr(crop, rec=True)
                        detected_text = []
                        if results and results[0]:  
                            for result in results[0]:
                                text = result[1][0]
                                y_position = result[0][0][1]
                                detected_text.append((y_position, text))

                        detected_text.sort(key=lambda x: x[0])
                        plate_number = " ".join(text for _, text in detected_text)
                        np_conf = conf

                        if plate_number and plate_number not in detected_plates:
                            detected_plates.add(plate_number)

                            # Save to DB
                            helmet_detected = 'without helmet' not in li.get(f"rider{i}", [])
                            save_Violation_to_db(plate_number, image_path, helmet_detected)

                            # Send email
                            subject = "Violation Alert"
                            body = f"A violation was detected for vehicle {plate_number}."
                            to_email = "99210042006@klu.ac.in"
                            send_email(subject, body, to_email, image_array)

                    except Exception as e:
                        print(f"OCR error: {e}")

    return image_array


def save_Violation_to_db(plate_number, image_path, helmet_detected):
    """Save Violation result to the database."""
    new_Violation = Violation(
        plate_number=plate_number,
        image_path=image_path,
        helmet_detected=helmet_detected
    )
    db.session.add(new_Violation)
    db.session.commit()
