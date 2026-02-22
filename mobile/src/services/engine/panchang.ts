/**
 * Panchang & Muhurta — Sunrise/sunset, inauspicious periods, Hora schedule, Muhurta scorer
 * Pure math — no React Native / Expo imports.
 */

// ── Types ────────────────────────────────────────────────────────────────────

export interface SunriseSunset {
  sunriseMin: number;
  sunsetMin: number;
  sunriseFmt: string;
  sunsetFmt: string;
  dayLengthMin: number;
}

export interface TimeWindow {
  startMin: number;
  endMin: number;
  startFmt: string;
  endFmt: string;
}

export interface HoraSlot {
  slotNumber: number;
  lord: string;
  lordHindi: string;
  startMin: number;
  endMin: number;
  startFmt: string;
  endFmt: string;
  isDaytime: boolean;
}

export type MuhurtaActivity =
  | 'marriage' | 'business' | 'property' | 'travel'
  | 'surgery' | 'naming' | 'education' | 'job';

export interface MuhurtaScore {
  activity: MuhurtaActivity;
  score: number;
  quality: 'excellent' | 'good' | 'acceptable' | 'avoid';
  reasons: string[];
}

// ── Constants ────────────────────────────────────────────────────────────────

// Rahu Kaal slot (1–8) by day of week (0=Sunday)
const RAHU_KAAL_SLOTS = [8, 2, 7, 5, 6, 4, 3];
const GULIKA_KAAL_SLOTS = [6, 5, 4, 3, 2, 1, 7];
const YAMGHANT_SLOTS = [4, 8, 6, 7, 5, 3, 1];

const HORA_LORD_HINDI: Record<string, string> = {
  Sun: 'सूर्य', Moon: 'चंद्र', Mars: 'मंगल', Mercury: 'बुध',
  Jupiter: 'बृहस्पति', Venus: 'शुक्र', Saturn: 'शनि',
};

// Chaldean sequence: Sun→Venus→Mercury→Moon→Saturn→Jupiter→Mars
const CHALDEAN_SEQUENCE = ['Sun', 'Venus', 'Mercury', 'Moon', 'Saturn', 'Jupiter', 'Mars'];

// First hora lord for each weekday (0=Sunday)
const WEEKDAY_HORA_LORDS = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];

// Muhurta activity tables
interface ActivityTable {
  bestNakshatras: number[];
  bestDays: number[];
  avoidNakshatras: number[];
}

const ACTIVITY_TABLES: Record<MuhurtaActivity, ActivityTable> = {
  marriage:   { bestNakshatras: [3, 6, 7, 12, 21], bestDays: [1, 3, 4, 5], avoidNakshatras: [0, 17, 18] },
  business:   { bestNakshatras: [7],               bestDays: [3, 4, 5],    avoidNakshatras: [17] },
  property:   { bestNakshatras: [3, 7, 12],        bestDays: [1, 3, 5],    avoidNakshatras: [18] },
  travel:     { bestNakshatras: [3, 4, 6, 12, 21], bestDays: [1, 3, 4],    avoidNakshatras: [0, 17] },
  surgery:    { bestNakshatras: [0, 2, 11, 12],    bestDays: [2, 6],       avoidNakshatras: [7, 14] },
  naming:     { bestNakshatras: [6, 7, 3, 12],     bestDays: [1, 3, 4],    avoidNakshatras: [17] },
  education:  { bestNakshatras: [4, 7, 12, 21],    bestDays: [3],          avoidNakshatras: [18] },
  job:        { bestNakshatras: [7, 12, 20],        bestDays: [0, 4],       avoidNakshatras: [17] },
};

// ── Helper ───────────────────────────────────────────────────────────────────

/** Format minutes-past-midnight as "h:MM AM/PM" */
export function formatMinutes(minutesPastMidnight: number): string {
  const totalMinutes = Math.round(minutesPastMidnight) % 1440;
  const h24 = Math.floor(totalMinutes / 60) % 24;
  const m = totalMinutes % 60;
  const ampm = h24 >= 12 ? 'PM' : 'AM';
  const h12 = h24 % 12 || 12;
  return `${h12}:${String(m).padStart(2, '0')} ${ampm}`;
}

// ── Functions ────────────────────────────────────────────────────────────────

/** Approximate sunrise/sunset in minutes past midnight for a latitude */
export function getSunriseSunset(jd: number, latDeg: number): SunriseSunset {
  const T = (jd - 2451545.0) / 36525;
  const sunLon = (280.46646 + 36000.76983 * T) * (Math.PI / 180);
  const obliquity = (23.439 - 0.00013 * T) * (Math.PI / 180);
  const declination = Math.asin(Math.sin(obliquity) * Math.sin(sunLon));
  const latRad = latDeg * (Math.PI / 180);
  const cosH = -Math.tan(latRad) * Math.tan(declination);

  let sunriseMin: number;
  let sunsetMin: number;

  if (cosH >= 1) {
    // Polar night
    sunriseMin = 0;
    sunsetMin = 0;
  } else if (cosH <= -1) {
    // Midnight sun
    sunriseMin = 0;
    sunsetMin = 1440;
  } else {
    const H = (Math.acos(cosH) * 180) / Math.PI;
    const halfDayMin = (H / 15) * 60;
    sunriseMin = Math.round(720 - halfDayMin);
    sunsetMin = Math.round(720 + halfDayMin);
  }

  const dayLengthMin = sunsetMin - sunriseMin;

  return {
    sunriseMin,
    sunsetMin,
    sunriseFmt: formatMinutes(sunriseMin),
    sunsetFmt: formatMinutes(sunsetMin),
    dayLengthMin,
  };
}

