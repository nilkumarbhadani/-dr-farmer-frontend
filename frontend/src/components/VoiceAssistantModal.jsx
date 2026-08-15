import React, { useState, useRef } from 'react';
import { Mic, Square, Loader2, Volume2, X, Sparkles, Navigation, Command } from 'lucide-react';
import { processVoiceCommand } from '../utils/api';

export default function VoiceAssistantModal({ isOpen, onClose, lang, onNavigate }) {
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  if (!isOpen) return null;

  const startRecording = async () => {
    setErrorMsg('');
    setResult(null);
    audioChunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        stream.getTracks().forEach(track => track.stop());
        await sendAudioToBackend(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error('[Voice Assistant] Microphone access error:', err);
      setErrorMsg(
        lang === 'hi'
          ? 'माइक तक पहुंच नहीं मिली। नीचे दिए गए सैंपल कमांड पर दबाएं।'
          : 'Microphone access denied. Tap a quick sample command below.'
      );
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsAnalyzing(true);
    }
  };

  const sendAudioToBackend = async (audioBlob) => {
    try {
      const audioFile = new File([audioBlob], 'voice_command.wav', { type: 'audio/wav' });
      const res = await processVoiceCommand(audioFile);
      setIsAnalyzing(false);

      if (res && res.status === 'success') {
        setResult(res);
        if (res.action_route) {
          setTimeout(() => {
            handleExecuteRoute(res.action_route);
          }, 1800);
        }
      } else {
        setErrorMsg(
          res?.message || (lang === 'hi' ? 'आवाज़ स्पष्ट नहीं थी। पुनः प्रयास करें।' : 'Could not recognize voice. Try again.')
        );
      }
    } catch (err) {
      console.error('[Voice Assistant] API Call failed:', err);
      setIsAnalyzing(false);
      setErrorMsg(
        lang === 'hi'
          ? 'सर्वर से जुड़ने में असमर्थ। कृपया नेटवर्क जांचें।'
          : 'Failed to communicate with backend voice service.'
      );
    }
  };

  const handleExecuteRoute = (route) => {
    onClose();
    if (route === '/scan') {
      onNavigate('scan', 'crop');
    } else if (route === '/livestock') {
      onNavigate('scan', 'cattle');
    } else if (route === '/weather') {
      onNavigate('home');
    }
  };

  const handleQuickCommand = (transcription, route, intent) => {
    setResult({
      status: 'success',
      transcription,
      detected_intent: intent,
      action_route: route
    });
    setTimeout(() => {
      handleExecuteRoute(route);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
      <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-[#ded5c2] relative text-center">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#f0e9dc] hover:bg-[#e2d8c3] flex items-center justify-center text-[#2a382a]"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700 mx-auto mb-3">
          <Sparkles className="w-6 h-6 animate-pulse text-amber-600" />
        </div>

        <h3 className="text-lg font-extrabold text-[#1a2e1a]">
          {lang === 'hi' ? 'AI आवाज़ सहायक' : 'AI Voice Assistant'}
        </h3>
        <p className="text-xs text-[#5c6b5c] mt-1 mb-5 px-2">
          {lang === 'hi'
            ? 'माइक दबाकर बोलें या नीचे त्वरित कमांड चुनें'
            : 'Tap mic & speak, or tap a quick command below'}
        </p>

        {/* Big Animated Mic Button */}
        <div className="flex flex-col items-center justify-center my-3">
          {!isRecording && !isAnalyzing && (
            <button
              onClick={startRecording}
              className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#1b5e20] to-[#2e7d32] text-white flex flex-col items-center justify-center shadow-xl shadow-green-900/30 hover:scale-105 active:scale-95 transition-transform border-4 border-emerald-200"
            >
              <Mic className="w-10 h-10 text-white" />
              <span className="text-[10px] font-bold mt-1 uppercase tracking-wider">
                {lang === 'hi' ? 'बोलें' : 'Speak'}
              </span>
            </button>
          )}

          {isRecording && (
            <button
              onClick={stopRecording}
              className="w-24 h-24 rounded-full bg-red-600 text-white flex flex-col items-center justify-center shadow-xl shadow-red-900/30 animate-pulse border-4 border-red-300"
            >
              <Square className="w-9 h-9 fill-white" />
              <span className="text-[10px] font-bold mt-1 uppercase tracking-wider">
                {lang === 'hi' ? 'रोकें' : 'Stop'}
              </span>
            </button>
          )}

          {isAnalyzing && (
            <div className="w-24 h-24 rounded-full bg-amber-500/10 border-4 border-amber-400 flex flex-col items-center justify-center text-amber-700">
              <Loader2 className="w-9 h-9 animate-spin text-amber-600" />
              <span className="text-[10px] font-bold mt-1 uppercase tracking-wider">
                {lang === 'hi' ? 'जांच...' : 'Parsing...'}
              </span>
            </div>
          )}
        </div>

        {/* Quick Voice Command Chips */}
        <div className="mt-4 pt-3 border-t border-[#eee7da]">
          <div className="flex items-center justify-center space-x-1 text-[10px] font-bold text-[#627362] uppercase tracking-wider mb-2">
            <Command className="w-3 h-3 text-[#1b5e20]" />
            <span>{lang === 'hi' ? 'त्वरित कमांड चुनें:' : 'Quick Voice Commands:'}</span>
          </div>

          <div className="flex flex-wrap gap-1.5 justify-center">
            {[
              { text: lang === 'hi' ? '🌱 फसल जांच' : '🌱 Scan Crop', route: '/scan', intent: 'scan_crop' },
              { text: lang === 'hi' ? '🐄 पशु बीमारी' : '🐄 Cattle Check', route: '/livestock', intent: 'check_livestock' },
              { text: lang === 'hi' ? '☁️ आज का मौसम' : '☁️ Farm Weather', route: '/weather', intent: 'check_weather' }
            ].map(chip => (
              <button
                key={chip.route}
                onClick={() => handleQuickCommand(chip.text, chip.route, chip.intent)}
                className="px-3 py-1.5 rounded-full bg-[#f4efe4] hover:bg-[#1b5e20] hover:text-white border border-[#ded5c2] text-xs font-bold text-[#2a382a] transition-all active:scale-95"
              >
                {chip.text}
              </button>
            ))}
          </div>
        </div>

        {/* Feedback / Transcription output */}
        {result && (
          <div className="mt-4 p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-left animate-fadeIn">
            <div className="flex items-center space-x-1.5 text-xs font-bold text-emerald-800 mb-1">
              <Volume2 className="w-4 h-4 text-emerald-600" />
              <span>{lang === 'hi' ? 'सुना गया:' : 'Transcribed:'}</span>
            </div>
            <p className="text-sm font-semibold text-[#1a2f1a]">
              "{result.transcription}"
            </p>
            {result.action_route && (
              <div className="mt-2 flex items-center justify-between text-xs text-emerald-700 font-bold bg-white p-2 rounded-xl border border-emerald-300">
                <span>{lang === 'hi' ? 'क्रिया:' : 'Action:'} {result.detected_intent}</span>
                <Navigation className="w-3.5 h-3.5 animate-bounce text-emerald-600" />
              </div>
            )}
          </div>
        )}

        {errorMsg && (
          <p className="mt-3 text-xs font-bold text-red-600 bg-red-50 p-2.5 rounded-xl border border-red-200">
            {errorMsg}
          </p>
        )}

      </div>
    </div>
  );
}
