/**
 * Ephemeris Core — High-precision astronomical primitives for Vedic astrology.
 * Uses the 'astronomy-engine' library for true geocentric ecliptic longitudes.
 */
import * as Astronomy from 'astronomy-engine';

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

/** Convert a calendar Date to Julian Day Number (as expected by other engine modules) */
export function toJulianDay(date: Date): number {
  // astronomy-engine uses days since J2000 epoch (2451545.0)
  return Astronomy.MakeTime(date).ut + 2451545.0;
}

/** Lahiri (Chitrapaksha) ayanamsa for a given Julian Day */
export function getLahiriAyanamsa(jd: number): number {
  // Lahiri value is roughly 23.85° in year 2000, changing ~0.0139° per year.
  // Formula: 23.85045 + 0.013956 * (Julian centuries from J2000)
  const T = (jd - 2451545.0) / 36525;
  return 23.85045 + 1.3956 * T; // Fixed century multiplier (0.013956 * 100)
}

/** Convert tropical longitude to sidereal (Lahiri) */
export function siderealLongitude(tropicalLon: number, jd: number): number {
  return norm(tropicalLon - getLahiriAyanamsa(jd));
}

// ── High Precision Longitudes ───────────────────────────────────────────────

const BODY_MAP: Record<string, Astronomy.Body> = {
  sun: Astronomy.Body.Sun,
  moon: Astronomy.Body.Moon,
  mars: Astronomy.Body.Mars,
  mercury: Astronomy.Body.Mercury,
  jupiter: Astronomy.Body.Jupiter,
  venus: Astronomy.Body.Venus,
  saturn: Astronomy.Body.Saturn,
};

/** Get true geocentric tropical ecliptic longitude for a body */
export function getBodyLongitude(body: Astronomy.Body, date: Date): number {
  // GeoVector returns J2000 geocentric equatorial vector
  const geo = Astronomy.GeoVector(body, date, true);
  // Ecliptic converts J2000 equatorial to J2000 ecliptic coordinates
  const ecl = Astronomy.Ecliptic(geo);
  return norm(ecl.elon);
}

// ── Nodes (Rahu/Ketu) ───────────────────────────────────────────────────────

/** 
 * Mean North Node (Rahu) longitude using standard simplified formula.
 * astronomy-engine doesn't provide nodes directly as bodies.
 */
export function getRahuLongitude(jd: number): number {
  const T = (jd - 2451545.0) / 36525;
  return norm(125.04452 - 1934.136261 * T + 0.0020708 * T * T);
}

/** Mean South Node (Ketu) longitude = Rahu + 180° */
export function getKetuLongitude(jd: number): number {
  return norm(getRahuLongitude(jd) + 180);
}

// ── Retrograde Detection ────────────────────────────────────────────────────

function checkRetrograde(body: Astronomy.Body, date: Date): boolean {
  if (body === Astronomy.Body.Sun || body === Astronomy.Body.Moon) return false;

  const d1 = new Date(date.getTime() - 3600000); // 1 hour ago
  const d2 = new Date(date.getTime() + 3600000); // 1 hour later

  const lon1 = getBodyLongitude(body, d1);
  const lon2 = getBodyLongitude(body, d2);

  let diff = lon2 - lon1;
  if (diff > 180) diff -= 360;
  if (diff < -180) diff += 360;

  return diff < 0;
}

// ── Multi-Graha Retrieval ────────────────────────────────────────────────────

/** Get all 9 graha positions (tropical + sidereal) */
export function getAllGrahaPositions(jd: number): GrahaPosition[] {
  // Convert JD back to Date for astronomy-engine
  // JD 0 is -4712 Jan 1 12:00:00 UTC
  const date = new Date((jd - 2440587.5) * 86400000);

  const result: GrahaPosition[] = [];

  // 1. Major planets
  for (const [name, body] of Object.entries(BODY_MAP)) {
    const tropicalLon = getBodyLongitude(body, date);
    const siderealLon = siderealLongitude(tropicalLon, jd);
    const isRetro = checkRetrograde(body, date);

    result.push({
      graha: name,
      tropicalLon,
      siderealLon,
      isRetrograde: isRetro,
    });
  }

  // 2. Rahu
  const rahuTropical = getRahuLongitude(jd);
  result.push({
    graha: 'rahu',
    tropicalLon: rahuTropical,
    siderealLon: siderealLongitude(rahuTropical, jd),
    isRetrograde: true, // Rahu/Ketu are always retrograde in mean motion
  });

  // 3. Ketu
  const ketuTropical = getKetuLongitude(jd);
  result.push({
    graha: 'ketu',
    tropicalLon: ketuTropical,
    siderealLon: siderealLongitude(ketuTropical, jd),
    isRetrograde: true,
  });

  return result;
}

// ── Legacy Compatibility Wrappers ──────────────────────────────────────────

export function getSunLongitude(jd: number): number {
  return getBodyLongitude(Astronomy.Body.Sun, new Date((jd - 2440587.5) * 86400000));
}

export function getMoonLongitude(jd: number): number {
  return getBodyLongitude(Astronomy.Body.Moon, new Date((jd - 2440587.5) * 86400000));
}
