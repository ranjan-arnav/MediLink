'use server'

import ModelClient, { isUnexpected } from "@azure-rest/ai-inference";
import { AzureKeyCredential } from "@azure/core-auth";

const token = process.env.GITHUB_TOKEN;

export async function analyzeDietAction(foodDescription: string) {
    if (!token) {
        console.error("GITHUB_TOKEN is missing");
        // Fallback Mock Response for Demo if no token
        return {
            foodItem: foodDescription,
            calories: 500,
            protein: "20g",
            carbs: "60g",
            fats: "15g",
            healthScore: "Moderate",
            analysis: "Estimated based on standard values. Consider adding more vegetables."
        };
    }

    try {
        const client = ModelClient(
            "https://models.inference.ai.azure.com",
            new AzureKeyCredential(token)
        );

        const prompt = `
      Analyze the following food item/meal: "${foodDescription}".
      Provide a nutritional estimate and a brief health analysis (1 sentence).
      
      Return ONLY a JSON object with this exact schema:
      {
        "foodItem": "Formatted Name of Food",
        "calories": number (approximate kcal),
        "protein": "amount (e.g. 25g)",
        "carbs": "amount (e.g. 40g)",
        "fats": "amount (e.g. 10g)",
        "healthScore": "Healthy" | "Moderate" | "Unhealthy",
        "analysis": "Brief doctor-style feedback (max 20 words)"
      }
    `;

        const response = await client.path("/chat/completions").post({
            body: {
                messages: [
                    { role: "system", content: "You are an expert nutritionist AI. Provide accurate nutritional estimates." },
                    { role: "user", content: prompt }
                ],
                model: "gpt-4o",
                temperature: 0.1,
                response_format: { type: "json_object" }
            }
        });

        if (isUnexpected(response)) {
            throw response.body.error;
        }

        const result = JSON.parse(response.body.choices[0].message.content);
        return result;

    } catch (error) {
        console.error("Diet Analysis Error:", error);
        // Fallback on error
        return {
            foodItem: foodDescription,
            calories: 0,
            protein: "N/A",
            carbs: "N/A",
            fats: "N/A",
            healthScore: "Moderate",
            analysis: "Could not analyze. Please try again."
        };
    }
}

export async function generateDietPlanAction(prefs: { diet: string, cuisine: string, fridge: string }) {
    if (!token) {
        return {
            meals: [
                { type: "Breakfast", time: "08:00 AM", title: "Mock Oatmeal", calories: 300, protein: "10g", description: "Mock Data" },
                { type: "Lunch", time: "01:00 PM", title: "Mock Salad", calories: 400, protein: "15g", description: "Mock Data" },
                { type: "Dinner", time: "07:00 PM", title: "Mock Stir Fry", calories: 500, protein: "20g", description: "Mock Data" }
            ]
        };
    }

    try {
        const client = ModelClient(
            "https://models.inference.ai.azure.com",
            new AzureKeyCredential(token)
        );

        const prompt = `
      Create a 1-day meal plan with **3 options** for each meal (Breakfast, Lunch, Dinner) for a patient with these preferences:
      - Diet Type: ${prefs.diet || 'Balanced'}
      - Preferred Cuisine: ${prefs.cuisine || 'Any'}
      - Available Ingredients: ${prefs.fridge || 'Any'}
      
      Return ONLY a JSON object with this schema:
      {
        "breakfast": [
          { "title": "Option Name", "calories": number, "protein": "amount", "description": "Short description" },
          { "title": "Option Name", "calories": number, "protein": "amount", "description": "Short description" },
          { "title": "Option Name", "calories": number, "protein": "amount", "description": "Short description" }
        ],
        "lunch": [ ... 3 options ... ],
        "dinner": [ ... 3 options ... ]
      }
    `;

        const response = await client.path("/chat/completions").post({
            body: {
                messages: [
                    { role: "system", content: "You are an expert nutritionist. Provide diverse and appetizing meal options." },
                    { role: "user", content: prompt }
                ],
                model: "gpt-4o",
                temperature: 0.7, // Higher temp for variety
                response_format: { type: "json_object" }
            }
        });

        if (isUnexpected(response)) {
            throw response.body.error;
        }

        const result = JSON.parse(response.body.choices[0].message.content);
        return result;

    } catch (error) {
        console.error("Diet Plan Error:", error);
        return null;
    }
}
