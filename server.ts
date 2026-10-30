import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '25mb' }));

// Initialize GoogleGenAI with proper telemetry User-Agent header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const BOT_SYSTEM_INSTRUCTION = `You are FloraBot, an expert master horticulturist, seasoned botanical doctor, and companion planting specialist.
You help gardeners of all experience levels with accurate, scientifically grounded, empathetic, and actionable advice.

Key principles:
1. Provide practical, step-by-step instructions (e.g. exact watering signs, light levels, soil amendments).
2. Clearly highlight pet toxicity (dogs, cats) and human safety whenever discussing any plant.
3. If diagnosing plant distress or disease, explain root causes (overwatering vs underwatering, fungal vs bacterial, light starvation, nutrient lockout) and give both immediate remedies and long-term organic prevention.
4. When relevant, suggest natural organic pest controls (cold-pressed neem oil spray, beneficial nematodes, diatomaceous earth, insecticidal soap, diluted buttermilk/chaach spray for powdery mildew, turmeric/haldi powder on fresh cut stems) before harsh chemicals.
5. Multilingual & Desi Plant Expertise: You are fluent in English, Hindi (हिंदी), and Hinglish. If the user asks in Hindi or Hinglish (e.g. "Tulsi ke patte sukh rahe hain", "Money plant kaise grow karein", "Kadi patta care"), respond in friendly, encouraging Hindi/Hinglish with both modern botanical insights and trusted organic garden wisdom.
6. Keep your tone encouraging, warm, and deeply knowledgeable. Use clear markdown formatting with bolding and bullet points.`;

// Plant identification JSON schema
const plantIdentificationSchema = {
  type: Type.OBJECT,
  properties: {
    commonName: { type: Type.STRING, description: "Common name of the plant" },
    scientificName: { type: Type.STRING, description: "Scientific Latin botanical name" },
    plantFamily: { type: Type.STRING, description: "Botanical family (e.g., Araceae, Rosaceae)" },
    confidenceScore: { type: Type.NUMBER, description: "Confidence score between 0.0 and 1.0" },
    summary: { type: Type.STRING, description: "Comprehensive 2-3 sentence overview of this plant and its native habitat" },
    difficulty: { type: Type.STRING, description: "Care difficulty level: Easy, Moderate, Advanced" },
    healthStatus: {
      type: Type.STRING,
      description: "Overall visible condition: 'Healthy', 'Mild Stress', 'Disease Detected', 'Pest Infestation', or 'Nutrient Deficiency'"
    },
    healthDiagnosis: {
      type: Type.OBJECT,
      properties: {
        issueDetected: { type: Type.STRING, description: "Main issue observed from photo or 'None - Plant appears healthy'" },
        symptoms: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "Visual symptoms noticed in leaves, stems, or soil"
        },
        rootCause: { type: Type.STRING, description: "Primary underlying cause of the issue" },
        treatmentSteps: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "Numbered practical step-by-step actions to revive or treat the plant"
        },
        urgency: { type: Type.STRING, description: "Urgency: 'low', 'medium', 'high'" }
      },
      required: ["issueDetected", "symptoms", "rootCause", "treatmentSteps", "urgency"]
    },
    careGuide: {
      type: Type.OBJECT,
      properties: {
        watering: {
          type: Type.OBJECT,
          properties: {
            frequency: { type: Type.STRING, description: "e.g. Every 7-10 days when top 2 inches dry" },
            details: { type: Type.STRING, description: "Specific watering instructions, method (bottom watering, soak & dry)" },
            seasonalVariation: { type: Type.STRING, description: "How watering changes in spring/summer vs winter dormancy" },
            overwateringWarning: { type: Type.STRING, description: "Signs of overwatering for this specific plant" }
          },
          required: ["frequency", "details", "seasonalVariation", "overwateringWarning"]
        },
        sunlight: {
          type: Type.OBJECT,
          properties: {
            category: { type: Type.STRING, description: "e.g. Bright Indirect, Full Sun, Low Light, Dappled" },
            hoursNeeded: { type: Type.STRING, description: "Daily light hours needed" },
            placement: { type: Type.STRING, description: "Ideal window orientation or garden placement advice" }
          },
          required: ["category", "hoursNeeded", "placement"]
        },
        soil: {
          type: Type.OBJECT,
          properties: {
            soilType: { type: Type.STRING, description: "e.g. Chunky aroid mix, well-draining potting soil, succulent gritty mix" },
            idealPh: { type: Type.STRING, description: "Optimal pH range, e.g. 5.5 - 6.5" },
            drainageNeeds: { type: Type.STRING, description: "Drainage requirements and pot hole necessities" },
            mixRecipe: { type: Type.STRING, description: "Recommended soil blend recipe (e.g. 40% potting soil, 30% perlite, 20% orchid bark, 10% worm castings)" }
          },
          required: ["soilType", "idealPh", "drainageNeeds", "mixRecipe"]
        },
        humidity: {
          type: Type.OBJECT,
          properties: {
            idealRange: { type: Type.STRING, description: "Ideal relative humidity percentage range" },
            advice: { type: Type.STRING, description: "Tips to maintain humidity (humidifier, pebble tray, grouping)" }
          },
          required: ["idealRange", "advice"]
        },
        temperature: {
          type: Type.OBJECT,
          properties: {
            idealC: { type: Type.STRING, description: "Ideal temperature range in Celsius" },
            idealF: { type: Type.STRING, description: "Ideal temperature range in Fahrenheit" },
            coldHardinessLimit: { type: Type.STRING, description: "Minimum survivable temperature before frost damage" }
          },
          required: ["idealC", "idealF", "coldHardinessLimit"]
        },
        fertilizing: {
          type: Type.OBJECT,
          properties: {
            recommendation: { type: Type.STRING, description: "Recommended fertilizer type and NPK ratio (e.g. 10-10-10 or 3-1-2)" },
            frequency: { type: Type.STRING, description: "Application frequency during active growth seasons" },
            winterCare: { type: Type.STRING, description: "Fertilization pause or reduction during dormant winter" }
          },
          required: ["recommendation", "frequency", "winterCare"]
        },
        toxicity: {
          type: Type.OBJECT,
          properties: {
            toxicToCats: { type: Type.BOOLEAN, description: "True if toxic or harmful to domestic cats" },
            toxicToDogs: { type: Type.BOOLEAN, description: "True if toxic or harmful to domestic dogs" },
            toxicToHumans: { type: Type.BOOLEAN, description: "True if toxic or skin-irritant to humans/children" },
            details: { type: Type.STRING, description: "Toxicity mechanism (e.g. calcium oxalate crystals, saponins) and ingestion symptoms" }
          },
          required: ["toxicToCats", "toxicToDogs", "toxicToHumans", "details"]
        },
        pruningAndPropagation: {
          type: Type.OBJECT,
          properties: {
            pruningTips: { type: Type.STRING, description: "When and how to prune for bushier growth and dead foliage removal" },
            propagationMethod: { type: Type.STRING, description: "Primary propagation method (e.g. Stem cutting in water, division, air layering, offsets)" },
            stepByStep: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Clear numbered steps for successful propagation"
            }
          },
          required: ["pruningTips", "propagationMethod", "stepByStep"]
        }
      },
      required: ["watering", "sunlight", "soil", "humidity", "temperature", "fertilizing", "toxicity", "pruningAndPropagation"]
    },
    companionPlants: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "2-4 companion plants that thrive in identical environmental conditions or provide mutual pest protection"
    },
    funFacts: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "2-3 fascinating botanical or historical facts about this plant"
    }
  },
  required: [
    "commonName",
    "scientificName",
    "plantFamily",
    "confidenceScore",
    "summary",
    "difficulty",
    "healthStatus",
    "healthDiagnosis",
    "careGuide",
    "companionPlants",
    "funFacts"
  ]
};

// API: Plant Identification & Diagnostic
app.post('/api/identify', async (req: Request, res: Response) => {
  try {
    const { imageBase64, mimeType = 'image/jpeg', userNotes = '', preferredModel = 'gemini-4-argon' } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: 'Missing image data' });
    }

    // Strip base64 data URL prefix if present
    const cleanBase64 = imageBase64.replace(/^data:image\/[a-z]+;base64,/, '');

    const promptText = `Examine this photo in thorough botanical detail. Identify the plant precisely, evaluate its health condition, diagnose any visible issues (discoloration, pests, fungal spots, droop, root bound signs, scorch), and generate a comprehensive care guide.
