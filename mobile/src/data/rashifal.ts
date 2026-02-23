/**
 * Rashifal (Daily Horoscope) Content Library
 * 12 Rashis × 7 weekday base predictions + Dasha/Gochar modifiers.
 */

import type { RashifalEntry, DashaModifier, GocharModifier } from './types';

// ── Weekday base predictions ─────────────────────────────────────────────────

const RASHI_KEYS = [
    'aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo',
    'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces',
] as const;

const WEEKDAY_PREDICTIONS: Record<string, string[]> = {
    aries: [
        'A day of spiritual clarity and inner reflection. Connect with your higher purpose.',
        'Your energy is high — tackle challenging tasks head-on. Leadership opportunities arise.',
        'Mars fuels your ambition today. Property and competitive matters are favoured.',
        'Communication flows easily. Business proposals and educational matters thrive.',
        'Jupiter blesses your growth today. Financial gains and spiritual insights are likely.',
        'Relationships take centre stage. Express your feelings with warmth and sincerity.',
        'Focus on discipline and long-term planning. Take care of joint and bone health.',
    ],
    taurus: [
        'Seek comfort in ritual and prayer. Your devotion brings inner peace today.',
        'Emotional sensitivity is heightened. Nurture family bonds and domestic harmony.',
        'Physical energy peaks. Property matters and home improvements are favoured.',
        'Financial acumen is sharp today. Commerce and communication bring gains.',
        'A fortunate day for wealth accumulation and educational pursuits.',
        'Love and beauty surround you. Artistic expression and romance are highlighted.',
        'Patience is rewarded today. Focus on commitments that require endurance.',
    ],
    gemini: [
        'Your mind seeks spiritual knowledge today. Reading and contemplation are favoured.',
        'Emotional connections deepen. Listen to your intuition in personal matters.',
        'Take decisive action on pending tasks. Your energy supports competitive goals.',
        'Mercury amplifies your communication today. Writing, teaching, and networking excel.',
        'A day of expansion and optimism. New learning opportunities appear.',
        'Social graces are heightened. Diplomacy and partnership discussions thrive.',
        'Discipline your scattered energy today. Structured work yields lasting results.',
    ],
    cancer: [
        'Deep spiritual connection today. Rituals and prayer bring comfort and clarity.',
        'Your emotional intelligence is at its peak. Trust your feelings in decisions.',
        'Channel your energy into home improvement and family protection.',
        'Business communications flow smoothly. Short trips and local connections are favoured.',
        'Abundance flows today. Children\'s matters and creative projects are blessed.',
        'Romance and creative expression are highlighted. Express your artistic side.',
        'Practice discipline in spending. Long-term savings and investment decisions are favoured.',
    ],
    leo: [
        'Your soul\'s purpose illuminates today. Lead with integrity and warmth.',
        'Emotional warmth attracts appreciation. Public recognition is possible.',
        'Competitive drive is strong. Sports, fitness, and assertive action are favoured.',
        'Creative communication shines. Presentations, performances, and writing excel.',
        'Fortune smiles on your endeavours. Educational and philosophical pursuits thrive.',
        'Love and luxury converge. Romantic gestures and artistic purchases are favoured.',
        'Focus on responsibility and legacy-building. Your efforts will be remembered.',
    ],
    virgo: [
        'Service-oriented spiritual practice brings peace. Help others to help yourself.',
        'Your analytical mind works with emotional depth. Healing practices are favoured.',
        'Take practical action on health and fitness goals. Your body responds well today.',
        'Mercury doubles your intellectual power. Analysis, editing, and detailed work excel.',
        'Knowledge expansion is favoured. Teaching, counselling, and philosophical study thrive.',
        'Beauty in simplicity today. Declutter, organise, and create elegant systems.',
        'Discipline in health routines pays off. Focus on long-term wellness planning.',
    ],
    libra: [
        'Seek balance between material and spiritual today. Meditation brings harmony.',
        'Emotional equilibrium is easily maintained. Relationships feel harmonious.',
        'Address imbalances with decisive action. Fairness and justice are your themes.',
        'Diplomatic communication excels. Negotiations, contracts, and agreements are favoured.',
        'A fortunate day for partnerships. Legal matters and joint ventures thrive.',
        'Venus heightens your charm today. Romance, beauty, and social events are highlighted.',
        'Focus on long-term commitments. Foundation-laying and structural planning are favoured.',
    ],
    scorpio: [
        'Intense spiritual experiences are possible today. Transformation through meditation.',
        'Emotional depth brings powerful insights. Trust your psychological intuition.',
        'Mars empowers your resolve today. Research, investigation, and competitive goals thrive.',
        'Analytical communication is sharp. Uncover hidden information and solve complex problems.',
        'Transformation through knowledge today. Deep study and philosophical insights emerge.',
        'Intimate connections deepen. Express vulnerability with trusted partners.',
        'Discipline in transformation. Release what no longer serves your growth.',
    ],
    sagittarius: [
        'Philosophical contemplation enriches your soul today. Seek wisdom in ancient texts.',
        'Emotional optimism attracts supportive people. Family bonds strengthen.',
        'Adventure calls today. Physical activity, travel planning, and exploration are favoured.',
        'Teaching and learning flow naturally. Publishing, broadcasting, and education excel.',
        'Jupiter doubles your fortune today. Expansion in all areas is supported.',
        'Cultural and artistic experiences enrich you. Music, art, and travel are highlighted.',
        'Discipline your philosophical pursuits. Structured learning yields deeper wisdom.',
    ],
    capricorn: [
        'Spiritual discipline brings clarity. Morning rituals set the tone for the day.',
        'Emotional grounding through family and tradition. Honour your roots.',
        'Ambitious action is favoured. Career advancement and property matters progress.',
        'Professional communication is precise and effective. Meetings and proposals thrive.',
        'Fortune through hard work today. Educational achievements and mentorship are blessed.',
        'Work-life balance is the theme. Allow beauty and pleasure into your disciplined routine.',
        'Saturn supports your efforts doubly today. Long-term goals advance significantly.',
    ],
    aquarius: [
        'Unconventional spiritual practices bring insight. Technology aids your growth.',
        'Emotional connections through shared ideals. Community activities are fulfilling.',
        'Take action on progressive goals. Innovation and social causes are favoured.',
        'Innovative ideas flow easily. Technology, writing, and networking excel.',
        'Fortune through social impact today. Group ventures and humanitarian projects thrive.',
        'Creative friendships enrich you. Artistic collaboration and social connection are highlighted.',
        'Structured innovation today. Discipline applied to progressive ideas yields breakthroughs.',
    ],
    pisces: [
        'Deep spiritual immersion today. Dreams, meditation, and prayer are exceptionally potent.',
        'Emotional compassion overflows. Healing work and counselling are deeply fulfilling.',
        'Channel your energy into creative projects. Artistic and spiritual action is favoured.',
        'Intuitive communication guides you. Poetry, music, and heartfelt conversation thrive.',
        'Fortune through faith and compassion today. Charitable giving is especially blessed.',
        'Romance takes a dreamy, spiritual quality. Art, music, and love intertwine beautifully.',
        'Discipline in spiritual practice today. Structured meditation yields profound experiences.',
    ],
};

