const validateInputs = (payload) => {
    if (!payload.included_ingredients) {
        alert("Please enter at least one ingredient.");
        return false;
    }
    if (payload.calorie_limit && isNaN(payload.calorie_limit)) {
        alert("Calorie limit must be a number.");
        return false;
    }
    return true;
};

document.getElementById("generate-form").addEventListener("submit", async (event) => {
    event.preventDefault();

    const resultsContainer = document.getElementById("results");
    resultsContainer.innerHTML = "<p>Loading recipes...</p>";

    const payload = {
        dietary_restrictions: document.getElementById("dietary-restrictions").value.trim(),
        excluded_ingredients: document.getElementById("excluded-ingredients").value.trim(),
        included_ingredients: document.getElementById("included-ingredients").value.trim(),
        calorie_limit: document.getElementById("calorie-limit").value.trim(),
        cuisine: document.getElementById("cuisine").value.trim(),
    };

    // Validate inputs
    if (!validateInputs(payload)) {
        resultsContainer.innerHTML = ""; // Clear loading message
        return;
    }

    // Send request to backend
    try {
        const response = await fetch("http://127.0.0.1:8000/generate_recipes/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch recipes: ${response.statusText}`);
        }

        const data = await response.json();
        resultsContainer.innerHTML = "";

        if (data.message) {
            resultsContainer.innerHTML = `<p>${data.message}</p>`;
            return;
        }

        data.recipes.forEach((recipe) => {
            const recipeCard = document.createElement("div");
            recipeCard.classList.add("col-md-4", "recipe-card");
            recipeCard.innerHTML = `
                <img src="${recipe.image}" alt="${recipe.title}">
                <h3>${recipe.title}</h3>
                <a href="${recipe.sourceUrl}" class="btn btn-primary" target="_blank">View Recipe</a>
            `;
            resultsContainer.appendChild(recipeCard);
        });
    } catch (error) {
        console.error("Error fetching recipes:", error);
        resultsContainer.innerHTML = `<p class="text-danger">Error fetching recipes. Please try again.</p>`;
    }
});
