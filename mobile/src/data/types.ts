/**
 * Content Layer — TypeScript interfaces
 * All content types for the data library + personalized output types.
 */

// ── Static content types (data library) ──────────────────────────────────────

/** Text depth fields — every data entry uses these tiers */
export interface ContentText {
  brief: string;       // 1 sentence — chips, list items, notifications
  standard: string;    // 2–3 sentences — card previews, summary sections
  deep: string;        // 4–6 sentences — detail dialogs, full readings
}

export interface GrahaContent {
  key: string;                     // 'sun', 'moon', 'mars', …
  name: string;                    // English name
  nameHindi: string;               // Devanagari name
  glyph: string;                   // Unicode symbol
  nature: 'benefic' | 'malefic' | 'neutral';
  karakas: string[];               // Signification keywords
  interpretation: ContentText;     // General interpretation
  whenStrong: string;              // Description when well-placed
  whenAfflicted: string;           // Description when afflicted
}

export interface RashiContent {
  key: string;                     // 'aries', 'taurus', …
  index: number;                   // 0–11
  name: string;                    // English
  nameHindi: string;               // Devanagari
  element: 'fire' | 'earth' | 'air' | 'water';
  quality: 'cardinal' | 'fixed' | 'mutable';
  ruler: string;                   // Graha key
  bodyPart: string;
  lagnaInterpretation: ContentText;
  rashiInterpretation: ContentText;
}

export interface NakshatraContent {
  key: string;                     // 'ashwini', 'bharani', …
  index: number;                   // 0–26
  name: string;                    // English
  nameHindi: string;               // Devanagari
  ruler: string;                   // Dasha lord (graha key)
  deity: string;
  symbol: string;
  quality: string;                 // 'Swift / Light', 'Fierce / Severe', etc.
  startDeg: number;
  endDeg: number;
  moonInterpretation: ContentText;
  lagnaInterpretation: ContentText;
  compatibility: string;           // Brief compatibility note
}

export interface YogaContent {
  key: string;                     // 'gajakesari', 'rajayoga_1_5', …
  name: string;
  nameHindi: string;
  quality: 'benefic' | 'malefic';
  formingCondition: string;        // How this yoga forms
  description: ContentText;
  divination: string;              // Predictive significance
  remedy?: string;                 // Remedy if malefic
}

export interface DashaContent {
  key: string;                     // Graha key of Mahadasha lord
  lord: string;                    // English name
  lordHindi: string;               // Devanagari
  durationYears: number;
  periodTheme: string;             // 1-line theme
  positive: string;                // What goes well
  challenging: string;             // What is difficult
  divination: ContentText;         // Predictive text
  spiritualPractice: string;       // Recommended practice
}

export interface RemedyContent {
  graha: string;                   // Graha key
  gemstone: string;
  gemstoneHindi: string;
  mantraDevanagari: string;
  mantraTransliteration: string;
  yantra: string;
  charity: string;
  fastingDay: string;
  deity: string;
  colour: string;
}

export interface AshtakootContent {
  key: string;                     // 'varna', 'vashya', …
  name: string;
  nameHindi: string;
  maxPoints: number;
  description: string;
}

export interface AshtakootVerdictThreshold {
  minScore: number;
  maxScore: number;
  verdict: string;
  verdictHindi: string;
  description: string;
}

export interface PanchangTithiContent {
  index: number;                   // 1–30
  name: string;
  nameHindi: string;
  nature: 'shubh' | 'ashubh' | 'mixed';
  auspiciousness: string;
  favoredActivities: string[];
  avoidedActivities: string[];
}

export interface PanchangYogaContent {
  index: number;                   // 0–26
  name: string;
  nameHindi: string;
  nature: 'shubh' | 'ashubh' | 'mixed';
  description: string;
}

export interface KaranaContent {
  index: number;                   // 0–10
  name: string;
  nameHindi: string;
  nature: 'shubh' | 'ashubh' | 'mixed';
  description: string;
}

export interface MuhurtaActivityContent {
  key: string;                     // 'marriage', 'travel', …
  name: string;
  nameHindi: string;
  bestTithis: number[];
  bestNakshatras: string[];        // Nakshatra keys
  bestDays: string[];              // 'monday', 'tuesday', …
  avoidConditions: string;
  guidance: ContentText;
}

export interface RashifalEntry {
  rashiKey: string;                // 'aries', 'taurus', …
  weekday: number;                 // 0=Sunday, 1=Monday, …
  prediction: string;
  luckyColor: string;
  luckyNumber: number;
}

export interface DashaModifier {
  dashaLord: string;               // Graha key
  modifier: string;                // Additional prediction modifier
}

export interface GocharModifier {
  transitGraha: string;            // Graha key
  natalHouse: number;              // 1–12
  modifier: string;                // Transit prediction
}

// ── Personalized output types (what screens receive) ─────────────────────────

export interface PersonalizedPlanetCard {
  planet: string;
  sign: string;
  house: number;
  dignity: string;
  brief: string;
  remedy?: string;
}

export interface PersonalizedYogaCard {
  name: string;
  nameHindi: string;
  quality: 'benefic' | 'malefic';
  description: string;
  remedy?: string;
}

export interface PersonalizedRemedyCard {
  graha: string;
  gemstone: string;
  mantra: string;
  charity: string;
  day: string;
}

