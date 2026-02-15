# Quick Start Guide - Split Repository

This guide helps you work with the split repository structure where frontend and backend are in standalone directories.

## 🎯 What's Changed

The repository has been reorganized with `frontend-standalone/` and `backend-standalone/` directories that are ready to be extracted into separate repositories. Each directory is completely self-contained.

## 📋 Choose Your Path

### Option A: Working on Frontend Only

If you're only working on the mobile app, go directly to the frontend:

```bash
cd frontend-standalone
```

Then follow the [frontend-standalone/QUICKSTART.md](frontend-standalone/QUICKSTART.md) guide.

### Option B: Working on Backend Only

If you're only working on the API, go directly to the backend:

```bash
cd backend-standalone
```

Then follow the [backend-standalone/QUICKSTART.md](backend-standalone/QUICKSTART.md) guide.

### Option C: Working on Both (Full Stack)

If you're working on both frontend and backend, follow the guide below.

## Prerequisites

Before you begin, ensure you have:

- **Node.js 20+**: [Download](https://nodejs.org/)
- **npm** or **yarn**: Comes with Node.js
- **Git**: [Download](https://git-scm.com/)

**For Frontend Development:**
- **Expo CLI**: `npm install -g expo-cli`
- **Expo Go app**: Install on your phone (App Store/Play Store)
- **iOS Simulator** (Mac only) or **Android Studio** for emulator

**For Backend Development:**
- **PostgreSQL**: For production (optional, SQLite used in development)

## Full Stack Setup (10 minutes)

### 1. Clone the Repository

```bash
git clone https://github.com/cinderbrick1212/astroappv2.git
cd astroappv2
```

### 2. Backend Setup (Terminal 1)

```bash
cd backend-standalone
npm install
npm run develop
```

The Strapi admin panel will open at `http://localhost:1337/admin`

**First time setup:**
1. Create your admin account
2. Content types are pre-configured

**Keep this terminal running.**

### 3. Frontend Setup (Terminal 2)

Open a new terminal window:

```bash
cd astroappv2/frontend-standalone
npm install
cp .env.example .env
# Edit .env and set STRAPI_API_URL=http://localhost:1337/api
npm start
```

**To test the app:**
- **On your phone**: Scan QR code with Expo Go
- **iOS Simulator**: Press `i`
- **Android Emulator**: Press `a`
- **Web Browser**: Press `w`

## What You'll See

### Mobile App
- Login screen with Firebase authentication
- Bottom tab navigation with 4 tabs:
  - **Feed**: Daily content feed
  - **Tools**: Astrology tools hub
  - **Home**: Dashboard
  - **Profile**: User profile

### Backend
- Strapi admin panel at `http://localhost:1337/admin`
- Pre-configured content types (User, UserProfile, FeedItem, BlogPost, Payment, ServiceRequest)

## Configuration

### Firebase Setup

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable Authentication methods (Email/Password, Google, Phone)
3. Download service account JSON for backend
4. Get Firebase config for frontend
5. Update environment variables (see individual QUICKSTART guides)

### Environment Variables

**Backend** (`backend-standalone/.env`):
- Firebase service account key
- Razorpay credentials
- Database connection (if using PostgreSQL)

**Frontend** (`frontend-standalone/.env`):
- Firebase configuration
- Strapi API URL
- Razorpay key ID

See detailed guides:
- [backend-standalone/QUICKSTART.md](backend-standalone/QUICKSTART.md)
- [frontend-standalone/QUICKSTART.md](frontend-standalone/QUICKSTART.md)

## Next Steps

Choose based on what you're working on:

### Frontend Development
📱 See [frontend-standalone/QUICKSTART.md](frontend-standalone/QUICKSTART.md) for:
- Implementing authentication flows
- Building screen UIs
- Adding astrology calculations
- Payment integration

### Backend Development
🔧 See [backend-standalone/QUICKSTART.md](backend-standalone/QUICKSTART.md) for:
- Content management
- Custom API endpoints
- Payment processing
- Deployment to Cloud Run

### Both
Work through both guides sequentially.

## Troubleshooting

### Frontend Issues
See [frontend-standalone/QUICKSTART.md](frontend-standalone/QUICKSTART.md#troubleshooting)

### Backend Issues
See [backend-standalone/QUICKSTART.md](backend-standalone/QUICKSTART.md#troubleshooting)

### Common Full Stack Issues

**Frontend can't connect to backend:**
- Ensure backend is running (`http://localhost:1337`)
- Check `STRAPI_API_URL` in `frontend-standalone/.env`
- Verify no firewall blocking localhost

**Authentication not working:**
- Verify Firebase is configured in both frontend and backend
- Check Firebase service account in backend
- Ensure Firebase config in frontend .env

## Development Workflow

### Daily Development

**Backend** (Terminal 1):
```bash
cd backend-standalone
npm run develop
```

**Frontend** (Terminal 2):
```bash
cd frontend-standalone
npm start
```

### Git Workflow

```bash
# Work in the appropriate directory
cd frontend-standalone  # or backend-standalone

# Create feature branch
git checkout -b feature/my-feature

# Make changes and commit
git add .
git commit -m "feat: add my feature"

# Push to remote
git push origin feature/my-feature
```

Note: Changes in either `frontend-standalone/` or `backend-standalone/` can be committed from the repository root.

## Resources

### Repository Documentation
- [Main README](README.md) - Repository overview and extraction guide
- [Frontend README](frontend-standalone/README.md) - Frontend development
- [Backend README](backend-standalone/README.md) - Backend development
- [Frontend Architecture](frontend-standalone/ARCHITECTURE.md) - Frontend technical details
- [Backend Architecture](backend-standalone/ARCHITECTURE.md) - Backend technical details

### External Documentation
- [React Native](https://reactnative.dev/)
- [Expo](https://docs.expo.dev/)
- [Strapi](https://docs.strapi.io/)
- [Firebase](https://firebase.google.com/docs)
- [React Navigation](https://reactnavigation.org/)
- [React Query](https://tanstack.com/query/latest)

## Extracting to Separate Repositories

When ready to split into separate repositories, see the [main README](README.md#-extracting-standalone-repositories) for extraction instructions.

## Support

For questions or issues:
1. Check the relevant documentation (frontend or backend)
2. Review the architecture documentation
3. Search existing issues
4. Create a new issue with details

## What's Next?

The split repository structure is ready! Next steps:

1. **Immediate**: Continue development in `*-standalone/` directories
2. **Soon**: Extract to separate GitHub repositories
3. **Later**: Set up separate CI/CD pipelines for each repo

Happy coding! 🚀
