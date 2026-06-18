# 🌿 AgriAI Sense V1

### AI-Powered Crop Disease Detection, Analytics & Agricultural Advisory Platform

AgriAI Sense V1 is an intelligent agriculture platform that combines Artificial Intelligence, Deep Learning, Computer Vision, Agricultural Knowledge Systems, Cloud Databases, and Human Feedback Learning to help farmers detect crop diseases and make informed decisions.

The system provides disease detection, image quality analysis, agricultural recommendations, prediction history management, dashboard analytics, PDF report generation, and a continuous feedback loop for future model improvement.

---

# 🚀 Project Overview

Crop diseases significantly impact agricultural productivity and farmer income.

AgriAI Sense V1 helps solve this challenge by allowing farmers to upload crop leaf images and instantly receive:

✅ Disease Identification

✅ Disease Severity Assessment

✅ Confidence Evaluation

✅ Reliability Classification

✅ Cause Analysis

✅ Symptom Identification

✅ Treatment Recommendations

✅ Prevention Guidance

✅ Image Quality Assessment

✅ Prediction History Tracking

✅ MongoDB Atlas Cloud Storage

✅ Dashboard Analytics

✅ PDF Report Generation

✅ Human Feedback Collection

---

# 🎥 Project Demo

```text
video/
└── AgriAI.mp4
```

Demo showcases:

* Disease Detection
* Healthy Leaf Detection
* High Confidence Predictions
* Low Confidence Warnings
* Blur Detection
* Image Quality Validation
* MongoDB Atlas Integration
* Prediction History
* Analytics Dashboard
* PDF Report Generation
* Feedback Collection

---

# ✨ Key Features

## 🌱 AI Disease Detection

* CNN-based disease classification
* Multi-class plant disease detection
* Healthy vs Diseased leaf identification
* Real-time prediction
* Confidence-based evaluation
* Reliability categorization

---

## 📷 Smart Image Quality Analysis

Before disease prediction the system validates image quality.

### Quality Checks

* File Validation
* Image Readability Check
* Blur Detection
* Brightness Analysis
* Focus Assessment

### User-Friendly Results

* Focus: Sharp / Blurry
* Lighting: Good / Too Dark / Too Bright

### Technical Diagnostics

* Blur Score
* Brightness Score
* Quality Classification

---

## 📊 Confidence & Reliability Analysis

| Confidence Score | Reliability |
| ---------------- | ----------- |
| 90%+             | High        |
| 75%-89%          | Medium      |
| Below 75%        | Low         |

Low-confidence predictions automatically generate guidance asking users to upload clearer images.

---

## 💊 Agricultural Advisory Engine

For every detected disease the platform provides:

* Cause
* Symptoms
* Treatment
* Prevention
* Severity

The recommendation engine is powered through a structured agricultural knowledge base.

---

## 🗄 MongoDB Atlas Prediction History

All predictions are stored in MongoDB Atlas.

Stored Information:

* Crop
* Disease
* Class Name
* Confidence
* Reliability
* Severity
* Status
* Blur Score
* Brightness Score
* Cause
* Symptoms
* Treatment
* Prevention
* Timestamp
* User Feedback

Benefits:

* Historical disease tracking
* Farmer record management
* Future retraining support
* Dashboard analytics

---

## 📄 PDF Report Generation

Users can generate downloadable crop health reports directly from:

* Disease Detection Page
* Prediction History Page

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
* Status
* Timestamp

Generated dynamically using ReportLab.

---

## 👍 Human Feedback Loop

Users can provide feedback on predictions:

* 👍 Correct
* 👎 Wrong

Stored in MongoDB Atlas.

Benefits:

* Human-in-the-loop learning
* Future model retraining
* Continuous improvement
* Real-world accuracy validation

---

# 📈 Dashboard Analytics

Real-time dashboard analytics are generated directly from MongoDB Atlas.

Current Metrics:

* Total Scans
* Diseased Leaves
* Healthy Leaves
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

---

# 📈 Model Performance

## Dataset

PlantVillage Dataset

## Classification Type

Multi-Class Image Classification

## Total Classes

38 Plant Disease Classes

## Architecture

Custom CNN

## Framework

TensorFlow / Keras

## Validation Accuracy

94%

---

# 🌾 Supported Crops

* Apple
* Potato
* Tomato
* Corn
* Grape
* Peach
* Strawberry
* Pepper
* Orange
* Soybean
* Raspberry
* Cherry
* Squash
* Blueberry

---

# 🤖 Agent-Based Architecture

## Disease Detection Agent

Responsibilities:

* Image preprocessing
* Disease classification
* Confidence scoring
* Crop extraction

Outputs:

* Crop
* Disease
* Confidence
* Status

---

## Recommendation Agent

Responsibilities:

* Knowledge retrieval
* Disease advisory generation
* Treatment recommendation

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
(File Validation + Quality Check)
        │
        ▼
Disease Detection Agent
        │
        ▼
TensorFlow CNN Model
        │
        ▼
Recommendation Agent
        │
        ▼
Disease Knowledge Base
(JSON)
        │
        ▼
MongoDB Atlas
        │
        ├── Prediction History
        ├── Feedback Storage
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
AgriAISenseV1/

├── backend/
│   ├── agents/
│   ├── knowledge/
│   ├── model/
│   ├── uploads/
│   ├── app.py
│   ├── database.py
│   └── report_generator.py
│
├── frontend/
│   ├── src/
│   └── public/
│
├── video/
│   └── AgriAI.mp4
│
├── requirements.txt
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

1. Upload crop image
2. Validate image quality
3. Predict disease
4. Calculate confidence
5. Retrieve recommendations
6. Store in MongoDB Atlas
7. Generate PDF report
8. Save prediction history
9. Collect user feedback
10. Display dashboard analytics

---

# 🔮 Future Roadmap

## Phase 2

* MobileNetV2 Model Upgrade
* Model Versioning
* Feedback-Based Retraining
* Advanced Analytics

## Phase 3

* AI Farmer Chatbot
* Weather Intelligence Agent
* Crop Recommendation Agent
* Multi-language Support

## Phase 4

* Multi-Agent Agricultural Intelligence Platform
* Yield Forecasting
* Market Intelligence
* Precision Farming Analytics
* IoT Integration
* Satellite Intelligence

---

# 🎯 Real-World Impact

AgriAI helps farmers:

✅ Detect diseases early

✅ Reduce crop losses

✅ Improve treatment decisions

✅ Maintain crop health records

✅ Generate AI-powered reports

✅ Track disease trends

✅ Provide feedback to improve AI

✅ Access intelligent agricultural recommendations

---

# 👨‍💻 Author

**Sheetal Sharma**

AI Engineer | Data Science Enthusiast | Agricultural Intelligence Systems

**AgriAI Sense V1**
