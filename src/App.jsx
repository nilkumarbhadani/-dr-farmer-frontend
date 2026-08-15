import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import HomeScreen from './components/HomeScreen';
import CameraScreen from './components/CameraScreen';
import ResultScreen from './components/ResultScreen';
import RecordBookScreen from './components/RecordBookScreen';
import BottomNav from './components/BottomNav';
import SplashScreen from './components/SplashScreen';
import OnboardingModal from './components/OnboardingModal';
import ExpertCallModal from './components/ExpertCallModal';
import { INITIAL_RECORDS } from './data/initialRecords';
import { speakText, stopSpeech } from './utils/speech';
import { Smartphone, Monitor } from 'lucide-react';

export default function App() {
  // Navigation: 'home' | 'scan' | 'result' | 'records'
  const [currentScreen, setCurrentScreen] = useState('home');
  const [scanMode, setScanMode] = useState('crop'); // 'crop' | 'cattle'
  const [activeResult, setActiveResult] = useState(null);
  const [lang, setLang] = useState('en'); // 'en' | 'hi'
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showExpertModal, setShowExpertModal] = useState(false);
  const [isDeviceMockup, setIsDeviceMockup] = useState(false);

  // One-time splash screen (first visit only)
  const [showSplash, setShowSplash] = useState(() => {
    try {
      return !localStorage.getItem('drfarmer_onboarded');
    } catch {
      return true;
    }
  });

  const handleGetStarted = () => {
    try {
      localStorage.setItem('drfarmer_onboarded', 'true');
    } catch (e) {
      // localStorage unavailable — proceed anyway
    }
    setShowSplash(false);
  };

  // Records state with localStorage persistence
  const [records, setRecords] = useState(() => {
    try {
      const saved = localStorage.getItem('drfarmer_records');
      return saved ? JSON.parse(saved) : INITIAL_RECORDS;
    } catch (e) {
      return INITIAL_RECORDS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('drfarmer_records', JSON.stringify(records));
    } catch (e) {
      console.error(e);
    }
  }, [records]);

  // Voice narration triggers
  const handleSetLang = (newLang) => {
    stopSpeech();
    setIsSpeaking(false);
    setLang(newLang);
  };

  const handleSpeak = (text) => {
    setIsSpeaking(true);
    speakText(
      text,
      lang,
      () => setIsSpeaking(true),
      () => setIsSpeaking(false)
    );
  };

  const handleToggleVoice = () => {
    if (isSpeaking) {
      stopSpeech();
      setIsSpeaking(false);
    } else {
      let welcomeSpeech = "";
      if (lang === 'hi') {
        welcomeSpeech = "नमस्ते किसान भाई! डॉक्टर फार्मर ऐप में आपका स्वागत है। फसल जांच के लिए पत्ते पर दबाएं, पशु जांच के लिए गाय पर दबाएं।";
      } else {
        welcomeSpeech = "Welcome to Dr. Farmer! Tap Crop Check for leaf diseases, or Cattle Check for livestock diagnosis.";
      }
      handleSpeak(welcomeSpeech);
    }
  };

  // Navigations
  const handleNavigateToScan = (mode = 'crop') => {
    setScanMode(mode);
    setCurrentScreen('scan');
  };

  /**
   * Handle captured image from CameraScreen.
   * This is the integration point for the ML model API.
   * 
   * @param {File} imageFile - The captured/uploaded image file
   * @param {'crop'|'cattle'} mode - The scan mode selected by the user
   * @returns {Promise<void>}
   * 
   * TODO: Replace the placeholder below with a real API call, e.g.:
   * 
   *   const formData = new FormData();
   *   formData.append('image', imageFile);
   *   formData.append('mode', mode);
   *   const response = await fetch('/api/diagnose', {
   *     method: 'POST',
   *     body: formData
   *   });
   *   const data = await response.json();
   *   // data should match the shape documented in ResultScreen.jsx
   *   setActiveResult(data);
   *   setCurrentScreen('result');
   */
  const handleCapture = async (imageFile, mode) => {
    console.log('[Dr. Farmer] Captured image:', imageFile?.name, 'Mode:', mode);
    console.log('[Dr. Farmer] Image size:', imageFile?.size, 'bytes');

    // ──────────────────────────────────────────────────────────
    // 🔌 API INTEGRATION POINT — calls the real ML model backend
    // ──────────────────────────────────────────────────────────
    const formData = new FormData();
    formData.append('file', imageFile);
    formData.append('entity_type', mode === 'crop' ? 'plant' : 'animal');
    formData.append('entity_id', 'farm_01');

    try {
      const response = await fetch('http://127.0.0.1:8000/api/scan/', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      const isHealthy = data.pathology_detected.toLowerCase().includes('healthy');

      setActiveResult({
        name: data.pathology_detected,
        nameHindi: data.pathology_detected,
        severity: isHealthy ? 'healthy' : 'caution',
        confidence: `${Math.round(data.confidence_score * 100)}%`,
        imageUrl: URL.createObjectURL(imageFile),
        symptomShort: data.pathology_detected,
        category: mode,
        homeRemedy: { title: 'Suggested Remedy', steps: [data.home_remedy] },
        medicalTreatment: {
          title: 'Medical Treatment',
          medicineName: data.medical_remedy,
          dosage: '',
          instruction: '',
        },
      });
    } catch (err) {
      console.error('[Dr. Farmer] API error:', err);
      setActiveResult(null); // triggers "Awaiting API" placeholder on error
    }

    setCurrentScreen('result');
  };

  const handleSaveToRecords = (newRecord) => {
    setRecords(prev => [newRecord, ...prev]);
  };

  // Show splash screen on first visit
  if (showSplash) {
    return <SplashScreen lang={lang} onGetStarted={handleGetStarted} />;
  }

  return (
    <div className="min-h-screen bg-[#ece6d8] flex flex-col items-center justify-start p-0 sm:py-6">
      
      {/* Top Desktop Helper Toolbar (allows switching between phone frame & responsive view) */}
      <div className="hidden sm:flex items-center justify-between w-full max-w-md px-3 py-1.5 mb-2 text-xs font-semibold text-[#5a6a5a]">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
          <span>Dr. Farmer Mobile UI</span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsDeviceMockup(!isDeviceMockup)}
            className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-white/80 hover:bg-white text-[#2a3a2a] border border-[#d8cfbe] shadow-2xs transition-all"
          >
            {isDeviceMockup ? <Smartphone className="w-3.5 h-3.5 text-emerald-700" /> : <Monitor className="w-3.5 h-3.5" />}
            <span>{isDeviceMockup ? 'Phone Frame: ON' : 'Phone Frame: OFF'}</span>
          </button>
        </div>
      </div>

      {/* Main Mobile App Container */}
      <div 
        className={`w-full max-w-md bg-[#f7f4ed] min-h-screen sm:min-h-[844px] flex flex-col justify-between relative shadow-2xl transition-all ${
          isDeviceMockup 
            ? 'sm:rounded-[48px] sm:border-[8px] sm:border-[#1e241e] sm:ring-1 sm:ring-black/10 overflow-hidden' 
            : 'sm:rounded-3xl border border-[#ded5c2] overflow-hidden'
        }`}
      >
        
        {/* Device Notch simulation when mockup mode is active */}
        {isDeviceMockup && (
          <div className="hidden sm:flex w-full justify-center pt-2 pb-1 bg-[#fbf9f4] relative z-40">
            <div className="w-28 h-4 rounded-full bg-[#1e241e] flex items-center justify-end px-3">
              <div className="w-2 h-2 rounded-full bg-emerald-900/60" />
            </div>
          </div>
        )}

        {/* 1. APP HEADER */}
        {currentScreen !== 'scan' && (
          <Header 
            lang={lang} 
            setLang={handleSetLang} 
            isSpeaking={isSpeaking}
            onToggleVoice={handleToggleVoice}
            onOpenOnboarding={() => setShowOnboarding(true)}
            onOpenExpertModal={() => setShowExpertModal(true)}
          />
        )}

        {/* 2. DYNAMIC MAIN BODY CONTENT */}
        <main className={`flex-1 ${currentScreen === 'scan' ? 'p-0' : 'p-4'}`}>
          {currentScreen === 'home' && (
            <HomeScreen
              lang={lang}
              records={records}
              onNavigateToScan={handleNavigateToScan}
              onNavigateToRecords={() => setCurrentScreen('records')}
              onOpenExpertModal={() => setShowExpertModal(true)}
              onSpeakText={handleSpeak}
            />
          )}

          {currentScreen === 'scan' && (
            <CameraScreen
              initialMode={scanMode}
              lang={lang}
              onBack={() => setCurrentScreen('home')}
              onCapture={handleCapture}
              onSpeakText={handleSpeak}
            />
          )}

          {currentScreen === 'result' && (
            <ResultScreen
              result={activeResult}
              lang={lang}
              onBack={() => setCurrentScreen('home')}
              onScanAnother={() => setCurrentScreen('scan')}
              onSaveToRecords={handleSaveToRecords}
              onOpenExpertModal={() => setShowExpertModal(true)}
              onSpeakText={handleSpeak}
            />
          )}

          {currentScreen === 'records' && (
            <RecordBookScreen
              records={records}
              setRecords={setRecords}
              lang={lang}
              onSpeakText={handleSpeak}
            />
          )}
        </main>

        {/* 3. BOTTOM TAB NAVIGATION (Visible on Home, Result, and Record screens) */}
        {currentScreen !== 'scan' && (
          <BottomNav
            activeScreen={currentScreen}
            onChangeScreen={(screen) => {
              if (screen === 'expert') {
                setShowExpertModal(true);
              } else {
                setCurrentScreen(screen);
              }
            }}
            lang={lang}
          />
        )}

        {/* Modals */}
        <OnboardingModal
          isOpen={showOnboarding}
          onClose={() => setShowOnboarding(false)}
          lang={lang}
        />

        <ExpertCallModal
          isOpen={showExpertModal}
          onClose={() => setShowExpertModal(false)}
          lang={lang}
        />

      </div>
    </div>
  );
}
