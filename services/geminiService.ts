import { GoogleGenAI } from "@google/genai";

// Initialize the client
// The API key is automatically injected into process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const fetchMarketTrends = async () => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Identify 4 specific, distinct trending styles for handcrafted wooden picture frames and small home decor in 2024-2025. 
      
      Format the response strictly as a list where each item follows this pattern:
      ### [Trend Title]
      **Price Range:** [e.g. $40 - $90]
      [A concise 2-sentence description of the style, wood types, and aesthetic.]

      Use Google Search to ensure accuracy.`,
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction: "You are a trend forecaster. Provide structured, parsed outputs.",
      },
    });

    const text = response.text || "";
    
    // Simple parsing logic to extract trends from the text response
    const trends: any[] = [];
    const parts = text.split('###').slice(1); // Split by header, ignore pre-text
    
    parts.forEach(part => {
      const lines = part.trim().split('\n');
      const title = lines[0].trim();
      const priceLine = lines.find(l => l.includes('Price Range')) || "";
      const priceRange = priceLine.replace(/\*\*Price Range:\*\*/i, '').replace(/Price Range:/i, '').trim();
      // Description is roughly the rest
      const description = lines.filter(l => l !== title && !l.includes('Price Range') && l.trim().length > 0).join(' ').trim();
      
      if (title) {
        trends.push({ title, priceRange, description });
      }
    });

    return {
      text: text, // Keep full text just in case
      trends: trends,
      chunks: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    return { text: "Failed to fetch market trends.", trends: [], chunks: [] };
  }
};

export const generateTrendImage = async (trendDescription: string) => {
  try {
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: `Professional product photography of a ${trendDescription}. High quality, studio lighting, 4k, trending home decor style, wooden artisan craftsmanship.`,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/jpeg',
        aspectRatio: '4:3',
      },
    });
    
    const base64ImageBytes = response.generatedImages?.[0]?.image?.imageBytes;
    if (base64ImageBytes) {
      return `data:image/jpeg;base64,${base64ImageBytes}`;
    }
    return null;
  } catch (error) {
    console.error("Trend Image Gen Error:", error);
    return null;
  }
};

export const generateBusinessAdvice = async (metrics: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Analyze these manufacturing metrics for a 2-man wooden frame shop and give 3 specific tips to improve profit: ${metrics}`,
      config: {
        systemInstruction: "You are a lean manufacturing consultant. Be brief and actionable.",
      },
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Advice Error:", error);
    return "Could not generate advice at this time.";
  }
};

export const generateDesignPlan = async (productType: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Create a unique, detailed woodworking plan for a ${productType}. 
      Include: 
      1. A creative artisan name for the piece.
      2. Difficulty level (Beginner/Intermediate/Advanced).
      3. Estimated material cost.
      4. List of Materials (precise dimensions in inches).
      5. Cut list.
      6. Step-by-step assembly instructions. 
      7. Finishing tips.
      Format as clean Markdown.`,
      config: {
        systemInstruction: "You are a master carpenter creating blueprints for a small production shop.",
      },
    });
    return response.text;
  } catch (error) {
    console.error("Design Gen Error:", error);
    return "Could not generate design plan. Please try again.";
  }
};

export const generateBlueprintImage = async (productType: string) => {
  try {
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: `A clean, technical woodworking blueprint drawing of a ${productType}. White background, blue or black lines, isometric view showing joinery details, high quality technical illustration style.`,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/jpeg',
        aspectRatio: '4:3',
      },
    });
    
    const base64ImageBytes = response.generatedImages?.[0]?.image?.imageBytes;
    if (base64ImageBytes) {
      return `data:image/jpeg;base64,${base64ImageBytes}`;
    }
    return null;
  } catch (error) {
    console.error("Image Gen Error:", error);
    return null;
  }
};

export const findGrants = async (location: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Find currently active small business grants, manufacturing loans, and artisan funding opportunities available in or near ${location}. Include federal options like SBA if relevant.`,
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction: "You are a business financial advisor. Provide a list of specific grants/loans with links if available.",
      },
    });
    return {
      text: response.text || "No grants found.",
      chunks: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  } catch (error) {
    console.error("Grant Search Error:", error);
    return { text: "Could not search for grants at this time.", chunks: [] };
  }
};

export const findSuppliers = async (location: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Find hardwood lumber yards, woodworking supply stores, and sawmill services in or near ${location}. Prioritize independent sellers over big box stores.`,
      config: {
        tools: [{ googleMaps: {} }],
        systemInstruction: "You are a logistics manager finding supply chain partners. List the best options.",
      },
    });
    return {
      text: response.text || "No suppliers found.",
      chunks: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  } catch (error) {
    console.error("Supplier Search Error:", error);
    return { text: "Could not search for suppliers at this time.", chunks: [] };
  }
};