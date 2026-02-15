# Astrology App v2

A modern astrology mobile application with React Native (Expo) frontend and Strapi backend, featuring client-side Vedic astrology calculations and monetization through ads and premium services.

## Project Overview

This is a complete astrology application platform consisting of:

- **Mobile App** (React Native + Expo): Cross-platform iOS/Android app with offline astrology calculations
- **Backend** (Strapi v5): Headless CMS for content management and API
- **Architecture**: Firebase Auth + Strapi + GCP deployment

## Key Features

### Mobile App
- 📱 Daily personalized feed with horoscopes and tips
- ✨ Client-side astrology tools (Kundli, Compatibility, Panchang)
- 🔐 Firebase authentication (Email, Phone, Google OAuth)
- 💰 Premium services (Ask Question, Call, Reports)
- 🌍 Multi-language support (English, Hindi)
- 📊 Streak tracking and habit formation
- 🎨 Clean, modern UI with progressive disclosure

### Backend
- 🎯 Content management for feed, blogs, and user data
- 💳 Payment processing with Razorpay
- 📧 Email and WhatsApp notifications
- 🔒 Firebase token verification
- 📊 User profiles and premium status tracking
- 🖼️ Media management with Cloud Storage

## Project Structure

```
astroappv2/
├── mobile/               # React Native Expo app
│   ├── src/
│   │   ├── navigation/   # App navigation
│   │   ├── screens/      # UI screens
│   │   ├── components/   # Reusable components
│   │   ├── services/     # Astrology calculations
│   │   ├── hooks/        # Custom React hooks
│   │   ├── utils/        # Utility functions
│   │   ├── theme/        # Design tokens
│   │   └── types/        # TypeScript types
│   └── README.md
│
├── backend/              # Strapi CMS
│   ├── src/
│   │   ├── api/          # API endpoints
│   │   └── config/       # Configuration
│   └── README.md
│
├── frontend.md           # Frontend architecture documentation
├── backend.md            # Backend architecture documentation
└── README.md            # This file
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
- **Client-side**: All astrology calculations (Kundli, Horoscope, Compatibility)
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

- [Frontend Architecture](frontend.md) - Detailed mobile app design and implementation
- [Backend Architecture](backend.md) - Detailed backend setup and data models
- [Mobile README](mobile/README.md) - Mobile app development guide
- [Backend README](backend/README.md) - Backend development guide

## Design Principles

### UI/UX
- **Clean & Uncluttered**: Max 3 primary cards per screen
- **Progressive Disclosure**: Summary first, details on tap
- **Warm & Grounded**: Calm guidance, modern spiritual aesthetic
- **Daily Ritual**: Habit-forming features with streaks
- **Mainstream Appeal**: Simple, accessible tools

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

### Phase 1: MVP (Current)
- [x] Project boilerplate setup
- [ ] Basic UI implementation
- [ ] Firebase authentication
- [ ] Strapi content types
- [ ] Core navigation

### Phase 2: Core Features
- [ ] Astrology engine integration
- [ ] Feed and blog content
- [ ] User profiles
- [ ] Payment integration

### Phase 3: Advanced Features
- [ ] Push notifications
- [ ] Analytics tracking
- [ ] Multi-language support
- [ ] Offline mode

### Phase 4: Production
- [ ] Cloud deployment
- [ ] App store submission
- [ ] Marketing and analytics
- [ ] User feedback iteration

## Contributing

This is a private project. For questions or support, contact the development team.

## License

Proprietary - All rights reserved
