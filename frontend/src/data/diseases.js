export const DISEASES_DATABASE = [
  // CROP DISEASES
  {
    id: "crop-blight-1",
    category: "crop",
    cropType: "Tomato / आलू-टमाटर",
    name: "Early Leaf Blight",
    nameHindi: "अगेती झुलसा रोग (पत्ती का रोग)",
    severity: "urgent", // red
    confidence: "98%",
    imageUrl: "https://images.unsplash.com/photo-1592417817098-8f3d6eb2250d?w=800&auto=format&fit=crop&q=80",
    symptomShort: "Brown concentric ring spots with yellow halos on lower leaves.",
    symptoms: [
      "Dark brown circular spots on leaves",
      "Yellowing around infected patches",
      "Leaves drying and falling rapidly"
    ],
    homeRemedy: {
      title: "Neem & Wood Ash Spray (देसी नुस्खा)",
      icon: "leaf",
      steps: [
        "Boil 200g Neem leaves in 2L water, mix with 10L clean water.",
        "Add 1 tablespoon baking soda and spray on leaves every 4 days.",
        "Sprinkle dry wood ash around the stem base to reduce soil moisture fungi."
      ]
    },
    medicalTreatment: {
      title: "Fungicide Spray (दवा का छिड़काव)",
      icon: "flask",
      medicineName: "Mancozeb 75% WP or Copper Oxychloride",
      dosage: "2 grams per 1 Liter of water (30g per 15L spray tank)",
      instruction: "Spray during early morning or evening. Repeat once after 10 days if rainy."
    },
    audioText: "Alert! Urgent Early Leaf Blight detected on tomato crop. Remove infected leaves immediately. Spray Neem water or Mancozeb fungicide. Call Kisan Call Center 1800-180-1551 for assistance."
  },
  {
    id: "crop-rust-2",
    category: "crop",
    cropType: "Wheat / गेहूं",
    name: "Yellow Rust (Puccinia)",
    nameHindi: "पीला रतुआ रोग (गेहूं की पत्ती)",
    severity: "caution", // yellow
    confidence: "92%",
    imageUrl: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&auto=format&fit=crop&q=80",
    symptomShort: "Yellow powdery stripes along leaf veins, spreads with cool wind.",
    symptoms: [
      "Yellow powder stains on touching leaves",
      "Linear stripes of pustules on leaf surface",
      "Stunted growth of ears and grains"
    ],
    homeRemedy: {
      title: "Buttermilk & Hing Solution (छाछ व हींग घोल)",
      icon: "leaf",
      steps: [
        "Take 5-day old sour buttermilk (chaas) 2 Liters.",
        "Mix with 10g Hing (asafoetida) in 15L water spray tank.",
        "Spray thoroughly on affected crops on a sunny morning."
      ]
    },
    medicalTreatment: {
      title: "Propiconazole 25% EC (कवकनाशी)",
      icon: "flask",
      medicineName: "Tilt / Propiconazole 25% EC",
      dosage: "1 ml per 1 Liter water (15 ml in 15 Liter pump)",
      instruction: "Single spray is sufficient if applied at initial stage."
    },
    audioText: "Yellow Rust caution detected. Treat with sour buttermilk spray or Propiconazole 25 EC. Avoid excess nitrogen fertilizer."
  },
  {
    id: "crop-healthy-3",
    category: "crop",
    cropType: "Rice / धान",
    name: "Healthy Green Crop",
    nameHindi: "स्वस्थ फसल (कोई रोग नहीं)",
    severity: "healthy", // green
    confidence: "99%",
    imageUrl: "https://images.unsplash.com/photo-1536939459926-301728717817?w=800&auto=format&fit=crop&q=80",
    symptomShort: "Vibrant emerald green leaves, good tillering, no active pest damage.",
    symptoms: [
      "Even green coloration",
      "Strong standing stems",
      "Optimal chlorophyll and leaf texture"
    ],
    homeRemedy: {
      title: "Jeevamrit Maintenance (जीवामृत पोषण)",
      icon: "leaf",
      steps: [
        "Apply 200L Jeevamrit per acre with irrigation water every 15 days.",
        "Ensure field drainage to prevent waterlogging."
      ]
    },
    medicalTreatment: {
      title: "NPK Booster (संतुलित खाद)",
      icon: "flask",
      medicineName: "19:19:19 Water Soluble Fertilizer",
      dosage: "5g per Liter of water as foliar spray during panicle stage.",
      instruction: "Keep soil moist and maintain 2 inches water standing."
    },
    audioText: "Great news! Your crop is healthy and disease free. Continue regular irrigation and organic nourishment."
  },

  // CATTLE DISEASES
  {
    id: "cattle-mastitis-1",
    category: "cattle",
    cattleType: "Dairy Cow / दुधारू गाय",
    name: "Bovine Mastitis",
    nameHindi: "स्तनशोथ (थन का रोग)",
    severity: "urgent", // red
    confidence: "96%",
    imageUrl: "https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?w=800&auto=format&fit=crop&q=80",
    symptomShort: "Swollen hot udder, painful milking, watery or curd-like milk clots.",
    symptoms: [
      "Hard, red, and hot udder quarter",
      "Cow resists touching or milking",
      "Milk turns yellowish or contains white flakes"
    ],
    homeRemedy: {
      title: "Turmeric & Aloe Vera Paste (हल्दी-घृतकुमारी लेप)",
      icon: "heart",
      steps: [
        "Grind 250g fresh Aloe Vera pulp with 50g fresh Turmeric and 15g Chuna (calcium hydroxide).",
        "Wash udder with warm potassium permanganate water and dry with clean towel.",
        "Apply the smooth herbal paste over the affected quarter 3 times a day."
      ]
    },
    medicalTreatment: {
      title: "Intramammary Antibiotic Tube (डॉक्टर द्वारा दवा)",
      icon: "syringe",
      medicineName: "Ceftiofur / Amoxicillin Intra-mammary Infusion & Meloxicam injection",
      dosage: "1 tube infusion after complete milking out (under vet supervision)",
      instruction: "Keep animal in clean, dry bedding. Call veterinary doctor immediately."
    },
    audioText: "Critical Alert! Bovine Mastitis detected. Immediately milk out affected quarter, apply turmeric paste, and contact a government veterinary doctor."
  },
  {
    id: "cattle-fmd-2",
    category: "cattle",
    cattleType: "Buffalo / भैंस",
    name: "Foot and Mouth Disease (FMD)",
    nameHindi: "खुरपका-मुंहपका रोग (FMD)",
    severity: "urgent", // red
    confidence: "97%",
    imageUrl: "https://images.unsplash.com/photo-1546445317-29f4545e9d53?w=800&auto=format&fit=crop&q=80",
    symptomShort: "Blisters on tongue and gums, drooling saliva, lameness, foot sores.",
    symptoms: [
      "Excessive ropey salivation from mouth",
      "Painful blisters inside mouth and hoof clefts",
      "High fever (104°F) and loss of appetite"
    ],
    homeRemedy: {
      title: "Alum & Honey Mouth Wash (फिटकरी व शहद का लेप)",
      icon: "heart",
      steps: [
        "Wash mouth sores with 2% Alum (Fitkari) warm water twice daily.",
        "Apply pure honey or ghee mixed with turmeric on mouth ulcers for soothing.",
        "Wash hooves with 4% washing soda solution and apply neem oil mixed with camphor on foot lesions."
      ]
    },
    medicalTreatment: {
      title: "Supportive Vet Injections & Antiseptic Wash",
      icon: "syringe",
      medicineName: "Analgesic (Flunixin / Meloxicam) & Oxytetracycline spray",
      dosage: "Dosage as per animal body weight prescribed by Veterinary Surgeon.",
      instruction: "Isolate sick animal immediately from the herd. Prevent sharing feeding troughs."
    },
    audioText: "Urgent FMD outbreak warning! Isolate the animal immediately. Clean mouth with alum water and call the nearest Pashu Chikitsalay."
  },
  {
    id: "cattle-ticks-3",
    category: "cattle",
    cattleType: "Calf / बछड़ा-गाय",
    name: "Tick & Mite Infestation",
    nameHindi: "चिचड़ी व जूं का प्रकोप (परजीवी)",
    severity: "caution", // yellow
    confidence: "94%",
    imageUrl: "https://images.unsplash.com/photo-1527153857715-3908f2ae5e81?w=800&auto=format&fit=crop&q=80",
    symptomShort: "Visible small brown insects on neck, ears, tail root; constant itching.",
    symptoms: [
      "Frequent scratching against walls or poles",
      "Rough coat and blood loss / weakness",
      "Clusters of ticks attached in soft skin folds"
    ],
    homeRemedy: {
      title: "Neem & Camphor Oil Massage (नीम व कपूर तेल)",
      icon: "heart",
      steps: [
        "Mix 500ml pure Neem oil with 20g crushed Camphor (Kapoor).",
        "Rub the oil mixture gently on neck, ears, and under-tail folds.",
        "Ticks will drop off within 4 to 6 hours naturally."
      ]
    },
    medicalTreatment: {
      title: "Flumethrin / Amitraz Pour-On (चिचड़ी नाशक)",
      icon: "syringe",
      medicineName: "Flumethrin 1% Pour-on or Deltamethrin wash",
      dosage: "1 ml per 10 kg body weight applied along the spine line.",
      instruction: "Do not allow animal to lick the solution for 2 hours. Wear gloves."
    },
    audioText: "Tick infestation identified. Apply neem and camphor oil or vet pour-on along backline. Keep cattle shed clean."
  },
  {
    id: "cattle-healthy-4",
    category: "cattle",
    cattleType: "Dairy Cow / दुधारू गाय",
    name: "Healthy Livestock",
    nameHindi: "स्वस्थ पशु (पूर्णतः तंदुरुस्त)",
    severity: "healthy", // green
    confidence: "99%",
    imageUrl: "https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=800&auto=format&fit=crop&q=80",
    symptomShort: "Bright eyes, moist muzzle, regular rumination, active grazing.",
    symptoms: [
      "Wet dewy muzzle (nose)",
      "Continuous calm chewing of cud",
      "Shiny smooth coat and alert ears"
    ],
    homeRemedy: {
      title: "Mineral Mixture & Salt Block (खनिज मिश्रण)",
      icon: "heart",
      steps: [
        "Feed 50g Agrimin / ISI certified mineral mixture daily with concentrate feed.",
        "Provide unlimited fresh clean drinking water and salt licking stone in shed."
      ]
    },
    medicalTreatment: {
      title: "Deworming & Scheduled Vaccination (टीकाकरण)",
      icon: "syringe",
      medicineName: "Albendazole / Fenbendazole tablet (every 3 months)",
      dosage: "FMD and HS/BQ vaccination booster as per district veterinary schedule.",
      instruction: "Keep vaccination card updated in your Kisan Record Book."
    },
    audioText: "Your animal is in prime health! Maintain regular mineral feeding and timely deworming every 3 months."
  }
];

export const QUICK_TIPS = [
  {
    title: "Morning Sun Check",
    titleHi: "सुबह की धूप जांच",
    desc: "Inspect crop undersides before 9 AM for early dew fungal spores.",
    icon: "sun"
  },
  {
    title: "Clean Milking Routine",
    titleHi: "स्वच्छ दूध दोहन",
    desc: "Washing udder with warm water reduces mastitis risk by 80%.",
    icon: "shield"
  },
  {
    title: "Neem Astr Shield",
    titleHi: "नीमास्त्र छिड़काव",
    desc: "Spray organic neem decoction every 14 days as preventative armor.",
    icon: "sprout"
  }
];
