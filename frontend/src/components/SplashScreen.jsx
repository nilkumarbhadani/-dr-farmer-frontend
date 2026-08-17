import React, { useState } from 'react';
import { 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  ShieldCheck, 
  Volume2, 
  Camera, 
  Leaf, 
  HeartPulse, 
  AlertTriangle, 
  CheckCircle2, 
  Globe,
  Stethoscope
} from 'lucide-react';
import logo from '../assets/logo.png';
import { SUPPORTED_LANGUAGES } from '../data/translations';

export default function SplashScreen({ lang = 'en', setLang, onGetStarted }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const isHi = lang === 'hi';

  const slides = [
    // SLIDE 1 — AI DIAGNOSIS
    {
      badge: isHi ? 'एआई जांच' : 'AI Diagnosis',
      badgeIcon: <Sparkles className="w-3 h-3 text-emerald-600" />,
      title: isHi 
        ? 'फसल और पशु रोगों की तुरंत पहचान' 
        : 'Instant Crop & Livestock Diagnosis',
      description: isHi
        ? 'फसल की पत्ती या पशु के लक्षणों की फोटो लें और कुछ ही सेकंड में एआई द्वारा बीमारी का पता लगाएं।'
        : 'Snap a photo of a crop leaf or animal symptom and get AI-powered disease insights in seconds.',
      features: [
        {
          icon: <Sparkles className="w-4 h-4 text-emerald-600" />,
          title: isHi ? '3-सेकंड त्वरित स्कैन' : '3-Sec AI Scan',
          desc: isHi ? 'कैमरे से तुरंत AI विश्लेषण' : 'Instant camera & gallery analysis'
        },
        {
          icon: <Leaf className="w-4 h-4 text-green-700" />,
          title: isHi ? 'फसल व पशु रोग पहचान' : 'Crop & Livestock Detection',
          desc: isHi ? '38+ फसलें एवं मवेशी लक्षण' : '38+ crops & cattle health conditions'
        },
        {
          icon: <HeartPulse className="w-4 h-4 text-rose-600" />,
          title: isHi ? 'सटीक रोग निदान' : 'Disease Identification',
          desc: isHi ? 'लक्षणों की तुरंत सही पहचान' : 'Accurate visual symptom detection'
        }
      ]
    },

    // SLIDE 2 — SMART & SAFE GUIDANCE
    {
      badge: isHi ? 'सुरक्षित मार्गदर्शन' : 'Smart & Safe Guidance',
      badgeIcon: <ShieldCheck className="w-3 h-3 text-blue-600" />,
      title: isHi 
        ? 'हर जांच पर सटीक व सुरक्षित सलाह' 
        : 'Smart Guidance for Every Scan',
      description: isHi
        ? 'कॉन्फिडेंस स्कोर, सुरक्षित देसी नुस्खे और उपचार गाइड के साथ खेती के बेहतर और सुरक्षित फैसले लें।'
        : 'Get confidence-aware results, practical home remedies, and treatment guidance designed for safer farming decisions.',
      features: [
        {
          icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" />,
          title: isHi ? 'सटीकता स्कोर' : 'Confidence Score',
          desc: isHi ? 'हर परिणाम पर स्पष्ट सटीकता' : 'Full transparency on scan certainty'
        },
        {
          icon: <Leaf className="w-4 h-4 text-amber-600" />,
          title: isHi ? 'देसी नुस्खे' : 'Home Remedies',
          desc: isHi ? 'कम लागत वाले प्राकृतिक उपचार' : 'Zero-cost organic natural treatments'
        },
        {
          icon: <Stethoscope className="w-4 h-4 text-teal-600" />,
          title: isHi ? 'दवा व उपचार गाइड' : 'Treatment Guidance',
          desc: isHi ? 'अनुमोदित सुरक्षित रासायनिक दवाएं' : 'Safe veterinary & agricultural advisory'
        },
        {
          icon: <AlertTriangle className="w-4 h-4 text-amber-600" />,
          title: isHi ? 'सुरक्षा चेतावनी' : 'Low-Confidence Safety Alerts',
          desc: isHi ? 'संदेह होने पर गलत सलाह नहीं' : 'Alerts user when photo is unclear'
        }
      ]
    },

    // SLIDE 3 — VOICE & FARMER-FRIENDLY
    {
      badge: isHi ? 'भारतीय किसान हितैषी' : 'Built for Indian Farmers',
      badgeIcon: <Volume2 className="w-3 h-3 text-amber-600" />,
      title: isHi 
        ? 'भारतीय किसानों के लिए विशेष रूप से निर्मित' 
        : 'Built for Indian Farmers',
      description: isHi
        ? 'सरल भाषा, आवाज़ में सलाह (Voice Guide) और अपनी स्थानीय भाषा में सम्पूर्ण मार्गदर्शन पाएं।'
        : 'Understand your diagnosis with simple language, voice guidance, and regional-language support.',
      features: [
        {
          icon: <Volume2 className="w-4 h-4 text-amber-600" />,
          title: isHi ? 'बोलकर सलाह (Voice Guide)' : 'Voice Guide',
          desc: isHi ? 'एक टैप में पूरी रिपोर्ट सुनें' : 'Audio read-aloud in regional tongues'
        },
        {
          icon: <Globe className="w-4 h-4 text-blue-600" />,
          title: isHi ? 'हिंदी और अंग्रेजी' : 'Hindi & English',
          desc: isHi ? 'क्षेत्रीय भाषाओं का आसान विकल्प' : 'Multiple Indian language options'
        },
        {
          icon: <Sparkles className="w-4 h-4 text-emerald-600" />,
          title: isHi ? 'सरल किसान-हितैषी सलाह' : 'Simple Farmer-Friendly Advice',
          desc: isHi ? 'आसान व व्यावहारिक समाधान' : 'Jargon-free practical solutions'
        }
      ]
    }
  ];

  const minSwipeDistance = 45;

  const onTouchStartHandler = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMoveHandler = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEndHandler = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && currentStep < slides.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
    if (isRightSwipe && currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentStep < slides.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      triggerGetStarted();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const triggerGetStarted = () => {
    if (isExiting) return;
    setIsExiting(true);
    // Premium 320ms micro-animation before navigating to main app
    setTimeout(() => {
      onGetStarted();
    }, 320);
  };

  const currentSlide = slides[currentStep];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f7f4ed] via-[#f2ebdd] to-[#e8decb] flex flex-col items-center justify-center p-0 sm:py-6 selection:bg-emerald-200">
      
      {/* Main Card Container */}
      <div 
        className={`w-full max-w-md min-h-screen sm:min-h-[810px] bg-[#fbf9f4] flex flex-col justify-between relative overflow-hidden sm:rounded-[36px] sm:border sm:border-[#ded4c1] sm:shadow-2xl transition-all duration-300 ${
          isExiting ? 'opacity-0 scale-[0.98] translate-y-1' : 'opacity-100 scale-100'
        }`}
        onTouchStart={onTouchStartHandler}
        onTouchMove={onTouchMoveHandler}
        onTouchEnd={onTouchEndHandler}
      >

        {/* Ambient subtle backdrop glows */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full bg-emerald-200/35 blur-3xl pointer-events-none" />
        <div className="absolute top-0 right-0 w-36 h-36 rounded-full bg-amber-200/30 blur-2xl pointer-events-none" />
        <div className="absolute bottom-12 left-0 w-44 h-44 rounded-full bg-lime-200/25 blur-3xl pointer-events-none" />

        {/* TOP BAR: Brand indicator, Language Selector & Skip */}
        <div className="relative z-20 pt-4 px-5 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center space-x-1 bg-emerald-50 text-emerald-800 text-[10px] font-extrabold px-2.5 py-1 rounded-full border border-emerald-200/70 shadow-2xs">
              {currentSlide.badgeIcon}
              <span>{currentSlide.badge} ({currentStep + 1}/3)</span>
            </span>
          </div>

          <div className="flex items-center space-x-2">
            {/* Language Quick Toggle */}
            {setLang && (
              <button
                onClick={() => setLang(lang === 'hi' ? 'en' : 'hi')}
                className="text-[11px] font-bold text-[#2a3d2a] bg-white/80 hover:bg-white px-2.5 py-1 rounded-full border border-[#ded4c1] shadow-2xs transition-all active:scale-95 flex items-center space-x-1"
                title="Change language"
              >
                <Globe className="w-3 h-3 text-emerald-700" />
                <span>{lang === 'hi' ? 'English' : 'हिंदी'}</span>
              </button>
            )}

            {/* Skip Button */}
            <button
              onClick={triggerGetStarted}
              className="text-[11px] font-bold text-[#6a5e4d] hover:text-[#1b2e1b] px-2.5 py-1 rounded-full hover:bg-black/5 transition-colors active:scale-95"
            >
              {isHi ? 'छोड़ें (Skip)' : 'Skip'}
            </button>
          </div>
        </div>

        {/* CENTER SLIDE CONTENT */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-2 text-center overflow-y-auto no-scrollbar">
          
          {/* Logo / Mascot Section with Invisible Circular Orbit Floating Badges */}
          <div className="relative w-36 h-36 sm:w-40 sm:h-40 my-1 flex items-center justify-center shrink-0">
            
            {/* Soft luminous ambient aura */}
            <div className="absolute inset-2 rounded-full bg-emerald-200/25 blur-lg pointer-events-none" />

            {/* Mascot Logo Mark - Crisp Retina UI Asset */}
            <img
              src={logo}
              alt="Dr. Farmer Mascot Logo"
              className="relative z-10 w-full h-full object-contain select-none filter drop-shadow-md"
              draggable={false}
            />

            {/* 4 Subtle Floating Agricultural & AI Elements Moving Along Invisible Circular Path */}
            {/* Element 1: Wheat */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
              <div className="animate-orbit-1">
                <div 
                  className="w-6 h-6 sm:w-6.5 sm:h-6.5 rounded-full bg-white/95 backdrop-blur-xs border border-[#ded4c1]/85 shadow-2xs flex items-center justify-center text-[11px] select-none pointer-events-none"
                  title="Agriculture"
                >
                  🌾
                </div>
              </div>
            </div>

            {/* Element 2: Leaf */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
              <div className="animate-orbit-2">
                <div 
                  className="w-6 h-6 sm:w-6.5 sm:h-6.5 rounded-full bg-white/95 backdrop-blur-xs border border-[#ded4c1]/85 shadow-2xs flex items-center justify-center text-[11px] select-none pointer-events-none"
                  title="Plant Health"
                >
                  🍃
                </div>
              </div>
            </div>

            {/* Element 3: Cattle */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
              <div className="animate-orbit-3">
                <div 
                  className="w-6 h-6 sm:w-6.5 sm:h-6.5 rounded-full bg-white/95 backdrop-blur-xs border border-[#ded4c1]/85 shadow-2xs flex items-center justify-center text-[11px] select-none pointer-events-none"
                  title="Livestock Health"
                >
                  🐄
                </div>
              </div>
            </div>

            {/* Element 4: Camera Scan */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
              <div className="animate-orbit-4">
                <div 
                  className="w-6 h-6 sm:w-6.5 sm:h-6.5 rounded-full bg-white/95 backdrop-blur-xs border border-[#ded4c1]/85 shadow-2xs flex items-center justify-center text-[11px] select-none pointer-events-none"
                  title="AI Vision Scan"
                >
                  📷
                </div>
              </div>
            </div>

          </div>

          {/* Clean Dr. Farmer Brand Typography with Green Underline & Flanking Leaves */}
          <div className="flex flex-col items-center justify-center mt-1 mb-1 select-none">
            <span className="text-[18px] sm:text-[19px] font-black text-[#163816] tracking-tight">
              Dr. Farmer
            </span>
            
            {/* Subtle green underline with an elegant small leaf on each side */}
            <div className="flex items-center justify-center space-x-1.5 mt-0.5">
              {/* Left leaf */}
              <svg className="w-2.5 h-2.5 text-emerald-700 -scale-x-100 rotate-12 opacity-80" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8z"/>
              </svg>

              {/* Elegant green underline */}
              <div className="w-16 sm:w-20 h-[1.5px] rounded-full bg-gradient-to-r from-emerald-600/30 via-emerald-700 to-emerald-600/30" />

              {/* Right leaf */}
              <svg className="w-2.5 h-2.5 text-emerald-700 -rotate-12 opacity-80" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8z"/>
              </svg>
            </div>
          </div>

          {/* Slide Heading & Description */}
          <div className="max-w-[320px] mx-auto min-h-[64px] flex flex-col items-center justify-center">
            <h2 className="text-lg sm:text-[20px] font-black text-[#163816] tracking-tight leading-tight transition-all duration-200">
              {currentSlide.title}
            </h2>
            <p className="text-[11px] sm:text-[11.5px] text-[#4d5c4d] font-medium mt-0.5 leading-relaxed transition-all duration-200">
              {currentSlide.description}
            </p>
          </div>

          {/* Dynamic Slide Feature Cards */}
          <div className="w-full max-w-[320px] mt-3.5 transition-all duration-300">
            
            {/* SLIDE 1 Features (3 horizontal feature pills/cards) */}
            {currentStep === 0 && (
              <div className="space-y-1.5 animate-fadeIn">
                {currentSlide.features.map((feat, idx) => (
                  <div 
                    key={idx} 
                    className="bg-white/90 backdrop-blur-xs px-3 py-2 rounded-xl border border-[#ded4c1]/70 shadow-2xs flex items-center space-x-2.5 text-left"
                  >
                    <div className="p-1.5 rounded-lg bg-emerald-50 shrink-0">
                      {feat.icon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[11.5px] font-bold text-[#1b2e1b] leading-tight">
                        {feat.title}
                      </div>
                      <div className="text-[9.5px] text-[#5e6d5e] leading-tight mt-0.5">
                        {feat.desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* SLIDE 2 Features (4 compact safety & guidance cards in 2x2 grid) */}
            {currentStep === 1 && (
              <div className="grid grid-cols-2 gap-1.5 animate-fadeIn text-left">
                {currentSlide.features.map((feat, idx) => (
                  <div 
                    key={idx} 
                    className="bg-white/90 backdrop-blur-xs p-2.5 rounded-xl border border-[#ded4c1]/70 shadow-2xs flex flex-col justify-between"
                  >
                    <div className="flex items-center space-x-1.5 mb-1">
                      <div className="p-1 rounded-md bg-emerald-50 shrink-0">
                        {feat.icon}
                      </div>
                      <span className="text-[11px] font-bold text-[#1b2e1b] leading-tight truncate">
                        {feat.title}
                      </span>
                    </div>
                    <p className="text-[9.5px] text-[#5e6d5e] leading-tight">
                      {feat.desc}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* SLIDE 3 Features (3 localized voice & advisory cards) */}
            {currentStep === 2 && (
              <div className="space-y-1.5 animate-fadeIn">
                {currentSlide.features.map((feat, idx) => (
                  <div 
                    key={idx} 
                    className="bg-white/90 backdrop-blur-xs px-3 py-2 rounded-xl border border-[#ded4c1]/70 shadow-2xs flex items-center space-x-2.5 text-left"
                  >
                    <div className="p-1.5 rounded-lg bg-amber-50 shrink-0">
                      {feat.icon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[11.5px] font-bold text-[#1b2e1b] leading-tight">
                        {feat.title}
                      </div>
                      <div className="text-[9.5px] text-[#5e6d5e] leading-tight mt-0.5">
                        {feat.desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>

          {/* Interactive Slide Dots Indicator */}
          <div className="flex items-center justify-center space-x-2 mt-4 mb-1">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentStep(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`transition-all duration-300 rounded-full ${
                  currentStep === idx 
                    ? 'w-7 h-2 bg-[#1b5e20] shadow-2xs' 
                    : 'w-2 h-2 bg-[#c8beaa] hover:bg-[#a89e8a]'
                }`}
              />
            ))}
          </div>

        </div>

        {/* BOTTOM ACTION BAR */}
        <div className="relative z-20 px-6 pb-6 pt-2">
          
          <div className="flex items-center space-x-2.5">
            
            {/* Back Button (Only on slides 2 & 3) */}
            {currentStep > 0 && (
              <button
                onClick={handlePrev}
                className="py-3.5 px-4 rounded-full bg-white/90 hover:bg-white text-[#2a382a] font-bold text-xs flex items-center justify-center border border-[#ded4c1] shadow-2xs active:scale-95 transition-all"
                title="Previous slide"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                <span>{isHi ? 'पीछे' : 'Back'}</span>
              </button>
            )}

            {/* Next / Get Started Button */}
            <button
              onClick={handleNext}
              className={`flex-1 py-3.5 px-6 rounded-full font-extrabold text-xs sm:text-[13px] flex items-center justify-center space-x-2 shadow-xl active:scale-[0.96] transition-all duration-200 group ${
                currentStep === slides.length - 1
                  ? 'bg-[#142314] hover:bg-black text-white shadow-emerald-950/20 ring-2 ring-emerald-600/30'
                  : 'bg-[#181816] hover:bg-black text-white shadow-black/20'
              }`}
            >
              <span>
                {currentStep === slides.length - 1 
                  ? (isHi ? 'शुरू करें (Get Started)' : 'Get Started') 
                  : (isHi ? 'आगे बढ़ें (Next)' : 'Next')}
              </span>
              <ArrowRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-0.5 transition-transform" />
            </button>

          </div>

          {/* Footer Trust Caption */}
          <p className="text-center text-[10px] text-[#8e826f] font-medium mt-2.5">
            {isHi 
              ? '🌾 भारतीय कृषि के लिए 100% सुरक्षित और स्थानीय एआई'
              : '🌾 100% Safe & localized AI built for Indian agriculture'}
          </p>

        </div>

      </div>
    </div>
  );
}
