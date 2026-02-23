/**
 * Dasha Content Library — 9 Mahadasha lords
 * Edit text fields here to change what users read.
 */

import type { DashaContent } from './types';

export const DASHAS: DashaContent[] = [
    {
        key: 'sun', lord: 'Sun', lordHindi: 'सूर्य', durationYears: 6,
        periodTheme: 'Authority, recognition, and self-realisation',
        positive: 'Career advancement, government favour, leadership opportunities, improved vitality and confidence.',
        challenging: 'Ego conflicts with authority, eye or heart strain, strained relations with father, overwork.',
        divination: {
            brief: 'Surya Dasha brings focus on authority, career, and self-expression.',
            standard: 'During the 6-year Surya Mahadasha, your life centres on leadership, recognition, and alignment with your dharma. Government dealings, father relations, and career authority reach a peak.',
            deep: 'The Sun Mahadasha is a period of royal authority and self-realisation. For 6 years, Surya illuminates your ego, career, and public standing. If the natal Sun is strong (exalted, own sign, or angular), this period brings government recognition, career peaks, and robust health. If afflicted, expect ego clashes with superiors, vision problems, or father-related difficulties. The Antardasha lord colours each sub-period — Jupiter or Venus Antar within Sun Maha is especially auspicious for career and finance.',
        },
        spiritualPractice: 'Offer water to the rising Sun daily. Chant the Aditya Hridayam or Gayatri Mantra at sunrise.',
    },
    {
        key: 'moon', lord: 'Moon', lordHindi: 'चंद्र', durationYears: 10,
        periodTheme: 'Emotions, comfort, public life, and nurturing',
        positive: 'Mental peace, popularity, domestic happiness, travel, connection with mother, creative inspiration.',
        challenging: 'Emotional turbulence, sleep disorders, fluid retention, over-attachment, moodiness.',
        divination: {
            brief: 'Chandra Dasha brings focus on emotions, public life, and domestic peace.',
            standard: 'The 10-year Chandra Mahadasha centres your life on emotional fulfilment, domestic harmony, and public perception. This is often a period of travel, creative expression, and deepening family bonds.',
            deep: 'The Moon Mahadasha is a decade of emotional growth and public engagement. Chandra governs your mind, mother, and connection with the masses. If the natal Moon is strong (waxing, in Cancer or Taurus, or well-aspected by Jupiter), this period brings mental peace, popularity, and nurturing relationships. A weak or afflicted Moon brings anxiety, mood instability, and domestic discord. Pay close attention to the Moon\'s Nakshatra — it colours the entire 10-year experience.',
        },
        spiritualPractice: 'Wear a pearl or moonstone. Chant "Om Chandraya Namah" 108 times on Mondays. Offer milk to Shiva Linga.',
    },
    {
        key: 'mars', lord: 'Mars', lordHindi: 'मंगल', durationYears: 7,
        periodTheme: 'Action, property, courage, and conflict',
        positive: 'Property acquisition, physical vitality, surgical success, competitive victories, sibling support.',
        challenging: 'Accidents, anger issues, blood disorders, legal disputes, marital conflicts.',
        divination: {
            brief: 'Mangal Dasha brings action, property matters, and competitive energy.',
            standard: 'The 7-year Mangal Mahadasha is a period of intense action and physical energy. Property deals, competitive pursuits, and matters related to siblings come to the forefront.',
            deep: 'The Mars Mahadasha is a warrior\'s period — 7 years of action, courage, and potential conflict. Mangal drives you to assert yourself, acquire property, and engage in competitive pursuits. A strong Mars (exalted in Capricorn, in own sign Aries or Scorpio, or in angular houses) brings property ownership, surgical precision, and decisive leadership. An afflicted Mars brings accidents, blood disorders, legal battles, and anger-driven mistakes. Physical exercise and martial discipline channel Mars\'s energy constructively.',
        },
        spiritualPractice: 'Donate red lentils on Tuesdays. Chant Hanuman Chalisa daily. Wear a red coral after consultation.',
    },
    {
        key: 'rahu', lord: 'Rahu', lordHindi: 'राहु', durationYears: 18,
        periodTheme: 'Worldly ambition, foreign connections, and unconventional paths',
        positive: 'Sudden gains, foreign opportunities, technological success, political advancement, fame.',
        challenging: 'Confusion, addictions, ethical compromises, health mysteries, relationship deceptions.',
        divination: {
            brief: 'Rahu Dasha brings intense worldly ambition and unconventional opportunities.',
            standard: 'The 18-year Rahu Mahadasha is the longest and most transformative period. Rahu amplifies worldly desires, bringing foreign connections, technological opportunities, and unconventional life paths.',
            deep: 'The Rahu Mahadasha is an 18-year journey through the material world\'s most intense desires. Rahu\'s nature is to amplify — whatever he touches becomes an obsession. If well-placed (in the 3rd, 6th, 10th, or 11th house, or in Taurus or Gemini), this period brings extraordinary worldly success, foreign travel, technological innovation, and political power. If afflicted, expect confusion about life direction, health mysteries, addictive tendencies, and ethical dilemmas. The Antardasha sequence is crucial — Rahu-Jupiter and Rahu-Venus sub-periods are generally more balanced.',
        },
        spiritualPractice: 'Chant the Rahu Beej Mantra "Om Bhram Bhreem Bhroum Sah Rahave Namah". Donate dark blue cloth on Saturdays.',
    },
    {
        key: 'jupiter', lord: 'Jupiter', lordHindi: 'बृहस्पति', durationYears: 16,
        periodTheme: 'Wisdom, expansion, fortune, and dharmic growth',
        positive: 'Financial abundance, spiritual growth, children, guru blessing, academic success, legal victories.',
        challenging: 'Over-expansion, weight gain, liver issues, excessive optimism leading to poor judgement.',
        divination: {
            brief: 'Guru Dasha brings wisdom, fortune, and spiritual expansion.',
            standard: 'The 16-year Guru Mahadasha is widely regarded as the most auspicious period. Jupiter expands everything he touches — wealth, wisdom, family, and spiritual understanding.',
            deep: 'The Jupiter Mahadasha is 16 years of growth, expansion, and dharmic alignment. Guru is the greatest benefic — his period typically brings financial improvement, academic success, spiritual awakening, and the birth of children. If Jupiter is strong (in Cancer, Sagittarius, or Pisces, or in Kendra/Trikona houses), this is the golden period of life. Even a moderately placed Jupiter brings some blessings. An afflicted Jupiter (debilitated in Capricorn, combust, or in dusthana houses) can bring financial overextension, liver problems, and misguided faith. The key is to channel Jupiter\'s expansion into wisdom rather than mere accumulation.',
        },
        spiritualPractice: 'Worship at a Vishnu temple on Thursdays. Chant "Om Guruve Namah" 108 times. Wear yellow sapphire after consultation.',
    },
    {
        key: 'saturn', lord: 'Saturn', lordHindi: 'शनि', durationYears: 19,
        periodTheme: 'Discipline, karma, restructuring, and endurance',
        positive: 'Career stability through hard work, property through perseverance, spiritual maturity, longevity.',
        challenging: 'Chronic delays, joint pain, depression, karmic debts, isolation, heavy responsibilities.',
        divination: {
            brief: 'Shani Dasha brings karmic lessons, discipline, and delayed but lasting rewards.',
            standard: 'The 19-year Shani Mahadasha is the great restructuring period. Saturn strips away what is not earned and rewards sustained effort. This period demands patience, discipline, and acceptance of karmic responsibility.',
            deep: 'The Saturn Mahadasha is 19 years of karmic reckoning and disciplined construction. Shani does not give gifts — he gives wages for work done. If Saturn is strong (exalted in Libra, in Aquarius or Capricorn, or in upachaya houses 3/6/10/11), this period brings career stability, institutional respect, and wealth earned through persistent effort. If afflicted, expect chronic delays, health issues involving bones and joints, and heavy karmic lessons. The saving grace of Saturn Dasha is that its rewards are permanent — what you build under Saturn\'s discipline lasts a lifetime.',
        },
        spiritualPractice: 'Light a sesame oil lamp on Saturdays. Chant Shani Stotram. Feed black dogs and crows. Donate black sesame seeds.',
    },
    {
        key: 'mercury', lord: 'Mercury', lordHindi: 'बुध', durationYears: 17,
        periodTheme: 'Intellect, commerce, communication, and learning',
        positive: 'Business success, educational achievement, writing and publishing, networking, analytical clarity.',
        challenging: 'Nervous disorders, skin problems, indecisiveness, speech difficulties, financial miscalculations.',
        divination: {
            brief: 'Budha Dasha brings intellectual sharpness, business opportunities, and communication breakthroughs.',
            standard: 'The 17-year Budha Mahadasha centres your life on intellectual pursuits, commerce, and communication. This is an excellent period for education, business ventures, and skills development.',
            deep: 'The Mercury Mahadasha is 17 years of intellectual activity and commercial engagement. Budha sharpens your mind, tongue, and pen. If Mercury is strong (exalted in Virgo, in own sign Gemini, or aspected by Jupiter), this period brings business expansion, educational achievement, and mastery of communication arts. Mercury\'s adaptable nature means the Antardasha lords significantly colour each sub-period. Mercury-Jupiter brings wisdom in commerce; Mercury-Venus brings artistic communication; Mercury-Saturn brings systematic, enduring intellectual work.',
        },
        spiritualPractice: 'Chant "Om Budhaya Namah" 108 times on Wednesdays. Wear an emerald after consultation. Donate green items.',
    },
    {
        key: 'ketu', lord: 'Ketu', lordHindi: 'केतु', durationYears: 7,
        periodTheme: 'Spiritual awakening, detachment, and past-life resolution',
        positive: 'Spiritual breakthrough, intuitive development, liberation from attachments, healing abilities.',
        challenging: 'Sudden losses, mysterious illnesses, identity confusion, isolation, paranormal experiences.',
        divination: {
            brief: 'Ketu Dasha brings spiritual awakening and detachment from material pursuits.',
            standard: 'The 7-year Ketu Mahadasha strips away worldly attachments to reveal spiritual truth. This is a period of profound inner transformation, past-life resolution, and potential moksha.',
            deep: 'The Ketu Mahadasha is 7 years of spiritual dissolution and inner revelation. Ketu is the moksha karaka — he seeks liberation by removing what you no longer need. If Ketu is well-placed (in the 3rd, 6th, 9th, or 12th house, or in Scorpio or Sagittarius), this period brings spiritual awakening, intuitive powers, and liberation from toxic attachments. If afflicted, expect sudden losses, mysterious health conditions, and a sense of purposelessness. The key is surrender — Ketu rewards those who release their grip on material certainty.',
        },
        spiritualPractice: 'Chant "Om Ketave Namah" or Ganesha mantras. Donate multi-coloured blankets. Practise meditation and mindfulness.',
    },
    {
        key: 'venus', lord: 'Venus', lordHindi: 'शुक्र', durationYears: 20,
        periodTheme: 'Love, luxury, creativity, and material enjoyment',
        positive: 'Marriage, artistic success, financial prosperity, vehicle or property, romantic fulfilment, beauty.',
        challenging: 'Overindulgence, relationship turmoil, reproductive issues, diabetes, overspending.',
        divination: {
            brief: 'Shukra Dasha brings love, luxury, and creative flourishing.',
            standard: 'The 20-year Shukra Mahadasha is the longest Venus-ruled period, centring life on relationships, art, and material comforts. This is typically a period of marriage, creative peak, and financial prosperity.',
            deep: 'The Venus Mahadasha is 20 years of beauty, pleasure, and relational fulfilment. Shukra governs love, marriage, art, luxury, and all forms of sensory enjoyment. If Venus is strong (exalted in Pisces, in the 4th or 7th house, or aspected by Jupiter), this period brings a harmonious marriage, artistic recognition, financial abundance, and the acquisition of vehicles and comfort. If afflicted, expect relationship heartbreak, reproductive challenges, diabetes risks, and financial loss through overindulgence. The Venus Dasha is where your karma in love and beauty plays out most fully.',
        },
        spiritualPractice: 'Worship Lakshmi on Fridays. Chant "Om Shukraya Namah" 108 times. Donate white items and sweets.',
    },
];

/** Lookup Dasha content by graha key */
export function getDashaContent(key: string): DashaContent | undefined {
    return DASHAS.find((d) => d.key === key.toLowerCase());
}
