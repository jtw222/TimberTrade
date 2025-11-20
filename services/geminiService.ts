
import { GoogleGenAI } from "@google/genai";

// Initialize the client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// --- CACHE UTILITIES ---
const CACHE_PREFIX = 'timber_cache_';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

const getFromCache = (key: string) => {
  try {
    const item = localStorage.getItem(CACHE_PREFIX + key);
    if (!item) return null;
    const parsed = JSON.parse(item);
    if (Date.now() - parsed.timestamp > CACHE_DURATION) {
      localStorage.removeItem(CACHE_PREFIX + key);
      return null;
    }
    return parsed.data;
  } catch (e) {
    return null;
  }
};

const saveToCache = (key: string, data: any) => {
  try {
    const item = {
      data,
      timestamp: Date.now()
    };
    localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(item));
  } catch (e) {
    console.warn("Cache full or unavailable");
  }
};

// --- STATIC VISUAL DICTIONARY (Bypass API) ---
// Maps keywords to high-quality Unsplash IDs to save API quota
const IMAGE_DICTIONARY: {[key: string]: string} = {
  'minimal': 'photo-1534349762913-96c059f700bf',
  'japandi': 'photo-1594026112284-02bb6f3352fe',
  'rustic': 'photo-1533090481720-856c6e3c1fdc',
  'farmhouse': 'photo-1463693396721-8ca0cfa2b3b5',
  'dark': 'photo-1541123437800-1bb1317badc2',
  'walnut': 'photo-1610527003928-470251306e77',
  'live edge': 'photo-1583336130561-1d9e25a02708',
  'shelf': 'photo-1597072689227-8882273e8f6a',
  'modern': 'photo-1502005229766-52835d2ae38f',
  'reclaimed': 'photo-1588016056593-694904df5c6d',
  'chest': 'photo-1521985109869-e2474c45be06',
  'tray': 'photo-1602216723667-7bb24d727882',
  'frame': 'photo-1513519245088-0e12902e5a38',
  'default': 'photo-1601065898512-838446b43947'
};

const getSmartImage = (query: string): string => {
  const lowerQ = query.toLowerCase();
  let selectedId = IMAGE_DICTIONARY['default'];

  for (const [key, id] of Object.entries(IMAGE_DICTIONARY)) {
    if (lowerQ.includes(key)) {
      selectedId = id;
      break;
    }
  }
  return `https://images.unsplash.com/${selectedId}?auto=format&fit=crop&w=800&q=80`;
};

// --- STATIC FALLBACK DATA ---
export const FALLBACK_TRENDS = [
  {
    title: "Japandi Minimalism",
    priceRange: "$45 - $120",
    description: "A fusion of Japanese rustic minimalism and Scandinavian functionality. Features light woods like white oak or ash, clean lines, and matte natural finishes.",
    imageKeyword: "minimal"
  },
  {
    title: "Live Edge Accents",
    priceRange: "$80 - $250",
    description: "Celebrating the natural imperfection of wood. Frames and shelves retaining the bark or natural edge of walnut and maple slabs.",
    imageKeyword: "live edge"
  },
  {
    title: "Dark Academia Aesthetics",
    priceRange: "$60 - $150",
    description: "Rich, moody decor featuring dark stained woods (walnut, mahogany), brass hardware, and vintage-inspired joinery.",
    imageKeyword: "dark"
  },
  {
    title: "Eco-Reclaimed Textures",
    priceRange: "$50 - $110",
    description: "Sustainability focused decor using barn wood or pallet wood. Emphasizes rough-sawn textures, nail holes, and weathered gray patinas.",
    imageKeyword: "reclaimed"
  }
];