/** Build the full rashifal entry list */
function buildRashifalEntries(): RashifalEntry[] {
    const entries: RashifalEntry[] = [];
    const colors = ['Red', 'White', 'Green', 'Yellow', 'Orange', 'Blue', 'Purple'];

    for (const rashiKey of RASHI_KEYS) {
        const predictions = WEEKDAY_PREDICTIONS[rashiKey];
        for (let weekday = 0; weekday < 7; weekday++) {
            entries.push({
                rashiKey,
                weekday,
                prediction: predictions[weekday],
                luckyColor: colors[(RASHI_KEYS.indexOf(rashiKey) + weekday) % colors.length],
                luckyNumber: ((RASHI_KEYS.indexOf(rashiKey) * 3 + weekday * 5 + 1) % 9) + 1,
            });
        }
    }

    return entries;
}

export const RASHIFAL_ENTRIES: RashifalEntry[] = buildRashifalEntries();

// ── Dasha Modifiers ──────────────────────────────────────────────────────────

export const DASHA_MODIFIERS: DashaModifier[] = [
    { dashaLord: 'sun', modifier: 'Your Sun Dasha emphasises authority and career matters today. Government and leadership themes are amplified.' },
    { dashaLord: 'moon', modifier: 'Your Moon Dasha heightens emotional sensitivity today. Trust your intuition and nurture close relationships.' },
    { dashaLord: 'mars', modifier: 'Your Mars Dasha energises your actions today. Channel this drive constructively — avoid impulsive decisions.' },
    { dashaLord: 'rahu', modifier: 'Your Rahu Dasha amplifies worldly ambitions today. Foreign connections and unconventional approaches are highlighted.' },
    { dashaLord: 'jupiter', modifier: 'Your Jupiter Dasha brings wisdom and expansion today. Spiritual growth and financial prosperity are favoured.' },
    { dashaLord: 'saturn', modifier: 'Your Saturn Dasha demands discipline today. Patience and perseverance are rewarded — avoid shortcuts.' },
    { dashaLord: 'mercury', modifier: 'Your Mercury Dasha sharpens your intellect today. Communication, commerce, and learning are especially productive.' },
    { dashaLord: 'ketu', modifier: 'Your Ketu Dasha deepens spiritual awareness today. Detachment from material concerns brings unexpected clarity.' },
    { dashaLord: 'venus', modifier: 'Your Venus Dasha enhances love and creativity today. Relationships, beauty, and artistic expression flourish.' },
];

