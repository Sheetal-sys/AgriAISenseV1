# 🌿 AgriAI Sense V1

## AI-Powered Crop Disease Detection & Agricultural Intelligence Platform

AgriAI Sense V1 is an end-to-end AI-powered agriculture platform designed to help farmers identify crop diseases from leaf images, receive treatment recommendations, generate reports, track historical predictions, and improve model accuracy through human feedback.

The platform combines:

* Deep Learning
* Computer Vision
* FastAPI
* React
* MongoDB Atlas
* Agricultural Knowledge Systems

to provide a practical crop disease detection solution for real-world agricultural use cases.

---

# 🚀 Project Overview

Crop diseases cause significant agricultural losses worldwide.

AgriAI enables farmers and agricultural professionals to upload a leaf image and instantly receive:

✅ Disease Identification

✅ Crop Identification

✅ Confidence Score

✅ Reliability Classification

✅ Disease Severity

✅ Cause Analysis

✅ Symptom Detection

✅ Treatment Recommendations

✅ Prevention Guidance

✅ Image Quality Assessment

✅ PDF Report Generation

✅ Prediction History Tracking

✅ Dashboard Analytics

✅ Human Feedback Collection

---

# ✨ Key Features

## 🌱 AI Disease Detection

The platform uses a fine-tuned MobileNetV2 deep learning model trained on the PlantVillage dataset.

Features:

* Multi-class disease classification
* Healthy leaf detection
* Real-time prediction
* Confidence scoring
* Reliability classification
* Crop extraction from prediction labels

---

## 📷 Image Quality Analysis

Before prediction, every image is validated.

Checks include:

### Image Validation

* Supported format validation
* Corrupt image detection
* File size validation

### Quality Assessment

* Blur Detection
* Brightness Analysis
* Focus Evaluation

Outputs:

* Blur Score
* Brightness Score
* Focus Status
* Lighting Status

Low-quality images are automatically rejected.

---

## 📊 Confidence & Reliability Engine

Predictions are categorized into reliability levels.

| Confidence Score | Reliability |
| ---------------- | ----------- |
| 90%+             | High        |
| 75–89%           | Medium      |
| Below 75%        | Low         |

Low-confidence predictions generate warning messages and request better-quality images.

---

## 💊 Agricultural Recommendation Engine

The Recommendation Agent retrieves information from a structured agricultural knowledge base.

For each disease:

* Cause
* Symptoms
* Treatment
* Prevention
* Severity

are automatically displayed.

---

## 📄 PDF Report Generation

Farmers can download professional crop health reports.

Each report contains:

* Crop
* Disease
* Confidence
* Reliability
* Severity
* Cause
* Symptoms
* Treatment
* Prevention
* Image Quality Analysis
* Report ID
* Timestamp

Generated dynamically using ReportLab.

---

## 🗄 Prediction History Management

All predictions are stored in MongoDB Atlas.

Stored Data:

* Crop
* Disease
* Confidence
* Reliability
* Severity
* Image Quality Metrics
* Recommendation Details
* Feedback
* Timestamp

Benefits:

* Historical tracking
* Farmer record management
* Future retraining dataset
* Analytics generation

---

## 👍 Human Feedback Learning

Users can validate predictions using:

👍 Correct

👎 Wrong

Feedback is stored separately and can later be used for:

* Model improvement
* Accuracy monitoring
* Retraining datasets
* Performance evaluation

---

# 📈 Analytics Dashboard

The dashboard provides real-time insights generated from MongoDB Atlas.

Current Metrics:

* Total Scans
* Healthy Leaves
* Diseased Leaves
* Average Confidence
* Most Detected Disease
* Most Scanned Crop
* Correct Feedback Count
* Wrong Feedback Count
* Feedback Accuracy

---

# 📊 Dashboard Visualizations

### Disease Distribution

Most frequently detected diseases.

### Crop Distribution

Most scanned crops.

### Confidence Trend

Prediction confidence trends over time.

### Feedback Distribution

Correct vs Wrong predictions.

---

# 🤖 AI Model Information

## Dataset

PlantVillage Dataset

### Dataset Size

* 87,870 Images
* 38 Classes

### Supported Crops

