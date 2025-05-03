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