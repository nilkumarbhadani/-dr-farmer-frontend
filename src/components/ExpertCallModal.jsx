import React, { useState } from 'react';
import { PhoneCall, PhoneOff, UserCheck, ShieldCheck, X, Volume2, Mic, CheckCircle2 } from 'lucide-react';

export default function ExpertCallModal({ isOpen, onClose, lang }) {
  const [callStatus, setCallStatus] = useState('idle'); // 'idle' | 'calling' | 'connected'
  const [timer, setTimer] = useState(0);

  if (!isOpen) return null;

  const handleStartCall = () => {
    setCallStatus('calling');
    setTimeout(() => {
      setCallStatus('connected');
    }, 2000);
  };

  const handleEndCall = () => {
    setCallStatus('idle');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
      <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl border border-[#e5dcce]">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#eee7da] mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600">
              <PhoneCall className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-[#1a2e1a]">
                {lang === 'hi' ? 'विशेषज्ञ परामर्श केंद्र' : 'Kisan & Vet Emergency Hotline'}
              </h3>
              <p className="text-[10px] text-[#6b7b6b]">
                {lang === 'hi' ? 'मुफ्त 24x7 सरकारी सहायता' : 'Toll-Free 24x7 Government Helpline'}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#f0e9dc] hover:bg-[#e4dcce] flex items-center justify-center text-[#334233]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Call States */}
        {callStatus === 'idle' && (
          <div className="space-y-4 text-center py-2">
            <div className="w-16 h-16 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center mx-auto text-[#1b5e20]">
              <UserCheck className="w-8 h-8" />
            </div>

            <div>
              <h4 className="text-base font-extrabold text-[#193119]">
                {lang === 'hi' ? 'डॉ. रमेश शर्मा (पशु एवं कृषि विशेषज्ञ)' : 'Dr. Ramesh Sharma (Senior Vet Specialist)'}
              </h4>
              <p className="text-xs text-[#526352] mt-0.5">
                Krishi Vigyan Kendra • District Advisory Desk
              </p>
              <p className="text-sm font-black text-[#1b5e20] mt-2">
                Toll Free: 1800-180-1551
              </p>
            </div>

            <div className="bg-[#fcf8f0] p-3 rounded-2xl border border-[#ede3cf] text-xs text-[#5c4d38] text-left space-y-1">
              <div className="flex items-center space-x-2 font-bold text-[#1b5e20]">
                <CheckCircle2 className="w-4 h-4 text-[#1b5e20]" />
                <span>{lang === 'hi' ? 'दवा की सही खुराक की पुष्टि' : 'Confirm exact drug dosage & safety'}</span>
              </div>
              <div className="flex items-center space-x-2 font-bold text-[#1b5e20]">
                <CheckCircle2 className="w-4 h-4 text-[#1b5e20]" />
                <span>{lang === 'hi' ? 'निकटतम पशु अस्पताल से सहायता' : 'Get on-site veterinary dispatch assistance'}</span>
              </div>
            </div>

            <button
              onClick={handleStartCall}
              className="w-full py-4 px-4 bg-[#1b5e20] hover:bg-[#144718] text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-green-900/25 flex items-center justify-center space-x-2 active:scale-95 transition-all"
            >
              <PhoneCall className="w-5 h-5 animate-pulse" />
              <span>{lang === 'hi' ? 'मुफ्त कॉल लगाएं' : 'Connect Call Now (Free)'}</span>
            </button>
          </div>
        )}

        {callStatus === 'calling' && (
          <div className="text-center py-6 space-y-4">
            <div className="w-20 h-20 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto animate-pulse">
              <PhoneCall className="w-8 h-8" />
            </div>
            <div>
              <p className="text-base font-extrabold text-[#1a2e1a]">
                {lang === 'hi' ? 'कॉल मिल रहा है...' : 'Connecting to Specialist...'}
              </p>
              <p className="text-xs text-[#6e7d6e] mt-1">1800-180-1551</p>
            </div>
            <button
              onClick={handleEndCall}
              className="px-6 py-2.5 bg-red-600 text-white font-bold text-xs rounded-full shadow-md hover:bg-red-700"
            >
              Cancel
            </button>
          </div>
        )}

        {callStatus === 'connected' && (
          <div className="text-center py-5 space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#e8f5e9] border-2 border-[#81c784] flex items-center justify-center mx-auto text-[#1b5e20]">
              <Mic className="w-7 h-7 animate-bounce" />
            </div>
            <div>
              <span className="inline-block bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full mb-1">
                LIVE CALL • 00:24
              </span>
              <h4 className="text-sm font-extrabold text-[#1a2e1a]">
                {lang === 'hi' ? 'विशेषज्ञ से बातचीत जारी है' : 'Speaking with Krishi Specialist'}
              </h4>
              <p className="text-xs text-[#526352] mt-1">
                {lang === 'hi' ? 'कृपया बीमारी की फोटो और लक्षण बताएं।' : 'Describing symptoms & recommending nearest medicine store.'}
              </p>
            </div>
            <button
              onClick={handleEndCall}
              className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-extrabold text-sm rounded-2xl flex items-center justify-center space-x-2 shadow-md"
            >
              <PhoneOff className="w-5 h-5" />
              <span>{lang === 'hi' ? 'कॉल समाप्त करें' : 'End Call'}</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
