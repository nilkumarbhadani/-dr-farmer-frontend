import React, { useState } from 'react';
import { 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  ShieldCheck, 
  Volume2, 
  Leaf, 
  HeartPulse, 
  AlertTriangle, 
  CheckCircle2, 
  Globe,
  Stethoscope,
  X
} from 'lucide-react';
import logo from '../assets/logo.png';

export default function OnboardingModal({ isOpen, onClose, lang = 'en' }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  if (!isOpen) return null;

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
      handleCloseWithAnimation();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleCloseWithAnimation = () => {
    if (isExiting) return;
    setIsExiting(true);
    setTimeout(() => {
      onClose();
      setIsExiting(false);
      setCurrentStep(0);
    }, 300);
  };

  const currentSlide = slides[currentStep];

  return (
    <div className={`fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 transition-opacity duration-300 ${
      isExiting ? 'opacity-0' : 'opacity-100'
    }`}>
      <div 
        className={`w-full max-w-sm bg-[#fbf9f4] rounded-[32px] overflow-hidden shadow-2xl border border-[#ded4c1] relative flex flex-col justify-between max-h-[92vh] select-none transition-all duration-300 ${
          isExiting ? 'scale-[0.96] translate-y-2' : 'scale-100 translate-y-0'
        }`}
        onTouchStart={onTouchStartHandler}
        onTouchMove={onTouchMoveHandler}
        onTouchEnd={onTouchEndHandler}
      >
        
        {/* Top Header Bar */}
        <div className="pt-4 px-5 flex justify-between items-center text-[11px] font-bold text-[#625949]">
          <span className="inline-flex items-center space-x-1 bg-emerald-50 text-emerald-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-emerald-200/80">
            {currentSlide.badgeIcon}
            <span>{currentSlide.badge} ({currentStep + 1}/3)</span>
          </span>
          
          <button 
            onClick={handleCloseWithAnimation}
            className="p-1 rounded-full text-[#786c58] hover:text-[#1b2e1b] hover:bg-black/5 transition-colors"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Dynamic Slide Content */}
        <div className="px-5 py-2 flex flex-col items-center text-center overflow-y-auto no-scrollbar">
          
          {/* Logo / Mascot Section with Invisible Orbit Floating Badges */}
          <div className="relative w-32 h-32 my-1 flex items-center justify-center shrink-0">
            <div className="absolute inset-1 rounded-full bg-emerald-200/25 blur-md pointer-events-none" />
            <img
              src={logo}
              alt="Dr. Farmer Emblem"
              className="relative z-10 w-full h-full object-contain filter drop-shadow-sm"
              draggable={false}
            />

            {/* 4 Subtle Floating Agricultural & AI Elements with Invisible Circular Orbit */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
              <div className="animate-orbit-modal-1">
                <div 
                  className="w-5.5 h-5.5 rounded-full bg-white/95 backdrop-blur-xs border border-[#ded4c1]/85 shadow-2xs flex items-center justify-center text-[10px] select-none pointer-events-none"
                  title="Agriculture"
                >
                  🌾
                </div>
              </div>
            </div>

            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
              <div className="animate-orbit-modal-2">
                <div 
                  className="w-5.5 h-5.5 rounded-full bg-white/95 backdrop-blur-xs border border-[#ded4c1]/85 shadow-2xs flex items-center justify-center text-[10px] select-none pointer-events-none"
                  title="Plant Health"
                >
                  🍃
                </div>
              </div>
            </div>

            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
              <div className="animate-orbit-modal-3">
                <div 
                  className="w-5.5 h-5.5 rounded-full bg-white/95 backdrop-blur-xs border border-[#ded4c1]/85 shadow-2xs flex items-center justify-center text-[10px] select-none pointer-events-none"
                  title="Livestock Health"
                >
                  🐄
                </div>
              </div>
            </div>

            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
              <div className="animate-orbit-modal-4">
                <div 
                  className="w-5.5 h-5.5 rounded-full bg-white/95 backdrop-blur-xs border border-[#ded4c1]/85 shadow-2xs flex items-center justify-center text-[10px] select-none pointer-events-none"
                  title="AI Vision Scan"
                >
                  📷
                </div>
              </div>
            </div>

          </div>

          {/* Clean Dr. Farmer Brand Typography with Green Underline & Flanking Leaves */}
          <div className="flex flex-col items-center justify-center mt-0.5 mb-1 select-none">
            <span className="text-[16px] sm:text-[17px] font-black text-[#163816] tracking-tight">
              Dr. Farmer
            </span>
            
            {/* Subtle green underline with leaves */}
            <div className="flex items-center justify-center space-x-1.5 mt-0.5">
              <svg className="w-2.5 h-2.5 text-emerald-700 -scale-x-100 rotate-12 opacity-80" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8z"/>
              </svg>
              <div className="w-14 sm:w-16 h-[1.5px] rounded-full bg-gradient-to-r from-emerald-600/30 via-emerald-700 to-emerald-600/30" />
              <svg className="w-2.5 h-2.5 text-emerald-700 -rotate-12 opacity-80" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8z"/>
              </svg>
            </div>
          </div>

          {/* Heading */}
          <div className="max-w-[280px] mx-auto min-h-[58px] flex flex-col items-center justify-center">
            <h2 className="text-base sm:text-lg font-black text-[#163816] tracking-tight leading-tight">
              {currentSlide.title}
            </h2>
            <p className="text-[10.5px] sm:text-[11px] text-[#4d5c4d] font-medium mt-0.5 leading-relaxed">
              {currentSlide.description}
            </p>
          </div>

          {/* Slide Features */}
          <div className="w-full mt-3">
            {/* Slide 1 */}
            {currentStep === 0 && (
              <div className="space-y-1.5 text-left animate-fadeIn">
                {currentSlide.features.map((feat, idx) => (
                  <div key={idx} className="bg-white/90 px-2.5 py-1.5 rounded-xl border border-[#ded4c1]/70 shadow-2xs flex items-center space-x-2">
                    <div className="p-1 rounded-md bg-emerald-50 shrink-0">
                      {feat.icon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[11px] font-bold text-[#1b2e1b] leading-tight">{feat.title}</div>
                      <div className="text-[9px] text-[#5e6d5e] leading-tight">{feat.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Slide 2 */}
            {currentStep === 1 && (
              <div className="grid grid-cols-2 gap-1.5 text-left animate-fadeIn">
                {currentSlide.features.map((feat, idx) => (
                  <div key={idx} className="bg-white/90 p-2 rounded-xl border border-[#ded4c1]/70 shadow-2xs flex flex-col justify-between">
                    <div className="flex items-center space-x-1 mb-0.5">
                      <div className="p-0.5 rounded bg-emerald-50 shrink-0">
                        {feat.icon}
                      </div>
                      <span className="text-[10.5px] font-bold text-[#1b2e1b] truncate">{feat.title}</span>
                    </div>
                    <p className="text-[9px] text-[#5e6d5e] leading-tight">{feat.desc}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Slide 3 */}
            {currentStep === 2 && (
              <div className="space-y-1.5 text-left animate-fadeIn">
                {currentSlide.features.map((feat, idx) => (
                  <div key={idx} className="bg-white/90 px-2.5 py-1.5 rounded-xl border border-[#ded4c1]/70 shadow-2xs flex items-center space-x-2">
                    <div className="p-1 rounded-md bg-amber-50 shrink-0">
                      {feat.icon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[11px] font-bold text-[#1b2e1b] leading-tight">{feat.title}</div>
                      <div className="text-[9px] text-[#5e6d5e] leading-tight">{feat.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Dots Indicator */}
          <div className="flex items-center space-x-2 mt-3.5 mb-0.5">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentStep(idx)}
                aria-label={`Slide ${idx + 1}`}
                className={`transition-all duration-300 rounded-full ${
                  currentStep === idx 
                    ? 'w-6 h-2 bg-[#1b5e20] shadow-2xs' 
                    : 'w-2 h-2 bg-[#c8beaa] hover:bg-[#a89e8a]'
                }`}
              />
            ))}
          </div>

        </div>

        {/* Bottom Buttons */}
        <div className="p-4 pt-1">
          <div className="flex items-center space-x-2">
            {currentStep > 0 && (
              <button
                onClick={handlePrev}
                className="py-3 px-3.5 rounded-full bg-white/90 hover:bg-white text-[#2a382a] font-bold text-xs flex items-center justify-center border border-[#ded4c1] shadow-2xs active:scale-95 transition-all"
              >
                <ArrowLeft className="w-3.5 h-3.5 mr-0.5" />
                <span>{isHi ? 'पीछे' : 'Back'}</span>
              </button>
            )}

            <button
              onClick={handleNext}
              className="flex-1 py-3 px-5 rounded-full bg-[#181816] hover:bg-black text-white font-extrabold text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-xl shadow-black/20 active:scale-[0.96] transition-all"
            >
              <span>
                {currentStep === slides.length - 1 
                  ? (isHi ? 'शुरू करें (Get Started)' : 'Get Started') 
                  : (isHi ? 'आगे बढ़ें (Next)' : 'Next')}
              </span>
              <ArrowRight className="w-4 h-4 text-emerald-400" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
