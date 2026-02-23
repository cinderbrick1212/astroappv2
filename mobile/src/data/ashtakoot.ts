/**
 * Ashtakoot (8 Koots) Content Library — Kundli Milan scoring
 */

import type { AshtakootContent, AshtakootVerdictThreshold } from './types';

export const ASHTAKOOT_KOOTS: AshtakootContent[] = [
    { key: 'varna', name: 'Varna', nameHindi: 'वर्ण', maxPoints: 1, description: 'Spiritual compatibility and ego levels. Measures the spiritual development and compatibility of temperamental dispositions.' },
    { key: 'vashya', name: 'Vashya', nameHindi: 'वश्य', maxPoints: 2, description: 'Mutual attraction and dominance dynamics. Assesses the power equation and control patterns between partners.' },
    { key: 'tara', name: 'Tara', nameHindi: 'तारा', maxPoints: 3, description: 'Birth star compatibility and health harmony. Evaluates the destiny compatibility based on the nakshatras of both partners.' },
    { key: 'yoni', name: 'Yoni', nameHindi: 'योनि', maxPoints: 4, description: 'Physical and sexual compatibility. Assesses the intimate and physical compatibility including sexual harmony between partners.' },
    { key: 'graha_maitri', name: 'Graha Maitri', nameHindi: 'ग्रह मैत्री', maxPoints: 5, description: 'Mental and intellectual compatibility. Evaluates the friendship between the Moon sign lords, reflecting mental wavelength alignment.' },
    { key: 'gana', name: 'Gana', nameHindi: 'गण', maxPoints: 6, description: 'Temperament compatibility — Deva, Manushya, or Rakshasa. Assesses the basic nature and temperament match between partners.' },
    { key: 'bhakoot', name: 'Bhakoot', nameHindi: 'भकूट', maxPoints: 7, description: 'Financial prosperity and family welfare after marriage. Evaluates the mutual Moon sign positions for material and familial harmony.' },
    { key: 'nadi', name: 'Nadi', nameHindi: 'नाड़ी', maxPoints: 8, description: 'Genetic and health compatibility — the most important Koot. Same Nadi (Aadi, Madhya, or Antya) is considered inauspicious for progeny health.' },
];

export const ASHTAKOOT_VERDICTS: AshtakootVerdictThreshold[] = [
    { minScore: 28, maxScore: 36, verdict: 'Excellent Match', verdictHindi: 'उत्तम मिलान', description: 'An excellent match with strong compatibility across all dimensions. This union is blessed with harmony, mutual understanding, and lasting happiness.' },
    { minScore: 21, maxScore: 27, verdict: 'Good Match', verdictHindi: 'शुभ मिलान', description: 'A good match with solid compatibility. Minor differences can be managed with mutual understanding and effort.' },
    { minScore: 18, maxScore: 20, verdict: 'Average Match', verdictHindi: 'साधारण मिलान', description: 'An average match that requires effort from both partners. Specific remedies may help strengthen weak areas.' },
    { minScore: 0, maxScore: 17, verdict: 'Below Average', verdictHindi: 'विचारणीय', description: 'A below-average match with significant compatibility challenges. Expert consultation and remedies are strongly recommended before proceeding.' },
];

/** Get the verdict for a given score */
export function getAshtakootVerdict(score: number): AshtakootVerdictThreshold {
    return ASHTAKOOT_VERDICTS.find((v) => score >= v.minScore && score <= v.maxScore)
        ?? ASHTAKOOT_VERDICTS[ASHTAKOOT_VERDICTS.length - 1];
}
