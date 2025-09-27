import pickle
import joblib
import pandas as pd
import numpy as np
import os
import logging
from typing import Dict, Any, Optional
import traceback

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Global variables for model caching
_model = None
_feature_names = None

def load_kidney_model():
    """Load the kidney disease prediction model and metadata with joblib support"""
    global _model, _feature_names
    
    if _model is not None:
        return _model, _feature_names
    
    try:
        # Get model paths from environment or use defaults
        model_path = os.getenv("CKD_MODEL_PATH", "xgboostweights/ckd_xgb_pipeline.pkl")
        metadata_path = os.getenv("CKD_METADATA_PATH", "xgboostweights/ckd_pipeline_metadata.pkl")
        
        logger.info(f"Loading kidney disease model from: {model_path}")
        
        # Try multiple loading strategies
        loading_strategies = [
            ("joblib", lambda: joblib.load(model_path)),
            ("pickle_default", lambda: pickle.load(open(model_path, 'rb'))),
            ("pickle_latin1", lambda: pickle.load(open(model_path, 'rb'), encoding='latin1')),
        ]
        
        _model = None
        for strategy_name, loader in loading_strategies:
            try:
                logger.info(f"Trying loading strategy: {strategy_name}")
                _model = loader()
                logger.info(f"Successfully loaded model using {strategy_name}")
                break
            except Exception as e:
                logger.warning(f"Strategy {strategy_name} failed: {e}")
                continue
        
        if _model is None:
            raise Exception("All loading strategies failed")
        
        # Try to load metadata (feature names, etc.)
        if os.path.exists(metadata_path):
            logger.info(f"Loading model metadata from: {metadata_path}")
            try:
                # Try joblib first for metadata too
                try:
                    metadata = joblib.load(metadata_path)
                    logger.info("Loaded metadata using joblib")
                except:
                    with open(metadata_path, 'rb') as f:
                        metadata = pickle.load(f)
                    logger.info("Loaded metadata using pickle")
                
                _feature_names = metadata.get('feature_names', None)
            except Exception as e:
                logger.warning(f"Could not load metadata: {e}")
                _feature_names = None
        else:
            logger.warning(f"Metadata file not found at {metadata_path}")
            _feature_names = None
        
        # Define default feature names if metadata loading failed
        if _feature_names is None:
            _feature_names = [
                'age', 'bp', 'sg', 'al', 'su', 'rbc', 'pc', 'pcc', 'ba', 'bgr',
                'bu', 'sc', 'sod', 'pot', 'hemo', 'pcv', 'wc', 'rc', 'htn', 'dm',
                'cad', 'appet', 'pe', 'ane'
            ]
            logger.info("Using default feature names")
        
        logger.info(f"Kidney disease model loaded successfully with {len(_feature_names)} features")
        return _model, _feature_names
        
    except FileNotFoundError as e:
        logger.error(f"Model file not found: {e}")
        raise Exception(f"Kidney disease model files not found. Please ensure model files are in the xgboostweights/ directory")
    except Exception as e:
        logger.error(f"Error loading kidney disease model: {e}")
        logger.error(traceback.format_exc())
        raise Exception(f"Failed to load kidney disease model: {str(e)}")

def preprocess_kidney_data(input_data: Dict[str, Any]) -> pd.DataFrame:
    """Preprocess input data for kidney disease prediction"""
    try:
        # Create a copy of input data
        processed_data = input_data.copy()
        
        # Define categorical mappings commonly used in CKD datasets
        categorical_mappings = {
            'rbc': {'normal': 0, 'abnormal': 1},
            'pc': {'normal': 0, 'abnormal': 1},
            'pcc': {'notpresent': 0, 'present': 1},
            'ba': {'notpresent': 0, 'present': 1},
            'htn': {'no': 0, 'yes': 1},
            'dm': {'no': 0, 'yes': 1},
            'cad': {'no': 0, 'yes': 1},
            'appet': {'good': 0, 'poor': 1},
            'pe': {'no': 0, 'yes': 1},
            'ane': {'no': 0, 'yes': 1}
        }
        
        # Apply categorical mappings
        for feature, mapping in categorical_mappings.items():
            if feature in processed_data:
                if isinstance(processed_data[feature], str):
                    processed_data[feature] = mapping.get(
                        processed_data[feature].lower(), 
                        processed_data[feature]
                    )
        
        # Ensure all values are numeric
        for key, value in processed_data.items():
            try:
                if isinstance(value, str):
                    processed_data[key] = float(value)
                elif value is None:
                    processed_data[key] = 0.0  # Handle missing values
            except (ValueError, TypeError):
                logger.warning(f"Could not convert {key}={value} to numeric, setting to 0")
                processed_data[key] = 0.0
        
        # Create DataFrame
        df = pd.DataFrame([processed_data])
        
        logger.info(f"Preprocessed data shape: {df.shape}")
        logger.info(f"Features: {list(df.columns)}")
        
        return df
        
    except Exception as e:
        logger.error(f"Error in preprocessing: {e}")
        raise Exception(f"Data preprocessing failed: {str(e)}")

