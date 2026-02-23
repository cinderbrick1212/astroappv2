/**
 * Data Layer — Barrel Export
 * Screens import only from '../data'.
 */

// Content service (the only import screens need for personalized content)
export { ContentService } from './contentService';

// Data types
export type {
    // Static content types
    GrahaContent,
    RashiContent,
    NakshatraContent,
    YogaContent,
    DashaContent,
    RemedyContent,
    AshtakootContent,
    PanchangTithiContent,
    PanchangYogaContent,
    KaranaContent,
    MuhurtaActivityContent,
    RashifalEntry,
    ContentText,

    // Personalized output types
    PersonalizedKundliContent,
    PersonalizedMilanContent,
    PersonalizedDashaContent,
    PersonalizedGocharContent,
    PersonalizedVarshaphalContent,
    PersonalizedVargaContent,
    PersonalizedPanchangContent,
    PersonalizedMuhurtaContent,
    PersonalizedTithiContent,
    PersonalizedNakshatraContent,
    PersonalizedGrahanContent,
    PersonalizedAshtakavargaContent,
    PersonalizedPrashnaContent,
    PersonalizedHoraContent,
    PersonalizedRemedyContent,
    PersonalizedRashifalContent,
} from './types';

// Direct data access (for components that need raw data, not personalized)
export { GRAHAS, getGrahaContent } from './grahas';
export { RASHIS, getRashiContent, getRashiByIndex } from './rashi';
export { NAKSHATRAS, getNakshatraContent, getNakshatraByIndex } from './nakshatras';
export { YOGAS, getYogaContent } from './yogas';
export { DASHAS, getDashaContent } from './dashas';
export { REMEDIES, getRemedyContent } from './remedies';
export { ASHTAKOOT_KOOTS, ASHTAKOOT_VERDICTS, getAshtakootVerdict } from './ashtakoot';
export { TITHIS, PANCHANG_YOGAS, KARANAS, getTithiContent, getPanchangYogaContent, getKaranaContent } from './panchang';
export { MUHURTA_ACTIVITIES, getMuhurtaActivityContent } from './muhurta';
export { RASHIFAL_ENTRIES, DASHA_MODIFIERS, GOCHAR_MODIFIERS, getRashifalEntry, getDashaModifier, getGocharModifier } from './rashifal';