export interface PersonalizedKundliContent {
  greeting: string;
  lagnaCard: { title: string; description: string; bodyPart: string };
  rashiCard: { title: string; description: string };
  nakshatraCard: {
    title: string;
    rulerName: string;
    symbol: string;
    description: string;
    dashaStart: string;
  };
  dashaCard: {
    lord: string;
    antardasha: string;
    endYear: number;
    remaining: string;
    prediction: string;
    spiritualPractice: string;
  };
  yogaCards: PersonalizedYogaCard[];
  planetCards: PersonalizedPlanetCard[];
  remedyCards: PersonalizedRemedyCard[];
}

export interface PersonalizedMilanContent {
  totalScore: number;
  maxScore: number;
  verdict: string;
  verdictHindi: string;
  verdictDescription: string;
  kootCards: Array<{
    name: string;
    nameHindi: string;
    obtained: number;
    max: number;
    description: string;
  }>;
  mangalDosha: {
    personA: boolean;
    personB: boolean;
    description: string;
  };
}

export interface PersonalizedDashaContent {
  currentMaha: {
    lord: string;
    lordHindi: string;
    theme: string;
    prediction: string;
    spiritualPractice: string;
    endDate: string;
    remaining: string;
  };
  currentAntar: {
    lord: string;
    lordHindi: string;
    prediction: string;
    endDate: string;
  };
  upcomingPeriods: Array<{
    lord: string;
    lordHindi: string;
    theme: string;
    startYear: number;
    endYear: number;
  }>;
}

export interface PersonalizedGocharContent {
  sadeSatiCard: {
    isActive: boolean;
    phase: string;
    description: string;
    remedy: string;
  };
  transitCards: Array<{
    graha: string;
    currentSign: string;
    natalHouse: number;
    interpretation: string;
  }>;
}

export interface PersonalizedVarshaphalContent {
  year: number;
  varshaLagna: string;
  muntha: { sign: string; house: number; interpretation: string };
  planetCards: PersonalizedPlanetCard[];
  yearTheme: string;
}

export interface PersonalizedVargaContent {
  chartType: string;
  chartTypeHindi: string;
  purpose: string;
  planetCards: PersonalizedPlanetCard[];
  highlights: string[];
}

export interface PersonalizedPanchangContent {
  tithiCard: { name: string; nameHindi: string; nature: string; description: string };
  yogaCard: { name: string; nameHindi: string; nature: string; description: string };
  karanaCard: { name: string; nameHindi: string; nature: string; description: string };
  sunriseSunset: { sunrise: string; sunset: string };
  rahuKaal: string;
  gulikaKaal: string;
  abhijitMuhurta: string;
}

export interface PersonalizedMuhurtaContent {
  activity: string;
  windows: Array<{
    date: string;
    tithi: string;
    nakshatra: string;
    score: number;
    guidance: string;
  }>;
}

export interface PersonalizedTithiContent {
  currentTithi: {
    name: string;
    nameHindi: string;
    number: number;
    nature: string;
    description: string;
    favoredActivities: string[];
    avoidedActivities: string[];
  };
  moonPhase: string;
  moonSign: string;
  nextFullMoon: string;
  nextNewMoon: string;
}

export interface PersonalizedNakshatraContent {
  birthNakshatra: {
    name: string;
    nameHindi: string;
    ruler: string;
    deity: string;
    symbol: string;
    pada: number;
    interpretation: string;
  };
  compatibility: string;
  currentMoonNakshatra: string;
  currentMoonNakshatraMeaning: string;
}

export interface PersonalizedGrahanContent {
  eclipses: Array<{
    type: string;
    date: string;
    rashi: string;
    nakshatra: string;
    visibleFromIndia: boolean;
    significance: string;
  }>;
  personalImpact: Array<{
    eclipseDate: string;
    affectedGraha: string;
    orb: number;
    interpretation: string;
    remedy: string;
  }>;
}

export interface PersonalizedAshtakavargaContent {
  savSummary: string;
  strongHouses: Array<{ house: number; points: number; interpretation: string }>;
  weakHouses: Array<{ house: number; points: number; interpretation: string }>;
}

export interface PersonalizedPrashnaContent {
  question: string;
  category: string;
  prashnaLagna: string;
  moonSign: string;
  interpretation: string;
  timing: string;
  guidance: string;
  remedyCards: PersonalizedRemedyCard[];
}

export interface PersonalizedHoraContent {
  currentHora: {
    graha: string;
    grahaHindi: string;
    nature: string;
    suitableFor: string[];
    avoidFor: string[];
  };
  horaSchedule: Array<{
    graha: string;
    grahaHindi: string;
    startTime: string;
    endTime: string;
    isCurrent: boolean;
  }>;
}

export interface PersonalizedRemedyContent {
  afflictedGrahas: Array<{
    graha: string;
    grahaHindi: string;
    reason: string;
    severity: 'high' | 'medium' | 'low';
    gemstone: string;
    mantra: string;
    charity: string;
    fastingDay: string;
    deity: string;
    colour: string;
  }>;
  generalGuidance: string;
}

export interface PersonalizedRashifalContent {
  greeting: string;
  rashi: string;
  rashiHindi: string;
  prediction: string;
  luckyColor: string;
  luckyNumber: number;
  dashaModifier: string;
  gocharModifier: string;
}
