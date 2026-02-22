/**
 * Ephemeris Core — Astronomical primitives for Vedic astrology
 * Uses simplified Meeus "Astronomical Algorithms" formulas.
 * Pure math — no React Native / Expo imports.
 */

// ── Types ────────────────────────────────────────────────────────────────────

export interface GrahaPosition {
  graha: string;
  tropicalLon: number;
  siderealLon: number;
  isRetrograde: boolean;
}

// ── Primitives ───────────────────────────────────────────────────────────────

/** Normalise angle to [0, 360) */
export function norm(angle: number): number {
  angle = angle % 360;
  return angle < 0 ? angle + 360 : angle;
}

/** Convert a calendar Date (UTC) to Julian Day Number (Meeus Ch. 7) */
export function toJulianDay(date: Date): number {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;
  const day =
    date.getUTCDate() +
    date.getUTCHours() / 24 +
    date.getUTCMinutes() / 1440;

  let Y = year;
  let M = month;
  if (M <= 2) {
    Y -= 1;
    M += 12;
  }
  const A = Math.floor(Y / 100);
  const B = 2 - A + Math.floor(A / 4);
  return (
    Math.floor(365.25 * (Y + 4716)) +
    Math.floor(30.6001 * (M + 1)) +
    day +
    B -
    1524.5
  );
}

/** Lahiri (Chitrapaksha) ayanamsa for a given Julian Day */
export function getLahiriAyanamsa(jd: number): number {
  const T = (jd - 2451545.0) / 36525; // Julian centuries from J2000.0
  return 23.85045 + 0.013956 * T * 100; // 0.013956°/year × 100 years/century
}

// ── Individual graha longitudes (tropical) ───────────────────────────────────

/** Approximate tropical Sun longitude (Meeus) */
export function getSunLongitude(jd: number): number {
  const T = (jd - 2451545.0) / 36525;
  const L0 = 280.46646 + 36000.76983 * T;
  const M = (357.52911 + 35999.05029 * T) * (Math.PI / 180);
  const C =
    (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(M) +
    (0.019993 - 0.000101 * T) * Math.sin(2 * M) +
    0.000289 * Math.sin(3 * M);
  return norm(L0 + C);
}

/** Approximate tropical Moon longitude (Meeus simplified) */
export function getMoonLongitude(jd: number): number {
  const T = (jd - 2451545.0) / 36525;
  const L = 218.3165 + 481267.8813 * T;
  const M = (357.5291 + 35999.0503 * T) * (Math.PI / 180);
  const Mp = (134.9634 + 477198.8676 * T) * (Math.PI / 180);
  const D = (297.8502 + 445267.1115 * T) * (Math.PI / 180);
  const F = (93.2721 + 483202.0175 * T) * (Math.PI / 180);
  const dL =
    6.289 * Math.sin(Mp) -
    1.274 * Math.sin(2 * D - Mp) +
    0.658 * Math.sin(2 * D) -
    0.186 * Math.sin(M) -
    0.114 * Math.sin(2 * F);
  return norm(L + dL);
}

/** Mars mean longitude (Meeus low-precision) */
export function getMarsLongitude(jd: number): number {
  const T = (jd - 2451545.0) / 36525;
  return norm(355.433 + 19140.299 * T);
}

/** Mercury mean longitude (Meeus low-precision) */
export function getMercuryLongitude(jd: number): number {
  const T = (jd - 2451545.0) / 36525;
  return norm(252.251 + 149472.675 * T);
}

/** Jupiter mean longitude (Meeus low-precision) */
export function getJupiterLongitude(jd: number): number {
  const T = (jd - 2451545.0) / 36525;
  return norm(34.351 + 3034.906 * T);
}

/** Venus mean longitude (Meeus low-precision) */
export function getVenusLongitude(jd: number): number {
  const T = (jd - 2451545.0) / 36525;
  return norm(181.979 + 58517.816 * T);
}

/** Saturn mean longitude (Meeus low-precision) */
export function getSaturnLongitude(jd: number): number {
  const T = (jd - 2451545.0) / 36525;
  return norm(50.077 + 1222.114 * T);
}

/** Mean North Node (Rahu) longitude */
export function getRahuLongitude(jd: number): number {
  const T = (jd - 2451545.0) / 36525;
  return norm(125.0445 - 1934.1362 * T);
}

/** Mean South Node (Ketu) longitude = Rahu + 180° */
export function getKetuLongitude(jd: number): number {
  return norm(getRahuLongitude(jd) + 180);
}

// ── Convenience ──────────────────────────────────────────────────────────────

/** Convert tropical longitude to sidereal (Lahiri) */
export function siderealLongitude(tropicalLon: number, jd: number): number {
  return norm(tropicalLon - getLahiriAyanamsa(jd));
}

/** Check if a graha is retrograde based on daily motion */
function isRetrograde(
  getLon: (jd: number) => number,
  jd: number
): boolean {
  const lon1 = getLon(jd - 0.5);
  const lon2 = getLon(jd + 0.5);
  let diff = lon2 - lon1;
  if (diff > 180) diff -= 360;
  if (diff < -180) diff += 360;
  return diff < 0;
}

/** Get all 9 graha positions (tropical + sidereal) */
export function getAllGrahaPositions(jd: number): GrahaPosition[] {
  const grahas: Array<{
    name: string;
    getLon: (jd: number) => number;
    alwaysRetrograde?: boolean;
    neverRetrograde?: boolean;
  }> = [
    { name: 'sun', getLon: getSunLongitude, neverRetrograde: true },
    { name: 'moon', getLon: getMoonLongitude, neverRetrograde: true },
    { name: 'mars', getLon: getMarsLongitude },
    { name: 'mercury', getLon: getMercuryLongitude },
    { name: 'jupiter', getLon: getJupiterLongitude },
    { name: 'venus', getLon: getVenusLongitude },
    { name: 'saturn', getLon: getSaturnLongitude },
    { name: 'rahu', getLon: getRahuLongitude, alwaysRetrograde: true },
    { name: 'ketu', getLon: getKetuLongitude, alwaysRetrograde: true },
  ];

  return grahas.map(({ name, getLon, alwaysRetrograde: alwaysRetro, neverRetrograde: neverRetro }) => {
    const tropicalLon = getLon(jd);
    const siderealLon = siderealLongitude(tropicalLon, jd);
    let retro = false;
    if (alwaysRetro) retro = true;
    else if (neverRetro) retro = false;
    else retro = isRetrograde(getLon, jd);
    return { graha: name, tropicalLon, siderealLon, isRetrograde: retro };
  });
}
