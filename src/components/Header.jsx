import React from 'react';
import { Volume2, VolumeX, Globe, Sparkles, User, HelpCircle } from 'lucide-react';
import { TRANSLATIONS } from '../data/translations';

export default function Header({ 
  lang, 
  setLang, 
  isSpeaking, 
  onToggleVoice, 
  onOpenOnboarding,
  onOpenExpertModal 
}) {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  return (
    <header className="sticky top-0 z-30 bg-[#fbf9f4]/95 backdrop-blur-md border-b border-[#e7e1d4] px-4 py-3 transition-all">
      <div className="max-w-md mx-auto flex items-center justify-between">
        
        {/* Left: Farm Brand / Avatar */}
        <div className="flex items-center space-x-2.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#1b5e20] to-[#2e7d32] flex items-center justify-center text-white shadow-sm shadow-green-900/20 ring-2 ring-[#e2d8c3]">
            <span className="text-xl leading-none">🌾</span>
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="text-[15px] font-bold tracking-tight text-[#163816] leading-tight">
                {t.appName}
              </span>
              <span className="bg-[#e8f5e9] text-[#1b5e20] text-[10px] font-semibold px-1.5 py-0.5 rounded-full border border-[#c8e6c9]">
                AI 3.0
              </span>
            </div>
            <p className="text-[11px] text-[#637060] font-medium leading-none mt-0.5">
              {t.farmName}
            </p>
          </div>
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center space-x-1.5">
          
          {/* Voice Speaker Button - High Priority for Low-Literacy */}
          <button
            onClick={onToggleVoice}
            aria-label="Toggle Voice Reader"
            className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-full text-xs font-bold transition-all shadow-sm ${
              isSpeaking
                ? 'bg-[#1b5e20] text-white animate-pulse ring-2 ring-[#81c784]'
                : 'bg-[#ede7da] text-[#2c4c2c] hover:bg-[#e2dacf]'
            }`}
            title="Read out page content aloud"
          >
            {isSpeaking ? (
              <>
                <Volume2 className="w-4 h-4 text-emerald-300 animate-bounce" />
                <span className="text-[11px] tracking-wide">{lang === 'hi' ? 'बोल रहा है' : 'Speaking'}</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4 text-[#1b5e20]" />
                <span className="text-[11px]">{t.voiceAssistant}</span>
              </>
            )}
          </button>

          {/* Clear Segmented Language Switcher */}
          <div className="flex items-center bg-[#ede7da] p-0.5 rounded-full border border-[#dcd2be] shadow-inner">
            <button
              onClick={() => setLang('hi')}
              className={`px-2.5 py-1 rounded-full text-xs font-extrabold transition-all ${
                lang === 'hi'
                  ? 'bg-[#1b5e20] text-white shadow-xs'
                  : 'text-[#4c5c4c] hover:text-[#1b5e20]'
              }`}
              title="हिंदी चुनें"
            >
              हिंदी
            </button>
            <button
              onClick={() => setLang('en')}
              className={`px-2.5 py-1 rounded-full text-xs font-extrabold transition-all ${
                lang === 'en'
                  ? 'bg-[#1b5e20] text-white shadow-xs'
                  : 'text-[#4c5c4c] hover:text-[#1b5e20]'
              }`}
              title="Select English"
            >
              EN
            </button>
          </div>

          {/* Info / Onboarding Guide */}
          <button
            onClick={onOpenOnboarding}
            className="p-1.5 text-[#4a584a] hover:text-[#1b5e20] bg-[#ede7da] hover:bg-[#e2dacf] rounded-full transition-colors"
            title="App Guide"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

        </div>
      </div>
    </header>
  );
}
