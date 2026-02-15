# Astrology App v2

A modern astrology application now split into two independent repositories: a React Native (Expo) frontend and a Strapi backend.

## 🎯 Repository Split

This repository has been reorganized to support independent frontend and backend development. The codebase is now structured with standalone directories that can be extracted into separate repositories:

```
astroappv2/
├── frontend-standalone/    # 📱 Ready-to-extract frontend repository
│   ├── src/                # React Native app source code
│   ├── README.md           # Frontend development guide
│   ├── ARCHITECTURE.md     # Frontend architecture
│   ├── CONTRIBUTING.md     # Frontend contribution guide
│   └── QUICKSTART.md       # Frontend quick start
│
├── backend-standalone/     # 🔧 Ready-to-extract backend repository
│   ├── src/                # Strapi backend source code
│   ├── README.md           # Backend development guide
│   ├── ARCHITECTURE.md     # Backend architecture
│   ├── CONTRIBUTING.md     # Backend contribution guide
│   └── QUICKSTART.md       # Backend quick start
│
├── frontend/               # Original frontend (for reference)
├── backend/                # Original backend (for reference)
└── README.md               # This file
```

## 📦 Standalone Directories

Each `*-standalone/` directory is a **complete, self-contained project** with:
- ✅ Its own `package.json` and dependencies
- ✅ Complete documentation (README, ARCHITECTURE, CONTRIBUTING, QUICKSTART)
- ✅ Proper `.gitignore` configuration
- ✅ All necessary configuration files
- ✅ No dependencies on parent directory

These directories are ready to be extracted into separate Git repositories.

## 🚀 Quick Start

### Working with Frontend

```bash
cd frontend-standalone
npm install
npm start
```

See [frontend-standalone/QUICKSTART.md](frontend-standalone/QUICKSTART.md) for detailed setup.

### Working with Backend

```bash
cd backend-standalone
npm install
npm run develop
```

See [backend-standalone/QUICKSTART.md](backend-standalone/QUICKSTART.md) for detailed setup.

## 📚 Documentation

### Frontend (Mobile App)
- 📱 **[Frontend README](frontend-standalone/README.md)** - Development guide
- 🏗️ **[Frontend Architecture](frontend-standalone/ARCHITECTURE.md)** - Technical details
- 🤝 **[Frontend Contributing](frontend-standalone/CONTRIBUTING.md)** - Contribution guide
- ⚡ **[Frontend Quick Start](frontend-standalone/QUICKSTART.md)** - Get started quickly

### Backend (API)
- 🔧 **[Backend README](backend-standalone/README.md)** - Development guide
- 🏗️ **[Backend Architecture](backend-standalone/ARCHITECTURE.md)** - Technical details
- 🤝 **[Backend Contributing](backend-standalone/CONTRIBUTING.md)** - Contribution guide
- ⚡ **[Backend Quick Start](backend-standalone/QUICKSTART.md)** - Get started quickly

## 🔄 Extracting Standalone Repositories

To create separate repositories from the standalone directories:

### Option 1: Manual Copy (Recommended)

```bash
# Create new frontend repository
git clone https://github.com/cinderbrick1212/astroappv2-frontend.git
cd astroappv2-frontend
cp -r ../astroappv2/frontend-standalone/* .
cp -r ../astroappv2/frontend-standalone/.* . 2>/dev/null || true
git add .
git commit -m "Initial commit from astroappv2 split"
git push origin main

# Create new backend repository
git clone https://github.com/cinderbrick1212/astroappv2-backend.git
cd astroappv2-backend
cp -r ../astroappv2/backend-standalone/* .
cp -r ../astroappv2/backend-standalone/.* . 2>/dev/null || true
git add .
git commit -m "Initial commit from astroappv2 split"
git push origin main
```

### Option 2: Git Subtree

```bash
# Extract frontend with history
git subtree split --prefix=frontend-standalone -b frontend-only
git push <frontend-repo-url> frontend-only:main

# Extract backend with history
git subtree split --prefix=backend-standalone -b backend-only
git push <backend-repo-url> backend-only:main
```

## Frontend - Mobile App (`frontend-standalone/`)

React Native mobile app built with Expo SDK 54, TypeScript, Firebase Auth, and React Query.

### Features
- 📱 Daily personalized feed with horoscopes and tips
- ✨ Client-side astrology tools (Kundli, Compatibility, Panchang)
- 🔐 Firebase authentication (Email, Phone, Google OAuth)
- 💰 Premium services (Ask Question, Call, Reports)
- 🌍 Multi-language support (English, Hindi)

### Tech Stack
- React Native + Expo SDK 54
- TypeScript
- React Navigation 6
- React Query
- Firebase Auth
- Axios

👉 See [frontend-standalone/README.md](frontend-standalone/README.md) for setup and development.

## Backend - API (`backend-standalone/`)

Headless CMS and API built with Strapi v5, TypeScript, PostgreSQL, and Firebase Admin SDK.

### Features
- 🎯 Content management for feed, blogs, and user data
- 🔒 Firebase token verification
- 📊 User profiles and premium status tracking
- 🖼️ Media management with Cloud Storage
- 📧 Email and WhatsApp notifications
- 💳 Razorpay payment integration

### Tech Stack
- Strapi v5
- TypeScript
- PostgreSQL (SQLite for dev)
- Firebase Admin SDK
- Razorpay
- Node.js 20+

👉 See [backend-standalone/README.md](backend-standalone/README.md) for setup and development.

## Development Workflow

### Working on Frontend

```bash
cd frontend-standalone
npm install
npm start
```

### Working on Backend

```bash
cd backend-standalone
npm install
npm run develop
```

Visit `http://localhost:1337/admin` for the Strapi admin panel.

### Working on Both

You can run both frontend and backend simultaneously in separate terminals for full-stack development.

## Architecture Overview

- **Firebase Auth**: User authentication (email/phone/Google)
- **Strapi**: Content management + REST API
- **GCP Cloud Run**: Backend hosting
- **Cloud SQL (Postgres)**: Backend database
- **Cloud Storage**: Media storage
- **Client-side astrology**: Calculations done in mobile app (no backend cost)

For detailed architecture, see:
- [frontend-standalone/ARCHITECTURE.md](frontend-standalone/ARCHITECTURE.md)
- [backend-standalone/ARCHITECTURE.md](backend-standalone/ARCHITECTURE.md)

## Repository History

The original `frontend/` and `backend/` directories are preserved for reference. All active development should use the `*-standalone/` directories.

## Next Steps

1. **Extract to Separate Repositories**: Follow the extraction guide above
2. **Set Up CI/CD**: Configure GitHub Actions for each repository
3. **Configure Environments**: Set up development, staging, and production environments
4. **Deploy**: Deploy backend to Cloud Run, frontend to App Store/Play Store

## License

Proprietary - All rights reserved
