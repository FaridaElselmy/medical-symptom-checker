# 🩺 Medical Symptom Checker

An interactive AI-powered symptom checker built with **FastAPI**, **Next.js**, and **TensorFlow**. Users can input symptoms and receive potential diagnoses using a trained machine learning model.

---

## 📁 Project Structure

```

medical-symptom-checker/
│
├── backend/              # FastAPI backend (API, ML model)
│   ├── main.py
│   ├── model/            # TensorFlow model directory (not pushed)
│   └── requirements.txt  # Python dependencies
│
├── frontend/             # Next.js frontend (React)
│   ├── pages/
│   └── components/
│
├── .gitignore
├── README.md

````

---

## 💻 How to Set Up on Another Laptop

### 1. 📦 Clone the Repository

```bash
git clone https://github.com/FaridaElselmy/medical-symptom-checker.git
cd medical-symptom-checker
````

---

### 2. ⚙️ Backend Setup (FastAPI + TensorFlow)

> 🐍 Requires Python 3.9+ and pip

```bash
cd backend
python -m venv venv
# Activate the virtual environment:
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate
```

Install the dependencies:

```bash
pip install -r requirements.txt
```

Run the backend server:

```bash
uvicorn main:app --reload
```

Go to: [http://localhost:8000/docs](http://localhost:8000/docs) to test the API using Swagger.

---

### 3. 🌐 Frontend Setup (Next.js)

> 📦 Requires Node.js (v16+) and npm

```bash
cd ../frontend
npm install
npm run dev
```

Open the frontend in your browser: [http://localhost:3000](http://localhost:3000)

---

### 4. 🧠 Model Files

Model files (e.g. `.h5`, `.pb`) are not pushed to GitHub to avoid large repo size.
👉 Download the model from your cloud storage (e.g. Google Drive, Hugging Face, etc.) and place it in:

```
backend/model/
```

Make sure your `main.py` loads it from the correct path.

---

### 5. 🔐 Environment Variables

Create a `.env` file **if needed**:

**backend/.env**

```
MODEL_PATH=model/my_model.h5
```

**frontend/.env.local**

```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## 🙅 What’s Ignored

The following folders/files are intentionally excluded from Git:

* `node_modules/`
* `venv/`
* `*.h5`, `*.tflite`, `.env`, etc.

See `.gitignore` for full details.

---

## ✨ Author

Made with ❤️ by [Farida Elselmy](https://github.com/FaridaElselmy)


