import pandas as pd
import joblib
import os
import traceback

# === Paths ===
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
WEIGHTS_DIR = os.path.join(BASE_DIR, "..", "xgboostweights")

pipeline_path = os.path.join(WEIGHTS_DIR, "diabetes_pipeline (1).pkl")
threshold_path = os.path.join(WEIGHTS_DIR, "best_threshold (2).pkl")
features_path = os.path.join(WEIGHTS_DIR, "selected_feature_names (1).pkl")

# === REMOVE THESE LINES - They crash the server at import time ===
# pipeline = joblib.load(pipeline_path)
# best_threshold = joblib.load(threshold_path)
# selected_features = joblib.load(features_path)

def predict_diabetes(input_data: dict):
    try:
        
        pipeline = joblib.load(pipeline_path)
        best_threshold = joblib.load(threshold_path)
        selected_features = joblib.load(features_path)
        
        
        # Normalize keys to lowercase
        input_data = {k.lower(): v for k, v in input_data.items()}

        # Features to default to zero if missing
        features_to_zero = ["class", "id", "no_pation"]
        for f in features_to_zero:
            if f not in input_data or input_data[f] is None:
                input_data[f] = 0

        # Compute engineered features
        input_data["bmi_age"] = input_data.get("bmi", 0) * input_data.get("age", 0)
        input_data["bp_bmi"] = input_data.get("hypertension", 0) * input_data.get("bmi", 0)
        input_data["heart_smoke"] = input_data.get("heart_disease", 0) * input_data.get("smoking_history", 0)

        # Build dataframe in correct feature order
        df = pd.DataFrame(
            [[input_data.get(col.lower(), 0) for col in selected_features]],
            columns=selected_features
        )

        # Predict
        proba = pipeline.predict_proba(df)[:, 1][0]
        prediction = int(proba > best_threshold)

        return {
            "diabetes_probability": round(float(proba), 4),
            "diabetes_prediction": prediction,
            "threshold_used": round(float(best_threshold), 4),
            "success": True
        }

    except Exception:
        print("🔥 Exception in predict_diabetes:", traceback.format_exc())
        return {
            "error": traceback.format_exc(),
            "success": False
        }


