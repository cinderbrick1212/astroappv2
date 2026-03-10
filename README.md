# AstroAppV2 — Vedic Jyotish Platform

A modern **Vedic / Jyotish astrology** application built on React Native (Expo) for **Web, iOS, and Android**, with a Strapi backend. The app is rooted in Indian divinatory astrology — sidereal zodiac (Lahiri ayanamsa), Whole Sign houses, Vimshottari Dasha, Nakshatras, Panchang, and Graha Shanti remedies — and monetises through premium consultations and in-app ads.

> **Tradition:** Vedic / Jyotish — all calculations use the sidereal zodiac (Lahiri ayanamsa) and Whole Sign houses by default. Western tropical mode is available as an optional toggle on select screens.

## Screenshots & Demo

> 📸 Screenshots and a demo video are located in [`docs/screenshots/`](docs/screenshots/README.md).
> See that file for instructions on capturing and placing your own demo assets.

<!-- Uncomment and update paths once screenshots are available:
| Home | Kundli | Dasha | Panchang |
|------|--------|-------|----------|
| ![Home](docs/screenshots/home.png) | ![Kundli](docs/screenshots/kundli.png) | ![Dasha](docs/screenshots/dasha.png) | ![Panchang](docs/screenshots/panchang.png) |
-->

## Project Overview

This is a complete Jyotish application platform consisting of:

- **Mobile / Web App** (React Native + Expo): Cross-platform Web, iOS, and Android app with offline Vedic astrology calculations
- **Backend** (Strapi v5): Headless CMS for content management, user data, and service requests
- **Architecture**: Firebase Auth + Strapi + GCP deployment

## Key Features

### Mobile / Web App
- 📱 Daily personalized feed — Dainik Rashifal, Panchang, tips, and remedies
- 🔮 Full Jyotish tool suite — Janma Kundli, Kundli Milan, Vimshottari Dasha, Gochar, Panchang Vishesh, Muhurta, Navamsa, Ashtakavarga, Prashna, Hora, and more
- 🪬 Graha Shanti remedies — gemstone, mantra, yantra, and donation recommendations woven into every chart screen
- 🔐 Firebase authentication (Email, Phone, Google OAuth)
- 💰 Premium services — Ask a Question, Book a Call, Detailed Reports (via Razorpay)
- 🌍 Multi-language support (English, Hindi / Devanagari)
- 📊 Streak tracking and daily ritual habit formation
- 🎨 Material Design 3 UI (`react-native-paper`) — adaptive for web and mobile

### Backend
- 🎯 Content management for Rashifal feed, blog articles, and user data
- 💳 Payment processing with Razorpay
- 📧 Email and WhatsApp notifications to astrologers and users
- 🔒 Firebase token verification
- 📊 User profiles with birth details and premium status tracking
- 🖼️ Media management with Cloud Storage

## Project Structure

```
astroappv2/
├── mobile/               # React Native Expo app (Web + iOS + Android)
│   ├── src/
│   │   ├── navigation/   # App navigation
│   │   ├── screens/      # UI screens (Vedic tool screens)
│   │   ├── components/   # Reusable components (KundliWheel, etc.)
│   │   ├── services/     # Jyotish calculations (astrologyEngine, kundli, panchang…)
│   │   ├── hooks/        # Custom React hooks
│   │   ├── utils/        # Utility functions
│   │   ├── theme/        # MD3 design tokens
│   │   └── types/        # TypeScript types
│   └── README.md
│
├── backend/              # Strapi CMS
│   ├── src/
│   │   ├── api/          # API endpoints
│   │   └── config/       # Configuration
│   └── README.md
│
├── tool_rework_plan/     # 16 Vedic tool Copilot prompts (this plan)
├── extensive_frontend_rework/  # MD3 frontend Copilot prompts (#34)
├── tool_analysis/        # Deep-dive analysis of all 16 Jyotish tools
├── market_analysis/      # Indian + global competitor research
├── frontend.md           # Frontend architecture documentation
├── backend.md            # Backend architecture documentation
└── README.md             # This file
```

## Tech Stack

