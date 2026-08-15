import React from 'react';
import { Home, Camera, BookOpen, PhoneCall, Sparkles } from 'lucide-react';
import { TRANSLATIONS } from '../data/translations';

export default function BottomNav({ activeScreen, onChangeScreen, lang }) {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  const navItems = [
    {
      id: 'home',
      label: t.nav.home,
      icon: Home
    },
    {
      id: 'scan',
      label: t.nav.scan,
      icon: Camera,
      isSpecial: true
    },
    {
      id: 'records',
      label: t.nav.records,
      icon: BookOpen
    },
    {
      id: 'expert',
      label: t.nav.expert,
      icon: PhoneCall
    }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#fcfaf6]/95 backdrop-blur-lg border-t border-[#e5dcce] py-1 px-4 shadow-lg shadow-black/5">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeScreen === item.id;

          if (item.isSpecial) {
            return (
              <button
                key={item.id}
                onClick={() => onChangeScreen('scan')}
                className="group relative -top-3 flex flex-col items-center focus:outline-none"
                aria-label="Scan Crop or Cattle"
              >
                <div className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg transition-transform active:scale-90 ${
                  isActive 
                    ? 'bg-[#1b5e20] ring-4 ring-emerald-300 shadow-green-900/40' 
                    : 'bg-gradient-to-tr from-[#1b5e20] to-[#2e7d32] ring-4 ring-[#fcfaf6] shadow-green-900/30 group-hover:scale-105'
                }`}>
                  <Camera className="w-7 h-7 text-white stroke-[2.2]" />
                </div>
                <span className="text-[11px] font-extrabold text-[#1b5e20] mt-0.5 tracking-tight">
                  {item.label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => onChangeScreen(item.id)}
              className={`flex-1 py-1.5 flex flex-col items-center justify-center transition-all rounded-2xl active:scale-95 ${
                isActive
                  ? 'text-[#1b5e20] font-bold'
                  : 'text-[#6c7d6c] hover:text-[#2d472d]'
              }`}
            >
              <div className={`p-1 rounded-xl transition-colors ${
                isActive ? 'bg-[#e8f5e9]' : ''
              }`}>
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5] text-[#1b5e20]' : 'stroke-[1.8]'}`} />
              </div>
              <span className={`text-[10px] tracking-tight mt-0.5 ${
                isActive ? 'font-black text-[#1b5e20]' : 'font-semibold'
              }`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
