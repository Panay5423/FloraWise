import React, { useRef, useEffect, useState } from 'react';
import { Camera, X, RefreshCw, Sparkles, SwitchCamera, AlertCircle } from 'lucide-react';

interface LiveCameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (base64Image: string) => void;
}

export const LiveCameraModal: React.FC<LiveCameraModalProps> = ({
  isOpen,
  onClose,
  onCapture,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isFlash, setIsFlash] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      return;
    }

    startCamera();

    return () => {
      stopCamera();
    };
  }, [isOpen, facingMode]);

  const startCamera = async () => {
    setErrorMsg(null);
    stopCamera();

    try {
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play();
      }
    } catch (err: any) {
      console.warn('Camera access error:', err);
      setErrorMsg(
        'Could not access your camera. Please ensure camera permissions are allowed in your browser settings.'
      );
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const handleCapture = () => {
    if (!videoRef.current) return;

    // Trigger visual flash
    setIsFlash(true);
    setTimeout(() => setIsFlash(false), 200);

    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // If using user-facing camera, mirror the image horizontally
    if (facingMode === 'user') {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const base64 = canvas.toDataURL('image/jpeg', 0.92);

    stopCamera();
    onCapture(base64);
    onClose();
  };

  const toggleCamera = () => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-between p-4 sm:p-6 animate-fadeIn">
      {/* Top Bar */}
      <div className="w-full max-w-2xl flex items-center justify-between text-white z-10 pt-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center">
            <Camera className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-sm">Botanical Live Scanner</h3>
            <p className="text-[11px] text-emerald-300">Align plant leaves inside the viewfinder</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleCamera}
            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all"
            title="Switch Camera (Front/Back)"
          >
            <SwitchCamera className="w-5 h-5" />
          </button>
          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all"
            title="Close Camera"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Viewfinder Frame */}
      <div className="relative w-full max-w-2xl flex-1 my-4 rounded-3xl overflow-hidden bg-stone-950 flex items-center justify-center border border-emerald-500/30 shadow-2xl">
        {/* Flash effect overlay */}
        {isFlash && <div className="absolute inset-0 bg-white z-30 transition-opacity" />}

        {errorMsg ? (
          <div className="p-6 text-center text-rose-200 max-w-sm space-y-3 z-10">
            <AlertCircle className="w-10 h-10 mx-auto text-rose-400" />
            <p className="text-sm font-semibold">{errorMsg}</p>
            <button
              onClick={startCamera}
              className="px-4 py-2 rounded-xl bg-white text-stone-900 font-bold text-xs hover:bg-stone-100"
            >
              Retry Camera
            </button>
          </div>
        ) : (
          <video
            ref={videoRef}
            playsInline
            muted
            className={`w-full h-full object-cover ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
          />
        )}

        {/* Botanical Scanning HUD Overlays */}
        {!errorMsg && (
          <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center p-8">
            {/* Target Reticle */}
            <div className="w-64 h-64 sm:w-80 sm:h-80 border-2 border-emerald-400/50 rounded-3xl relative flex items-center justify-center">
              {/* Corner brackets */}
              <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-emerald-400 rounded-tl-xl" />
              <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-emerald-400 rounded-tr-xl" />
              <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-emerald-400 rounded-bl-xl" />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-emerald-400 rounded-br-xl" />

              {/* Scanning animated laser bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_12px_#34d399] animate-pulse" />

              <div className="text-center space-y-1">
                <Sparkles className="w-6 h-6 text-emerald-300 mx-auto opacity-70 animate-spin" />
                <span className="text-[11px] font-semibold tracking-wider uppercase text-emerald-200/80 bg-black/40 px-2 py-0.5 rounded-md backdrop-blur-xs">
                  Place leaf or stem here
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Shutter Controls */}
      <div className="w-full max-w-2xl flex items-center justify-center gap-6 pb-2 z-10">
        <button
          onClick={handleCapture}
          disabled={!stream || !!errorMsg}
          className={`w-20 h-20 rounded-full border-4 border-white flex items-center justify-center shadow-xl transition-all ${
            !stream || errorMsg
              ? 'opacity-40 cursor-not-allowed'
              : 'hover:scale-105 active:scale-95 bg-emerald-600 hover:bg-emerald-500'
          }`}
          title="Take Photo"
        >
          <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center">
            <Camera className="w-6 h-6 text-emerald-900" />
          </div>
        </button>
      </div>
    </div>
  );
};
