# MediCheck – AI-Powered Symptom Checker & Health Assistant

MediCheck is a full-stack medical platform that combines intelligent symptom checking, skin condition image diagnosis, and a conversational health assistant into one seamless application. It leverages modern technologies including FastAPI, Next.js, Hugging Face Transformers, and Vision Transformers (ViT) to deliver real-time, AI-driven healthcare support.

---

## 🔍 Features

- Symptom Checker form that predicts possible conditions based on user input.
- Image-based skin disease detection using a ViT model trained on HAM10000 and ISIC datasets.
- Conversational chatbot assistant with Retrieval-Augmented Generation (RAG) pipeline.
- Modern frontend using Next.js 14 App Router and Tailwind CSS.
- Hugging Face backend deployment for both model inference and chatbot logic.
- Secure data handling and multipart/form-data support for image + text submissions.

---

## 🗂️ Project Structure

```

medical-symptom-checker/
│
├── backend/                # FastAPI backend with ML logic
│   ├── main.py             # Main API entry
│   ├── vitweights/         # Model directory (ViT weights, not committed)
│   └── requirements.txt    # Python dependencies
│
├── frontend/               # Next.js frontend (React)
│   ├── app/                # App router pages and routes
│   └── components/         # Reusable UI components
│
├── .gitignore
├── README.md

````

---

## 🚀 Live Deployment

- Frontend: [https://medical-symptom-checker-five.vercel.app](https://medical-symptom-checker-five.vercel.app)
- Backend APIs: Hosted on [Hugging Face Spaces](https://huggingface.co/spaces)

---

## ⚙️ Getting Started Locally

### 1. Clone the Repository

```bash
git clone https://github.com/FaridaElselmy/medical-symptom-checker.git
cd medical-symptom-checker
````

---

### 2. Backend Setup (FastAPI + ViT)

> Python 3.9+ required

```bash
cd backend
python -m venv venv
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

pip install -r requirements.txt
uvicorn main:app --reload
```

Access the backend: [http://localhost:8000/docs](http://localhost:8000/docs)

Place your downloaded ViT model in:

```
backend/vitweights/
```

Update `main.py` to reflect correct path if needed.

---

### 3. Frontend Setup (Next.js 14)

> Requires Node.js v16+

```bash
cd ../frontend
npm install
npm run dev
```

Open frontend: [http://localhost:3000](http://localhost:3000)



## 📦 Model Architecture

* **ViT-based Classifier**: Fine-tuned Vision Transformer for skin disease classification.
* **Conversational AI**: Uses HuggingFace’s `all-MiniLM-L6-v2` for semantic embeddings, Pinecone for similarity search, and LangChain with OpenAI for response generation.
* **Multipart Interoperability**: Text and image fields are combined using `FormData` and handled via FastAPI’s `UploadFile` + `Form`.

---

## 🔐 Environment Configuration

You may define variables in  `.env` (backend) if needed for secrets or endpoints like we did.



## 👩‍💻 Authors

* [Farida Elselmy](https://github.com/FaridaElselmy)
* [Sara Ayman](https://github.com/SaraAyman-204)


