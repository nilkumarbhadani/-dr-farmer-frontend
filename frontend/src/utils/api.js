/**
 * Dr. Farmer API Client (project SIH-In)
 * Connects Frontend cleanly to FastAPI Python Backend
 * Supports relative proxying, direct localhost:8000, and offline fallback.
 */

const BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

async function fetchWithFallback(endpoint, options = {}) {
  // 1. Try relative endpoint first (works with Vite proxy / Netlify / relative routing)
  try {
    const res = await fetch(endpoint, options);
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    // Relative request failed, try direct backend URL
  }

  // 2. Try direct backend BASE_URL fallback
  try {
    const directUrl = `${BASE_URL}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
    const directRes = await fetch(directUrl, options);
    if (directRes.ok) {
      return await directRes.json();
    }
    const errText = await directRes.text();
    throw new Error(`Server returned ${directRes.status}: ${errText}`);
  } catch (err) {
    console.warn(`[API Client] Fetch to ${endpoint} failed:`, err.message);
    throw err;
  }
}

/**
 * 1. Health Status Check
 * GET /api/status or GET /
 */
export async function getBackendHealth() {
  try {
    return await fetchWithFallback('/api/status');
  } catch (err) {
    return {
      status: "Offline Mode",
      plant_model_loaded: false,
      livestock_model_loaded: false,
      supabase_connected: false,
      offline: true
    };
  }
}

/**
 * 2. Diagnostic AI Image Scan
 * POST /api/scan/
 */
export async function sendDiagnosticScan(imageFile, entityType = 'plant', entityId = 'farm_01') {
  const normalizedType = (entityType === 'cattle' || entityType === 'livestock' || entityType === 'animal')
    ? 'livestock'
    : 'plant';

  const formData = new FormData();
  formData.append('file', imageFile);
  formData.append('entity_type', normalizedType);
  formData.append('entity_id', entityId);

  return await fetchWithFallback('/api/scan/', {
    method: 'POST',
    body: formData,
  });
}

/**
 * 3. Weather Forecast
 * GET /api/weather/?city={city}&latitude={lat}&longitude={lon}
 */
export async function getFarmingWeather(city = null, latitude = null, longitude = null) {
  const params = new URLSearchParams();
  if (city) params.append('city', city);
  if (latitude) params.append('latitude', latitude);
  if (longitude) params.append('longitude', longitude);

  const queryString = params.toString();
  const endpoint = `/api/weather/${queryString ? '?' + queryString : ''}`;

  return await fetchWithFallback(endpoint);
}

/**
 * 4. Soil Moisture Suitability Check
 * POST /api/soil-check/
 */
export async function checkSoilSuitability(moisturePercentage, cropName) {
  return await fetchWithFallback('/api/soil-check/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      moisture_percentage: parseFloat(moisturePercentage),
      crop_name: cropName
    })
  });
}

/**
 * 5. Fetch Crop Cycles
 * GET /api/crops/{farmer_id}
 */
export async function getCropCycles(farmerId = 'farm_01') {
  return await fetchWithFallback(`/api/crops/${farmerId}`);
}

/**
 * 6. Add Crop Cycle Entry
 * POST /api/crops/
 */
export async function addCropCycle(cropData) {
  return await fetchWithFallback('/api/crops/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      farmer_id: cropData.farmer_id || 'farm_01',
      season: cropData.season || 'Kharif',
      crop_name: cropData.crop_name || 'Crop',
      sowing_date: cropData.sowing_date || new Date().toISOString().split('T')[0],
      expected_harvest_date: cropData.expected_harvest_date || new Date().toISOString().split('T')[0],
      pesticide_applied: cropData.pesticide_applied ? 1 : 0,
      safe_for_fodder: cropData.safe_for_fodder ? 1 : 0
    })
  });
}

/**
 * 7. Add Livestock Entry
 * POST /api/livestock/
 */
export async function addLivestockEntry(livestockData) {
  return await fetchWithFallback('/api/livestock/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      farmer_id: livestockData.farmer_id || 'farm_01',
      animal_tag: livestockData.animal_tag || 'CATTLE-01',
      species: livestockData.species || 'Cow',
      vaccination_name: livestockData.vaccination_name || 'General Health',
      last_vaccination_date: livestockData.last_vaccination_date || new Date().toISOString().split('T')[0],
      next_due_date: livestockData.next_due_date || new Date().toISOString().split('T')[0]
    })
  });
}

/**
 * 8. Dynamic Translations
 * GET /api/translations/{language}
 */
export async function getBackendTranslations(language = 'English') {
  return await fetchWithFallback(`/api/translations/${language}`);
}

/**
 * 9. Voice Command Processing
 * POST /api/voice/
 */
export async function processVoiceCommand(audioFile) {
  const formData = new FormData();
  formData.append('file', audioFile, 'voice_command.wav');

  return await fetchWithFallback('/api/voice/', {
    method: 'POST',
    body: formData,
  });
}