${userNotes ? `User notes / observed problems: "${userNotes}"` : ''}
Be exacting and accurate. Return purely valid structured JSON matching the schema.`;

    const imagePart = {
      inlineData: {
        mimeType: mimeType,
        data: cleanBase64,
      },
    };

    const textPart = {
      text: promptText,
    };

    // Primary model is gemini-4-argon (as required by prompt specifications)
    const primaryModel = preferredModel || 'gemini-4-argon';

    let response;
    try {
      response = await ai.models.generateContent({
        model: primaryModel,
        contents: { parts: [imagePart, textPart] },
        config: {
          systemInstruction: 'You are an expert botanical taxonomist and plant pathologist. Inspect images with scientific precision and output detailed structured JSON.',
          responseMimeType: 'application/json',
          responseSchema: plantIdentificationSchema,
        },
      });
    } catch (primaryErr: any) {
      console.warn(`Primary model ${primaryModel} failed, trying fallback to gemini-3.8-flash:`, primaryErr?.message || primaryErr);
      // Fallback seamlessly to gemini-3.8-flash if primary fails (e.g. tier limits or paid model flow)
      response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: { parts: [imagePart, textPart] },
        config: {
          systemInstruction: 'You are an expert botanical taxonomist and plant pathologist. Inspect images with scientific precision and output detailed structured JSON.',
          responseMimeType: 'application/json',
          responseSchema: plantIdentificationSchema,
        },
      });
    }

    const responseText = response.text || '{}';
    const parsedData = JSON.parse(responseText);

    return res.json({ success: true, plant: parsedData });
  } catch (error: any) {
    console.error('Error during plant identification:', error);
    return res.status(500).json({
      error: error.message || 'Failed to identify plant. Please ensure the image is clear and try again.',
    });
  }
});

// API: Multi-turn Chatbot (FloraBot)
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const {
      messages = [],
      model = 'gemini-3.8-flash',
      plantContext = null,
      taskType = 'general', // 'complex', 'general', 'fast'
    } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    // Select model according to prompt rules:
    // - gemini-4-argon for particularly complex tasks
    // - gemini-3.8-flash for general tasks
    // - gemini-3.1-flash-lite for tasks that should happen fast
    let selectedModel = model;
    if (taskType === 'complex') {
      selectedModel = 'gemini-4-argon';
    } else if (taskType === 'fast') {
      selectedModel = 'gemini-3.1-flash-lite';
    } else if (!model) {
      selectedModel = 'gemini-3.8-flash';
    }

    // Prepare contextual system instruction
    let contextualSystemInstruction = BOT_SYSTEM_INSTRUCTION;
    if (plantContext) {
      contextualSystemInstruction += `\n\nCURRENT CONTEXT: The user is currently inspecting or asking about their plant:
