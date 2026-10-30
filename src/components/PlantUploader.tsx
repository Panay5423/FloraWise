import React, { useState, useRef } from 'react';
import {
  Upload,
  Camera,
  Sparkles,
  Image as ImageIcon,
  AlertCircle,
  RefreshCw,
  Cpu,
  Mic,
  MicOff,
  Plus
} from 'lucide-react';
import { SAMPLE_PLANTS, SamplePlant } from '../data/samplePlants';
import { LiveCameraModal } from './LiveCameraModal';

interface PlantUploaderProps {
  onAnalyze: (imageBase64: string, mimeType: string, userNotes: string, model: string) => void;
  isLoading: boolean;
  loadingStep: string;
}

export const PlantUploader: React.FC<PlantUploaderProps> = ({
  onAnalyze,
  isLoading,
  loadingStep,
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('image/jpeg');
  const [userNotes, setUserNotes] = useState<string>('');
  const [preferredModel, setPreferredModel] = useState<string>('gemini-4-argon');
  const [isDragOver, setIsDragOver] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    setErrorMsg(null);
    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please select a valid image file (JPEG, PNG, WEBP).');
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      setErrorMsg('Image is too large. Please select an image under 20MB.');
      return;
    }

    setMimeType(file.type);
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setSelectedImage(result);
    };
    reader.onerror = () => {
      setErrorMsg('Failed to read image file.');
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleSelectSample = async (sample: SamplePlant) => {
    setErrorMsg(null);
    setUserNotes(sample.commonAilmentPrompt);

    try {
      const response = await fetch(sample.imageUrl);
      const blob = await response.blob();
      setMimeType(blob.type || 'image/jpeg');

      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(blob);
    } catch {
      setSelectedImage(sample.imageUrl);
      setMimeType('image/jpeg');
    }
  };

  // Web Speech API for voice dictation of symptoms
  const toggleSpeechRecognition = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. You can type notes directly.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US'; // Also picks up English/Hinglish speech

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setUserNotes((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      console.warn('Speech recognition error:', err);
      setIsListening(false);
    }
  };

  const quickSymptomTags = [
    'Yellowing leaves (Chlorosis)',
    'Crispy brown tips',
    'Drooping & wilted stem',
    'White fuzzy bugs (Mealybugs)',
    'Powdery mildew spots',
    'Curled leaves',
    'Indoor low light',
  ];

  const addSymptomTag = (tag: string) => {
    setUserNotes((prev) => {
      if (!prev) return tag;
      if (prev.includes(tag)) return prev;
      return `${prev}, ${tag}`;
    });
  };

  const handleSubmit = () => {
    if (!selectedImage) {
      setErrorMsg('Please upload an image, snap a photo, or choose one of our sample plants first.');
      return;
    }
    setErrorMsg(null);
    onAnalyze(selectedImage, mimeType, userNotes, preferredModel);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* Live camera modal */}
      <LiveCameraModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={(base64) => {
          setSelectedImage(base64);
          setMimeType('image/jpeg');
        }}
      />

      {/* Intro hero banner */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs sm:text-sm font-semibold shadow-2xs">
          <Sparkles className="w-4 h-4 text-emerald-600 animate-spin" />
          <span>Multimodal Plant Vision powered by Gemini 4 Argon</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-serif-plant font-bold text-emerald-950 tracking-tight">
          Identify Any Plant &amp; Diagnose Its Health
        </h1>
        <p className="max-w-2xl mx-auto text-base sm:text-lg text-stone-600 font-normal leading-relaxed">
          Snap or upload a photo of your indoor houseplant, garden flower, or home herb.
          Get an instant botanical taxonomy, visual health diagnosis, and customized care blueprint.
        </p>
      </div>

      {/* Main Upload Box */}
      <div className="bg-white rounded-3xl border border-emerald-100 shadow-xl shadow-emerald-900/5 p-6 sm:p-8 space-y-6">
        {/* Upload Zone */}
        {!selectedImage ? (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center transition-all cursor-pointer ${
              isDragOver
                ? 'border-emerald-600 bg-emerald-50/70 scale-[0.99]'
                : 'border-emerald-200 hover:border-emerald-500 bg-stone-50/50 hover:bg-emerald-50/30'
            }`}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.[0]) handleFile(e.target.files[0]);
              }}
            />

            <div className="max-w-md mx-auto space-y-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-inner">
                <Upload className="w-8 h-8 sm:w-10 sm:h-10" />
              </div>

              <div>
                <p className="text-base sm:text-lg font-semibold text-stone-800">
                  Drop your plant photo here, or <span className="text-emerald-700 underline underline-offset-2">browse files</span>
                </p>
                <p className="text-xs sm:text-sm text-stone-500 mt-1">
                  Supports JPG, PNG, WEBP up to 20MB
                </p>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsCameraOpen(true);
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-stone-200 text-stone-700 hover:bg-emerald-50 hover:border-emerald-300 text-xs sm:text-sm font-semibold shadow-xs transition-all"
                >
                  <Camera className="w-4 h-4 text-emerald-600" />
                  Live Camera Scanner
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-800 text-white hover:bg-emerald-900 text-xs sm:text-sm font-semibold shadow-xs transition-all"
                >
                  <ImageIcon className="w-4 h-4" />
                  Choose Image
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Preview Zone */
          <div className="relative rounded-2xl overflow-hidden border border-emerald-200 bg-stone-900 group">
            <div className="h-72 sm:h-96 w-full flex items-center justify-center overflow-hidden">
              <img
                src={selectedImage}
                alt="Selected plant"
                className="max-h-full max-w-full object-contain"
              />
            </div>

            {/* Change / Re-upload button */}
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedImage(null);
                  setErrorMsg(null);
                }}
                disabled={isLoading}
                className="px-3.5 py-1.5 rounded-xl bg-stone-900/80 hover:bg-stone-900 text-white text-xs font-semibold backdrop-blur-md border border-white/20 transition-all flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Change Photo
              </button>
            </div>

            {/* Visual scan overlay during loading */}
            {isLoading && (
              <div className="absolute inset-0 bg-emerald-950/75 backdrop-blur-xs flex flex-col items-center justify-center text-white p-6 text-center">
                <div className="relative mb-4">
                  <div className="w-16 h-16 rounded-full border-4 border-emerald-400/30 border-t-emerald-400 animate-spin" />
                  <Sparkles className="w-6 h-6 text-emerald-300 absolute inset-0 m-auto animate-pulse" />
                </div>
                <h4 className="text-xl font-bold font-serif-plant mb-1 tracking-wide">
                  Analyzing Botanical Specimen
                </h4>
                <p className="text-sm text-emerald-200 max-w-sm animate-pulse">
                  {loadingStep || 'Inspecting leaf structure, pigmentation, and taxonomy...'}
                </p>
              </div>
            )}
          </div>
        )}

        {/* User Notes / Symptoms & Voice input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-stone-800 flex items-center gap-2">
              <span>Observed Symptoms or Care Questions</span>
              <span className="text-xs text-stone-400 font-normal">(Optional)</span>
            </label>
            <button
              type="button"
              onClick={toggleSpeechRecognition}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                isListening
                  ? 'bg-rose-100 text-rose-700 animate-pulse'
                  : 'bg-stone-100 text-stone-600 hover:bg-emerald-50 hover:text-emerald-800'
              }`}
              title="Voice Dictate Symptoms"
            >
              {isListening ? (
                <>
                  <MicOff className="w-3.5 h-3.5 text-rose-600" />
                  <span>Listening...</span>
                </>
              ) : (
                <>
                  <Mic className="w-3.5 h-3.5" />
                  <span>Voice Note</span>
                </>
              )}
            </button>
          </div>

          <input
            type="text"
            value={userNotes}
            onChange={(e) => setUserNotes(e.target.value)}
            disabled={isLoading}
            placeholder="e.g. Leaves turning yellow, noticed tiny brown dots, indoors near east window..."
            className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-stone-50/50 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all placeholder:text-stone-400"
          />

          {/* Quick symptom tags */}
          <div className="flex items-center gap-1.5 flex-wrap pt-1">
            <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider mr-1">
              Add symptom:
            </span>
            {quickSymptomTags.map((tag, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => addSymptomTag(tag)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-emerald-100/70 text-stone-600 hover:text-emerald-900 text-xs font-medium transition-all"
              >
                <Plus className="w-3 h-3 text-emerald-600" />
                <span>{tag}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Model preference selector & Analyze button */}
        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-stone-100">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-emerald-700" />
            <span className="text-xs font-semibold text-stone-600">Vision Engine:</span>
            <select
              value={preferredModel}
              onChange={(e) => setPreferredModel(e.target.value)}
              disabled={isLoading}
              className="text-xs font-semibold bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-600"
            >
              <option value="gemini-4-argon">Gemini 4 Argon (Deep Vision &amp; Diagnosis)</option>
              <option value="gemini-3.8-flash">Gemini 3.8 Flash (High Speed Vision)</option>
            </select>
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading || !selectedImage}
            className={`w-full sm:w-auto px-8 py-3.5 rounded-2xl font-semibold text-sm transition-all shadow-md flex items-center justify-center gap-2.5 ${
              isLoading || !selectedImage
                ? 'bg-stone-200 text-stone-400 cursor-not-allowed shadow-none'
                : 'bg-emerald-800 hover:bg-emerald-900 text-white shadow-emerald-800/25 hover:shadow-lg active:scale-98'
            }`}
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Diagnosing Specimen...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-emerald-300" />
                <span>Identify &amp; Get Care Guide</span>
              </>
            )}
          </button>
        </div>

        {errorMsg && (
          <div className="flex items-center gap-2 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm">
            <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      {/* Quick sample plants gallery for instant 1-click test */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-stone-500">
            Or try with curated botanical specimens
          </h3>
          <span className="text-xs text-stone-400">Click any plant to load instantly</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2.5 sm:gap-3">
          {SAMPLE_PLANTS.map((sample) => (
            <div
              key={sample.id}
              onClick={() => handleSelectSample(sample)}
              className="group relative cursor-pointer rounded-2xl overflow-hidden border border-stone-200 hover:border-emerald-500 bg-white shadow-2xs hover:shadow-md transition-all text-left flex flex-col"
            >
              <div className="h-24 w-full overflow-hidden bg-stone-100">
                <img
                  src={sample.imageUrl}
                  alt={sample.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-2 space-y-0.5">
                <p className="text-xs font-bold text-stone-900 truncate">{sample.name}</p>
                {sample.hindiName && (
                  <p className="text-[10px] text-emerald-800 font-semibold truncate">{sample.hindiName}</p>
                )}
                <p className="text-[9px] text-stone-400 font-medium truncate">{sample.category}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
