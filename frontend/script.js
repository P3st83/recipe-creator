document.getElementById("generate-form").addEventListener("submit", async (event) => {
    event.preventDefault();

    const resultsContainer = document.getElementById("results");
    resultsContainer.innerHTML = "<div class='text-center'>Loading recipes...</div>";

    // Construct the payload, ensuring empty fields are sent as `null`
    const payload = {
        dietary_restrictions: document.getElementById("dietary-restrictions").value.trim() || null,
        excluded_ingredients: document.getElementById("excluded-ingredients").value.trim() || null,
        included_ingredients: document.getElementById("included-ingredients").value.trim() || null,
        calorie_limit: document.getElementById("calorie-limit").value.trim() || null,
        cuisine: document.getElementById("cuisine").value.trim() || null,
    };

    try {
        const response = await fetch("http://127.0.0.1:8000/generate_recipes/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorDetails = await response.text(); // Capture backend error message
            throw new Error(`Failed to fetch recipes: ${response.statusText} - ${errorDetails}`);
        }

        const data = await response.json();
        resultsContainer.innerHTML = "";

        if (data.message) {
            resultsContainer.innerHTML = `<p class='text-center'>${data.message}</p>`;
            return;
        }

        // Display recipes
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
        resultsContainer.innerHTML = `<p class='text-center text-danger'>Error fetching recipes. Please try again.</p>`;
    }
});
