/**
 * ContentService — The single content assembly engine
 * Screens import only from '../data' and never compute display text themselves.
 *
 * Flow: UserProfile → astrologyEngine → ContentService → PersonalizedContent → Screen
 */

import { astrologyEngine } from '../services/astrologyEngine';
import type { UserProfile } from '../types';
import type {
    PersonalizedKundliContent,
    PersonalizedMilanContent,
    PersonalizedDashaContent,
    PersonalizedGocharContent,
    PersonalizedVarshaphalContent,
    PersonalizedVargaContent,
    PersonalizedPanchangContent,
    PersonalizedMuhurtaContent,
    PersonalizedTithiContent,
    PersonalizedNakshatraContent,
    PersonalizedGrahanContent,
    PersonalizedAshtakavargaContent,
    PersonalizedPrashnaContent,
    PersonalizedHoraContent,
    PersonalizedRemedyContent,
    PersonalizedRashifalContent,
    PersonalizedRemedyCard,
} from './types';

import { getGrahaContent, GRAHAS } from './grahas';
import { getRashiByIndex } from './rashi';
import { getNakshatraByIndex } from './nakshatras';
import { getYogaContent } from './yogas';
import { getDashaContent as getDashaDataContent } from './dashas';
import { getRemedyContent } from './remedies';
import { getAshtakootVerdict, ASHTAKOOT_KOOTS } from './ashtakoot';
import { getTithiContent, getPanchangYogaContent, getKaranaContent } from './panchang';
import { getMuhurtaActivityContent } from './muhurta';
import { getRashifalEntry, getDashaModifier, getGocharModifier } from './rashifal';

// ── Helpers ──────────────────────────────────────────────────────────────────

const RASHI_NAMES = [
    'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
    'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
];

const RASHI_KEYS = [
    'aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo',
    'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces',
];

function rashiIndexToKey(index: number): string {
    return RASHI_KEYS[index % 12];
}