export const FALLBACK_PLAN = `
# The Artisan Gallery Frame (Standard Plan)

**Difficulty:** Beginner-Intermediate  
**Est. Material Cost:** $15 - $25

### Material List
*   1 board foot of Hardwood (White Oak, Walnut, or Cherry)
    *   Dimensions: 3/4" thick x 2" wide x 48" long
*   1/8" Plexiglass or Standard Glass (8x10 size)
*   1/8" Plywood backing board
*   Wood Glue (Titebond II recommended)
*   V-Nails or Splines for reinforcement

### Cut List (For 8x10 Image)
1.  **Long Rails:** Cut 2 pieces at 11 1/2" (long point to long point of 45° miter)
2.  **Short Rails:** Cut 2 pieces at 9 1/2" (long point to long point)
3.  **Rabbet:** Cut a 1/4" deep x 1/4" wide rabbet on the inside back edge of all pieces.

### Assembly Instructions
1.  **Miter:** Set your miter saw to exactly 45°. Test cuts on scrap first.
2.  **Rabbet:** Use a router table or table saw (dado stack) to cut the rabbet groove for the glass.
3.  **Glue Up:** Apply glue to mitered ends. Use a strap clamp to apply even pressure. Ensure the frame is square by measuring diagonals.
4.  **Reinforce:** Once dry, cut slots in the corners for contrasting splines (optional but recommended for strength) or use V-nails on the back.
5.  **Sand:** Sand to 120, 180, then 220 grit. Break all sharp edges.

### Finishing
*   Apply a natural oil finish (Danish Oil or Osmo Polyx) to pop the grain.
*   Buff with #0000 steel wool between coats.
`;

// --- API FUNCTIONS ---

export const fetchMarketTrends = async (forceRefresh = false) => {
  const cacheKey = 'market_trends';
  
  if (!forceRefresh) {
    const cached = getFromCache(cacheKey);
    if (cached) return cached;
  }

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
    
    const trends: any[] = [];
    const parts = text.split('###').slice(1); 
    
    parts.forEach(part => {
      const lines = part.trim().split('\n');
      const title = lines[0].trim();
      const priceLine = lines.find(l => l.includes('Price Range')) || "";
      const priceRange = priceLine.replace(/\*\*Price Range:\*\*/i, '').replace(/Price Range:/i, '').trim();
      const description = lines.filter(l => l !== title && !l.includes('Price Range') && l.trim().length > 0).join(' ').trim();
      
      if (title) {
        trends.push({ 
          title, 
          priceRange, 
          description, 
          // Assign a smart keyword for the visualizer based on the description
          imageKeyword: title + " " + description 
        });
      }
    });

    if (trends.length === 0) throw new Error("No trends parsed");

    const result = {
      text: text,
      trends: trends,
      chunks: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };

    saveToCache(cacheKey, result);
    return result;

  } catch (error) {
    console.warn("Using fallback trends due to API limit or error:", error);
    // Return fallback data gracefully
    return { 
      text: "Showing offline trend data.", 
      trends: FALLBACK_TRENDS, 
      chunks: [] 
    };
  }
};

/**
 * REPLACEMENT: This function now bypasses the API to use high-quality
 * mapped images. This saves 100% of image generation quota.
 */
export const getTrendImage = async (trendDescription: string) => {
  // Simulate async for API interface consistency
  return new Promise<string>((resolve) => {
    resolve(getSmartImage(trendDescription));
  });
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
    return "### Profit Tip (Offline Mode)\n1. **Batch Processing:** Cut all material for 10-20 units at once rather than one at a time to reduce setup time.\n2. **Reduce Waste:** Use offcuts for smaller items like coasters or keychains.\n3. **Upsell:** Add a premium finish option (e.g. Beeswax Polish) for $10 extra with 5 mins of work.";
  }
};

export const generateDesignPlan = async (productType: string) => {
  const cacheKey = `plan_${productType.toLowerCase().replace(/\s/g, '_')}`;
  const cached = getFromCache(cacheKey);
  if (cached) return cached;

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
    
    if (response.text) {
      saveToCache(cacheKey, response.text);
    }
    return response.text;
  } catch (error) {
    console.error("Design Gen Error:", error);
    // Fallback to a generic plan if the specific request fails
    return FALLBACK_PLAN;
  }
};

/**
 * Optimization: Check for specific keywords to use a schematic-style image
 * from our dictionary if available, otherwise use a generic placeholder.
 * We disable actual AI image gen here to save quota unless necessary.
 */
export const generateBlueprintImage = async (productType: string) => {
   // For now, we bypass AI image gen to prevent 429 errors. 
   // We return a high quality photo of the object instead of a drawing.
   return getSmartImage(productType);
};

