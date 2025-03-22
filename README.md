#  SafeRider: Automated Helmet Detection and Fine Management System

SafeRider is an intelligent system that automates the process of detecting helmet violations, identifying vehicles through license plate recognition, and issuing fines. It leverages **YOLOv8 for helmet detection**, **OCR for license plate recognition**, and **OpenCV for image processing**. The system retrieves vehicle information from a central database, issues fines, and sends email notifications to offenders.

![Screenshot 2025-03-22 152609](https://github.com/user-attachments/assets/a5925f56-6429-4662-bcf4-915ff14f20d3)


# Checkout application
https://saferider.vercel.app/

##  Features
- Helmet detection using YOLOv8.  
- License plate recognition using OCR and OpenCV.  
- Fine issuance and email notifications with violation details.  
- Secure user authentication with JWT and bcrypt.  
- Admin dashboard for monitoring and issuing fines.  
- Payment gateway for fine payments.  

---

##  Tech Stack
### Frontend:
- React.js + Tailwind CSS 

### Backend:
- Python Flask
- MySQL 

### Machine Learning:
- YOLOv8 for helmet detection
- OpenCV for image processing
- OCR for license plate recognition

##  System Workflow
1. **Helmet Detection:** YOLOv8 detects whether the rider is wearing a helmet.
2. **License Plate Recognition:** If no helmet is detected, the system extracts and recognizes the license plate using OCR.
3. **Data Verification:** The system checks the vehicle details against the database.
4. **Fine Issuance:** If a violation is confirmed, the system:
    - Issues a fine.
    - Sends an email notification with the captured image and fine amount.
5. **User Access:**
    - Users can log in to check violations and pay fines.
    - Admins can monitor data and manage fine records.

##  Project Setup
### Prerequisites
- Python 3.x
- MySQL Database
- Virtual Environment (venv)

### Clone the Repository
```bash
https://github.com/SPraveenKumar-spk/SafeRider.git
cd saferider