* Apple
* Corn
* Grape
* Orange
* Peach
* Pepper
* Potato
* Raspberry
* Soybean
* Squash
* Strawberry
* Tomato
* Cherry
* Blueberry

---

## Model Architecture

### MobileNetV2 (Transfer Learning)

Benefits:

* Lightweight
* Fast Inference
* Mobile Friendly
* Production Ready
* Better Generalization

---

## Training Configuration

* Image Size: 160 × 160
* Transfer Learning
* Fine-Tuning Enabled
* TensorFlow/Keras

---

## Validation Accuracy

🎯 **96.58%**

---

## Classification Type

Multi-Class Image Classification

---

## Total Classes

38 Plant Disease Classes

---

# 🤖 Agent-Based Architecture

## Disease Detection Agent

Responsibilities:

* Image preprocessing
* Model inference
* Confidence calculation
* Disease extraction
* Crop extraction

Outputs:

* Crop
* Disease
* Confidence
* Reliability

---

## Recommendation Agent

Responsibilities:

* Knowledge retrieval
* Treatment guidance
* Prevention guidance

Outputs:

* Cause
* Symptoms
* Treatment
* Prevention
* Severity

---

# 🏗 System Architecture

```text
React Frontend
      │
      ▼
FastAPI Backend
      │
      ▼
Validation Layer
(File Validation + Quality Checks)
      │
      ▼
Disease Detection Agent
      │
      ▼
MobileNetV2 Model
      │
      ▼
Recommendation Agent
      │
      ▼
Knowledge Base (JSON)
      │
      ▼
MongoDB Atlas
      │
      ├── Prediction History
      ├── User Feedback
      └── Dashboard Analytics
      │
      ▼
PDF Report Generator
```

# 🛠 Technology Stack

## Frontend

* React.js
* Axios
* Recharts
* Lucide React
* CSS3

## Backend

* FastAPI
* Python

## Machine Learning

* TensorFlow
* Keras
* NumPy

## Computer Vision

* OpenCV
* Pillow

## Database

* MongoDB Atlas
* PyMongo

## Reporting

* ReportLab

## Knowledge Layer

* JSON Knowledge Base

---

# 📂 Project Structure

```text
AgriAI/

├── backend/
│   ├── agents/
│   ├── knowledge/
│   ├── model/
│   ├── uploads/
│   ├── app.py
│   ├── database.py
│   ├── report_generator.py
│   └── requirements.txt
│
├── frontend/
│   ├── public/
│   ├── src/
│   └── package.json
│
├── notebook/
│   └── MobileNetV2_Training.ipynb
│
└── README.md
```

# ⚙️ Installation

## Backend

```bash
conda activate plantai

pip install -r requirements.txt

cd backend

uvicorn app:app --reload
```

Backend:

```text
http://127.0.0.1:8000
```

---

## Frontend

```bash
cd frontend

npm install

npm start
```

Frontend:

```text
http://localhost:3000
```

---

# 🔄 End-to-End Workflow

1. Upload leaf image
2. Validate image quality
3. Run MobileNetV2 prediction
4. Calculate confidence score
5. Retrieve recommendations
6. Store prediction in MongoDB
7. Generate PDF report
8. Save prediction history
9. Collect user feedback
10. Update dashboard analytics

---

# 🔮 Future Roadmap

## Phase 2

* Real Farm Image Dataset
* Data Augmentation Pipeline
* Feedback-Based Retraining
* Model Version Management

## Phase 3

* Weather Intelligence Agent
* Crop Recommendation Agent
* AI Farmer Chatbot
* Multi-Language Support

## Phase 4

* Multi-Agent Agricultural Intelligence Platform
* Yield Prediction
* Market Intelligence
* Precision Farming
* Satellite Data Integration
* IoT Sensor Integration

---

# 🎯 Real-World Impact

AgriAI helps farmers:

✅ Detect diseases early

✅ Reduce crop losses

✅ Improve treatment decisions

✅ Maintain crop health history

✅ Generate AI-powered reports

✅ Track disease trends

✅ Improve AI through feedback

✅ Receive actionable agricultural recommendations

---

# 👨‍💻 Author

**Sheetal Sharma**

AI & Data Science Enthusiast

AgriAI Sense V1 – Intelligent Agriculture Platform
