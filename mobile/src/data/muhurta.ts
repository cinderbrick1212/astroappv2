/**
 * Muhurta Content Library — Auspicious timing by activity type
 */

import type { MuhurtaActivityContent } from './types';

export const MUHURTA_ACTIVITIES: MuhurtaActivityContent[] = [
    {
        key: 'marriage', name: 'Marriage', nameHindi: 'विवाह',
        bestTithis: [2, 3, 5, 7, 10, 11, 13, 15],
        bestNakshatras: ['rohini', 'mrigashira', 'magha', 'uttara_phalguni', 'hasta', 'swati', 'anuradha', 'moola', 'uttara_ashadha', 'shravana', 'dhanishta', 'uttara_bhadrapada', 'revati'],
        bestDays: ['monday', 'wednesday', 'thursday', 'friday'],
        avoidConditions: 'Avoid Ashtami, Navami, Chaturdashi, Amavasya, eclipses, Rahu Kaal, and months of Ashwin (Pitri Paksha).',
        guidance: {
            brief: 'Choose a Thursday or Friday in Shukla Paksha with an auspicious Nakshatra.',
            standard: 'For marriage, select a date in the waxing fortnight (Shukla Paksha) on an auspicious Tithi (2, 3, 5, 7, 10, 11, 13). The Nakshatra should be fixed or soft. Avoid Bhadra Karana and Rahu Kaal.',
            deep: 'Marriage muhurta is the most important timing decision in Vedic astrology. The Lagna at the wedding time becomes the birth chart of the marriage itself. Select a date when the 7th house lord is strong, Jupiter aspects the Lagna or 7th, and no malefics occupy the 7th or 8th houses. The bride\'s Moon Nakshatra should not be the same as the wedding Nakshatra. Venus should not be combust. The month of Margashirsha, Magha, Phalguna, and Vaishakha are especially auspicious.',
        },
    },
    {
        key: 'travel', name: 'Travel', nameHindi: 'यात्रा',
        bestTithis: [2, 3, 5, 7, 10, 11, 13],
        bestNakshatras: ['ashwini', 'mrigashira', 'punarvasu', 'pushya', 'hasta', 'anuradha', 'shravana', 'revati'],
        bestDays: ['monday', 'wednesday', 'friday'],
        avoidConditions: 'Avoid Tuesdays and Saturdays for long journeys. Avoid Bhadra Karana and Rahu Kaal.',
        guidance: {
            brief: 'Travel on a Wednesday or Friday during an auspicious Tithi.',
            standard: 'For travel, choose a day when the Moon is in a movable Nakshatra. Avoid starting journeys during Rahu Kaal or facing the direction associated with the day\'s unfavourable quarter.',
            deep: 'Vedic travel muhurta considers the direction of travel, the weekday, and the Nakshatra. North-facing travel is best on Monday and Wednesday; East-facing on Thursday and Friday; South-facing should be avoided on Tuesday; West-facing travel is best on Saturday. Ensure the 8th house from the travel Lagna is unoccupied by malefics.',
        },
    },
    {
        key: 'business', name: 'New Business', nameHindi: 'व्यापार',
        bestTithis: [1, 2, 3, 5, 7, 10, 11, 13, 15],
        bestNakshatras: ['ashwini', 'rohini', 'punarvasu', 'pushya', 'uttara_phalguni', 'hasta', 'chitra', 'swati', 'anuradha', 'shravana', 'dhanishta', 'revati'],
        bestDays: ['monday', 'wednesday', 'thursday', 'friday'],
        avoidConditions: 'Avoid Ashtami, Navami, Chaturdashi, Amavasya, and Saturn-afflicted lagnas.',
        guidance: {
            brief: 'Start a business on Thursday or Wednesday in Shukla Paksha.',
            standard: 'For business start-ups, the Lagna should be fixed or dual. Jupiter should be strong and aspect the Lagna or 10th house. Mercury should not be retrograde for trade-related ventures.',
            deep: 'New business muhurta requires a strong 10th house (career), 2nd house (finance), and 11th house (gains). The Lagna lord should be well-placed, and the Moon should be in the Shukla Paksha. Pushya Nakshatra is considered the most auspicious for business beginnings.',
        },
    },
    {
        key: 'house_entry', name: 'Griha Pravesh', nameHindi: 'गृह प्रवेश',
        bestTithis: [1, 2, 3, 5, 7, 10, 11, 13, 15],
        bestNakshatras: ['rohini', 'mrigashira', 'uttara_phalguni', 'hasta', 'swati', 'anuradha', 'uttara_ashadha', 'shravana', 'dhanishta', 'uttara_bhadrapada', 'revati'],
        bestDays: ['monday', 'wednesday', 'thursday', 'friday'],
        avoidConditions: 'Avoid months of Ashwin, Bhadra, and Shunya masas. Avoid when Sun or Jupiter are combust.',
        guidance: {
            brief: 'Enter a new home on a Thursday or Friday during an auspicious Nakshatra.',
            standard: 'Griha Pravesh requires auspicious Tithis in the bright fortnight. The 4th house should be strong, and no malefics should occupy the 4th or 8th house in the muhurta chart.',
            deep: 'House entry (Griha Pravesh) is one of the most important samskaras. The muhurta Lagna should have the 4th lord well-placed. Jupiter\'s aspect on the 4th house brings prosperity. The Sun should be in the Northern course (Uttarayana). The months of Magha, Phalguna, Vaishakha, and Jyeshtha are preferred. Enter the house with the right foot first, carrying a pot of water or milk.',
        },
    },
    {
        key: 'education', name: 'Vidyarambha', nameHindi: 'विद्यारंभ',
        bestTithis: [1, 2, 3, 5, 7, 10, 11, 13],
        bestNakshatras: ['ashwini', 'rohini', 'mrigashira', 'punarvasu', 'pushya', 'hasta', 'chitra', 'swati', 'shravana', 'dhanishta', 'revati'],
        bestDays: ['wednesday', 'thursday', 'friday'],
        avoidConditions: 'Avoid Tuesdays and Saturdays. Mercury should not be retrograde.',
        guidance: {
            brief: 'Begin studies on a Wednesday or Thursday during Hasta or Shravana Nakshatra.',
            standard: 'Education initiation requires Mercury and Jupiter to be strong. The 5th house (intelligence) should be well-aspected. Basant Panchami is the traditional day for Vidyarambha.',
            deep: 'Vidyarambha (beginning of education) should be performed when Mercury is direct, Jupiter aspects the Lagna or 5th house, and the Moon is in a knowledge-oriented Nakshatra like Hasta, Shravana, or Pushya. Saraswati Puja accompanies this ceremony.',
        },
    },
    {
        key: 'medical', name: 'Medical Treatment', nameHindi: 'चिकित्सा',
        bestTithis: [1, 4, 6, 9, 11, 14],
        bestNakshatras: ['ashwini', 'pushya', 'hasta', 'anuradha', 'shravana', 'shatabhisha', 'revati'],
        bestDays: ['monday', 'wednesday', 'saturday'],
        avoidConditions: 'Avoid surgery on Tuesdays (Mars rules cutting). Avoid Amavasya and eclipses.',
        guidance: {
            brief: 'Schedule medical procedures on Monday or Wednesday in Ashwini Nakshatra.',
            standard: 'Medical treatment benefits from Ashwini Nakshatra (the healers\' star). Avoid Mars-ruled times for surgery. The 6th house (diseases) should be weakened in the muhurta chart.',
            deep: 'For elective surgery, avoid Tuesdays (Mars rules sharp instruments and blood). The Moon should not be in the sign ruling the body part being operated on. Ashwini, Pushya, and Shatabhisha are the most healing Nakshatras. The 8th house should be free of malefics for safety.',
        },
    },
    {
        key: 'vehicle_purchase', name: 'Vehicle Purchase', nameHindi: 'वाहन खरीद',
        bestTithis: [2, 3, 5, 7, 10, 11, 13],
        bestNakshatras: ['ashwini', 'rohini', 'pushya', 'uttara_phalguni', 'hasta', 'swati', 'anuradha', 'shravana', 'revati'],
        bestDays: ['wednesday', 'thursday', 'friday'],
        avoidConditions: 'Avoid Tuesdays, Saturdays, and Rahu Kaal. Venus should not be combust.',
        guidance: {
            brief: 'Purchase vehicles on Friday during Pushya or Swati Nakshatra.',
            standard: 'Vehicle purchase is governed by Venus (luxury) and the 4th house (conveyances). Choose a day when Venus is strong and the 4th house is well-aspected.',
            deep: 'The muhurta for vehicle purchase should have Venus strong (not combust, not retrograde, and in a good house). The 4th house governs conveyances — its lord should be well-placed. Pushya Nakshatra on a Thursday is considered the best possible combination for purchasing vehicles.',
        },
    },
    {
        key: 'naming_ceremony', name: 'Namakarana', nameHindi: 'नामकरण',
        bestTithis: [2, 3, 5, 7, 10, 11, 13],
        bestNakshatras: ['ashwini', 'rohini', 'mrigashira', 'punarvasu', 'pushya', 'uttara_phalguni', 'hasta', 'swati', 'shravana', 'uttara_bhadrapada', 'revati'],
        bestDays: ['monday', 'wednesday', 'thursday', 'friday'],
        avoidConditions: 'Avoid Ashtami, Navami, Chaturdashi, Amavasya, and eclipses.',
        guidance: {
            brief: 'Perform naming ceremony on the 11th or 12th day after birth in an auspicious Nakshatra.',
            standard: 'Namakarana is traditionally performed on the 11th day after birth. Choose a time when Jupiter and Mercury are strong, and the Moon is in a benefic Nakshatra.',
            deep: 'The naming ceremony\'s muhurta should have the Lagna lord well-placed, the Moon in a gentle Nakshatra, and Jupiter aspecting the Lagna or Moon. The first syllable of the name should correspond to the child\'s birth Nakshatra\'s syllable (Pada-based naming).',
        },
    },
];

/** Lookup muhurta activity content by key */
export function getMuhurtaActivityContent(key: string): MuhurtaActivityContent | undefined {
    return MUHURTA_ACTIVITIES.find((m) => m.key === key.toLowerCase());
}
