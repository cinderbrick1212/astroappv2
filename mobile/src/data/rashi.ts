/**
 * Rashi (Zodiac Sign) Content
 *
 * Edit this file to update any sign name, interpretation, or keyword.
 * Uses sidereal Lahiri positioning — Rashi 1 (Aries) starts at 0° sidereal.
 * No screen should contain rashi description strings; always read from here.
 */

import type { RashiContent } from './types';

export const RASHIS: RashiContent[] = [
  {
    key: 'aries',
    number: 1,
    name: 'Aries',
    nameHindi: 'मेष',
    glyph: '♈',
    element: 'fire',
    modality: 'moveable',
    ruler: 'mars',
    bodyPart: 'Head and brain',
    brief: 'Bold, pioneering, and action-oriented.',
    standard:
      'Mesha (Aries) is the first Rashi — the sunrise of the zodiac. Ruled by Mars, '
      + 'it embodies initiative, courage, and direct action. Mesha Lagna natives are '
      + 'natural leaders who act first and reflect later. In the Kala Purusha chart, '
      + 'Mesha rules the head, making strong mental drive and headstrong tendencies a '
      + 'hallmark of this sign.',
    lagnaInterpretation:
      'Mesha Lagna gives a lean, athletic build, a quick and direct manner, '
      + 'and a lifelong drive to lead and initiate. You are at your best when pioneering — '
      + 'avoid taking on fights that deplete without rewarding.',
    rashiInterpretation:
      'Mesha Rashi (Moon in Aries) brings an emotionally impulsive, independent spirit. '
      + 'You process feelings through action — sitting still with an emotion is uncomfortable. '
      + 'Anger flares quickly but passes equally fast.',
  },
  {
    key: 'taurus',
    number: 2,
    name: 'Taurus',
    nameHindi: 'वृषभ',
    glyph: '♉',
    element: 'earth',
    modality: 'fixed',
    ruler: 'venus',
    bodyPart: 'Face, neck, and throat',
    brief: 'Stable, sensual, and wealth-building.',
    standard:
      'Vrishabha (Taurus) is ruled by Venus, the planet of beauty and luxury. '
      + 'It is the most stable and fertile of the earth signs — patient, persistent, '
      + 'and deeply connected to the physical world. The Moon is exalted here at 3°, '
      + 'making this the most nourishing and emotionally grounding sign in the zodiac.',
    lagnaInterpretation:
      'Vrishabha Lagna gives a sturdy constitution, a melodious voice, and an '
      + 'instinctive appreciation for beauty and comfort. You build slowly but what '
      + 'you create endures. Stubbornness is your shadow — learn to flex.',
    rashiInterpretation:
      'Vrishabha Rashi brings emotional steadiness, a love of beauty and sensory '
      + 'pleasure, and deep loyalty in relationships. You need time to process change '
      + 'and respond poorly to being rushed.',
  },
  {
    key: 'gemini',
    number: 3,
    name: 'Gemini',
    nameHindi: 'मिथुन',
    glyph: '♊',
    element: 'air',
    modality: 'dual',
    ruler: 'mercury',
    bodyPart: 'Shoulders, arms, and lungs',
    brief: 'Curious, communicative, and versatile.',
    standard:
      'Mithuna (Gemini) is ruled by Mercury, the planet of intellect and communication. '
      + 'It is the most mentally agile of the dual signs — curious, adaptable, and gifted '
      + 'in language and analysis. Mithuna natives excel in fields requiring quick thinking, '
      + 'writing, trading, and making connections between disparate ideas.',
    lagnaInterpretation:
      'Mithuna Lagna gives a youthful appearance, expressive hands, and a quick wit. '
      + 'You are happiest with variety and mental stimulation. Scatter and indecision '
      + 'are the shadows to watch — depth often matters more than breadth.',
    rashiInterpretation:
      'Mithuna Rashi brings an emotionally restless, intellectually driven nature. '
      + 'You process feelings through talking and thinking. Connection and conversation '
      + 'are your love language.',
  },
  {
    key: 'cancer',
    number: 4,
    name: 'Cancer',
    nameHindi: 'कर्क',
    glyph: '♋',
    element: 'water',
    modality: 'moveable',
    ruler: 'moon',
    bodyPart: 'Chest and stomach',
    brief: 'Nurturing, intuitive, and home-centred.',
    standard:
      'Karka (Cancer) is ruled by the Moon. It is the most emotionally sensitive and '
      + 'nurturing sign — deeply connected to home, family, and ancestral roots. '
      + 'Jupiter is exalted in Cancer, making this a sign of immense compassion and '
      + 'wisdom when at its best. The chest and digestive system are governed here.',
    lagnaInterpretation:
      'Karka Lagna gives a round face, a nurturing personality, and a strong '
      + 'attachment to home and family. You absorb the emotional atmosphere around you '
      + 'like a sponge — learning to set boundaries protects your vitality.',
    rashiInterpretation:
      'Karka Rashi brings deep emotional sensitivity, strong intuition, and a '
      + 'powerful connection to the mother and maternal lineage. Security is your '
      + 'deepest need — emotional and physical both.',
  },
  {
    key: 'leo',
    number: 5,
    name: 'Leo',
    nameHindi: 'सिंह',
    glyph: '♌',
    element: 'fire',
    modality: 'fixed',
    ruler: 'sun',
    bodyPart: 'Heart and spine',
    brief: 'Regal, generous, and naturally commanding.',
    standard:
      'Simha (Leo) is the only sign ruled by the Sun. It embodies royalty, '
      + 'creative self-expression, and the desire to be seen and respected. Leo '
      + 'natives carry a natural dignity and are at their best when leading, performing, '
      + 'or inspiring others. The heart and spine — the structural and energetic center '
      + 'of the body — are this sign's domain.',
    lagnaInterpretation:
      'Simha Lagna gives a commanding presence, a generous spirit, and a '
      + 'proud bearing. Recognition matters deeply to you. The shadow is pride — '
      + 'greatness comes when leadership serves rather than demands.',
    rashiInterpretation:
      'Simha Rashi brings an emotionally warm, expressive, and sometimes dramatic '
      + 'nature. You need appreciation and reciprocal respect in relationships. '
      + 'Loyalty given and received is your emotional currency.',
  },
  {
    key: 'virgo',
    number: 6,
    name: 'Virgo',
    nameHindi: 'कन्या',
    glyph: '♍',
    element: 'earth',
    modality: 'dual',
    ruler: 'mercury',
    bodyPart: 'Intestines and digestive system',
    brief: 'Analytical, service-oriented, and precise.',
    standard:
      'Kanya (Virgo) is co-ruled by Mercury and is the sign of Mercury's exaltation. '
      + 'It embodies analysis, discernment, service, and the pursuit of perfection. '
      + 'Kanya natives are gifted healers, editors, analysts, and craftspeople. '
      + 'The digestive system and intestines are the physical domain, reflecting the '
      + 'sign's role as the refiner and purifier of raw material.',
    lagnaInterpretation:
      'Kanya Lagna gives a refined, perceptive personality with an eye for detail '
      + 'and a genuine desire to be useful. The shadow is self-criticism and anxiety — '
      + 'perfect is the enemy of good here.',
    rashiInterpretation:
      'Kanya Rashi brings an emotionally cautious, observant, and analytical nature. '
      + 'You feel most settled when things are in order and you are serving a meaningful '
      + 'purpose. Worry is the internal companion you must learn to quiet.',
  },
  {
    key: 'libra',
    number: 7,
    name: 'Libra',
    nameHindi: 'तुला',
    glyph: '♎',
    element: 'air',
    modality: 'moveable',
    ruler: 'venus',
    bodyPart: 'Kidneys and lower back',
    brief: 'Harmonious, relationship-focused, and just.',
    standard:
      'Tula (Libra) is ruled by Venus and is the sign of Saturn's exaltation. '
      + 'It governs balance, fairness, partnerships, and aesthetic harmony. '
      + 'Tula is the only inanimate sign in the zodiac (a scale) — it represents '
      + 'the weighing of opposites and the search for equilibrium.',
    lagnaInterpretation:
      'Tula Lagna gives natural charm, a refined aesthetic, and an instinct '
      + 'for creating balance in every situation. The shadow is indecision and '
      + 'people-pleasing — your opinions are valid and worth expressing.',
    rashiInterpretation:
      'Tula Rashi brings an emotionally diplomatic, partnership-oriented nature. '
      + 'You feel most yourself in relationship. Solitude without a clear purpose '
      + 'can feel destabilising.',
  },
  {
    key: 'scorpio',
    number: 8,
    name: 'Scorpio',
    nameHindi: 'वृश्चिक',
    glyph: '♏',
    element: 'water',
    modality: 'fixed',
    ruler: 'mars',
    bodyPart: 'Reproductive organs and elimination',
    brief: 'Transformative, intense, and investigative.',
    standard:
      'Vrishchika (Scorpio) is co-ruled by Mars. It is the sign of depth, '
      + 'transformation, occult knowledge, and hidden matters. Ketu is exalted here. '
      + 'Scorpio governs the 8th house significations: death, inheritance, in-laws, '
      + 'surgery, and profound psychological transformation.',
    lagnaInterpretation:
      'Vrishchika Lagna gives magnetic eyes, a penetrating intelligence, and an '
      + 'instinctive understanding of hidden motivations. You are never fully '
      + 'comfortable on the surface — you live in the depths and the depths live in you.',
    rashiInterpretation:
      'Vrishchika Rashi brings intense emotional depth, fierce loyalty, and a '
      + 'capacity for profound transformation. Trust is everything — once broken, '
      + 'rarely fully restored.',
  },
  {
    key: 'sagittarius',
    number: 9,
    name: 'Sagittarius',
    nameHindi: 'धनु',
    glyph: '♐',
    element: 'fire',
    modality: 'dual',
    ruler: 'jupiter',
    bodyPart: 'Thighs and hips',
    brief: 'Philosophical, expansive, and truth-seeking.',
    standard:
      'Dhanu (Sagittarius) is ruled by Jupiter. It is the sign of higher wisdom, '
      + 'philosophy, religion, long journeys, and the quest for universal truth. '
      + 'Dhanu natives are natural teachers, pilgrims, and visionaries who inspire '
      + 'others toward a larger purpose.',
    lagnaInterpretation:
      'Dhanu Lagna gives an athletic build, optimistic outlook, and a lifelong '
      + 'draw toward philosophy, travel, and learning. The shadow is dogmatism — '
      + 'your conviction can become a cage if you stop questioning.',
    rashiInterpretation:
      'Dhanu Rashi brings an emotionally expansive, freedom-loving nature. '
      + 'You need adventure and meaning in your relationships. Confinement — '
      + 'emotional or physical — is what most depletes you.',
  },
  {
    key: 'capricorn',
    number: 10,
    name: 'Capricorn',
    nameHindi: 'मकर',
    glyph: '♑',
    element: 'earth',
    modality: 'moveable',
    ruler: 'saturn',
    bodyPart: 'Knees and skeletal system',
    brief: 'Ambitious, disciplined, and structure-building.',
    standard:
      'Makara (Capricorn) is ruled by Saturn. Mars is exalted here at 28°. '
      + 'It is the sign of worldly achievement, disciplined effort, institutional '
      + 'structures, and karma coming to fruition. Makara natives are the builders '
      + 'and administrators of the zodiac — patient, persistent, and capable of '
      + 'extraordinary long-term accomplishment.',
    lagnaInterpretation:
      'Makara Lagna gives a lean constitution, a serious demeanour, and an '
      + 'innate understanding of how systems and hierarchies work. You age better '
      + 'than most — life improves after 35.',
    rashiInterpretation:
      'Makara Rashi brings an emotionally reserved, achievement-oriented nature. '
      + 'You process feelings through work and accomplishment. Vulnerability requires '
      + 'safety — and safety must be earned.',
  },
  {
    key: 'aquarius',
    number: 11,
    name: 'Aquarius',
    nameHindi: 'कुंभ',
    glyph: '♒',
    element: 'air',
    modality: 'fixed',
    ruler: 'saturn',
    bodyPart: 'Ankles and calves',
    brief: 'Humanitarian, progressive, and community-minded.',
    standard:
      'Kumbha (Aquarius) is co-ruled by Saturn. It governs the collective, '
      + 'humanitarian ideals, technology, large networks, and social reform. '
      + 'Kumbha natives are often ahead of their time — idealists who work for '
      + 'the betterment of the many rather than the comfort of the few.',
    lagnaInterpretation:
      'Kumbha Lagna gives an unconventional, intellectual personality with a '
      + 'genuine concern for humanity. You belong to the world more than to any '
      + 'one person. The shadow is emotional detachment in intimate relationships.',
    rashiInterpretation:
      'Kumbha Rashi brings an emotionally independent, community-oriented nature. '
      + 'Friendship often matters as much as romance. Intellectual connection is '
      + 'your primary love language.',
  },
  {
    key: 'pisces',
    number: 12,
    name: 'Pisces',
    nameHindi: 'मीन',
    glyph: '♓',
    element: 'water',
    modality: 'dual',
    ruler: 'jupiter',
    bodyPart: 'Feet and lymphatic system',
    brief: 'Compassionate, intuitive, and spiritually receptive.',
    standard:
      'Meena (Pisces) is co-ruled by Jupiter. Venus is exalted here at 27°. '
      + 'It is the final sign — the ocean into which all rivers flow. Meena governs '
      + 'the dissolution of individual boundaries, spiritual liberation, dreams, '
      + 'institutions, and the hidden realm. Meena natives are the most empathic and '
      + 'psychically sensitive of the zodiac.',
    lagnaInterpretation:
      'Meena Lagna gives large, luminous eyes, an other-worldly charm, and '
      + 'a permeable emotional boundary that must be consciously managed. '
      + 'Spiritual practice is not optional for you — it is structural.',
    rashiInterpretation:
      'Meena Rashi brings an emotionally fluid, boundlessly empathic nature. '
      + 'You absorb the feelings of those around you. Creative, musical, and '
      + 'spiritual outlets are essential for your emotional health.',
  },
];

/** Look up a rashi by its key */
export const getRashi = (key: string): RashiContent | undefined =>
  RASHIS.find(r => r.key === key);

/** Look up a rashi by its 1-based number */
export const getRashiByNumber = (n: number): RashiContent | undefined =>
  RASHIS.find(r => r.number === n);
