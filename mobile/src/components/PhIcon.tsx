/**
 * PhIcon — Phosphor icon wrapper for the AstroWitt app.
 *
 * Usage:
 *   import { PhIcon } from '../components/PhIcon';
 *   <PhIcon name="star" size={24} color="#CBBEFF" />
 *   <PhIcon name="star" size={24} color="#CBBEFF" weight="fill" />
 */
import React from 'react';
import type { IconWeight } from 'phosphor-react-native';
import {
    // Navigation / UI
    House,
    CalendarDots,
    Compass,
    UserCircle,
    CaretRight,
    Star,
    MagnifyingGlass,
    Gear,
    SignOut,
    PencilSimple,
    X,
    Check,
    Info,
    Warning,
    Question,
    Plus,
    Minus,
    ArrowLeft,
    ArrowRight,
    ArrowsLeftRight,

    // Astrology
    StarFour,
    SunHorizon,
    Moon,
    Planet,
    Sparkle,
    Atom,
    Compass as WindRose,
    ChartPie,
    GridFour,
    ShieldStar,
    Eye,
    Timer,
    Clock,
    CalendarStar,
    CalendarBlank,

    // Hearts / Love
    Heart,
    HeartStraight,
    Heartbeat,

    // Nature / Elements
    Leaf,
    Drop,
    Fire,
    Sun,
    SunDim,
    CloudSun,

    // Communication
    ChatCircle,
    Phone,
    Envelope,
    PaperPlaneTilt,

    // Finance / Commerce
    CurrencyInr,
    Wallet,
    CreditCard,
    Receipt,

    // File / Documents
    ChartBar,
    File,
    Notebook,

    // People / Profile
    User,
    Users,
    UserPlus,
    Crown,
    Trophy,

    // Misc
    Palette,
    Briefcase,
    TreeStructure,
    Lightning,
    Bell,
    MapPin,
    GlobeHemisphereEast,
    Clover,
    MoonStars,
    HandPalm,
    HandWaving,
    Scroll,
    Swap,
    SlidersHorizontal,
    NumberCircleOne,
    NumberCircleTwo,
    NumberCircleThree,

} from 'phosphor-react-native';

// ── Icon registry ────────────────────────────────────────────────────────────
// Maps short names to Phosphor components for a clean, centralized API.
const ICON_MAP: Record<string, React.ComponentType<any>> = {
    // Navigation & UI
    'home': House,
    'house': House,
    'calendar-today': CalendarDots,
    'calendar-month': CalendarDots,
    'calendar-dots': CalendarDots,
    'calendar-star': CalendarStar,
    'calendar-text': CalendarBlank,
    'compass': Compass,
    'user-circle': UserCircle,
    'account-circle': UserCircle,
    'chevron-right': CaretRight,
    'caret-right': CaretRight,
    'star': Star,
    'star-david': Star,
    'search': MagnifyingGlass,
    'magnifying-glass': MagnifyingGlass,
    'gear': Gear,
    'settings': Gear,
    'sign-out': SignOut,
    'logout': SignOut,
    'pencil': PencilSimple,
    'pencil-simple': PencilSimple,
    'close': X,
    'x': X,
    'check': Check,
    'info': Info,
    'warning': Warning,
    'alert-outline': Warning,
    'question': Question,
    'help-circle': Question,
    'help-circle-outline': Question,
    'plus': Plus,
    'minus': Minus,
    'arrow-left': ArrowLeft,
    'arrow-right': ArrowRight,
    'swap-horizontal': Swap,
    'swap': Swap,

    // Astrology
    'star-four-points': StarFour,
    'star-four': StarFour,
    'sun-horizon': SunHorizon,
    'moon-waning-crescent': Moon,
    'moon': Moon,
    'moon-stars': MoonStars,
    'weather-night': MoonStars,
    'planet': Planet,
    'orbit': Planet,
    'sparkle': Sparkle,
    'atom': Atom,
    'chart-pie': ChartPie,
    'grid': GridFour,
    'grid-four': GridFour,
    'shield-sun': ShieldStar,
    'shield-star': ShieldStar,
    'eye': Eye,
    'timer': Timer,
    'clock': Clock,
    'clock-outline': Clock,
    'clock-check': Timer,

    // Hearts / Love
    'heart': Heart,
    'heart-outline': Heart,
    'heart-multiple': HeartStraight,
    'heartbeat': Heartbeat,

    // Nature / Elements
    'leaf': Leaf,
    'leaf-circle-outline': Leaf,
    'sprout': Leaf,
    'drop': Drop,
    'fire': Fire,
    'sun': Sun,
    'sun-dim': SunDim,
    'cloud-sun': CloudSun,

    // Communication
    'chat': ChatCircle,
    'chat-circle': ChatCircle,
    'chat-question-outline': ChatCircle,
    'phone': Phone,
    'phone-in-talk-outline': Phone,
    'envelope': Envelope,
    'send': PaperPlaneTilt,

    // Finance
    'currency-inr': CurrencyInr,
    'wallet': Wallet,
    'credit-card': CreditCard,
    'receipt': Receipt,

    // Documents
    'file-chart': ChartBar,
    'file-chart-outline': ChartBar,
    'file-pdf': File,
    'notebook': Notebook,

    // People / Profile
    'user': User,
    'users': Users,
    'user-plus': UserPlus,
    'crown': Crown,
    'trophy': Trophy,
    'home-heart': House,

    // Misc
    'palette': Palette,
    'palette-outline': Palette,
    'briefcase': Briefcase,
    'briefcase-outline': Briefcase,
    'tree': TreeStructure,
    'lightning': Lightning,
    'bell': Bell,
    'map-pin': MapPin,
    'globe': GlobeHemisphereEast,
    'clover': Clover,
    'hand-palm': HandPalm,
    'hand-waving': HandWaving,
    'scroll': Scroll,
    'sliders': SlidersHorizontal,
    'numeric': NumberCircleOne,

    // Zodiac fallbacks (Phosphor doesn't have zodiac glyphs, so we use Star variants)
    'zodiac-aries': Star,
};

// ── Component ────────────────────────────────────────────────────────────────

interface PhIconProps {
    name: string;
    size?: number;
    color?: string;
    weight?: IconWeight;
    style?: any;
}

export const PhIcon: React.FC<PhIconProps> = ({
    name,
    size = 24,
    color = '#CBBEFF',
    weight = 'regular',
    style,
}) => {
    const IconComponent = ICON_MAP[name] || Star;
    return <IconComponent size={size} color={color} weight={weight} style={style} />;
};

export default PhIcon;
