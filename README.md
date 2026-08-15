<div align="center">

# 🌱 Dr. Farmer

### Full-Stack AI-Powered Crop & Livestock Disease Advisory Platform

Instant, farmer-friendly disease diagnosis for Indian agriculture — built for **Smart India Hackathon (SIH)**

*Team Alpha Beta*

</div>

---

## 🌐 Live Demo

<!-- Live demo link will be added here after deployment -->

---

## 📖 About The Project

**Dr. Farmer** is an AI-powered mobile-first web application that helps low-literacy Indian farmers instantly diagnose crop and livestock diseases using just their smartphone camera. The app captures a photo, sends it to a trained machine learning model, and returns the diagnosis along with both **home remedies** and **medical treatment** options — in Hindi or English, with voice narration.

Built to bridge the gap between advanced agricultural science and farmers who may not be able to read complex text, Dr. Farmer focuses on simplicity, speed, and accessibility.

---

## ✨ Features

- 📷 **Camera-based scanning** — point, capture, diagnose in seconds
- 🤖 **Real ML-based disease detection** — trained on 54,000+ labeled images
- 🌾 **Crop disease identification** — leaf spots, rust, blight, pests, and more
- 🐄 **Livestock health check** — skin, eyes, hooves, and common cattle ailments
- 🌿 **Dual advisory system** — both home remedies and medical/veterinary treatment
- 🌐 **Hindi & English support** — full bilingual interface
- 🔊 **Voice narration** — spoken results for low-literacy users
- 📖 **Farm Record Book** — track past diagnoses and treatments over time
- 👨‍🌾 **Expert Call interface** — quick access to consult a specialist for urgent cases
- 🚨 **Severity alerts** — color-coded urgency indicators (healthy / caution / urgent)
- 📱 **Farmer-friendly UI** — large touch targets, minimal text, icon-driven design

---

## 🛠️ Tech Stack

**Frontend**
- React 19
- Vite
- Tailwind CSS
- Web Speech API (voice narration)
- Lucide React (icons)

**Backend / ML**
- REST API (FastAPI)
- ML model trained on 54,000+ crop & livestock images
- Image classification for pathology detection

---

<!-- Screenshots and live demo link will be added after deployment -->

---

## 🚀 Run Locally

Clone the project

```bash
git clone https://github.com/nilkumarbhadani/dr-farmer.git
cd dr-farmer
```

### 1. Backend Setup

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## 🔌 API Reference

**Scan Endpoint**

```
POST /api/scan/
Content-Type: multipart/form-data
```

| Parameter     | Type   | Description                                |
| :------------ | :----- | :------------------------------------------ |
| `file`        | File   | **Required.** Image (.jpg / .png) to scan   |
| `entity_type` | String | **Required.** `"plant"` or `"animal"`       |
| `entity_id`   | String | **Required.** Identifier for the farm/entry |

**Response**

```json
{
  "scan_id": "string",
  "entity_type": "string",
  "pathology_detected": "string",
  "confidence_score": 0.94,
  "medical_remedy": "string",
  "home_remedy": "string"
}
```

---

## 🗺️ Roadmap

- [x] Crop & Cattle disease detection UI
- [x] Hindi/English voice-guided interface
- [x] Real-time ML model integration
- [ ] Offline-first support (on-device TFLite inference)
- [ ] Expanded regional language support
- [ ] Extension worker / FPO dashboard view
- [ ] Weather-integrated diagnosis confidence
- [ ] Cloud deployment for live demo access

---

## 👥 Team Alpha Beta

| Name | Role | GitHub |
|------|------|--------|
| Nil Kumar Bhadani | Frontend / UI-UX Development | [@nilkumarbhadani](https://github.com/nilkumarbhadani) |
| _Teammate Name_ | Backend Development | _link_ |
| _Teammate Name_ | ML Model Training | _link_ |
| _Teammate Name_ | ML Model Training | _link_ |
| _Teammate Name_ | Research & Documentation | _link_ |
| _Teammate Name_ | Presentation & Testing | _link_ |

---

## 🙏 Acknowledgements

- Built for Smart India Hackathon (SIH) internal selection round
- Trained on a custom dataset of 54,000+ crop and livestock images
- Designed with accessibility for low-literacy farmers as the core principle