export const findGrants = async (location: string) => {
  const cacheKey = `grants_${location.toLowerCase().replace(/\s/g, '_')}`;
  const cached = getFromCache(cacheKey);
  if (cached) return cached;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Find currently active small business grants, manufacturing loans, and artisan funding opportunities available in or near ${location}. Include federal options like SBA if relevant.`,
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction: "You are a business financial advisor. Provide a list of specific grants/loans with links if available.",
      },
    });
    const result = {
      text: response.text || "No grants found.",
      chunks: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
    saveToCache(cacheKey, result);
    return result;
  } catch (error) {
    console.error("Grant Search Error:", error);
    return { text: "Unable to connect to live search. Please check local Chamber of Commerce websites manually.", chunks: [] };
  }
};

export const findSuppliers = async (location: string) => {
  const cacheKey = `suppliers_${location.toLowerCase().replace(/\s/g, '_')}`;
  const cached = getFromCache(cacheKey);
  if (cached) return cached;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Find hardwood lumber yards, woodworking supply stores, and sawmill services in or near ${location}. Prioritize independent sellers over big box stores.`,
      config: {
        tools: [{ googleMaps: {} }],
        systemInstruction: "You are a logistics manager finding supply chain partners. List the best options.",
      },
    });
    const result = {
      text: response.text || "No suppliers found.",
      chunks: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
    saveToCache(cacheKey, result);
    return result;
  } catch (error) {
    console.error("Supplier Search Error:", error);
    return { text: "Unable to connect to map services. Try searching 'Hardwood Lumber near me' on Google Maps.", chunks: [] };
  }
};

// --- COMMISSION FINDER (Social Listening) ---

export const findSocialLeads = async (keyword: string) => {
  // We cannot easily scrape live social media without expensive commercial APIs.
  // We will use Gemini's Search Grounding to find *public* forum posts or discussions
  // and supplement with a simulated "Lead Feed" if the search is too dry/protected.
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Search for recent public forum posts, reddit threads (r/woodworking, r/homeimprovement, r/interiordesign), or public requests from the last 3 months where people are asking for custom woodworking commissions related to: "${keyword}".
      
      Look for phrases like "looking for someone to make", "commission request", "hire a woodworker", "custom table quote".
      
      Format the output as a JSON-like list (do not use markdown code blocks, just text) where each item has:
      - Platform (Reddit, Twitter, Forum)
      - User (username or 'Anonymous')
      - Request (short summary of what they want)
      - Budget (if mentioned, else 'Unknown')
      - URL (source link)
      `,
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction: "You are a sales lead generator. You find potential customers.",
      },
    });

    // We will parse the text manually since JSON mode with search tools can be tricky
    // For reliability in this demo, we will return the raw text and chunks, 
    // but in a real app we would use function calling to structure this.
    
    const result = {
      text: response.text || "No active leads found right now.",
      chunks: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
    return result;

  } catch (error) {
    console.error("Social Lead Search Error:", error);
    return { text: "Could not connect to social search.", chunks: [] };
  }
};

export const generateCommissionQuote = async (
  leadRequest: string, 
  constraints: { material: string; leadTime: string; priceEst: string; notes: string }
) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Write a professional, persuasive Direct Message (DM) to a potential client who posted this request: "${leadRequest}".
      
      My Constraints (Strictly adhere to these):
      - Available Material: ${constraints.material} (Do not offer other woods)
      - Lead Time: ${constraints.leadTime}
      - Estimated Price: ${constraints.priceEst}
      - Extra Notes: ${constraints.notes}
      
      Tone: Friendly, professional artisan. "Timber Trade" brand.
      Structure:
      1. Acknowledge their specific vision.
      2. Explain why my specific available material is perfect for it (sell the constraint).
      3. Give the price and timeline clearly.
      4. Call to action (e.g., "Let me know if you want to see a sketch").
      `,
      config: {
        systemInstruction: "You are a skilled woodworker writing sales emails. Be concise and convincing.",
      },
    });
    return response.text;
  } catch (error) {
    return "Error generating quote. Please try again.";
  }
};
