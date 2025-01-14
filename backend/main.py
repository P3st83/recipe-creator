from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from openai import OpenAI
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Initialize OpenAI client
openai_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
if not openai_client.api_key:
    raise ValueError("OPENAI_API_KEY environment variable is not set.")

# Initialize FastAPI app
app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:8080"],  # Allow requests from the frontend
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

# Request model for AI suggestions
class RequestModel(BaseModel):
    prompt: str

@app.post("/ai_suggest/")
async def ai_suggest(request: RequestModel):
    try:
        # Debugging information
        print(f"Request prompt: {request.prompt}")

        # Make OpenAI API call
        response = openai_client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": request.prompt}],
        )

        # Extract response message content
        message_content = response.choices[0].message.content

        return {"message": message_content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get response from OpenAI: {str(e)}")

@app.get("/")
async def root():
    return {"message": "Recipe Creator Backend is running!"}