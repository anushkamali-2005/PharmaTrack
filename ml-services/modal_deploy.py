import modal

app = modal.App("smart-pharmacy-ml")

image = modal.Image.debian_slim().pip_install(
    "fastapi",
    "torch",
    "transformers",
    "pandas",
    "scikit-learn",
    "xgboost",
)

@app.function(image=image, gpu="T4")
@modal.web_endpoint(method="POST")
def predict_demand(data: dict):
    # Placeholder for demand forecasting
    return {"predicted_demand": 150, "confidence": 0.85}

@app.function(image=image, gpu="T4")
@modal.web_endpoint(method="POST")
def detect_pills(image_data: bytes):
    # Placeholder for CV model
    return {"detected": ["Paracetamol 500mg"], "confidence": 0.92}
