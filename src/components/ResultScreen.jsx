import React, { useState } from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  AlertOctagon, 
  Volume2, 
  VolumeX, 
  Leaf, 
  FlaskConical, 
  PhoneCall, 
  BookmarkCheck, 
  RotateCcw, 
  Share2, 
  Sparkles, 
  ArrowLeft,
  ShieldCheck,
  CalendarPlus,
  Check,
  CloudOff,
  Plug
} from 'lucide-react';
import { TRANSLATIONS } from '../data/translations';
import confetti from 'canvas-confetti';

/**
 * Expected `result` shape from ML API:
 * {
 *   name: string,                    // "Early Leaf Blight"
 *   nameHindi: string,               // "अगेती झुलसा रोग"
 *   severity: 'urgent'|'caution'|'healthy',
 *   confidence: string,              // "98%"
 *   imageUrl: string,                // captured image data URL or remote URL
 *   symptomShort: string,            // Brief symptom description
 *   category: 'crop' | 'cattle',
 *   cropType?: string,               // "Tomato / टमाटर" (if category=crop)
 *   cattleType?: string,             // "Dairy Cow / गाय" (if category=cattle)
 *   homeRemedy: {
 *     title: string,
 *     steps: string[]
 *   },
 *   medicalTreatment: {
 *     title: string,
 *     medicineName: string,
 *     dosage: string,
 *     instruction: string
 *   }
 * }
 */

