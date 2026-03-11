# AstroAppV2 Demo & Screenshots

This directory contains screenshots and demo videos showcasing the AstroAppV2 Vedic Jyotish platform.

## Application Overview

AstroAppV2 is a comprehensive Vedic astrology platform built with React Native (Expo) for cross-platform support (Web, iOS, and Android) and Strapi v5 for the backend.

## Key Features Demonstrated

### 1. Authentication & Onboarding
- **Firebase Authentication**: Email/password, Google OAuth, and phone authentication
- **User Onboarding**: Personalized onboarding flow with birth details collection
- **Profile Management**: Complete user profile with birth chart data

### 2. Daily Feed & Personalization
- **Dainik Rashifal**: Daily personalized horoscope based on user's birth chart
- **Panchang**: Complete daily Panchang with Tithi, Nakshatra, Yoga, Karana
- **Remedy of the Day**: Daily Graha Shanti remedies (mantras, gemstones, donations)
- **Streak Tracking**: Daily engagement tracking with habit formation

### 3. Vedic Astrology Tools (16 Complete Tools)

#### Birth Chart Analysis
- **Janma Kundli**: Full North Indian style birth chart with:
  - 12 houses with planetary placements
  - Ascendant (Lagna) calculation
  - Planetary aspects and strengths
  - Yoga analysis (Raja Yoga, Dhana Yoga, etc.)
  - Graha Shanti remedies

#### Compatibility
- **Kundli Milan**: Ashtakoot Guna Milan (36-point matching system)
  - Varna, Vashya, Tara, Yoni, Graha Maitri, Gana, Bhakoot, Nadi
  - Mangal Dosha analysis
  - Overall compatibility score and interpretation

#### Time Cycles & Predictions
- **Vimshottari Dasha**: Complete Dasha timeline
  - Mahadasha (major periods)
  - Antardasha (sub-periods)
  - Pratyantardasha (sub-sub-periods)
  - Current and upcoming Dasha predictions

