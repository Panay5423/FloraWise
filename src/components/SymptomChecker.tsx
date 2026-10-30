import React, { useState } from 'react';
import {
  Stethoscope,
  AlertTriangle,
  Bug,
  DropletOff,
  SunDim,
  ShieldCheck,
  MessageSquare,
  ChevronRight,
  Flame,
  Search
} from 'lucide-react';

interface SymptomCheckerProps {
  onConsultSymptom: (symptomQuery: string) => void;
  onGoToScanner: () => void;
}

interface CommonAilment {
  id: string;
  title: string;
  subtitle: string;
  category: 'moisture' | 'pest' | 'fungal' | 'light' | 'nutrient';
  icon: string;
  visualSign: string;
  likelyCauses: string[];
  immediateFirstAid: string[];
  organicTreatment: string;
  preventionTip: string;
}

const COMMON_AILMENTS: CommonAilment[] = [
  {
    id: 'yellow_leaves',
    title: 'Yellowing Lower Foliage (Chlorosis)',
    subtitle: 'Old leaves turning yellow, mushy or limp stems',
    category: 'moisture',
    icon: '🍂',
    visualSign: 'Lower, older leaves fade to yellow while remaining damp or soft to the touch.',
    likelyCauses: [
      'Chronic overwatering suffocating root hair zones',
      'Poor drainage causing waterlogged anaerobic pot soil',
      'Nitrogen deficiency if soil is depleted after months without food',
    ],
    immediateFirstAid: [
      'Halt all watering immediately and check moisture 2 inches down with your finger',
      'Ensure the nursery pot has free drainage holes at the base',
      'Gently unpot and inspect roots: white/firm is healthy, brown/mushy is root rot',
    ],
    organicTreatment: 'Prune away rotting roots with sterilized shears, dust roots with cinnamon or activated charcoal, repot in fresh airy aroid mix with 30% perlite.',
    preventionTip: 'Water only when the top 50% of the soil has dried completely.',
  },
  {
    id: 'brown_crispy_tips',
    title: 'Brown, Dry & Crispy Leaf Tips',
    subtitle: 'Edges crunchy, papery, or curling inwards',
    category: 'moisture',
    icon: '🔥',
    visualSign: 'Crispy brown margins on leaf margins, particularly furthest from the stem.',
    likelyCauses: [
      'Low ambient relative humidity (below 40% in winter heating or AC)',
      'Tap water minerals, chlorine, chloramines, or fluoride buildup in leaf margins',
      'Soil allowed to dry out into a hydrophobic dry block',
    ],
    immediateFirstAid: [
      'Switch from municipal tap water to filtered, rainwater, or distilled water',
      'Group plants together or place on a pebble tray filled with water to raise micro-humidity',
      'Trim only the dead brown margin leaving a tiny sliver of brown to avoid fresh wound shock',
    ],
    organicTreatment: 'Bottom-soak the nursery pot in room-temperature filtered water for 30 minutes until bubbling stops.',
    preventionTip: 'Run an ultrasonic cool mist humidifier nearby during dry months.',
  },
  {
    id: 'spider_mites',
    title: 'Spider Mites & Fine Silken Webbing',
    subtitle: 'Dusty leaf undersides with tiny yellow stippling dots',
    category: 'pest',
    icon: '🕷️',
    visualSign: 'Tiny microscopic red/brown specks crawling beneath leaves, delicate silk webbing in stem crotches.',
    likelyCauses: [
      'Dry, warm indoor air providing ideal rapid breeding conditions',
      'Plant stress or lack of regular foliage rinsing',
    ],
    immediateFirstAid: [
      'ISOLATE the affected plant immediately from all other houseplants',
      'Carry the plant to the shower and vigorously blast leaf undersides with lukewarm water',
    ],
    organicTreatment: 'Spray every 3 days with a mixture of cold-pressed pure neem oil, mild castile soap, and water, coating leaf undersides and stem joints.',
    preventionTip: 'Maintain humidity above 55% as spider mites thrive primarily in arid environments.',
  },
  {
    id: 'powdery_mildew',
    title: 'Powdery Mildew & Fungal Blight',
    subtitle: 'Flour-like white spots or dusting on upper leaf surface',
    category: 'fungal',
    icon: '🍄',
    visualSign: 'Powdery white talc-like patches that spread across foliage, causing leaves to curl and drop.',
    likelyCauses: [
      'Stagnant humid air with poor air circulation',
      'Overhead watering wetting leaves in low light conditions',
    ],
    immediateFirstAid: [
      'Prune off heavily infected leaves and discard in trash (do not compost!)',
      'Improve ventilation by adding a gentle oscillating room fan',
    ],
    organicTreatment: 'Spray with potassium bicarbonate or dilute baking soda solution (1 tsp baking soda + 1/2 tsp dish soap in 1 quart water) once a week.',
    preventionTip: 'Always water at the soil level, never splash water onto leaves in the evening.',
  },
  {
    id: 'etiolation_leggy',
    title: 'Leggy, Stretched & Pale Growth',
    subtitle: 'Long gaps between leaf nodes, plant leaning toward light',
    category: 'light',
    icon: '☀️',
    visualSign: 'Weak, spindly stems reaching sideways with smaller, paler foliage than normal.',
    likelyCauses: [
      'Light starvation (etiolation) due to placement too far from windows',
      'Window glass blocking critical photosynthetically active radiation (PAR)',
    ],
    immediateFirstAid: [
      'Relocate the plant incrementally closer to bright indirect light over 4 days',
      'Rotate the pot a quarter turn each week for even symmetrical growth',
    ],
    organicTreatment: 'Prune the leggy top growth to stimulate dormant auxiliary buds into bushier branching.',
    preventionTip: 'Supplement with a full-spectrum LED grow light set on a 12-hour timer during winter.',
  },
  {
    id: 'mealybugs',
    title: 'Mealybugs (White Cottony Tufts)',
    subtitle: 'White fluffy wax clusters hiding in leaf axils and crevices',
    category: 'pest',
    icon: '🐛',
    visualSign: 'Sticky sweet sap (honeydew) on foliage followed by fuzzy white cotton-like insect colonies.',
    likelyCauses: [
      'Introduced from a newly purchased nursery plant or contaminated potting soil',
      'Over-fertilizing with excess nitrogen producing soft, succulent growth',
    ],
    immediateFirstAid: [
      'Dip a cotton swab in 70% isopropyl rubbing alcohol and dab directly onto every visible mealybug to dissolve their waxy protective coating',
      'Isolate from other plants to avoid spread',
    ],
    organicTreatment: 'Thoroughly drench the entire plant with insecticidal soap or horticultural oil weekly for 3 consecutive weeks.',
    preventionTip: 'Quarantine every new plant for 14 days before introducing it to your general plant collection.',
  },
];

