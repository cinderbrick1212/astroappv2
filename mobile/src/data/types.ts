/**
 * Content Layer — TypeScript interfaces
 *
 * Every piece of interpretive text, remedy, description, or prediction
 * in the app must conform to one of these interfaces and live in the
 * corresponding data file — NOT hardcoded inside a screen or service.
 *
 * To edit any Jyotish content: open the relevant data file and change
 * the text fields. No component code needs to change.
 */

// ─────────────────────────────────────────────
// Shared primitives
// ─────────────────────────────────────────────

export type GrahaKey =
  | 'sun' | 'moon' | 'mars' | 'mercury'
  | 'jupiter' | 'venus' | 'saturn' | 'rahu' | 'ketu';

export type RashiKey =
  | 'aries' | 'taurus' | 'gemini' | 'cancer'
  | 'leo' | 'virgo' | 'libra' | 'scorpio'
  | 'sagittarius' | 'capricorn' | 'aquarius' | 'pisces';

export type NakshatraKey =
  | 'ashwini' | 'bharani' | 'krittika' | 'rohini' | 'mrigashira'
  | 'ardra' | 'punarvasu' | 'pushya' | 'ashlesha' | 'magha'
  | 'purva_phalguni' | 'uttara_phalguni' | 'hasta' | 'chitra' | 'swati'
  | 'vishakha' | 'anuradha' | 'jyeshtha' | 'mula' | 'purva_ashadha'
  | 'uttara_ashadha' | 'shravana' | 'dhanishtha' | 'shatabhisha'
  | 'purva_bhadrapada' | 'uttara_bhadrapada' | 'revati';

export type ElementKey = 'fire' | 'earth' | 'air' | 'water';
export type ModalityKey = 'moveable' | 'fixed' | 'dual';
export type NatureKey = 'benefic' | 'malefic' | 'neutral';
export type YogaQuality = 'benefic' | 'malefic' | 'neutral';
export type KootName =
  | 'varna' | 'vashya' | 'tara' | 'yoni'
  | 'graha_maitri' | 'gana' | 'bhakoot' | 'nadi';

// ─────────────────────────────────────────────
// Graha (Planet) content
// ─────────────────────────────────────────────

export interface GrahaContent {
  key: GrahaKey;
  name: string;           // English name
  nameHindi: string;      // Sanskrit / Hindi name
  glyph: string;          // Unicode astrological glyph
  nature: NatureKey;
  gender: 'male' | 'female' | 'neutral';
  element: ElementKey;
  rulerOf: RashiKey[];    // Signs this graha rules
  exaltedIn: RashiKey;
  debilitatedIn: RashiKey;
  karakas: string[];      // What this planet signifies (max 5 keywords)
  dayOfWeek: string;
  /** One-sentence essence — shown in chips and list items */
  brief: string;
  /** 2–3 sentence description — shown in card previews */
  standard: string;
  /** 4–6 sentence deep psychological interpretation — shown in detail dialogs */
  deep: string;
  /** Divinatory meaning when strong in the chart */
  whenStrong: string;
  /** Divinatory meaning when weak / afflicted in the chart */
  whenAfflicted: string;
}

// ─────────────────────────────────────────────
// Rashi (Sign) content
// ─────────────────────────────────────────────

export interface RashiContent {
  key: RashiKey;
  number: number;         // 1 (Aries) … 12 (Pisces)
  name: string;
  nameHindi: string;
  glyph: string;
  element: ElementKey;
  modality: ModalityKey;
  ruler: GrahaKey;
  bodyPart: string;
  brief: string;
  standard: string;
  /** Lagna (rising sign) specific interpretation */
  lagnaInterpretation: string;
  /** Rashi (Moon sign) specific interpretation */
  rashiInterpretation: string;
}

// ─────────────────────────────────────────────
// Nakshatra content
// ─────────────────────────────────────────────

export interface NakshatraContent {
  key: NakshatraKey;
  number: number;           // 1–27
  name: string;
  nameHindi: string;
  ruler: GrahaKey;          // Dasha lord
  deity: string;
  symbol: string;
  startDeg: number;         // Sidereal start degree (0–360)
  endDeg: number;
  nature: 'deva' | 'manava' | 'rakshasa';
  gana: 'deva' | 'manava' | 'rakshasa';  // for Kundli Milan Gana Koot
  gender: 'male' | 'female';
  caste: string;
  animal: string;           // Yoni animal — used in Yoni Koot
  brief: string;
  standard: string;
  /** Moon in this nakshatra — divinatory reading */
  moonInterpretation: string;
  /** Lagna in this nakshatra — divinatory reading */
  lagnaInterpretation: string;
  compatibleNakshatras: NakshatraKey[];
  incompatibleNakshatras: NakshatraKey[];
}

// ─────────────────────────────────────────────
// Yoga content
// ─────────────────────────────────────────────