### Mobile App
- React Native with Expo SDK 54
- TypeScript
- React Navigation 6 (Stack + Bottom Tabs)
- React Query (TanStack Query)
- Firebase Auth
- AsyncStorage
- Axios
- Swiss Ephemeris (for astrology calculations)

### Backend
- Strapi v5 (Headless CMS)
- TypeScript
- PostgreSQL (Cloud SQL for production)
- Firebase Admin SDK
- Razorpay SDK
- Cloud Storage (GCP)
- Node.js 20+

### Infrastructure
- Firebase (Authentication)
- GCP Cloud Run (Backend hosting)
- GCP Cloud SQL (Database)
- GCP Cloud Storage (Media)
- Razorpay (Payments)
- SendGrid/Mailgun (Email)
- WhatsApp API (Notifications)

## Quick Start

### Prerequisites
- Node.js 20 or higher
- npm or yarn
- Expo CLI (for mobile development)
- Firebase account
- GCP account (for production)

### Backend Setup

```bash
cd backend
npm install
npm run develop
```

Visit `http://localhost:1337/admin` to set up the admin panel.

See [backend/README.md](backend/README.md) for detailed instructions.

### Mobile App Setup

```bash
cd mobile
npm install
cp .env.example .env
# Edit .env with your configuration
npm start
```

See [mobile/README.md](mobile/README.md) for detailed instructions.

## Architecture

### Authentication Flow
1. User logs in via Firebase Auth (mobile app)
2. App receives Firebase ID token
3. All API calls include the token in Authorization header
4. Strapi verifies token with Firebase Admin SDK
5. User session established

### Data Flow
- **Client-side**: All Jyotish calculations (Janma Kundli, Kundli Milan, Vimshottari Dasha, Gochar, Panchang, Muhurta, Prashna, Hora, Ashtakavarga, and more) — powered by Swiss Ephemeris with sidereal / Lahiri ayanamsa
- **Server-side**: User data, feed content, payments, service requests
- **Caching**: React Query for API data, AsyncStorage for offline data

### Content Management
- Astrologers manage content in Strapi Admin
- Feed items, blog posts, and service responses
- Media uploads to Cloud Storage
- API exposes content to mobile app

### Payments
1. App requests order from Strapi
2. Strapi creates Razorpay order
3. App completes payment with Razorpay SDK
4. Razorpay webhook notifies Strapi
5. Strapi updates premium status
6. Notifications sent to user and astrologers

## Development

### Mobile Development
```bash
cd mobile
npm start          # Start Expo dev server
npm run ios        # Run on iOS simulator
npm run android    # Run on Android emulator
npm run web        # Run in web browser
```

### Backend Development
```bash
cd backend
npm run develop    # Start with hot reload
npm run build      # Build for production
npm start          # Start production server
```

## Deployment

### Mobile App
Use EAS Build for production builds:
```bash
npm install -g eas-cli
eas build --platform ios
eas build --platform android
eas submit
```

### Backend
Deploy to GCP Cloud Run:
1. Create Cloud SQL PostgreSQL instance
2. Create Cloud Storage bucket
3. Configure environment variables
4. Deploy container to Cloud Run

See documentation files for detailed deployment instructions.

## Documentation

