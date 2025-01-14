document.getElementById("recipe-form").addEventListener("submit", async (event) => {
    event.preventDefault();

    const ingredients = document.getElementById("included-ingredients").value.trim();
    const dietaryRestrictions = document.getElementById("dietary-restrictions").value.trim();
    const excludedIngredients = document.getElementById("excluded-ingredients").value.trim();
    const calorieLimit = document.getElementById("calorie-limit").value.trim();
    const cuisine = document.getElementById("cuisine").value.trim();
    const aiResponseContainer = document.getElementById("ai-response");

    if (!ingredients) {
        aiResponseContainer.innerHTML = `<p class="text-danger">Please specify ingredients.</p>`;
        return;
    }

    aiResponseContainer.innerHTML = `<p>Loading...</p>`;

    try {
        const response = await fetch("http://127.0.0.1:8000/ai_suggest/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                prompt: `What can I cook with ${ingredients}?` +
                        (dietaryRestrictions ? ` Dietary restrictions: ${dietaryRestrictions}.` : "") +
                        (excludedIngredients ? ` Excluded: ${excludedIngredients}.` : "") +
                        (calorieLimit ? ` Calorie limit: ${calorieLimit}.` : "") +
                        (cuisine ? ` Cuisine: ${cuisine}.` : "")
            }),
        });

        if (!response.ok) {
            throw new Error("Failed to fetch data.");
        }

        const data = await response.json();
        aiResponseContainer.innerHTML = `<p>${data.message}</p>`;
    } catch (error) {
        console.error(error);
        aiResponseContainer.innerHTML = `<p class="text-danger">An error occurred. Please try again.</p>`;
    }
});