// ── Gochar (Transit) Modifiers ───────────────────────────────────────────────

export const GOCHAR_MODIFIERS: GocharModifier[] = [
    { transitGraha: 'jupiter', natalHouse: 1, modifier: 'Jupiter transiting your Lagna brings confidence, health improvement, and new beginnings.' },
    { transitGraha: 'jupiter', natalHouse: 5, modifier: 'Jupiter transiting your 5th house blesses children, education, and creative pursuits.' },
    { transitGraha: 'jupiter', natalHouse: 9, modifier: 'Jupiter transiting your 9th house brings spiritual growth, long journeys, and fortune from elders.' },
    { transitGraha: 'jupiter', natalHouse: 11, modifier: 'Jupiter transiting your 11th house brings financial gains, fulfilled wishes, and supportive friendships.' },
    { transitGraha: 'saturn', natalHouse: 1, modifier: 'Saturn transiting your Lagna demands health attention and self-discipline. Pace yourself.' },
    { transitGraha: 'saturn', natalHouse: 4, modifier: 'Saturn transiting your 4th house may bring domestic changes or property matters requiring patience.' },
    { transitGraha: 'saturn', natalHouse: 7, modifier: 'Saturn transiting your 7th house tests partnerships. Commitment and patience strengthen bonds.' },
    { transitGraha: 'saturn', natalHouse: 10, modifier: 'Saturn transiting your 10th house brings career restructuring. Hard work leads to lasting authority.' },
];

/** Lookup a rashifal entry */
export function getRashifalEntry(rashiKey: string, weekday: number): RashifalEntry | undefined {
    return RASHIFAL_ENTRIES.find((r) => r.rashiKey === rashiKey && r.weekday === weekday);
}

/** Lookup a Dasha modifier */
export function getDashaModifier(dashaLord: string): DashaModifier | undefined {
    return DASHA_MODIFIERS.find((d) => d.dashaLord === dashaLord.toLowerCase());
}

/** Lookup a Gochar modifier */
export function getGocharModifier(graha: string, house: number): GocharModifier | undefined {
    return GOCHAR_MODIFIERS.find((g) => g.transitGraha === graha.toLowerCase() && g.natalHouse === house);
}
