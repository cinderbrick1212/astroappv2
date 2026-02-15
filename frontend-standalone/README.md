# Astrology App - Mobile Frontend

React Native mobile app for the Astrology App, built with Expo SDK 54, TypeScript, Firebase Auth, and React Query.

This repository contains the mobile frontend application that connects to the Astrology App backend API.

## Tech Stack

- **React Native**: Cross-platform mobile framework
- **Expo SDK 54**: Development platform
- **TypeScript**: Type-safe development
- **React Navigation 6**: Navigation library
- **React Query (@tanstack/react-query)**: Server state management
- **Firebase Auth**: User authentication
- **Axios**: HTTP client
- **AsyncStorage**: Local data persistence

## Project Structure

```
src/
├── api.ts                 # Axios API client
├── config.ts              # Environment configuration
├── firebase.ts            # Firebase initialization
├── navigation/            # Navigation components
│   ├── RootNavigator.tsx
│   ├── AuthNavigator.tsx
│   └── MainNavigator.tsx
├── screens/               # Screen components
│   ├── LoginScreen.tsx
│   ├── DailyFeedScreen.tsx
│   ├── ToolsScreen.tsx
│   ├── HomeScreen.tsx
│   └── ProfileScreen.tsx
├── components/            # Reusable components
│   ├── FeedHeader.tsx
│   ├── FeedItemCard.tsx
│   └── LoadingSkeleton.tsx
├── hooks/                 # Custom React hooks
│   ├── useAuth.ts
│   ├── useUserProfile.ts
│   ├── useFeedItems.ts
│   └── usePayments.ts
├── services/              # Business logic services
│   ├── astrologyEngine.ts
│   ├── kundli.ts
│   ├── compatibility.ts
│   ├── panchang.ts
│   └── horoscope.ts
├── utils/                 # Utility functions
│   ├── storage.ts
│   ├── dateHelpers.ts
│   └── validation.ts
├── types/                 # TypeScript types
│   └── index.ts
├── theme/                 # Design tokens
│   ├── colors.ts
│   ├── typography.ts
│   └── spacing.ts
└── locales/               # Translations
    ├── en.json
    └── hi.json
```

## Getting Started

### Prerequisites

- Node.js 20 or higher
- npm or yarn
- Expo CLI: `npm install -g expo-cli`
- iOS Simulator (Mac) or Android Studio (for Android development)
- Expo Go app (for testing on physical devices)

### Installation

```bash
npm install
```

### Configuration

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Fill in your environment variables:
```env
FIREBASE_API_KEY=your-firebase-api-key
FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_STORAGE_BUCKET=your-project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=123456789
FIREBASE_APP_ID=1:123456789:web:abcdef

STRAPI_API_URL=http://localhost:1337/api
RAZORPAY_KEY_ID=rzp_test_xxxxx
EXPO_PUBLIC_ENV=development
```

### Development

Start the development server:

```bash
npm start
```

Run on specific platforms:

```bash
# iOS (requires Mac)
npm run ios

# Android
npm run android

# Web
npm run web
```

### Build

For production builds, use EAS Build:

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Configure EAS
eas build:configure

# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android
```

## Features

### Authentication
- Firebase Email/Password authentication
- Google OAuth integration
- Phone authentication
- Guest mode

### Navigation
- Bottom tab navigation (Feed, Tools, Home, Profile)
- Stack navigation for screens
- Modal screens for detailed views

### Core Screens

#### 1. Feed Tab
- Daily personalized content feed
- Horoscope cards
- Blog posts
- Tips and remedies
- Streak tracking

#### 2. Tools Tab
- Kundli Lite (Birth chart summary)
- Compatibility calculator
- Daily Panchang
- Lucky factors

#### 3. Home Tab
- User dashboard
- Today's focus
- Quick actions
- Premium services

#### 4. Profile Tab
- Birth details
- Premium status
- Payment history
- Settings

### Services

All astrology calculations are performed **client-side**:

- **Kundli**: Birth chart calculations
- **Compatibility**: Ashtakoot Milan algorithm
- **Panchang**: Hindu calendar data
- **Horoscope**: Daily predictions
- **Lucky Factors**: Personalized lucky elements

*Note: Service implementations are placeholders and require Swiss Ephemeris integration.*

## State Management

### React Query
Used for server state management:
- Automatic caching
- Background refetching
- Optimistic updates
- Error handling

### AsyncStorage
Used for local persistence:
- Authentication tokens
- User preferences
- Cached data
- Offline support

## Styling

### Theme System
Centralized design tokens:
- **Colors**: Primary, secondary, semantic colors
- **Typography**: Font sizes, weights, families
- **Spacing**: Consistent spacing scale
- **Shadows**: Elevation system

### Design Principles
- Clean, uncluttered UI
- Progressive disclosure
- Warm, grounded mood
- Mobile-first approach

## API Integration

The app communicates with the Strapi backend:

### Authentication Flow
1. User logs in with Firebase Auth
2. App receives Firebase ID token
3. Token attached to all Strapi API calls
4. Strapi validates token and returns data

### API Endpoints (Strapi)
- `/users/me` - Get current user
- `/user-profiles/me` - Get/update user profile
- `/feed-items` - Get feed content
- `/blog-posts` - Get blog posts
- `/payments/create-order` - Create payment
- `/payments/verify` - Verify payment

## Testing

Run tests:
```bash
npm test
```

## Deployment

### iOS
1. Configure app signing in Apple Developer account
2. Build with EAS: `eas build --platform ios`
3. Submit to App Store: `eas submit --platform ios`

### Android
1. Configure app signing
2. Build with EAS: `eas build --platform android`
3. Submit to Play Store: `eas submit --platform android`

## Troubleshooting

### Common Issues

**App crashes on launch**
- Check Firebase configuration
- Verify Strapi API URL
- Clear cache: `npx expo start -c`

**Firebase authentication not working**
- Verify Firebase config in `.env`
- Check Firebase project settings
- Ensure auth methods are enabled

**API calls failing**
- Check Strapi server is running
- Verify API URL in `.env`
- Check network connectivity

## Next Steps

1. Implement Swiss Ephemeris integration for astrology calculations
2. Add Firebase authentication flows
3. Implement Razorpay payment integration
4. Add push notifications
5. Implement offline support
6. Add analytics tracking
7. Create UI/UX designs for all screens
8. Add comprehensive error handling
9. Implement accessibility features
10. Add unit and integration tests

## Documentation

- [React Native](https://reactnative.dev/)
- [Expo Documentation](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/)
- [React Query](https://tanstack.com/query/latest)
- [Firebase Auth](https://firebase.google.com/docs/auth)

## License

MIT
