/**
 * Panchang Calculation Service
 * Uses astronomical formulas to derive Hindu calendar essentials.
 */

import { astrologyEngine, calcSunLongitude, calcMoonLongitude, toJulianDay, tropicalToVedic } from './astrologyEngine';

export interface PanchangData {
  tithi: string;
  nakshatra: string;
  rahuKaal: {
    start: string;
    end: string;
  };
  yoga: string;
  karana: string;
  sunrise: string;
  sunset: string;
  muhurat: Array<{
    activity: string;
    time: string;
  }>;
}

// 30 tithis
const TITHI_NAMES = [
  'Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami',
  'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami',
  'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Purnima',
  'Pratipada (K)', 'Dwitiya (K)', 'Tritiya (K)', 'Chaturthi (K)', 'Panchami (K)',
  'Shashthi (K)', 'Saptami (K)', 'Ashtami (K)', 'Navami (K)', 'Dashami (K)',
  'Ekadashi (K)', 'Dwadashi (K)', 'Trayodashi (K)', 'Chaturdashi (K)', 'Amavasya',
];

// 27 yogas (sun + moon longitude / 13.333°)
const YOGA_NAMES = [
  'Vishkambha', 'Priti', 'Ayushman', 'Saubhagya', 'Shobhana', 'Atiganda',
  'Sukarman', 'Dhriti', 'Shula', 'Ganda', 'Vriddhi', 'Dhruva',
  'Vyaghata', 'Harshana', 'Vajra', 'Siddhi', 'Vyatipata', 'Variyan',
  'Parigha', 'Shiva', 'Siddha', 'Sadhya', 'Shubha', 'Shukla',
  'Brahma', 'Indra', 'Vaidhriti',
];

// 11 karanas
const KARANA_NAMES = [
  'Bava', 'Balava', 'Kaulava', 'Taitula', 'Garaja',
  'Vanija', 'Vishti', 'Shakuni', 'Chatushpada', 'Naga', 'Kimstughna',
];

// Rahu Kaal slot (1–8) by day of week (0=Sun)
// Each slot is 1/8th of the day's length, not a fixed 1.5h period
const RAHU_KAAL_SLOTS = [8, 2, 7, 5, 6, 4, 3];

/** Format minutes-past-midnight as h:MM AM/PM */
const fmtTime = (minutesPastMidnight: number): string => {
  const totalMinutes = Math.round(minutesPastMidnight) % 1440;
  const h24 = Math.floor(totalMinutes / 60) % 24;
  const m = totalMinutes % 60;
  const ampm = h24 >= 12 ? 'PM' : 'AM';
  const h12 = h24 % 12 || 12;
  return `${h12}:${String(m).padStart(2, '0')} ${ampm}`;
};

/** Approximate sunrise/sunset in minutes-past-midnight for a latitude */
const calcSunriseSunset = (
  jd: number,
  latitude: number
): { sunriseMin: number; sunsetMin: number } => {
  // Hour angle at sunrise: cos(H) = -tan(lat) * tan(declination)
  const T = (jd - 2451545.0) / 36525;
  const sunLon = (280.46646 + 36000.76983 * T) * (Math.PI / 180);
  const obliquity = (23.439 - 0.00013 * T) * (Math.PI / 180);
  const declination = Math.asin(Math.sin(obliquity) * Math.sin(sunLon));
  const latRad = latitude * (Math.PI / 180);
  const cosH = -Math.tan(latRad) * Math.tan(declination);

  if (cosH >= 1) return { sunriseMin: 0, sunsetMin: 0 }; // polar night
  if (cosH <= -1) return { sunriseMin: 0, sunsetMin: 1440 }; // midnight sun

  const H = (Math.acos(cosH) * 180) / Math.PI; // degrees
  const transitMin = 720; // noon
  const halfDayMin = (H / 15) * 60; // convert degrees to minutes
  return {
    sunriseMin: Math.round(transitMin - halfDayMin),
    sunsetMin: Math.round(transitMin + halfDayMin),
  };
};

export const panchangService = {
  /**
   * Calculate Panchang for a given date and location.
   */
  calculatePanchang(date: Date, latitude: number, longitude: number): PanchangData {
    const jd = toJulianDay(date);
    const sunTrop = calcSunLongitude(jd);
    const moonTrop = calcMoonLongitude(jd);
    const sunVedic = tropicalToVedic(sunTrop, jd);
    const moonVedic = tropicalToVedic(moonTrop, jd);

    // Tithi: based on moon-sun angular separation (each 12° = 1 tithi)
    let moonSunDiff = moonVedic - sunVedic;
    if (moonSunDiff < 0) moonSunDiff += 360;
    const tithiIndex = Math.floor(moonSunDiff / 12) % 30;
    const tithi = TITHI_NAMES[tithiIndex];

    // Nakshatra: from moon longitude
    const nakshatra = astrologyEngine.getNakshatra(moonVedic);

    // Yoga: (sun + moon longitude) / 13.333°
    const yogaIndex = Math.floor(((sunVedic + moonVedic) % 360) / (360 / 27)) % 27;
    const yoga = YOGA_NAMES[yogaIndex];

    // Karana: half-tithi (each tithi has 2 karanas)
    const karanaIndex = Math.floor(moonSunDiff / 6) % 11;
    const karana = KARANA_NAMES[karanaIndex];

    // Sunrise / Sunset
    const { sunriseMin, sunsetMin } = calcSunriseSunset(jd, latitude);
    const sunrise = fmtTime(sunriseMin);
    const sunset = fmtTime(sunsetMin);

    // Rahu Kaal
    const dayOfWeek = date.getDay();
    const slotNumber = RAHU_KAAL_SLOTS[dayOfWeek]; // 1–8
    const dayLengthMin = sunsetMin - sunriseMin;
    const slotMin = Math.round(dayLengthMin / 8);
    const rahuStart = sunriseMin + (slotNumber - 1) * slotMin;
    const rahuEnd = rahuStart + slotMin;

    // Auspicious muhurats (morning and afternoon windows)
    const muhurat = [
      {
        activity: 'New Ventures',
        time: `${fmtTime(sunriseMin + 48)} – ${fmtTime(sunriseMin + 96)}`,
      },
      {
        activity: 'Travel',
        time: `${fmtTime(sunriseMin + slotMin)} – ${fmtTime(sunriseMin + slotMin * 2)}`,
      },
    ];

    return {
      tithi,
      nakshatra,
      rahuKaal: {
        start: fmtTime(rahuStart),
        end: fmtTime(rahuEnd),
      },
      yoga,
      karana,
      sunrise,
      sunset,
      muhurat,
    };
  },
};
