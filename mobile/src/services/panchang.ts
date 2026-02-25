/**
 * Panchang Calculation Service
 * Uses astronomical formulas to derive Hindu calendar essentials.
 */

import { astrologyEngine, calcSunLongitude, calcMoonLongitude, toJulianDay, tropicalToVedic } from './astrologyEngine';
import { TITHIS, PANCHANG_YOGAS, KARANAS } from '../data';
import { SearchRiseSet, Observer, MakeTime, Body } from 'astronomy-engine';

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

/** Accurate sunrise/sunset in minutes-past-midnight for a latitude/longitude */
const calcSunriseSunset = (
  date: Date,
  latitude: number,
  longitude: number
): { sunriseMin: number; sunsetMin: number } => {
  const observer = new Observer(latitude, longitude, 0);
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const astroStart = MakeTime(startOfDay);
  const sunriseEvent = SearchRiseSet(Body.Sun, observer, +1, astroStart, 1);
  const sunsetEvent = SearchRiseSet(Body.Sun, observer, -1, astroStart, 1);

  if (!sunriseEvent || !sunsetEvent) {
    // Polar regions
    return { sunriseMin: 0, sunsetMin: 1440 }; // Approximate fallback
  }

  const srDate = sunriseEvent.date;
  const ssDate = sunsetEvent.date;

  const sunriseMin = srDate.getHours() * 60 + srDate.getMinutes();
  const sunsetMin = ssDate.getHours() * 60 + ssDate.getMinutes();

  return {
    sunriseMin,
    sunsetMin,
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
    const tithi = TITHIS[tithiIndex]?.name || 'Unknown';

    // Nakshatra: from moon longitude
    const nakshatra = astrologyEngine.getNakshatra(moonVedic);

    // Yoga: (sun + moon longitude) / 13.333°
    const yogaIndex = Math.floor(((sunVedic + moonVedic) % 360) / (360 / 27)) % 27;
    const yoga = PANCHANG_YOGAS[yogaIndex]?.name || 'Unknown';

    // Karana: half-tithi (each tithi has 2 karanas)
    const karanaIndex = Math.floor(moonSunDiff / 6) % 11;
    const karana = KARANAS[karanaIndex]?.name || 'Unknown';

    // Sunrise / Sunset
    const { sunriseMin, sunsetMin } = calcSunriseSunset(date, latitude, longitude);
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
