# 🌿 AgriAI Sense V1

### AI-Powered Crop Disease Detection & Agricultural Advisory Platform

AgriAI Sense V1 is an intelligent agriculture platform that leverages Artificial Intelligence, Computer Vision, Deep Learning, and Agricultural Knowledge Systems to detect crop diseases from leaf images and provide actionable recommendations to farmers.

The platform combines disease detection, image quality analysis, confidence evaluation, prediction history tracking, MongoDB cloud storage, PDF report generation, and agricultural advisory into a single farmer-friendly application.

---

# 🚀 Project Overview

Crop diseases are one of the leading causes of agricultural yield loss worldwide. Farmers often struggle to identify diseases accurately during the early stages of infection.

AgriAI Sense V1 helps solve this problem by allowing users to upload crop leaf images and instantly receive:

✅ Disease Identification

✅ Disease Severity Assessment

✅ Confidence Evaluation

✅ Reliability Classification

✅ Disease Causes

✅ Symptoms

✅ Treatment Recommendations

✅ Prevention Guidance

✅ Image Quality Analysis

✅ Prediction History Tracking

✅ MongoDB Cloud Storage

✅ PDF Report Generation

---

# 🎥 Project Demo

Watch the complete AgriAI Sense V1 walkthrough:

```text
video/
└── AgriAI.mp4
```

### Demo Includes

✅ Disease Detection

✅ Healthy Crop Detection

✅ High Confidence Prediction

✅ Low Confidence Prediction

✅ Image Quality Validation

✅ MongoDB Atlas Storage

✅ Prediction History

✅ PDF Report Generation

✅ Download Report from Result Page

✅ Download Report from History Page

---

# ✨ Key Features

## 🌱 AI Disease Detection

* CNN-based disease classification
* Multi-class plant disease detection
* Healthy vs Diseased leaf identification
* Real-time prediction
* Confidence-based disease evaluation
* Reliability categorization

---

## 📷 Smart Image Quality Analysis

Before disease prediction, the system evaluates image quality.

### Quality Checks

* Image readability validation
* Blur detection using OpenCV
* Brightness analysis
* Focus assessment

### Farmer-Friendly Results

* Focus → Sharp / Blurry
* Lighting → Good / Too Dark / Too Bright

### Advanced Diagnostics

* Blur Score
* Brightness Score
* Quality Classification

This prevents unreliable predictions caused by poor-quality images.

---

## 📊 Confidence & Reliability Analysis

Predictions are grouped into reliability levels.

| Confidence Score | Reliability |
| ---------------- | ----------- |
| 90%+             | High        |
| 75% – 89%        | Medium      |
| Below 75%        | Low         |

Low-confidence predictions automatically generate advisory messages encouraging users to upload clearer images.

---

## 💊 Agricultural Advisory Engine

For every detected disease, the platform provides:

* Cause
* Symptoms
* Treatment
* Prevention
* Severity

This transforms the application from a simple classifier into a practical decision-support system.

---

## 🗄 Prediction History Management

All disease predictions are automatically stored in MongoDB Atlas.

Stored Information:

* Crop Name
* Disease
* Confidence Score
* Reliability Level
* Severity
* Prediction Status
* Treatment Recommendation
* Prevention Guidance
* Prediction Timestamp

Benefits:

* Historical disease tracking
* Scan history management
* Farmer record keeping
* Future analytics support

---

## 📄 PDF Report Generation

Users can generate downloadable crop health reports.

Each report includes:

* Crop Name
* Disease Name
* Confidence Score
* Reliability Level
* Severity
* Cause
* Symptoms
* Treatment
* Prevention
* Prediction Status
* Report Generation Timestamp

Reports are generated dynamically using ReportLab.

---

# 📈 Model Performance

## Dataset

PlantVillage Dataset

## Classification Type

Multi-Class Image Classification

## Total Classes

38 Plant Disease Classes

## Model Architecture

Convolutional Neural Network (CNN)

## Framework

TensorFlow / Keras

## Validation Accuracy

**94% Validation Accuracy**

> Note: PlantVillage contains laboratory-controlled images. Real-world deployment requires additional field image training and validation.

---

# 🌾 Supported Crops

The current version supports diseases across multiple crops including:

* Apple
* Potato
* Tomato
* Corn (Maize)
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

# 🦠 Example Diseases Detected

* Apple Scab
* Black Rot
* Cedar Apple Rust
* Potato Early Blight
* Potato Late Blight
* Tomato Mosaic Virus
* Tomato Leaf Mold
* Tomato Yellow Leaf Curl Virus
* Common Rust (Corn)
* Powdery Mildew
* Healthy Leaves

**Total Supported Classes: 38**

---

# 🤖 Agent-Based Architecture

## Disease Detection Agent

### Responsibilities

* Image preprocessing
* CNN inference
* Confidence calculation
* Crop extraction
* Disease classification

### Output

* Crop
* Disease
* Confidence
* Prediction Status

---

## Recommendation Agent

### Responsibilities

* Query disease knowledge base
* Retrieve disease information
* Generate agricultural recommendations

### Output

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
(File + Quality Checks)
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
       │
       ▼
MongoDB Atlas
       │
       ▼
PDF Report Generator
       │
       ▼
Prediction History Dashboard
```

# 🛠 Technology Stack

## Frontend

* React.js
* Axios
* CSS3
* Lucide React Icons

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

## Backend Setup

```bash
conda activate plantai

pip install -r requirements.txt

cd backend

uvicorn app:app --reload
```

Backend URL:

```text
http://127.0.0.1:8000
```

---

## Frontend Setup

```bash
cd frontend

npm install

npm start
```

Frontend URL:

```text
http://localhost:3000
```

---

# 🔄 Sample Workflow

1. Upload crop leaf image
2. System validates image quality
3. CNN model predicts disease
4. Confidence score calculated
5. Reliability level assigned
6. Knowledge base queried
7. Recommendations generated
8. Prediction stored in MongoDB Atlas
9. PDF report generated on demand
10. Prediction history updated

---

# 🔮 Future Roadmap

## Phase 2

* Dashboard Analytics
* Disease Trend Analysis
* Crop Health Statistics
* Farmer Activity Insights

## Phase 3

* AI Farmer Chatbot
* Weather Risk Prediction
* Crop Recommendation Engine
* Multi-language Support

## Phase 4

* Multi-Agent Agricultural Intelligence Platform
* Yield Forecasting
* Market Price Prediction
* Precision Farming Analytics
* IoT Sensor Integration
* Satellite Data Integration

---

# 🎯 Real-World Impact

AgriAI helps farmers:

✅ Detect diseases early

✅ Reduce crop losses

✅ Improve treatment decisions

✅ Monitor crop health more effectively

✅ Maintain disease history records

✅ Generate crop health reports

✅ Access AI-powered agricultural guidance

✅ Improve farming productivity

The platform demonstrates how Artificial Intelligence, Computer Vision, Deep Learning, and Agricultural Knowledge Systems can be combined to solve real-world farming challenges.

---

# 👨‍💻 Author

**Sheetal Sharma**

AI Engineer | Data Science Enthusiast | Agricultural Intelligence Systems

**AgriAI Sense V1**
