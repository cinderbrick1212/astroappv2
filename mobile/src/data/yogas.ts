/**
 * Yoga Content Library — Rajayogas + Doshas
 * Edit text fields here to change what users read.
 */

import type { YogaContent } from './types';

export const YOGAS: YogaContent[] = [
    // ── Benefic Yogas ──────────────────────────────────────────────────────────
    {
        key: 'gajakesari', name: 'Gajakesari Yoga', nameHindi: 'गजकेसरी योग',
        quality: 'benefic',
        formingCondition: 'Jupiter in a kendra (1st, 4th, 7th, 10th) from Moon.',
        description: {
            brief: 'Confers wisdom, wealth, and lasting fame.',
            standard: 'Gajakesari Yoga forms when Jupiter is angular from the Moon. It bestows intelligence, prosperity, and a reputation that endures beyond your lifetime.',
            deep: 'Gajakesari means "elephant-lion" — a combination of strength and wisdom. When Jupiter occupies a kendra from the Moon, your mind (Moon) is constantly supported by divine wisdom (Jupiter). This creates a person of sound judgement, generous spirit, and natural authority. The yoga is strongest when both Jupiter and Moon are in their own or exalted signs. You attract opportunities through your reputation and earn lasting respect from society.',
        },
        divination: 'You are destined for positions that require both wisdom and strength. Financial stability comes through knowledge and good judgement.',
    },
    {
        key: 'budhaditya', name: 'Budhaditya Yoga', nameHindi: 'बुधादित्य योग',
        quality: 'benefic',
        formingCondition: 'Sun and Mercury conjunct in the same house.',
        description: {
            brief: 'Confers sharp intellect and eloquent communication.',
            standard: 'Budhaditya Yoga forms when Sun and Mercury occupy the same sign. It gives analytical intelligence, persuasive speech, and success in intellectual and governmental pursuits.',
            deep: 'Budhaditya combines the Sun\'s authority with Mercury\'s intelligence. This is one of the most common yogas, but its strength varies greatly depending on the sign and house. The yoga is most powerful when both planets are strong by sign (Sun exalted in Aries, Mercury in Virgo) and the conjunction occurs in kendras or trikonas. It gives talent in administration, writing, accounting, and academic fields.',
        },
        divination: 'Your intelligence is your greatest asset. Success comes through analysis, communication, and aligning your intellect with authoritative roles.',
    },
    {
        key: 'chandra_mangala', name: 'Chandra-Mangala Yoga', nameHindi: 'चंद्र-मंगल योग',
        quality: 'benefic',
        formingCondition: 'Moon and Mars conjunct or in mutual aspect.',
        description: {
            brief: 'Confers financial prosperity through courage and enterprise.',
            standard: 'Chandra-Mangala Yoga forms when Moon and Mars combine through conjunction or aspect. It gives financial success through bold enterprise, especially in property and business.',
            deep: 'When the emotional nature (Moon) combines with martial energy (Mars), the result is a person who acts decisively on their instincts. This yoga gives courage to take financial risks that pay off, especially in real estate, construction, and entrepreneurial ventures. The combination can also create emotional intensity that needs healthy outlets.',
        },
        divination: 'Financial success comes through bold action and emotional conviction. Property and business ventures are favoured during active Dasha periods.',
    },
    {
        key: 'hamsa', name: 'Hamsa Yoga', nameHindi: 'हंस योग',
        quality: 'benefic',
        formingCondition: 'Jupiter in own sign (Sagittarius/Pisces) or exaltation (Cancer) in a kendra.',
        description: {
            brief: 'One of the Pancha Mahapurusha Yogas — confers righteousness and spiritual stature.',
            standard: 'Hamsa Yoga forms when Jupiter occupies a kendra in his own or exalted sign. It creates a person of high moral character, spiritual depth, and respected social standing.',
            deep: 'Hamsa (swan) Yoga is the most elevated of the five Mahapurusha Yogas. The swan symbolises the ability to separate truth from falsehood, as the mythical hamsa separates milk from water. You are drawn to philosophy, religion, law, and education. Your moral compass is naturally calibrated, and people trust your judgement instinctively.',
        },
        divination: 'You are destined for a life of meaning, moral authority, and spiritual growth. Teaching, counselling, and judicial roles are especially favoured.',
    },
    {
        key: 'malavya', name: 'Malavya Yoga', nameHindi: 'मालव्य योग',
        quality: 'benefic',
        formingCondition: 'Venus in own sign (Taurus/Libra) or exaltation (Pisces) in a kendra.',
        description: {
            brief: 'One of the Pancha Mahapurusha Yogas — confers beauty, luxury, and artistic talent.',
            standard: 'Malavya Yoga forms when Venus occupies a kendra in his own or exalted sign. It creates a person of great beauty, artistic talent, and material prosperity.',
            deep: 'Malavya Yoga bestows all of Venus\'s blessings in their fullest form — physical beauty, artistic genius, harmonious married life, and abundant worldly pleasure. You attract luxury and comfort naturally. Creative arts, fashion, beauty industries, and entertainment are your natural domains.',
        },
        divination: 'Love, beauty, and material comfort are your birthright. Your creative and relational gifts bring both fulfilment and prosperity.',
    },
    {
        key: 'ruchaka', name: 'Ruchaka Yoga', nameHindi: 'रुचक योग',
        quality: 'benefic',
        formingCondition: 'Mars in own sign (Aries/Scorpio) or exaltation (Capricorn) in a kendra.',
        description: {
            brief: 'One of the Pancha Mahapurusha Yogas — confers courage, physical strength, and martial prowess.',
            standard: 'Ruchaka Yoga forms when Mars occupies a kendra in his own or exalted sign. It creates a person of exceptional physical vitality, courage, and leadership in competitive fields.',
            deep: 'Ruchaka Yoga gives Mars\'s full warrior energy — athletic ability, decisive leadership, property ownership, and the courage to face any challenge. Military, sports, surgery, engineering, and law enforcement are natural career paths.',
        },
        divination: 'Physical strength and competitive success define your path. Property acquisition and leadership roles come through decisive action.',
    },
    {
        key: 'bhadra', name: 'Bhadra Yoga', nameHindi: 'भद्र योग',
        quality: 'benefic',
        formingCondition: 'Mercury in own sign (Gemini/Virgo) or exaltation (Virgo) in a kendra.',
        description: {
            brief: 'One of the Pancha Mahapurusha Yogas — confers intellectual brilliance and commercial success.',
            standard: 'Bhadra Yoga forms when Mercury occupies a kendra in his own or exalted sign. It creates a person of sharp intellect, eloquent communication, and success in commerce and education.',
            deep: 'Bhadra Yoga bestows Mercury\'s full intellectual power — analytical sharpness, business acumen, eloquent speech, and success in writing, technology, and commerce. You are a natural communicator and strategist.',
        },
        divination: 'Intellectual pursuits and commercial ventures are your strongest channels of success. Education, technology, and trade are favoured.',
    },
    {
        key: 'shasha', name: 'Shasha Yoga', nameHindi: 'शश योग',
        quality: 'benefic',
        formingCondition: 'Saturn in own sign (Capricorn/Aquarius) or exaltation (Libra) in a kendra.',
        description: {
            brief: 'One of the Pancha Mahapurusha Yogas — confers authority through discipline and service.',
            standard: 'Shasha Yoga forms when Saturn occupies a kendra in his own or exalted sign. It creates a person of great discipline, endurance, and authority earned through sustained effort and service.',
            deep: 'Shasha Yoga gives Saturn\'s full capacity for disciplined achievement — institutional authority, longevity, and power earned through service and perseverance. Government service, construction, agriculture, and any field requiring patience and endurance are favoured.',
        },
        divination: 'Authority and legacy are built through patient, disciplined effort. Success comes late but is permanent and respected.',
    },

    // ── Malefic Doshas ─────────────────────────────────────────────────────────
    {
        key: 'mangal_dosha', name: 'Mangal Dosha', nameHindi: 'मंगल दोष',
        quality: 'malefic',
        formingCondition: 'Mars in the 1st, 4th, 7th, 8th, or 12th house from Lagna, Moon, or Venus.',
        description: {
            brief: 'May create challenges in marriage and partnerships.',
            standard: 'Mangal Dosha (Manglik) occurs when Mars occupies houses affecting marriage. It can bring delays in marriage, marital conflicts, or incompatibility unless matched with another Manglik or mitigated by specific planetary conditions.',
            deep: 'Mangal Dosha is the most commonly discussed Dosha in Vedic matching. Mars\'s aggressive energy in sensitive relationship houses (1st=self, 4th=domestic peace, 7th=spouse, 8th=longevity of marriage, 12th=bedroom) can create friction in partnerships. However, many classical exceptions cancel or reduce the Dosha — such as Mars in its own sign, Jupiter\'s aspect on Mars, or both partners being Manglik. The severity varies greatly by the specific house and sign Mars occupies.',
        },
        divination: 'Marriage requires careful timing and compatibility assessment. Matching with another Manglik or applying remedies significantly reduces challenges.',
        remedy: 'Perform Mangal Shanti Puja. Donate red items on Tuesdays. Chant Hanuman Chalisa. Wear red coral after proper consultation.',
    },
    {
        key: 'kaal_sarpa', name: 'Kaal Sarpa Dosha', nameHindi: 'काल सर्प दोष',
        quality: 'malefic',
        formingCondition: 'All 7 planets (Sun through Saturn) hemmed between Rahu and Ketu.',
        description: {
            brief: 'May create periodic upheavals and karmic obstacles.',
            standard: 'Kaal Sarpa Dosha forms when all planets are confined between the Rahu-Ketu axis. It can bring periodic life disruptions, karmic challenges, and a feeling of being trapped in cycles.',
            deep: 'Kaal Sarpa (serpent of time) Dosha concentrates all planetary energy within the Rahu-Ketu axis, creating a life of intense karmic reckoning. The specific type depends on which houses Rahu and Ketu occupy. While traditionally feared, many successful individuals have this Dosha — it concentrates energy rather than destroying it. The key is channelling this focused energy toward constructive goals.',
        },
        divination: 'Life involves periodic cycles of upheaval followed by rebuilding. Spiritual practice and Naga Puja significantly ease the intensity.',
        remedy: 'Perform Kaal Sarpa Shanti Puja at Trimbakeshwar or Kalahasti. Chant Maha Mrityunjaya Mantra. Donate to snake conservation.',
    },
    {
        key: 'kemadrum', name: 'Kemadrum Dosha', nameHindi: 'केमद्रुम दोष',
        quality: 'malefic',
        formingCondition: 'No planets in the 2nd or 12th house from the Moon.',
        description: {
            brief: 'May bring mental isolation and financial instability.',
            standard: 'Kemadrum Dosha forms when the Moon is unsupported by planets in adjacent houses. It can bring emotional loneliness, financial fluctuations, and periods of mental distress.',
            deep: 'Kemadrum literally means "empty drum" — the Moon standing alone without nearby planetary support. This creates emotional isolation and financial instability that comes and goes in waves. However, many cancellations exist: planets aspecting the Moon, planets in kendras from the Lagna, or a strong Moon in its own or exalted sign all mitigate this Dosha significantly.',
        },
        divination: 'Emotional support systems and financial planning are especially important. Periods when the Moon is transited by benefics bring relief.',
        remedy: 'Strengthen the Moon through pearl or moonstone. Chant Chandra mantras on Mondays. Maintain close emotional connections.',
    },
];

/** Lookup yoga content by key */
export function getYogaContent(key: string): YogaContent | undefined {
    return YOGAS.find((y) => y.key === key.toLowerCase());
}
