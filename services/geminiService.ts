
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { TravelItinerary } from "../types";

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

// Schema for Travel Generator
const activitySchema: Schema = {
    type: Type.OBJECT,
    properties: {
        time: { type: Type.STRING },
        activity: { type: Type.STRING },
        description: { type: Type.STRING },
        budget: { type: Type.STRING, enum: ["Low", "Medium", "High"] }
    }
};

const travelSchema: Schema = {
    type: Type.OBJECT,
    properties: {
        city: { type: Type.STRING },
        days: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    day: { type: Type.NUMBER },
                    theme: { type: Type.STRING },
                    activities: {
                        type: Type.OBJECT,
                        properties: {
                            morning: activitySchema,
                            afternoon: activitySchema,
                            evening: activitySchema
                        }
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

export const generateTravelItinerary = async (city: string, days: number): Promise<TravelItinerary | null> => {
    if (!apiKey) throw new Error("API Key missing");
    
    const prompt = `Plan a ${days}-day trip to ${city}. Provide a theme for each day and details for morning, afternoon, and evening activities. Answer in Simplified Chinese (简体中文).`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: travelSchema,
                systemInstruction: "You are a travel guide. Create detailed, structured travel itineraries in Simplified Chinese."
            }
        });
        const text = response.text;
        if (!text) return null;
        return JSON.parse(text) as TravelItinerary;
    } catch (error) {
        console.error("Gemini Travel Error", error);
        throw error;
    }
}