function formatDate(date: Date): string {
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function yearsRemaining(endDate: Date): string {
    const now = new Date();
    const diffMs = endDate.getTime() - now.getTime();
    if (diffMs <= 0) return 'completed';
    const years = Math.floor(diffMs / (365.25 * 24 * 60 * 60 * 1000));
    const months = Math.floor((diffMs % (365.25 * 24 * 60 * 60 * 1000)) / (30.44 * 24 * 60 * 60 * 1000));
    if (years > 0) return `${years}y ${months}m remaining`;
    return `${months}m remaining`;
}

function buildRemedyCards(grahaKeys: string[]): PersonalizedRemedyCard[] {
    return grahaKeys.map((key) => {
        const remedy = getRemedyContent(key);
        const graha = getGrahaContent(key);
        return {
            graha: graha?.name ?? key,
            gemstone: remedy?.gemstone ?? '',
            mantra: remedy?.mantraTransliteration ?? '',
            charity: remedy?.charity ?? '',
            day: remedy?.fastingDay ?? '',
        };
    }).filter((r) => r.gemstone);
}

// ── ContentService ───────────────────────────────────────────────────────────

export const ContentService = {

    /** Tool 01 — Janma Kundli */
    getKundliContent(profile: UserProfile): PersonalizedKundliContent {
        const chart = astrologyEngine.calculateKundli(profile);
        const dasha = astrologyEngine.calculateDasha(profile);
        const afflicted = astrologyEngine.getAfflictedGrahas(profile);

        const lagnaRashi = getRashiByIndex(chart.lagnaSignIndex);
        const moonRashi = getRashiByIndex(RASHI_NAMES.indexOf(chart.moonSign));
        const nak = getNakshatraByIndex(chart.nakshatraIndex);
        const currentDashaData = getDashaDataContent(dasha.currentMahadasha.lord.toLowerCase());

        return {
            greeting: `Your Janma Kundli reveals the cosmic blueprint of your life.`,
            lagnaCard: {
                title: `${lagnaRashi?.nameHindi ?? ''} लग्न (${chart.lagnaSign} Ascendant)`,
                description: lagnaRashi?.lagnaInterpretation.standard ?? '',
                bodyPart: lagnaRashi?.bodyPart ?? '',
            },
            rashiCard: {
                title: `${moonRashi?.nameHindi ?? ''} राशि (${chart.moonSign})`,
                description: moonRashi?.rashiInterpretation.standard ?? '',
            },
            nakshatraCard: {
                title: `${nak?.nameHindi ?? ''} (${chart.nakshatra})`,
                rulerName: getGrahaContent(nak?.ruler ?? '')?.name ?? '',
                symbol: nak?.symbol ?? '',
                description: nak?.moonInterpretation.standard ?? '',
                dashaStart: `${dasha.currentMahadasha.lord} Mahadasha`,
            },
            dashaCard: {
                lord: dasha.currentMahadasha.lord,
                antardasha: dasha.currentAntardasha.antarLord,
                endYear: dasha.currentMahadasha.endDate.getFullYear(),
                remaining: yearsRemaining(dasha.currentMahadasha.endDate),
                prediction: currentDashaData?.divination.standard ?? '',
                spiritualPractice: currentDashaData?.spiritualPractice ?? '',
            },
            yogaCards: [], // Populated by yoga detection in engine
            planetCards: chart.planets.map((p) => {
                const grahaData = getGrahaContent(p.planet.toLowerCase());
                return {
                    planet: p.planet,
                    sign: p.sign,
                    house: p.house,
                    dignity: '',
                    brief: grahaData?.interpretation.brief ?? '',
                    remedy: afflicted.find((a) => a.graha.toLowerCase() === p.planet.toLowerCase())
                        ? getRemedyContent(p.planet.toLowerCase())?.charity
                        : undefined,
                };
            }),
            remedyCards: buildRemedyCards(afflicted.map((a) => a.graha.toLowerCase())),
        };
    },

    /** Tool 02 — Kundli Milan */
    getMilanContent(profileA: UserProfile, profileB: UserProfile): PersonalizedMilanContent {
        const result = astrologyEngine.calculateKundliMilan(profileA, profileB);
        const verdict = getAshtakootVerdict(result.totalScore);

        return {
            totalScore: result.totalScore,
            maxScore: 36,
            verdict: verdict.verdict,
            verdictHindi: verdict.verdictHindi,
            verdictDescription: verdict.description,
            kootCards: result.koots.map((k) => {
                const kootData = ASHTAKOOT_KOOTS.find((ak) => ak.key === k.koot.toLowerCase().replace(/\s+/g, '_'));
                return {
                    name: k.koot,
                    nameHindi: kootData?.nameHindi ?? k.kootHindi,
                    obtained: k.scored,
                    max: k.max,
                    description: kootData?.description ?? '',
                };
            }),
            mangalDosha: {
                personA: result.mangalDoshaA.hasDosha,
                personB: result.mangalDoshaB.hasDosha,
                description: result.mangalDoshaA.hasDosha || result.mangalDoshaB.hasDosha
                    ? 'Mangal Dosha is present. Matching with another Manglik or applying remedies is recommended.'
                    : 'No Mangal Dosha detected in either chart.',
            },
        };
    },

    /** Tool 03 — Vimshottari Dasha */
    getDashaContent(profile: UserProfile): PersonalizedDashaContent {
        const timeline = astrologyEngine.calculateDasha(profile);
        const currentData = getDashaDataContent(timeline.currentMahadasha.lord.toLowerCase());
        const antarData = getDashaDataContent(timeline.currentAntardasha.antarLord.toLowerCase());

        return {
            currentMaha: {
                lord: timeline.currentMahadasha.lord,
                lordHindi: timeline.currentMahadasha.lordHindi,
                theme: currentData?.periodTheme ?? '',
                prediction: currentData?.divination.deep ?? '',
                spiritualPractice: currentData?.spiritualPractice ?? '',
                endDate: formatDate(timeline.currentMahadasha.endDate),
                remaining: yearsRemaining(timeline.currentMahadasha.endDate),
            },
            currentAntar: {
                lord: timeline.currentAntardasha.antarLord,
                lordHindi: timeline.currentAntardasha.antarLordHindi,
                prediction: antarData?.divination.standard ?? '',
                endDate: formatDate(timeline.currentAntardasha.endDate),
            },
            upcomingPeriods: timeline.sequence
                .filter((s) => !s.isCurrent && s.endDate > new Date())
                .slice(0, 4)
                .map((s) => {
                    const data = getDashaDataContent(s.lord.toLowerCase());
                    return {
                        lord: s.lord,
                        lordHindi: s.lordHindi,
                        theme: data?.periodTheme ?? '',
                        startYear: s.startDate.getFullYear(),
                        endYear: s.endDate.getFullYear(),
                    };
                }),
        };
    },

    /** Tool 04 — Gochar (Transits) */
    getGocharContent(profile: UserProfile, date?: Date): PersonalizedGocharContent {
        const gochar = astrologyEngine.calculateGochar(profile, date);
        const saturnRemedy = getRemedyContent('saturn');

        return {
            sadeSatiCard: {
                isActive: gochar.sadeSatiStatus.isActive,
                phase: gochar.sadeSatiStatus.phase,
                description: gochar.sadeSatiStatus.isActive
                    ? `Sade Sati is active in the ${gochar.sadeSatiStatus.phase} phase. Saturn is in ${gochar.sadeSatiStatus.saturnSign} while your natal Moon is in ${gochar.sadeSatiStatus.natalMoonSign}.`
                    : 'Sade Sati is not active. Enjoy this period of relative ease from Saturn\'s testing energy.',
                remedy: gochar.sadeSatiStatus.isActive
                    ? saturnRemedy?.charity ?? 'Donate black sesame seeds on Saturdays.'
                    : '',
            },
            transitCards: gochar.transitPositions.map((t) => {
                const grahaData = getGrahaContent(t.graha);
                const signIndex = Math.floor(t.siderealLon / 30);
                return {
                    graha: grahaData?.name ?? t.graha,
                    currentSign: RASHI_NAMES[signIndex] ?? '',
                    natalHouse: 0, // Would need natal chart comparison
                    interpretation: grahaData?.interpretation.brief ?? '',
                };
            }),
        };
    },

    /** Tool 05 — Varshaphal */
    getVarshaphalContent(profile: UserProfile, year?: number): PersonalizedVarshaphalContent {
        const chart = astrologyEngine.calculateVarshaphal(profile, year);
        const lagnaRashi = getRashiByIndex(chart.varshaLagnaIndex);

        return {
            year: year ?? new Date().getFullYear(),
            varshaLagna: chart.varshaLagna,
            muntha: {
                sign: chart.muntha,
                house: chart.munthaHouse,
                interpretation: `Muntha in the ${chart.munthaHouse}${getOrdinalSuffix(chart.munthaHouse)} house in ${chart.muntha} indicates the year\'s focal area of growth and challenge.`,
            },
            planetCards: chart.planets.map((p) => {
                const grahaData = getGrahaContent(p.graha);
                const signIndex = Math.floor(p.siderealLon / 30);
                return {
                    planet: grahaData?.name ?? p.graha,
                    sign: RASHI_NAMES[signIndex] ?? '',
                    house: 0,
                    dignity: '',
                    brief: grahaData?.interpretation.brief ?? '',
                };
            }),
            yearTheme: lagnaRashi
                ? `With ${lagnaRashi.name} as the Varsha Lagna, this year emphasises ${lagnaRashi.element} element qualities — ${lagnaRashi.rashiInterpretation.brief}`
                : '',
        };
    },

    /** Tool 06 — Varga Charts */
    getVargaContent(profile: UserProfile, chartType: 'D9' | 'D10' | 'D12'): PersonalizedVargaContent {
        const divisorMap: Record<string, 3 | 7 | 9 | 10 | 12> = { D9: 9, D10: 10, D12: 12 };
        const nameMap: Record<string, [string, string, string]> = {
            D9: ['Navamsa', 'नवांश', 'Marriage, dharma, and the soul\'s deeper purpose'],
            D10: ['Dashamsha', 'दशांश', 'Career, profession, and public reputation'],
            D12: ['Dwadashamsha', 'द्वादशांश', 'Parents, ancestry, and past-life karma'],
        };

        const chart = astrologyEngine.calculateVargaChart(profile, divisorMap[chartType]);
        const [name, nameHindi, purpose] = nameMap[chartType];

        return {
            chartType: name,
            chartTypeHindi: nameHindi,
            purpose,
            planetCards: chart.planets.map((p) => {
                const grahaData = getGrahaContent(p.graha);
                return {
                    planet: grahaData?.name ?? p.graha,
                    sign: RASHI_NAMES[p.vargaSignIndex] ?? '',
                    house: 0,
                    dignity: p.isVargottama ? 'Vargottama' : '',
                    brief: p.isVargottama
                        ? `${grahaData?.name ?? p.graha} is Vargottama — occupying the same sign in both the birth chart and ${name}. This strengthens its results significantly.`
                        : grahaData?.interpretation.brief ?? '',
                };
            }),
            highlights: chart.planets
                .filter((p) => p.isVargottama)
                .map((p) => `${getGrahaContent(p.graha)?.name ?? p.graha} is Vargottama in ${name}`),
        };
    },

    /** Tool 07 — Panchang Vishesh */
    getPanchangContent(tithiIndex: number, yogaIndex: number, karanaIndex: number, sunrise?: string, sunset?: string): PersonalizedPanchangContent {
        const tithi = getTithiContent(tithiIndex);
        const yoga = getPanchangYogaContent(yogaIndex);
        const karana = getKaranaContent(karanaIndex);

        return {
            tithiCard: {
                name: tithi?.name ?? '',
                nameHindi: tithi?.nameHindi ?? '',
                nature: tithi?.nature ?? 'mixed',
                description: tithi?.auspiciousness ?? '',
            },
            yogaCard: {
                name: yoga?.name ?? '',
                nameHindi: yoga?.nameHindi ?? '',
                nature: yoga?.nature ?? 'mixed',
                description: yoga?.description ?? '',
            },
            karanaCard: {
                name: karana?.name ?? '',
                nameHindi: karana?.nameHindi ?? '',
                nature: karana?.nature ?? 'mixed',
                description: karana?.description ?? '',
            },
            sunriseSunset: { sunrise: sunrise ?? '', sunset: sunset ?? '' },
            rahuKaal: '',
            gulikaKaal: '',
            abhijitMuhurta: '',
        };
    },

    /** Tool 08 — Muhurta */
    getMuhurtaContent(activityKey: string): PersonalizedMuhurtaContent {
        const activity = getMuhurtaActivityContent(activityKey);

        return {
            activity: activity?.name ?? activityKey,
            windows: [], // Populated by the engine\'s muhurta scoring
        };
    },

    /** Tool 09 — Tithi & Chandra */
    getTithiContent(tithiIndex: number, moonPhase: string, moonSign: string): PersonalizedTithiContent {
        const tithi = getTithiContent(tithiIndex);

        return {
            currentTithi: {
                name: tithi?.name ?? '',
                nameHindi: tithi?.nameHindi ?? '',
                number: tithiIndex,
                nature: tithi?.nature ?? 'mixed',
                description: tithi?.auspiciousness ?? '',
                favoredActivities: tithi?.favoredActivities ?? [],
                avoidedActivities: tithi?.avoidedActivities ?? [],
            },
            moonPhase,
            moonSign,
            nextFullMoon: '',
            nextNewMoon: '',
        };
    },

    /** Tool 10 — Nakshatra Vishesh */
    getNakshatraContent(profile: UserProfile): PersonalizedNakshatraContent {
        const moonNak = astrologyEngine.getMoonNakshatra(profile);
        const nakData = getNakshatraByIndex(moonNak.nakshatraIndex);
        const currentPositions = astrologyEngine.getCurrentPositions();
        const currentMoonLon = currentPositions.find((p) => p.graha === 'moon')?.siderealLon ?? 0;
        const currentMoonNakIndex = Math.floor(currentMoonLon / (360 / 27));
        const currentMoonNak = getNakshatraByIndex(currentMoonNakIndex);

        return {
            birthNakshatra: {
                name: nakData?.name ?? moonNak.nakshatraKey,
                nameHindi: nakData?.nameHindi ?? '',
                ruler: getGrahaContent(nakData?.ruler ?? '')?.name ?? '',
                deity: nakData?.deity ?? '',
                symbol: nakData?.symbol ?? '',
                pada: moonNak.pada,
                interpretation: nakData?.moonInterpretation.deep ?? '',
            },
            compatibility: nakData?.compatibility ?? '',
            currentMoonNakshatra: currentMoonNak?.name ?? '',
            currentMoonNakshatraMeaning: currentMoonNak?.moonInterpretation.brief ?? '',
        };
    },

    /** Tool 11 — Grahan (Eclipses) */
    getGrahanContent(year: number, profile?: UserProfile): PersonalizedGrahanContent {
        const eclipses = astrologyEngine.getEclipses(year);

        return {
            eclipses: eclipses.map((e) => ({
                type: e.type.replace(/_/g, ' '),
                date: formatDate(e.date),
                rashi: e.rashi,
                nakshatra: e.nakshatra,
                visibleFromIndia: e.visibleFromIndia,
                significance: `This ${e.type.replace(/_/g, ' ')} in ${e.rashi} (${e.nakshatra}) ${e.visibleFromIndia ? 'is visible from India and carries stronger karmic significance' : 'is not visible from India but still affects the collective consciousness'}.`,
            })),
            personalImpact: profile
                ? eclipses.flatMap((e) => {
                    const impacts = astrologyEngine.getEclipsePersonalImpact(e.siderealDeg, profile);
                    return impacts.map((imp) => ({
                        eclipseDate: formatDate(e.date),
                        affectedGraha: imp.natalGraha,
                        orb: imp.orb,
                        interpretation: `The eclipse at ${Math.round(e.siderealDeg)}° affects your natal ${imp.natalGraha} (orb: ${imp.orb.toFixed(1)}°). Significant life changes may occur around this period.`,
                        remedy: getRemedyContent(imp.natalGraha.toLowerCase())?.charity ?? '',
                    }));
                })
                : [],
        };
    },

    /** Tool 12 — Ashtakavarga */
    getAshtakavargaContent(profile: UserProfile): PersonalizedAshtakavargaContent {
        const result = astrologyEngine.calculateAshtakavarga(profile);
        const avgPoints = result.sarva.reduce((a, b) => a + b, 0) / 12;

        const strong = result.sarva
            .map((points, i) => ({ house: i + 1, points }))
            .filter((h) => h.points >= avgPoints)
            .sort((a, b) => b.points - a.points)
            .slice(0, 4)
            .map((h) => ({
                house: h.house,
                points: h.points,
                interpretation: `House ${h.house} (${RASHI_NAMES[(h.house - 1) % 12]}) has strong SAV points (${h.points}), indicating vitality and positive outcomes in ${h.house}${getOrdinalSuffix(h.house)} house matters.`,
            }));

        const weak = result.sarva
            .map((points, i) => ({ house: i + 1, points }))
            .filter((h) => h.points < avgPoints)
            .sort((a, b) => a.points - b.points)
            .slice(0, 4)
            .map((h) => ({
                house: h.house,
                points: h.points,
                interpretation: `House ${h.house} has lower SAV points (${h.points}), suggesting areas requiring extra attention and remedial support.`,
            }));

        return {
            savSummary: `Your Sarva Ashtakavarga total is ${result.sarva.reduce((a, b) => a + b, 0)} across 12 houses (average ${avgPoints.toFixed(1)} per house).`,
            strongHouses: strong,
            weakHouses: weak,
        };
    },

    /** Tool 13 — Prashna (Horary) */
    getPrashnaContent(question: string, category: string, timestamp: Date, lat: number, lng: number): PersonalizedPrashnaContent {
        const chart = astrologyEngine.calculatePrashna(timestamp, lat, lng);
        const lagnaRashi = getRashiByIndex(chart.lagnaSignIndex);
        const moonRashi = getRashiByIndex(RASHI_NAMES.indexOf(chart.moonSign));

        return {
            question,
            category,
            prashnaLagna: chart.lagnaSign,
            moonSign: chart.moonSign,
            interpretation: `The Prashna chart cast at ${formatDate(timestamp)} shows ${chart.lagnaSign} Lagna with Moon in ${chart.moonSign}. ${lagnaRashi?.rashiInterpretation.brief ?? ''} ${moonRashi?.rashiInterpretation.brief ?? ''}`,
            timing: `The answer unfolds primarily during the current ${chart.nakshatra} Nakshatra period.`,
            guidance: `Focus your attention on the matters governed by the ${chart.lagnaSign} ascendant and the ${chart.moonSign} Moon sign for clarity on your question.`,
            remedyCards: buildRemedyCards([chart.planets[0]?.planet?.toLowerCase() ?? 'sun']),
        };
    },

    /** Tool 14 — Hora (Planetary Hours) */
    getHoraContent(grahaKey: string): PersonalizedHoraContent {
        const graha = getGrahaContent(grahaKey);

        const suitableMap: Record<string, string[]> = {
            sun: ['Government work', 'Leadership', 'Father-related matters', 'Medical consultations'],
            moon: ['Travel', 'Domestic matters', 'Public events', 'Agriculture'],
            mars: ['Competition', 'Property', 'Surgery', 'Sports'],
            mercury: ['Commerce', 'Writing', 'Education', 'Communication'],
            jupiter: ['Worship', 'Teaching', 'Legal matters', 'Charity'],
            venus: ['Romance', 'Art', 'Luxury purchases', 'Music'],
            saturn: ['Labour', 'Construction', 'Mining', 'Discipline matters'],
        };

        const avoidMap: Record<string, string[]> = {
            sun: ['Secret activities', 'Night work'],
            moon: ['Permanent decisions', 'War'],
            mars: ['Marriage', 'Peaceful negotiations'],
            mercury: ['Long-term commitments', 'Manual labour'],
            jupiter: ['Materialistic pursuits exclusively'],
            venus: ['Austerity', 'Harsh actions'],
            saturn: ['Celebrations', 'Starting new ventures', 'Marriage'],
        };

        return {
            currentHora: {
                graha: graha?.name ?? grahaKey,
                grahaHindi: graha?.nameHindi ?? '',
                nature: graha?.nature ?? 'neutral',
                suitableFor: suitableMap[grahaKey.toLowerCase()] ?? [],
                avoidFor: avoidMap[grahaKey.toLowerCase()] ?? [],
            },
            horaSchedule: [],
        };
    },

    /** Tool 15 — Graha Shanti (Remedies) */
    getGrahaShanti(profile: UserProfile): PersonalizedRemedyContent {
        const afflicted = astrologyEngine.getAfflictedGrahas(profile);

        return {
            afflictedGrahas: afflicted.map((a) => {
                const graha = getGrahaContent(a.graha.toLowerCase());
                const remedy = getRemedyContent(a.graha.toLowerCase());
                return {
                    graha: graha?.name ?? a.graha,
                    grahaHindi: graha?.nameHindi ?? '',
                    reason: a.reason,
                    severity: a.severity,
                    gemstone: remedy?.gemstone ?? '',
                    mantra: remedy?.mantraTransliteration ?? '',
                    charity: remedy?.charity ?? '',
                    fastingDay: remedy?.fastingDay ?? '',
                    deity: remedy?.deity ?? '',
                    colour: remedy?.colour ?? '',
                };
            }),
            generalGuidance: afflicted.length > 0
                ? `${afflicted.length} graha(s) require attention in your chart. Apply the recommended remedies consistently for best results. Gemstone recommendations should be verified with a qualified Jyotish practitioner before wearing.`
                : 'No significantly afflicted grahas detected in your chart. Continue your spiritual practices to maintain harmony.',
        };
    },

    /** Tool 16 — Dainik Rashifal */
    getDainikRashifal(profile: UserProfile, today?: Date): PersonalizedRashifalContent {
        const date = today ?? new Date();
        const moonSign = astrologyEngine.getMoonSign(new Date(profile.birth_date));
        const rashiKey = rashiIndexToKey(RASHI_NAMES.indexOf(moonSign));
        const weekday = date.getDay();

        const entry = getRashifalEntry(rashiKey, weekday);
        const moonRashi = getRashiByIndex(RASHI_NAMES.indexOf(moonSign));

        // Get Dasha modifier
        const dasha = astrologyEngine.calculateDasha(profile);
        const dashaModEntry = getDashaModifier(dasha.currentMahadasha.lord.toLowerCase());

        // Get a general Gochar modifier if available
        const gochar = astrologyEngine.calculateGochar(profile, date);
        const jupiterLon = gochar.transitPositions.find((t) => t.graha === 'jupiter')?.siderealLon ?? 0;
        const jupiterHouse = Math.floor(jupiterLon / 30) + 1;
        const gocharModEntry = getGocharModifier('jupiter', jupiterHouse);

        return {
            greeting: `Daily Rashifal for ${moonSign}`,
            rashi: moonSign,
            rashiHindi: moonRashi?.nameHindi ?? '',
            prediction: entry?.prediction ?? 'A balanced day with mixed opportunities.',
            luckyColor: entry?.luckyColor ?? 'Blue',
            luckyNumber: entry?.luckyNumber ?? 7,
            dashaModifier: dashaModEntry?.modifier ?? '',
            gocharModifier: gocharModEntry?.modifier ?? '',
        };
    },
};

// ── Utility ──────────────────────────────────────────────────────────────────

function getOrdinalSuffix(n: number): string {
    const s = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    return s[(v - 20) % 10] || s[v] || s[0];
}
