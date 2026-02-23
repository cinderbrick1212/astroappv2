/**
 * Rashi (Zodiac Sign) Content Library — 12 Vedic signs
 * Edit text fields here to change what users read.
 */

import type { RashiContent } from './types';

export const RASHIS: RashiContent[] = [
    {
        key: 'aries', index: 0, name: 'Aries', nameHindi: 'मेष',
        element: 'fire', quality: 'cardinal', ruler: 'mars', bodyPart: 'Head and face',
        lagnaInterpretation: {
            brief: 'Mesha Lagna gives a bold, pioneering personality driven by action.',
            standard: 'With Aries rising, you lead with courage and initiative. Mars as your Lagna lord gives physical energy, competitive spirit, and a desire to be first. You are direct in speech and action.',
            deep: 'Mesha Lagna natives are born leaders who thrive on challenge and action. Mars ruling your ascendant gives exceptional physical vitality, courage, and a warrior-like temperament. You are most fulfilled when pioneering new ventures. Your challenge lies in patience — learning to sustain momentum after the initial burst of enthusiasm. The head and face are your sensitive areas health-wise. Your Lagna lord Mars\'s house placement is the single most important factor in your chart.',
    },
        rashiInterpretation: {
            brief: 'Aries energy brings initiative, courage, and a desire to lead.',
            standard: 'Planets in Mesha express themselves with directness, energy, and pioneering spirit. This is a sign of action, not contemplation. The fire element gives enthusiasm and spontaneity.',
            deep: 'Mesha is the first sign of the zodiac — the spark of creation. Planets here are imbued with Mars\'s drive, competitive edge, and desire for independence. The cardinal fire quality makes this a sign of initiation and bold action. Planets in Aries express themselves with raw honesty and immediacy. The challenge is tempering impulsiveness with strategic thinking.',
        },
    },
    {
        key: 'taurus', index: 1, name: 'Taurus', nameHindi: 'वृषभ',
        element: 'earth', quality: 'fixed', ruler: 'venus', bodyPart: 'Throat, neck, and face',
        lagnaInterpretation: {
            brief: 'Vrishabha Lagna gives a steady, comfort-loving personality with artistic taste.',
            standard: 'With Taurus rising, Venus as your Lagna lord bestows beauty, sensuality, and a deep need for material security. You value stability, luxury, and the finer things in life.',
            deep: 'Vrishabha Lagna natives seek to build lasting foundations of comfort and beauty. Venus ruling your ascendant gives artistic sensibility, a pleasant voice, and appreciation for luxury. You are patient, determined, and sometimes stubborn in pursuit of your goals. Financial security is a core life theme. The throat and neck are your sensitive areas. Your deliberate pace is actually your strength — you build things that last.',
        },
        rashiInterpretation: {
            brief: 'Taurus energy brings stability, sensuality, and material focus.',
            standard: 'Planets in Vrishabha express themselves with patience, determination, and a love of comfort. This fixed earth sign favours accumulation, artistry, and steadfast loyalty.',
            deep: 'Vrishabha is the sign of accumulation and sustenance. Planets here take on Venus\'s love of beauty, comfort, and material security. The fixed earth quality gives remarkable persistence but can also manifest as stubbornness. Planets in Taurus express themselves slowly but with great depth and staying power.',
        },
    },
    {
        key: 'gemini', index: 2, name: 'Gemini', nameHindi: 'मिथुन',
        element: 'air', quality: 'mutable', ruler: 'mercury', bodyPart: 'Shoulders, arms, and lungs',
        lagnaInterpretation: {
            brief: 'Mithuna Lagna gives a curious, communicative personality with versatile interests.',
            standard: 'With Gemini rising, Mercury as your Lagna lord gives quick wit, excellent communication skills, and a restless intellect. You thrive on variety and intellectual stimulation.',
            deep: 'Mithuna Lagna natives are the communicators and connectors of the zodiac. Mercury ruling your ascendant gives exceptional verbal ability, analytical thinking, and adaptability. You are naturally curious and attracted to diverse fields of knowledge. Your challenge is depth — learning to focus your scattered brilliance on one pursuit long enough to master it. The shoulders, arms, and respiratory system are your sensitive areas.',
        },
        rashiInterpretation: {
            brief: 'Gemini energy brings curiosity, communication, and intellectual agility.',
            standard: 'Planets in Mithuna express themselves through words, ideas, and social connection. This mutable air sign favours adaptability, learning, and networking.',
            deep: 'Mithuna is the sign of duality and communication. Planets here take on Mercury\'s quicksilver quality — fast-moving, multi-faceted, and intellectually hungry. The mutable air quality gives excellent adaptability but can scatter energy across too many pursuits.',
        },
    },
    {
        key: 'cancer', index: 3, name: 'Cancer', nameHindi: 'कर्क',
        element: 'water', quality: 'cardinal', ruler: 'moon', bodyPart: 'Chest and stomach',
        lagnaInterpretation: {
            brief: 'Karka Lagna gives a nurturing, emotionally sensitive personality with strong intuition.',
            standard: 'With Cancer rising, the Moon as your Lagna lord makes your emotional state the centre of your experience. You are deeply intuitive, protective of loved ones, and drawn to creating a secure home environment.',
            deep: 'Karka Lagna natives are the nurturers and protectors of the zodiac. The Moon ruling your ascendant makes you extraordinarily sensitive to emotional undercurrents. Your moods wax and wane with the lunar cycle. You have a powerful memory, deep attachment to family and homeland, and remarkable intuition. The chest, stomach, and breasts are your sensitive areas. Your greatest strength is your capacity to create emotional security for others.',
        },
        rashiInterpretation: {
            brief: 'Cancer energy brings emotional depth, nurturing instincts, and protective loyalty.',
            standard: 'Planets in Karka express themselves through feelings, intuition, and caregiving. This cardinal water sign favours emotional connections, domestic pursuits, and protective instincts.',
            deep: 'Karka is the sign of the mother and the home. Planets here take on the Moon\'s reflective, nurturing quality. The cardinal water nature gives initiative in emotional and domestic matters. Planets in Cancer are deeply affected by their emotional environment.',
        },
    },
    {
        key: 'leo', index: 4, name: 'Leo', nameHindi: 'सिंह',
        element: 'fire', quality: 'fixed', ruler: 'sun', bodyPart: 'Heart and spine',
        lagnaInterpretation: {
            brief: 'Simha Lagna gives a confident, creative personality with natural authority.',
            standard: 'With Leo rising, the Sun as your Lagna lord bestows dignity, charisma, and a desire for recognition. You naturally assume leadership and shine in positions of authority.',
            deep: 'Simha Lagna natives carry the Sun\'s radiance — you are meant to be seen, recognised, and respected. The Sun ruling your ascendant gives creative power, generosity, and a strong sense of dharma. You thrive when leading and inspiring others. The heart and spine are your sensitive areas. Your challenge is balancing justified confidence with humility.',
        },
        rashiInterpretation: {
            brief: 'Leo energy brings creativity, authority, and generous self-expression.',
            standard: 'Planets in Simha express themselves with confidence, drama, and creative flair. This fixed fire sign favours leadership, creative pursuits, and generous self-expression.',
            deep: 'Simha is the sign of the king. Planets here take on the Sun\'s dignified, authoritative quality. The fixed fire nature gives sustained creative power and unwavering self-belief. Planets in Leo demand recognition and express themselves with dramatic flair.',
        },
    },
    {
        key: 'virgo', index: 5, name: 'Virgo', nameHindi: 'कन्या',
        element: 'earth', quality: 'mutable', ruler: 'mercury', bodyPart: 'Intestines and digestive system',
        lagnaInterpretation: {
            brief: 'Kanya Lagna gives an analytical, service-oriented personality with attention to detail.',
            standard: 'With Virgo rising, Mercury as your Lagna lord gives sharp analytical ability, perfectionism, and a natural inclination toward service and healing. You have an eye for detail others miss.',
            deep: 'Kanya Lagna natives are the analysts and healers of the zodiac. Mercury ruling your ascendant in an earth sign gives practical intelligence, discriminating ability, and a service-oriented nature. You excel at organising, healing, and improving systems. The digestive system is your sensitive area. Your challenge is releasing perfectionism and accepting that \'good enough\' has its own wisdom.',
        },
        rashiInterpretation: {
            brief: 'Virgo energy brings analytical precision, service orientation, and practical wisdom.',
            standard: 'Planets in Kanya express themselves through analysis, service, and practical application. This mutable earth sign favours healing, craftsmanship, and meticulous attention to detail.',
            deep: 'Kanya is the sign of the healer and the analyst. Planets here take on Mercury\'s discriminating, detail-oriented quality applied to practical earth matters. The mutable earth nature gives adaptability in service and remarkable craftsmanship.',
        },
    },
    {
        key: 'libra', index: 6, name: 'Libra', nameHindi: 'तुला',
        element: 'air', quality: 'cardinal', ruler: 'venus', bodyPart: 'Kidneys and lower back',
        lagnaInterpretation: {
            brief: 'Tula Lagna gives a diplomatic, harmony-seeking personality with aesthetic sensibility.',
            standard: 'With Libra rising, Venus as your Lagna lord bestows charm, diplomatic skill, and a deep need for partnership and balance. You naturally see all sides of every situation.',
            deep: 'Tula Lagna natives are the diplomats and aesthetes of the zodiac. Venus ruling your ascendant in an air sign gives intellectual refinement, social grace, and a passion for justice and beauty. You achieve your best work in partnership. The kidneys and lower back are your sensitive areas. Your challenge is decisiveness — your ability to see all perspectives can become paralysing indecision.',
        },
        rashiInterpretation: {
            brief: 'Libra energy brings balance, partnership, and aesthetic harmony.',
            standard: 'Planets in Tula express themselves through relationships, diplomacy, and artistic sensibility. This cardinal air sign favours partnership, negotiation, and aesthetic pursuits.',
            deep: 'Tula is the sign of the scales — balance, justice, and partnership. Planets here take on Venus\'s refined, relational quality expressed through the air element. The cardinal air nature gives initiative in partnerships and social endeavours.',
        },
    },
    {
        key: 'scorpio', index: 7, name: 'Scorpio', nameHindi: 'वृश्चिक',
        element: 'water', quality: 'fixed', ruler: 'mars', bodyPart: 'Reproductive organs and pelvis',
        lagnaInterpretation: {
            brief: 'Vrishchika Lagna gives an intense, transformative personality with deep emotional power.',
            standard: 'With Scorpio rising, Mars as your Lagna lord in a water sign gives emotional intensity, investigative ability, and a transformative life path. You experience life at profound depth.',
            deep: 'Vrishchika Lagna natives are the transformers of the zodiac. Mars ruling your ascendant in fixed water gives relentless emotional intensity, an investigative mind, and the ability to rise from any adversity. You are drawn to mysteries, hidden knowledge, and the taboo. The reproductive organs and pelvis are your sensitive areas. Your greatest power is your capacity for complete reinvention.',
        },
        rashiInterpretation: {
            brief: 'Scorpio energy brings intensity, transformation, and emotional depth.',
            standard: 'Planets in Vrishchika express themselves with passionate intensity and transformative power. This fixed water sign favours research, investigation, and profound emotional experiences.',
            deep: 'Vrishchika is the sign of death and rebirth. Planets here take on Mars\'s warrior quality applied to the emotional water element. The fixed water nature gives relentless emotional depth and the power to transform completely through crisis.',
        },
    },
    {
        key: 'sagittarius', index: 8, name: 'Sagittarius', nameHindi: 'धनु',
        element: 'fire', quality: 'mutable', ruler: 'jupiter', bodyPart: 'Hips and thighs',
        lagnaInterpretation: {
            brief: 'Dhanu Lagna gives an optimistic, philosophical personality with a love of learning.',
            standard: 'With Sagittarius rising, Jupiter as your Lagna lord bestows optimism, wisdom, and an expansive worldview. You are a natural teacher and seeker of higher truth.',
            deep: 'Dhanu Lagna natives are the seekers and teachers of the zodiac. Jupiter ruling your ascendant gives philosophical depth, ethical conviction, and an insatiable hunger for higher knowledge. You thrive in academic, legal, or spiritual environments. The hips and thighs are your sensitive areas. Your challenge is grounding your lofty ideals in practical action.',
        },
        rashiInterpretation: {
            brief: 'Sagittarius energy brings optimism, wisdom, and philosophical exploration.',
            standard: 'Planets in Dhanu express themselves through philosophy, teaching, and adventurous exploration. This mutable fire sign favours higher learning, travel, and dharmic pursuits.',
            deep: 'Dhanu is the sign of the archer — aiming for higher truth. Planets here take on Jupiter\'s expansive, wisdom-seeking quality expressed through fire\'s enthusiasm. The mutable fire nature gives adaptability in pursuit of higher knowledge.',
        },
    },
    {
        key: 'capricorn', index: 9, name: 'Capricorn', nameHindi: 'मकर',
        element: 'earth', quality: 'cardinal', ruler: 'saturn', bodyPart: 'Knees and bones',
        lagnaInterpretation: {
            brief: 'Makara Lagna gives a disciplined, ambitious personality with strong endurance.',
            standard: 'With Capricorn rising, Saturn as your Lagna lord gives discipline, patience, and a pragmatic approach to ambition. You climb slowly and steadily toward your goals.',
            deep: 'Makara Lagna natives are the builders and strategists of the zodiac. Saturn ruling your ascendant gives remarkable discipline, patience, and the ability to endure hardship for long-term rewards. You are most fulfilled when building lasting structures — whether in career, institutions, or legacy. The knees and skeletal system are your sensitive areas. Your life typically improves with age as Saturn rewards sustained effort.',
        },
        rashiInterpretation: {
            brief: 'Capricorn energy brings discipline, ambition, and practical achievement.',
            standard: 'Planets in Makara express themselves through structure, discipline, and long-term strategy. This cardinal earth sign favours career building, institutional authority, and patient accumulation.',
            deep: 'Makara is the sign of the mountain goat — steady, upward, and relentless. Planets here take on Saturn\'s disciplined, karmic quality expressed through earth\'s practicality. The cardinal earth nature gives initiative in building lasting material foundations.',
        },
    },
    {
        key: 'aquarius', index: 10, name: 'Aquarius', nameHindi: 'कुंभ',
        element: 'air', quality: 'fixed', ruler: 'saturn', bodyPart: 'Ankles and circulation',
        lagnaInterpretation: {
            brief: 'Kumbha Lagna gives a progressive, humanitarian personality with innovative thinking.',
            standard: 'With Aquarius rising, Saturn as your Lagna lord in an air sign gives intellectual independence, progressive ideals, and a commitment to social causes. You think differently from the crowd.',
            deep: 'Kumbha Lagna natives are the innovators and humanitarians of the zodiac. Saturn ruling your ascendant in fixed air gives intellectual discipline applied to progressive ideas. You are drawn to technology, social reform, and community building. The ankles and circulatory system are your sensitive areas. You often feel ahead of your time — your ideas gain acceptance only later.',
        },
        rashiInterpretation: {
            brief: 'Aquarius energy brings innovation, humanitarianism, and intellectual independence.',
            standard: 'Planets in Kumbha express themselves through progressive ideas, social consciousness, and unconventional thinking. This fixed air sign favours technology, community service, and intellectual freedom.',
            deep: 'Kumbha is the sign of the water-bearer — pouring knowledge for the collective. Planets here take on Saturn\'s structured quality applied to air\'s intellectual realm. The fixed air nature gives persistence in social and intellectual pursuits.',
        },
    },
    {
        key: 'pisces', index: 11, name: 'Pisces', nameHindi: 'मीन',
        element: 'water', quality: 'mutable', ruler: 'jupiter', bodyPart: 'Feet and lymphatic system',
        lagnaInterpretation: {
            brief: 'Meena Lagna gives a compassionate, intuitive personality with spiritual depth.',
            standard: 'With Pisces rising, Jupiter as your Lagna lord in a water sign gives deep compassion, spiritual sensitivity, and a naturally devotional temperament. You absorb the emotions of those around you.',
            deep: 'Meena Lagna natives are the mystics and healers of the zodiac. Jupiter ruling your ascendant in mutable water gives boundless compassion, artistic vision, and an intuitive connection to the divine. You are most fulfilled when serving others or pursuing creative and spiritual paths. The feet and lymphatic system are your sensitive areas. Your challenge is establishing boundaries to prevent emotional overwhelm.',
        },
        rashiInterpretation: {
            brief: 'Pisces energy brings compassion, intuition, and spiritual transcendence.',
            standard: 'Planets in Meena express themselves through compassion, imagination, and spiritual seeking. This mutable water sign favours artistic expression, healing, and transcendence of material boundaries.',
            deep: 'Meena is the last sign — the ocean of consciousness. Planets here take on Jupiter\'s wisdom applied to water\'s emotional depth. The mutable water nature gives extraordinary empathy and spiritual receptivity, but can dissolve personal boundaries.',
        },
    },
];

/** Lookup a rashi by key */
export function getRashiContent(key: string): RashiContent | undefined {
    return RASHIS.find((r) => r.key === key.toLowerCase());
}

/** Lookup a rashi by index (0–11) */
export function getRashiByIndex(index: number): RashiContent | undefined {
    return RASHIS.find((r) => r.index === index);
}