export interface YogaContent {
  key: string;
  name: string;
  nameHindi: string;
  quality: YogaQuality;
  category: 'raja' | 'dhana' | 'dosha' | 'pancha_mahapurusha' | 'other';
  formingCondition: string;     // Technical condition for formation
  brief: string;
  standard: string;
  /** Divinatory prediction when this yoga is present */
  divination: string;
  remedy?: string;              // Present only for malefic doshas
}

// ─────────────────────────────────────────────
// Vimshottari Dasha content
// ─────────────────────────────────────────────

export interface DashaContent {
  graha: GrahaKey;
  durationYears: number;
  brief: string;
  /** General period theme — shown in the Dasha card */
  periodTheme: string;
  /** Positive manifestations during this Mahadasha */
  positive: string;
  /** Challenges / shadow side of this Mahadasha */
  challenging: string;
  /** Divinatory prediction for the current period */
  divination: string;
  /** Recommended spiritual practices during this period */
  spiritualPractice: string;
}

// ─────────────────────────────────────────────
// Graha Shanti Remedy content
// ─────────────────────────────────────────────

export interface RemedyContent {
  graha: GrahaKey;
  /** Primary gemstone recommendation */
  gemstone: string;
  gemstoneHindi: string;
  gemstoneDetails: string;      // Metal, finger, day to wear
  /** Beej mantra (seed mantra) */
  beejMantra: string;
  mantraCount: string;          // e.g., "108 times daily"
  mantraDay: string;
  /** Yantra details */
  yantra: string;
  yantraDetails: string;
  /** Charitable donation */
  charity: string;
  charityDay: string;
  /** Fasting recommendation */
  fasting: string;
  /** Deity worship */
  deity: string;
  /** Color to wear / use */
  luckyColor: string;
  /** Food offering */
  foodOffering: string;
  /** Short remedy prescription shown in tool screens */
  brief: string;
  /** Full remedy description shown in Graha Shanti screen */
  full: string;
}

// ─────────────────────────────────────────────
// Ashtakoot (Kundli Milan) content
// ─────────────────────────────────────────────

export interface KootContent {
  key: KootName;
  name: string;
  nameHindi: string;
  maxPoints: number;
  whatItMeasures: string;
  /** Verdict labels indexed by scored points (0 … maxPoints) */
  verdicts: Record<number, string>;
  /** Explanation shown when points are 0 */
  zeroExplanation: string;
  /** Explanation shown when full points */
  fullExplanation: string;
}

export interface MilanVerdictContent {
  minScore: number;
  maxScore: number;
  label: string;
  labelHindi: string;
  description: string;
  remedyRequired: boolean;
  remedy?: string;
}

// ─────────────────────────────────────────────
// Panchang content
// ─────────────────────────────────────────────

export interface TithiContent {
  number: number;         // 1–30 (15 Shukla + 15 Krishna)
  name: string;
  nameHindi: string;
  paksha: 'shukla' | 'krishna';
  nature: 'nanda' | 'bhadra' | 'jaya' | 'rikta' | 'purna';
  auspicious: boolean;
  brief: string;
  /** Activities favored on this Tithi */
  favoredActivities: string[];
  /** Activities to avoid on this Tithi */
  avoidActivities: string[];
}

export interface PanchangYogaContent {
  number: number;       // 1–27
  name: string;
  nameHindi: string;
  nature: 'auspicious' | 'inauspicious' | 'mixed';
  brief: string;
}

export interface KaranaContent {
  name: string;
  nameHindi: string;
  nature: 'auspicious' | 'inauspicious' | 'mixed';
  brief: string;
}

// ─────────────────────────────────────────────
// Muhurta content
// ─────────────────────────────────────────────

export interface MuhurtaActivityContent {
  key: string;
  name: string;
  nameHindi: string;
  icon: string;               // Material Community Icon name
  description: string;
  bestTithis: number[];       // Tithi numbers (1–30)
  bestNakshatras: NakshatraKey[];
  bestDays: string[];         // Day names
  avoidNakshatras: NakshatraKey[];
  avoidDays: string[];
  brief: string;
}

// ─────────────────────────────────────────────
// Daily Rashifal (Horoscope) content
// ─────────────────────────────────────────────

export interface RashifalContent {
  rashi: RashiKey;
  /** 7 predictions indexed 0=Sunday … 6=Saturday */
  weekdayPredictions: [string, string, string, string, string, string, string];
  /** Lucky number per weekday (0–6) */
  luckyNumbers: [number, number, number, number, number, number, number];
  /** Lucky color per weekday (0–6) */
  luckyColors: [string, string, string, string, string, string, string];
  /** Favorable activities for this rashi in general */
  favorableActivities: string;
  /** Challenge area for this rashi in general */
  challengeArea: string;
}
