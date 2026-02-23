/**
 * Panchang Content Library — Tithis, Panchang Yogas, Karanas
 */

import type { PanchangTithiContent, PanchangYogaContent, KaranaContent } from './types';

export const TITHIS: PanchangTithiContent[] = [
    { index: 1, name: 'Pratipada', nameHindi: 'प्रतिपदा', nature: 'mixed', auspiciousness: 'Good for new beginnings and initiations.', favoredActivities: ['Starting new ventures', 'House entry', 'Worship'], avoidedActivities: ['Travel', 'Marriage'] },
    { index: 2, name: 'Dwitiya', nameHindi: 'द्वितीया', nature: 'shubh', auspiciousness: 'Auspicious for ceremonies and foundation laying.', favoredActivities: ['Foundation laying', 'Ceremonies', 'Meeting elders'], avoidedActivities: ['Court proceedings'] },
    { index: 3, name: 'Tritiya', nameHindi: 'तृतीया', nature: 'shubh', auspiciousness: 'Excellent for creative pursuits and celebrations.', favoredActivities: ['Marriage', 'Celebrations', 'Creative arts', 'Music'], avoidedActivities: ['Surgery'] },
    { index: 4, name: 'Chaturthi', nameHindi: 'चतुर्थी', nature: 'mixed', auspiciousness: 'Good for confrontation and overcoming enemies.', favoredActivities: ['Defeating adversaries', 'Competitive events'], avoidedActivities: ['Marriage', 'Travel', 'New ventures'] },
    { index: 5, name: 'Panchami', nameHindi: 'पंचमी', nature: 'shubh', auspiciousness: 'Highly auspicious for education and spiritual activities.', favoredActivities: ['Education', 'Spiritual practices', 'Medicine', 'Performing arts'], avoidedActivities: ['Financial transactions'] },
    { index: 6, name: 'Shashthi', nameHindi: 'षष्ठी', nature: 'mixed', auspiciousness: 'Good for health matters and overcoming obstacles.', favoredActivities: ['Medical treatment', 'Coronation', 'Meeting friends'], avoidedActivities: ['Travel', 'Marriage'] },
    { index: 7, name: 'Saptami', nameHindi: 'सप्तमी', nature: 'shubh', auspiciousness: 'Excellent for travel, vehicle purchase, and journeys.', favoredActivities: ['Travel', 'Vehicle purchase', 'New jobs'], avoidedActivities: ['Surgery'] },
    { index: 8, name: 'Ashtami', nameHindi: 'अष्टमी', nature: 'ashubh', auspiciousness: 'Generally inauspicious; good for tantric practices.', favoredActivities: ['Tantric worship', 'Warfare', 'Defence'], avoidedActivities: ['Marriage', 'New ventures', 'Travel', 'Celebrations'] },
    { index: 9, name: 'Navami', nameHindi: 'नवमी', nature: 'ashubh', auspiciousness: 'Challenging energy; best for destruction of enemies.', favoredActivities: ['Overcoming enemies', 'Aggressive action'], avoidedActivities: ['Marriage', 'Travel', 'Auspicious events'] },
    { index: 10, name: 'Dashami', nameHindi: 'दशमी', nature: 'shubh', auspiciousness: 'Highly auspicious for all good works.', favoredActivities: ['Religious festivals', 'Government matters', 'All auspicious events'], avoidedActivities: [] },
    { index: 11, name: 'Ekadashi', nameHindi: 'एकादशी', nature: 'shubh', auspiciousness: 'Sacred fasting day; excellent for spiritual pursuits.', favoredActivities: ['Fasting', 'Spiritual practices', 'Charity', 'Meditation'], avoidedActivities: ['Material ventures', 'Non-vegetarian food'] },
    { index: 12, name: 'Dwadashi', nameHindi: 'द्वादशी', nature: 'shubh', auspiciousness: 'Good for religious activities and fire ceremonies.', favoredActivities: ['Havan', 'Religious ceremonies', 'Charity'], avoidedActivities: ['Travel'] },
    { index: 13, name: 'Trayodashi', nameHindi: 'त्रयोदशी', nature: 'shubh', auspiciousness: 'Auspicious for friendship, celebrations, and pleasure.', favoredActivities: ['Celebrations', 'Friendship', 'Entertainment', 'Music'], avoidedActivities: [] },
    { index: 14, name: 'Chaturdashi', nameHindi: 'चतुर्दशी', nature: 'ashubh', auspiciousness: 'Powerful but harsh; good for poison-related remedies and fierce activities.', favoredActivities: ['Tantric practices', 'Remedies for poison', 'Shiva worship'], avoidedActivities: ['Marriage', 'Travel', 'New ventures'] },
    { index: 15, name: 'Purnima', nameHindi: 'पूर्णिमा', nature: 'shubh', auspiciousness: 'Full Moon — highly auspicious for all good works and spiritual practices.', favoredActivities: ['All auspicious events', 'Spiritual practices', 'Charity', 'Satyanarayan Puja'], avoidedActivities: [] },
    { index: 16, name: 'Pratipada (Krishna)', nameHindi: 'प्रतिपदा (कृष्ण)', nature: 'mixed', auspiciousness: 'First day of waning phase; good for introspection.', favoredActivities: ['Reflection', 'Planning'], avoidedActivities: ['Major new initiatives'] },
    { index: 17, name: 'Dwitiya (Krishna)', nameHindi: 'द्वितीया (कृष्ण)', nature: 'shubh', auspiciousness: 'Good for quiet, domestic activities.', favoredActivities: ['Domestic matters', 'Meeting family'], avoidedActivities: [] },
    { index: 18, name: 'Tritiya (Krishna)', nameHindi: 'तृतीया (कृष्ण)', nature: 'shubh', auspiciousness: 'Good for creative work and arts.', favoredActivities: ['Creative work', 'Arts', 'Writing'], avoidedActivities: [] },
    { index: 19, name: 'Chaturthi (Krishna)', nameHindi: 'चतुर्थी (कृष्ण)', nature: 'mixed', auspiciousness: 'Good for Ganesha worship.', favoredActivities: ['Ganesha worship', 'Overcoming obstacles'], avoidedActivities: ['Travel'] },
    { index: 20, name: 'Panchami (Krishna)', nameHindi: 'पंचमी (कृष्ण)', nature: 'shubh', auspiciousness: 'Good for learning and education.', favoredActivities: ['Study', 'Education', 'Saraswati worship'], avoidedActivities: [] },
    { index: 21, name: 'Shashthi (Krishna)', nameHindi: 'षष्ठी (कृष्ण)', nature: 'mixed', auspiciousness: 'Good for health remedies.', favoredActivities: ['Health treatments', 'Medicine'], avoidedActivities: ['Travel'] },
    { index: 22, name: 'Saptami (Krishna)', nameHindi: 'सप्तमी (कृष्ण)', nature: 'shubh', auspiciousness: 'Good for Sun worship and travel.', favoredActivities: ['Sun worship', 'Travel'], avoidedActivities: [] },
    { index: 23, name: 'Ashtami (Krishna)', nameHindi: 'अष्टमी (कृष्ण)', nature: 'ashubh', auspiciousness: 'Generally inauspicious; sacred for Krishna Janmashtami.', favoredActivities: ['Krishna worship', 'Fasting'], avoidedActivities: ['New ventures', 'Marriage'] },
    { index: 24, name: 'Navami (Krishna)', nameHindi: 'नवमी (कृष्ण)', nature: 'ashubh', auspiciousness: 'Harsh; best for fierce activities.', favoredActivities: ['Aggressive remedies'], avoidedActivities: ['Auspicious events'] },
    { index: 25, name: 'Dashami (Krishna)', nameHindi: 'दशमी (कृष्ण)', nature: 'shubh', auspiciousness: 'Good for all activities.', favoredActivities: ['Work', 'Commerce', 'Religious events'], avoidedActivities: [] },
    { index: 26, name: 'Ekadashi (Krishna)', nameHindi: 'एकादशी (कृष्ण)', nature: 'shubh', auspiciousness: 'Sacred fasting day.', favoredActivities: ['Fasting', 'Vishnu worship', 'Charity'], avoidedActivities: ['Material pursuits'] },
    { index: 27, name: 'Dwadashi (Krishna)', nameHindi: 'द्वादशी (कृष्ण)', nature: 'shubh', auspiciousness: 'Good for religious activities.', favoredActivities: ['Breaking fast', 'Charity', 'Worship'], avoidedActivities: [] },
    { index: 28, name: 'Trayodashi (Krishna)', nameHindi: 'त्रयोदशी (कृष्ण)', nature: 'shubh', auspiciousness: 'Pradosh Vrat day; excellent for Shiva worship.', favoredActivities: ['Shiva worship', 'Pradosh Vrat', 'Meditation'], avoidedActivities: [] },
    { index: 29, name: 'Chaturdashi (Krishna)', nameHindi: 'चतुर्दशी (कृष्ण)', nature: 'ashubh', auspiciousness: 'Shivaratri; powerful for Shiva worship.', favoredActivities: ['Maha Shivaratri celebrations', 'Night vigil'], avoidedActivities: ['All mundane activities'] },
    { index: 30, name: 'Amavasya', nameHindi: 'अमावस्या', nature: 'ashubh', auspiciousness: 'New Moon — sacred for ancestor worship (Pitri Tarpan).', favoredActivities: ['Ancestor worship', 'Pitri Tarpan', 'Tantric practices'], avoidedActivities: ['Marriage', 'New ventures', 'Travel'] },
];

