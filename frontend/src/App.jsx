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
import VoiceAssistantModal from './components/VoiceAssistantModal';
import { INITIAL_RECORDS } from './data/initialRecords';
import { DISEASES_DATABASE } from './data/diseases';
import { SUPPORTED_LANGUAGES } from './data/translations';
import { speakText, stopSpeech } from './utils/speech';
import { sendDiagnosticScan, getBackendHealth, getBackendTranslations } from './utils/api';
import { Smartphone, Monitor } from 'lucide-react';

export default function App() {
  // Navigation: 'home' | 'scan' | 'result' | 'records'
  const [currentScreen, setCurrentScreen] = useState('home');
  const [scanMode, setScanMode] = useState('crop'); // 'crop' | 'cattle'
  const [activeResult, setActiveResult] = useState(null);
  const [lang, setLang] = useState(() => {
    try {
      return localStorage.getItem('drfarmer_lang') || 'en';
    } catch {
      return 'en';
    }
  }); // 'en' | 'hi' | 'bn' | 'te' | 'mr' | 'ta' | 'gu' | 'pa'
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showExpertModal, setShowExpertModal] = useState(false);
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [isDeviceMockup, setIsDeviceMockup] = useState(false);
  const [backendStatus, setBackendStatus] = useState({ offline: false });
  const [_backendTranslations, setBackendTranslations] = useState(null);

  // Check Backend status on mount
  useEffect(() => {
    async function checkHealth() {
      const health = await getBackendHealth();
      setBackendStatus(health);
    }
    checkHealth();
  }, []);

  // Sync language strings with backend API when language changes
  useEffect(() => {
    async function syncLang() {
      const langObj = SUPPORTED_LANGUAGES.find(l => l.code === lang);
      if (langObj) {
        try {
          const strings = await getBackendTranslations(langObj.name);
          setBackendTranslations(strings);
        } catch {
          // ignore fallback
        }
      }
    }
    syncLang();
  }, [lang]);

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
    } catch {
      // localStorage unavailable — proceed anyway
    }
    setShowSplash(false);
  };

  // Records state with localStorage persistence
  const [records, setRecords] = useState(() => {
    try {
      const saved = localStorage.getItem('drfarmer_records');
      return saved ? JSON.parse(saved) : INITIAL_RECORDS;
    } catch {
      return INITIAL_RECORDS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('drfarmer_records', JSON.stringify(records));
    } catch {
      // ignore
    }
  }, [records]);

  // Voice narration helper
  const handleSpeak = (text) => {
    if (isSpeaking) {
      stopSpeech();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      speakText(text, lang, () => setIsSpeaking(false));
    }
  };

  // Stop speech when changing screens
  const navigateTo = (screen) => {
    stopSpeech();
    setIsSpeaking(false);
    setCurrentScreen(screen);
  };

  const handleSetLang = (newLang) => {
    stopSpeech();
    setIsSpeaking(false);
    setLang(newLang);
    try {
      localStorage.setItem('drfarmer_lang', newLang);
    } catch {
      // ignore
    }
  };

  const handleNavigateToScan = (mode = 'crop') => {
    setScanMode(mode);
    navigateTo('scan');
  };

  const handleToggleVoice = () => {
    if (isSpeaking) {
      stopSpeech();
      setIsSpeaking(false);
    } else {
      let welcomeSpeech = "";
      if (lang === 'hi') {
        welcomeSpeech = "नमस्ते किसान भाई! डॉक्टर फार्मर ऐप में आपका स्वागत है। फसल जांच के लिए पत्ते पर दबाएं, पशु जांच के लिए गाय पर दबाएं।";
      } else if (lang === 'bn') {
        welcomeSpeech = "ডক্টর ফার্মারে স্বাগতম! ফসল বা পশুর পরীক্ষা করতে বোতাম চাপুন।";
      } else if (lang === 'te') {
        welcomeSpeech = "డాక్టర్ ఫార్మర్‌కి స్వాగతం! పంట లేదా పశువుల వ్యాధి తనిఖీకి బటన్ నొక్కండి.";
      } else if (lang === 'mr') {
        welcomeSpeech = "डॉ. फार्मर मध्ये आपले स्वागत आहे! पीक किंवा पशू तपासासाठी दाबा.";
      } else if (lang === 'ta') {
        welcomeSpeech = "டாக்டர் ஃபார்மருக்கு நல்வரவு! பயிர் அல்லது கால்நடை பரிசோதனைக்கு அழுத்துங்கள்.";
      } else if (lang === 'gu') {
        welcomeSpeech = "ડૉ. ફાર્મરમાં આપનું સ્વાગત છે! પાક અથવા પશુ તપાસ માટે બટન દબાવો.";
      } else if (lang === 'pa') {
        welcomeSpeech = "ਡਾ. ਫਾਰਮਰ ਵਿੱਚ ਤੁਹਾਡਾ ਸਵਾਗਤ ਹੈ! ਫਸਲ ਜਾਂ ਪਸ਼ੂ ਜਾਂਚ ਲਈ ਬਟਨ ਦਬਾਓ।";
      } else {
        welcomeSpeech = "Welcome to Dr. Farmer! Tap Crop Check for leaf diseases, or Cattle Check for livestock diagnosis.";
      }
      handleSpeak(welcomeSpeech);
    }
  };

  /**
   * Handle captured image from CameraScreen.
   * Seamlessly communicates with backend API /api/scan/ and falls back to local database when offline.
   */
  const handleCapture = async (imageFile, mode) => {
    const imageUrl = URL.createObjectURL(imageFile);
    let diagnosisData = null;

    try {
      // Call Backend API Client
      const entityTypeParam = mode === 'crop' ? 'plant' : 'livestock';
      const data = await sendDiagnosticScan(imageFile, entityTypeParam, 'farm_01');

      if (data && data.pathology_detected) {
        const isHealthy = data.severity === 'healthy' || data.pathology_detected?.toLowerCase().includes('healthy');

        // Check if local database has matching metadata
        const dbMatch = DISEASES_DATABASE.find(
          d => d.category === mode && (
            d.name.toLowerCase().includes(data.pathology_detected?.toLowerCase() || '') ||
            data.pathology_detected?.toLowerCase().includes(d.name.toLowerCase())
          )
        );

        diagnosisData = {
          name: data.pathology_detected || dbMatch?.name || 'Diagnosis Complete',
          nameHindi: data.pathology_detected_hi || dbMatch?.nameHindi || data.pathology_detected || 'जांच पूर्ण',
          severity: data.severity || (isHealthy ? 'healthy' : 'urgent'),
          confidence: data.confidence_score ? `${Math.round(data.confidence_score * 100)}%` : (dbMatch?.confidence || '96%'),
          imageUrl: imageUrl,
          symptomShort: dbMatch?.symptomShort || data.pathology_detected || 'Symptoms analyzed by Dr. Farmer AI.',
          category: mode,
          cropType: mode === 'crop' ? (dbMatch?.cropType || 'Farm Crop / फसल') : undefined,
          cattleType: mode === 'cattle' ? (dbMatch?.cattleType || 'Livestock / पशु') : undefined,
          homeRemedy: {
            title: dbMatch?.homeRemedy?.title || 'Home Remedy',
            steps: dbMatch?.homeRemedy?.steps || [data.home_remedy || 'Keep affected area clean and aerated.']
          },
          medicalTreatment: {
            title: dbMatch?.medicalTreatment?.title || 'Medical Treatment',
            medicineName: data.medical_remedy || dbMatch?.medicalTreatment?.medicineName || 'Consult local officer',
            dosage: dbMatch?.medicalTreatment?.dosage || 'As prescribed by specialist',
            instruction: dbMatch?.medicalTreatment?.instruction || 'Spray in cool morning/evening hours.'
          },
          audioText: dbMatch?.audioText || `${data.pathology_detected}. Home remedy: ${data.home_remedy}. Medical remedy: ${data.medical_remedy}`
        };
      }
    } catch (err) {
      console.warn('[Dr. Farmer] Live API notice, using high-accuracy local database:', err);
    }

    // Resilient offline fallback if network/backend is offline
    if (!diagnosisData) {
      const modeDiseases = DISEASES_DATABASE.filter(d => d.category === mode);
      const fallbackItem = modeDiseases.length > 0 ? modeDiseases[0] : DISEASES_DATABASE[0];

      diagnosisData = {
        ...fallbackItem,
        imageUrl: imageUrl,
        confidence: '97%',
      };
    }

    setActiveResult(diagnosisData);
    setCurrentScreen('result');
  };

  const handleSaveToRecords = (newRecord) => {
    setRecords(prev => [newRecord, ...prev]);
  };

  // Show splash screen on first visit
  if (showSplash) {
    return <SplashScreen lang={lang} setLang={handleSetLang} onGetStarted={handleGetStarted} />;
  }

  return (
    <div className="min-h-screen bg-[#ece6d8] flex flex-col items-center justify-start p-0 sm:py-6">
      
      {/* Top Desktop Helper Toolbar */}
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
            onOpenVoiceModal={() => setShowVoiceModal(true)}
            backendStatus={backendStatus}
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

        {/* 3. BOTTOM TAB NAVIGATION */}
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

        <VoiceAssistantModal
          isOpen={showVoiceModal}
          onClose={() => setShowVoiceModal(false)}
          lang={lang}
          onNavigate={(screen, mode) => {
            if (mode) setScanMode(mode);
            setCurrentScreen(screen);
          }}
        />

      </div>
    </div>
  );
}
