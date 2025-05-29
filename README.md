MediCheck: AI-Powered Medical Symptom Checker
MediCheck is an intelligent, full-stack healthcare assistant platform that allows users to check symptoms, upload skin condition images, and chat with an AI-powered medical assistant. It combines a React-based frontend (Next.js) with a FastAPI backend, and integrates powerful machine learning models deployed via Hugging Face for image diagnosis and conversational AI.

Overview
Frontend: Built with Next.js 14 App Router, styled with Tailwind CSS, and deployed on Vercel.

Backend: Developed with FastAPI, hosted on Hugging Face Spaces for ML inference and chatbot services.

Machine Learning: Includes a ViT-based skin disease classification model and a RAG-based conversational assistant.

Storage: Optional secure storage using MongoDB Atlas.

Deployment: Utilizes Vercel and Hugging Face for rapid iteration and scalable deployment.

Project Structure
bash
Copy
Edit
medical-symptom-checker/
│
├── backend/              # FastAPI backend
│   ├── main.py
│   ├── vitweights/       # Model files (manually downloaded)
│   └── requirements.txt
│
├── frontend/             # Next.js frontend
│   ├── app/
│   └── components/
│
├── .gitignore
├── README.md
Setup Instructions
1. Clone the Repository
bash
Copy
Edit
git clone https://github.com/FaridaElselmy/medical-symptom-checker.git
cd medical-symptom-checker
2. Backend Setup
Requires Python 3.9+

bash
Copy
Edit
cd backend
python -m venv venv
Activate the virtual environment:

Windows:

Copy
Edit
venv\Scripts\activate
macOS/Linux:

bash
Copy
Edit
source venv/bin/activate
Install dependencies:

nginx
Copy
Edit
pip install -r requirements.txt
Run the backend server:

css
Copy
Edit
uvicorn main:app --reload
Test API at http://localhost:8000/docs

3. Frontend Setup
Requires Node.js v16+

bash
Copy
Edit
cd ../frontend
npm install
npm run dev
Access the frontend at http://localhost:3000

4. Model Files
Download the trained model and place it in:

bash
Copy
Edit
backend/vitweights/
Ensure main.py loads the model from this directory.

5. Environment Configuration
Backend model loading (backend/utils/predict.py):

python
Copy
Edit
def build_model():
    model = ViTForImageClassification.from_pretrained(
        os.path.join(os.path.dirname(__file__), "..", "vitweights"),
        num_labels=15
    )
    return model
Frontend environment (frontend/.env.local):

ini
Copy
Edit
NEXT_PUBLIC_API_URL=http://localhost:8000
Update this URL for production deployment.

Git Ignore Policy
Files and directories excluded from Git:

node_modules/

venv/

vitweights/

.env, .env.local

*.pth, *.tflite

See .gitignore for full list.

License
This project is released under the MIT License.

Authors
Developed by:

Farida Elselmy (https://github.com/FaridaElselmy)

Sara Ayman (https://github.com/SaraAyman)
