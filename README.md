# What Can I Cook Tonight? 🍽️

This project is a simple recipe suggestion web application that uses OpenAI's GPT model to suggest recipes based on user-provided ingredients, dietary restrictions, and other preferences.

## Features

- **Input fields for recipe suggestions**:
  - Dietary restrictions
  - Excluded ingredients
  - Available ingredients
  - Calorie limit
  - Cuisine type
- **AI-generated recipe suggestions**.
- **Responsive and visually appealing UI** with Bootstrap integration.
- Fully functional backend powered by FastAPI.
- **Frontend and backend are decoupled** for easy deployment and scalability.

---

## Project Structure

```plaintext
RecipeCreator/
├── backend/
│   ├── main.py         # FastAPI backend application
│   ├── .env            # Environment variables (e.g., API keys)
│   ├── requirements.txt # Python dependencies
│   └── new_env/        # Python virtual environment (not included in the repo)
├── frontend/
│   ├── index.html      # Main HTML file
│   ├── script.js       # JavaScript for handling user inputs and API calls
│   ├── style.css       # Additional custom CSS (optional)
│   └── images/         # Folder for storing images
└── README.md           # Project documentation (this file)
Setup and Usage
1. Prerequisites
Python 3.12 installed.
Node.js (if needed for modern frontend tooling).
2. Install Backend Dependencies
bash
Copy code
cd backend
python -m venv new_env
source new_env/bin/activate  # On Windows: new_env\Scripts\activate
pip install -r requirements.txt
3. Set Up OpenAI API Key
Create a .env file inside the backend directory and add your OpenAI API key:

plaintext
Copy code
OPENAI_API_KEY=your_openai_api_key_here
4. Run Backend Server
bash
Copy code
cd backend
uvicorn main:app --reload
The backend will run on http://127.0.0.1:8000.

5. Run Frontend
bash
Copy code
cd frontend
python -m http.server 8080
The frontend will run on http://127.0.0.1:8080.

Future Improvements
Add image-based recipe suggestions.
Deploy the app on Heroku or AWS for public use.
Integrate user authentication for saving preferences.
Add unit and integration tests for backend and frontend.
Improve error handling for API responses.
Author
Your Name - P3st83 Castraveti Bogdan-Teodor