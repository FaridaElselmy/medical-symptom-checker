import torch
import torchvision.transforms as transforms
from PIL import Image
import os

from transformers import ViTForImageClassification

# Define class labels (8)
class_labels = [
    'Actinic Keratosis', 'Basal Cell Carcinoma', 'Benign Keratosis',
    'Dermatofibroma', 'Melanocytic Nevus', 'Melanoma',
    'Vascular Lesion', 'Warts/Molluscum'
]

# Define the model loading function
def build_model():
    model = ViTForImageClassification.from_pretrained(
        os.path.join(os.path.dirname(__file__), "..", "vitweights"),  # 👈 Use local relative path
        num_labels=8
    )
    return model

# Load the model
model = build_model()
model.eval()

# Define image transforms
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],  # ✅ match training
        std=[0.229, 0.224, 0.225]
    )
])


# Predict function
def predict_skin_disease(image_path):
    try:
        image = Image.open(image_path).convert("RGB")
        input_tensor = transform(image).unsqueeze(0)  # Shape: [1, 3, 224, 224]

        with torch.no_grad():
            outputs = model(input_tensor)
            logits = outputs.logits
            probs = torch.softmax(logits, dim=1)[0]

        # 🔎 Print probability per class (for debugging)
        for i, prob in enumerate(probs):
            print(f"{class_labels[i]}: {prob:.4f}")

        predicted_index = torch.argmax(probs).item()
        confidence = probs[predicted_index].item()

        return {
            "disease": class_labels[predicted_index],
            "confidence": confidence,
            "label": predicted_index,
            "success": True
        }

    except Exception as e:
        return {
            "error": str(e),
            "success": False
        }