def predict_kidney_disease(input_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Predict kidney disease based on input parameters
    
    Args:
        input_data: Dictionary containing patient data
        
    Returns:
        Dictionary with prediction results
    """
    try:
        logger.info("Starting kidney disease prediction")
        
        # Load model
        model, feature_names = load_kidney_model()
        
        # Preprocess input data
        processed_df = preprocess_kidney_data(input_data)
        
        # Ensure we have the right features
        if feature_names:
            missing_features = [f for f in feature_names if f not in processed_df.columns]
            if missing_features:
                logger.warning(f"Missing features: {missing_features}")
                # Add missing features with default values
                for feature in missing_features:
                    processed_df[feature] = 0.0
            
            # Reorder columns to match training data
            processed_df = processed_df.reindex(columns=feature_names, fill_value=0.0)
        
        # Make prediction
        logger.info("Making prediction...")
        prediction = model.predict(processed_df)[0]
        
        # Get prediction probability if available
        confidence = 0.0
        probability_no_ckd = 0.5
        probability_ckd = 0.5
        
        if hasattr(model, 'predict_proba'):
            try:
                proba = model.predict_proba(processed_df)[0]
                confidence = float(max(proba))
                probability_no_ckd = float(proba[0])
                probability_ckd = float(proba[1])
                logger.info(f"Probability scores: No CKD={probability_no_ckd:.3f}, CKD={probability_ckd:.3f}")
            except Exception as e:
                logger.warning(f"Could not get probability: {e}")
                confidence = 0.6  # Default confidence
        else:
            logger.warning("Model does not support probability prediction")
            confidence = 0.6  # Default confidence for models without predict_proba
        
        # Interpret prediction
        has_ckd = bool(prediction == 1)
        risk_level = "High" if has_ckd else "Low"
        
        # Generate recommendations
        recommendations = generate_kidney_recommendations(has_ckd, input_data)
        
        result = {
            "success": True,
            "prediction": int(prediction),
            "has_kidney_disease": has_ckd,
            "confidence": round(confidence * 100, 2),
            "probability_no_ckd": round(probability_no_ckd * 100, 2),
            "probability_ckd": round(probability_ckd * 100, 2),
            "risk_level": risk_level,
            "disease": "Chronic Kidney Disease" if has_ckd else "No Chronic Kidney Disease",
            "diagnosis": get_kidney_diagnosis(has_ckd, confidence),
            "recommendations": recommendations,
            "input_features": processed_df.iloc[0].to_dict()
        }
        
        logger.info(f"Prediction completed: {result['disease']} (confidence: {result['confidence']}%)")
        return result
        
    except Exception as e:
        logger.error(f"Prediction error: {e}")
        logger.error(traceback.format_exc())
        return {
            "success": False,
            "error": str(e),
            "prediction": None,
            "confidence": 0
        }

def generate_kidney_recommendations(has_ckd: bool, input_data: Dict[str, Any]) -> list:
    """Generate health recommendations based on prediction and input data"""
    recommendations = []
    
    if has_ckd:
        recommendations.extend([
            "Consult with a nephrologist immediately for comprehensive evaluation",
            "Monitor blood pressure regularly and maintain it below 130/80 mmHg",
            "Follow a kidney-friendly diet low in sodium, phosphorus, and potassium",
            "Stay well hydrated but monitor fluid intake if advised by your doctor",
            "Take prescribed medications as directed and avoid nephrotoxic drugs",
            "Monitor blood sugar levels closely if diabetic",
            "Regular lab tests to monitor kidney function (creatinine, GFR, proteinuria)"
        ])
        
        # Specific recommendations based on input values
        if input_data.get('htn') == 1 or input_data.get('htn') == 'yes':
            recommendations.append("Strict blood pressure control is crucial for kidney protection")
        
        if input_data.get('dm') == 1 or input_data.get('dm') == 'yes':
            recommendations.append("Maintain tight glycemic control (HbA1c < 7%)")
        
        if input_data.get('appet') == 1 or input_data.get('appet') == 'poor':
            recommendations.append("Work with a dietitian to address poor appetite while maintaining nutrition")
            
    else:
        recommendations.extend([
            "Maintain current healthy lifestyle to prevent kidney disease",
            "Stay adequately hydrated with 6-8 glasses of water daily",
            "Maintain a balanced diet rich in fruits and vegetables",
            "Regular exercise and maintain healthy weight",
            "Monitor blood pressure and blood sugar regularly",
            "Avoid excessive use of NSAIDs and other potentially harmful medications",
            "Annual kidney function screening, especially if you have risk factors"
        ])
        
        # Preventive recommendations based on risk factors
        if input_data.get('age', 0) > 60:
            recommendations.append("Age-related kidney function decline - increase monitoring frequency")
        
        if input_data.get('bp', 0) > 140:
            recommendations.append("Blood pressure is elevated - focus on cardiovascular health")
    
    return recommendations

def get_kidney_diagnosis(has_ckd: bool, confidence: float) -> str:
    """Generate a diagnostic interpretation"""
    if has_ckd:
        if confidence > 0.9:
            return "High probability of Chronic Kidney Disease. Immediate medical consultation recommended."
        elif confidence > 0.7:
            return "Moderate to high probability of Chronic Kidney Disease. Medical evaluation advised."
        else:
            return "Possible Chronic Kidney Disease detected. Further testing recommended."
    else:
        if confidence > 0.9:
            return "Low probability of Chronic Kidney Disease. Continue preventive care."
        elif confidence > 0.7:
            return "Kidney function appears normal. Regular monitoring recommended."
        else:
            return "Uncertain diagnosis. Additional testing may be needed for definitive assessment."