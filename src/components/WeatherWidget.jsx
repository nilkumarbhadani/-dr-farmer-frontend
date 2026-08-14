import React from 'react';
import { Sun, CloudSun, Droplets, Wind, Thermometer, Sparkles } from 'lucide-react';
import { TRANSLATIONS } from '../data/translations';

export default function WeatherWidget({ lang }) {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#fbf3e4] via-[#f7ecd5] to-[#ebdcc2] p-4 text-[#2b271d] shadow-sm border border-[#e5d8be]">
      {/* Decorative sun & landscape graphic background */}
      <div className="absolute top-2 right-4 opacity-75 pointer-events-none">
        <div className="relative">
          <div className="w-14 h-14 rounded-full bg-amber-400/30 blur-lg absolute -inset-1" />
          <Sun className="w-10 h-10 text-amber-500 animate-spin" style={{ animationDuration: '24s' }} />
        </div>
      </div>

      {/* Top weather banner */}
      <div className="flex items-start justify-between relative z-10 mb-3.5">
        <div>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-3xl font-extrabold tracking-tight text-[#222]">
              27°C
            </span>
            <span className="text-xs font-semibold text-[#665e4d]">
              {t.weather.condition}
            </span>
          </div>
          <p className="text-[12px] font-medium text-[#7a6f57] flex items-center gap-1 mt-0.5">
            <CloudSun className="w-3.5 h-3.5 text-amber-600 inline" />
            <span>{lang === 'hi' ? 'खेत कार्य के लिए अनुकूल' : 'Optimal for field inspection'}</span>
          </p>
        </div>
      </div>

      {/* 3 Metric Pills matching reference design */}
      <div className="grid grid-cols-3 gap-2 relative z-10">
        
        {/* Humidity */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-2.5 text-center border border-white/60 shadow-xs">
          <span className="block text-[11px] font-semibold text-[#5c5545] mb-1">
            {t.weather.humidity}
          </span>
          <span className="inline-block bg-[#e8f5e9] text-[#1b5e20] text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-[#c8e6c9]">
            {t.weather.good}
          </span>
        </div>

        {/* Soil Moisture */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-2.5 text-center border border-white/60 shadow-xs">
          <span className="block text-[11px] font-semibold text-[#5c5545] mb-1">
            {t.weather.soilMoisture}
          </span>
          <span className="inline-block bg-[#e8f5e9] text-[#1b5e20] text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-[#c8e6c9]">
            {t.weather.good}
          </span>
        </div>

        {/* Precipitation */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-2.5 text-center border border-white/60 shadow-xs">
          <span className="block text-[11px] font-semibold text-[#5c5545] mb-1">
            {t.weather.precipitation}
          </span>
          <span className="inline-block bg-[#fff3e0] text-[#e65100] text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-[#ffe0b2]">
            {t.weather.low}
          </span>
        </div>

      </div>
    </div>
  );
}
