# Astrology App v2

A modern astrology application split into two independent repositories: a React Native (Expo) frontend and a Strapi backend.

## Repository Structure

This project is organized as two self-contained applications that can be developed, deployed, and maintained independently:

```
astroappv2/
├── frontend/             # React Native Expo mobile app (standalone repo)
│   ├── src/              # Application source code
│   ├── README.md         # Frontend development guide
│   └── ARCHITECTURE.md   # Frontend architecture documentation
│
├── backend/              # Strapi CMS backend (standalone repo)
│   ├── src/              # API and backend source code
│   ├── README.md         # Backend development guide
│   └── ARCHITECTURE.md   # Backend architecture documentation
│
├── QUICKSTART.md         # Quick start guide
└── CONTRIBUTING.md       # Contributing guidelines
```

Each directory is a **self-contained project** with its own `package.json`, dependencies, configuration, and documentation. They are designed to be split into separate repositories if needed.

## Frontend (`frontend/`)

React Native mobile app built with Expo SDK 54, TypeScript, Firebase Auth, and React Query.

- 📱 Daily personalized feed with horoscopes and tips
- ✨ Client-side astrology tools (Kundli, Compatibility, Panchang)
- 🔐 Firebase authentication (Email, Phone, Google OAuth)
- 💰 Premium services (Ask Question, Call, Reports)
- 🌍 Multi-language support (English, Hindi)

👉 See [frontend/README.md](frontend/README.md) for setup and development instructions.

## Backend (`backend/`)

Headless CMS and API built with Strapi v5, TypeScript, PostgreSQL, and Firebase Admin SDK.

- 🎯 Content management for feed, blogs, and user data
- 🔒 Firebase token verification
- 📊 User profiles and premium status tracking
- 🖼️ Media management with Cloud Storage
- 📧 Email and WhatsApp notifications

👉 See [backend/README.md](backend/README.md) for setup and development instructions.

## Quick Start

### Backend

```bash
cd backend
npm install
npm run develop
```

Visit `http://localhost:1337/admin` to set up the admin panel.

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
# Edit .env with your configuration
npm start
```

See [QUICKSTART.md](QUICKSTART.md) for a detailed walkthrough.

## Architecture Overview

- **Firebase Auth**: User authentication (email/phone/Google)
- **Strapi**: Content management + REST API
- **GCP Cloud Run**: Backend hosting
- **Cloud SQL (Postgres)**: Backend database
- **Cloud Storage**: Media storage
- Client-side astrology calculations (no backend cost)

For detailed architecture, see:
- [frontend/ARCHITECTURE.md](frontend/ARCHITECTURE.md)
- [backend/ARCHITECTURE.md](backend/ARCHITECTURE.md)

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for development guidelines.

## License

Proprietary - All rights reserved