/** Inauspicious period from slot table */
function getSlotWindow(
  date: Date,
  sunrise: SunriseSunset,
  slots: number[]
): TimeWindow {
  const dayOfWeek = date.getDay();
  const slotNumber = slots[dayOfWeek];
  const slotMin = Math.round(sunrise.dayLengthMin / 8);
  const startMin = sunrise.sunriseMin + (slotNumber - 1) * slotMin;
  const endMin = startMin + slotMin;
  return {
    startMin,
    endMin,
    startFmt: formatMinutes(startMin),
    endFmt: formatMinutes(endMin),
  };
}

/** Rahu Kaal timing */
export function getRahuKaal(date: Date, sunrise: SunriseSunset): TimeWindow {
  return getSlotWindow(date, sunrise, RAHU_KAAL_SLOTS);
}

/** Gulika Kaal timing */
export function getGulikaKaal(date: Date, sunrise: SunriseSunset): TimeWindow {
  return getSlotWindow(date, sunrise, GULIKA_KAAL_SLOTS);
}

/** Yamghant timing */
export function getYamghant(date: Date, sunrise: SunriseSunset): TimeWindow {
  return getSlotWindow(date, sunrise, YAMGHANT_SLOTS);
}

/** Abhijit Muhurta — middle 48 minutes of the day */
export function getAbhijitMuhurta(sunrise: SunriseSunset): TimeWindow {
  const midday = (sunrise.sunriseMin + sunrise.sunsetMin) / 2;
  const startMin = midday - 24;
  const endMin = midday + 24;
  return {
    startMin,
    endMin,
    startFmt: formatMinutes(startMin),
    endFmt: formatMinutes(endMin),
  };
}

/** Full 24-Hora planetary hour schedule */
export function getHoraSchedule(date: Date, sunrise: SunriseSunset): HoraSlot[] {
  const dayOfWeek = date.getDay();
  const firstLord = WEEKDAY_HORA_LORDS[dayOfWeek];
  const startIdx = CHALDEAN_SEQUENCE.indexOf(firstLord);

  const dayHoraMin = sunrise.dayLengthMin / 12;
  const nightHoraMin = (1440 - sunrise.dayLengthMin) / 12;

  const slots: HoraSlot[] = [];

  for (let i = 0; i < 24; i++) {
    const isDaytime = i < 12;
    const lord = CHALDEAN_SEQUENCE[(startIdx + i) % 7];
    const horaMin = isDaytime ? dayHoraMin : nightHoraMin;
    const baseMin = isDaytime
      ? sunrise.sunriseMin + i * dayHoraMin
      : sunrise.sunsetMin + (i - 12) * nightHoraMin;
    const endMin = baseMin + horaMin;

    slots.push({
      slotNumber: i + 1,
      lord,
      lordHindi: HORA_LORD_HINDI[lord],
      startMin: Math.round(baseMin),
      endMin: Math.round(endMin),
      startFmt: formatMinutes(baseMin),
      endFmt: formatMinutes(endMin),
      isDaytime,
    });
  }

  return slots;
}

/** Score a Muhurta for a given activity */
export function scoreMuhurta(
  date: Date,
  tithiIndex: number,
  nakshatraIndex: number,
  activity: MuhurtaActivity
): MuhurtaScore {
  const table = ACTIVITY_TABLES[activity];
  const dayOfWeek = date.getDay();
  let score = 0;
  const reasons: string[] = [];

  // Tithi is not Rikta (indices 3, 7, 13 in 0-based)
  const rikta = [3, 7, 13];
  if (!rikta.includes(tithiIndex)) {
    score += 2;
    reasons.push('Non-Rikta Tithi (+2)');
  } else {
    reasons.push('Rikta Tithi — inauspicious');
  }

  // Best nakshatra
  if (table.bestNakshatras.includes(nakshatraIndex)) {
    score += 3;
    reasons.push('Auspicious Nakshatra (+3)');
  }

  // Best day
  if (table.bestDays.includes(dayOfWeek)) {
    score += 2;
    reasons.push('Favorable weekday (+2)');
  }

  // Not in avoid nakshatras
  if (!table.avoidNakshatras.includes(nakshatraIndex)) {
    score += 2;
    reasons.push('Nakshatra not in avoid list (+2)');
  } else {
    reasons.push('Nakshatra in avoid list');
  }

  // Surgery: not on Amavasya (29) or Purnima (14)
  if (activity === 'surgery' && tithiIndex !== 29 && tithiIndex !== 14) {
    score += 1;
    reasons.push('Not on Purnima/Amavasya (+1)');
  }

  const quality: MuhurtaScore['quality'] =
    score >= 8 ? 'excellent' :
    score >= 6 ? 'good' :
    score >= 4 ? 'acceptable' :
    'avoid';

  return { activity, score, quality, reasons };
}
