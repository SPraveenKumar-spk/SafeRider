import cv2
import torch
import cvzone
from ultralytics import YOLO
from paddleocr import PaddleOCR
import os
import numpy as np
import pytesseract
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize YOLO model and OCR
model_path = os.path.join(os.path.dirname(__file__), 'best.pt')
model = YOLO(model_path)
device = torch.device("cpu")
classNames = ["with helmet", "without helmet", "rider", "number plate"]
ocr = PaddleOCR(use_angle_cls=True, lang='en')

def apply_clahe(image, clip_limit=1.0, tile_grid_size=(8, 8)):
    """Apply CLAHE to enhance contrast of the image."""
    try:
        lab = cv2.cvtColor(image, cv2.COLOR_BGR2LAB)
        l, a, b = cv2.split(lab)
        clahe = cv2.createCLAHE(clipLimit=clip_limit, tileGridSize=tile_grid_size)
        l_clahe = clahe.apply(l)
        lab_clahe = cv2.merge((l_clahe, a, b))
        return cv2.cvtColor(lab_clahe, cv2.COLOR_LAB2BGR)
    except Exception as e:
        logger.error(f"Error applying CLAHE: {e}")
        raise

def calculate_iou(box1, box2):
    """Calculate IoU between two bounding boxes."""
    x1, y1, x2, y2 = box1
    rx1, ry1, rx2, ry2 = box2
    xi1, yi1 = max(x1, rx1), max(y1, ry1)
    xi2, yi2 = min(x2, rx2), min(y2, ry2)
    inter_area = max(0, xi2 - xi1) * max(0, yi2 - yi1)
    box1_area = (x2 - x1) * (y2 - y1)
    box2_area = (rx2 - rx1) * (ry2 - ry1)
    union_area = box1_area + box2_area - inter_area
    iou = inter_area / union_area if union_area > 0 else 0
    logger.debug(f"IoU check: Box ({x1}, {y1}, {x2}, {y2}), Rider box ({rx1}, {ry1}, {rx2}, {ry2}), IoU: {iou}")
    return iou

def preprocess_for_ocr(crop):
    """Preprocess number plate crop for OCR."""
    try:
        crop = cv2.resize(crop, None, fx=2, fy=2, interpolation=cv2.INTER_CUBIC)
        gray = cv2.cvtColor(crop, cv2.COLOR_BGR2GRAY)
        clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
        enhanced = clahe.apply(gray)
        blurred = cv2.GaussianBlur(enhanced, (3, 3), 0)
        return blurred
    except Exception as e:
        logger.error(f"Error preprocessing for OCR: {e}")
        raise

