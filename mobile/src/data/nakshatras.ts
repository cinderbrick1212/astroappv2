/**
 * Nakshatra Content
 *
 * Edit this file to update any nakshatra name, interpretation, symbol, or
 * compatibility data. All 27 lunar mansions with full divinatory readings.
 * No screen should contain nakshatra description strings; always read from here.
 */

import type { NakshatraContent } from './types';

export const NAKSHATRAS: NakshatraContent[] = [
  {
    key: 'ashwini',
    number: 1,
    name: 'Ashwini',
    nameHindi: 'अश्विनी',
    ruler: 'ketu',
    deity: 'Ashwini Kumaras (divine healers)',
    symbol: 'Horse head',
    startDeg: 0,
    endDeg: 13.33,
    nature: 'deva',
    gana: 'deva',
    gender: 'male',
    caste: 'Vaishya',
    animal: 'Horse',
    brief: 'Swift beginnings, healing energy, and restless vitality.',
    standard:
      'Ashwini is ruled by Ketu and presided over by the Ashwini Kumaras — the divine '
      + 'twin physicians of the Vedic pantheon. It carries the energy of the first breath: '
      + 'spontaneous, quick, and fearless. Those born with a strong Ashwini placement are '
      + 'natural healers, fast movers, and initiators who chafe under delay.',
    moonInterpretation:
      'Moon in Ashwini brings restless energy, a healing instinct, and an innate '
      + 'fearlessness. You initiate quickly and grow bored with slow processes. '
      + 'Your Ketu Mahadasha (starting Dasha) is a period of spiritual searching and '
      + 'release of old patterns — embrace it rather than resist it.',
    lagnaInterpretation:
      'Ashwini Lagna gives a youthful, athletic appearance and a direct, '
      + 'action-first personality. You are drawn to medicine, healing, and speed. '
      + 'Patience is the virtue you must consciously cultivate.',
    compatibleNakshatras: ['shatabhisha', 'punarvasu', 'hasta', 'pushya'],
    incompatibleNakshatras: ['jyeshtha', 'ashlesha'],
  },
  {
    key: 'bharani',
    number: 2,
    name: 'Bharani',
    nameHindi: 'भरणी',
    ruler: 'venus',
    deity: 'Yama (god of death and dharma)',
    symbol: 'Yoni (vessel of creation and death)',
    startDeg: 13.33,
    endDeg: 26.67,
    nature: 'manava',
    gana: 'manava',
    gender: 'female',
    caste: 'Mleccha',
    animal: 'Elephant',
    brief: 'Creative power, extremes, and transformative intensity.',
    standard:
      'Bharani is ruled by Venus and presided over by Yama, the lord of Dharma and death. '
      + 'This nakshatra holds the paradox of creation and destruction in a single symbol. '
      + 'Bharani natives carry enormous creative power and often deal with intense '
      + 'experiences — birth, death, sexuality, and transformation are their territory.',
    moonInterpretation:
      'Moon in Bharani brings intense emotions, creative power, and a pull toward '
      + 'extremes. You feel everything deeply and struggle with moderation. Venus Mahadasha '
      + '(20 years) is your longest period — it brings beauty, love, and material '
      + 'abundance when navigated with discernment rather than excess.',
    lagnaInterpretation:
      'Bharani Lagna gives a strong, magnetic presence and an ability to hold '
      + 'great creative or destructive force. You are drawn to art, healing, or '
      + 'anything requiring the courage to face life\'s rawest realities.',
    compatibleNakshatras: ['revati', 'rohini', 'uttara_phalguni'],
    incompatibleNakshatras: ['vishakha', 'krittika'],
  },
  {
    key: 'krittika',
    number: 3,
    name: 'Krittika',
    nameHindi: 'कृत्तिका',
    ruler: 'sun',
    deity: 'Agni (fire god)',
    symbol: 'Razor or flame',
    startDeg: 26.67,
    endDeg: 40,
    nature: 'rakshasa',
    gana: 'rakshasa',
    gender: 'female',
    caste: 'Brahmin',
    animal: 'Sheep / Goat',
    brief: 'Cutting clarity, purification, and fierce discernment.',
    standard:
      'Krittika is ruled by the Sun and presided over by Agni, the sacred fire. '
      + 'It is the nakshatra of the Pleiades and carries the energy of a razor: '
      + 'precise, purifying, and able to cut away what does not belong. '
      + 'Krittika natives have high standards and low tolerance for hypocrisy or mediocrity.',
    moonInterpretation:
      'Moon in Krittika brings a sharp, critical mind, high standards, and a '
      + 'deeply protective instinct toward those they claim as their own. '
      + 'The inner fire can burn too hot — learning to temper criticism with compassion '
      + 'is your lifelong practice.',
    lagnaInterpretation:
      'Krittika Lagna gives a commanding, fiery presence and an unwillingness '
      + 'to compromise on truth. You are born to purify and illuminate — '
      + 'in yourself and in the environments you inhabit.',
    compatibleNakshatras: ['rohini', 'hasta', 'uttara_phalguni'],
    incompatibleNakshatras: ['vishakha', 'bharani'],
  },
  {
    key: 'rohini',
    number: 4,
    name: 'Rohini',
    nameHindi: 'रोहिणी',
    ruler: 'moon',
    deity: 'Brahma (creator)',
    symbol: 'Ox cart or chariot',
    startDeg: 40,
    endDeg: 53.33,
    nature: 'manava',
    gana: 'manava',
    gender: 'female',
    caste: 'Shudra',
    animal: 'Serpent',
    brief: 'Beauty, fertility, and material abundance.',
    standard:
      'Rohini is the Moon's own nakshatra — its favorite dwelling. Presided over '
      + 'by Brahma the creator, it embodies all that is beautiful, fertile, and '
      + 'deeply nourishing. Rohini natives possess natural beauty, artistic gifts, '
      + 'and an almost irresistible personal magnetism.',
    moonInterpretation:
      'Moon in Rohini — the Moon's exaltation nakshatra — is one of the most '
      + 'auspicious Moon placements. You are emotionally settled, sensually gifted, '
      + 'and deeply creative. Your Moon Mahadasha will bring material abundance and '
      + 'emotional richness when you remain rooted and present.',
    lagnaInterpretation:
      'Rohini Lagna gives luminous beauty, a melodious voice, and an instinctive '
      + 'understanding of pleasure, art, and natural cycles. '
      + 'The shadow is possessiveness — love must be held lightly.',
    compatibleNakshatras: ['mrigashira', 'revati', 'bharani'],
    incompatibleNakshatras: ['jyeshtha', 'ardra'],
  },
  {
    key: 'mrigashira',
    number: 5,
    name: 'Mrigashira',
    nameHindi: 'मृगशिरा',
    ruler: 'mars',
    deity: 'Soma (the Moon / nectar)',
    symbol: 'Deer head',
    startDeg: 53.33,
    endDeg: 66.67,
    nature: 'deva',
    gana: 'deva',
    gender: 'neutral',
    caste: 'Farmer',
    animal: 'Female serpent',
    brief: 'Eternal seeking, gentleness, and restless curiosity.',
    standard:
      'Mrigashira is ruled by Mars but carries the gentle energy of the deer — '
      + 'curious, sensitive, and always seeking. Presided over by Soma, the nectar '
      + 'of the gods, it bestows a refined, searching intelligence and a love of '
      + 'beauty and sensory experience.',
    moonInterpretation:
      'Moon in Mrigashira brings a restless, searching quality to the emotions. '
      + 'You are perpetually questing — for beauty, knowledge, or the perfect love. '
      + 'Mars Mahadasha brings energy and the courage to act on what you have been '
      + 'seeking; use it to commit rather than keep searching.',
    lagnaInterpretation:
      'Mrigashira Lagna gives a fine, sensitive appearance and an eternal quality '
      + 'of the seeker. You move gracefully through life but struggle to land. '
      + 'Allowing yourself to be fully found — by a place, a person, a calling — '
      + 'is the great gift awaiting you.',
    compatibleNakshatras: ['chitra', 'dhanishtha', 'revati'],
    incompatibleNakshatras: ['ardra', 'jyeshtha'],
  },
  {
    key: 'ardra',
    number: 6,
    name: 'Ardra',
    nameHindi: 'आर्द्रा',
    ruler: 'rahu',
    deity: 'Rudra (lord of storms)',
    symbol: 'Teardrop or diamond',
    startDeg: 66.67,
    endDeg: 80,
    nature: 'manava',
    gana: 'manava',
    gender: 'female',
    caste: 'Butcher',
    animal: 'Female dog',
    brief: 'Storms of transformation, brilliance, and raw power.',
    standard:
      'Ardra is ruled by Rahu and presided over by Rudra — the fierce, storm-bringing '
      + 'form of Shiva. It represents the power of the mind at its most intense and '
      + 'penetrating. Ardra natives often experience dramatic life events that forge '
      + 'exceptional intelligence and emotional depth.',
    moonInterpretation:
      'Moon in Ardra brings emotional intensity, intellectual brilliance, and a '
      + 'capacity to be profoundly moved by ideas, art, and suffering. '
      + 'Rahu Mahadasha (18 years) is transformative — worldly ambition peaks here; '
      + 'use the energy for genuine contribution, not obsessive accumulation.',
    lagnaInterpretation:
      'Ardra Lagna gives a sharp, penetrating gaze and an ability to see through '
      + 'to the heart of complex problems. Great intellectual gifts require an '
      + 'equally great commitment to emotional regulation.',
    compatibleNakshatras: ['punarvasu', 'swati', 'shatabhisha'],
    incompatibleNakshatras: ['rohini', 'mrigashira'],
  },
  {
    key: 'punarvasu',
    number: 7,
    name: 'Punarvasu',
    nameHindi: 'पुनर्वसु',
    ruler: 'jupiter',
    deity: 'Aditi (mother of the gods)',
    symbol: 'Quiver of arrows or a house',
    startDeg: 80,
    endDeg: 93.33,
    nature: 'deva',
    gana: 'deva',
    gender: 'male',
    caste: 'Vaishya',
    animal: 'Female cat',
    brief: 'Renewal, return of light, and generous wisdom.',
    standard:
      'Punarvasu — "return of the light" — is ruled by Jupiter and presided over '
      + 'by Aditi, the boundless mother. It carries the energy of renewal and the '
      + 'wisdom to return to what is essential after periods of darkness or excess. '
      + 'Punarvasu natives are generous, philosophical, and deeply resilient.',
    moonInterpretation:
      'Moon in Punarvasu brings a generous heart, philosophical outlook, and '
      + 'the remarkable capacity to find joy again after hardship. '
      + 'Jupiter Mahadasha (16 years) is your most expansive period — allow '
      + 'faith, learning, and generosity to guide every decision.',
    lagnaInterpretation:
      'Punarvasu Lagna gives an open, optimistic personality and a natural '
      + 'teaching ability. You are a source of light and renewal for those around you. '
      + 'Guard against spreading yourself too thin.',
    compatibleNakshatras: ['ashwini', 'swati', 'hasta'],
    incompatibleNakshatras: ['vishakha', 'anuradha'],
  },
  {
    key: 'pushya',
    number: 8,
    name: 'Pushya',
    nameHindi: 'पुष्य',
    ruler: 'saturn',
    deity: 'Brihaspati (Jupiter / divine teacher)',
    symbol: 'Flower, circle, or arrow',
    startDeg: 93.33,
    endDeg: 106.67,
    nature: 'deva',
    gana: 'deva',
    gender: 'male',
    caste: 'Kshatriya',
    animal: 'Male sheep / goat',
    brief: 'The most auspicious nakshatra — nourishment, wisdom, and dharmic prosperity.',
    standard:
      'Pushya is considered the most auspicious of all 27 nakshatras. Ruled by Saturn '
      + 'and presided over by Brihaspati, it combines discipline with wisdom and material '
      + 'nourishment with spiritual sustenance. Starting a business, buying property, '
      + 'or beginning any important endeavour on Pushya nakshatra is considered highly '
      + 'auspicious across all Vedic traditions.',
    moonInterpretation:
      'Moon in Pushya is one of the most blessed natal placements — the most '
      + 'nourishing combination in Jyotish. You carry a natural wisdom and '
      + 'the ability to genuinely sustain and nourish others. Saturn Mahadasha '
      + '(19 years) rewards your disciplined efforts with lasting achievement.',
    lagnaInterpretation:
      'Pushya Lagna gives a nourishing, dignified personality and an instinct '
      + 'for building sustainable structures in every area of life. '
      + 'You are a natural counsellor and provider.',
    compatibleNakshatras: ['rohini', 'revati', 'ashwini'],
    incompatibleNakshatras: ['magha', 'purva_phalguni'],
  },
  {
    key: 'ashlesha',
    number: 9,
    name: 'Ashlesha',
    nameHindi: 'आश्लेषा',
    ruler: 'mercury',
    deity: 'Nagas (serpent deities)',
    symbol: 'Coiled serpent',
    startDeg: 106.67,
    endDeg: 120,
    nature: 'rakshasa',
    gana: 'rakshasa',
    gender: 'female',
    caste: 'Mleccha',
    animal: 'Male cat',
    brief: 'Kundalini energy, penetrating intelligence, and serpentine wisdom.',
    standard:
      'Ashlesha is ruled by Mercury and carries the energy of the coiled serpent — '
      + 'the Kundalini force that either poisons or heals depending on its direction. '
      + 'Ashlesha natives have penetrating perceptions, natural psychological insight, '
      + 'and the ability to see through deception. This nakshatra demands total honesty '
      + 'from its natives — the serpent turns on those who misuse it.',
    moonInterpretation:
      'Moon in Ashlesha brings emotional intensity, sharp intuition, and a '
      + 'somewhat solitary inner world. Mercury Mahadasha (17 years) activates '
      + 'your exceptional intelligence — direct it toward genuine service and '
      + 'knowledge rather than psychological power over others.',
    lagnaInterpretation:
      'Ashlesha Lagna gives hypnotic eyes, a serpentine grace, and an '
      + 'ability to sense what others cannot. Your greatest power is your '
      + 'perceptive intelligence — and your greatest responsibility is using it ethically.',
    compatibleNakshatras: ['punarvasu', 'pushya'],
    incompatibleNakshatras: ['ashwini', 'magha'],
  },
  {
    key: 'magha',
    number: 10,
    name: 'Magha',
    nameHindi: 'मघा',
    ruler: 'ketu',
    deity: 'Pitrs (ancestral spirits)',
    symbol: 'Royal throne room or palanquin',
    startDeg: 120,
    endDeg: 133.33,
    nature: 'rakshasa',
    gana: 'rakshasa',
    gender: 'female',
    caste: 'Shudra',
    animal: 'Male rat',
    brief: 'Royal authority, ancestral power, and the weight of legacy.',
    standard:
      'Magha is ruled by Ketu and presided over by the Pitrs — the ancestral '
      + 'spirits who govern lineage, legacy, and the karmic inheritance of family. '
      + 'It is the nakshatra of thrones, tradition, and authority. Magha natives '
      + 'carry a regal bearing and a deep responsibility to honour the ancestors '
      + 'while forging their own path.',
    moonInterpretation:
      'Moon in Magha brings a natural command, deep ancestral roots, and a '
      + 'strong sense of destiny. Performing Pitru Tarpan (ancestral rites) '
      + 'is particularly beneficial for this nakshatra. Ketu Mahadasha brings '
      + 'a reckoning with ancestral karma — face it with honour.',
    lagnaInterpretation:
      'Magha Lagna gives a commanding presence, pride in lineage, and an '
      + 'instinctive expectation of respect. The shadow is arrogance — '
      + 'true royalty serves its people.',
    compatibleNakshatras: ['purva_phalguni', 'uttara_phalguni', 'pushya'],
    incompatibleNakshatras: ['ashlesha', 'jyeshtha'],
  },
  {
    key: 'purva_phalguni',
    number: 11,
    name: 'Purva Phalguni',
    nameHindi: 'पूर्व फाल्गुनी',
    ruler: 'venus',
    deity: 'Bhaga (god of marital bliss and fortune)',
    symbol: 'Front legs of a bed or hammock',
    startDeg: 133.33,
    endDeg: 146.67,
    nature: 'manava',
    gana: 'manava',
    gender: 'female',
    caste: 'Brahmin',
    animal: 'Female rat',
    brief: 'Creative enjoyment, romance, and the pleasures of rest.',
    standard:
      'Purva Phalguni is ruled by Venus and presided over by Bhaga, the god of '
      + 'marital happiness. It represents the afternoon of life — the enjoyment of '
      + 'creative success, romantic partnership, and the pleasures that come after '
      + 'sustained effort. This nakshatra governs performance, the arts, and every '
      + 'form of joyful human expression.',
    moonInterpretation:
      'Moon in Purva Phalguni brings a warm, generous, pleasure-loving nature. '
      + 'You are naturally creative and deeply romantic. Venus Mahadasha (20 years) '
      + 'is your great period of enjoyment — receive its gifts graciously '
      + 'and share them generously.',
    lagnaInterpretation:
      'Purva Phalguni Lagna gives natural charm, artistic talent, and a '
      + 'magnetism that draws people effortlessly. You are here to create beauty '
      + 'and experience joy — and to remind others that pleasure is sacred.',
    compatibleNakshatras: ['uttara_phalguni', 'magha', 'rohini'],
    incompatibleNakshatras: ['pushya', 'ashlesha'],
  },
  {
    key: 'uttara_phalguni',
    number: 12,
    name: 'Uttara Phalguni',
    nameHindi: 'उत्तर फाल्गुनी',
    ruler: 'sun',
    deity: 'Aryaman (god of contracts and patronage)',
    symbol: 'Back legs of a bed',
    startDeg: 146.67,
    endDeg: 160,
    nature: 'manava',
    gana: 'manava',
    gender: 'female',
    caste: 'Kshatriya',
    animal: 'Cow',
    brief: 'Patronage, generous service, and commitment in relationships.',
    standard:
      'Uttara Phalguni is ruled by the Sun and presided over by Aryaman, the god '
      + 'of patronage, contracts, and social bonds. Where Purva Phalguni enjoys, '
      + 'Uttara Phalguni commits. It governs marriage contracts, corporate life, '
      + 'and the dignified generosity of one who has received and now gives back.',
    moonInterpretation:
      'Moon in Uttara Phalguni brings a generous, socially graceful, and '
      + 'commitment-oriented emotional nature. You need partnerships and social '
      + 'structures to feel fully yourself. Sun Mahadasha activates your leadership '
      + 'and public recognition.',
    lagnaInterpretation:
      'Uttara Phalguni Lagna gives a bright, sunny face, a dignified bearing, '
      + 'and an instinct for being in the right social circles. You are a natural '
      + 'patron — both in giving and in receiving support.',
    compatibleNakshatras: ['hasta', 'krittika', 'purva_phalguni'],
    incompatibleNakshatras: ['vishakha', 'anuradha'],
  },
  {
    key: 'hasta',
    number: 13,
    name: 'Hasta',
    nameHindi: 'हस्त',
    ruler: 'moon',
    deity: 'Savitar (the Sun as creative force)',
    symbol: 'Open hand',
    startDeg: 160,
    endDeg: 173.33,
    nature: 'deva',
    gana: 'deva',
    gender: 'male',
    caste: 'Vaishya',
    animal: 'Female buffalo',
    brief: 'Skillful hands, resourcefulness, and the gift of manifestation.',
    standard:
      'Hasta is ruled by the Moon and presided over by Savitar, the creative '
      + 'Sun. The open hand is its symbol — Hasta governs manual skill, craft, '
      + 'healing arts, and the ability to manifest ideas into tangible reality. '
      + 'Hasta natives have gifted hands — literal or metaphorical.',
    moonInterpretation:
      'Moon in Hasta brings exceptional manual dexterity, a clever and '
      + 'resourceful mind, and a quick, adaptive emotional style. '
      + 'Moon Mahadasha activates your healing and crafting gifts — '
      + 'engage them fully.',
    lagnaInterpretation:
      'Hasta Lagna gives skilled hands, a neat and precise appearance, '
      + 'and an instinctive understanding of how things work at the practical level. '
      + 'You are a natural healer, craftsperson, or artisan.',
    compatibleNakshatras: ['uttara_phalguni', 'punarvasu', 'ashwini'],
    incompatibleNakshatras: ['mula', 'purva_ashadha'],
  },
  {
    key: 'chitra',
    number: 14,
    name: 'Chitra',
    nameHindi: 'चित्रा',
    ruler: 'mars',
    deity: 'Vishvakarma (divine architect)',
    symbol: 'Bright jewel or pearl',
    startDeg: 173.33,
    endDeg: 186.67,
    nature: 'rakshasa',
    gana: 'rakshasa',
    gender: 'female',
    caste: 'Farmer',
    animal: 'Female tiger',
    brief: 'Brilliant artistry, technical mastery, and magnetic appearance.',
    standard:
      'Chitra is ruled by Mars and presided over by Vishvakarma, the architect '
      + 'of the gods. It is the nakshatra of beauty and technical brilliance — '
      + 'the bright jewel that catches the light. Chitra natives have exceptional '
      + 'aesthetic taste, technical skill, and a natural magnetism that draws '
      + 'the eyes of others.',
    moonInterpretation:
      'Moon in Chitra brings a striking appearance, artistic drive, and '
      + 'a restless creative energy. Mars Mahadasha is your high-achievement '
      + 'period — channel the energy into creating something truly beautiful '
      + 'and lasting.',
    lagnaInterpretation:
      'Chitra Lagna gives luminous eyes, a striking appearance, and an '
      + 'extraordinary eye for design, pattern, and beauty. You are compelled '
      + 'to create — and what you create is meant to be seen.',
    compatibleNakshatras: ['mrigashira', 'vishakha', 'dhanishtha'],
    incompatibleNakshatras: ['hasta', 'purva_phalguni'],
  },
  {
    key: 'swati',
    number: 15,
    name: 'Swati',
    nameHindi: 'स्वाति',
    ruler: 'rahu',
    deity: 'Vayu (wind god)',
    symbol: 'Young sprout swaying in the wind',
    startDeg: 186.67,
    endDeg: 200,
    nature: 'deva',
    gana: 'deva',
    gender: 'female',
    caste: 'Butcher',
    animal: 'Male buffalo',
    brief: 'Independence, trade, and the power of adaptability.',
    standard:
      'Swati is ruled by Rahu and presided over by Vayu, the wind. Like the young '
      + 'shoot that bends without breaking, Swati embodies adaptability, independence, '
      + 'and the commercial instinct. Swati natives thrive in trade, diplomacy, and '
      + 'any field requiring the ability to move freely between worlds.',
    moonInterpretation:
      'Moon in Swati brings emotional independence, a talent for negotiation, '
      + 'and a genuine ability to stay centred amid the winds of change. '
      + 'Rahu Mahadasha calls you to expand beyond your comfort zone — '
      + 'the wind is always pushing you toward new horizons.',
    lagnaInterpretation:
      'Swati Lagna gives an independent, graceful personality with a natural '
      + 'gift for diplomacy and trade. You move easily between different social '
      + 'worlds and are most alive when given freedom to roam.',
    compatibleNakshatras: ['ardra', 'punarvasu', 'shatabhisha'],
    incompatibleNakshatras: ['ashlesha', 'krittika'],
  },
  {
    key: 'vishakha',
    number: 16,
    name: 'Vishakha',
    nameHindi: 'विशाखा',
    ruler: 'jupiter',
    deity: 'Indra and Agni (king of gods and fire)',
    symbol: 'Triumphal arch or potter\'s wheel',
    startDeg: 200,
    endDeg: 213.33,
    nature: 'rakshasa',
    gana: 'rakshasa',
    gender: 'female',
    caste: 'Mleccha',
    animal: 'Male tiger',
    brief: 'Driven ambition, the will to achieve, and spiritual devotion.',
    standard:
      'Vishakha is ruled by Jupiter and presided over by Indra and Agni together — '
      + 'the combination of divine sovereignty and purifying fire. It is the nakshatra '
      + 'of the determined achiever who will not stop until the goal is reached. '
      + 'Vishakha natives are extraordinarily goal-oriented and capable of remarkable '
      + 'discipline in pursuit of what they want.',
    moonInterpretation:
      'Moon in Vishakha brings intense ambition, the capacity for sustained '
      + 'effort, and a powerful need to achieve. Jupiter Mahadasha brings '
      + 'the philosophical wisdom to know which goals are truly worth pursuing.',
    lagnaInterpretation:
      'Vishakha Lagna gives a driven, magnetic personality with clear goals '
      + 'and the willpower to reach them. The shadow is single-mindedness '
      + 'that excludes everything — and everyone — not on the path.',
    compatibleNakshatras: ['chitra', 'anuradha', 'jyeshtha'],
    incompatibleNakshatras: ['punarvasu', 'uttara_phalguni'],
  },
  {
    key: 'anuradha',
    number: 17,
    name: 'Anuradha',
    nameHindi: 'अनुराधा',
    ruler: 'saturn',
    deity: 'Mitra (god of friendship and contracts)',
    symbol: 'Lotus flower or staff',
    startDeg: 213.33,
    endDeg: 226.67,
    nature: 'deva',
    gana: 'deva',
    gender: 'female',
    caste: 'Shudra',
    animal: 'Female deer / hare',
    brief: 'Deep friendship, organisational mastery, and spiritual persistence.',
    standard:
      'Anuradha is ruled by Saturn and presided over by Mitra, the Vedic god of '
      + 'friendship and mutual cooperation. It combines Saturn\'s discipline with '
      + 'a remarkable capacity for deep, loyal friendship. Anuradha natives excel '
      + 'in organisations, spiritual communities, and any field requiring sustained '
      + 'collaboration toward a shared vision.',
    moonInterpretation:
      'Moon in Anuradha brings deep loyalty, organisational talent, and an '
      + 'unwillingness to abandon those they love. Saturn Mahadasha rewards your '
      + 'disciplined service — the harvest is proportional to the decades of '
      + 'honest effort.',
    lagnaInterpretation:
      'Anuradha Lagna gives a dignified, quietly powerful presence and '
      + 'a natural ability to lead through connection rather than command. '
      + 'You build lasting alliances wherever you go.',
    compatibleNakshatras: ['vishakha', 'jyeshtha', 'mula'],
    incompatibleNakshatras: ['rohini', 'purva_phalguni'],
  },
  {
    key: 'jyeshtha',
    number: 18,
    name: 'Jyeshtha',
    nameHindi: 'ज्येष्ठा',
    ruler: 'mercury',
    deity: 'Indra (king of the gods)',
    symbol: 'Circular amulet / umbrella / earring',
    startDeg: 226.67,
    endDeg: 240,
    nature: 'rakshasa',
    gana: 'rakshasa',
    gender: 'female',
    caste: 'Farmer',
    animal: 'Male deer / hare',
    brief: 'The eldest — authority, protection, and the weight of responsibility.',
    standard:
      'Jyeshtha — "the eldest" — is ruled by Mercury and presided over by Indra. '
      + 'It carries the energy of the first-born: the one who bears the family\'s '
      + 'burdens and receives its honours. Jyeshtha natives are protective leaders '
      + 'who often carry more than their fair share, and who can be deeply '
      + 'misunderstood.',
    moonInterpretation:
      'Moon in Jyeshtha brings a powerful, protective nature and a tendency '
      + 'to carry the emotional weight of everyone around you. Mercury Mahadasha '
      + 'activates your intellectual gifts — communicate your burdens as well as '
      + 'your brilliance.',
    lagnaInterpretation:
      'Jyeshtha Lagna gives a commanding, serious presence and an instinctive '
      + 'assumption of responsibility. You are the one others turn to in a crisis — '
      + 'ensure you also allow others to care for you.',
    compatibleNakshatras: ['anuradha', 'vishakha', 'purva_ashadha'],
    incompatibleNakshatras: ['ashwini', 'rohini'],
  },
  {
    key: 'mula',
    number: 19,
    name: 'Mula',
    nameHindi: 'मूल',
    ruler: 'ketu',
    deity: 'Nirriti (goddess of destruction and chaos)',
    symbol: 'Tied bunch of roots',
    startDeg: 240,
    endDeg: 253.33,
    nature: 'rakshasa',
    gana: 'rakshasa',
    gender: 'neutral',
    caste: 'Butcher',
    animal: 'Male dog',
    brief: 'Root-level transformation, uprooting, and the search for the ultimate truth.',
    standard:
      'Mula — "root" — is ruled by Ketu and presided over by Nirriti, the goddess '
      + 'of dissolution. It represents the uprooting of all that is superficial '
      + 'to reveal the root cause of things. Mula natives are natural investigators '
      + 'and destroyers of illusion — they reach to the very bottom of every matter '
      + 'and are profoundly changed by what they find.',
    moonInterpretation:
      'Moon in Mula brings a searching, sometimes turbulent inner life and '
      + 'an instinct to question everything at its foundation. Ketu Mahadasha '
      + 'is a period of profound spiritual searching — the roots must go deeper '
      + 'before the tree can grow taller.',
    lagnaInterpretation:
      'Mula Lagna gives a penetrating intelligence, a powerful aura, and '
      + 'a tendency to disrupt and transform whatever environment you enter. '
      + 'Your dharma is root-level change — in yourself and in the world.',
    compatibleNakshatras: ['anuradha', 'purva_ashadha', 'uttara_ashadha'],
    incompatibleNakshatras: ['hasta', 'purva_phalguni'],
  },
  {
    key: 'purva_ashadha',
    number: 20,
    name: 'Purva Ashadha',
    nameHindi: 'पूर्व आषाढ़ा',
    ruler: 'venus',
    deity: 'Apas (water deity)',
    symbol: 'Fan or winnowing basket',
    startDeg: 253.33,
    endDeg: 266.67,
    nature: 'manava',
    gana: 'manava',
    gender: 'female',
    caste: 'Brahmin',
    animal: 'Male monkey',
    brief: 'The undefeated — invincible will and the purifying power of water.',
    standard:
      'Purva Ashadha — "the early victory" — is ruled by Venus and presided over '
      + 'by Apas, the water deity. Like water that finds its way past every obstacle, '
      + 'Purva Ashadha natives are invincible in their perseverance. They carry an '
      + 'unwavering conviction in their own path and rarely accept defeat.',
    moonInterpretation:
      'Moon in Purva Ashadha brings an emotionally indomitable spirit, '
      + 'a purifying energy, and a strong philosophical outlook. Venus Mahadasha '
      + 'flows with beauty and material abundance — allow yourself to receive.',
    lagnaInterpretation:
      'Purva Ashadha Lagna gives a water-like quality — always finding a way, '
      + 'always purifying, never truly stopped. Your greatest gift is '
      + 'the unshakeable belief in your own path.',
    compatibleNakshatras: ['mula', 'uttara_ashadha', 'jyeshtha'],
    incompatibleNakshatras: ['hasta', 'rohini'],
  },
  {
    key: 'uttara_ashadha',
    number: 21,
    name: 'Uttara Ashadha',
    nameHindi: 'उत्तर आषाढ़ा',
    ruler: 'sun',
    deity: 'Vishvedevas (universal deities)',
    symbol: 'Elephant tusk or small bed',
    startDeg: 266.67,
    endDeg: 280,
    nature: 'manava',
    gana: 'manava',
    gender: 'female',
    caste: 'Kshatriya',
    animal: 'Male mongoose',
    brief: 'Universal victory, final achievement, and enduring dharma.',
    standard:
      'Uttara Ashadha — "the final victory" — is ruled by the Sun and presided over '
      + 'by the Vishvedevas, the universal assembly of divine powers. It represents '
      + 'the culminating achievement of sustained righteousness — the moment when '
      + 'dharmic effort finally produces its lasting fruit. Uttara Ashadha natives '
      + 'are respected, principled, and capable of achievements that outlast them.',
    moonInterpretation:
      'Moon in Uttara Ashadha brings a dignified, principled emotional nature '
      + 'and an instinct for dharmic action. Sun Mahadasha brings recognition '
      + 'and authority — your leadership emerges now.',
    lagnaInterpretation:
      'Uttara Ashadha Lagna gives a broad forehead, an air of natural authority, '
      + 'and the patient determination to outlast every obstacle. '
      + 'You are built to leave a lasting mark.',
    compatibleNakshatras: ['purva_ashadha', 'shravana', 'mula'],
    incompatibleNakshatras: ['krittika', 'ardra'],
  },
  {
    key: 'shravana',
    number: 22,
    name: 'Shravana',
    nameHindi: 'श्रवण',
    ruler: 'moon',
    deity: 'Vishnu (the preserver)',
    symbol: 'Three footprints or an ear',
    startDeg: 280,
    endDeg: 293.33,
    nature: 'deva',
    gana: 'deva',
    gender: 'male',
    caste: 'Mleccha',
    animal: 'Female monkey',
    brief: 'Deep listening, learning, and the preservation of sacred knowledge.',
    standard:
      'Shravana — "the listener" — is ruled by the Moon and presided over by Vishnu. '
      + 'It is the nakshatra of learning through listening, of preservation of wisdom, '
      + 'and of connection to the divine through sound and mantra. Shravana natives '
      + 'have exceptional listening skills, strong memories, and a deep reverence for '
      + 'tradition and sacred knowledge.',
    moonInterpretation:
      'Moon in Shravana — the Moon\'s own nakshatra territory — brings a '
      + 'deeply receptive, empathic, and learned nature. You carry knowledge '
      + 'across lifetimes. Moon Mahadasha brings emotional richness and '
      + 'the opportunity to share what you know.',
    lagnaInterpretation:
      'Shravana Lagna gives large, attentive ears (often literally), a '
      + 'reverent manner, and an extraordinary capacity to learn and transmit '
      + 'knowledge. You are a guardian of tradition.',
    compatibleNakshatras: ['uttara_ashadha', 'dhanishtha', 'revati'],
    incompatibleNakshatras: ['ardra', 'ashlesha'],
  },
  {
    key: 'dhanishtha',
    number: 23,
    name: 'Dhanishtha',
    nameHindi: 'धनिष्ठा',
    ruler: 'mars',
    deity: 'Ashta Vasus (8 deities of abundance)',
    symbol: 'Drum (mridanga)',
    startDeg: 293.33,
    endDeg: 306.67,
    nature: 'rakshasa',
    gana: 'rakshasa',
    gender: 'female',
    caste: 'Farmer',
    animal: 'Female lion',
    brief: 'Wealth, rhythm, and the music of material success.',
    standard:
      'Dhanishtha — "the wealthy one" — is ruled by Mars and presided over by '
      + 'the eight Vasus, the deities of earthly abundance. Its symbol is the drum '
      + '— Dhanishtha natives are attuned to rhythm: of music, of markets, and of '
      + 'the cycles of prosperity. They are natural musicians, entrepreneurs, and '
      + 'wealth-builders.',
    moonInterpretation:
      'Moon in Dhanishtha brings a rhythmic, musically gifted, and materially '
      + 'ambitious nature. Mars Mahadasha is your peak-action period — '
      + 'channel the drive into wealth-building and creative achievement.',
    lagnaInterpretation:
      'Dhanishtha Lagna gives an energetic, musically sensitive nature and '
      + 'an instinct for finding opportunity in any environment. You are '
      + 'drawn to rhythm, wealth, and the pleasure of material mastery.',
    compatibleNakshatras: ['chitra', 'mrigashira', 'shravana'],
    incompatibleNakshatras: ['purva_bhadrapada', 'uttara_bhadrapada'],
  },
  {
    key: 'shatabhisha',
    number: 24,
    name: 'Shatabhisha',
    nameHindi: 'शतभिषा',
    ruler: 'rahu',
    deity: 'Varuna (god of cosmic law and healing)',
    symbol: 'Empty circle or a thousand physicians',
    startDeg: 306.67,
    endDeg: 320,
    nature: 'rakshasa',
    gana: 'rakshasa',
    gender: 'neutral',
    caste: 'Butcher',
    animal: 'Female horse',
    brief: 'Healing mysteries, solitude, and the hidden order of the cosmos.',
    standard:
      'Shatabhisha — "one hundred healers" — is ruled by Rahu and presided over '
      + 'by Varuna, the god of cosmic law. It represents hidden healing powers, '
      + 'solitary research, and the ability to penetrate the mysteries of the '
      + 'universe. Shatabhisha natives are often drawn to medicine, astrology, '
      + 'technology, or any field that requires lone investigation of hidden systems.',
    moonInterpretation:
      'Moon in Shatabhisha brings a deeply introspective, research-oriented '
      + 'nature and powerful healing gifts. Rahu Mahadasha is your period of '
      + 'maximum worldly reach — use it to share your discoveries with the world.',
    lagnaInterpretation:
      'Shatabhisha Lagna gives a mysterious, intensely independent personality '
      + 'and an affinity for science, healing, and the hidden workings of things. '
      + 'Solitude is not loneliness for you — it is necessary.',
    compatibleNakshatras: ['ardra', 'swati', 'ashwini'],
    incompatibleNakshatras: ['magha', 'purva_phalguni'],
  },
  {
    key: 'purva_bhadrapada',
    number: 25,
    name: 'Purva Bhadrapada',
    nameHindi: 'पूर्व भाद्रपद',
    ruler: 'jupiter',
    deity: 'Aja Ekapada (one-footed unborn)',
    symbol: 'Sword or front of a funeral cot',
    startDeg: 320,
    endDeg: 333.33,
    nature: 'manava',
    gana: 'manava',
    gender: 'male',
    caste: 'Brahmin',
    animal: 'Male lion',
    brief: 'Fiery wisdom, spiritual intensity, and the courage of two faces.',
    standard:
      'Purva Bhadrapada is ruled by Jupiter and presided over by Aja Ekapada, a '
      + 'powerful Vedic deity associated with transformative lightning. It carries '
      + 'both the fire of spiritual aspiration and the intensity of the extremes — '
      + 'Purva Bhadrapada natives can be both profoundly idealistic and capable of '
      + 'ruthless action in service of their vision.',
    moonInterpretation:
      'Moon in Purva Bhadrapada brings a passionate, idealistic, and '
      + 'intensely spiritual nature. Jupiter Mahadasha is your period of '
      + 'maximum philosophical and spiritual growth.',
    lagnaInterpretation:
      'Purva Bhadrapada Lagna gives a tall, distinguished bearing and a '
      + 'powerful inner spiritual life. You move between worlds — the philosophical '
      + 'and the intense, the visionary and the dark.',
    compatibleNakshatras: ['uttara_bhadrapada', 'revati', 'vishakha'],
    incompatibleNakshatras: ['dhanishtha', 'shatabhisha'],
  },
  {
    key: 'uttara_bhadrapada',
    number: 26,
    name: 'Uttara Bhadrapada',
    nameHindi: 'उत्तर भाद्रपद',
    ruler: 'saturn',
    deity: 'Ahir Budhnya (serpent of the deep)',
    symbol: 'Back of a funeral cot or twin snakes',
    startDeg: 333.33,
    endDeg: 346.67,
    nature: 'manava',
    gana: 'manava',
    gender: 'male',
    caste: 'Kshatriya',
    animal: 'Cow',
    brief: 'Deep wisdom, compassion, and the waters of the unconscious.',
    standard:
      'Uttara Bhadrapada is ruled by Saturn and presided over by Ahir Budhnya, '
      + 'the serpent of the cosmic deep. It carries the quiet wisdom of one who '
      + 'has seen everything and chosen compassion. Uttara Bhadrapada natives '
      + 'are deeply wise, patient beyond ordinary limits, and capable of '
      + 'extraordinary spiritual depth.',
    moonInterpretation:
      'Moon in Uttara Bhadrapada brings profound wisdom, boundless compassion, '
      + 'and a life lived close to the mysteries of the deep. Saturn Mahadasha '
      + 'rewards your patient service with enduring achievement.',
    lagnaInterpretation:
      'Uttara Bhadrapada Lagna gives a calm, deep, ocean-like quality — still '
      + 'on the surface, fathomlessly deep beneath. You are a natural sage.',
    compatibleNakshatras: ['purva_bhadrapada', 'revati', 'anuradha'],
    incompatibleNakshatras: ['dhanishtha', 'ashwini'],
  },
  {
    key: 'revati',
    number: 27,
    name: 'Revati',
    nameHindi: 'रेवती',
    ruler: 'mercury',
    deity: 'Pushan (nourisher and protector of travellers)',
    symbol: 'Fish or drum',
    startDeg: 346.67,
    endDeg: 360,
    nature: 'deva',
    gana: 'deva',
    gender: 'female',
    caste: 'Shudra',
    animal: 'Female elephant',
    brief: 'The final step — nourishment, protection, and the journey\'s end.',
    standard:
      'Revati is ruled by Mercury and presided over by Pushan, the nourisher '
      + 'and guardian of travellers on the final path. As the last nakshatra, '
      + 'it carries the accumulated wisdom of the entire zodiac. Revati natives '
      + 'are compassionate guides, naturally protective, and gifted with an '
      + 'otherworldly quality that others find profoundly comforting.',
    moonInterpretation:
      'Moon in Revati brings a tender, universally compassionate nature and '
      + 'a rare ability to hold space for others\' pain without being destroyed '
      + 'by it. Mercury Mahadasha activates your gift for communication and '
      + 'guidance.',
    lagnaInterpretation:
      'Revati Lagna gives a luminous, otherworldly quality — you are often '
      + 'described as having arrived from somewhere else. Your dharma is to '
      + 'guide others across their thresholds.',
    compatibleNakshatras: ['rohini', 'bharani', 'shravana'],
    incompatibleNakshatras: ['ashlesha', 'mula'],
  },
];

/** Look up a nakshatra by its key */
export const getNakshatra = (key: string): NakshatraContent | undefined =>
  NAKSHATRAS.find(n => n.key === key);

/** Look up a nakshatra by its 1-based number */
export const getNakshatraByNumber = (n: number): NakshatraContent | undefined =>
  NAKSHATRAS.find(nak => nak.number === n);

/** Look up a nakshatra by sidereal degree (0–360) */
export const getNakshatraByDegree = (deg: number): NakshatraContent | undefined => {
  const normalized = ((deg % 360) + 360) % 360;
  return NAKSHATRAS.find(n => normalized >= n.startDeg && normalized < n.endDeg);
};
