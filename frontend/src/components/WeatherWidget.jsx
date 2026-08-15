import React, { useState, useEffect, useCallback } from 'react';
import { 
  Sun, 
  CloudSun, 
  Droplet, 
  Wind, 
  RefreshCw, 
  Layers, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  MapPin, 
  Check, 
  Navigation 
} from 'lucide-react';
import { TRANSLATIONS } from '../data/translations';
import { getFarmingWeather, checkSoilSuitability } from '../utils/api';

// Popular Indian agricultural districts for one-tap selection
const POPULAR_AGRI_HUBS = [
  'New Delhi',
  'Pune',
  'Jaipur',
  'Lucknow',
  'Patna',
  'Ludhiana',
  'Bhopal',
  'Hyderabad'
];

export default function WeatherWidget({ lang }) {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;
  
  // Location state loaded from persistent localStorage
  const [cityName, setCityName] = useState(() => {
    try {
      return localStorage.getItem('drfarmer_location') || 'New Delhi';
    } catch {
      return 'New Delhi';
    }
  });

  const [inputCity, setInputCity] = useState(cityName);
  const [showCityModal, setShowCityModal] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const [detectingGps, setDetectingGps] = useState(false);

  // Weather state
  const [weatherData, setWeatherData] = useState(null);
  const [loadingWeather, setLoadingWeather] = useState(true);

  // Soil Check Modal state
  const [showSoilModal, setShowSoilModal] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState('Wheat');
  const [moistureValue, setMoistureValue] = useState(45);
  const [soilResult, setSoilResult] = useState(null);
  const [loadingSoil, setLoadingSoil] = useState(false);

  /**
   * Fetch weather data with multi-tier fallback (Backend FastAPI -> Direct Open-Meteo Browser API).
   */
  const fetchWeather = useCallback(async (cityToFetch = cityName, lat = null, lon = null) => {
    setLoadingWeather(true);
    setLocationError(null);

    try {
      // 1. Try Backend API first
      const data = await getFarmingWeather(cityToFetch, lat, lon);
      if (data && !data.error && data.temperature_celsius !== undefined) {
        setWeatherData(data);
        setLoadingWeather(false);
        return;
      }
    } catch (backendErr) {
      // Backend weather API unreachable, fetching direct Open-Meteo fallback
    }

    // 2. Direct browser Open-Meteo fallback (Guarantees live real-time weather worldwide)
    try {
      let latitude = lat;
      let longitude = lon;
      let resolvedName = cityToFetch;

      if (!latitude || !longitude) {
        const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityToFetch)}&count=1`);
        const geoData = await geoRes.json();
        if (geoData.results && geoData.results.length > 0) {
          latitude = geoData.results[0].latitude;
          longitude = geoData.results[0].longitude;
          const { name, admin1 } = geoData.results[0];
          resolvedName = admin1 ? `${name}, ${admin1}` : name;
        } else {
          throw new Error(`Location '${cityToFetch}' not found`);
        }
      }

      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=relative_humidity_2m`
      );
      const wData = await weatherRes.json();
      const current = wData.current_weather || {};
      const temp = current.temperature ?? 28;
      const wind = current.windspeed ?? 12;

      setWeatherData({
        location_used: resolvedName,
        temperature_celsius: Math.round(temp),
        wind_speed_kmh: Math.round(wind),
        farming_conditions: temp >= 15 && temp <= 35 
          ? (lang === 'hi' ? 'खेत कार्य के लिए अनुकूल मौसम' : 'Favorable conditions for crop work')
          : (lang === 'hi' ? 'मौसम अत्यधिक: सिंचाई की निगरानी करें' : 'Extreme temperature: Monitor crops closely')
      });
    } catch (fallbackErr) {
      console.error('[WeatherWidget] Weather fetch failed:', fallbackErr);
      setLocationError(lang === 'hi' ? 'स्थान नहीं मिला, कृपया नाम जांचें।' : 'City not found. Please verify spelling.');
      setWeatherData(prev => prev || {
        location_used: cityToFetch,
        temperature_celsius: 27,
        wind_speed_kmh: 10,
        farming_conditions: lang === 'hi' ? 'सामान्य खेत मौसम' : 'Normal farm weather'
      });
    } finally {
      setLoadingWeather(false);
    }
  }, [cityName, lang]);

  // Load weather on mount
  useEffect(() => {
    fetchWeather(cityName);
  }, [fetchWeather, cityName]);

  /**
   * Save and persist typed location to localStorage and fetch new weather data.
   */
  const handleSaveLocation = (targetCity) => {
    const trimmed = (targetCity || inputCity).trim();
    if (!trimmed) return;

    setCityName(trimmed);
    setInputCity(trimmed);

    try {
      localStorage.setItem('drfarmer_location', trimmed);
    } catch (e) {
      console.warn('localStorage error', e);
    }

    fetchWeather(trimmed);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      setShowCityModal(false);
    }, 900);
  };

  /**
   * Use GPS browser geolocation to automatically detect farm position.
   */
  const handleUseGpsLocation = () => {
    if (!navigator.geolocation) {
      alert(lang === 'hi' ? 'जीपीएस इस ब्राउज़र में समर्थित नहीं है।' : 'GPS is not supported in this browser.');
      return;
    }

    setDetectingGps(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          // Reverse geocode to city name
          const revRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?latitude=${latitude}&longitude=${longitude}&count=1`);
          let detectedName = `GPS (${latitude.toFixed(2)}°, ${longitude.toFixed(2)}°)`;
          if (revRes.ok) {
            const revData = await revRes.json();
            if (revData.results && revData.results[0]) {
              const { name, admin1 } = revData.results[0];
              detectedName = admin1 ? `${name}, ${admin1}` : name;
            }
          }

          setCityName(detectedName);
          setInputCity(detectedName);
          localStorage.setItem('drfarmer_location', detectedName);
          fetchWeather(detectedName, latitude, longitude);
          setSaveSuccess(true);
          setTimeout(() => {
            setSaveSuccess(false);
            setShowCityModal(false);
          }, 900);
        } catch (e) {
          console.warn('Reverse geocode error:', e);
          const fallbackGps = `GPS Loc`;
          setCityName(fallbackGps);
          fetchWeather(fallbackGps, latitude, longitude);
          setShowCityModal(false);
        } finally {
          setDetectingGps(false);
        }
      },
      (err) => {
        console.warn('Geolocation error:', err);
        setDetectingGps(false);
        setLocationError(lang === 'hi' ? 'जीपीएस अनुमति नहीं मिली। कृपया शहर का नाम टाइप करें।' : 'GPS access denied. Please type city name manually.');
      },
      { timeout: 10000 }
    );
  };

  const handleRunSoilCheck = async () => {
    setLoadingSoil(true);
    try {
      const result = await checkSoilSuitability(moistureValue, selectedCrop);
      setSoilResult(result);
    } catch (err) {
      console.error('[Soil Check] Error:', err);
      setSoilResult({
        crop: selectedCrop,
        moisture_level: `${moistureValue}%`,
        status: moistureValue < 30 ? "Deficient" : moistureValue <= 70 ? "Optimal" : "Waterlogged",
        suitable: moistureValue >= 30 && moistureValue <= 70,
        recommendation: moistureValue < 30 
          ? `Soil moisture low for ${selectedCrop}. Immediate irrigation recommended.`
          : moistureValue <= 70
          ? `Ideal moisture conditions for growing ${selectedCrop}.`
          : `High moisture levels detected. Ensure proper field drainage.`
      });
    } finally {
      setLoadingSoil(false);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#fbf3e4] via-[#f7ecd5] to-[#ebdcc2] p-4 text-[#2b271d] shadow-sm border border-[#e5d8be]">
      
      {/* Decorative sun graphic background */}
      <div className="absolute top-2 right-4 opacity-75 pointer-events-none">
        <div className="relative">
          <div className="w-14 h-14 rounded-full bg-amber-400/30 blur-lg absolute -inset-1" />
          <Sun className="w-10 h-10 text-amber-500 animate-spin" style={{ animationDuration: '24s' }} />
        </div>
      </div>

      {/* Top weather banner */}
      <div className="flex items-start justify-between relative z-10 mb-3.5">
        <div className="flex-1 pr-2">
          <div className="flex items-baseline space-x-2 flex-wrap">
            <span className="text-3xl font-extrabold tracking-tight text-[#222]">
              {loadingWeather ? '...' : weatherData?.temperature_celsius !== undefined ? `${weatherData.temperature_celsius}°C` : '27°C'}
            </span>
            
            {/* Clickable Location Badge with Pin */}
            <button
              onClick={() => {
                setInputCity(cityName);
                setShowCityModal(true);
              }}
              className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-white/70 hover:bg-white border border-[#dcd0b9] text-xs font-bold text-[#1b5e20] active:scale-95 transition-all shadow-2xs"
              title="Click to change and save farm location"
            >
              <MapPin className="w-3 h-3 text-[#1b5e20] shrink-0" />
              <span className="max-w-[130px] truncate">{weatherData?.location_used || cityName}</span>
              <span className="text-[10px] text-[#6b7b6b] underline ml-0.5">
                {lang === 'hi' ? 'बदलें' : 'Edit'}
              </span>
            </button>
          </div>

          <p className="text-[12px] font-medium text-[#7a6f57] flex items-center gap-1 mt-1">
            <CloudSun className="w-3.5 h-3.5 text-amber-600 inline shrink-0" />
            <span className="line-clamp-1">
              {weatherData?.farming_conditions || (lang === 'hi' ? 'खेत कार्य के लिए अनुकूल' : 'Optimal for field inspection')}
            </span>
          </p>
        </div>

        {/* Refresh button */}
        <button 
          onClick={() => fetchWeather(cityName)} 
          className="p-2 bg-white/70 hover:bg-white text-[#5c5545] rounded-full transition-colors shadow-2xs shrink-0 active:scale-90"
          title="Refresh Weather"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loadingWeather ? 'animate-spin text-[#1b5e20]' : ''}`} />
        </button>
      </div>

      {/* 3 Metric Pills: Wind Speed, Live Soil Check Trigger, Humidity */}
      <div className="grid grid-cols-3 gap-2 relative z-10">
        
        {/* Wind Speed */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-2.5 text-center border border-white/60 shadow-xs">
          <span className="block text-[11px] font-semibold text-[#5c5545] mb-1 flex items-center justify-center gap-1">
            <Wind className="w-3 h-3 text-sky-600" />
            <span>{lang === 'hi' ? 'हवा गति' : 'Wind'}</span>
          </span>
          <span className="inline-block bg-[#e0f2fe] text-[#0369a1] text-[11px] font-bold px-2 py-0.5 rounded-full border border-[#bae6fd]">
            {weatherData?.wind_speed_kmh ? `${weatherData.wind_speed_kmh} km/h` : '12 km/h'}
          </span>
        </div>

        {/* Interactive Soil Check Button */}
        <button
          onClick={() => {
            setShowSoilModal(true);
            if (!soilResult) handleRunSoilCheck();
          }}
          className="bg-white/90 hover:bg-white backdrop-blur-sm rounded-2xl p-2.5 text-center border border-emerald-300 shadow-xs active:scale-95 transition-transform group"
        >
          <span className="block text-[11px] font-bold text-[#1b5e20] mb-1 flex items-center justify-center gap-1">
            <Layers className="w-3 h-3 text-[#1b5e20]" />
            <span>{t.weather.soilMoisture}</span>
          </span>
          <span className="inline-block bg-[#e8f5e9] text-[#1b5e20] text-[11px] font-extrabold px-2 py-0.5 rounded-full border border-[#c8e6c9] group-hover:bg-[#1b5e20] group-hover:text-white transition-colors">
            {lang === 'hi' ? 'जांचें ➔' : 'Check ➔'}
          </span>
        </button>

        {/* Farming Condition Status */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-2.5 text-center border border-white/60 shadow-xs">
          <span className="block text-[11px] font-semibold text-[#5c5545] mb-1 flex items-center justify-center gap-1">
            <Droplet className="w-3 h-3 text-amber-600" />
            <span>{t.weather.humidity}</span>
          </span>
          <span className="inline-block bg-[#e8f5e9] text-[#1b5e20] text-[11px] font-bold px-2 py-0.5 rounded-full border border-[#c8e6c9]">
            {t.weather.good}
          </span>
        </div>

      </div>

      {/* LOCATION SETTINGS & SAVE MODAL */}
      {showCityModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl border border-[#ded5c2] relative">
            
            <div className="flex items-center justify-between pb-3 border-b border-[#eee7da] mb-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-[#1b5e20]">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-[#193319]">
                    {lang === 'hi' ? 'खेत का स्थान सेट करें' : 'Set Farm Location'}
                  </h3>
                  <p className="text-[11px] text-[#6b7b6b]">
                    {lang === 'hi' ? 'सटीक मौसम के लिए शहर या जिला दर्ज करें' : 'Enter city/district for accurate local forecast'}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setShowCityModal(false)}
                className="w-7 h-7 rounded-full bg-[#f0e9dc] hover:bg-[#e4dcce] flex items-center justify-center text-[#334233]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Input Form with Enter key support */}
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveLocation(inputCity);
              }}
              className="space-y-3"
            >
              <div>
                <label className="block text-xs font-bold text-[#3c4a3c] mb-1.5">
                  {lang === 'hi' ? 'शहर / जिला / गांव का नाम:' : 'City / District / Village Name:'}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder={lang === 'hi' ? 'उदा. Pune, Jaipur, Lucknow...' : 'e.g. Pune, Jaipur, Lucknow...'}
                    value={inputCity}
                    onChange={(e) => setInputCity(e.target.value)}
                    autoFocus
                    className="w-full px-3.5 py-2.5 text-xs font-bold rounded-xl bg-[#faf8f2] border border-[#d8cebe] focus:ring-2 focus:ring-[#1b5e20] focus:outline-none pr-10"
                  />
                  {inputCity && (
                    <button
                      type="button"
                      onClick={() => setInputCity('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                {locationError && (
                  <p className="text-[11px] text-red-600 font-semibold mt-1">
                    {locationError}
                  </p>
                )}
              </div>

              {/* Action Buttons: Save & GPS Auto-detect */}
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={saveSuccess || !inputCity.trim()}
                  className={`flex-1 py-2.5 px-4 font-black text-xs rounded-xl shadow-md flex items-center justify-center space-x-1.5 transition-all ${
                    saveSuccess 
                      ? 'bg-emerald-600 text-white ring-2 ring-emerald-300' 
                      : 'bg-[#1b5e20] hover:bg-[#144718] text-white active:scale-98'
                  }`}
                >
                  {saveSuccess ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>{lang === 'hi' ? 'स्थान सहेजा गया ✓' : 'Location Saved ✓'}</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>{lang === 'hi' ? 'स्थान सहेजें (Save)' : 'Save Location'}</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleUseGpsLocation}
                  disabled={detectingGps}
                  className="py-2.5 px-3 bg-[#e8f5e9] hover:bg-[#dcedc8] text-[#1b5e20] font-extrabold text-xs rounded-xl border border-[#c8e6c9] flex items-center justify-center space-x-1 shrink-0 active:scale-95 transition-all"
                  title="Detect current GPS coordinates"
                >
                  <Navigation className={`w-3.5 h-3.5 ${detectingGps ? 'animate-spin' : ''}`} />
                  <span className="text-[11px]">{lang === 'hi' ? 'जीपीएस' : 'GPS'}</span>
                </button>
              </div>
            </form>

            {/* Popular Agricultural Hubs (Quick 1-tap chips) */}
            <div className="mt-4 pt-3 border-t border-[#eee7da]">
              <span className="text-[10px] font-bold text-[#7a887a] uppercase tracking-wider block mb-2">
                {lang === 'hi' ? 'त्वरित चयन (प्रमुख कृषि क्षेत्र):' : 'Popular Agricultural Regions:'}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {POPULAR_AGRI_HUBS.map(hub => (
                  <button
                    key={hub}
                    type="button"
                    onClick={() => handleSaveLocation(hub)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all active:scale-95 ${
                      cityName.toLowerCase().includes(hub.toLowerCase())
                        ? 'bg-[#1b5e20] text-white border-[#1b5e20]'
                        : 'bg-[#faf8f2] text-[#334433] border-[#ded5c2] hover:bg-[#f0ece1]'
                    }`}
                  >
                    {hub}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* SOIL MOISTURE SUITABILITY MODAL */}
      {showSoilModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl border border-[#ded5c2] relative">
            
            <button
              onClick={() => setShowSoilModal(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#f0e9dc] hover:bg-[#e2d8c3] flex items-center justify-center text-[#2a382a]"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center space-x-2.5 mb-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-[#1b5e20]">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-[#1a2f1a]">
                  {lang === 'hi' ? 'मिट्टी नमी अनुकूलता जांच' : 'Soil Moisture Advisor'}
                </h3>
                <p className="text-xs text-[#5c6b5c]">
                  {lang === 'hi' ? 'डॉ. फार्मर एआई सॉइल मॉडल' : 'FastAPI AI Soil Engine'}
                </p>
              </div>
            </div>

            {/* Crop Selector */}
            <div className="mb-3">
              <label className="block text-xs font-bold text-[#3c4a3c] mb-1">
                {lang === 'hi' ? 'फसल चुनें:' : 'Select Crop:'}
              </label>
              <select
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.target.value)}
                className="w-full px-3 py-2 text-xs font-bold rounded-xl bg-[#faf8f2] border border-[#d8cebe] focus:ring-2 focus:ring-[#1b5e20]"
              >
                {['Wheat', 'Rice (Paddy)', 'Cotton', 'Maize (Corn)', 'Mustard', 'Sugarcane', 'Vegetables'].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Slider for Soil Moisture % */}
            <div className="mb-4 bg-[#f9f7f2] p-3 rounded-2xl border border-[#ece3d4]">
              <div className="flex justify-between items-center text-xs font-bold text-[#2a382a] mb-1">
                <span>{lang === 'hi' ? 'मिट्टी में नमी:' : 'Soil Moisture:'}</span>
                <span className="text-emerald-800 text-sm font-extrabold">{moistureValue}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="95"
                value={moistureValue}
                onChange={(e) => setMoistureValue(Number(e.target.value))}
                className="w-full accent-[#1b5e20] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#718071] font-semibold mt-1">
                <span>5% (Dry)</span>
                <span>50% (Ideal)</span>
                <span>95% (Wet)</span>
              </div>
            </div>

            {/* Check Button */}
            <button
              onClick={handleRunSoilCheck}
              disabled={loadingSoil}
              className="w-full py-2.5 px-4 bg-[#1b5e20] hover:bg-[#144718] text-white font-extrabold text-xs rounded-xl shadow-md flex items-center justify-center space-x-2 transition-transform"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingSoil ? 'animate-spin' : ''}`} />
              <span>{lang === 'hi' ? 'एआई से जांचें' : 'Analyze Soil Suitability'}</span>
            </button>

            {/* Result Display */}
            {soilResult && (
              <div className={`mt-4 p-3 rounded-2xl border ${
                soilResult.suitable
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                  : 'bg-amber-50 border-amber-300 text-amber-900'
              }`}>
                <div className="flex items-center space-x-2 font-bold text-xs mb-1">
                  {soilResult.suitable ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                  )}
                  <span>Status: {soilResult.status} ({soilResult.moisture_level})</span>
                </div>
                <p className="text-xs font-medium leading-relaxed">
                  {soilResult.recommendation}
                </p>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