def process_image(image_array):
    """Process image for helmet detection and number plate OCR."""
    if image_array is None or not isinstance(image_array, np.ndarray):
        logger.error("Invalid image array provided")
        return None

    # Store original image for OCR
    original_image = image_array.copy()

    # Apply CLAHE for detection
    try:
        image_array = apply_clahe(image_array, clip_limit=1.0)
    except Exception as e:
        logger.error(f"CLAHE processing failed: {e}")
        return None

    # Convert BGR to RGB for YOLO model
    new_img = cv2.cvtColor(image_array, cv2.COLOR_BGR2RGB)
    results = model(new_img, stream=True, device="cpu")

    helmet_statuses = []
    detected_objects = []
    vehicle_number = None
    np_conf = 0.0

    for r in results:
        boxes = r.boxes
        li = dict()
        rider_boxes = []
        xy = boxes.xyxy
        confidences = boxes.conf
        classes = boxes.cls
        new_boxes = torch.cat((xy.to(device), confidences.unsqueeze(1).to(device), classes.unsqueeze(1).to(device)), 1)

        # Collect rider boxes
        try:
            indices = torch.where(new_boxes[:, -1] == 2)  # Class 2 is "rider"
            rows = new_boxes[indices]
            for box in rows:
                x1, y1, x2, y2 = map(int, box[:4].tolist())
                rider_boxes.append((x1, y1, x2, y2))
        except Exception as e:
            logger.error(f"Error processing rider boxes: {e}")

        # Process detected objects
        for i, box in enumerate(new_boxes):
            x1, y1, x2, y2 = map(int, box[:4].tolist())
            conf = float(box[4].item())
            cls = int(box[5].item())
            w, h = x2 - x1, y2 - y1

            conf_threshold = 0.5 if classNames[cls] in ["with helmet", "without helmet"] else 0.4
            if classNames[cls] in ["with helmet", "without helmet", "rider", "number plate"] and conf >= conf_threshold:
                detected_objects.append({
                    'class': classNames[cls],
                    'conf': conf,
                    'box': (x1, y1, x2, y2)
                })
                cvzone.cornerRect(image_array, (x1, y1, w, h), l=15, rt=5, colorR=(255, 0, 0))

                # Associate objects with riders
                if rider_boxes:
                    associated = False
                    iou_threshold = 0.01 if classNames[cls] == "number plate" else 0.1
                    for j, rider in enumerate(rider_boxes):
                        if calculate_iou((x1, y1, x2, y2), rider) > iou_threshold:
                            li.setdefault(f"rider{j}", []).append(classNames[cls])
                            associated = True
                            logger.debug(f"Associated {classNames[cls]} with rider{j} via IoU")
                    if not associated and classNames[cls] in ["with helmet", "without helmet", "number plate"]:
                        distances = [((x1 + x2)/2 - (rider[0] + rider[2])/2)**2 +
                                     ((y1 + y2)/2 - (rider[1] + rider[3])/2)**2 for rider in rider_boxes]
                        nearest_rider_idx = np.argmin(distances)
                        li.setdefault(f"rider{nearest_rider_idx}", []).append(classNames[cls])
                        logger.debug(f"Fallback: Assigned {classNames[cls]} to rider{nearest_rider_idx}")

                # Process number plate OCR
                if classNames[cls] == "number plate":
                    crop = original_image[y1:y2, x1:x2]
                    try:
                        preprocessed_crop = preprocess_for_ocr(crop)
                        results = ocr.ocr(preprocessed_crop, rec=True)
                        detected_text = []

                        if results and results[0]:
                            for result in results[0]:
                                text = result[1][0]
                                y_pos = result[0][0][1]
                                detected_text.append((y_pos, text))
                        else:
                            logger.info("No text detected by PaddleOCR, trying Tesseract")
                            tesseract_text = pytesseract.image_to_string(preprocessed_crop, config='--psm 6')
                            if tesseract_text.strip():
                                detected_text.append((0, tesseract_text.strip()))
                                logger.info(f"Tesseract detected: {tesseract_text.strip()}")

                        detected_text.sort(key=lambda x: x[0])
                        vehicle_number = " ".join(text for _, text in detected_text)
                        np_conf = conf

                        cvzone.putTextRect(image_array, f"{vehicle_number} {round(np_conf*100, 2)}%",
                                           (x1, y1 - 50), scale=1.5, offset=10, thickness=2,
                                           colorT=(39, 40, 41), colorR=(105, 255, 255))

                    except Exception as e:
                        logger.error(f"OCR error: {e}")

        # Determine helmet status for each rider
        for rider_id, statuses in li.items():
            with_helmet_conf = max([obj['conf'] for obj in detected_objects if obj['class'] == "with helmet" and obj['box'] in [(x1, y1, x2, y2) for x1, y1, x2, y2 in [obj['box'] for obj in detected_objects if obj['class'] in statuses]]], default=0)
            without_helmet_conf = max([obj['conf'] for obj in detected_objects if obj['class'] == "without helmet" and obj['box'] in [(x1, y1, x2, y2) for x1, y1, x2, y2 in [obj['box'] for obj in detected_objects if obj['class'] in statuses]]], default=0)
            if with_helmet_conf > without_helmet_conf and with_helmet_conf > 0:
                status = "WITH HELMET"
            elif without_helmet_conf > 0:
                status = "WITHOUT HELMET"
            else:
                status = "NO HELMET DETECTED"
            helmet_statuses.append(status)
            logger.info(f"{rider_id} - {status} (With helmet conf: {with_helmet_conf}, Without helmet conf: {without_helmet_conf})")

    # Set summary status
    if helmet_statuses:
        summary_status = helmet_statuses[0]
    else:
        summary_status = "NO RIDER DETECTED"

    # Encode processed image as PNG
    try:
        success, encoded_image = cv2.imencode('.png', image_array)
        if not success:
            logger.error("Failed to encode processed image")
            return None
        image_data = encoded_image.tobytes()
        image_mime_type = 'image/png'
    except Exception as e:
        logger.error(f"Error encoding image: {e}")
        return None

    # Determine helmet_detected
    helmet_detected = summary_status == "WITH HELMET"

    logger.info(f"Processing complete: helmet_detected={helmet_detected}, plate_number={vehicle_number}, confidence={np_conf}")
    return {
        'helmet_detected': helmet_detected,
        'plate_number': vehicle_number,
        'image_data': image_data,
        'image_mime_type': image_mime_type,
        'confidence': np_conf
    }