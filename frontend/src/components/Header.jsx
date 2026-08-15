import React, { useState } from 'react';
import { Volume2, HelpCircle, Mic, Globe, Check, X, Server, ShieldCheck, Database, Cpu } from 'lucide-react';
import { TRANSLATIONS, SUPPORTED_LANGUAGES } from '../data/translations';
import logo from '../assets/logo.png';

export default function Header({ 
  lang, 
  setLang, 
  isSpeaking, 
  onToggleVoice, 
  onOpenOnboarding,
  onOpenVoiceModal,
  backendStatus = { plant_model_loaded: true, livestock_model_loaded: true, supabase_connected: true, offline: false }
}) {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;
  const isOnline = !backendStatus?.offline;
  const [showStatusModal, setShowStatusModal] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-[#fbf9f4]/95 backdrop-blur-md border-b border-[#e7e1d4] px-3 pt-2.5 pb-2 transition-all">
      <div className="max-w-md mx-auto space-y-2">
        
        {/* Top Row: Brand Avatar, Title, AI Status & Action Controls */}
        <div className="flex items-center justify-between gap-2">
          
          {/* Left: Farm Brand / Avatar */}
          <div className="flex items-center space-x-2 min-w-0 flex-1">
            <img 
              src={logo} 
              alt="Dr. Farmer Logo" 
              className="w-8 h-8 rounded-full object-cover shadow-sm shadow-green-900/20 ring-2 ring-[#2e7d32]/30 shrink-0 transform hover:scale-105 transition-transform"
            />
            <div className="min-w-0">
              <div className="flex items-center space-x-1.5">
                <span className="text-[14px] font-black tracking-tight text-[#163816] leading-tight truncate">
                  {t.appName}
                </span>

                
                {/* Interactive AI Status Badge */}
                <button
                  onClick={() => setShowStatusModal(true)}
                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border flex items-center gap-1 transition-transform active:scale-95 shrink-0 ${
                    isOnline
                      ? 'bg-[#e8f5e9] text-[#1b5e20] border-[#c8e6c9]'
                      : 'bg-amber-100 text-amber-800 border-amber-300'
                  }`}
                  title="View AI Engine & Backend Status"
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-emerald-600 animate-pulse' : 'bg-amber-600'}`} />
                  <span>{isOnline ? 'AI 2.0' : 'Offline'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Action Controls: Mic, Speaker & Help */}
          <div className="flex items-center space-x-1 shrink-0">
            
            {/* AI Voice Mic Command Button */}
            <button
              onClick={onOpenVoiceModal}
              className="p-1.5 text-amber-900 bg-amber-100/90 hover:bg-amber-200 active:scale-90 rounded-full transition-all border border-amber-300 shadow-xs flex items-center justify-center"
              title="AI Voice Command"
            >
              <Mic className="w-3.5 h-3.5 text-amber-800" />
            </button>

            {/* Voice Speaker Button */}
            <button
              onClick={onToggleVoice}
              aria-label="Toggle Voice Reader"
              className={`p-1.5 rounded-full text-xs font-bold transition-all shadow-xs active:scale-90 flex items-center justify-center ${
                isSpeaking
                  ? 'bg-[#1b5e20] text-white animate-pulse ring-2 ring-[#81c784]'
                  : 'bg-[#ede7da] text-[#2c4c2c] hover:bg-[#e2dacf] border border-[#dcd2be]'
              }`}
              title="Read aloud"
            >
              <Volume2 className={`w-3.5 h-3.5 ${isSpeaking ? 'text-emerald-300 animate-bounce' : 'text-[#1b5e20]'}`} />
            </button>

            {/* Info / Onboarding Guide */}
            <button
              onClick={onOpenOnboarding}
              className="p-1.5 text-[#4a584a] hover:text-[#1b5e20] bg-[#ede7da] hover:bg-[#e2dacf] rounded-full transition-colors active:scale-90 border border-[#dcd2be]"
              title="App Guide"
            >
              <HelpCircle className="w-3.5 h-3.5" />
            </button>

          </div>
        </div>

        {/* Bottom Row: Direct 1-Tap Language Buttons for ALL Languages */}
        <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar py-0.5 scroll-smooth">
          <div className="flex items-center gap-1 shrink-0 pr-1 text-[10px] font-bold text-[#637060]">
            <Globe className="w-3 h-3 text-[#1b5e20]" />
            <span>भाषा:</span>
          </div>

          {SUPPORTED_LANGUAGES.map((item) => {
            const isSelected = lang === item.code;
            return (
              <button
                key={item.code}
                onClick={() => setLang(item.code)}
                className={`px-2.5 py-1 rounded-full text-[11px] font-black shrink-0 transition-all flex items-center space-x-1 active:scale-95 ${
                  isSelected
                    ? 'bg-[#1b5e20] text-white shadow-sm ring-1 ring-emerald-400'
                    : 'bg-white/80 hover:bg-white text-[#2c4c2c] border border-[#dcd2be] hover:border-emerald-300'
                }`}
                title={`Switch to ${item.name}`}
              >
                <span className="text-xs leading-none">{item.flag}</span>
                <span>{item.nativeName}</span>
              </button>
            );
          })}
        </div>

      </div>

      {/* BACKEND ENGINE STATUS MODAL */}
      {showStatusModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="w-full max-w-xs bg-white rounded-3xl p-5 shadow-2xl border border-[#ded5c2] relative">
            
            <div className="flex items-center justify-between pb-3 border-b border-[#eee7da] mb-3">
              <div className="flex items-center space-x-2">
                <Server className="w-5 h-5 text-[#1b5e20]" />
                <h3 className="text-base font-extrabold text-[#193319]">
                  Backend Engine Status
                </h3>
              </div>
              <button 
                onClick={() => setShowStatusModal(false)}
                className="w-7 h-7 rounded-full bg-[#f0e9dc] hover:bg-[#e4dcce] flex items-center justify-center text-[#334233]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 my-2 text-xs">
              
              {/* Plant Model */}
              <div className="p-3 bg-[#faf8f2] rounded-2xl border border-[#ede3d4] flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <Cpu className="w-4 h-4 text-emerald-700" />
                  <div>
                    <span className="font-bold text-[#1a2f1a] block">Plant AI Model</span>
                    <span className="text-[10px] text-[#6b7b6b] block">TFLite / Keras Interpreter</span>
                  </div>
                </div>
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${
                  backendStatus.plant_model_loaded
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                    : 'bg-amber-100 text-amber-800 border-amber-300'
                }`}>
                  {backendStatus.plant_model_loaded ? 'TFLite Active' : 'Ready (Mock)'}
                </span>
              </div>

              {/* Livestock Model */}
              <div className="p-3 bg-[#faf8f2] rounded-2xl border border-[#ede3d4] flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <Cpu className="w-4 h-4 text-amber-700" />
                  <div>
                    <span className="font-bold text-[#1a2f1a] block">Livestock AI Model</span>
                    <span className="text-[10px] text-[#6b7b6b] block">TFLite / Keras Interpreter</span>
                  </div>
                </div>
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${
                  backendStatus.livestock_model_loaded
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                    : 'bg-amber-100 text-amber-800 border-amber-300'
                }`}>
                  {backendStatus.livestock_model_loaded ? 'TFLite Active' : 'Ready (Mock)'}
                </span>
              </div>

              {/* Supabase */}
              <div className="p-3 bg-[#faf8f2] rounded-2xl border border-[#ede3d4] flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <Database className="w-4 h-4 text-sky-700" />
                  <div>
                    <span className="font-bold text-[#1a2f1a] block">Supabase Cloud DB</span>
                    <span className="text-[10px] text-[#6b7b6b] block">PostgreSQL / Storage</span>
                  </div>
                </div>
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${
                  backendStatus.supabase_connected
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                    : 'bg-[#f0e9dc] text-[#5c685c] border-[#ded5c2]'
                }`}>
                  {backendStatus.supabase_connected ? 'Connected' : 'Offline Mode'}
                </span>
              </div>

            </div>

            <button
              onClick={() => setShowStatusModal(false)}
              className="w-full mt-2 py-2.5 bg-[#1b5e20] text-white font-extrabold text-xs rounded-xl shadow-xs"
            >
              Close
            </button>

          </div>
        </div>
      )}

    </header>
  );
}
