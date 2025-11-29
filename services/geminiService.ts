import { GoogleGenAI, Type, Schema } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Schema for Recipe Generator
const recipeSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    recipes: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          description: { type: Type.STRING },
          prepTime: { type: Type.STRING },
          calories: { type: Type.NUMBER },
          ingredients: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                amount: { type: Type.STRING }
              }
            }
          },
          instructions: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        }
      }
    }
  }
};

export const generateRecipes = async (ingredients: string[]): Promise<any> => {
  if (!apiKey) throw new Error("API Key missing");

  // Updated prompt to request Simplified Chinese
  const prompt = `Create 3 distinct recipes using these ingredients: ${ingredients.join(', ')}. You can assume common pantry items like salt, oil, and pepper. Return the content in Simplified Chinese (简体中文).`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: recipeSchema,
        systemInstruction: "You are a professional chef. Provide concise, healthy, and creative recipes in Simplified Chinese."
      }
    });

    const text = response.text;
    if (!text) return { recipes: [] };
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

export const generateTravelItinerary = async (city: string, days: number): Promise<string> => {
    if (!apiKey) throw new Error("API Key missing");
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            // Updated prompt to request Simplified Chinese
            contents: `Plan a ${days}-day trip to ${city}. Format as a Markdown list with morning, afternoon, and evening activities. Include travel time estimates. Answer in Simplified Chinese (简体中文).`,
        });
        return response.text || "Failed to generate itinerary.";
    } catch (error) {
        console.error("Gemini Travel Error", error);
        return "Error generating itinerary. Please check your API key.";
    }
}