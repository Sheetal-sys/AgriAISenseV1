# 🌱 AgriAI Sense V1

An AI-powered agricultural intelligence platform that helps farmers identify crop diseases from leaf images and receive actionable treatment, prevention, and advisory recommendations.

---

## 🚀 Project Overview

AgriAI Sense is an end-to-end Machine Learning and AI platform designed to support farmers with rapid crop disease diagnosis using Computer Vision.

The platform allows users to upload an image of a crop leaf, automatically detects the disease using a Convolutional Neural Network (CNN), and provides:

* Disease identification
* Confidence score
* Disease severity
* Symptoms
* Possible causes
* Treatment recommendations
* Prevention guidelines

The solution combines Deep Learning, FastAPI, React, and a knowledge-driven recommendation engine into a scalable AI platform architecture.

---

## 🎯 Problem Statement

Crop diseases significantly reduce agricultural productivity and often require expert intervention for diagnosis.

Many farmers:

* Cannot quickly identify diseases
* Lack access to agricultural experts
* Apply incorrect treatments
* Lose crop yield due to delayed action

AgriAI aims to provide an accessible AI-based disease diagnosis system that can assist farmers in making informed decisions.

---

# 🏗️ System Architecture
```text 
Farmer Uploads Leaf Image
            │
            ▼
     React Frontend
            │
            ▼
     FastAPI Backend
            │
            ▼
 Disease Detection Agent
            │
            ▼
   CNN Model (.keras)
            │
            ▼
    Predicted Disease
            │
            ▼
 Recommendation Agent
            │
            ▼
 disease_knowledge.json
            │
            ▼
     Final AI Response
```

---

# 🧠 AI Pipeline

### Disease Detection Agent

Responsible for:

* Loading trained CNN model
* Image preprocessing
* Prediction generation
* Confidence calculation
* Class mapping

### Recommendation Agent

Responsible for:

* Retrieving disease information
* Cause identification
* Symptom explanation
* Treatment recommendations
* Prevention guidelines
* Severity estimation

---

# 📂 Project Structure

```text
AgriAI/
│
├── backend/
│   ├── app.py
│   │
│   ├── agents/
│   │   ├── disease_detection_agent.py
│   │   └── recommendation_agent.py
│   │
│   ├── model/
│   │   └── trained_plant_disease_model.keras
│   │
│   ├── knowledge/
│   │   └── disease_knowledge.json
│   │
│   └── requirements.txt
│
├── frontend/
│
├── notebooks/
│   ├── Train_Plant_disease.ipynb
│   └── Test_plant_disease.ipynb
│
└── README.md
```

---

# 🌿 Supported Crop Classes

The model currently supports **38 crop disease classes**, including:

### Apple

* Apple Scab
* Black Rot
* Cedar Apple Rust
* Healthy

### Corn

* Cercospora Leaf Spot
* Common Rust
* Northern Leaf Blight
* Healthy

### Grape

* Black Rot
* Esca (Black Measles)
* Leaf Blight
* Healthy

### Potato

* Early Blight
* Late Blight
* Healthy

### Tomato

* Bacterial Spot
* Early Blight
* Late Blight
* Leaf Mold
* Septoria Leaf Spot
* Spider Mites
* Target Spot
* Yellow Leaf Curl Virus
* Mosaic Virus
* Healthy

And several additional crops including:

* Peach
* Orange
* Strawberry
* Raspberry
* Soybean
* Pepper
* Squash
* Blueberry
* Cherry

---

# 📊 Model Information

### Model Type

Convolutional Neural Network (CNN)

### Input Shape

```text
128 x 128 x 3
```

### Parameters

```text
7,842,762
```

### Number of Classes

```text
38
```

### Validation Accuracy

```text
~94%
```

### Framework

```text
TensorFlow / Keras
```

---

# 🛠️ Technology Stack

## AI / Machine Learning

* Python
* TensorFlow
* Keras
* NumPy
* OpenCV

## Backend

* FastAPI
* Uvicorn

## Frontend

* React.js
* CSS3

## Data

* JSON Knowledge Base

## Development Tools

* Jupyter Notebook
* VS Code
* Git
* GitHub

---

# ⚙️ Installation

## Clone Repository

```bash
git clone https://github.com/Sheetal-sys/AgriAISenseV1.git
```

```bash
cd AgriAISenseV1
```

---

## Backend Setup

```bash
cd backend
```

Create environment:

```bash
conda create -n plantai python=3.10
```

Activate:

```bash
conda activate plantai
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Start FastAPI server:

```bash
uvicorn app:app --reload
```

Backend runs at:

```text
http://localhost:8000
```

Swagger API:

```text
http://localhost:8000/docs
```

---

## Frontend Setup

```bash
cd frontend
```

Install packages:

```bash
npm install
```

Start application:

```bash
npm start
```

Frontend runs at:

```text
http://localhost:3000
```

---

# 🧪 API Endpoint

### Predict Disease

```http
POST /predict
```

### Input

Multipart image upload

### Output

```json
{
  "crop": "Corn (maize)",
  "disease": "Common rust",
  "confidence": 100.0,
  "cause": "Fungal disease producing rust-colored pustules.",
  "symptoms": "Small orange-brown pustules on leaf surfaces.",
  "treatment": "Apply suitable fungicide if severe.",
  "prevention": "Use resistant varieties and monitor during humid weather.",
  "severity": "Medium"
}
```

---

# 📸 Screenshots

### Landing Page

![AgriAI landing page showing a dark themed farm intelligence dashboard with a left sidebar menu and central hero text that reads AI-powered crop health, disease detection and farm advisory](<Screenshot 2026-06-10 220803.png>)

### Disease Detection Dashboard
c:\Users\Dell\OneDrive\Pictures\Screenshots\Screenshot 2026-06-10 220738.png

### Prediction Results

![Disease detection dashboard showing a dark themed farm intelligence interface with a leaf image upload section, and a result panel identifying Potato Early blight at 100% confidence with cause, symptoms, treatment, and prevention details](<Screenshot 2026-06-10 220837.png>)
---

# 🔮 Future Roadmap

### Phase 2

* AI Recommendation Agent
* Weather Intelligence Agent
* Crop Recommendation Agent
* Yield Prediction Agent

### Phase 3

* Farmer Chatbot
* Voice Assistant
* Multi-language Support
* Mobile Application

### Phase 4

* Satellite Image Analysis
* Soil Intelligence Module
* Pest Detection Agent
* Generative AI Advisory System

---

# 💡 Key Learnings

This project demonstrates:

* End-to-End ML System Design
* Computer Vision for Agriculture
* FastAPI Backend Development
* React Frontend Engineering
* Agent-Based Architecture
* Knowledge Driven AI Systems
* Model Deployment Workflows

---

# 👨‍💻 Author

**Sheetal**

AI Engineer | Machine Learning Enthusiast | Full Stack Developer

GitHub:
https://github.com/Sheetal-sys
 ---

## ⭐ Support

If you found this project useful, consider giving it a star on GitHub.

Model File

The trained CNN model is not included in the repository because of GitHub file-size limitations.

Place the model here:

backend/model/trained_plant_disease_model.keras

You can retrain the model using:

notebooks/Train_Plant_disease.ipynb

---
## Notes
