import React, { useState, useRef } from 'react';
import { Upload, Camera, Sparkles, Image as ImageIcon, AlertCircle, RefreshCw, Cpu, HelpCircle } from 'lucide-react';
import { SAMPLE_PLANTS, SamplePlant } from '../data/samplePlants';

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

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

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
      // Fetch the sample image and convert to base64
      const response = await fetch(sample.imageUrl);
      const blob = await response.blob();
      setMimeType(blob.type || 'image/jpeg');

      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(blob);
    } catch {
      // Fallback: set the image directly
      setSelectedImage(sample.imageUrl);
      setMimeType('image/jpeg');
    }
  };

  const handleSubmit = () => {
    if (!selectedImage) {
      setErrorMsg('Please upload an image or choose one of our sample plants first.');
      return;
    }
    setErrorMsg(null);
    onAnalyze(selectedImage, mimeType, userNotes, preferredModel);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* Intro hero banner */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs sm:text-sm font-medium">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <span>Multimodal Plant Vision powered by Gemini 4 Argon</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-serif-plant font-bold text-emerald-950 tracking-tight">
          Identify Any Plant &amp; Diagnose Its Health
        </h1>
        <p className="max-w-2xl mx-auto text-base sm:text-lg text-stone-600 font-normal leading-relaxed">
          Snap or upload a photo of your indoor houseplant, garden flower, or vegetable crop.
          Receive an instant botanical taxonomy, visual health diagnosis, and tailor-made care schedule.
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
            <input
              type="file"
              ref={cameraInputRef}
              accept="image/*"
              capture="environment"
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
                  Supports JPG, PNG, WEBP, HEIC up to 20MB
                </p>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    cameraInputRef.current?.click();
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-stone-200 text-stone-700 hover:bg-stone-50 text-xs sm:text-sm font-semibold shadow-xs"
                >
                  <Camera className="w-4 h-4 text-emerald-600" />
                  Take Photo
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-800 text-white hover:bg-emerald-900 text-xs sm:text-sm font-semibold shadow-xs"
                >
                  <ImageIcon className="w-4 h-4" />
                  Select Image
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
              <div className="absolute inset-0 bg-emerald-950/65 backdrop-blur-xs flex flex-col items-center justify-center text-white p-6 text-center">
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

        {/* Optional User Notes / Symptoms */}
        <div className="space-y-2">
          <label className="flex items-center justify-between text-sm font-semibold text-stone-800">
            <span className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-emerald-600" />
              Optional: Notes or Observed Symptoms
            </span>
            <span className="text-xs text-stone-400 font-normal">Helps Gemini diagnose accurately</span>
          </label>
          <input
            type="text"
            value={userNotes}
            onChange={(e) => setUserNotes(e.target.value)}
            disabled={isLoading}
            placeholder="e.g. Lower leaves turning yellow, noticed tiny brown dots, indoor plant under north window..."
            className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-stone-50/50 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all placeholder:text-stone-400"
          />
        </div>

        {/* Model preference selector & Analyze button */}
        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-stone-100">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-emerald-700" />
            <span className="text-xs font-semibold text-stone-600">Vision Model:</span>
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
          <h3 className="text-sm font-bold uppercase tracking-wider text-stone-500">
            Or try with sample botanical specimens
          </h3>
          <span className="text-xs text-stone-400">Click any plant to load instantly</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {SAMPLE_PLANTS.map((sample) => (
            <div
              key={sample.id}
              onClick={() => handleSelectSample(sample)}
              className="group relative cursor-pointer rounded-2xl overflow-hidden border border-stone-200 hover:border-emerald-500 bg-white shadow-xs hover:shadow-md transition-all text-left flex flex-col"
            >
              <div className="h-28 w-full overflow-hidden bg-stone-100">
                <img
                  src={sample.imageUrl}
                  alt={sample.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-2.5 space-y-0.5">
                <p className="text-xs font-bold text-stone-900 truncate">{sample.name}</p>
                <p className="text-[10px] text-emerald-700 font-medium truncate">{sample.category}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