- **Gochar (Transits)**: Current planetary transits
  - Real-time planetary positions
  - Sade Sati (Saturn's 7.5-year cycle) indicator
  - Transit effects on natal chart

- **Varshaphal**: Annual solar return chart

#### Divisional Charts
- **Navamsa (D9)**: Marriage and spiritual chart
- **Dashamsha (D10)**: Career and profession chart
- **Dwadashamsha (D12)**: Parents and ancestors chart

#### Panchang & Timing
- **Panchang Vishesh**: Extended daily almanac
  - Sunrise/sunset, moonrise/moonset
  - Rahu Kaal, Yamaganda, Gulika Kaal
  - Abhijit Muhurta
  - Amrit Kaal

- **Muhurta**: Auspicious timing calculator
  - Wedding muhurta
  - Business/travel muhurta
  - Event planning

- **Tithi & Chandra**: Moon phase calendar
  - Current Tithi
  - Lunar calendar
  - Moon sign analysis

- **Nakshatra Vishesh**: Detailed nakshatra analysis
  - 27 Nakshatras
  - Pada (quarter) analysis
  - Nakshatra lord and characteristics

#### Specialized Calculations
- **Grahan**: Eclipse calculator
  - Solar and lunar eclipses
  - Vedic significance and remedies
  - Sutak period calculations

- **Ashtakavarga**: Planetary strength grid
  - Sarvashtakavarga (SAV) calculation
  - Bhinnashtak varga
  - Transit predictions

- **Prashna**: Horary astrology
  - Question-based chart
  - Instant predictions

- **Hora**: Planetary hours
  - Daily hora timeline
  - Auspicious hours for activities

- **Graha Shanti**: Comprehensive remedies
  - Gemstone recommendations
  - Mantras for each planet
  - Yantras and rituals
  - Donation suggestions

- **Dainik Rashifal**: Daily horoscope by moon sign
  - 12 moon signs
  - Daily predictions with push notifications

### 4. Premium Services
- **Ask a Question**: Text-based consultation with astrologers
- **Book a Call**: Voice consultation scheduling
- **Detailed Reports**: Comprehensive PDF reports

### 5. Content & Community
- **Blog Articles**: Vedic astrology articles and insights
- **Multi-language Support**: English and Hindi/Devanagari
- **Material Design 3**: Modern, adaptive UI

## Technical Highlights

### Frontend (Mobile/Web)
- **React Native with Expo SDK 54**
- **TypeScript** for type safety
- **React Navigation 6** for seamless navigation
- **React Query (TanStack)** for data management
- **Firebase Auth** for authentication
- **React Native Paper** for Material Design 3 UI
- **Swiss Ephemeris** (astronomy-engine) for accurate calculations
- **Offline Support** with AsyncStorage

### Backend
- **Strapi v5** headless CMS
- **PostgreSQL** database (with SQLite for development)
- **Firebase Admin SDK** for token verification
- **Razorpay** payment integration
- **Cloud Storage** for media management

### Architecture
- **Client-side Calculations**: All astrology calculations performed on device
- **Offline-First**: Core features work without internet
- **Cross-Platform**: Single codebase for Web, iOS, and Android
- **Scalable**: Cloud-native architecture ready for production

## Sidereal vs Tropical

This app uses the **Sidereal zodiac** (Lahiri ayanamsa) as the default, which is the standard in Vedic astrology. A tropical mode option is available for comparison.

## Screenshots Directory Structure

```
demo/
├── screenshots/
│   ├── onboarding/          # User onboarding flow
│   ├── authentication/      # Login, signup, forgot password
│   ├── daily-feed/         # Main feed with daily content
│   ├── tools/              # Tools screen overview
│   ├── janma-kundli/       # Birth chart examples
│   ├── kundli-milan/       # Compatibility matching
│   ├── dasha/              # Dasha timeline
│   ├── panchang/           # Daily Panchang
│   ├── profile/            # User profile management
│   └── premium-services/   # Ask question, book call, reports
├── videos/
│   ├── app-walkthrough.mp4  # Complete app walkthrough
│   ├── kundli-demo.mp4      # Birth chart feature demo
│   └── tools-overview.mp4   # Tools overview
└── README.md               # This file
```

## How to Capture Screenshots

### Web Version
1. Start the development server:
   ```bash
   cd mobile
   npm start
   ```
2. Press `w` to open in web browser
3. Use browser DevTools to set mobile viewport (375x812 for iPhone)
4. Navigate through features and capture screenshots

### Mobile Version
1. Run on iOS Simulator:
   ```bash
   npm run ios
   ```
2. Run on Android Emulator:
   ```bash
   npm run android
   ```
3. Use simulator/emulator screenshot tools

## Demo Video Creation

### Recommended Tools
- **Web**: Use Chrome DevTools device toolbar + screen recording
- **iOS**: QuickTime Player screen recording
- **Android**: Android Studio built-in screen recorder

### Suggested Demo Videos
1. **App Walkthrough** (2-3 minutes)
   - Launch and onboarding
   - Main navigation
   - Key features overview

2. **Kundli Creation** (1-2 minutes)
   - Enter birth details
   - Generate birth chart
   - View chart analysis

3. **Tools Showcase** (2-3 minutes)
   - Navigate through different tools
   - Show calculations in action
   - Demonstrate offline capability

## Branding

### App Colors
- **Primary**: Deep Purple (`#4a148c`)
- **Background**: Light theme with subtle gradients
- **Accent**: Complementary warm colors for remedies and highlights

### Typography
- **Font**: Plus Jakarta Sans (Regular, Medium, SemiBold, Bold)
- **Material Design 3** design tokens

## Status

✅ All core features implemented and functional
✅ TypeScript compilation successful
✅ Firebase authentication configured
✅ Cross-platform support (Web, iOS, Android)
✅ Offline-first architecture
✅ Material Design 3 UI

## Next Steps for Demo Creation

1. Run the app in web browser
2. Capture screenshots of all major features
3. Record demo videos showing key workflows
4. Create GIFs for README feature highlights
5. Update main README with visual showcase
