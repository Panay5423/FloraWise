import React, { useState } from 'react';
import {
  PlantIdentification,
  GardenPlant
} from '../types/plant';
import {
  Droplets,
  Sun,
  Layers,
  Thermometer,
  Wind,
  Zap,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  Scissors,
  BookmarkPlus,
  MessageSquare,
  ArrowLeft,
  Share2,
  Sprout,
  Heart,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface PlantResultViewProps {
  plant: PlantIdentification;
  imageUrl?: string;
  onBackToScanner: () => void;
  onAddToGarden: (plant: GardenPlant) => void;
  onAskBotanist: (plant: PlantIdentification) => void;
  isAlreadyInGarden?: boolean;
}

export const PlantResultView: React.FC<PlantResultViewProps> = ({
  plant,
  imageUrl,
  onBackToScanner,
  onAddToGarden,
  onAskBotanist,
  isAlreadyInGarden = false,
}) => {
  const [showAddToGardenModal, setShowAddToGardenModal] = useState(false);
  const [nickname, setNickname] = useState(plant.commonName);
  const [location, setLocation] = useState('Living Room');
  const [customInterval, setCustomInterval] = useState<number>(7);
  const [addedToast, setAddedToast] = useState(false);
  const [expandedSection, setExpandedSection] = useState<'all' | string>('all');

  const { careGuide, healthDiagnosis } = plant;
  const isHealthy = plant.healthStatus?.toLowerCase().includes('healthy');
  const isSevere = plant.healthStatus?.toLowerCase().includes('disease') || plant.healthStatus?.toLowerCase().includes('pest');

  const handleSaveToGarden = (e: React.FormEvent) => {
    e.preventDefault();
    const newGardenPlant: GardenPlant = {
      id: `plant-${Date.now()}`,
      nickname: nickname.trim() || plant.commonName,
      plantData: plant,
      imageUrl: imageUrl || plant.imageUrl || 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=800&q=80',
      dateAdded: new Date().toISOString(),
      lastWatered: new Date().toISOString(),
      wateringIntervalDays: customInterval > 0 ? customInterval : 7,
      notes: plant.healthDiagnosis?.issueDetected || 'Saved from AI scan',
      location: location.trim() || 'Indoor',
    };

    onAddToGarden(newGardenPlant);
    setShowAddToGardenModal(false);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 3500);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${plant.commonName} Care Guide - FloraWise`,
        text: `Check out care tips and botanical diagnosis for ${plant.commonName} (${plant.scientificName}).`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(
        `Plant: ${plant.commonName} (${plant.scientificName})\nWatering: ${careGuide.watering.frequency}\nLight: ${careGuide.sunlight.category}`
      );
      alert('Plant care summary copied to clipboard!');
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 animate-fadeIn">
      {/* Top action bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={onBackToScanner}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-stone-200 text-stone-700 hover:text-emerald-900 hover:bg-emerald-50/50 text-sm font-semibold transition-all shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          Scan Another Plant
        </button>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={handleShare}
            className="p-2.5 rounded-xl bg-white border border-stone-200 text-stone-600 hover:text-stone-900 hover:bg-stone-50 transition-all shadow-xs"
            title="Share Plant Guide"
          >
            <Share2 className="w-4 h-4" />
          </button>

          <button
            onClick={() => onAskBotanist(plant)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white text-sm font-semibold transition-all shadow-xs"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Consult FloraBot</span>
          </button>

          <button
            onClick={() => setShowAddToGardenModal(true)}
            disabled={isAlreadyInGarden}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-md ${
              isAlreadyInGarden
                ? 'bg-emerald-100 text-emerald-800 cursor-default'
                : 'bg-emerald-800 hover:bg-emerald-900 text-white shadow-emerald-800/20 active:scale-98'
            }`}
          >
            {isAlreadyInGarden ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>In Your Garden</span>
              </>
            ) : (
              <>
                <BookmarkPlus className="w-4 h-4" />
                <span>Add to My Garden</span>
              </>
            )}
          </button>
        </div>
      </div>

      {addedToast && (
        <div className="p-4 rounded-2xl bg-emerald-700 text-white flex items-center justify-between shadow-lg animate-bounce">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-300" />
            <span className="text-sm font-medium">
              <strong>{nickname}</strong> has been added to your Garden with watering reminders!
            </span>
          </div>
        </div>
      )}

      {/* Main Plant Profile Hero Card */}
      <div className="bg-white rounded-3xl border border-emerald-100 shadow-xl shadow-emerald-950/5 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
          {/* Plant Photo Display */}
          <div className="md:col-span-5 relative bg-stone-900 flex items-center justify-center min-h-[300px] md:min-h-full overflow-hidden">
            <img
              src={imageUrl || plant.imageUrl || 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=800&q=80'}
              alt={plant.commonName}
              className="w-full h-full object-cover max-h-[460px]"
            />
            <div className="absolute top-4 left-4 flex flex-col gap-1.5">
              <span className="px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-emerald-900/80 text-emerald-100 backdrop-blur-md border border-emerald-400/30">
                {Math.round((plant.confidenceScore || 0.95) * 100)}% Match
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-stone-900/80 text-stone-200 backdrop-blur-md border border-white/20">
                {plant.difficulty || 'Moderate'} Care
              </span>
            </div>
          </div>

          {/* Plant Core Taxonomy & Summary */}
          <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700">
                <Sprout className="w-4 h-4" />
                <span>Family: {plant.plantFamily || 'Botanical Family'}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-serif-plant font-bold text-emerald-950">
                {plant.commonName}
              </h1>
              <p className="text-base sm:text-lg font-serif-plant italic text-stone-500 font-medium">
                {plant.scientificName}
              </p>
              <p className="text-stone-600 text-sm leading-relaxed pt-2">
                {plant.summary}
              </p>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-stone-100">
              <div className="p-3 rounded-2xl bg-stone-50 border border-stone-100">
                <div className="flex items-center gap-1.5 text-stone-500 text-xs font-medium mb-1">
                  <Droplets className="w-3.5 h-3.5 text-sky-500" />
                  <span>Water</span>
                </div>
                <p className="text-xs font-bold text-stone-800 truncate" title={careGuide.watering.frequency}>
                  {careGuide.watering.frequency}
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-stone-50 border border-stone-100">
                <div className="flex items-center gap-1.5 text-stone-500 text-xs font-medium mb-1">
                  <Sun className="w-3.5 h-3.5 text-amber-500" />
                  <span>Sunlight</span>
                </div>
                <p className="text-xs font-bold text-stone-800 truncate" title={careGuide.sunlight.category}>
                  {careGuide.sunlight.category}
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-stone-50 border border-stone-100">
                <div className="flex items-center gap-1.5 text-stone-500 text-xs font-medium mb-1">
                  <Thermometer className="w-3.5 h-3.5 text-rose-500" />
                  <span>Temp</span>
                </div>
                <p className="text-xs font-bold text-stone-800 truncate" title={careGuide.temperature.idealC}>
                  {careGuide.temperature.idealC}
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-stone-50 border border-stone-100">
                <div className="flex items-center gap-1.5 text-stone-500 text-xs font-medium mb-1">
                  <ShieldAlert className="w-3.5 h-3.5 text-orange-500" />
                  <span>Pets</span>
                </div>
                <p className="text-xs font-bold text-stone-800 truncate">
                  {careGuide.toxicity.toxicToCats || careGuide.toxicity.toxicToDogs ? 'Toxic' : 'Pet-Safe'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* HEALTH DIAGNOSIS & PLANT DOCTOR REPORT */}
      <div className={`p-6 sm:p-8 rounded-3xl border shadow-lg ${
        isHealthy
          ? 'bg-gradient-to-br from-emerald-50 to-teal-50/50 border-emerald-200 text-emerald-950'
          : isSevere
          ? 'bg-gradient-to-br from-rose-50 to-orange-50/50 border-rose-200 text-rose-950'
          : 'bg-gradient-to-br from-amber-50 to-yellow-50/50 border-amber-200 text-amber-950'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
              isHealthy ? 'bg-emerald-600 text-white' : isSevere ? 'bg-rose-600 text-white' : 'bg-amber-600 text-white'
            }`}>
              {isHealthy ? <CheckCircle2 className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider">Visual Health Diagnostic</span>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full uppercase ${
                  isHealthy ? 'bg-emerald-200 text-emerald-900' : isSevere ? 'bg-rose-200 text-rose-900' : 'bg-amber-200 text-amber-900'
                }`}>
                  Status: {plant.healthStatus}
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-serif-plant font-bold">
                {healthDiagnosis.issueDetected}
              </h3>
            </div>
          </div>

          <button
            onClick={() => onAskBotanist(plant)}
            className="self-start sm:self-auto px-4 py-2 rounded-xl bg-white/80 hover:bg-white text-xs font-bold border border-current transition-all"
          >
            Ask Doctor for Custom Treatment &rarr;
          </button>
        </div>

        {/* Symptoms observed */}
        {healthDiagnosis.symptoms && healthDiagnosis.symptoms.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-bold uppercase tracking-wider opacity-75 mb-2">
              Visual Symptoms Observed:
            </p>
            <div className="flex flex-wrap gap-2">
              {healthDiagnosis.symptoms.map((symptom, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-lg text-xs font-semibold bg-white/70 border border-current/20"
                >
                  {symptom}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Root Cause */}
        {healthDiagnosis.rootCause && (
          <div className="p-4 rounded-2xl bg-white/60 border border-current/15 mb-4">
            <h4 className="text-xs font-bold uppercase tracking-wider mb-1">Underlying Root Cause:</h4>
            <p className="text-sm leading-relaxed">{healthDiagnosis.rootCause}</p>
          </div>
        )}

        {/* Treatment Protocol Steps */}
        {healthDiagnosis.treatmentSteps && healthDiagnosis.treatmentSteps.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider">
              Recommended Remediation &amp; Treatment Protocol:
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {healthDiagnosis.treatmentSteps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-white/70 border border-current/15 text-xs sm:text-sm">
                  <span className="w-5 h-5 rounded-full bg-emerald-800 text-white text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* COMPREHENSIVE CARE GUIDE CARDS */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-serif-plant font-bold text-emerald-950">
            Comprehensive Botanical Care Blueprint
          </h2>
          <span className="text-xs text-stone-500 font-medium">
            Scientifically calibrated for {plant.commonName}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 1. Watering & Moisture Card */}
          <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-sm hover:shadow-md transition-shadow space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center">
                <Droplets className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-stone-900 text-base">Watering &amp; Moisture Regimen</h3>
                <p className="text-xs text-stone-500">{careGuide.watering.frequency}</p>
              </div>
            </div>

            <p className="text-sm text-stone-600 leading-relaxed">
              {careGuide.watering.details}
            </p>

            <div className="space-y-2 pt-2 border-t border-stone-100 text-xs">
              <div className="flex items-start gap-2 p-2.5 rounded-xl bg-sky-50/70 border border-sky-100 text-sky-900">
                <span className="font-bold">Seasonal Note:</span>
                <span>{careGuide.watering.seasonalVariation}</span>
              </div>
              <div className="flex items-start gap-2 p-2.5 rounded-xl bg-amber-50/70 border border-amber-100 text-amber-900">
                <span className="font-bold">Overwatering Sign:</span>
                <span>{careGuide.watering.overwateringWarning}</span>
              </div>
            </div>
          </div>

          {/* 2. Sunlight & Placement Card */}
          <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-sm hover:shadow-md transition-shadow space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
                <Sun className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-stone-900 text-base">Sunlight &amp; Window Exposure</h3>
                <p className="text-xs text-stone-500">{careGuide.sunlight.category} ({careGuide.sunlight.hoursNeeded})</p>
              </div>
            </div>

            <p className="text-sm text-stone-600 leading-relaxed">
              {careGuide.sunlight.placement}
            </p>

            <div className="pt-2 border-t border-stone-100 grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-stone-50">
                <span className="text-stone-400 block font-semibold mb-0.5">Light Exposure</span>
                <span className="font-bold text-stone-800">{careGuide.sunlight.category}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-stone-50">
                <span className="text-stone-400 block font-semibold mb-0.5">Duration</span>
                <span className="font-bold text-stone-800">{careGuide.sunlight.hoursNeeded}</span>
              </div>
            </div>
          </div>

          {/* 3. Soil & Potting Recipe Card */}
          <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-sm hover:shadow-md transition-shadow space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-stone-900 text-base">Soil Blend &amp; Drainage</h3>
                <p className="text-xs text-stone-500">{careGuide.soil.soilType} (pH: {careGuide.soil.idealPh})</p>
              </div>
            </div>

            <p className="text-sm text-stone-600 leading-relaxed">
              {careGuide.soil.drainageNeeds}
            </p>

            <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-100 text-xs text-emerald-950 space-y-1">
              <span className="font-bold block">Ideal Soil Mix Formulation:</span>
              <p className="leading-relaxed">{careGuide.soil.mixRecipe}</p>
            </div>
          </div>

          {/* 4. Climate, Temp & Humidity Card */}
          <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-sm hover:shadow-md transition-shadow space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center">
                <Wind className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-stone-900 text-base">Temperature &amp; Humidity</h3>
                <p className="text-xs text-stone-500">Ideal: {careGuide.temperature.idealC} / {careGuide.temperature.idealF}</p>
              </div>
            </div>

            <p className="text-sm text-stone-600 leading-relaxed">
              {careGuide.humidity.advice}
            </p>

            <div className="pt-2 border-t border-stone-100 grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-stone-50">
                <span className="text-stone-400 block font-semibold mb-0.5">Target Humidity</span>
                <span className="font-bold text-stone-800">{careGuide.humidity.idealRange}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-stone-50">
                <span className="text-stone-400 block font-semibold mb-0.5">Frost Minimum</span>
                <span className="font-bold text-rose-700">{careGuide.temperature.coldHardinessLimit}</span>
              </div>
            </div>
          </div>

          {/* 5. Fertilization Regimen Card */}
          <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-sm hover:shadow-md transition-shadow space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-800 flex items-center justify-center">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-stone-900 text-base">Fertilization Schedule</h3>
                <p className="text-xs text-stone-500">{careGuide.fertilizing.frequency}</p>
              </div>
            </div>

            <p className="text-sm text-stone-600 leading-relaxed">
              {careGuide.fertilizing.recommendation}
            </p>

            <div className="p-2.5 rounded-xl bg-purple-50/70 border border-purple-100 text-xs text-purple-950">
              <span className="font-bold">Winter Protocol: </span>
              <span>{careGuide.fertilizing.winterCare}</span>
            </div>
          </div>

          {/* 6. Pet Toxicity & Safety Card */}
          <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-sm hover:shadow-md transition-shadow space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-orange-100 text-orange-800 flex items-center justify-center">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-stone-900 text-base">Pet &amp; Child Safety Profile</h3>
                <p className="text-xs text-stone-500">Toxicological review</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-lg text-xs font-bold ${
                careGuide.toxicity.toxicToCats
                  ? 'bg-rose-100 text-rose-800 border border-rose-200'
                  : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
              }`}>
                🐱 Cats: {careGuide.toxicity.toxicToCats ? 'TOXIC' : 'Safe'}
              </span>

              <span className={`px-3 py-1 rounded-lg text-xs font-bold ${
                careGuide.toxicity.toxicToDogs
                  ? 'bg-rose-100 text-rose-800 border border-rose-200'
                  : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
              }`}>
                🐶 Dogs: {careGuide.toxicity.toxicToDogs ? 'TOXIC' : 'Safe'}
              </span>

              <span className={`px-3 py-1 rounded-lg text-xs font-bold ${
                careGuide.toxicity.toxicToHumans
                  ? 'bg-amber-100 text-amber-800 border border-amber-200'
                  : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
              }`}>
                👶 Children: {careGuide.toxicity.toxicToHumans ? 'Irritant' : 'Safe'}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              {careGuide.toxicity.details}
            </p>
          </div>
        </div>

        {/* 7. Pruning & Propagation Protocol */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Scissors className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-base sm:text-lg">Pruning &amp; Propagation Playbook</h3>
              <p className="text-xs text-stone-500">Method: {careGuide.pruningAndPropagation.propagationMethod}</p>
            </div>
          </div>

          <p className="text-sm text-stone-600 leading-relaxed">
            {careGuide.pruningAndPropagation.pruningTips}
          </p>

          <div className="space-y-2 pt-2">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Propagation Steps:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {careGuide.pruningAndPropagation.stepByStep.map((step, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-stone-50 border border-stone-100 text-xs space-y-1">
                  <span className="font-bold text-emerald-800 block">Step {idx + 1}</span>
                  <p className="text-stone-600 leading-relaxed">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 8. Companion Plants & Fun Facts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {plant.companionPlants && plant.companionPlants.length > 0 && (
            <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                <Heart className="w-4 h-4 text-emerald-600" />
                <span>Companion Planting Buddies</span>
              </div>
              <p className="text-xs text-stone-500">
                Plants that share identical soil, light, and humidity needs:
              </p>
              <div className="flex flex-wrap gap-2">
                {plant.companionPlants.map((companion, idx) => (
                  <span key={idx} className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-200/70 text-xs font-semibold">
                    🌱 {companion}
                  </span>
                ))}
              </div>
            </div>
          )}

          {plant.funFacts && plant.funFacts.length > 0 && (
            <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-amber-800 font-bold text-sm">
                <Sprout className="w-4 h-4 text-amber-600" />
                <span>Botanical Lore &amp; Fun Facts</span>
              </div>
              <ul className="space-y-2">
                {plant.funFacts.map((fact, idx) => (
                  <li key={idx} className="text-xs text-stone-600 leading-relaxed flex items-start gap-2">
                    <span className="text-amber-500 font-bold">•</span>
                    <span>{fact}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Add to Garden Modal */}
      {showAddToGardenModal && (
        <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-stone-200 animate-scaleUp">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <BookmarkPlus className="w-5 h-5 text-emerald-700" />
                <h3 className="text-xl font-bold font-serif-plant text-stone-900">
                  Save to My Garden
                </h3>
              </div>
              <button
                onClick={() => setShowAddToGardenModal(false)}
                className="text-stone-400 hover:text-stone-600 text-lg font-bold"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSaveToGarden} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
                  Plant Nickname
                </label>
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="e.g. Monty, Office Pothos, Kitchen Herb..."
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
                  Home Location / Room
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Living Room, Balcony, East Window..."
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
                  Watering Reminder Interval (Days)
                </label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={customInterval}
                  onChange={(e) => setCustomInterval(parseInt(e.target.value) || 7)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  required
                />
                <p className="text-[11px] text-stone-500 mt-1">
                  Suggested from care guide: {careGuide.watering.frequency}
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddToGardenModal(false)}
                  className="px-4 py-2 rounded-xl border border-stone-200 text-stone-600 text-xs font-semibold hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold shadow-md shadow-emerald-800/20"
                >
                  Confirm &amp; Start Tracking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
