export interface HealthDiagnosis {
  issueDetected: string;
  symptoms: string[];
  rootCause: string;
  treatmentSteps: string[];
  urgency: 'low' | 'medium' | 'high';
}

export interface CareGuide {
  watering: {
    frequency: string;
    details: string;
    seasonalVariation: string;
    overwateringWarning: string;
  };
  sunlight: {
    category: string;
    hoursNeeded: string;
    placement: string;
  };
  soil: {
    soilType: string;
    idealPh: string;
    drainageNeeds: string;
    mixRecipe: string;
  };
  humidity: {
    idealRange: string;
    advice: string;
  };
  temperature: {
    idealC: string;
    idealF: string;
    coldHardinessLimit: string;
  };
  fertilizing: {
    recommendation: string;
    frequency: string;
    winterCare: string;
  };
  toxicity: {
    toxicToCats: boolean;
    toxicToDogs: boolean;
    toxicToHumans: boolean;
    details: string;
  };
  pruningAndPropagation: {
    pruningTips: string;
    propagationMethod: string;
    stepByStep: string[];
  };
}

export interface PlantIdentification {
  commonName: string;
  scientificName: string;
  plantFamily: string;
  confidenceScore: number;
  summary: string;
  difficulty: 'Easy' | 'Moderate' | 'Advanced' | string;
  healthStatus: 'Healthy' | 'Mild Stress' | 'Disease Detected' | 'Pest Infestation' | 'Nutrient Deficiency' | string;
  healthDiagnosis: HealthDiagnosis;
  careGuide: CareGuide;
  companionPlants: string[];
  funFacts: string[];
  imageUrl?: string;
  scannedAt?: string;
}

export interface GardenPlant {
  id: string;
  nickname: string;
  plantData: PlantIdentification;
  imageUrl: string;
  dateAdded: string;
  lastWatered: string;
  wateringIntervalDays: number;
  notes: string;
  location: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  modelUsed?: string;
}
