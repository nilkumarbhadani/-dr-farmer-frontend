import React from 'react';
import { ArrowRight, Sprout, Stethoscope } from 'lucide-react';
import farmerIllustration from '../assets/farmer-illustration.svg';

export default function SplashScreen({ lang, onGetStarted }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f7f4ed] via-[#f2ebdd] to-[#e8decb] flex flex-col items-center justify-center p-0">
      <div className="w-full max-w-md min-h-screen sm:min-h-[844px] flex flex-col justify-between relative overflow-hidden sm:rounded-[36px] sm:border sm:border-[#ded4c1] sm:shadow-2xl">

        {/* Top decorative landscape illustration area */}
        <div className="relative flex-1 flex flex-col items-center justify-center px-6 pt-10 pb-4 overflow-hidden">

          {/* Soft background blobs for depth */}
          <div className="absolute top-10 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full bg-gradient-to-br from-emerald-200/40 to-amber-200/30 blur-3xl pointer-events-none" />
          <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-sky-200/20 blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-56 h-40 bg-emerald-300/15 blur-2xl rounded-full pointer-events-none" />

          {/* Illustrated Farmer Character (real flat-design SVG artwork) */}
          <div className="relative w-64 h-64 mb-4 flex items-center justify-center z-10">
            {/* Soft glow backdrop behind the illustration */}
            <div className="absolute inset-4 rounded-full bg-gradient-to-tr from-emerald-200/50 via-amber-100/40 to-sky-100/40 blur-2xl" />

            {/* Real illustration artwork */}
            <img
              src={farmerIllustration}
              alt="Farmer with phone in a field"
              className="relative z-10 w-full h-full object-contain select-none drop-shadow-lg"
              draggable={false}
            />

            {/* Small floating feature badges around the illustration */}
            <div className="absolute top-2 left-0 w-9 h-9 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 text-white flex items-center justify-center text-base shadow-lg border-[3px] border-white animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }}>
              🌾
            </div>
            <div className="absolute top-2 right-0 w-9 h-9 rounded-full bg-gradient-to-br from-emerald-600 to-green-700 text-white flex items-center justify-center text-base shadow-lg border-[3px] border-white animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '3s' }}>
              🐄
            </div>
            <div className="absolute bottom-6 right-2 w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-base shadow-lg border-[3px] border-white animate-bounce" style={{ animationDelay: '1.5s', animationDuration: '3s' }}>
              🩺
            </div>
          </div>

          {/* App Name & Tagline */}
          <div className="text-center z-10 mb-2">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#1b5e20] to-[#2e7d32] flex items-center justify-center shadow-md">
                <Stethoscope className="w-5 h-5 text-emerald-200" />
              </div>
              <h1 className="text-3xl font-black text-[#1b2e1b] tracking-tight">
                Dr. Farmer
              </h1>
            </div>

            <h2 className="text-lg font-bold text-[#2a3d2a] leading-snug tracking-tight max-w-[300px] mx-auto">
              {lang === 'hi'
                ? 'फसल और पशु रोगों की तुरंत जांच एवं इलाज'
                : 'Instant crop & livestock disease diagnosis'}
            </h2>

            <p className="text-[13px] text-[#5c685c] font-medium mt-2 leading-relaxed max-w-[280px] mx-auto">
              {lang === 'hi'
                ? 'कैमरे से फोटो खींचें — 3 सेकंड में बीमारी पहचानें — देसी और डॉक्टरी दोनों इलाज पाएं।'
                : 'Snap a photo of any crop leaf or animal symptom — get AI-powered diagnosis with home remedies & medical treatment in seconds.'}
            </p>
          </div>

          {/* Feature Pills Grid */}
          <div className="grid grid-cols-2 gap-2.5 w-full max-w-[280px] z-10 mt-2">
            <div className="bg-white/75 backdrop-blur-sm p-3 rounded-2xl border border-white/60 shadow-sm text-center">
              <span className="text-base block">⚡</span>
              <span className="text-[11px] font-bold text-[#2a3a2a] block mt-0.5">
                {lang === 'hi' ? '3 सेकंड जांच' : '3-Sec Scan'}
              </span>
              <p className="text-[10px] text-[#637063] mt-0.5">
                {lang === 'hi' ? 'तुरंत रोग पहचान' : 'Instant disease ID'}
              </p>
            </div>
            <div className="bg-white/75 backdrop-blur-sm p-3 rounded-2xl border border-white/60 shadow-sm text-center">
              <span className="text-base block">🔊</span>
              <span className="text-[11px] font-bold text-[#2a3a2a] block mt-0.5">
                {lang === 'hi' ? 'आवाज़ सहायता' : 'Voice Guide'}
              </span>
              <p className="text-[10px] text-[#637063] mt-0.5">
                {lang === 'hi' ? 'हिंदी में सुनें' : 'Spoken audio advice'}
              </p>
            </div>
            <div className="bg-white/75 backdrop-blur-sm p-3 rounded-2xl border border-white/60 shadow-sm text-center">
              <span className="text-base block">🌿</span>
              <span className="text-[11px] font-bold text-[#2a3a2a] block mt-0.5">
                {lang === 'hi' ? 'देसी नुस्खे' : 'Home Remedies'}
              </span>
              <p className="text-[10px] text-[#637063] mt-0.5">
                {lang === 'hi' ? 'प्राकृतिक इलाज' : 'Organic solutions'}
              </p>
            </div>
            <div className="bg-white/75 backdrop-blur-sm p-3 rounded-2xl border border-white/60 shadow-sm text-center">
              <span className="text-base block">💊</span>
              <span className="text-[11px] font-bold text-[#2a3a2a] block mt-0.5">
                {lang === 'hi' ? 'डॉक्टरी दवा' : 'Medical Rx'}
              </span>
              <p className="text-[10px] text-[#637063] mt-0.5">
                {lang === 'hi' ? 'सही खुराक व दवा' : 'Vet prescriptions'}
              </p>
            </div>
          </div>

          {/* Carousel dot indicator */}
          <div className="flex space-x-1.5 mt-5 z-10">
            <div className="w-6 h-1.5 rounded-full bg-[#1b5e20]" />
            <div className="w-1.5 h-1.5 rounded-full bg-[#c8beaa]" />
            <div className="w-1.5 h-1.5 rounded-full bg-[#c8beaa]" />
          </div>
        </div>

        {/* Bottom CTA Section */}
        <div className="px-6 pb-8 pt-2 z-10">
          {/* Language toggle hint */}
          <p className="text-center text-[11px] text-[#7a6f57] font-medium mb-3">
            {lang === 'hi' ? '🇮🇳 हिंदी और English दोनों में उपलब्ध' : '🇮🇳 Available in Hindi & English'}
          </p>

          {/* Large rounded black CTA button matching reference */}
          <button
            onClick={onGetStarted}
            className="w-full py-4 px-6 rounded-full bg-[#1a1816] hover:bg-black text-white font-extrabold text-[15px] flex items-center justify-center space-x-2.5 shadow-xl shadow-black/25 active:scale-[0.97] transition-all group"
          >
            <span>{lang === 'hi' ? 'शुरू करें' : 'Get Started'}</span>
            <ArrowRight className="w-5 h-5 text-emerald-400 group-hover:translate-x-0.5 transition-transform" />
          </button>

          {/* Trust footer */}
          <p className="text-center text-[10px] text-[#9a8e7a] font-medium mt-3">
            {lang === 'hi'
              ? 'भारतीय कृषि अनुसंधान परिषद (ICAR) दिशानिर्देशों पर आधारित'
              : 'Powered by AI • Built for Indian farmers'}
          </p>
        </div>

      </div>
    </div>
  );
}
