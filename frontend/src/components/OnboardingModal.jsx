import React from 'react';
import { ArrowRight, Sprout, ShieldCheck, HeartPulse, Sparkles, Volume2 } from 'lucide-react';

export default function OnboardingModal({ isOpen, onClose, lang }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 animate-fadeIn">
      <div className="w-full max-w-sm bg-gradient-to-b from-[#f7f3ea] via-[#f4eee2] to-[#e8decb] rounded-[36px] overflow-hidden shadow-2xl border border-[#ded4c1] relative flex flex-col justify-between max-h-[95vh]">
        
        {/* Top Decorative Header Area with Friendly Farmer Illustration Art */}
        <div className="relative pt-6 pb-2 px-6 flex flex-col items-center text-center">
          
          {/* Status bar simulated timestamp */}
          <div className="w-full flex justify-between items-center text-[11px] font-bold text-[#625949] mb-3">
            <span>9:41</span>
            <div className="flex items-center space-x-1">
              <span>📶</span>
              <span>🔋 100%</span>
            </div>
          </div>

          {/* Illustrated Farmer Visual Graphic matching screenshot */}
          <div className="relative w-44 h-44 mb-2 flex items-center justify-center">
            {/* Background circular field aura */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-emerald-200/60 to-amber-200/60 blur-md" />
            <div className="relative z-10 w-36 h-36 rounded-full bg-gradient-to-b from-[#81c784] to-[#388e3c] border-4 border-white shadow-lg flex flex-col items-center justify-center overflow-hidden">
              {/* Illustrated scenery / farmer badge */}
              <div className="text-6xl select-none transform hover:scale-110 transition-transform">
                👨‍🌾
              </div>
              <div className="absolute bottom-0 inset-x-0 bg-black/20 py-0.5 text-center">
                <span className="text-[10px] font-extrabold text-white tracking-widest uppercase">
                  Dr. Farmer
                </span>
              </div>
            </div>

            {/* Orbiting feature badges like the screenshot */}
            <div className="absolute top-1 left-2 w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center text-xs shadow-md border-2 border-white">
              🌱
            </div>
            <div className="absolute top-1 right-2 w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs shadow-md border-2 border-white">
              🐄
            </div>
            <div className="absolute bottom-3 left-1 w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs shadow-md border-2 border-white">
              📱
            </div>
            <div className="absolute bottom-3 right-1 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs shadow-md border-2 border-white">
              🩺
            </div>
          </div>

          {/* Heading */}
          <h2 className="text-2xl font-black text-[#1b2e1b] tracking-tight leading-snug">
            {lang === 'hi' ? 'डॉ. फार्मर — फसल और पशु रोगों का AI सलाहकार' : 'Dr. Farmer — AI-Powered Crop & Livestock Advisory'}
          </h2>
          
          <p className="text-xs text-[#5c685c] font-medium mt-1.5 leading-relaxed max-w-[280px]">
            {lang === 'hi'
              ? 'आसान फोटो जांच द्वारा फसल और गाय-भैंस के रोगों की तुरंत देसी व सही डॉक्टरी सलाह।'
              : 'Instant AI advisory and natural remedies for your crops and livestock with zero complexity.'}
          </p>

          {/* Carousel dots indicator */}
          <div className="flex space-x-1.5 mt-3">
            <div className="w-5 h-1.5 rounded-full bg-[#1b5e20]" />
            <div className="w-1.5 h-1.5 rounded-full bg-[#c8beaa]" />
            <div className="w-1.5 h-1.5 rounded-full bg-[#c8beaa]" />
          </div>

        </div>

        {/* Feature Pills */}
        <div className="px-6 py-2 grid grid-cols-2 gap-2 text-left">
          <div className="bg-white/80 backdrop-blur-xs p-2.5 rounded-2xl border border-white/60 shadow-2xs">
            <span className="text-sm">⚡ 3-Sec Scan</span>
            <p className="text-[10px] text-[#637063] mt-0.5">Instant disease ID</p>
          </div>
          <div className="bg-white/80 backdrop-blur-xs p-2.5 rounded-2xl border border-white/60 shadow-2xs">
            <span className="text-sm">🔊 Voice Guide</span>
            <p className="text-[10px] text-[#637063] mt-0.5">Spoken audio advice</p>
          </div>
        </div>

        {/* Large Rounded Black CTA Button matching reference image */}
        <div className="p-6 pt-2">
          <button
            onClick={onClose}
            className="w-full py-4 px-6 rounded-full bg-[#171614] hover:bg-black text-white font-extrabold text-sm flex items-center justify-center space-x-2 shadow-xl shadow-black/25 active:scale-95 transition-all"
          >
            <span>{lang === 'hi' ? 'शुरू करें' : 'Get Started'}</span>
            <ArrowRight className="w-4 h-4 text-emerald-400" />
          </button>
        </div>

      </div>
    </div>
  );
}
