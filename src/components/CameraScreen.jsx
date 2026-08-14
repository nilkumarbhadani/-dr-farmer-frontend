import React, { useState, useRef, useEffect } from 'react';
import { 
  Camera, 
  FlipHorizontal, 
  Zap, 
  Image as ImageIcon, 
  ArrowLeft, 
  Sparkles, 
  Volume2, 
  Sprout, 
  ScanLine
} from 'lucide-react';
import { TRANSLATIONS } from '../data/translations';

export default function CameraScreen({ 
  initialMode = 'crop', 
  lang, 
  onBack, 
  onCapture,
  onSpeakText 
}) {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;
  const [mode, setMode] = useState(initialMode); // 'crop' | 'cattle'
  const [flashOn, setFlashOn] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [liveStreamActive, setLiveStreamActive] = useState(false);
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  // Audio instruction readout
  const handleReadInstruction = () => {
    const speech = lang === 'hi'
      ? "कैमरे को बीमारी वाली पत्ती या पशु के अंग पर रखें और नीचे दिए गए बड़े सफेद गोल बटन को दबाएं।"
      : "Point camera at the problem area on crop or animal, then tap the large white button to diagnose.";
    onSpeakText(speech);
  };

  // Try activating real camera stream
  const startLiveCamera = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' }
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setLiveStreamActive(true);
        }
      }
    } catch (err) {
      console.log("Camera access not available or denied.", err);
      setLiveStreamActive(false);
    }
  };

  const stopLiveCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setLiveStreamActive(false);
  };

  useEffect(() => {
    // Auto-start camera on mount
    startLiveCamera();
    return () => {
      stopLiveCamera();
    };
  }, []);

  /**
   * Capture a frame from the live video feed as a File object.
   * Returns null if video is not active.
   */
  const captureFrameFromVideo = () => {
    if (!videoRef.current || !liveStreamActive) return null;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!canvas) return null;

    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], `capture_${Date.now()}.jpg`, { type: 'image/jpeg' });
          resolve(file);
        } else {
          resolve(null);
        }
      }, 'image/jpeg', 0.9);
    });
  };

  /**
   * Main capture handler.
   * Captures image from live video or falls back to prompting gallery upload.
   * Calls onCapture(imageFile, mode) which the parent handles (API call).
   */
  const handleCapture = async () => {
    if (isScanning) return;

    setIsScanning(true);

    // Speak analyzing message
    if (lang === 'hi') {
      onSpeakText("जांच की जा रही है, कृपया प्रतीक्षा करें...");
    } else {
      onSpeakText("Analyzing disease symptoms, please wait...");
    }

    let imageFile = null;

    if (liveStreamActive) {
      imageFile = await captureFrameFromVideo();
    }

    if (!imageFile) {
      // No live camera — prompt user to upload from gallery
      setIsScanning(false);
      fileInputRef.current?.click();
      return;
    }

    // Call the parent's onCapture handler (which will call the ML API)
    try {
      await onCapture(imageFile, mode);
    } catch (err) {
      console.error("Capture/diagnosis error:", err);
    } finally {
      setIsScanning(false);
    }
  };

  /**
   * Handle image file selected from gallery.
   * Calls onCapture(imageFile, mode) — same flow as live capture.
   */
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsScanning(true);

    if (lang === 'hi') {
      onSpeakText("जांच की जा रही है, कृपया प्रतीक्षा करें...");
    } else {
      onSpeakText("Analyzing disease symptoms, please wait...");
    }

    try {
      await onCapture(file, mode);
    } catch (err) {
      console.error("Upload/diagnosis error:", err);
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col justify-between max-w-md mx-auto overflow-hidden">
      
      {/* Hidden canvas for frame capture */}
      <canvas ref={canvasRef} className="hidden" />

      {/* 1. TOP BAR OVERLAY: Mode Selector & Instructions */}
      <div className="relative z-20 pt-3 px-4 pb-2 bg-gradient-to-b from-black/80 via-black/50 to-transparent">
        
        {/* Navigation & Mode Toggle */}
        <div className="flex items-center justify-between mb-3">
          <button 
            onClick={() => {
              stopLiveCamera();
              onBack();
            }}
            className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center text-white active:scale-95 transition-transform"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          {/* Mode Pill Switcher */}
          <div className="flex bg-neutral-900/80 backdrop-blur-md p-1 rounded-full border border-white/20">
            <button
              onClick={() => setMode('crop')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                mode === 'crop'
                  ? 'bg-[#2e7d32] text-white shadow-sm'
                  : 'text-neutral-300 hover:text-white'
              }`}
            >
              <Sprout className="w-3.5 h-3.5" />
              <span>{t.camera.cropMode}</span>
            </button>
            <button
              onClick={() => setMode('cattle')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                mode === 'cattle'
                  ? 'bg-[#c2410c] text-white shadow-sm'
                  : 'text-neutral-300 hover:text-white'
              }`}
            >
              <span>🐄</span>
              <span>{t.camera.cattleMode}</span>
            </button>
          </div>

          {/* Flash Toggle */}
          <button 
            onClick={() => setFlashOn(!flashOn)}
            className={`w-10 h-10 rounded-full backdrop-blur-md border flex items-center justify-center transition-all ${
              flashOn 
                ? 'bg-amber-400 text-neutral-950 border-amber-300 shadow-md shadow-amber-400/30' 
                : 'bg-black/40 text-white border-white/20'
            }`}
          >
            <Zap className="w-5 h-5" />
          </button>
        </div>

        {/* Big Instruction Text with Audio Guidance */}
        <div className="bg-black/60 backdrop-blur-md rounded-2xl p-2.5 border border-white/15 flex items-center justify-between">
          <div className="flex items-center space-x-2 pl-1">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <p className="text-white text-xs font-semibold tracking-wide">
              {t.camera.instruction}
            </p>
          </div>
          <button 
            onClick={handleReadInstruction}
            className="p-1.5 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors"
            title="Read instruction aloud"
          >
            <Volume2 className="w-4 h-4 text-emerald-300" />
          </button>
        </div>

      </div>

      {/* 2. CAMERA PREVIEW VIEWPORT */}
      <div className="relative flex-1 w-full bg-neutral-950 flex items-center justify-center overflow-hidden">
        
        {/* Live Camera Video stream */}
        {liveStreamActive ? (
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            className="w-full h-full object-cover"
          />
        ) : (
          /* Placeholder when camera is not active */
          <div className="relative w-full h-full flex flex-col items-center justify-center bg-neutral-900">
            <div className="text-center p-6">
              <Camera className="w-16 h-16 text-neutral-600 mx-auto mb-4" />
              <p className="text-neutral-400 text-sm font-semibold mb-1">
                {lang === 'hi' ? 'कैमरा सक्रिय नहीं है' : 'Camera not active'}
              </p>
              <p className="text-neutral-500 text-xs">
                {lang === 'hi' 
                  ? 'नीचे गैलरी बटन से फोटो चुनें या WebCam चालू करें' 
                  : 'Tap Gallery to upload a photo or enable WebCam'}
              </p>
            </div>
            {/* Flash simulation overlay */}
            {flashOn && (
              <div className="absolute inset-0 bg-white/20 pointer-events-none mix-blend-screen" />
            )}
          </div>
        )}

        {/* Viewfinder Target Reticle */}
        <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 aspect-square rounded-3xl border-2 border-dashed border-white/60 pointer-events-none flex flex-col justify-between p-4 shadow-[0_0_0_9999px_rgba(0,0,0,0.45)]">
          {/* Corner brackets */}
          <div className="flex justify-between">
            <div className="w-6 h-6 border-t-4 border-l-4 border-emerald-400 rounded-tl-lg" />
            <div className="w-6 h-6 border-t-4 border-r-4 border-emerald-400 rounded-tr-lg" />
          </div>

          {/* Center Target Marker */}
          <div className="self-center flex flex-col items-center">
            <div className="w-8 h-8 rounded-full border border-emerald-400/80 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-emerald-400" />
            </div>
            <span className="text-[11px] font-bold text-white/90 bg-black/60 px-2 py-0.5 rounded-full mt-2 backdrop-blur-sm">
              {mode === 'crop' 
                ? (lang === 'hi' ? 'पत्ती फोकस' : 'Leaf Focus') 
                : (lang === 'hi' ? 'पशु फोकस' : 'Livestock Focus')}
            </span>
          </div>

          <div className="flex justify-between">
            <div className="w-6 h-6 border-b-4 border-l-4 border-emerald-400 rounded-bl-lg" />
            <div className="w-6 h-6 border-b-4 border-r-4 border-emerald-400 rounded-br-lg" />
          </div>

          {/* Animated Laser Scanning Beam */}
          <div className="absolute inset-x-2 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#10b981] animate-scan-beam" />
        </div>

        {/* Scanning AI Banner if currently processing */}
        {isScanning && (
          <div className="absolute inset-0 bg-black/75 backdrop-blur-sm z-30 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-20 h-20 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin flex items-center justify-center mb-4">
              <Sparkles className="w-8 h-8 text-emerald-400 animate-pulse" />
            </div>
            <p className="text-xl font-bold text-white tracking-wide">
              {t.camera.analyzing}
            </p>
            <p className="text-xs text-neutral-300 mt-1 max-w-[240px]">
              {lang === 'hi' ? 'लक्षणों की पहचान व उपचार निकाला जा रहा है...' : 'Matching symptom database & calculating remedies...'}
            </p>
          </div>
        )}

      </div>

      {/* 3. BOTTOM CONTROLS */}
      <div className="relative z-20 bg-gradient-to-t from-black via-black/90 to-transparent pt-6 pb-8 px-4">
        
        {/* Mode indicator label */}
        <div className="flex items-center justify-center mb-4">
          <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider flex items-center space-x-1.5">
            <span className={`w-2 h-2 rounded-full ${mode === 'crop' ? 'bg-emerald-400' : 'bg-orange-400'}`} />
            <span>
              {mode === 'crop' 
                ? (lang === 'hi' ? 'फसल / पत्ती स्कैन मोड' : 'Crop / Leaf Scan Mode')
                : (lang === 'hi' ? 'पशु स्कैन मोड' : 'Cattle / Livestock Scan Mode')}
            </span>
          </span>
        </div>

        {/* Capture Action Controls */}
        <div className="flex items-center justify-around px-2">
          
          {/* Gallery / File Upload Button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center justify-center w-14 h-14 rounded-2xl bg-neutral-900/90 border border-white/20 text-white hover:bg-neutral-800 active:scale-95 transition-all"
            title="Upload from gallery"
          >
            <ImageIcon className="w-6 h-6 text-neutral-300" />
            <span className="text-[9px] font-semibold text-neutral-400 mt-0.5">
              {lang === 'hi' ? 'गैलरी' : 'Gallery'}
            </span>
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            accept="image/*" 
            className="hidden" 
          />

          {/* MAIN BIG CIRCULAR CAPTURE BUTTON (Hero Touch Target) */}
          <button
            onClick={handleCapture}
            disabled={isScanning}
            className="relative group p-1.5 rounded-full bg-white/20 active:scale-95 transition-transform"
            aria-label="Capture Photo"
          >
            {/* Outer ring pulsing */}
            <div className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center bg-white shadow-xl shadow-white/20 group-hover:scale-105 transition-transform">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-emerald-700 to-emerald-500 flex items-center justify-center text-white shadow-inner">
                <Camera className="w-7 h-7 text-white" />
              </div>
            </div>
          </button>

          {/* Live Camera Feed Toggle */}
          <button
            onClick={() => {
              if (liveStreamActive) {
                stopLiveCamera();
              } else {
                startLiveCamera();
              }
            }}
            className={`flex flex-col items-center justify-center w-14 h-14 rounded-2xl border active:scale-95 transition-all ${
              liveStreamActive 
                ? 'bg-emerald-600 border-emerald-400 text-white shadow-lg shadow-emerald-600/30' 
                : 'bg-neutral-900/90 border-white/20 text-white hover:bg-neutral-800'
            }`}
            title="Toggle Live WebCam"
          >
            <FlipHorizontal className="w-6 h-6" />
            <span className="text-[9px] font-semibold mt-0.5">
              {liveStreamActive 
                ? (lang === 'hi' ? 'चालू' : 'Live') 
                : (lang === 'hi' ? 'कैमरा' : 'WebCam')}
            </span>
          </button>

        </div>

      </div>

    </div>
  );
}
