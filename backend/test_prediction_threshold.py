"""
Test Suite for Backend Disease Detection Prediction & Confidence Threshold Mechanism
Run with: python backend/test_prediction_threshold.py
"""

import os
import sys
import io
import json
import numpy as np
from PIL import Image
from fastapi.testclient import TestClient

# Add backend directory to sys.path
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

from main import app, CONFIDENCE_THRESHOLD, PLANT_DISEASE_CLASSES, LIVESTOCK_DISEASE_CLASSES

client = TestClient(app)

def create_synthetic_image(color=(34, 139, 34)):
    """Generates a 224x224 RGB image in-memory as PNG bytes."""
    img = Image.new("RGB", (224, 224), color=color)
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    buf.seek(0)
    return buf.getvalue()

def run_tests():
    print("=" * 70)
    print(" [DR. FARMER] PREDICTION LOGIC & CONFIDENCE THRESHOLD TEST SUITE")
    print("=" * 70)

    # 1. Test Status Endpoint
    print("\n[1] Testing /api/status endpoint...")
    resp = client.get("/api/status")
    assert resp.status_code == 200, f"Status code failed: {resp.status_code}"
    status_data = resp.json()
    print("  -> Status Response:", json.dumps(status_data, indent=2))
    assert "confidence_threshold" in status_data, "confidence_threshold missing in /api/status"
    assert status_data["confidence_threshold"] == 0.80, f"Expected 0.80, got {status_data['confidence_threshold']}"
    print("  [PASS] Status endpoint correctly returns configured confidence threshold.")

    # 2. Test Plant Model Scan with Real Sample File
    print("\n[2] Testing Plant Scan (/api/scan/) with backend/test_crop.png...")
    crop_path = os.path.join(BASE_DIR, "test_crop.png")
    if os.path.exists(crop_path):
        with open(crop_path, "rb") as f:
            crop_bytes = f.read()
    else:
        crop_bytes = create_synthetic_image()

    resp = client.post(
        "/api/scan/",
        data={"entity_type": "plant", "entity_id": "test_farm_01"},
        files={"file": ("test_crop.png", crop_bytes, "image/png")}
    )
    assert resp.status_code == 200, f"Scan request failed: {resp.status_code} - {resp.text}"
    plant_data = resp.json()

    print(f"  -> Detected Pathology: {plant_data['pathology_detected']}")
    print(f"  -> Predicted Class Index: {plant_data['predicted_class_index']}")
    print(f"  -> Raw Maximum Probability: {plant_data['confidence_score']}")
    print(f"  -> Display Confidence Percentage: {plant_data['confidence_percentage']}%")
    print(f"  -> Confidence Threshold: {plant_data['confidence_threshold']} (80%)")
    print(f"  -> Is Confident (>= 0.80): {plant_data['is_confident']}")
    print(f"  -> Confidence Status: {plant_data['confidence_status']}")
    print(f"  -> Advisory Notice: {plant_data['advisory_notice']}")

    # Mathematically verify that raw max prob matches confidence_score
    if plant_data.get("raw_probabilities"):
        raw_probs = plant_data["raw_probabilities"]
        assert len(raw_probs) == 38, f"Expected 38 class probabilities, got {len(raw_probs)}"
        max_raw = max(raw_probs)
        assert abs(max_raw - plant_data["confidence_score"]) < 1e-4, "Confidence score is not mathematically identical to max raw probability!"
        assert abs(sum(raw_probs) - 1.0) < 1e-3, "Raw probabilities do not sum to 1.0 (softmax distribution check)"
        print("  [PASS] Mathematical consistency verified: sum(probs) == 1.0 and max(probs) == confidence_score")

    # 3. Test Livestock Scan (/api/scan/)
    print("\n[3] Testing Livestock Scan (/api/scan/) with backend/test_full_art.png...")
    art_path = os.path.join(BASE_DIR, "test_full_art.png")
    if os.path.exists(art_path):
        with open(art_path, "rb") as f:
            art_bytes = f.read()
    else:
        art_bytes = create_synthetic_image((150, 100, 50))

    resp = client.post(
        "/api/scan/",
        data={"entity_type": "livestock", "entity_id": "test_farm_01"},
        files={"file": ("test_full_art.png", art_bytes, "image/png")}
    )
    assert resp.status_code == 200, f"Livestock scan failed: {resp.status_code} - {resp.text}"
    live_data = resp.json()

    print(f"  -> Detected Pathology: {live_data['pathology_detected']}")
    print(f"  -> Raw Maximum Probability: {live_data['confidence_score']}")
    print(f"  -> Display Confidence Percentage: {live_data['confidence_percentage']}%")
    print(f"  -> Is Confident (>= 0.80): {live_data['is_confident']}")
    print(f"  -> Confidence Status: {live_data['confidence_status']}")
    print(f"  -> Advisory Notice: {live_data['advisory_notice']}")

    if live_data.get("raw_probabilities"):
        raw_probs = live_data["raw_probabilities"]
        assert len(raw_probs) == 2, f"Expected 2 classes for cattle, got {len(raw_probs)}"
        print(f"  -> Class 0 (Healthy): {raw_probs[0]:.4f}, Class 1 (Lumpy): {raw_probs[1]:.4f}")
        assert abs(max(raw_probs) - live_data["confidence_score"]) < 1e-4
        print("  [PASS] Livestock model probabilities mathematically verified.")

    print("\n" + "=" * 70)
    print(" [ALL PREDICTION & THRESHOLD TESTS PASSED SUCCESSFULLY]")
    print("=" * 70)

if __name__ == "__main__":
    run_tests()
