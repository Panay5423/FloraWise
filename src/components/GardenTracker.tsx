import React, { useState } from 'react';
import { GardenPlant, PlantIdentification } from '../types/plant';
import {
  Droplets,
  Calendar,
  MapPin,
  MessageSquare,
  Eye,
  Trash2,
  Plus,
  CheckCircle2,
  AlertCircle,
  Filter,
  Sparkles,
  Sprout
} from 'lucide-react';

interface GardenTrackerProps {
  plants: GardenPlant[];
  onWaterPlant: (plantId: string) => void;
  onRemovePlant: (plantId: string) => void;
  onViewPlant: (plant: PlantIdentification, imageUrl: string) => void;
  onAskAboutPlant: (plant: PlantIdentification) => void;
  onAddNewPlant: () => void;
}

export const GardenTracker: React.FC<GardenTrackerProps> = ({
  plants,
  onWaterPlant,
  onRemovePlant,
  onViewPlant,
  onAskAboutPlant,
  onAddNewPlant,
}) => {
  const [filter, setFilter] = useState<'all' | 'needs_water' | 'healthy'>('all');
  const [wateredToastId, setWateredToastId] = useState<string | null>(null);

  // Compute watering due calculations
  const getWateringStatus = (plant: GardenPlant) => {
    const lastWateredDate = new Date(plant.lastWatered);
    const today = new Date();
    const diffTime = today.getTime() - lastWateredDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const daysUntilNext = plant.wateringIntervalDays - diffDays;

    if (daysUntilNext <= 0) {
      return {
        label: 'Needs Water Today!',
        isUrgent: true,
        days: daysUntilNext,
        color: 'bg-rose-100 text-rose-800 border-rose-200',
      };
    } else if (daysUntilNext <= 2) {
      return {
        label: `Water in ${daysUntilNext} day${daysUntilNext === 1 ? '' : 's'}`,
        isUrgent: false,
        days: daysUntilNext,
        color: 'bg-amber-100 text-amber-800 border-amber-200',
      };
    } else {
      return {
        label: `Water in ${daysUntilNext} days`,
        isUrgent: false,
        days: daysUntilNext,
        color: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      };
    }
  };

  const handleWater = (plantId: string) => {
    onWaterPlant(plantId);
    setWateredToastId(plantId);
    setTimeout(() => setWateredToastId(null), 2500);
  };

  const filteredPlants = plants.filter((plant) => {
    const status = getWateringStatus(plant);
    if (filter === 'needs_water') return status.days <= 0;
    if (filter === 'healthy') return plant.plantData.healthStatus?.toLowerCase().includes('healthy');
    return true;
  });

  const totalDueWater = plants.filter((p) => getWateringStatus(p).days <= 0).length;

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 animate-fadeIn">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-serif-plant font-bold text-emerald-950">
              My Botanical Collection
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
              {plants.length} Plant{plants.length === 1 ? '' : 's'}
            </span>
          </div>
          <p className="text-sm text-stone-500 mt-1">
            Track daily hydration, log care schedules, and monitor health progress.
          </p>
        </div>

        <button
          onClick={onAddNewPlant}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-sm shadow-md shadow-emerald-800/20 active:scale-98 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Plant</span>
        </button>
      </div>

      {/* Quick Summary Pill Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-emerald-100 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-stone-400 font-medium uppercase tracking-wider">Total Plants</span>
            <p className="text-2xl font-bold text-stone-800">{plants.length}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            🌱
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-rose-100 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-rose-500 font-medium uppercase tracking-wider">Thirsty Today</span>
            <p className="text-2xl font-bold text-rose-700">{totalDueWater}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
            <Droplets className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-emerald-100 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-stone-400 font-medium uppercase tracking-wider">Care Routine</span>
            <p className="text-sm font-bold text-emerald-900 mt-1">
              {totalDueWater === 0 ? 'All plants hydrated!' : `${totalDueWater} task pending`}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-3">
        <Filter className="w-4 h-4 text-stone-400" />
        <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider mr-2">Filter:</span>
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            filter === 'all'
              ? 'bg-emerald-800 text-white'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          All Plants ({plants.length})
        </button>
        <button
          onClick={() => setFilter('needs_water')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            filter === 'needs_water'
              ? 'bg-rose-700 text-white'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          Needs Water ({totalDueWater})
        </button>
        <button
          onClick={() => setFilter('healthy')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            filter === 'healthy'
              ? 'bg-emerald-800 text-white'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          Healthy Specimen
        </button>
      </div>

      {/* Plants Grid */}
      {filteredPlants.length === 0 ? (
        <div className="text-center py-16 px-4 bg-white rounded-3xl border border-dashed border-stone-200 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <Sprout className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-stone-800 font-serif-plant">
              No plants match this view
            </h3>
            <p className="text-sm text-stone-500 max-w-md mx-auto">
              Scan a plant with your camera or add your indoor plants to keep track of their care needs.
            </p>
          </div>
          <button
            onClick={onAddNewPlant}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Identify &amp; Add Plant</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlants.map((plant) => {
            const status = getWateringStatus(plant);
            const isJustWatered = wateredToastId === plant.id;

            return (
              <div
                key={plant.id}
                className="bg-white rounded-3xl border border-emerald-100 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
              >
                <div>
                  {/* Photo Header */}
                  <div className="h-48 relative overflow-hidden bg-stone-900">
                    <img
                      src={plant.imageUrl}
                      alt={plant.nickname}
                      className="w-full h-full object-cover"
                    />

                    {/* Watering status chip */}
                    <div className="absolute top-3 left-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold border backdrop-blur-md ${status.color}`}>
                        {status.label}
                      </span>
                    </div>

                    {/* Location chip */}
                    <div className="absolute bottom-3 left-3 flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-stone-900/80 text-white backdrop-blur-md border border-white/20">
                      <MapPin className="w-3 h-3 text-emerald-400" />
                      <span>{plant.location}</span>
                    </div>

                    {/* Delete button */}
                    <button
                      onClick={() => onRemovePlant(plant.id)}
                      title="Remove plant"
                      className="absolute top-3 right-3 p-2 rounded-xl bg-stone-900/70 hover:bg-rose-700 text-white backdrop-blur-md transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Body Info */}
                  <div className="p-5 space-y-3">
                    <div>
                      <h3 className="text-xl font-bold font-serif-plant text-stone-900">
                        {plant.nickname}
                      </h3>
                      <p className="text-xs italic font-serif-plant text-stone-500">
                        {plant.plantData.commonName} ({plant.plantData.scientificName})
                      </p>
                    </div>

                    <div className="space-y-1.5 text-xs text-stone-600 pt-1">
                      <div className="flex items-center justify-between">
                        <span className="text-stone-400">Watering Schedule:</span>
                        <span className="font-semibold text-stone-700">Every {plant.wateringIntervalDays} days</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-stone-400">Last Watered:</span>
                        <span className="font-semibold text-stone-700">
                          {new Date(plant.lastWatered).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-stone-400">Health State:</span>
                        <span className="font-semibold text-emerald-800">
                          {plant.plantData.healthStatus}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="p-5 pt-0 space-y-2">
                  <button
                    onClick={() => handleWater(plant.id)}
                    className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                      isJustWatered
                        ? 'bg-emerald-600 text-white'
                        : status.isUrgent
                        ? 'bg-sky-600 hover:bg-sky-700 text-white shadow-md shadow-sky-600/20'
                        : 'bg-stone-100 hover:bg-sky-50 hover:text-sky-800 text-stone-700'
                    }`}
                  >
                    {isJustWatered ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 animate-bounce" />
                        <span>Hydrated! Next in {plant.wateringIntervalDays} days</span>
                      </>
                    ) : (
                      <>
                        <Droplets className="w-4 h-4 text-sky-400" />
                        <span>Mark as Watered Today</span>
                      </>
                    )}
                  </button>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => onViewPlant(plant.plantData, plant.imageUrl)}
                      className="py-2 px-3 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5 text-stone-500" />
                      <span>Care Guide</span>
                    </button>

                    <button
                      onClick={() => onAskAboutPlant(plant.plantData)}
                      className="py-2 px-3 rounded-xl border border-teal-200 bg-teal-50/50 hover:bg-teal-100 text-teal-900 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-teal-700" />
                      <span>Ask FloraBot</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
