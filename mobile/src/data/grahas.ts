/**
 * Graha (Planet) Content Library - 9 Vedic planets
 * Edit text fields here to change what users read. No component changes needed.
 */

import type { GrahaContent } from './types';

export const GRAHAS: GrahaContent[] = [
    {
        key: 'sun',
        name: 'Sun',
        nameHindi: '\u0938\u0942\u0930\u094D\u092F',
        glyph: '\u2609',
        nature: 'malefic',
        karakas: ['soul', 'father', 'authority', 'vitality', 'government', 'ego'],
        interpretation: {
            brief: 'The Sun represents your soul, vitality, and core sense of self.',
            standard: 'The Sun is the king of the planetary cabinet, governing your ego, willpower, and life force. A well-placed Sun bestows leadership, confidence, and recognition from authority.',
            deep: 'As the Atmakaraka of the natural zodiac, Surya illuminates your dharma and life purpose. He governs the father, government dealings, and health of the heart and eyes. In Jyotish, the Sun\'s dignity by house, sign, and aspect reveals how confidently you express your soul\'s intent. A strong Sun gives charisma and integrity; an afflicted Sun can bring ego conflicts, health issues, and troubled relations with father figures.',
        },
        whenStrong: 'You carry natural authority and charisma. Leadership roles, government recognition, and vitality come easily.',
        whenAfflicted: 'You may struggle with ego conflicts, lack of confidence, eye or heart ailments, and difficult relations with authority figures.',
    },
    {
        key: 'moon',
        name: 'Moon',
        nameHindi: '\u091A\u0902\u0926\u094D\u0930',
        glyph: '\u263D',
        nature: 'benefic',
        karakas: ['mind', 'mother', 'emotions', 'comfort', 'nurturing', 'public'],
        interpretation: {
            brief: 'The Moon governs your mind, emotions, and inner sense of comfort.',
            standard: 'Chandra is the queen of the planetary cabinet, ruling your emotional landscape, mental peace, and connection with the mother. The Moon sign (Rashi) is the primary identity marker in Vedic astrology.',
            deep: 'The Moon is the most important graha in Jyotish because the Moon sign determines your Dasha sequence, Nakshatra, and emotional constitution. A strong Moon gives mental stability, popularity, and nurturing capacity. The Moon governs bodily fluids, the chest, and the left eye. Her waxing and waning phases directly influence your mental energy.',
        },
        whenStrong: 'Your mind is calm and receptive. You enjoy emotional stability, public popularity, and a supportive relationship with your mother.',
        whenAfflicted: 'You may experience anxiety, mood swings, sleep disturbances, and emotional turbulence. Relations with mother or public image may suffer.',
    },
    {
        key: 'mars',
        name: 'Mars',
        nameHindi: '\u092E\u0902\u0917\u0932',
        glyph: '\u2642',
        nature: 'malefic',
        karakas: ['courage', 'energy', 'siblings', 'property', 'surgery', 'conflict'],
        interpretation: {
            brief: 'Mars represents your courage, physical energy, and competitive drive.',
            standard: 'Mangal is the commander-in-chief, governing your assertiveness, courage, and physical vitality. He rules property, siblings, and all forms of action and conflict.',
            deep: 'Mars is the planet of action and desire. In Jyotish, a well-placed Mars bestows physical strength, courage, technical skills, and property ownership. He governs the blood, muscles, and adrenal system. Mars in angular houses (particularly the 10th) gives executive ability and career drive. However, Mars in the 1st, 4th, 7th, 8th, or 12th house creates Mangal Dosha, which can affect married life unless mitigated by specific planetary conditions.',
        },
        whenStrong: 'You are decisive, physically energetic, and courageous. Property acquisition and technical pursuits are favoured.',
        whenAfflicted: 'You may face anger management issues, accidents, blood-related disorders, and conflicts in relationships. Mangal Dosha may affect marriage.',
    },
    {
        key: 'mercury',
        name: 'Mercury',
        nameHindi: '\u092C\u0941\u0927',
        glyph: '\u263F',
        nature: 'neutral',
        karakas: ['intellect', 'communication', 'commerce', 'education', 'writing', 'calculation'],
        interpretation: {
            brief: 'Mercury governs your intellect, communication skills, and analytical ability.',
            standard: 'Budha is the prince of the planetary cabinet, ruling speech, commerce, education, and all intellectual pursuits. He is a natural benefic when associated with benefics, and a malefic when conjunct malefics.',
            deep: 'Mercury is the planet of intelligence and adaptability. He governs accounting, writing, mathematics, and all forms of trade. In Jyotish, Mercury\'s placement reveals your communication style, business acumen, and educational path. A strong Mercury gives eloquence, analytical sharpness, and success in commerce or technology. Mercury rules the nervous system, skin, and respiratory functions. His frequent retrogrades can disrupt communications and travel plans.',
        },
        whenStrong: 'Your communication is precise and persuasive. Business, education, and intellectual pursuits flourish.',
        whenAfflicted: 'You may struggle with speech difficulties, nervousness, skin disorders, or poor decision-making in financial matters.',
    },
    {
        key: 'jupiter',
        name: 'Jupiter',
        nameHindi: '\u092C\u0943\u0939\u0938\u094D\u092A\u0924\u093F',
        glyph: '\u2643',
        nature: 'benefic',
        karakas: ['wisdom', 'dharma', 'guru', 'children', 'fortune', 'expansion'],
        interpretation: {
            brief: 'Jupiter represents wisdom, fortune, and your connection to dharma.',
            standard: 'Guru is the minister of the planetary cabinet, governing wisdom, righteousness, children, and all forms of expansion and abundance. He is the greatest natural benefic in Jyotish.',
            deep: 'Jupiter is the divine teacher and greatest benefic. His placement reveals your spiritual inclination, ethical compass, and capacity for abundance. Jupiter governs higher education, philosophy, law, and religious institutions. A well-placed Jupiter brings financial growth, wise counsel, healthy children, and protection from adversity. He rules the liver, fat tissues, and the hips. Jupiter\'s aspect (5th, 7th, 9th from himself) bestows grace on the houses he influences.',
        },
        whenStrong: 'You attract good fortune, wise mentorship, and spiritual growth. Children, wealth, and dharmic pursuits are blessed.',
        whenAfflicted: 'You may experience financial setbacks, difficulties with children, liver ailments, or ethical confusion.',
    },
    {
        key: 'venus',
        name: 'Venus',
        nameHindi: '\u0936\u0941\u0915\u094D\u0930',
        glyph: '\u2640',
        nature: 'benefic',
        karakas: ['love', 'beauty', 'luxury', 'marriage', 'creativity', 'comfort'],
        interpretation: {
            brief: 'Venus governs love, beauty, marriage, and all forms of artistic expression.',
            standard: 'Shukra is the minister of the Asuras, ruling romance, marriage, luxury, arts, and material comforts. He is a strong natural benefic and the karaka of the 7th house.',
            deep: 'Venus is the planet of desire, aesthetic refinement, and relational harmony. In Jyotish, Venus\'s placement reveals your love language, artistic talents, and capacity to enjoy life\'s luxuries. He governs the reproductive system, kidneys, and facial beauty. A strong Venus brings a harmonious marriage, artistic talent, financial comfort, and social grace. Venus is especially important for male charts as the significator of wife, and for all charts as the significator of material pleasure.',
        },
        whenStrong: 'Love life flourishes, artistic talents are recognised, and you enjoy material comforts and social popularity.',
        whenAfflicted: 'You may face relationship heartbreak, overspending on luxuries, reproductive issues, or diabetes-related conditions.',
    },
    {
        key: 'saturn',
        name: 'Saturn',
        nameHindi: '\u0936\u0928\u093F',
        glyph: '\u2644',
        nature: 'malefic',
        karakas: ['discipline', 'karma', 'longevity', 'duty', 'hardship', 'service'],
        interpretation: {
            brief: 'Saturn represents karma, discipline, and the lessons learned through hardship.',
            standard: 'Shani is the servant of the planetary cabinet, governing duty, discipline, longevity, and the karmic lessons of life. He delays but does not deny; his rewards come after sustained effort.',
            deep: 'Saturn is the great teacher through adversity. In Jyotish, Saturn\'s placement reveals where you must work hardest and longest to earn your rewards. He governs the bones, joints, teeth, and nervous system. Saturn\'s 7.5-year transit over the natal Moon (Sade Sati) is the most significant transit cycle, bringing restructuring of life foundations. A well-placed Saturn gives extraordinary discipline, longevity, success in service-oriented careers, and spiritual depth gained through life experience.',
        },
        whenStrong: 'You possess remarkable discipline and endurance. Success comes through consistent effort, and longevity is favoured.',
        whenAfflicted: 'You may face chronic delays, joint or bone ailments, depression, and karmic debts that demand patient resolution.',
    },
    {
        key: 'rahu',
        name: 'Rahu',
        nameHindi: '\u0930\u093E\u0939\u0941',
        glyph: '\u260A',
        nature: 'malefic',
        karakas: ['obsession', 'illusion', 'foreign', 'technology', 'ambition', 'unconventional'],
        interpretation: {
            brief: 'Rahu represents worldly desires, obsessions, and unconventional paths.',
            standard: 'Rahu is the shadow planet (Chaya Graha), the north lunar node. He amplifies desires, creates illusions, and drives you toward foreign or unconventional experiences. Rahu in a sign behaves like Saturn with added intensity.',
            deep: 'Rahu is the cosmic amplifier; whatever he touches, he magnifies beyond proportion. In Jyotish, Rahu represents your unfulfilled karmic desires from past lives that demand satisfaction in this incarnation. He governs foreign connections, technology, sudden gains, and unconventional lifestyles. Rahu\'s placement reveals where you are driven by insatiable ambition. A well-placed Rahu gives success in foreign lands, technology, politics, and the entertainment industry. An afflicted Rahu brings confusion, addiction, and ethical compromises.',
        },
        whenStrong: 'You excel in technology, foreign connections, and unconventional pursuits. Sudden gains and worldly success are possible.',
        whenAfflicted: 'You may struggle with obsessive tendencies, confusion, substance issues, and an inability to find contentment despite material gains.',
    },
    {
        key: 'ketu',
        name: 'Ketu',
        nameHindi: '\u0915\u0947\u0924\u0941',
        glyph: '\u260B',
        nature: 'malefic',
        karakas: ['liberation', 'detachment', 'spirituality', 'past life', 'mysticism', 'loss'],
        interpretation: {
            brief: 'Ketu represents spiritual liberation, detachment, and past-life wisdom.',
            standard: 'Ketu is the south lunar node and the moksha karaka, the significator of spiritual liberation. He strips away worldly attachments to reveal inner truth. Ketu in a sign behaves like Mars with spiritual intensity.',
            deep: 'Ketu is the headless body; he gives intuition without logic, perception without words. In Jyotish, Ketu\'s placement reveals the area of life where you carry mastery from past lives but have little interest in pursuing further. He governs spiritual practices, occult sciences, and sudden events of loss that ultimately lead to spiritual growth. A well-placed Ketu bestows deep intuition, healing abilities, and spiritual advancement. An afflicted Ketu brings mysterious illnesses, unexpected losses, and difficulty relating to the material world.',
        },
        whenStrong: 'You possess deep intuition, spiritual gifts, and the ability to detach from worldly drama. Healing and mystical pursuits are favoured.',
        whenAfflicted: 'You may experience sudden losses, mysterious health issues, isolation, and difficulty engaging with worldly responsibilities.',
    },
];

/** Lookup a graha by key */
export function getGrahaContent(key: string): GrahaContent | undefined {
    return GRAHAS.find((g) => g.key === key.toLowerCase());
}
