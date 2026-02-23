const Astronomy = require('astronomy-engine');

// Correct Date for AstroSage chart: March 1, 2008 around 14:00 UTC
const date = new Date('2008-03-01T14:30:00Z');

// We use J2000 ecliptic as a base, then apply Lahiri ayanamsa.
// Actually astronomy-engine's `Ecliptic` func returns J2000 ecliptic (elon, elat).
const bodies = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];

console.log('--- True Geocentric Ecliptic Longitudes (J2000) ---');
for (const b of bodies) {
    const body = Astronomy.Body[b];
    const geo = Astronomy.GeoVector(body, date, true); // true, geocentric, J2000
    const ecl = Astronomy.Ecliptic(geo);
    console.log(`${b.padEnd(10)}: J2000 elon = ${(ecl.elon).toFixed(2)}`);
}

// Rahu / Ketu in astronomy-engine? It doesn't have an explicit body for nodes.
// We can use the mean nodes formula we already have, or find a better one.
