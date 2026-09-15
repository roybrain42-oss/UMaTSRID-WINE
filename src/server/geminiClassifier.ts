import { GoogleGenAI, Type } from '@google/genai';

export interface GeminiClassificationResponse {
  category: 'PLASTIC' | 'METAL' | 'PAPER' | 'GLASS' | 'ORGANIC' | 'E_WASTE' | 'OTHER';
  material: string;
  itemDescription?: string;
  confidence: number;
  recyclable: boolean;
  estimatedWeightKg: number;
  resinCode?: string;
  cleanlinessRating?: 'CLEAN' | 'NEEDS_RINSING' | 'CONTAMINATED' | 'SOILED';
  handlingInstructions: string;
  detectedFeatures: string[];
  ghanaLocalContext?: string;
  epaSortingStandard?: string;
}

export async function classifyWasteImageWithGemini(
  base64ImageWithMime: string,
  hint?: string
): Promise<GeminiClassificationResponse | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('GEMINI_API_KEY is not configured in process environment. Utilizing client-side optical vision.');
    return null;
  }

  try {
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    let mimeType = 'image/jpeg';
    let base64Data = base64ImageWithMime;

    if (base64ImageWithMime.startsWith('data:')) {
      const commaIdx = base64ImageWithMime.indexOf(',');
      if (commaIdx !== -1) {
        const meta = base64ImageWithMime.substring(0, commaIdx);
        const match = meta.match(/data:([^;]+)/);
        if (match) {
          mimeType = match[1];
        }
        base64Data = base64ImageWithMime.substring(commaIdx + 1);
      }
    }

    // Clean whitespace and linebreaks if any
    base64Data = base64Data.replace(/[\r\n\s]+/g, '');

    const systemPrompt = `You are the EPA Ghana EcoSort Real-Time AI Camera & Optical Waste Vision Intelligence System.
Your job is to identify recyclable materials and household/commercial waste items accurately from camera feeds and photos captured by citizens, collection agents, and recycling aggregators across Ghana (Accra, Kumasi, Takoradi, Tamale, Tema, etc.).

Carefully inspect the image:
1. Examine the visual texture, material opacity, form factor, label text, cap, edges, and resin marks.
2. Accurately categorize into ONE of the standard categories:
   - 'PLASTIC': Water bottles (PET #1), pure water sachets (LDPE #4), HDPE jugs / Kufuor gallons (#2), shampoo bottles, takeaway bowls (PP #5), shopping bags.
   - 'METAL': Aluminum drink cans (Club, Malta, Alvaro, Coke), tin/steel food cans (Sardine, Geisha, Ideal Milk, Tomato paste), metal lids/caps, scrap metal.
   - 'PAPER': Corrugated boxes (Indomie, FanMilk, shipping cartons), brown kraft cardboard, newspapers (Daily Graphic), exam sheets, paper bags.
   - 'GLASS': Beer bottles (Club, Star, Guinness glass), wine bottles, glass beverage containers, glass jars.
   - 'E_WASTE': Phones, chargers, circuit boards, wires, remote controls, batteries, electronics.
   - 'ORGANIC': Food leftovers, plantain peels, cassava peels, coconut husks, fruit waste, compostable organics.
   - 'OTHER': Footwear, textiles, rubber tires, mixed composite.

3. Provide a realistic weight in kg for the item or batch shown:
   - Single 500ml-1.5L plastic bottle: 0.02 - 0.05 kg
   - Bundle of plastic bottles: 0.3 - 2.0 kg
   - Single pure water sachet: 0.01 - 0.02 kg; sachet bundle: 0.2 - 1.0 kg
   - Beverage aluminum can: 0.015 - 0.03 kg
   - Cardboard carton / box: 0.3 - 1.2 kg
   - Glass bottle: 0.35 - 0.70 kg
   - E-waste phone/charger: 0.15 - 0.40 kg

4. Give authentic Ghana EPA sorting bin standards and handling steps.`;

    const userPrompt = `Analyze this waste image captured live on camera.${hint ? ` Optional user note: "${hint}"` : ''} Return the structured JSON classification.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [
        {
          parts: [
            {
              inlineData: {
                mimeType,
                data: base64Data,
              },
            },
            {
              text: userPrompt,
            },
          ],
        },
      ],
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            category: {
              type: Type.STRING,
              description: 'One of: PLASTIC, METAL, PAPER, GLASS, E_WASTE, ORGANIC, OTHER',
            },
            material: {
              type: Type.STRING,
              description: 'Specific material name (e.g. PET Plastic Bottle, LDPE Pure Water Sachet, HDPE Container, Aluminum Can, Tin Steel Can, Corrugated Cardboard, Glass Beverage Bottle, Electronic Circuit / E-Waste, Organic Compost)',
            },
            itemDescription: {
              type: Type.STRING,
              description: 'Clear concise description of the item identified in the photo',
            },
            confidence: {
              type: Type.NUMBER,
              description: 'Confidence percentage from 85.0 to 99.8',
            },
            recyclable: {
              type: Type.BOOLEAN,
              description: 'Whether this item is recyclable in Ghana circular infrastructure',
            },
            estimatedWeightKg: {
              type: Type.NUMBER,
              description: 'Estimated realistic weight in kilograms',
            },
            resinCode: {
              type: Type.STRING,
              description: 'Resin or material code e.g. #1 PET, #2 HDPE, #4 LDPE, #5 PP, ALU #41, FE #40, PAP #20, GL #70, WEEE',
            },
            cleanlinessRating: {
              type: Type.STRING,
              description: 'CLEAN, NEEDS_RINSING, CONTAMINATED, or SOILED',
            },
            handlingInstructions: {
              type: Type.STRING,
              description: 'Clear Ghana EPA handling, rinsing and preparation instructions',
            },
            detectedFeatures: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: '3-4 specific optical visual features detected in the image',
            },
            ghanaLocalContext: {
              type: Type.STRING,
              description: 'Local Ghanaian waste stream relevance, market value, or community recycling tip',
            },
            epaSortingStandard: {
              type: Type.STRING,
              description: 'EPA Ghana designated sorting bin color (e.g. Blue Bin for Plastics, Yellow Bin for Metals, Green Bin for Paper, Teal Bin for Glass, Purple Bin for E-Waste, Brown Bin for Organics)',
            },
          },
          required: [
            'category',
            'material',
            'confidence',
            'recyclable',
            'estimatedWeightKg',
            'handlingInstructions',
            'detectedFeatures',
          ],
        },
      },
    });

    const text = response.text;
    if (!text) return null;

    const parsed = JSON.parse(text) as GeminiClassificationResponse;
    return parsed;
  } catch (error) {
    console.error('Error invoking Gemini Vision API in server:', error);
    return null;
  }
}
