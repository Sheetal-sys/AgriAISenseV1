import json
from pathlib import Path

import numpy as np
import tensorflow as tf
from PIL import Image


BASE_DIR = Path(__file__).parent.parent
MODEL_DIR = BASE_DIR / "model"

CONFIG_PATH = MODEL_DIR / "model_config.json"
CLASS_NAMES_PATH = MODEL_DIR / "class_names_mobilenetv2.json"


def load_json_file(file_path):
    if not file_path.exists():
        raise FileNotFoundError(f"Required file not found: {file_path}")

    with open(file_path, "r", encoding="utf-8") as file:
        return json.load(file)


model_config = load_json_file(CONFIG_PATH)
class_names = load_json_file(CLASS_NAMES_PATH)

MODEL_PATH = MODEL_DIR / model_config["active_model"]
INPUT_SIZE = tuple(model_config.get("input_size", [160, 160]))

if not MODEL_PATH.exists():
    raise FileNotFoundError(
        f"Active model file not found: {MODEL_PATH}. "
        "Please check active_model value in model_config.json."
    )

model = tf.keras.models.load_model(MODEL_PATH)


def clean_prediction(label):
    parts = label.split("___")

    crop = parts[0].replace("_", " ").strip()
    disease = parts[1].replace("_", " ").strip() if len(parts) > 1 else "Unknown"

    return crop, disease


def preprocess_image(image_path):
    img = Image.open(image_path).convert("RGB")
    img = img.resize(INPUT_SIZE)

    img_array = np.array(img, dtype=np.float32)
    img_array = np.expand_dims(img_array, axis=0)

    return img_array


def predict_disease(image_path):
    img_array = preprocess_image(image_path)

    prediction = model.predict(img_array, verbose=0)[0]
    result_index = int(np.argmax(prediction))

    label = class_names[result_index]
    confidence = float(np.max(prediction) * 100)

    crop, disease = clean_prediction(label)

    return {
        "crop": crop,
        "disease": disease,
        "class_name": label,
        "confidence": round(confidence, 2),
        "model_version": model_config.get("version", "v2-finetuned"),
        "model_type": model_config.get("model_type", "MobileNetV2 Fine-Tuned"),
        "model_accuracy": model_config.get("validation_accuracy", "N/A")
    }