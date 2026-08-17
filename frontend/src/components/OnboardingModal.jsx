import React, { useState } from 'react';
import { 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  Camera, 
  Sparkles, 
  BookOpen, 
  Volume2, 
  ShieldCheck, 
  PhoneCall, 
  Cloud,
  Layers,
  HeartPulse
} from 'lucide-react';
import logo from '../assets/logo.png';

export default function OnboardingModal({ isOpen, onClose, lang }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  if (!isOpen) return null;

  const minSwipeDistance = 50;

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

  const isHi = lang === 'hi';

  const slides = [
    // SLIDE 1: App Overview & Purpose
    {
      badge: isHi ? 'परिचय' : 'About Dr. Farmer',
      title: isHi 
        ? 'डॉ. फार्मर — फसल व पशु रोगों का AI डॉक्टर' 
        : 'Dr. Farmer — Instant AI Crop & Livestock Health Advisor',
      subtitle: isHi
        ? 'भारतीय किसानों के लिए विशेष रूप से निर्मित स्मार्ट कृषि निदान प्रणाली।'
        : 'Empowering Indian farmers with instant, localized diagnosis for 38+ crop diseases and cattle health.',
      iconBadges: ['🌱', '🐄', '📱', '🩺'],
      cards: [
        {
          icon: <Sparkles className="w-4 h-4 text-emerald-600" />,
          title: isHi ? '३ सेकंड में त्वरित जांच' : '3-Sec Instant Scan',
          desc: isHi ? 'पत्ती या पशु की फोटो से तुरंत पहचान' : 'Real-time TFLite AI disease detection'
        },
        {
          icon: <Volume2 className="w-4 h-4 text-amber-600" />,
          title: isHi ? 'बोलकर सलाह (आवाज़)' : 'Spoken Voice Guide',
          desc: isHi ? 'क्षेत्रीय भाषाओं में ऑडियो गाइड' : 'Voice narration in multiple languages'
        },
        {
          icon: <ShieldCheck className="w-4 h-4 text-blue-600" />,
          title: isHi ? 'दोहरा उपचार' : 'Dual Treatment',
          desc: isHi ? 'घरेलू देसी नुस्खे + डॉक्टरी दवाई' : 'Organic home remedies & vet prescriptions'
        },
        {
          icon: <Cloud className="w-4 h-4 text-purple-600" />,
          title: isHi ? 'क्लाउड सुरक्षित' : 'Supabase Cloud Sync',
          desc: isHi ? 'रिकॉर्ड कभी नहीं खोएंगे' : 'Safe cloud data storage & history'
        }
      ]
    },

    // SLIDE 2: How to Use (3 Simple Steps)
    {
      badge: isHi ? 'उपयोग विधि' : 'How It Works',
      title: isHi 
        ? 'ऐप का उपयोग कैसे करें?' 
        : 'How to Use Dr. Farmer in 3 Simple Steps',
      subtitle: isHi
        ? 'स्मार्टफोन कैमरा से बस ३ आसान चरणों में रोग पहचानें और इलाज पाएं।'
        : 'Point, capture, and get full advisory with zero complicated technical steps.',
      iconBadges: ['1️⃣', '2️⃣', '3️⃣', '✅'],
      howToSteps: [
        {
          number: '1',
          icon: <Layers className="w-5 h-5 text-emerald-700" />,
          title: isHi ? '१. फसल या पशु मोड चुनें' : '1. Select Mode',
          desc: isHi 
            ? 'फसल की पत्ती के लिए "फसल" या गाय-भैंस के लिए "पशु" चुनें।' 
            : 'Choose Crop (फसल) for leaf ailments or Livestock (पशु) for cattle conditions.'
        },
        {
          number: '2',
          icon: <Camera className="w-5 h-5 text-amber-600" />,
          title: isHi ? '२. प्रभावित भाग की फोटो लें' : '2. Snap a Clear Photo',
          desc: isHi 
            ? 'रोगग्रस्त पत्ते या त्वचा की साफ फोटो खींचें या गैलरी से अपलोड करें।' 
            : 'Point your camera closely at the diseased leaf spots or animal skin nodules.'
        },
        {
          number: '3',
          icon: <HeartPulse className="w-5 h-5 text-rose-600" />,
          title: isHi ? '३. निदान व उपचार देखें' : '3. Get Diagnosis & Remedies',
          desc: isHi 
            ? 'तुरंत रोग का नाम, गंभीरता, देसी घरेलू नुस्खे और रासायनिक उपचार पाएं।' 
            : 'Instant diagnosis with confidence score, organic remedies, and audio narration.'
        }
      ]
    },

    // SLIDE 3: Key Features (Record Book & Expert Helpline)
    {
      badge: isHi ? 'विशेष सुविधाएं' : 'Smart Tools & Features',
      title: isHi 
        ? 'खेत रिकॉर्ड बुक और विशेषज्ञ परामर्श' 
        : 'Farm Record Book & Urgent Expert Hotline',
      subtitle: isHi
        ? 'अपनी फसलों और मवेशियों की पूरी स्वास्थ्य डायरी हमेशा अपने साथ रखें।'
        : 'Track your sowing cycles, vaccination dates, and reach agricultural specialists instantly.',
      iconBadges: ['📖', '📞', '🌦️', '🌾'],
      tools: [
        {
          icon: <BookOpen className="w-5 h-5 text-emerald-600" />,
          title: isHi ? 'डिजिटल खेत डायरी (Record Book)' : 'Digital Farm Record Book',
          desc: isHi 
            ? 'बुवाई की तारीख, कटाई समय और कीटनाशक सुरक्षा का आसान लेखा-जोखा।' 
            : 'Track sowing schedules, estimated harvest dates, and pesticide safety status.'
        },
        {
          icon: <PhoneCall className="w-5 h-5 text-red-600" />,
          title: isHi ? 'आपातकालीन विशेषज्ञ कॉल' : 'Urgent Expert Call Hotline',
          desc: isHi 
            ? 'गंभीर स्थिति में एक क्लिक पर किसान कॉल सेंटर (1800-180-1551) से जुड़ें।' 
            : 'One-tap dialer connecting directly to Kisan Call Center & veterinary helplines.'
        },
        {
          icon: <CheckCircle2 className="w-5 h-5 text-blue-600" />,
          title: isHi ? 'पशु टीकाकरण रिमाइंडर' : 'Livestock Vaccination Tracker',
          desc: isHi 
            ? 'गाय और भैंस के खुरपका-मुंहपका व अन्य टीकों की समय सारणी।' 
            : 'Stay ahead of FMD, Black Quarter, and seasonal cattle vaccination due dates.'
        }
      ]
    }
  ];

  const currentSlide = slides[currentStep];

  const handleNext = () => {
    if (currentStep < slides.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
      <div 
        className="w-full max-w-sm bg-gradient-to-b from-[#f7f3ea] via-[#f4eee2] to-[#e8decb] rounded-[36px] overflow-hidden shadow-2xl border border-[#ded4c1] relative flex flex-col justify-between max-h-[95vh] select-none transition-all duration-300"
        onTouchStart={onTouchStartHandler}
        onTouchMove={onTouchMoveHandler}
        onTouchEnd={onTouchEndHandler}
      >
        
        {/* Top Header Bar */}
        <div className="pt-4 px-6 flex justify-between items-center text-[11px] font-bold text-[#625949]">
          <span className="bg-white/70 px-2 py-0.5 rounded-full border border-white/80 text-emerald-800 text-[10px]">
            {currentSlide.badge} ({currentStep + 1}/3)
          </span>
          <button 
            onClick={onClose}
            className="text-[11px] text-[#786c58] hover:text-[#1b2e1b] font-bold px-2 py-1 rounded-full hover:bg-black/5 transition-colors"
          >
            {isHi ? 'छोड़ें (Skip)' : 'Skip'}
          </button>
        </div>

        {/* Dynamic Slide Content Container */}
        <div className="px-6 py-2 flex flex-col items-center text-center overflow-y-auto">
          
          {/* Logo / Visual Graphic */}
          <div className="relative w-32 h-32 my-1 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-emerald-300/40 via-amber-200/40 to-lime-200/40 blur-md animate-pulse" />
            <img
              src={logo}
              alt="Dr. Farmer Emblem"
              className="relative z-10 w-24 h-24 rounded-full object-contain shadow-md border-4 border-white select-none transition-transform duration-300 transform scale-100 hover:scale-105"
            />

            {/* Orbiting feature badges */}
            {currentSlide.iconBadges.map((emoji, idx) => {
              const positions = [
                'top-0 left-1 bg-orange-500',
                'top-0 right-1 bg-emerald-600',
                'bottom-1 left-0 bg-amber-500',
                'bottom-1 right-0 bg-blue-600'
              ];
              return (
                <div 
                  key={idx} 
                  className={`absolute w-7 h-7 rounded-full text-white flex items-center justify-center text-xs shadow-md border-2 border-white transform transition-all duration-300 ${positions[idx]}`}
                >
                  {emoji}
                </div>
              );
            })}
          </div>

          {/* Heading */}
          <h2 className="text-xl font-black text-[#1b2e1b] tracking-tight leading-snug mt-1">
            {currentSlide.title}
          </h2>
          
          <p className="text-[11px] text-[#5c685c] font-medium mt-1 leading-relaxed max-w-[290px]">
            {currentSlide.subtitle}
          </p>

          {/* Interactive Slide Body */}
          <div className="w-full mt-3">
            {/* SLIDE 1: Feature Cards */}
            {currentStep === 0 && (
              <div className="grid grid-cols-2 gap-2 text-left">
                {currentSlide.cards.map((card, idx) => (
                  <div key={idx} className="bg-white/85 backdrop-blur-xs p-2 rounded-xl border border-white/80 shadow-2xs">
                    <div className="flex items-center space-x-1.5 mb-0.5">
                      {card.icon}
                      <span className="text-[11px] font-bold text-[#1b2e1b]">{card.title}</span>
                    </div>
                    <p className="text-[9.5px] text-[#637063] leading-tight">{card.desc}</p>
                  </div>
                ))}
              </div>
            )}

            {/* SLIDE 2: How It Works Steps */}
            {currentStep === 1 && (
              <div className="space-y-1.5 text-left">
                {currentSlide.howToSteps.map((st, idx) => (
                  <div key={idx} className="bg-white/85 backdrop-blur-xs p-2 rounded-xl border border-white/80 shadow-2xs flex items-start space-x-2.5">
                    <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 font-extrabold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {st.number}
                    </div>
                    <div>
                      <h4 className="text-[11.5px] font-bold text-[#1b2e1b] leading-tight">{st.title}</h4>
                      <p className="text-[9.5px] text-[#5c685c] leading-tight mt-0.5">{st.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* SLIDE 3: Smart Tools & Record Book */}
            {currentStep === 2 && (
              <div className="space-y-1.5 text-left">
                {currentSlide.tools.map((tl, idx) => (
                  <div key={idx} className="bg-white/85 backdrop-blur-xs p-2.5 rounded-xl border border-white/80 shadow-2xs flex items-start space-x-2.5">
                    <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 shrink-0 mt-0.5">
                      {tl.icon}
                    </div>
                    <div>
                      <h4 className="text-[11.5px] font-bold text-[#1b2e1b] leading-tight">{tl.title}</h4>
                      <p className="text-[9.5px] text-[#5c685c] leading-tight mt-0.5">{tl.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Interactive Carousel Dots Indicator */}
          <div className="flex items-center space-x-2 mt-3.5 mb-1">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentStep(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`transition-all duration-300 rounded-full ${
                  currentStep === idx 
                    ? 'w-6 h-2 bg-[#1b5e20] shadow-sm' 
                    : 'w-2 h-2 bg-[#c8beaa] hover:bg-[#a89e8a]'
                }`}
              />
            ))}
          </div>

        </div>

        {/* Bottom Navigation Buttons (Prev / Next / Get Started) */}
        <div className="p-5 pt-1">
          <div className="flex items-center space-x-2">
            {currentStep > 0 && (
              <button
                onClick={handlePrev}
                className="py-3 px-4 rounded-full bg-white/80 hover:bg-white text-[#2a382a] font-bold text-xs flex items-center justify-center border border-white/80 shadow-sm active:scale-95 transition-all"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                <span>{isHi ? 'पीछे' : 'Back'}</span>
              </button>
            )}

            <button
              onClick={handleNext}
              className="flex-1 py-3.5 px-6 rounded-full bg-[#171614] hover:bg-black text-white font-extrabold text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-xl shadow-black/25 active:scale-95 transition-all"
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
