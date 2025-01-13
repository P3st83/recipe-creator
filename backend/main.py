from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import requests
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)

# Initialize FastAPI app
app = FastAPI()

# Add CORS middleware to allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow requests from any origin
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

# Spoonacular API Key
SPOONACULAR_API_KEY = "970299eae4a743f292b830a36384b542"

# Request body schema
class RecipeRequest(BaseModel):
    dietary_restrictions: Optional[str] = None
    excluded_ingredients: Optional[str] = None
    included_ingredients: Optional[str] = None
    calorie_limit: Optional[int] = None
    cuisine: Optional[str] = None

# Root endpoint
@app.get("/")
async def root():
    return {"message": "Welcome to the Recipe Creator API!"}

# Endpoint for generating recipes
@app.post("/generate_recipes/")
async def generate_recipes(request: RecipeRequest):
    # Handle "no restriction" input
    diet = None if request.dietary_restrictions and request.dietary_restrictions.lower() == "no restriction" else request.dietary_restrictions

    # Build query parameters
    query_params = {
        "apiKey": SPOONACULAR_API_KEY,
        "diet": diet,
        "excludeIngredients": request.excluded_ingredients,
        "includeIngredients": request.included_ingredients.replace(" ", "") if request.included_ingredients else None,
        "cuisine": request.cuisine,
        "maxCalories": request.calorie_limit,
        "number": 3,  # Fetch three recipes
        "random": True,  # Randomize the results
    }

    # Remove empty parameters
    query_params = {k: v for k, v in query_params.items() if v}

    # Log incoming request and query parameters
    logging.info(f"Incoming Request: {request.model_dump()}")
    logging.info(f"Query Parameters Sent to Spoonacular: {query_params}")

    try:
        # Step 1: Call Spoonacular API to search recipes
        response = requests.get("https://api.spoonacular.com/recipes/complexSearch", params=query_params)
        response.raise_for_status()
        data = response.json()

        # Log Spoonacular's response
        logging.info(f"Spoonacular Response: {data}")

        if not data.get("results"):
            return {
                "message": (
                    "No recipes found matching the criteria. "
                    "Try broadening your inputs (e.g., fewer restrictions or ingredients)."
                )
            }

        # Step 2: Fetch detailed information for each recipe
        recipes = []
        for recipe in data["results"]:
            recipe_details_url = f"https://api.spoonacular.com/recipes/{recipe['id']}/information"
            details_response = requests.get(recipe_details_url, params={"apiKey": SPOONACULAR_API_KEY})
            details_response.raise_for_status()
            details_data = details_response.json()

            recipes.append({
                "id": recipe["id"],
                "title": recipe["title"],
                "image": recipe["image"],
                "sourceUrl": details_data.get("sourceUrl", "Link unavailable"),
            })

        return {"recipes": recipes}

    except requests.exceptions.RequestException as e:
        # Log the error
        logging.error(f"Error communicating with Spoonacular API: {e}")
        raise HTTPException(status_code=500, detail="Error communicating with Spoonacular API. Please try again later.")
