import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Camera, 
  FlipHorizontal, 
  Zap, 
  Image as ImageIcon, 
  ArrowLeft, 
  Sparkles, 
  Volume2, 
  Sprout,
  AlertCircle,
  RefreshCw,
  Upload,
  Lock
} from 'lucide-react';
import { TRANSLATIONS } from '../data/translations';

// Sample demo images for instant one-tap testing (especially useful when webcam is unavailable or in emulator)
const SAMPLE_TEST_CASES = [
  {
    name: 'Tomato Early Blight',
    nameHindi: 'टमाटर झुलसा रोग',
    type: 'crop',
    url: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb2250d?w=800&auto=format&fit=crop&q=80'
  },
  {
    name: 'Wheat Yellow Rust',
    nameHindi: 'गेहूं पीला रतुआ',
    type: 'crop',
    url: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&auto=format&fit=crop&q=80'
  },
  {
    name: 'Cattle Skin Lesion',
    nameHindi: 'पशु त्वचा रोग',
    type: 'cattle',
    url: 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?w=800&auto=format&fit=crop&q=80'
  }
];

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
  const [facingMode, setFacingMode] = useState('environment'); // 'environment' | 'user'
  const [cameraError, setCameraError] = useState(null);
  
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  // Audio instruction readout
  const handleReadInstruction = () => {
    const speech = `${t.camera.instruction}. ${t.camera.tapToCapture}.`;
    onSpeakText(speech);
  };

  /**
   * Stop any active video stream and release hardware camera tracks.
   */
  const stopLiveCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        try {
          track.stop();
        } catch (e) {
          console.warn('[CameraScreen] Track stop error:', e);
        }
      });
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setLiveStreamActive(false);
  }, []);

  /**
   * Start live camera with progressive constraint fallbacks.
   */
  const startLiveCamera = useCallback(async (targetFacingMode = facingMode) => {
    setCameraError(null);
    stopLiveCamera();

    // Check secure context requirement (WebRTC getUserMedia requires HTTPS or localhost)
    if (typeof window !== 'undefined' && !window.isSecureContext && 
        window.location.hostname !== 'localhost' && 
        window.location.hostname !== '127.0.0.1') {
      console.warn('[CameraScreen] Insecure context detected (HTTP on non-localhost). getUserMedia blocked by browser.');
      setCameraError('InsecureContext');
      setLiveStreamActive(false);
      return;
    }

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.warn('[CameraScreen] navigator.mediaDevices.getUserMedia not supported.');
      setCameraError('NotSupported');
      setLiveStreamActive(false);
      return;
    }

    let stream = null;

    // Strategy 1: Request preferred facingMode and resolution
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: targetFacingMode },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });
    } catch (err1) {
      // Strategy 2: Request simple facingMode constraint
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: targetFacingMode },
          audio: false
        });
      } catch (err2) {
        // Strategy 3: Request any available video input
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false
          });
        } catch (err3) {
          console.error('[CameraScreen] All camera constraints failed:', err3);
          setCameraError(err3.name || 'AccessDenied');
          setLiveStreamActive(false);
          return;
        }
      }
    }

    if (stream) {
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        try {
          await videoRef.current.play();
        } catch (playErr) {
          console.warn('[CameraScreen] Video play prevented:', playErr);
        }
      }
      setLiveStreamActive(true);
      setCameraError(null);
    }
  }, [facingMode, stopLiveCamera]);

  /**
   * Switch between Back (Environment) and Front (User) cameras.
   */
  const toggleFacingMode = () => {
    const nextMode = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextMode);
    startLiveCamera(nextMode);
  };

  /**
   * Toggle hardware torch/flash if supported by device camera track.
   */
  const toggleFlash = async () => {
    const nextFlashState = !flashOn;
    setFlashOn(nextFlashState);

    if (streamRef.current) {
      const track = streamRef.current.getVideoTracks()[0];
      if (track && typeof track.getCapabilities === 'function') {
        const capabilities = track.getCapabilities();
        if (capabilities.torch) {
          try {
            await track.applyConstraints({
              advanced: [{ torch: nextFlashState }]
            });
          } catch (e) {
            console.warn('[CameraScreen] Torch error:', e);
          }
        }
      }
    }
  };

  // Mount effect: Start live camera stream
  useEffect(() => {
    startLiveCamera('environment');
    return () => {
      stopLiveCamera();
    };
  }, [startLiveCamera, stopLiveCamera]);

  /**
   * Capture a frame from the live video feed as a File object.
   */
  const captureFrameFromVideo = () => {
    if (!videoRef.current || !liveStreamActive) return null;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const width = video.videoWidth || 1280;
    const height = video.videoHeight || 720;
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    ctx.drawImage(video, 0, 0, width, height);

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], `capture_${Date.now()}.jpg`, { type: 'image/jpeg' });
          resolve(file);
        } else {
          resolve(null);
        }
      }, 'image/jpeg', 0.92);
    });
  };

  /**
   * Main capture trigger handler.
   */
  const handleCapture = async () => {
    if (isScanning) return;

    setIsScanning(true);
    onSpeakText(t.camera.analyzing);

    let imageFile = null;

    if (liveStreamActive) {
      imageFile = await captureFrameFromVideo();
    }

    if (!imageFile) {
      // No live camera stream available — launch native mobile camera or file picker
      setIsScanning(false);
      if (cameraInputRef.current) {
        cameraInputRef.current.click();
      } else {
        fileInputRef.current?.click();
      }
      return;
    }

    try {
      await onCapture(imageFile, mode);
    } catch (err) {
      console.error("[CameraScreen] Capture/diagnosis error:", err);
    } finally {
      setIsScanning(false);
    }
  };

  /**
   * Handle image file selected from device file inputs or native camera.
   */
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    onSpeakText(t.camera.analyzing);

    try {
      await onCapture(file, mode);
    } catch (err) {
      console.error("[CameraScreen] Upload/diagnosis error:", err);
    } finally {
      setIsScanning(false);
      if (e.target) {
        e.target.value = '';
      }
    }
  };

  /**
   * Handle quick test with sample case image URL.
   */
  const handleSampleClick = async (sample) => {
    setIsScanning(true);
    onSpeakText(t.camera.analyzing);

    try {
      let file;
      try {
        const response = await fetch(sample.url, { mode: 'cors' });
        if (response.ok) {
          const blob = await response.blob();
          file = new File([blob], `${sample.name.replace(/\s+/g, '_')}.jpg`, { type: 'image/jpeg' });
        }
      } catch (fetchErr) {
        console.warn("[CameraScreen] Remote sample fetch blocked/offline, using offline sample canvas:", fetchErr);
      }

      if (!file) {
        // Create an instant 224x224 sample image canvas for offline reliability
        const canvas = document.createElement('canvas');
        canvas.width = 224;
        canvas.height = 224;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = sample.type === 'cattle' ? '#8B4513' : '#2E8B57';
        ctx.fillRect(0, 0, 224, 224);
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 16px sans-serif';
        ctx.fillText(sample.name, 10, 112);
        const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg'));
        file = new File([blob], `${sample.name.replace(/\s+/g, '_')}.jpg`, { type: 'image/jpeg' });
      }

      await onCapture(file, sample.type || mode);
    } catch (err) {
      console.error("[CameraScreen] Sample fetch error:", err);
    } finally {
      setIsScanning(false);
    }
  };


  // Helper to determine friendly error messages
  const getErrorMessage = () => {
    if (cameraError === 'NotAllowedError' || cameraError === 'PermissionDeniedError') {
      return {
        title: lang === 'hi' ? 'कैमरा अनुमति आवश्यक है' : 'Camera Permission Required',
        desc: lang === 'hi'
          ? 'ब्राउज़र में कैमरा की अनुमति दें (URL बार में 🔒 या कैमरा आइकन दबाएं), या नीचे दिए गए बटन से फोटो लें।'
          : 'Please allow camera permission in your browser (tap 🔒 or camera icon in address bar), or use the mobile camera / gallery button below.'
      };
    }
    if (cameraError === 'InsecureContext') {
      return {
        title: lang === 'hi' ? 'HTTPS या Localhost आवश्यक है' : 'HTTPS / Localhost Required',
        desc: lang === 'hi'
          ? 'ब्राउज़र सुरक्षा के लिए लाइव वेबकैम केवल HTTPS या localhost पर काम करता है। मोबाइल कैमरा बटन का उपयोग करें।'
          : 'Live video requires HTTPS or localhost. You can still take photos using the Mobile Camera button below.'
      };
    }
    if (cameraError === 'NotFoundError' || cameraError === 'DevicesNotFoundError') {
      return {
        title: lang === 'hi' ? 'कैमरा उपकरण नहीं मिला' : 'No Camera Found',
        desc: lang === 'hi'
          ? 'इस डिवाइस पर कोई कैमरा नहीं मिला। आप गैलरी से फोटो अपलोड कर सकते हैं या सैंपल टेस्ट कर सकते हैं।'
          : 'No camera hardware found on this device. You can upload a photo or use a test sample below.'
      };
    }
    if (cameraError === 'NotReadableError' || cameraError === 'TrackStartError') {
      return {
        title: lang === 'hi' ? 'कैमरा व्यस्त है' : 'Camera In Use',
        desc: lang === 'hi'
          ? 'कैमरा किसी अन्य ऐप या ब्राउज़र टैब द्वारा उपयोग में है। कृपया अन्य ऐप्स बंद करके पुनः प्रयास करें।'
          : 'Camera is already in use by another application. Please close other camera apps and retry.'
      };
    }
    return {
      title: lang === 'hi' ? 'कैमरा चालू नहीं हो सका' : 'Camera Off or Unavailable',
      desc: lang === 'hi'
        ? 'लाइव कैमरा चालू करने के लिए पुनः प्रयास करें या मोबाइल कैमरा/गैलरी से फोटो लें।'
        : 'Tap below to retry live camera, or capture a photo directly from your device.'
    };
  };

  const errorInfo = getErrorMessage();

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col justify-between max-w-md mx-auto overflow-hidden">
      
      {/* Hidden canvas & native device camera/gallery inputs */}
      <canvas ref={canvasRef} className="hidden" />
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileUpload} 
        accept="image/*" 
        className="hidden" 
      />
      <input 
        type="file" 
        ref={cameraInputRef} 
        onChange={handleFileUpload} 
        accept="image/*" 
        capture="environment"
        className="hidden" 
      />

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
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          {/* Mode Switcher */}
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

          {/* Flash / Torch Toggle */}
          <button 
            onClick={toggleFlash}
            className={`w-10 h-10 rounded-full backdrop-blur-md border flex items-center justify-center transition-all ${
              flashOn 
                ? 'bg-amber-400 text-neutral-950 border-amber-300 shadow-md shadow-amber-400/30' 
                : 'bg-black/40 text-white border-white/20'
            }`}
            title="Toggle Flash/Torch"
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
        
        {/* Live Camera Video stream (ALWAYS MOUNTED to preserve ref) */}
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          muted
          className={`w-full h-full object-cover ${liveStreamActive ? 'block' : 'hidden'}`}
        />

        {/* Permission / Camera Fallback Screen (Visible when camera is inactive) */}
        {!liveStreamActive && (
          <div className="relative w-full h-full flex flex-col items-center justify-center bg-neutral-900/95 p-6 text-center overflow-y-auto">
            
            <div className="w-14 h-14 rounded-3xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 mb-3">
              {cameraError === 'InsecureContext' || cameraError === 'NotAllowedError' ? (
                <Lock className="w-7 h-7 text-amber-400" />
              ) : (
                <AlertCircle className="w-7 h-7 text-amber-400" />
              )}
            </div>

            <h4 className="text-base font-extrabold text-white mb-1">
              {errorInfo.title}
            </h4>

            <p className="text-xs text-neutral-300 max-w-xs mb-4 leading-relaxed">
              {errorInfo.desc}
            </p>

            <div className="flex flex-col w-full max-w-xs space-y-2">
              
              {/* Native Mobile Camera Capture Button */}
              <button
                onClick={() => cameraInputRef.current?.click()}
                className="w-full py-3 px-4 bg-[#1b5e20] hover:bg-[#144718] text-white font-extrabold text-xs rounded-2xl shadow-lg flex items-center justify-center space-x-2 border border-emerald-400 active:scale-98 transition-transform"
              >
                <Camera className="w-4 h-4" />
                <span>{lang === 'hi' ? 'मोबाइल कैमरा से फोटो लें' : 'Take Photo with Mobile Camera'}</span>
              </button>

              {/* Gallery Upload */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-2.5 px-4 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-2xl flex items-center justify-center space-x-2 border border-white/20 active:scale-98 transition-transform"
              >
                <Upload className="w-4 h-4 text-emerald-400" />
                <span>{lang === 'hi' ? 'गैलरी से फोटो चुनें' : 'Upload Photo from Gallery'}</span>
              </button>

              {/* Retry WebCam Stream */}
              <button
                onClick={() => startLiveCamera(facingMode)}
                className="w-full py-2 px-3 text-neutral-400 hover:text-white font-semibold text-[11px] flex items-center justify-center space-x-1 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>{lang === 'hi' ? 'वेबकैम पुनः प्रारंभ करें' : 'Retry Live Camera Stream'}</span>
              </button>

            </div>

            {/* Quick Test Sample Cases */}
            <div className="mt-4 pt-3 border-t border-white/10 w-full max-w-xs">
              <span className="text-[10px] text-neutral-400 font-semibold uppercase tracking-wider block mb-2">
                {lang === 'hi' ? 'त्वरित जांच के लिए नमूना चुनें:' : 'Or Try Sample Leaf Cases:'}
              </span>
              <div className="flex flex-wrap gap-1.5 justify-center">
                {SAMPLE_TEST_CASES.map((sample, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSampleClick(sample)}
                    className="px-2.5 py-1 bg-white/5 hover:bg-white/15 border border-white/10 rounded-lg text-[11px] text-neutral-200 flex items-center space-x-1 active:scale-95 transition-all"
                  >
                    <span>{sample.type === 'crop' ? '🌿' : '🐄'}</span>
                    <span>{lang === 'hi' ? sample.nameHindi : sample.name}</span>
                  </button>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* Viewfinder Target Reticle (Only when camera is active) */}
        {liveStreamActive && (
          <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 aspect-square rounded-3xl border-2 border-dashed border-white/60 pointer-events-none flex flex-col justify-between p-4 shadow-[0_0_0_9999px_rgba(0,0,0,0.45)]">
            <div className="flex justify-between">
              <div className="w-6 h-6 border-t-4 border-l-4 border-emerald-400 rounded-tl-lg" />
              <div className="w-6 h-6 border-t-4 border-r-4 border-emerald-400 rounded-tr-lg" />
            </div>

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

            <div className="absolute inset-x-2 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#10b981] animate-scan-beam" />
          </div>
        )}

        {/* Flash simulation overlay */}
        {flashOn && (
          <div className="absolute inset-0 bg-white/20 pointer-events-none mix-blend-screen" />
        )}

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

          {/* MAIN BIG CIRCULAR CAPTURE BUTTON */}
          <button
            onClick={handleCapture}
            disabled={isScanning}
            className="relative group p-1.5 rounded-full bg-white/20 active:scale-95 transition-transform"
            aria-label="Capture Photo"
          >
            <div className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center bg-white shadow-xl shadow-white/20 group-hover:scale-105 transition-transform">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-emerald-700 to-emerald-500 flex items-center justify-center text-white shadow-inner">
                <Camera className="w-7 h-7 text-white" />
              </div>
            </div>
          </button>

          {/* Camera Flip (Back / Front) or Retry Button */}
          <button
            onClick={toggleFacingMode}
            className={`flex flex-col items-center justify-center w-14 h-14 rounded-2xl border active:scale-95 transition-all ${
              liveStreamActive 
                ? 'bg-emerald-600 border-emerald-400 text-white shadow-lg shadow-emerald-600/30' 
                : 'bg-neutral-900/90 border-white/20 text-white hover:bg-neutral-800'
            }`}
            title="Switch Back/Front Camera"
          >
            <FlipHorizontal className="w-6 h-6" />
            <span className="text-[9px] font-semibold mt-0.5">
              {facingMode === 'environment' 
                ? (lang === 'hi' ? 'पीछे' : 'Back') 
                : (lang === 'hi' ? 'आगे' : 'Front')}
            </span>
          </button>

        </div>

      </div>

    </div>
  );
}
