from agents.disease_detection_agent import predict_disease
from agents.recommendation_agent import get_recommendation

result = predict_disease(
    r"D:\DataScience\Projects\agri-ai-system\New Plant Diseases Dataset(Augmented)\New Plant Diseases Dataset(Augmented)\test\RS_Rust 1563.JPG"
)

recommendation = get_recommendation(result["class_name"])

final_result = {
    **result,
    **recommendation
}

print(final_result)