export const PANCHANG_YOGAS: PanchangYogaContent[] = [
    { index: 0, name: 'Vishkumbha', nameHindi: 'विष्कुम्भ', nature: 'ashubh', description: 'Harsh yoga — obstacles and challenges. Best for fierce activities.' },
    { index: 1, name: 'Priti', nameHindi: 'प्रीति', nature: 'shubh', description: 'Yoga of love — excellent for romance, relationships, and social activities.' },
    { index: 2, name: 'Ayushman', nameHindi: 'आयुष्मान', nature: 'shubh', description: 'Yoga of longevity — good for health treatments and long-term investments.' },
    { index: 3, name: 'Saubhagya', nameHindi: 'सौभाग्य', nature: 'shubh', description: 'Yoga of good fortune — highly auspicious for all endeavours.' },
    { index: 4, name: 'Shobhana', nameHindi: 'शोभन', nature: 'shubh', description: 'Yoga of beauty — excellent for arts, beauty treatments, and decoration.' },
    { index: 5, name: 'Atiganda', nameHindi: 'अतिगण्ड', nature: 'ashubh', description: 'Yoga of excess — danger of over-commitment. Exercise caution.' },
    { index: 6, name: 'Sukarma', nameHindi: 'सुकर्मा', nature: 'shubh', description: 'Yoga of good deeds — excellent for charitable and virtuous activities.' },
    { index: 7, name: 'Dhriti', nameHindi: 'धृति', nature: 'shubh', description: 'Yoga of determination — good for sustained effort and perseverance.' },
    { index: 8, name: 'Shoola', nameHindi: 'शूल', nature: 'ashubh', description: 'Yoga of the thorn — pain and obstacles. Avoid risky ventures.' },
    { index: 9, name: 'Ganda', nameHindi: 'गण्ड', nature: 'ashubh', description: 'Yoga of danger — obstacles and challenges. Proceed with caution.' },
    { index: 10, name: 'Vriddhi', nameHindi: 'वृद्धि', nature: 'shubh', description: 'Yoga of growth — excellent for expansion, investments, and business.' },
    { index: 11, name: 'Dhruva', nameHindi: 'ध्रुव', nature: 'shubh', description: 'Yoga of stability — excellent for permanent activities like construction and planting.' },
    { index: 12, name: 'Vyaghata', nameHindi: 'व्याघात', nature: 'ashubh', description: 'Yoga of destruction — avoid important activities. Good for demolition.' },
    { index: 13, name: 'Harshana', nameHindi: 'हर्षण', nature: 'shubh', description: 'Yoga of joy — excellent for celebrations, entertainment, and happy occasions.' },
    { index: 14, name: 'Vajra', nameHindi: 'वज्र', nature: 'mixed', description: 'Yoga of the thunderbolt — powerful but unpredictable. Good for durable works.' },
    { index: 15, name: 'Siddhi', nameHindi: 'सिद्धि', nature: 'shubh', description: 'Yoga of accomplishment — highly auspicious for success in all ventures.' },
    { index: 16, name: 'Vyatipata', nameHindi: 'व्यतीपात', nature: 'ashubh', description: 'Yoga of calamity — one of the most inauspicious. Avoid all important activities.' },
    { index: 17, name: 'Variyan', nameHindi: 'वरीयान', nature: 'shubh', description: 'Yoga of excellence — good for important decisions and quality work.' },
    { index: 18, name: 'Parigha', nameHindi: 'परिघ', nature: 'ashubh', description: 'Yoga of obstruction — barriers and delays. Exercise patience.' },
    { index: 19, name: 'Shiva', nameHindi: 'शिव', nature: 'shubh', description: 'Yoga of auspiciousness — one of the most fortunate. Excellent for all good works.' },
    { index: 20, name: 'Siddha', nameHindi: 'सिद्ध', nature: 'shubh', description: 'Yoga of perfection — everything attempted has a higher chance of success.' },
    { index: 21, name: 'Sadhya', nameHindi: 'साध्य', nature: 'shubh', description: 'Yoga of accomplishment — good for completing tasks and achieving goals.' },
    { index: 22, name: 'Shubha', nameHindi: 'शुभ', nature: 'shubh', description: 'Yoga of auspiciousness — excellent for marriage, festivals, and all happy occasions.' },
    { index: 23, name: 'Shukla', nameHindi: 'शुक्ल', nature: 'shubh', description: 'Yoga of brightness — good for education, learning, and intellectual pursuits.' },
    { index: 24, name: 'Brahma', nameHindi: 'ब्रह्म', nature: 'shubh', description: 'Yoga of creation — excellent for starting new creative projects and ventures.' },
    { index: 25, name: 'Indra', nameHindi: 'इन्द्र', nature: 'shubh', description: 'Yoga of authority — excellent for government matters and positions of power.' },
    { index: 26, name: 'Vaidhriti', nameHindi: 'वैधृति', nature: 'ashubh', description: 'Yoga of support-loss — inauspicious. Avoid depending on others today.' },
];

