<<<<<<< HEAD
import torch
import torchvision.transforms as transforms
from PIL import Image
import os

from transformers import ViTForImageClassification

class_labels = [
    'Enfeksiyonel',
    'Ekzama', 
    'Akne',
    'Pigment',
    'Benign',
    'Malign',
    'Acne',
    'Actinic Keratosis',
    'Basal Cell Carcinoma',
    'Benign Keratosis',
    'Dermatofibroma',
    'Melanocytic Nevus',
    'Melanoma',
    'Vascular Lesion',
    'Warts/Molluscum',

]


# Define the model loading function
def build_model():
    model = ViTForImageClassification.from_pretrained(
        os.path.join(os.path.dirname(__file__), "..", "vitweights"),  # 👈 Use local relative path
        num_labels=15
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
=======
# utils/predict.py
import tensorflow as tf
model = tf.keras.models.load_model("model.h5")
import numpy as np
import cv2
import os

# Get the absolute path to the model file
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "..", "model.h5")

# Load the model
model = tf.keras.models.load_model("model.h5")

# Define class labels
class_labels = [
    "Acne and Rosacea",
    "Actinic Keratosis",
    "Atopic Dermatitis",
    "Psoriasis",
    "Light Disorders of Pigmentation",
    "Systemic Disease",
    "Tinea/Fungal Infections",
    "Viral Infections",
    "Bacterial Infections",
    "Eczema",
    "Exanthems and Drug Eruptions",
    "Vasculitis",
    "Melanoma Skin Cancer",
    "Seborrheic Keratoses",
    "Herpes HPV",
    "Cellulitis",
    "Nevi",
    "Other Rare Conditions",
    "Unknown"
]

def predict_skin_disease(image_path):
    try:
        img = cv2.imread(image_path)
        if img is None:
            raise ValueError("Invalid image path or unreadable file")
            
        img = cv2.resize(img, (380, 380))
        img = img / 255.0
        img = np.expand_dims(img, axis=0)

        predictions = model.predict(img)
        predicted_index = int(np.argmax(predictions[0]))  # Convert to native Python int
        confidence = float(np.max(predictions[0]))        # Convert to native Python float
>>>>>>> 5e862f5 (Initial commit)

        return {
            "disease": class_labels[predicted_index],
            "confidence": confidence,
            "label": predicted_index,
            "success": True
        }
<<<<<<< HEAD

=======
        
>>>>>>> 5e862f5 (Initial commit)
    except Exception as e:
        return {
            "error": str(e),
            "success": False
        }