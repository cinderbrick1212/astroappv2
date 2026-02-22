/**
 * Graha (Planet) Content
 *
 * Edit this file to update any planet name, interpretation, or keyword.
 * All 9 Vedic grahas — Sun through Saturn plus Rahu and Ketu.
 * No screen or service file should contain planet description strings;
 * they must always read from this constant.
 */

import type { GrahaContent } from './types';

export const GRAHAS: GrahaContent[] = [
  {
    key: 'sun',
    name: 'Sun',
    nameHindi: 'सूर्य',
    glyph: '☉',
    nature: 'malefic',
    gender: 'male',
    element: 'fire',
    rulerOf: ['leo'],
    exaltedIn: 'aries',
    debilitatedIn: 'libra',
    karakas: ['soul', 'father', 'authority', 'vitality', 'government'],
    dayOfWeek: 'Sunday',
    brief: 'Soul, authority, and life-force.',
    standard:
      'The Sun represents the individual soul (Atma), the father, and the principle of '
      + 'authority and governance. A well-placed Sun bestows confidence, leadership, and '
      + 'vitality. An afflicted Sun may indicate ego struggles, conflicts with authority, '
      + 'or health issues related to the heart and eyes.',
    deep:
      'In Jyotish, the Sun is the lamp of the soul — the eternal witness that illuminates '
      + 'dharmic purpose. Its house and sign placement reveal where a person seeks recognition '
      + 'and where their ego either shines or burns. The Sun moves through one rashi each month, '
      + 'marking the solar cycle that underpins the Vedic calendar. Its conjunction with other '
      + 'grahas combusts them, temporarily weakening their significations. The Sun's dignity — '
      + 'exalted in Aries at 10°, debilitated in Libra at 10° — tells the astrologer how freely '
      + 'the soul can express itself in this lifetime.',
    whenStrong:
      'Radiant health, natural leadership, success in government or administration, '
      + 'father is a source of strength, fame and recognition come naturally.',
    whenAfflicted:
      'Ego conflicts, strained relationship with father or authority figures, '
      + 'heart/eye health concerns, difficulty asserting identity without aggression.',
  },
  {
    key: 'moon',
    name: 'Moon',
    nameHindi: 'चंद्र',
    glyph: '☽',
    nature: 'benefic',
    gender: 'female',
    element: 'water',
    rulerOf: ['cancer'],
    exaltedIn: 'taurus',
    debilitatedIn: 'scorpio',
    karakas: ['mind', 'mother', 'emotions', 'memory', 'public'],
    dayOfWeek: 'Monday',
    brief: 'Mind, mother, and emotional wellbeing.',
    standard:
      'The Moon governs the mind (Manas), emotions, memory, and the relationship with '
      + 'the mother. It is the fastest-moving graha, changing signs every 2.25 days, making '
      + 'it the primary timer in Jyotish. The Moon's nakshatra at birth determines the '
      + 'starting Vimshottari Dasha and is considered more important than the Sun sign in '
      + 'Vedic practice.',
    deep:
      'A strong, well-aspected Moon creates emotional stability, intuitive intelligence, '
      + 'and the ability to connect deeply with others. The Moon exalted in Taurus is the most '
      + 'nourishing placement — stable, sensual, and grounded. Afflicted by Rahu or Ketu, the '
      + 'Moon produces anxiety, emotional instability, or unresolved maternal patterns. '
      + 'In Vedic medical astrology, the Moon governs fluids, the lymphatic system, and the '
      + 'reproductive cycle. The waxing Moon (Shukla Paksha) is considered stronger; the '
      + 'dark fortnight (Krishna Paksha) requires more internal reflection.',
    whenStrong:
      'Emotional intelligence, strong intuition, loving relationships, good memory, '
      + 'success in public-facing roles, nurturing mother figure.',
    whenAfflicted:
      'Emotional volatility, anxiety, disturbed sleep, difficult relationship with '
      + 'mother, mental restlessness, fluid-related health issues.',
  },
  {
    key: 'mars',
    name: 'Mars',
    nameHindi: 'मंगल',
    glyph: '♂',
    nature: 'malefic',
    gender: 'male',
    element: 'fire',
    rulerOf: ['aries', 'scorpio'],
    exaltedIn: 'capricorn',
    debilitatedIn: 'cancer',
    karakas: ['courage', 'siblings', 'land', 'energy', 'surgery'],
    dayOfWeek: 'Tuesday',
    brief: 'Courage, drive, and physical energy.',
    standard:
      'Mars (Mangal) is the planet of action, courage, and physical vitality. '
      + 'It rules younger siblings, landed property, and the blood. A strong Mars gives '
      + 'athletic ability, entrepreneurial drive, and the courage to take decisive action. '
      + 'When afflicted, Mars can indicate aggression, accidents, surgeries, or conflict.',
    deep:
      'Mars is the general of the planetary army — it fights for what it believes in '
      + 'and will not accept defeat. In Jyotish, Mars casts special aspects to the 4th and '
      + '8th houses from its position, making it a powerful transformer wherever it sits. '
      + 'Mangal Dosha — Mars in the 1st, 2nd, 4th, 7th, 8th, or 12th house — is one of '
      + 'the most discussed placements in Indian marital astrology because of Mars's disruptive '
      + 'energy in these relationship-sensitive houses. Exalted in Capricorn, Mars channels '
      + 'its energy into disciplined, strategic achievement.',
    whenStrong:
      'Bold leadership, athletic or physical excellence, real estate success, '
      + 'ability to overcome obstacles, strong younger siblings.',
    whenAfflicted:
      'Anger, accidents, surgery, conflict in marriage (Mangal Dosha), '
      + 'blood disorders, excessive risk-taking.',
  },
  {
    key: 'mercury',
    name: 'Mercury',
    nameHindi: 'बुध',
    glyph: '☿',
    nature: 'neutral',
    gender: 'neutral',
    element: 'earth',
    rulerOf: ['gemini', 'virgo'],
    exaltedIn: 'virgo',
    debilitatedIn: 'pisces',
    karakas: ['intellect', 'speech', 'commerce', 'mathematics', 'communication'],
    dayOfWeek: 'Wednesday',
    brief: 'Intellect, communication, and commerce.',
    standard:
      'Mercury (Budha) governs the rational mind, speech, writing, trade, and mathematics. '
      + 'It is a neutral graha — benefic when with benefics, malefic when with malefics. '
      + 'A strong Mercury produces sharp analytical ability, eloquence, business acumen, '
      + 'and skill in learning languages.',
    deep:
      'Mercury is the messenger between the divine and human realms. In Jyotish, it '
      + 'represents the discriminating intellect (Buddhi) that separates reality from illusion. '
      + 'It is exalted in its own sign Virgo — the sign of precision, analysis, and service — '
      + 'and debilitated in Pisces, where boundaries between facts and imagination blur. '
      + 'Mercury retrograde periods are particularly significant in Vedic timing as they slow '
      + 'down communication, contracts, and travel plans. In the body, Mercury governs the '
      + 'nervous system, skin, and respiratory passages.',
    whenStrong:
      'Excellent communication skills, commercial success, mathematical aptitude, '
      + 'writing and speaking ability, skillful negotiations.',
    whenAfflicted:
      'Communication difficulties, deception, nervous system disorders, '
      + 'challenges in education, indecisiveness.',
  },
  {
    key: 'jupiter',
    name: 'Jupiter',
    nameHindi: 'बृहस्पति',
    glyph: '♃',
    nature: 'benefic',
    gender: 'male',
    element: 'fire',
    rulerOf: ['sagittarius', 'pisces'],
    exaltedIn: 'cancer',
    debilitatedIn: 'capricorn',
    karakas: ['wisdom', 'children', 'wealth', 'spirituality', 'teacher'],
    dayOfWeek: 'Thursday',
    brief: 'Wisdom, fortune, and spiritual grace.',
    standard:
      'Jupiter (Brihaspati / Guru) is the greatest natural benefic in Jyotish. '
      + 'It represents wisdom, divine grace, children, teachers, wealth, and dharma. '
      + 'Jupiter's aspect on any house or planet is considered highly protective and '
      + 'expansive. A strong Jupiter in the chart is the single most powerful indicator '
      + 'of long-term good fortune.',
    deep:
      'Jupiter is the Guru — the one who dispels the darkness of ignorance. '
      + 'Its placement reveals where a person finds meaning, where they are naturally generous, '
      + 'and where divine blessings manifest most clearly. Exalted in Cancer, Jupiter's '
      + 'wisdom flows through the heart, nurturing and protecting. Debilitated in Capricorn, '
      + 'materialism can crowd out higher wisdom. Jupiter aspects the 5th and 9th houses from '
      + 'its placement (special aspects), blessing those areas of life with expansion, faith, '
      + 'and good fortune. In predictive Jyotish, Jupiter transiting the natal Moon (Guru '
      + 'Transit) is considered the most auspicious annual transit.',
    whenStrong:
      'Prosperity, higher education success, children bring joy, strong ethical '
      + 'compass, spiritual depth, wise and supportive teachers in life.',
    whenAfflicted:
      'Overconfidence, excess, financial mismanagement, liver or hip issues, '
      + 'strained relationship with teachers or children, misplaced faith.',
  },
  {
    key: 'venus',
    name: 'Venus',
    nameHindi: 'शुक्र',
    glyph: '♀',
    nature: 'benefic',
    gender: 'female',
    element: 'water',
    rulerOf: ['taurus', 'libra'],
    exaltedIn: 'pisces',
    debilitatedIn: 'virgo',
    karakas: ['love', 'beauty', 'luxury', 'spouse', 'arts'],
    dayOfWeek: 'Friday',
    brief: 'Love, beauty, and material comfort.',
    standard:
      'Venus (Shukra) governs love, beauty, the arts, luxury, vehicles, spouse, '
      + 'and material comforts. It is the second great natural benefic. A well-placed '
      + 'Venus brings grace, aesthetic refinement, romantic happiness, and material '
      + 'prosperity. In Jyotish, Venus also represents the divine teacher of the '
      + 'asuras — the keeper of the secret of immortality.',
    deep:
      'Venus exalted in Pisces — the sign of dissolution and unconditional love — '
      + 'represents love that transcends the material plane. It is debilitated in Virgo, '
      + 'where critical analysis and perfectionism can undermine the natural flow of affection. '
      + 'Venus rules Shukra Dasha (20 years) — the longest and often most materially prosperous '
      + 'period in the Vimshottari cycle. In the body, Venus governs the reproductive system, '
      + 'kidneys, and the sense of taste. Its placement in the 7th house is one of the most '
      + 'carefully studied indicators in Vedic relationship analysis.',
    whenStrong:
      'Romantic happiness, artistic talent, material abundance, vehicles and luxury, '
      + 'harmonious marriage, natural charm and social grace.',
    whenAfflicted:
      'Relationship difficulties, indulgence and excess, kidney issues, '
      + 'financial mismanagement through luxury, vanity.',
  },
  {
    key: 'saturn',
    name: 'Saturn',
    nameHindi: 'शनि',
    glyph: '♄',
    nature: 'malefic',
    gender: 'neutral',
    element: 'air',
    rulerOf: ['capricorn', 'aquarius'],
    exaltedIn: 'libra',
    debilitatedIn: 'aries',
    karakas: ['karma', 'discipline', 'longevity', 'servants', 'delays'],
    dayOfWeek: 'Saturday',
    brief: 'Karma, discipline, and the lessons of time.',
    standard:
      'Saturn (Shani) is the great karmic teacher — slow, methodical, and absolutely '
      + 'just. It governs longevity, discipline, hard work, delays, and the working class. '
      + 'A strong, well-placed Saturn brings discipline, longevity, and the ability to '
      + 'build lasting structures through sustained effort. Saturn's Sade Sati (7.5-year '
      + 'transit over the natal Moon) is the most discussed transit in Indian astrology.',
    deep:
      'Saturn rules Karma — what we must face, earn, and pay back. It strips away '
      + 'what is not real and demands we confront our shadow. Saturn exalted in Libra '
      + 'represents justice, balance, and the ideal use of Saturnian energy: fair distribution '
      + 'of resources and equitable systems. Saturn's special aspects to the 3rd and 10th '
      + 'houses from its position have profound effects on career, communication, and effort. '
      + 'Shani Mahadasha (19 years) is often a period of hard work, karmic reckoning, and '
      + 'ultimately, solid achievement for those who remain honest and diligent.',
    whenStrong:
      'Exceptional discipline, longevity, success through sustained effort, '
      + 'justice prevails, good servants and subordinates, wealth through land.',
    whenAfflicted:
      'Delays, depression, chronic illness, legal troubles, isolation, '
      + 'hardship in Sade Sati periods, difficult relationship with servants or employees.',
  },
  {
    key: 'rahu',
    name: 'Rahu',
    nameHindi: 'राहु',
    glyph: '☊',
    nature: 'malefic',
    gender: 'neutral',
    element: 'air',
    rulerOf: [],
    exaltedIn: 'taurus',
    debilitatedIn: 'scorpio',
    karakas: ['obsession', 'foreigners', 'technology', 'illusion', 'ambition'],
    dayOfWeek: 'Saturday',
    brief: 'Worldly desire, illusion, and karmic hunger.',
    standard:
      'Rahu (North Node of the Moon) is a shadow graha — it has no physical body but '
      + 'immense psychological power. It represents worldly ambition, foreign connections, '
      + 'technology, unconventional thinking, and insatiable desire. Wherever Rahu sits, '
      + 'there is a strong compulsion, obsession, and ultimately a karmic lesson to be '
      + 'learned through experience.',
    deep:
      'Rahu and Ketu are always exactly opposite each other, forming the karmic axis '
      + 'of the chart. Rahu shows where the soul is reaching toward new experience in '
      + 'this lifetime — the unknown terrain it must enter. Rahu amplifies, distorts, '
      + 'and intensifies whatever planet it conjoins. It behaves like Saturn but with '
      + 'a dark, obsessive quality. In the modern era, Rahu strongly relates to technology, '
      + 'AI, social media, and the blurring of reality and illusion. Kaal Sarpa Dosha — '
      + 'all planets hemmed between Rahu and Ketu — is one of the most significant doshas '
      + 'in Vedic chart analysis.',
    whenStrong:
      'Extraordinary ambition and achievement in worldly matters, success in '
      + 'foreign lands or with foreigners, technological innovation, unconventional success.',
    whenAfflicted:
      'Deception, confusion, obsession, Kaal Sarpa Dosha effects, '
      + 'difficulties with foreigners, mental health challenges.',
  },
  {
    key: 'ketu',
    name: 'Ketu',
    nameHindi: 'केतु',
    glyph: '☋',
    nature: 'malefic',
    gender: 'neutral',
    element: 'fire',
    rulerOf: [],
    exaltedIn: 'scorpio',
    debilitatedIn: 'taurus',
    karakas: ['moksha', 'spirituality', 'past_life', 'detachment', 'psychic'],
    dayOfWeek: 'Tuesday',
    brief: 'Spiritual liberation, past karma, and detachment.',
    standard:
      'Ketu (South Node of the Moon) represents past-life karma, spiritual liberation '
      + '(Moksha), psychic ability, and detachment from material reality. It dissolves '
      + 'the significations of the house it occupies and produces sudden, unexpected '
      + 'events. Ketu Mahadasha (7 years) often brings a profound spiritual turning '
      + 'point and a release of accumulated karma.',
    deep:
      'If Rahu is the hunger, Ketu is the emptiness that follows having eaten. '
      + 'Ketu is where the soul has already mastered — and now seeks to release. '
      + 'Its placement shows what comes naturally but is no longer deeply fulfilling. '
      + 'Ketu exalted in Scorpio deepens psychic ability, transformative power, and '
      + 'the capacity for profound spiritual insight. It is the planet most associated '
      + 'with enlightenment and renunciation in Jyotish. Health effects of Ketu tend '
      + 'toward mysterious or hard-to-diagnose conditions, particularly related to the '
      + 'nervous system and accidents.',
    whenStrong:
      'Deep spiritual gifts, psychic sensitivity, liberation from material '
      + 'attachment, mastery of esoteric subjects, profound past-life wisdom available.',
    whenAfflicted:
      'Mysterious illnesses, accidents, isolation, sudden losses, '
      + 'existential confusion, Kaal Sarpa Dosha effects.',
  },
];

/** Look up a graha by its key */
export const getGraha = (key: string): GrahaContent | undefined =>
  GRAHAS.find(g => g.key === key);
