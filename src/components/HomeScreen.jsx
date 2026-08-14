import React from 'react';
import { 
  Sprout, 
  Sparkles, 
  BookOpen, 
  PhoneCall, 
  ShieldCheck, 
  ChevronRight, 
  Camera, 
  CheckCircle2, 
  AlertCircle,
  Volume2
} from 'lucide-react';
import WeatherWidget from './WeatherWidget';
import { TRANSLATIONS } from '../data/translations';
import { QUICK_TIPS } from '../data/diseases';

export default function HomeScreen({ 
  lang, 
  onNavigateToScan, 
  onNavigateToRecords, 
  onOpenExpertModal,
  onSpeakText,
  records = []
}) {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  const handleReadScreen = () => {
    const speech = lang === 'hi'
      ? "मुख्य पृष्ठ। फसल की जांच के लिए हरे पत्ते वाले बटन पर दबाएं। पशु या गाय की जांच के लिए गाय वाले बटन पर दबाएं। नीचे किसान रिकॉर्ड बुक है।"
      : "Home Screen. Tap the green Crop Check card for leaf and plant issues. Tap the Cattle Check card for cow and livestock problems. Tap below for your Record Book.";
    onSpeakText(speech);
  };

  // Recent record snippet
  const recentRecord = records && records.length > 0 ? records[0] : null;

  return (
    <div className="space-y-4 pb-24">
      
      {/* 1. Weather Info Widget */}
      <WeatherWidget lang={lang} />

      {/* Screen Audio Guidance Hint for Low Literacy */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#1b5e20] animate-ping" />
          <h2 className="text-base font-bold text-[#1a2f1a] tracking-tight">
            {t.home.title}
          </h2>
        </div>
        <button 
          onClick={handleReadScreen}
          className="p-1 text-[#2d572d] hover:bg-[#e7e0ce] rounded-full transition-colors flex items-center gap-1 text-xs font-semibold"
          title="Audio guidance"
        >
          <Volume2 className="w-4 h-4 text-[#1b5e20]" />
          <span className="text-[11px] text-[#2d572d]">{lang === 'hi' ? 'सुनें' : 'Listen'}</span>
        </button>
      </div>

      {/* 2. TWO HERO CARDS: CROP CHECK & CATTLE CHECK (Large, Finger-friendly) */}
      <div className="grid grid-cols-1 gap-3.5">
        
        {/* CARD 1: CROP CHECK (Earthy Green Palette) */}
        <button
          onClick={() => onNavigateToScan('crop')}
          className="w-full text-left bg-gradient-to-br from-[#1b5e20] via-[#1e6624] to-[#154a1a] text-white p-5 rounded-3xl shadow-md hover:shadow-lg transition-all transform active:scale-[0.98] relative overflow-hidden group border border-[#2e7d32]"
        >
          {/* Decorative background glow & leaf silhouette */}
          <div className="absolute -right-4 -bottom-6 w-32 h-32 opacity-15 pointer-events-none group-hover:scale-110 transition-transform">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full text-white">
              <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8z"/>
            </svg>
          </div>

          <div className="flex items-center space-x-4 relative z-10">
            {/* Big Icon Container */}
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white ring-4 ring-white/10 shrink-0 shadow-inner">
              <Sprout className="w-9 h-9 text-emerald-200" />
            </div>

            <div className="flex-1 pr-2">
              <div className="flex items-center space-x-2">
                <span className="text-xl font-extrabold tracking-tight text-white">
                  {t.home.cropCheck}
                </span>
                <span className="bg-emerald-300/30 text-emerald-100 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-300/40">
                  {lang === 'hi' ? 'कैमरा जांच' : 'Camera Scan'}
                </span>
              </div>
              <p className="text-[13px] text-emerald-100/90 font-normal mt-1 leading-snug">
                {t.home.cropDesc}
              </p>
            </div>

            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white shrink-0 group-hover:translate-x-0.5 transition-transform">
              <Camera className="w-5 h-5 text-white" />
            </div>
          </div>
        </button>

        {/* CARD 2: CATTLE CHECK (Warm Earthy Terracotta/Amber Palette) */}
        <button
          onClick={() => onNavigateToScan('cattle')}
          className="w-full text-left bg-gradient-to-br from-[#b45309] via-[#c2410c] to-[#9a3412] text-white p-5 rounded-3xl shadow-md hover:shadow-lg transition-all transform active:scale-[0.98] relative overflow-hidden group border border-[#ea580c]"
        >
          {/* Decorative cattle icon silhouette */}
          <div className="absolute -right-2 -bottom-4 w-32 h-32 opacity-15 pointer-events-none group-hover:scale-110 transition-transform">
            <span className="text-8xl">🐄</span>
          </div>

          <div className="flex items-center space-x-4 relative z-10">
            {/* Big Icon Container */}
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white ring-4 ring-white/10 shrink-0 shadow-inner">
              <span className="text-3xl">🐮</span>
            </div>

            <div className="flex-1 pr-2">
              <div className="flex items-center space-x-2">
                <span className="text-xl font-extrabold tracking-tight text-white">
                  {t.home.cattleCheck}
                </span>
                <span className="bg-orange-300/30 text-amber-100 text-[10px] font-bold px-2 py-0.5 rounded-full border border-orange-300/40">
                  {lang === 'hi' ? 'पशु रोग' : 'Livestock'}
                </span>
              </div>
              <p className="text-[13px] text-amber-100/90 font-normal mt-1 leading-snug">
                {t.home.cattleDesc}
              </p>
            </div>

            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white shrink-0 group-hover:translate-x-0.5 transition-transform">
              <Camera className="w-5 h-5 text-white" />
            </div>
          </div>
        </button>

      </div>

      {/* 3. RECORD BOOK QUICK CARD & EXPERT ACCESS */}
      <div className="bg-white rounded-3xl p-4 shadow-sm border border-[#e6dece]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#eef6ee] flex items-center justify-center text-[#1b5e20] border border-[#d1e7d1]">
              <BookOpen className="w-5 h-5 text-[#1b5e20]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#1f381f]">
                {t.home.recordBook}
              </h3>
              <p className="text-[11px] text-[#6b7a6b]">
                {t.home.recordDesc}
              </p>
            </div>
          </div>

          <button
            onClick={onNavigateToRecords}
            className="text-xs font-bold text-[#1b5e20] hover:text-[#144718] flex items-center bg-[#f0f6ee] hover:bg-[#e4efe2] px-2.5 py-1.5 rounded-xl border border-[#cfe2ce] transition-colors"
          >
            <span>{t.home.viewAll}</span>
            <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
          </button>
        </div>

        {/* Recent log item preview if exists */}
        {recentRecord && (
          <div 
            onClick={onNavigateToRecords}
            className="cursor-pointer bg-[#f9f7f2] hover:bg-[#f2efe7] rounded-2xl p-3 border border-[#ede6d8] flex items-center justify-between transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${
                recentRecord.severity === 'urgent' ? 'bg-red-500' :
                recentRecord.severity === 'caution' ? 'bg-amber-500' : 'bg-emerald-500'
              }`} />
              <div>
                <p className="text-xs font-bold text-[#2a382a] line-clamp-1">
                  {lang === 'hi' ? recentRecord.titleHi : recentRecord.title}
                </p>
                <p className="text-[11px] text-[#718071]">
                  {recentRecord.date} • {recentRecord.diseaseName}
                </p>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-[#334433] border border-[#dfd7c7]">
              {recentRecord.status}
            </span>
          </div>
        )}
      </div>

      {/* 4. EMERGENCY VET / KRISHI HELPLINE BANNER */}
      <div 
        onClick={onOpenExpertModal}
        className="cursor-pointer bg-gradient-to-r from-[#212529] to-[#343a40] text-white p-4 rounded-3xl shadow-sm border border-neutral-700 flex items-center justify-between hover:bg-neutral-800 transition-all active:scale-[0.99]"
      >
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <PhoneCall className="w-5 h-5 text-amber-400 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <p className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                {lang === 'hi' ? 'मुफ्त किसान हेल्पलाइन' : 'Free Farmer Helpline'}
              </p>
            </div>
            <p className="text-sm font-extrabold text-white mt-0.5">
              1800-180-1551 (Kisan Call Center)
            </p>
          </div>
        </div>
        <div className="px-3 py-1.5 bg-amber-400 text-neutral-950 font-bold text-xs rounded-xl shadow-xs">
          {lang === 'hi' ? 'कॉल करें' : 'Call Free'}
        </div>
      </div>

      {/* 5. QUICK FARMING PRACTICES TIP */}
      <div className="bg-[#f0ece1] rounded-2xl p-3 border border-[#ded5c2] flex items-start space-x-2.5">
        <span className="text-xl">💡</span>
        <div className="text-xs text-[#4b4334]">
          <span className="font-bold text-[#2d2516]">
            {lang === 'hi' ? QUICK_TIPS[0].titleHi : QUICK_TIPS[0].title}:
          </span>{' '}
          <span>{QUICK_TIPS[0].desc}</span>
        </div>
      </div>

    </div>
  );
}
