import json
import tensorflow as tf
import numpy as np
from pathlib import Path
from PIL import Image

BASE_DIR = Path(__file__).parent.parent
MODEL_DIR = BASE_DIR / "model"
CONFIG_PATH = MODEL_DIR / "model_config.json"


def load_model_config():
    if not CONFIG_PATH.exists():
        raise FileNotFoundError(
            f"Model config not found at {CONFIG_PATH}. "
            "Please create backend/model/model_config.json"
        )

    with open(CONFIG_PATH, "r", encoding="utf-8") as file:
        return json.load(file)


model_config = load_model_config()

MODEL_PATH = MODEL_DIR / model_config["active_model"]
INPUT_SIZE = tuple(model_config.get("input_size", [128, 128]))

if not MODEL_PATH.exists():
    raise FileNotFoundError(
        f"Active model file not found at {MODEL_PATH}. "
        "Check active_model value in model_config.json"
    )

model = tf.keras.models.load_model(MODEL_PATH)

class_names = [
    'Apple___Apple_scab',
    'Apple___Black_rot',
    'Apple___Cedar_apple_rust',
    'Apple___healthy',
    'Blueberry___healthy',
    'Cherry_(including_sour)___Powdery_mildew',
    'Cherry_(including_sour)___healthy',
    'Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot',
    'Corn_(maize)___Common_rust_',
    'Corn_(maize)___Northern_Leaf_Blight',
    'Corn_(maize)___healthy',
    'Grape___Black_rot',
    'Grape___Esca_(Black_Measles)',
    'Grape___Leaf_blight_(Isariopsis_Leaf_Spot)',
    'Grape___healthy',
    'Orange___Haunglongbing_(Citrus_greening)',
    'Peach___Bacterial_spot',
    'Peach___healthy',
    'Pepper,_bell___Bacterial_spot',
    'Pepper,_bell___healthy',
    'Potato___Early_blight',
    'Potato___Late_blight',
    'Potato___healthy',
    'Raspberry___healthy',
    'Soybean___healthy',
    'Squash___Powdery_mildew',
    'Strawberry___Leaf_scorch',
    'Strawberry___healthy',
    'Tomato___Bacterial_spot',
    'Tomato___Early_blight',
    'Tomato___Late_blight',
    'Tomato___Leaf_Mold',
    'Tomato___Septoria_leaf_spot',
    'Tomato___Spider_mites Two-spotted_spider_mite',
    'Tomato___Target_Spot',
    'Tomato___Tomato_Yellow_Leaf_Curl_Virus',
    'Tomato___Tomato_mosaic_virus',
    'Tomato___healthy'
]


def clean_prediction(label):
    parts = label.split("___")
    crop = parts[0].replace("_", " ").strip()
    disease = parts[1].replace("_", " ").strip() if len(parts) > 1 else "Unknown"
    return crop, disease


def preprocess_image(image_path):
    img = Image.open(image_path).convert("RGB")
    img = img.resize(INPUT_SIZE)

    img_array = np.array(img)
    img_array = np.expand_dims(img_array, axis=0)

    return img_array


def predict_disease(image_path):
    img_array = preprocess_image(image_path)

    prediction = model.predict(img_array, verbose=0)
    result_index = int(np.argmax(prediction))

    label = class_names[result_index]
    confidence = float(np.max(prediction) * 100)

    crop, disease = clean_prediction(label)

    return {
        "crop": crop,
        "disease": disease,
        "class_name": label,
        "confidence": round(confidence, 2),
        "model_version": model_config.get("version", "v1"),
        "model_type": model_config.get("model_type", "Unknown"),
        "model_accuracy": model_config.get("validation_accuracy", "N/A")
    }