export const KARANAS: KaranaContent[] = [
    { index: 0, name: 'Bava', nameHindi: 'बव', nature: 'shubh', description: 'Auspicious — good for agriculture, trade, and all worldly activities.' },
    { index: 1, name: 'Balava', nameHindi: 'बालव', nature: 'shubh', description: 'Auspicious — good for spiritual activities, medicine, and education.' },
    { index: 2, name: 'Kaulava', nameHindi: 'कौलव', nature: 'shubh', description: 'Auspicious — good for friendship, romance, and social gatherings.' },
    { index: 3, name: 'Taitila', nameHindi: 'तैतिल', nature: 'shubh', description: 'Auspicious — good for government work, decoration, and ornamentation.' },
    { index: 4, name: 'Garaja', nameHindi: 'गरज', nature: 'shubh', description: 'Auspicious — good for agriculture, construction, and property matters.' },
    { index: 5, name: 'Vanija', nameHindi: 'वणिज', nature: 'shubh', description: 'Auspicious — good for trade, commerce, and financial transactions.' },
    { index: 6, name: 'Vishti', nameHindi: 'भद्रा', nature: 'ashubh', description: 'Bhadra Karana — inauspicious. Avoid all important activities. Also called Vishti.' },
    { index: 7, name: 'Shakuni', nameHindi: 'शकुनि', nature: 'mixed', description: 'Fixed karana — good for medicine and poison-related activities.' },
    { index: 8, name: 'Chatushpada', nameHindi: 'चतुष्पाद', nature: 'mixed', description: 'Fixed karana — good for coronation and royal activities.' },
    { index: 9, name: 'Naga', nameHindi: 'नाग', nature: 'mixed', description: 'Fixed karana — good for permanent works and long-term activities.' },
    { index: 10, name: 'Kimstughna', nameHindi: 'किंस्तुघ्न', nature: 'shubh', description: 'Fixed karana — auspicious for all good works, especially worship.' },
];

/** Lookup Tithi by index (1–30) */
export function getTithiContent(index: number): PanchangTithiContent | undefined {
    return TITHIS.find((t) => t.index === index);
}

/** Lookup Panchang Yoga by index (0–26) */
export function getPanchangYogaContent(index: number): PanchangYogaContent | undefined {
    return PANCHANG_YOGAS.find((y) => y.index === index);
}

/** Lookup Karana by index (0–10) */
export function getKaranaContent(index: number): KaranaContent | undefined {
    return KARANAS.find((k) => k.index === index);
}
