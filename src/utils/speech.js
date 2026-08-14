// Web Speech API Voice synthesis helper for low-literacy farmers

let activeUtterance = null;
let cachedVoices = [];

// Populate available browser voices
const updateVoices = () => {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    cachedVoices = window.speechSynthesis.getVoices() || [];
  }
};

if (typeof window !== "undefined" && "speechSynthesis" in window) {
  updateVoices();
  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = updateVoices;
  }
}

export const getBestVoice = (lang = "en") => {
  const voices = cachedVoices.length > 0 
    ? cachedVoices 
    : (typeof window !== "undefined" && "speechSynthesis" in window ? window.speechSynthesis.getVoices() : []);
  
  if (!voices || voices.length === 0) return null;

  const isHindi = lang === "hi" || (typeof lang === "string" && lang.startsWith("hi"));

  if (isHindi) {
    // 1. Look for explicit Hindi native voice
    const hindiVoice = voices.find(v => {
      const vLang = (v.lang || "").toLowerCase();
      const vName = (v.name || "").toLowerCase();
      return (
        vLang.includes("hi") ||
        vLang.startsWith("hi") ||
        vName.includes("hindi") ||
        vName.includes("lekha") ||
        vName.includes("neerja") ||
        vName.includes("kalpana") ||
        vName.includes("tarun") ||
        vName.includes("kanya")
      );
    });
    if (hindiVoice) return hindiVoice;

    // 2. Look for Indian English voice fallback for regional phonetic accuracy
    const indianVoice = voices.find(v => {
      const vLang = (v.lang || "").toLowerCase();
      const vName = (v.name || "").toLowerCase();
      return vLang.includes("en-in") || vName.includes("india") || vName.includes("veena") || vName.includes("rishi");
    });
    if (indianVoice) return indianVoice;
  } else {
    // Target: English
    // 1. Look for Indian English voice
    const indianVoice = voices.find(v => {
      const vLang = (v.lang || "").toLowerCase();
      const vName = (v.name || "").toLowerCase();
      return vLang.includes("en-in") || vName.includes("india") || vName.includes("veena") || vName.includes("rishi");
    });
    if (indianVoice) return indianVoice;

    // 2. Look for any English voice
    const englishVoice = voices.find(v => {
      const vLang = (v.lang || "").toLowerCase();
      return vLang.startsWith("en");
    });
    if (englishVoice) return englishVoice;
  }

  // Fallback to default voice
  return voices.find(v => v.default) || voices[0] || null;
};

export const speakText = (text, lang = "en", onStart, onEnd) => {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    console.warn("Speech synthesis not supported in this browser.");
    return false;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  if (!text) return false;

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.9; // Slightly slower for clear rural comprehension
  utterance.pitch = 1.0;

  const isHindi = lang === "hi" || (typeof lang === "string" && lang.startsWith("hi"));
  const targetLang = isHindi ? "hi-IN" : "en-IN";
  utterance.lang = targetLang;

  const bestVoice = getBestVoice(lang);
  const isHindiRequested = lang === "hi" || (typeof lang === "string" && lang.startsWith("hi"));
  const voiceLangLower = (bestVoice?.lang || "").toLowerCase();
  const gotRealHindiVoice = voiceLangLower.includes("hi");

  if (bestVoice && (!isHindiRequested || gotRealHindiVoice)) {
    // Only trust the picked voice if it's a genuine Hindi voice (when Hindi
    // was requested) or if English was requested. Otherwise a mismatched
    // voice reading Devanagari text produces garbled/robotic audio.
    utterance.voice = bestVoice;
    if (bestVoice.lang) {
      utterance.lang = bestVoice.lang;
    }
  } else if (isHindiRequested && !gotRealHindiVoice) {
    // No real Hindi voice on this device — log it clearly and skip 
    // forcing a broken voice. Browser will use its default en voice
    // instead of mangling Hindi text with the wrong phonetic engine.
    console.warn(
      "No Hindi voice found on this device/browser. Install a Hindi " +
      "TTS voice (Android: Settings > Accessibility > TTS > Google " +
      "TTS > Install Hindi) or test in Chrome for best results."
    );
  }

  utterance.onstart = () => {
    activeUtterance = utterance;
    if (onStart) onStart();
  };

  utterance.onend = () => {
    activeUtterance = null;
    if (onEnd) onEnd();
  };

  utterance.onerror = (e) => {
    console.error("Speech synthesis error", e);
    activeUtterance = null;
    if (onEnd) onEnd();
  };

  // If voices are empty (e.g. initial async load in Chrome), wait for onvoiceschanged once
  const currentVoices = window.speechSynthesis.getVoices();
  if (currentVoices.length === 0) {
    window.speechSynthesis.onvoiceschanged = () => {
      updateVoices();
      const recheckedVoice = getBestVoice(lang);
      if (recheckedVoice) {
        utterance.voice = recheckedVoice;
        if (recheckedVoice.lang) utterance.lang = recheckedVoice.lang;
      }
      window.speechSynthesis.speak(utterance);
    };
  } else {
    window.speechSynthesis.speak(utterance);
  }

  return true;
};

export const stopSpeech = () => {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
  activeUtterance = null;
};