- [Frontend Architecture](frontend.md) — Detailed mobile/web app design and implementation
- [Backend Architecture](backend.md) — Detailed backend setup and data models
- [Mobile README](mobile/README.md) — Mobile/web app development guide
- [Backend README](backend/README.md) — Backend development guide
- [Tool Rework Plan](tool_rework_plan/README.md) — 16 Vedic tool Copilot prompts
- [Frontend Rework (#34)](extensive_frontend_rework/README.md) — MD3 migration Copilot prompts
- [Tool Analysis](tool_analysis/README.md) — Deep technical analysis of all Jyotish tools
- [Market Analysis](market_analysis/README.md) — Indian + global competitor research

## Design Principles

### Vedic Foundation
- **Sidereal by default**: Lahiri ayanamsa applied to all charts; tropical mode available as secondary option
- **Divination first**: Every chart screen surfaces predictions, Dasha timing, Yoga analysis, and Graha Shanti remedies — not raw numbers alone
- **Indian UX patterns**: Hindi/Devanagari labels alongside English; currency in ₹; Panchang and Muhurta as first-class features

### UI/UX
- **Material Design 3**: All UI components follow MD3 using `react-native-paper` and `react-native-paper-dates` — no custom pickers or alternative UI kits
- **Cross-platform adaptive**: Responsive two-column layout on web ≥ 768 px; single-column on mobile
- **Clean & Uncluttered**: Max 3 primary cards per screen; progressive disclosure
- **Warm & Grounded**: Calm guidance, modern spiritual aesthetic
- **Daily Ritual**: Habit-forming features with streaks

### Technical
- **Client-side Calculations**: Zero backend costs for astrology
- **Offline Support**: Core features work without internet
- **Type Safety**: TypeScript throughout
- **Modern Stack**: Latest stable versions
- **Scalable**: Cloud-native architecture

## Monetization

### Primary: Ad Revenue
- Strategic ad placement in feed
- Non-intrusive ad experience
- Daily engagement drives revenue

### Secondary: Premium Services
- Ask a Question (text consultation)
- Book a Call (voice consultation)
- Detailed Reports (PDF downloads)
- All via Razorpay integration

## Roadmap

### Phase 1: MVP (Complete)
- [x] Project boilerplate setup
- [x] Basic UI implementation
- [x] Firebase authentication (email/password + anonymous)
- [x] Forgot password flow (Firebase email reset)
- [x] Display name input on registration
- [x] Strapi content types
- [x] Core navigation
- [x] Push token registration + backend sync (`PUT /api/users/me/push-token`)
- [x] `last_login_at` tracking on User record

### Phase 2: Core Jyotish Features (Complete)
- [x] Swiss Ephemeris integration (sidereal / Lahiri ayanamsa)
- [x] Feed and blog content (live Strapi data with language + category filtering)
- [x] User profiles with birth details editing
- [x] Service requests: Ask a Question, Book a Call
- [x] Request a Report screen
- [x] Full Panchang screen (yoga, karana, sunrise/sunset, muhurat)
- [x] Remedy of the Day card in daily feed
- [x] Astrologer email + WhatsApp notifications on service request (SendGrid / Twilio)
- [x] User notification on service request completion

### Phase 3: Advanced Features (Complete)
- [x] Push notifications
- [x] Daily streak reminder
- [x] Analytics tracking
- [x] Multi-language support (English + Hindi)
- [x] Offline mode
- [x] Ad placeholder cards in feed

### Phase 4: Tool Rework — Full Vedic Suite (In Progress)
- [ ] MD3 frontend rework (see `extensive_frontend_rework/` — 16 prompts)
- [ ] Janma Kundli — full North Indian square wheel with Yogas + Graha Shanti
- [ ] Kundli Milan — Ashtakoot Guna Milan (36-point scoring) + Mangal Dosha
- [ ] Vimshottari Dasha — Mahadasha / Antardasha / Pratyantardasha timeline
- [ ] Gochar — current transit calculator with Sade Sati indicator
- [ ] Varshaphal — annual solar return chart
- [ ] Navamsa & Varga Charts — D9, D10, D12 divisional charts
- [ ] Panchang Vishesh — extended daily Panchang
- [ ] Muhurta — auspicious timing calculator
- [ ] Tithi & Chandra — moon phase + lunar calendar
- [ ] Nakshatra Vishesh — detailed nakshatra + pada analysis
- [ ] Grahan — eclipse calculator (solar + lunar) with Vedic significance
- [ ] Ashtakavarga — planetary strength grid (SAV)
- [ ] Prashna — horary / question-based chart
- [ ] Hora — planetary hours (Vedic)
- [ ] Graha Shanti — dedicated remedies screen
- [ ] Dainik Rashifal — daily Vedic horoscope with push notification config

### Phase 5: Production
- [ ] Cloud deployment
- [ ] App Store + Play Store submission
- [ ] Web deployment
- [ ] Marketing and analytics
- [ ] User feedback iteration

## Contributing

This is a private project. For questions or support, contact the development team.

## License

Proprietary - All rights reserved
