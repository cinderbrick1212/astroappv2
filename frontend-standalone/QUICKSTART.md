# Frontend Quick Start Guide

This guide will help you get the Astrology App mobile frontend up and running quickly.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js 20+**: [Download](https://nodejs.org/)
- **npm** or **yarn**: Comes with Node.js
- **Expo CLI**: Install globally with `npm install -g expo-cli`
- **Git**: [Download](https://git-scm.com/)

For mobile development:
- **Expo Go app**: Install on your iOS/Android device from App Store/Play Store
- **iOS Simulator** (Mac only): Comes with Xcode
- **Android Studio**: For Android emulator

## Quick Setup (5 minutes)

### 1. Clone the Repository

```bash
git clone https://github.com/cinderbrick1212/astroappv2-frontend.git
cd astroappv2-frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

```bash
cp .env.example .env
# Edit .env with your configuration (see Configuration section below)
```

### 4. Start Development Server

```bash
npm start
```

**To test the app:**
- **On your phone**: Scan the QR code with Expo Go app
- **iOS Simulator** (Mac): Press `i`
- **Android Emulator**: Press `a`
- **Web Browser**: Press `w`

## What You'll See

- Login screen (Firebase authentication placeholder)
- Bottom tab navigation with 4 tabs:
  - **Feed**: Daily content feed (placeholder)
  - **Tools**: Astrology tools hub (placeholder)
  - **Home**: Dashboard (placeholder)
  - **Profile**: User profile (placeholder)

## Configuration

### Firebase Setup

To enable Firebase authentication:

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable Authentication methods (Email/Password, Google, Phone)
3. Get your Firebase config from Project Settings
4. Update `.env` with Firebase credentials:
   ```env
   FIREBASE_API_KEY=your-firebase-api-key
   FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   FIREBASE_PROJECT_ID=your-project-id
   FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   FIREBASE_MESSAGING_SENDER_ID=123456789
   FIREBASE_APP_ID=1:123456789:web:abcdef
   ```

### Backend API Configuration

Point the app to your backend API:

1. Update `STRAPI_API_URL` in `.env`:
   ```env
   STRAPI_API_URL=http://localhost:1337/api  # For local development
   # or
   STRAPI_API_URL=https://your-backend.com/api  # For production
   ```

### Payment Gateway (Razorpay)

For payment functionality:

1. Create a Razorpay account at [razorpay.com](https://razorpay.com)
2. Get your API key from dashboard
3. Update `.env`:
   ```env
   RAZORPAY_KEY_ID=rzp_test_xxxxx
   ```

## Next Steps

### Frontend Development

1. **Implement Firebase Authentication**
   - Update `src/screens/LoginScreen.tsx`
   - Wire up `useAuth` hook
   - Test login, signup, and logout flows

2. **Build Screen UIs**
   - Feed screen with horoscope cards
   - Tools screen with tool cards
   - Profile screen with user info

3. **Add Swiss Ephemeris**
   - Install astrology calculation library
   - Implement services in `src/services/`
   - Add Kundli, Compatibility, and Panchang features

4. **Integrate with Backend**
   - Connect to Strapi API
   - Fetch feed items and blog posts
   - Implement payment flows

5. **Add Features**
   - Push notifications
   - Offline support
   - Analytics tracking
   - Accessibility improvements

## Troubleshooting

### Frontend App Won't Start
```bash
rm -rf node_modules
npm install
npx expo start -c
```

### Firebase authentication not working
- Verify Firebase config in `.env`
- Check Firebase project settings
- Ensure auth methods are enabled in Firebase Console

### API calls failing
- Check backend server is running
- Verify `STRAPI_API_URL` in `.env`
- Check network connectivity
- Review API endpoint logs

### TypeScript Errors
```bash
npx tsc --noEmit
```

### Clear Cache
```bash
npx expo start -c
```

## Development Workflow

### Typical Day

1. **Start frontend app**:
   ```bash
   npm start
   ```

2. **Make changes**:
   - Edit files in `src/`
   - Hot reload will update automatically

3. **Test changes**:
   - Mobile: Shake device or press `m` for dev menu
   - Test on multiple platforms (iOS, Android, Web)

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/my-feature

# Make changes and commit
git add .
git commit -m "feat: add my feature"

# Push to remote
git push origin feature/my-feature
```

See [CONTRIBUTING.md](CONTRIBUTING.md) for commit message conventions.

## Resources

### Documentation
- [README](README.md) - Main documentation
- [ARCHITECTURE](ARCHITECTURE.md) - Architecture overview

### External Docs
- [React Native](https://reactnative.dev/)
- [Expo](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/)
- [React Query](https://tanstack.com/query/latest)
- [Firebase Auth](https://firebase.google.com/docs/auth)

## Support

For questions or issues:
1. Check the documentation files
2. Search existing issues
3. Create a new issue with details

## What's Next?

The frontend is set up! Here's a suggested development timeline:

1. **Week 1**: Authentication flows and user profile UI
2. **Week 2**: Feed screen with content from backend API
3. **Week 3**: Astrology tools implementation (Kundli, Compatibility, Panchang)
4. **Week 4**: Payment integration with Razorpay
5. **Week 5+**: Polish, testing, and app store deployment

Happy coding! 🚀
