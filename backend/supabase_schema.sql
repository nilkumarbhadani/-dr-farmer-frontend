-- ====================================================================
-- DR. FARMER (AgriVision) - COMPLETE SUPABASE DATABASE SCHEMA & DATASET
-- ====================================================================
-- Instructions:
-- 1. Open your Supabase Project Dashboard (https://supabase.com/dashboard)
-- 2. Go to "SQL Editor" on the left menu
-- 3. Click "New query", paste this entire file, and click "RUN"
-- ====================================================================

-- --------------------------------------------------------------------
-- 1. TABLE: DISEASE CATALOG & ADVISORY KNOWLEDGEBASE
-- (Stores the 38 Plant Classes & Livestock Classes used by the ML model)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.disease_catalog (
    id BIGSERIAL PRIMARY KEY,
    entity_type TEXT NOT NULL CHECK (entity_type IN ('plant', 'livestock')),
    class_index INTEGER NOT NULL,
    disease_name TEXT NOT NULL,
    disease_name_hi TEXT NOT NULL,
    severity TEXT NOT NULL CHECK (severity IN ('healthy', 'caution', 'urgent')),
    medical_treatment TEXT NOT NULL,
    home_remedy TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_entity_class UNIQUE (entity_type, class_index)
);

-- --------------------------------------------------------------------
-- 2. TABLE: DIAGNOSTIC LOGS (AI Scan History)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.diagnostic_logs (
    id BIGSERIAL PRIMARY KEY,
    scan_id UUID DEFAULT gen_random_uuid() NOT NULL,
    entity_type TEXT NOT NULL CHECK (entity_type IN ('plant', 'livestock')),
    entity_id TEXT DEFAULT 'farm_01',
    pathology_detected TEXT NOT NULL,
    confidence_score NUMERIC(5, 4) NOT NULL,
    scan_timestamp TIMESTAMPTZ DEFAULT NOW(),
    sync_status TEXT DEFAULT 'SYNCED'
);

-- --------------------------------------------------------------------
-- 3. TABLE: CROP CYCLES (Farm Record Book)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.crop_cycles (
    id BIGSERIAL PRIMARY KEY,
    crop_id TEXT UNIQUE NOT NULL,
    farmer_id TEXT NOT NULL DEFAULT 'farm_01',
    season TEXT NOT NULL,                  -- 'Kharif', 'Rabi', 'Zaid'
    crop_name TEXT NOT NULL,
    sowing_date DATE NOT NULL,
    expected_harvest_date DATE,
    pesticide_applied INTEGER DEFAULT 0,  -- 0 = No, 1 = Yes
    safe_for_fodder INTEGER DEFAULT 1,    -- 0 = No, 1 = Yes
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 4. TABLE: LIVESTOCK PROFILES (Animal Health & Vaccination)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.livestock_profiles (
    id BIGSERIAL PRIMARY KEY,
    farmer_id TEXT NOT NULL DEFAULT 'farm_01',
    animal_tag TEXT NOT NULL,              -- e.g. 'CATTLE-01', 'TAG-104'
    species TEXT NOT NULL,                 -- 'Cow', 'Buffalo', 'Goat', 'Sheep'
    vaccination_name TEXT NOT NULL,        -- 'FMD (Foot & Mouth)', 'Brucellosis', etc.
    last_vaccination_date DATE NOT NULL,
    next_due_date DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 5. ENABLE ROW LEVEL SECURITY (RLS) & PUBLIC POLICIES
-- --------------------------------------------------------------------
ALTER TABLE public.disease_catalog ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diagnostic_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crop_cycles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.livestock_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public access for disease_catalog" ON public.disease_catalog;
CREATE POLICY "Public access for disease_catalog" ON public.disease_catalog
    FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access for diagnostic_logs" ON public.diagnostic_logs;
CREATE POLICY "Public access for diagnostic_logs" ON public.diagnostic_logs
    FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access for crop_cycles" ON public.crop_cycles;
CREATE POLICY "Public access for crop_cycles" ON public.crop_cycles
    FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access for livestock_profiles" ON public.livestock_profiles;
CREATE POLICY "Public access for livestock_profiles" ON public.livestock_profiles
    FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- --------------------------------------------------------------------
-- 6. SEED ALL 38 PLANT DISEASE CLASSES + LIVESTOCK DATASET
-- --------------------------------------------------------------------
INSERT INTO public.disease_catalog (entity_type, class_index, disease_name, disease_name_hi, severity, medical_treatment, home_remedy)
VALUES
('plant', 0, 'Apple: Apple Scab', 'सेब: पपड़ी रोग (Scab)', 'caution', 'Apply Mancozeb, Captan, or Myclobutanil fungicide.', 'Rake and destroy fallen leaves; prune for optimal air circulation.'),
('plant', 1, 'Corn (Maize): Northern Leaf Blight', 'मक्का: उत्तरी पत्ती झुलसा रोग', 'urgent', 'Apply Mancozeb or Strobilurin fungicides at first sign of lesions.', 'Destroy infected stalks and rotate with non-host crops like legumes.'),
('plant', 2, 'Corn (Maize): Healthy', 'मक्का: स्वस्थ', 'healthy', 'No intervention needed.', 'Maintain timely irrigation during silking and tasseling phases.'),
('plant', 3, 'Grape: Black Rot', 'अंगूर: काला सड़न रोग', 'urgent', 'Apply Mancozeb, Ziram, or Myclobutanil early season.', 'Prune vines to maximize canopy sun penetration and discard dried mummies.'),
('plant', 4, 'Grape: Esca (Black Measles)', 'अंगूर: एस्का रोग (काला खसरा)', 'urgent', 'Apply Fosetyl-Al or trunk wound protectants.', 'Avoid pruning in wet weather; remove severely infected vines.'),
('plant', 5, 'Grape: Leaf Blight (Isariopsis)', 'अंगूर: पत्ती झुलसा रोग', 'caution', 'Apply copper oxychloride or Bordeaux mixture.', 'Spray neem-based biopesticide and improve canopy aeration.'),
('plant', 6, 'Grape: Healthy', 'अंगूर: स्वस्थ', 'healthy', 'No intervention needed.', 'Maintain trellis structure and balanced potassium nutrition.'),
('plant', 7, 'Orange: Citrus Greening (Huanglongbing)', 'संतरा/नींबू: सिट्रस ग्रीनिंग रोग', 'urgent', 'Control Asian citrus psyllid vector with Imidacloprid or Dimethoate.', 'Apply foliar micronutrient spray (Zinc, Iron) and remove infected trees.'),
('plant', 8, 'Peach: Bacterial Spot', 'आड़ू: जीवाणु धब्बा रोग', 'urgent', 'Apply Copper hydroxide or Oxytetracycline bactericide.', 'Avoid overhead irrigation; spray diluted copper-soap solution.'),
('plant', 9, 'Peach: Healthy', 'आड़ू: स्वस्थ', 'healthy', 'No intervention needed.', 'Apply dormant oil spray in winter and maintain root mulch.'),
('plant', 10, 'Pepper Bell: Bacterial Spot', 'शिमला मिर्च: जीवाणु धब्बा रोग', 'urgent', 'Apply copper-based bactericide mixed with Mancozeb.', 'Spray diluted neem oil and maintain wide plant spacing.'),
('plant', 11, 'Apple: Black Rot', 'सेब: काला सड़न रोग', 'urgent', 'Apply Thiophanate-methyl or Captan fungicide at petal fall.', 'Prune dead wood, remove mummified fruits and cankers.'),
('plant', 12, 'Pepper Bell: Healthy', 'शिमला मिर्च: स्वस्थ', 'healthy', 'No intervention needed.', 'Maintain consistent soil moisture and organic compost feeding.'),
('plant', 13, 'Potato: Early Blight', 'आलू: अगेती झुलसा', 'caution', 'Apply Mancozeb, Chlorothalonil, or Azoxystrobin.', 'Prune lower yellowing leaves; apply baking soda spray (1 tsp/L).'),
('plant', 14, 'Potato: Late Blight', 'आलू: पछेती झुलसा', 'urgent', 'Apply systemic Metalaxyl, Dimethomorph, or Cymoxanil.', 'Immediately remove and burn blighted foliage; keep tubers dry.'),
('plant', 15, 'Potato: Healthy', 'आलू: स्वस्थ', 'healthy', 'No intervention needed.', 'Hill soil properly around potato stems to shield tubers.'),
('plant', 16, 'Raspberry: Healthy', 'रास्पबेरी: स्वस्थ', 'healthy', 'No intervention needed.', 'Ensure well-drained soil and adequate trellis support.'),
('plant', 17, 'Soybean: Healthy', 'सोयाबीन: स्वस्थ', 'healthy', 'No intervention needed.', 'Practice crop rotation with gram or wheat.'),
('plant', 18, 'Squash: Powdery Mildew', 'कद्दू/लौकी: चूर्णिल आसिता रोग', 'caution', 'Apply Potassium bicarbonate, Sulfur, or Myclobutanil.', 'Spray diluted sour buttermilk or neem oil emulsion on leaves.'),
('plant', 19, 'Strawberry: Leaf Scorch', 'स्ट्रॉबेरी: पत्ती झुलसा (लीफ स्कॉर्च)', 'caution', 'Apply Captan or Copper fungicide after harvest.', 'Remove dead leaves in autumn and avoid sprinkler watering on foliage.'),
('plant', 20, 'Strawberry: Healthy', 'स्ट्रॉबेरी: स्वस्थ', 'healthy', 'No intervention needed.', 'Apply straw mulch around crowns to keep berries off bare soil.'),
('plant', 21, 'Tomato: Bacterial Spot', 'टमाटर: जीवाणु धब्बा रोग', 'urgent', 'Apply copper hydroxide spray mixed with Mancozeb.', 'Avoid working with wet plants; disinfect stakes and tools.'),
('plant', 22, 'Apple: Cedar Apple Rust', 'सेब: देवदार रतुआ रोग', 'caution', 'Apply Myclobutanil or Chlorothalonil early in spring.', 'Remove nearby red cedar galls and spray neem oil extract.'),
('plant', 23, 'Tomato: Early Blight', 'टमाटर: अगेती झुलसा रोग', 'caution', 'Apply Copper fungicide, Mancozeb, or Chlorothalonil.', 'Prune lower leaves up to 12 inches from ground; mulch base.'),
('plant', 24, 'Tomato: Late Blight', 'टमाटर: पछेती झुलसा रोग', 'urgent', 'Apply systemic Metalaxyl or Dimethomorph immediately.', 'Destroy infected plants immediately; do not compost blighted tissue.'),
('plant', 25, 'Tomato: Leaf Mold', 'टमाटर: पत्ती फफूंद रोग', 'caution', 'Apply Copper fungicide or Difenoconazole.', 'Increase greenhouse ventilation and lower relative humidity below 85%.'),
('plant', 26, 'Tomato: Septoria Leaf Spot', 'टमाटर: सेप्टोरिया पत्ती धब्बा', 'caution', 'Apply Chlorothalonil, Mancozeb, or Copper fungicide.', 'Remove lower spotted leaves; water at base with drip line.'),
('plant', 27, 'Tomato: Spider Mites', 'टमाटर: लाल मकड़ी कीट', 'caution', 'Apply Abamectin, Spiromesifen, or Propargite miticide.', 'Spray strong water jet under leaves; apply neem oil soap solution.'),
('plant', 28, 'Tomato: Target Spot', 'टमाटर: टारगेट स्पॉट रोग', 'caution', 'Apply Azoxystrobin, Chlorothalonil, or Mancozeb.', 'Improve plant spacing for airflow and prune diseased foliage.'),
('plant', 29, 'Tomato: Yellow Leaf Curl Virus', 'टमाटर: पर्ण कुंचन विषाणु (TYLCV)', 'urgent', 'Control whitefly vectors using Imidacloprid or Thiamethoxam.', 'Install yellow sticky traps; cover young nursery with 50-mesh net.'),
('plant', 30, 'Tomato: Mosaic Virus', 'टमाटर: मोज़ेक विषाणु (ToMV)', 'urgent', 'No direct chemical cure; manage insect vectors and aphids.', 'Isolate infected plants; wash hands with milk/soap before handling.'),
('plant', 31, 'Tomato: Healthy', 'टमाटर: स्वस्थ', 'healthy', 'No intervention needed.', 'Continue routine staking, weeding, and balanced NPK feeding.'),
('plant', 32, 'Apple: Healthy', 'सेब: स्वस्थ', 'healthy', 'No intervention needed.', 'Maintain regular watering and balanced organic mulching.'),
('plant', 33, 'Blueberry: Healthy', 'ब्लूबेरी: स्वस्थ', 'healthy', 'No intervention needed.', 'Maintain acidic soil pH (4.5-5.5) and pine needle mulch.'),
('plant', 34, 'Cherry: Powdery Mildew', 'चेरी: चूर्णिल आसिता (पाउडरी मिल्ड्यू)', 'caution', 'Apply Sulfur spray, Myclobutanil, or Potassium bicarbonate.', 'Spray diluted milk-water solution (40:60) or baking soda solution.'),
('plant', 35, 'Cherry: Healthy', 'चेरी: स्वस्थ', 'healthy', 'No intervention needed.', 'Ensure good sun exposure and proper seasonal pruning.'),
('plant', 36, 'Corn (Maize): Cercospora Leaf Spot', 'मक्का: सर्कोस्पोरा पत्ती धब्बा (ग्रे लीफ स्पॉट)', 'caution', 'Apply Azoxystrobin, Pyraclostrobin, or Propiconazole.', 'Practice crop rotation and till crop residues into soil after harvest.'),
('plant', 37, 'Corn (Maize): Common Rust', 'मक्का: सामान्य रतुआ रोग', 'caution', 'Apply systemic Triazole fungicides if pustules appear early.', 'Plant resistant hybrids and ensure balanced nitrogen/potassium feeding.'),
-- Livestock Classes
('livestock', 0, 'Healthy Cattle', 'स्वस्थ पशु', 'healthy', 'No medical intervention needed.', 'Ensure clean drinking water, balanced green fodder/mineral mixture, and routine vaccination schedule.'),
('livestock', 1, 'Lumpy Skin Disease (LSD)', 'लम्पी त्वचा रोग (LSD)', 'urgent', 'Administer prescribed veterinary NSAIDs, fever-reducers, and antibiotics for secondary bacterial infections.', 'Isolate the infected animal immediately, apply neem oil / turmeric paste on skin nodules, and spray vector insect repellents.')
ON CONFLICT (entity_type, class_index) DO UPDATE 
SET disease_name = EXCLUDED.disease_name,
    disease_name_hi = EXCLUDED.disease_name_hi,
    severity = EXCLUDED.severity,
    medical_treatment = EXCLUDED.medical_treatment,
    home_remedy = EXCLUDED.home_remedy;

-- --------------------------------------------------------------------
-- 7. SEED CROP CYCLES, LIVESTOCK PROFILES & DIAGNOSTIC LOGS
-- --------------------------------------------------------------------
INSERT INTO public.crop_cycles (crop_id, farmer_id, season, crop_name, sowing_date, expected_harvest_date, pesticide_applied, safe_for_fodder)
VALUES 
    ('crop-001', 'farm_01', 'Kharif', 'Paddy (Rice)', '2026-06-15', '2026-10-30', 1, 0),
    ('crop-002', 'farm_01', 'Kharif', 'Cotton', '2026-06-20', '2026-11-15', 1, 0),
    ('crop-003', 'farm_01', 'Rabi', 'Wheat (Gehun)', '2026-11-05', '2027-03-25', 0, 1),
    ('crop-004', 'farm_01', 'Rabi', 'Mustard (Sarson)', '2026-10-25', '2027-02-20', 0, 1),
    ('crop-005', 'farm_01', 'Zaid', 'Moong Dal (Green Gram)', '2026-03-10', '2026-05-25', 0, 1)
ON CONFLICT (crop_id) DO NOTHING;

INSERT INTO public.livestock_profiles (farmer_id, animal_tag, species, vaccination_name, last_vaccination_date, next_due_date)
VALUES 
    ('farm_01', 'TAG-COW-01', 'Cow (Gir)', 'Foot & Mouth Disease (FMD)', '2026-01-15', '2026-07-15'),
    ('farm_01', 'TAG-COW-02', 'Cow (Sahiwal)', 'Black Quarter (BQ)', '2026-02-10', '2026-08-10'),
    ('farm_01', 'TAG-BUF-01', 'Buffalo (Murrah)', 'Haemorrhagic Septicaemia (HS)', '2026-03-01', '2026-09-01'),
    ('farm_01', 'TAG-GOAT-01', 'Goat (Beetal)', 'Peste des Petits Ruminants (PPR)', '2026-04-05', '2027-04-05');

INSERT INTO public.diagnostic_logs (scan_id, entity_type, entity_id, pathology_detected, confidence_score, scan_timestamp, sync_status)
VALUES 
    ('e1a47df1-28cf-47a6-bfca-45f865f3f001', 'plant', 'farm_01', 'Tomato: Early Blight', 0.9420, NOW() - INTERVAL '3 days', 'SYNCED'),
    ('e1a47df1-28cf-47a6-bfca-45f865f3f002', 'plant', 'farm_01', 'Potato: Late Blight', 0.9850, NOW() - INTERVAL '2 days', 'SYNCED'),
    ('e1a47df1-28cf-47a6-bfca-45f865f3f003', 'livestock', 'farm_01', 'Cattle: Lumpy Skin Disease', 0.9130, NOW() - INTERVAL '1 day', 'SYNCED'),
    ('e1a47df1-28cf-47a6-bfca-45f865f3f004', 'plant', 'farm_01', 'Corn (Maize): Healthy', 0.9910, NOW(), 'SYNCED');