export default function ResultScreen({ 
  result, 
  lang, 
  onBack, 
  onScanAnother, 
  onSaveToRecords, 
  onOpenExpertModal,
  onSpeakText 
}) {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;
  const [activeTab, setActiveTab] = useState('homeRemedy'); // 'homeRemedy' | 'medical'
  const [isSaved, setIsSaved] = useState(false);

  // Show placeholder when no result data (API not connected yet)
  if (!result) {
    return (
      <div className="space-y-4 pb-28">
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-full bg-[#eee8db] hover:bg-[#e4dcce] text-[#2c3d2c] text-xs font-bold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{lang === 'hi' ? 'वापस' : 'Back'}</span>
          </button>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-sm border border-[#e5dcce] text-center">
          <div className="w-16 h-16 rounded-full bg-[#f0ece1] border border-[#ded5c2] flex items-center justify-center mx-auto mb-4">
            <Plug className="w-8 h-8 text-[#8a7e6a]" />
          </div>
          <h2 className="text-lg font-extrabold text-[#1a2e1a] mb-2">
            {lang === 'hi' ? 'API कनेक्शन की प्रतीक्षा' : 'Awaiting API Connection'}
          </h2>
          <p className="text-sm text-[#5c685c] leading-relaxed mb-4">
            {lang === 'hi'
              ? 'ML मॉडल API जोड़ने के बाद यहाँ रोग का नाम, गंभीरता, देसी नुस्खे और दवाई दिखेगी।'
              : 'Connect your ML model API to see diagnosis results here — disease name, severity, home remedies & medical treatment.'}
          </p>
          <div className="bg-[#f8f5ee] rounded-2xl p-3 border border-[#ede5d5] text-left">
            <p className="text-[11px] font-bold text-[#6e583e] uppercase tracking-wider mb-1">Expected Response Shape</p>
            <pre className="text-[10px] text-[#4d5c4d] font-mono leading-relaxed overflow-x-auto">
{`{
  name, nameHindi, severity,
  confidence, imageUrl,
  symptomShort, category,
  homeRemedy: { title, steps[] },
  medicalTreatment: {
    title, medicineName,
    dosage, instruction
  }
}`}
            </pre>
          </div>
          <button
            onClick={onScanAnother}
            className="mt-4 w-full py-3 px-4 rounded-2xl font-bold text-sm bg-[#ece5d6] hover:bg-[#e0d7c3] text-[#2c3d2c] border border-[#d8cdb8] flex items-center justify-center space-x-2 transition-colors active:scale-98"
          >
            <RotateCcw className="w-4 h-4 text-[#1b5e20]" />
            <span>{t.result.reScan}</span>
          </button>
        </div>
      </div>
    );
  }

  const isRed = result.severity === 'urgent';
  const isYellow = result.severity === 'caution';
  const isGreen = result.severity === 'healthy';

  // Severity styling tokens
  const severityBadgeConfig = {
    urgent: {
      bg: 'bg-red-500',
      textColor: 'text-white',
      border: 'border-red-600',
      label: t.result.urgent,
      icon: AlertOctagon,
      lightBg: 'bg-red-50 text-red-700 border-red-200'
    },
    caution: {
      bg: 'bg-amber-500',
      textColor: 'text-neutral-950',
      border: 'border-amber-600',
      label: t.result.caution,
      icon: AlertTriangle,
      lightBg: 'bg-amber-50 text-amber-800 border-amber-200'
    },
    healthy: {
      bg: 'bg-emerald-600',
      textColor: 'text-white',
      border: 'border-emerald-700',
      label: t.result.healthy,
      icon: CheckCircle2,
      lightBg: 'bg-emerald-50 text-emerald-800 border-emerald-200'
    }
  };

  const config = severityBadgeConfig[result.severity] || severityBadgeConfig.caution;
  const SeverityIcon = config.icon;

  // Speak diagnosis & selected remedy
  const handleReadAloud = () => {
    let speech = "";
    if (lang === 'hi') {
      speech = `रोग का नाम: ${result.nameHindi}। स्थिति: ${isRed ? 'खतरा, तुरंत इलाज करें' : isYellow ? 'सावधानी बरतें' : 'फसल स्वस्थ है'}। `;
      if (activeTab === 'homeRemedy') {
        speech += `देसी नुस्खा: ${result.homeRemedy.title}। ` + result.homeRemedy.steps.join(". ");
      } else {
        speech += `दवा: ${result.medicalTreatment.title}। दवा का नाम ${result.medicalTreatment.medicineName}। मात्रा ${result.medicalTreatment.dosage}। ${result.medicalTreatment.instruction}`;
      }
      if (isRed) {
        speech += " आपातकालीन सहायता के लिए नीचे दिए लाल बटन से डॉक्टर को कॉल करें।";
      }
    } else {
      speech = `Detected Issue: ${result.name}. Severity: ${result.severity}. `;
      if (activeTab === 'homeRemedy') {
        speech += `Home Remedy: ${result.homeRemedy.title}. ` + result.homeRemedy.steps.join(". ");
      } else {
        speech += `Medical Treatment: ${result.medicalTreatment.title}. Medicine: ${result.medicalTreatment.medicineName}. Dosage: ${result.medicalTreatment.dosage}. ${result.medicalTreatment.instruction}`;
      }
      if (isRed) {
        speech += " Critical alert! Tap the red call button to contact a veterinary officer.";
      }
    }
    onSpeakText(speech);
  };

  const handleSave = () => {
    if (!isSaved) {
      onSaveToRecords({
        id: `rec-${Date.now()}`,
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        category: result.category,
        type: isGreen ? 'healthy' : 'disease',
        title: `${result.name} (${result.cropType || result.cattleType})`,
        titleHi: `${result.nameHindi}`,
        diseaseName: result.name,
        status: isGreen ? 'Healthy' : 'Diagnosed',
        severity: result.severity,
        description: `Home remedy: ${result.homeRemedy.title}`,
        icon: result.category === 'crop' ? 'sprout' : 'heart'
      });
      setIsSaved(true);
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.8 } });
    }
  };

  return (
    <div className="space-y-4 pb-28">
      
      {/* 1. TOP BAR NAVIGATION */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center space-x-1 px-3 py-1.5 rounded-full bg-[#eee8db] hover:bg-[#e4dcce] text-[#2c3d2c] text-xs font-bold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{lang === 'hi' ? 'वापस' : 'Back'}</span>
        </button>

        {/* Audio Listen CTA for the whole diagnosis */}
        <button
          onClick={handleReadAloud}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-[#1b5e20] text-white hover:bg-[#154a19] shadow-sm text-xs font-bold animate-voice-pulse"
        >
          <Volume2 className="w-4 h-4 text-emerald-200" />
          <span>{t.result.listenAudio}</span>
        </button>
      </div>

      {/* 2. DIAGNOSIS CARD: DISEASE NAME + SEVERITY BADGE + PHOTO */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-[#e5dcce]">
        
        {/* Severity Badge */}
        <div className="flex items-center justify-between mb-3">
          <span className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wide shadow-xs ${config.bg} ${config.textColor}`}>
            <SeverityIcon className="w-3.5 h-3.5" />
            <span>{config.label}</span>
          </span>
          <span className="text-xs font-bold text-[#647464]">
            {lang === 'hi' ? `सटीकता: ${result.confidence}` : `Accuracy: ${result.confidence}`}
          </span>
        </div>

        {/* Large Disease Name in High Contrast */}
        <h1 className="text-2xl font-black text-[#132e13] tracking-tight leading-tight mb-1">
          {lang === 'hi' ? result.nameHindi : result.name}
        </h1>
        <p className="text-xs font-bold text-[#6e583e] mb-4 flex items-center gap-1.5">
          <span>{result.cropType || result.cattleType}</span>
          <span>•</span>
          <span className="text-[#1b5e20]">{lang === 'hi' ? result.name : result.nameHindi}</span>
        </p>

        {/* Photo Thumbnail + Symptom highlight preview */}
        <div className="flex items-center space-x-3.5 bg-[#faf8f2] p-3 rounded-2xl border border-[#ece4d4]">
          <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 border-2 border-white shadow-xs">
            <img 
              src={result.imageUrl} 
              alt={result.name}
              className="w-full h-full object-cover" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent flex items-end p-1">
              <span className="text-[9px] font-bold text-white uppercase">Captured</span>
            </div>
          </div>
          <div className="flex-1">
            <p className="text-xs font-bold text-[#2a3a2a] mb-1">
              {lang === 'hi' ? 'पहचाने गए मुख्य लक्षण:' : 'Key Symptoms Identified:'}
            </p>
            <p className="text-[12px] text-[#4d5c4d] leading-relaxed line-clamp-2">
              {result.symptomShort}
            </p>
          </div>
        </div>

      </div>

      {/* 3. PROMINENT RED BANNER: IF SEVERITY IS URGENT (RED) */}
      {isRed && (
        <div className="bg-gradient-to-r from-red-600 to-rose-700 text-white rounded-3xl p-4 shadow-md border border-red-500 relative overflow-hidden animate-pulse">
          <div className="flex items-start space-x-3 relative z-10">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
              <AlertOctagon className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-extrabold uppercase tracking-wide text-white">
                {lang === 'hi' ? 'आपातकालीन चेतावनी!' : 'Severe Danger Alert!'}
              </h3>
              <p className="text-xs text-red-100 font-medium mt-0.5 leading-snug">
                {t.result.expertBanner}
              </p>
              <button
                onClick={onOpenExpertModal}
                className="mt-3 w-full bg-white text-red-700 hover:bg-red-50 active:scale-95 font-extrabold text-xs py-2.5 px-4 rounded-xl shadow-md flex items-center justify-center space-x-2 transition-transform"
              >
                <PhoneCall className="w-4 h-4 text-red-600 animate-bounce" />
                <span>{t.result.callExpertBtn}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. TWO SEPARATED REMEDY TABS: "Home Remedy" and "Medical Treatment" */}
      <div className="bg-white rounded-3xl p-4 shadow-sm border border-[#e5dcce]">
        
        {/* Tab Header Controls (Large Finger Targets) */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-[#f4eee2] rounded-2xl mb-4 border border-[#e7decf]">
          
          {/* Tab 1: Home Remedy */}
          <button
            onClick={() => setActiveTab('homeRemedy')}
            className={`flex items-center justify-center space-x-2 py-3 px-3 rounded-xl font-extrabold text-xs transition-all ${
              activeTab === 'homeRemedy'
                ? 'bg-[#1b5e20] text-white shadow-sm'
                : 'text-[#4e5b4e] hover:text-[#1b5e20]'
            }`}
          >
            <Leaf className="w-4 h-4" />
            <span>{t.result.homeRemedy}</span>
          </button>

          {/* Tab 2: Medical Treatment */}
          <button
            onClick={() => setActiveTab('medical')}
            className={`flex items-center justify-center space-x-2 py-3 px-3 rounded-xl font-extrabold text-xs transition-all ${
              activeTab === 'medical'
                ? 'bg-[#1b5e20] text-white shadow-sm'
                : 'text-[#4e5b4e] hover:text-[#1b5e20]'
            }`}
          >
            <FlaskConical className="w-4 h-4" />
            <span>{t.result.medicalTreatment}</span>
          </button>

        </div>

        {/* TAB CONTENT: HOME REMEDY */}
        {activeTab === 'homeRemedy' && (
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-[#1b5e20] pb-1 border-b border-[#f0e8d8]">
              <span className="text-lg">🌿</span>
              <h4 className="text-sm font-extrabold">
                {result.homeRemedy.title}
              </h4>
            </div>

            <div className="space-y-2.5 pt-1">
              {result.homeRemedy.steps.map((step, idx) => (
                <div key={idx} className="flex items-start space-x-2.5 bg-[#f8f6f0] p-3 rounded-2xl border border-[#ede5d5]">
                  <span className="w-6 h-6 rounded-full bg-[#1b5e20] text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <p className="text-xs text-[#2c382c] font-medium leading-relaxed">
                    {step}
                  </p>
                </div>
              ))}
            </div>

            <div className="bg-[#eef8ee] p-2.5 rounded-xl border border-[#cbe7cb] text-[11px] text-[#1b5e20] font-semibold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 shrink-0 text-[#1b5e20]" />
              <span>{lang === 'hi' ? '100% प्राकृतिक एवं बिना किसी रासायनिक नुकसान के सुरक्षित।' : '100% Organic, zero chemical residue & eco-safe.'}</span>
            </div>
          </div>
        )}

        {/* TAB CONTENT: MEDICAL TREATMENT */}
        {activeTab === 'medical' && (
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-[#1b5e20] pb-1 border-b border-[#f0e8d8]">
              <span className="text-lg">🧪</span>
              <h4 className="text-sm font-extrabold">
                {result.medicalTreatment.title}
              </h4>
            </div>

            {/* Medicine Name Card */}
            <div className="bg-[#fcfaf5] p-3.5 rounded-2xl border border-[#ede3cf] space-y-2">
              <div>
                <span className="text-[10px] font-bold uppercase text-[#887860] tracking-wider block">
                  {lang === 'hi' ? 'अनुशंसित दवा / कवकनाशी' : 'Prescribed Formula / Medicine'}
                </span>
                <p className="text-sm font-extrabold text-[#1a2f1a]">
                  {result.medicalTreatment.medicineName}
                </p>
              </div>

              {/* Exact Dosage */}
              <div className="pt-2 border-t border-[#f2e9d8]">
                <span className="text-[10px] font-bold uppercase text-[#887860] tracking-wider block">
                  {lang === 'hi' ? 'सही मात्रा व घोल' : 'Precise Dosage & Mixing'}
                </span>
                <p className="text-xs font-bold text-[#b45309] mt-0.5">
                  💧 {result.medicalTreatment.dosage}
                </p>
              </div>

              {/* Instruction */}
              <div className="pt-2 border-t border-[#f2e9d8]">
                <span className="text-[10px] font-bold uppercase text-[#887860] tracking-wider block">
                  {lang === 'hi' ? 'छिड़काव का सही समय व तरीका' : 'Application Notes'}
                </span>
                <p className="text-xs text-[#445244] font-medium mt-0.5">
                  {result.medicalTreatment.instruction}
                </p>
              </div>
            </div>

            <div className="bg-[#fff8e1] p-2.5 rounded-xl border border-[#ffe082] text-[11px] text-[#8d6e63] font-semibold flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600" />
              <span>{lang === 'hi' ? 'दवा छिड़कते समय मास्क और दस्ताने अवश्य पहनें।' : 'Always wear protective gear during chemical sprays.'}</span>
            </div>
          </div>
        )}

      </div>

      {/* 5. ACTION BUTTONS: SAVE TO RECORD BOOK & SCAN ANOTHER */}
      <div className="space-y-2.5 pt-1">
        
        {/* Save to Record Book */}
        <button
          onClick={handleSave}
          className={`w-full py-3.5 px-4 rounded-2xl font-extrabold text-sm flex items-center justify-center space-x-2 transition-all shadow-sm ${
            isSaved
              ? 'bg-[#1b5e20] text-white'
              : 'bg-[#2b271d] hover:bg-[#1b1812] text-white active:scale-98'
          }`}
        >
          {isSaved ? (
            <>
              <Check className="w-5 h-5 text-emerald-300" />
              <span>{t.result.savedAlert}</span>
            </>
          ) : (
            <>
              <BookmarkCheck className="w-5 h-5 text-amber-300" />
              <span>{t.result.saveToRecord}</span>
            </>
          )}
        </button>

        {/* Scan Another Button */}
        <button
          onClick={onScanAnother}
          className="w-full py-3.5 px-4 rounded-2xl font-bold text-sm bg-[#ece5d6] hover:bg-[#e0d7c3] text-[#2c3d2c] border border-[#d8cdb8] flex items-center justify-center space-x-2 transition-colors active:scale-98"
        >
          <RotateCcw className="w-4 h-4 text-[#1b5e20]" />
          <span>{t.result.reScan}</span>
        </button>

      </div>

    </div>
  );
}
