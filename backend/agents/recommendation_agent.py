import json
from pathlib import Path

KNOWLEDGE_PATH = Path(__file__).parent.parent / "knowledge" / "disease_knowledge.json"


def load_knowledge_base():
    with open(KNOWLEDGE_PATH, "r", encoding="utf-8") as file:
        return json.load(file)


knowledge_base = load_knowledge_base()


def get_recommendation(class_name: str):
    return knowledge_base.get(class_name, {
        "cause": "Recommendation not available.",
        "symptoms": "Not available.",
        "treatment": "Please consult a local agriculture expert.",
        "prevention": "Maintain field hygiene and monitor regularly.",
        "severity": "Unknown"
    })