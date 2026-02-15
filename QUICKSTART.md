# ⚠️ REPOSITORY DEPRECATED

> **This repository has been archived and is no longer maintained.**
> 
> The monorepo has been split into separate repositories:
> 
> - **Backend**: [cinderbrick1212/astroappv2backend](https://github.com/cinderbrick1212/astroappv2backend)
> - **Frontend/Mobile**: [cinderbrick1212/astroappv2frontend](https://github.com/cinderbrick1212/astroappv2frontend)
> 
> ## For New Developers
> 
> Please use the quick start guides in the new repositories:
> 
> - **Backend Setup**: See [astroappv2backend/README.md](https://github.com/cinderbrick1212/astroappv2backend)
> - **Frontend/Mobile Setup**: See [astroappv2frontend/README.md](https://github.com/cinderbrick1212/astroappv2frontend)
> 
> Each repository contains its own setup instructions, dependencies, and documentation.

---

## Original Quick Start Guide (For Reference Only)

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
git clone https://github.com/cinderbrick1212/astroappv2.git
cd astroappv2
```

### 2. Backend Setup

```bash
cd backend
npm install
npm run develop
```

The Strapi admin panel will open at `http://localhost:1337/admin`

**First time setup:**
1. Create your admin account
2. You're ready to go! (Content types will be added later)

Leave this terminal running.

### 3. Mobile App Setup

Open a new terminal:

```bash
cd mobile
npm install
npm start
```

**To test the app:**
- **On your phone**: Scan the QR code with Expo Go app
- **iOS Simulator** (Mac): Press `i`
- **Android Emulator**: Press `a`
- **Web Browser**: Press `w`

## What You'll See

### Mobile App
- Login screen (placeholder)
- Bottom tab navigation with 4 tabs:
  - **Feed**: Daily content feed (placeholder)
  - **Tools**: Astrology tools hub (placeholder)
  - **Home**: Dashboard (placeholder)
  - **Profile**: User profile (placeholder)

### Backend
- Strapi admin panel at `http://localhost:1337/admin`
- Empty content types (ready to be configured)

## Configuration

### Firebase Setup (Optional for now)

To enable authentication:

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable Authentication methods (Email/Password, Google, Phone)
3. Get your Firebase config
4. Create `mobile/.env` from `mobile/.env.example`
5. Fill in Firebase credentials

### Backend Database (Production)

The backend uses SQLite by default (development). For production:

1. Set up PostgreSQL database
2. Update `backend/.env` with database credentials
3. Restart Strapi

## Next Steps

### Mobile Development

1. **Implement Firebase Authentication**
   - Update `src/screens/LoginScreen.tsx`
   - Wire up `useAuth` hook

2. **Build Screen UIs**
   - Feed screen with horoscope cards
   - Tools screen with tool cards
   - Profile screen with user info

3. **Add Swiss Ephemeris**
   - Install astrology calculation library
   - Implement services in `src/services/`

### Backend Development

1. **Create Content Types**
   - User, UserProfile, FeedItem, BlogPost
   - Payment, ServiceRequest
   - See `backend/README.md` for details

2. **Add Custom Controllers**
   - Payment endpoints
   - Service request handlers

3. **Configure Integrations**
   - Razorpay for payments
   - Email provider
   - WhatsApp API

## Troubleshooting

### Mobile App Won't Start
```bash
cd mobile
rm -rf node_modules
npm install
npx expo start -c
```

### Backend Won't Start
```bash
cd backend
rm -rf node_modules
npm install
npm run develop
```

### TypeScript Errors
```bash
# In mobile/ or backend/
npx tsc --noEmit
```

### Clear All Caches
```bash
# Mobile
cd mobile
npx expo start -c

# Backend  
cd backend
rm -rf .cache build
npm run develop
```

## Development Workflow

### Typical Day

1. **Start backend** (one time):
   ```bash
   cd backend && npm run develop
   ```

2. **Start mobile app** (one time):
   ```bash
   cd mobile && npm start
   ```

3. **Make changes**:
   - Edit files in `mobile/src/` or `backend/src/`
   - Hot reload will update automatically

4. **Test changes**:
   - Mobile: Shake device or press `m` for menu
   - Backend: Changes reflect immediately

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/my-feature

# Make changes and commit
git add .
git commit -m "Add my feature"

# Push to remote
git push origin feature/my-feature
```

## Resources

### Documentation
- [Project README](README.md)
- [Frontend Architecture](frontend.md)
- [Backend Architecture](backend.md)
- [Mobile README](mobile/README.md)
- [Backend README](backend/README.md)

### External Docs
- [React Native](https://reactnative.dev/)
- [Expo](https://docs.expo.dev/)
- [Strapi](https://docs.strapi.io/)
- [React Navigation](https://reactnavigation.org/)
- [React Query](https://tanstack.com/query/latest)

## Support

For questions or issues:
1. Check the documentation files
2. Search existing issues
3. Create a new issue with details

## What's Next?

The boilerplate is set up! Here's what to build next:

1. **Week 1**: Authentication flows and user profile
2. **Week 2**: Feed screen with content from Strapi
3. **Week 3**: Astrology tools implementation
4. **Week 4**: Payment integration
5. **Week 5+**: Polish, testing, and deployment

Happy coding! 🚀
