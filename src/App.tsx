/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { PlantUploader } from './components/PlantUploader';
import { PlantResultView } from './components/PlantResultView';
import { FloraChat } from './components/FloraChat';
import { GardenTracker } from './components/GardenTracker';
import { SymptomChecker } from './components/SymptomChecker';
import { PlantIdentification, GardenPlant } from './types/plant';

const INITIAL_GARDEN_PLANTS: GardenPlant[] = [
  {
    id: 'seed-monstera',
    nickname: 'Monty',
    plantData: {
      commonName: 'Monstera Deliciosa',
      scientificName: 'Monstera deliciosa',
      plantFamily: 'Araceae',
      confidenceScore: 0.98,
      summary: 'Iconic tropical vine native to southern Mexican rainforests, famous for its dramatic naturally fenestrated leaves and aerial roots.',
      difficulty: 'Easy',
      healthStatus: 'Healthy',
      healthDiagnosis: {
        issueDetected: 'Healthy Specimen with Vigor',
        symptoms: ['Glossy deep green foliage', 'Firm aerial root development'],
        rootCause: 'Optimal bright indirect lighting and consistent watering cadence',
        treatmentSteps: ['Continue current watering schedule', 'Wipe foliage monthly with damp cloth to maximize photosynthesis'],
        urgency: 'low',
      },
      careGuide: {
        watering: {
          frequency: 'Every 7-10 days',
          details: 'Allow top 2-3 inches of potting medium to dry out completely before deep soaking until water flows freely through bottom drainage.',
          seasonalVariation: 'Reduce watering in autumn and winter to every 12-14 days as vegetative growth slows.',
          overwateringWarning: 'Yellowing lower leaves and brown soft spots with yellow halos indicate waterlogged root rot.',
        },
        sunlight: {
          category: 'Bright Indirect Light',
          hoursNeeded: '6-8 hours daily',
          placement: 'Near an East or South-facing window filtered through sheer curtains; protect from scorching midday sun.',
        },
        soil: {
          soilType: 'Chunky Aroid Mix',
          idealPh: '5.5 - 6.5',
          drainageNeeds: 'High drainage pot with multiple baseline drainage holes',
          mixRecipe: '40% organic potting soil, 30% perlite, 20% orchid bark chips, 10% worm castings or horticultural charcoal.',
        },
        humidity: {
          idealRange: '60% - 80%',
          advice: 'Thrives in medium to high ambient humidity. Group with fellow tropicals or place near an ultrasonic cool-mist humidifier.',
        },
        temperature: {
          idealC: '18°C - 30°C',
          idealF: '65°F - 86°F',
          coldHardinessLimit: '10°C (50°F) - Protect from cold drafts and air conditioner vents.',
        },
        fertilizing: {
          recommendation: 'Balanced liquid organic fertilizer with NPK ratio 20-20-20 or 3-1-2 diluted to half strength.',
          frequency: 'Once every 2-3 weeks during spring and summer',
          winterCare: 'Suspend fertilizing entirely from November to February during dormant rest.',
        },
        toxicity: {
          toxicToCats: true,
          toxicToDogs: true,
          toxicToHumans: true,
          details: 'Contains insoluble calcium oxalate raphide crystals. Chewing causes intense burning in mouth, swelling of tongue, and digestive upset.',
        },
        pruningAndPropagation: {
          pruningTips: 'Prune dead or yellowing leaves at the base of the petiole. Train aerial roots into a moss pole or guide back into potting soil.',
          propagationMethod: 'Stem cutting with at least one node and aerial root',
          stepByStep: [
            'Locate a healthy leaf stem with a prominent node and aerial root nub',
            'Make a clean cut 1 inch below the node with sterilized pruning shears',
            'Place cutting into room temperature filtered water or moist sphagnum moss',
            'Wait 3-5 weeks until roots grow 2-3 inches before potting in chunky aroid soil',
          ],
        },
      },
      companionPlants: ['Epipremnum aureum (Golden Pothos)', 'Philodendron brasil', 'Syngonium'],
      funFacts: [
        'In wild tropical habitats, Monstera can climb trees up to 60 feet high using adhesive aerial roots.',
        'Produces an edible fruit in native jungles that tastes like a hybrid of pineapple, banana, and mango.',
      ],
      imageUrl: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=800&q=80',
    },
    imageUrl: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=800&q=80',
    dateAdded: new Date(Date.now() - 14 * 86400000).toISOString(),
    lastWatered: new Date(Date.now() - 6 * 86400000).toISOString(),
    wateringIntervalDays: 7,
    notes: 'Near East window, thriving with new leaf unfurling.',
    location: 'Living Room',
  },
  {
    id: 'seed-snake-plant',
    nickname: 'Spear',
    plantData: {
      commonName: 'Sansevieria (Snake Plant)',
      scientificName: 'Dracaena trifasciata',
      plantFamily: 'Asparagaceae',
      confidenceScore: 0.99,
      summary: 'Indestructible architectural succulent native to tropical West Africa. Renowned for NASA air purification and tolerance of neglect.',
      difficulty: 'Easy',
      healthStatus: 'Healthy',
      healthDiagnosis: {
        issueDetected: 'Robust and Vigorous',
        symptoms: ['Stiff upright spear leaves with vibrant yellow borders'],
        rootCause: 'Thorough drying cycles between waterings',
        treatmentSteps: ['Maintain dry root conditions; avoid water pooling in central leaf rosette'],
        urgency: 'low',
      },
      careGuide: {
        watering: {
          frequency: 'Every 2-3 weeks',
          details: 'Soak thoroughly only when soil is 100% bone dry to the bottom of the pot. When in doubt, wait another week before watering.',
          seasonalVariation: 'In winter, water only once every 4-6 weeks.',
          overwateringWarning: 'Mushy, soggy, foul-smelling leaf bases signify fatal crown rot.',
        },
        sunlight: {
          category: 'Adaptable (Low to Bright Indirect)',
          hoursNeeded: '2-8 hours',
          placement: 'Tolerates low light corners, but grows faster and displays richer variegation in bright indirect light.',
        },
        soil: {
          soilType: 'Gritty Succulent & Cactus Mix',
          idealPh: '6.0 - 7.0',
          drainageNeeds: 'Essential terracotta pot with bottom drainage hole',
          mixRecipe: '50% cactus potting soil, 30% pumice or perlite, 20% coarse horticultural sand.',
        },
        humidity: {
          idealRange: '30% - 50%',
          advice: 'Thrives in ordinary dry household air; never mist foliage.',
        },
        temperature: {
          idealC: '21°C - 32°C',
          idealF: '70°F - 90°F',
          coldHardinessLimit: '10°C (50°F) - Susceptible to cold cellular collapse below 50°F.',
        },
        fertilizing: {
          recommendation: 'Mild organic cactus and succulent fertilizer with low nitrogen.',
          frequency: 'Once in spring and once in mid-summer',
          winterCare: 'Do not fertilize in winter.',
        },
        toxicity: {
          toxicToCats: true,
          toxicToDogs: true,
          toxicToHumans: true,
          details: 'Contains saponins which cause nausea, vomiting, salivation, and diarrhea if chewed by pets.',
        },
        pruningAndPropagation: {
          pruningTips: 'Trim damaged leaf tips straight across or remove damaged outer leaves at soil level.',
          propagationMethod: 'Division of underground rhizomes or leaf cuttings in water/soil',
          stepByStep: [
            'Unpot plant and separate clustered rhizomes with a sharp clean blade',
            'Allow cut rhizome surfaces to callus over for 24 hours',
            'Pot directly into dry gritty cactus blend and wait 1 week before initial watering',
          ],
        },
      },
      companionPlants: ['Zamioculcas zamiifolia (ZZ Plant)', 'Haworthia', 'Jade Plant'],
      funFacts: [
        'Performs Crassulacean Acid Metabolism (CAM) photosynthesis, releasing oxygen at night rather than day.',
        'Traditionally used in Africa for durable bowstring fibers due to tough leaf fibers.',
      ],
      imageUrl: 'https://images.unsplash.com/photo-1593482892290-f54927ae1eb6?auto=format&fit=crop&w=800&q=80',
    },
    imageUrl: 'https://images.unsplash.com/photo-1593482892290-f54927ae1eb6?auto=format&fit=crop&w=800&q=80',
    dateAdded: new Date(Date.now() - 30 * 86400000).toISOString(),
    lastWatered: new Date(Date.now() - 13 * 86400000).toISOString(),
    wateringIntervalDays: 14,
    notes: 'Sitting on office shelf. Needs very little water.',
    location: 'Study / Office',
  },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'identify' | 'garden' | 'chat' | 'doctor'>('identify');
  const [currentPlant, setCurrentPlant] = useState<PlantIdentification | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [loadingStep, setLoadingStep] = useState<string>('');
  const [chatPlantContext, setChatPlantContext] = useState<PlantIdentification | null>(null);

  // Garden plants persisted in localStorage
  const [gardenPlants, setGardenPlants] = useState<GardenPlant[]>(() => {
    try {
      const saved = localStorage.getItem('florawise_garden');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Failed to load garden plants from localStorage:', e);
    }
    return INITIAL_GARDEN_PLANTS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('florawise_garden', JSON.stringify(gardenPlants));
    } catch (e) {
      console.warn('Failed to save garden plants to localStorage:', e);
    }
  }, [gardenPlants]);

  // Handle Plant Identification
  const handleAnalyzePlant = async (
    imageBase64: string,
    mimeType: string,
    userNotes: string,
    preferredModel: string
  ) => {
    setIsAnalyzing(true);
    setLoadingStep('Uploading high-resolution plant imagery...');

    const stepTimer1 = setTimeout(() => {
      setLoadingStep('Examining botanical morphology, leaf venation & foliage structure...');
    }, 1500);

    const stepTimer2 = setTimeout(() => {
      setLoadingStep('Running botanical health diagnostics & pathology with Gemini AI...');
    }, 3800);

    const stepTimer3 = setTimeout(() => {
      setLoadingStep('Synthesizing care blueprints, soil mixes, and pet safety guidelines...');
    }, 6500);

    try {
      const response = await fetch('/api/identify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64,
          mimeType,
          userNotes,
          preferredModel,
        }),
      });

      const responseText = await response.text();
      let data: any;
      try {
        data = JSON.parse(responseText);
      } catch {
        if (!response.ok) {
          throw new Error('Server is temporarily busy or photo is too large. Please retry or choose a different plant photo.');
        }
        throw new Error('Received unexpected response format from server. Please retry.');
      }

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to identify plant. Please try again with a clearer photo.');
      }

      const identifiedPlant = data.plant as PlantIdentification;
      identifiedPlant.imageUrl = imageBase64;
      identifiedPlant.scannedAt = new Date().toISOString();

      setCurrentPlant(identifiedPlant);
      setCurrentImageUrl(imageBase64);
      setChatPlantContext(identifiedPlant);
    } catch (err: any) {
      console.error('Error analyzing plant:', err);
      alert(err.message || 'Plant identification failed. Please check your network and try again.');
    } finally {
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      clearTimeout(stepTimer3);
      setIsAnalyzing(false);
      setLoadingStep('');
    }
  };

  // Garden Management
  const handleAddToGarden = (newPlant: GardenPlant) => {
    setGardenPlants((prev) => [newPlant, ...prev]);
  };

  const handleWaterPlant = (plantId: string) => {
    setGardenPlants((prev) =>
      prev.map((p) =>
        p.id === plantId ? { ...p, lastWatered: new Date().toISOString() } : p
      )
    );
  };

  const handleRemovePlant = (plantId: string) => {
    if (window.confirm('Are you sure you want to remove this plant from your garden?')) {
      setGardenPlants((prev) => prev.filter((p) => p.id !== plantId));
    }
  };

  const handleViewPlantGuide = (plant: PlantIdentification, imageUrl: string) => {
    setCurrentPlant(plant);
    setCurrentImageUrl(imageUrl);
    setActiveTab('identify');
  };

  const handleConsultBotanist = (plant: PlantIdentification) => {
    setChatPlantContext(plant);
    setActiveTab('chat');
  };

  const handleConsultSymptom = (symptomQuery: string) => {
    setActiveTab('chat');
  };

  const isCurrentPlantInGarden = currentPlant
    ? gardenPlants.some(
        (gp) => gp.plantData.scientificName?.toLowerCase() === currentPlant.scientificName?.toLowerCase()
      )
    : false;

  return (
    <div className="min-h-screen bg-[#f7f9f6] text-stone-900 flex flex-col font-sans selection:bg-emerald-200 selection:text-emerald-900">
      {/* Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        gardenCount={gardenPlants.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* TAB 1: IDENTIFY & DIAGNOSE */}
        {activeTab === 'identify' && (
          <div>
            {currentPlant ? (
              <PlantResultView
                plant={currentPlant}
                imageUrl={currentImageUrl || undefined}
                onBackToScanner={() => setCurrentPlant(null)}
                onAddToGarden={handleAddToGarden}
                onAskBotanist={handleConsultBotanist}
                isAlreadyInGarden={isCurrentPlantInGarden}
              />
            ) : (
              <PlantUploader
                onAnalyze={handleAnalyzePlant}
                isLoading={isAnalyzing}
                loadingStep={loadingStep}
              />
            )}
          </div>
        )}

        {/* TAB 2: MY GARDEN TRACKER */}
        {activeTab === 'garden' && (
          <GardenTracker
            plants={gardenPlants}
            onWaterPlant={handleWaterPlant}
            onRemovePlant={handleRemovePlant}
            onViewPlant={handleViewPlantGuide}
            onAskAboutPlant={handleConsultBotanist}
            onAddNewPlant={() => {
              setCurrentPlant(null);
              setActiveTab('identify');
            }}
          />
        )}

        {/* TAB 3: GEMINI FLORABOT CHAT */}
        {activeTab === 'chat' && (
          <FloraChat
            currentPlantContext={chatPlantContext}
            onClearPlantContext={() => setChatPlantContext(null)}
          />
        )}

        {/* TAB 4: PLANT DOCTOR SYMPTOM CHECKER */}
        {activeTab === 'doctor' && (
          <SymptomChecker
            onConsultSymptom={handleConsultSymptom}
            onGoToScanner={() => {
              setCurrentPlant(null);
              setActiveTab('identify');
            }}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-emerald-100 bg-white/70 py-6 text-center text-xs text-stone-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-serif-plant font-bold text-emerald-950">FloraWise</span>
            <span>•</span>
            <span>AI Botanical Care, Visual Pathology &amp; Hydration Management</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-stone-400">
            <span>Powered by Gemini 4 Argon &amp; Flash</span>
            <span>•</span>
            <span>Organic Horticultural Science</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