export const SymptomChecker: React.FC<SymptomCheckerProps> = ({
  onConsultSymptom,
  onGoToScanner,
}) => {
  const [selectedAilment, setSelectedAilment] = useState<CommonAilment | null>(COMMON_AILMENTS[0]);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAilments = COMMON_AILMENTS.filter((a) =>
    a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.visualSign.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
          <Stethoscope className="w-3.5 h-3.5 text-emerald-600" />
          <span>Botanical Triage &amp; Pathology Guide</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif-plant font-bold text-emerald-950">
          Plant Doctor Symptom Explorer
        </h1>
        <p className="text-sm sm:text-base text-stone-600">
          Select what you observe on your plant leaves, stems, or soil to get immediate first aid,
          root cause analysis, and organic remedies.
        </p>
      </div>

      {/* Search & Camera Banner */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-emerald-100 shadow-xs">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search symptoms (e.g. yellow, webs, tips, bugs)..."
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-stone-200 bg-stone-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
          />
        </div>

        <button
          onClick={onGoToScanner}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold shadow-xs"
        >
          <span>Have a photo? Use AI Vision Scan instead</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Main Grid: Sidebar list + Detail view */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Symptoms List */}
        <div className="lg:col-span-5 space-y-3">
          {filteredAilments.map((ailment) => {
            const isSelected = selectedAilment?.id === ailment.id;
            return (
              <div
                key={ailment.id}
                onClick={() => setSelectedAilment(ailment)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer text-left ${
                  isSelected
                    ? 'bg-emerald-900 text-white border-emerald-800 shadow-md scale-[1.01]'
                    : 'bg-white hover:bg-stone-50 text-stone-800 border-stone-200 hover:border-emerald-300'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl shrink-0 p-1 bg-black/10 rounded-xl">
                    {ailment.icon}
                  </span>
                  <div className="space-y-0.5 flex-1 min-w-0">
                    <h3 className={`text-sm font-bold truncate ${isSelected ? 'text-white' : 'text-stone-900'}`}>
                      {ailment.title}
                    </h3>
                    <p className={`text-xs truncate ${isSelected ? 'text-emerald-200' : 'text-stone-500'}`}>
                      {ailment.subtitle}
                    </p>
                  </div>
                  <ChevronRight className={`w-4 h-4 shrink-0 mt-1 ${isSelected ? 'text-emerald-300' : 'text-stone-400'}`} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Symptom Detailed Treatment Panel */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-emerald-100 p-6 sm:p-8 shadow-xl shadow-emerald-950/5 space-y-6">
          {selectedAilment ? (
            <>
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
                <div className="flex items-center gap-3">
                  <span className="text-3xl p-2 bg-emerald-50 rounded-2xl">
                    {selectedAilment.icon}
                  </span>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
                      Category: {selectedAilment.category}
                    </span>
                    <h2 className="text-xl sm:text-2xl font-serif-plant font-bold text-stone-900">
                      {selectedAilment.title}
                    </h2>
                  </div>
                </div>

                <button
                  onClick={() => onConsultSymptom(`My plant has ${selectedAilment.title}. Symptoms: ${selectedAilment.visualSign}. How should I nurse it back to health step by step?`)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-800 hover:bg-teal-900 text-white text-xs font-semibold shadow-xs"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Ask FloraBot</span>
                </button>
              </div>

              {/* Visual Sign */}
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-amber-950 space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-800">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Visual Identification:</span>
                </div>
                <p className="text-xs sm:text-sm leading-relaxed">{selectedAilment.visualSign}</p>
              </div>

              {/* Likely Causes */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                  Underlying Root Causes:
                </h4>
                <ul className="space-y-1.5">
                  {selectedAilment.likelyCauses.map((cause, idx) => (
                    <li key={idx} className="text-xs sm:text-sm text-stone-700 flex items-start gap-2">
                      <span className="text-emerald-700 font-bold shrink-0">•</span>
                      <span>{cause}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Immediate First Aid */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                  Immediate Emergency Triage:
                </h4>
                <div className="space-y-2">
                  {selectedAilment.immediateFirstAid.map((step, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-stone-50 border border-stone-100 flex items-start gap-2.5 text-xs sm:text-sm text-stone-800">
                      <span className="w-5 h-5 rounded-full bg-emerald-800 text-white text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Organic Treatment */}
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100 text-emerald-950 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Organic Remediation &amp; Treatment:</span>
                </div>
                <p className="text-xs sm:text-sm leading-relaxed">{selectedAilment.organicTreatment}</p>
              </div>

              {/* Prevention Tip */}
              <div className="pt-2 border-t border-stone-100 text-xs text-stone-500 flex items-center gap-2">
                <span className="font-bold text-stone-700">Long-term Prevention:</span>
                <span>{selectedAilment.preventionTip}</span>
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-stone-400">
              Select a symptom from the list to view diagnosis and treatment.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