- Name: ${plantContext.commonName} (${plantContext.scientificName})
- Family: ${plantContext.plantFamily || 'Unknown'}
- Health Status: ${plantContext.healthStatus || 'Unknown'}
- Primary Issue / Diagnosis: ${plantContext.healthDiagnosis?.issueDetected || 'Healthy'}
- Care overview: Watering ${plantContext.careGuide?.watering?.frequency || 'regularly'}, Sunlight ${plantContext.careGuide?.sunlight?.category || 'Moderate'}, Toxicity: Cats=${plantContext.careGuide?.toxicity?.toxicToCats}, Dogs=${plantContext.careGuide?.toxicity?.toxicToDogs}.
Refer to this plant specifically when answering questions, unless the user asks about a different topic.`;
    }

    // Convert messages to GenAI contents format
    const contents = messages.map((m: { role: string; content: string }) => ({
      role: m.role === 'assistant' || m.role === 'model' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    let response;
    try {
      response = await ai.models.generateContent({
        model: selectedModel,
        contents: contents,
        config: {
          systemInstruction: contextualSystemInstruction,
        },
      });
    } catch (modelErr: any) {
      console.warn(`Chat model ${selectedModel} failed, trying fallback to gemini-3.8-flash:`, modelErr?.message || modelErr);
      response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: contents,
        config: {
          systemInstruction: contextualSystemInstruction,
        },
      });
      selectedModel = 'gemini-3.8-flash';
    }

    const reply = response.text || "I'm sorry, I couldn't generate a response. Please ask again!";

    return res.json({
      success: true,
      modelUsed: selectedModel,
      reply: reply,
    });
  } catch (error: any) {
    console.error('Error during chat:', error);
    return res.status(500).json({
      error: error.message || 'Chat service encountered an error. Please try again.',
    });
  }
});

// Setup Vite middleware for development or serve dist in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`FloraWise server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
