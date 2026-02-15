# Backend Architecture and Setup

This document defines the backend architecture and full data flow for the project using Firebase Auth + Strapi on GCP + GCP services. It also includes a verbose, step-by-step setup process. It is written for both human readers and an AI model that needs unambiguous implementation guidance.

---

## 1) Goals and Scope

We are implementing a backend that focuses on:

- Payments (Razorpay)
- User data (profiles, premium status)
- Feed and blog content (text + images)
- Paid services (ask a question, call, reports) tracked and routed to astrologers

Astrology calculations (horoscope, kundli, compatibility) are **client-side** inside the React Native app. The backend does **not** compute astrology outputs.

---

## 2) Architecture Overview (Firebase + Strapi + GCP)

### Core Services

- **Firebase Auth**: User authentication (email/phone/Google). Only authentication, not data storage.
- **Strapi**: Content management + REST/GraphQL API for users, feed, blogs, and paid service records.
- **GCP Cloud Run**: Hosts Strapi as a containerized service.
- **Cloud SQL (Postgres)**: Strapi database (users, feed, blogs, payments, service requests).
- **Cloud Storage**: Media storage for blog images and assets.
- **Razorpay**: Payment gateway with server-side verification.
- **Email provider** (SendGrid/Mailgun): Transactional emails.
- **WhatsApp provider** (Meta Cloud API / Twilio / Gupshup): Automatic notifications to astrologers and users.

### Why This Split

- Firebase Auth gives reliable, proven login flows.
- Strapi gives a clean admin UI for astrologers to manage content with text + images.
- GCP hosting keeps everything scalable and easy to deploy.

---

## 2.1) Current Implementation Status (Repo)

This section reflects what is already in the repository vs what still needs to be built.

### Done

- Strapi v5 project scaffolded with TypeScript.
- SQLite development database configured by default.
- Postgres configuration supported via environment variables in [backend/config/database.ts](backend/config/database.ts).
- GCS upload provider configured in [backend/config/plugins.ts](backend/config/plugins.ts).
- CSP updated to allow GCS media in [backend/config/middlewares.ts](backend/config/middlewares.ts).
- Cloud Run environment template present in [backend/cloudrun.env.yaml](backend/cloudrun.env.yaml).
- Base admin/auth secrets wired via [backend/config/admin.ts](backend/config/admin.ts) and [backend/.env.example](backend/.env.example).

### Not Done Yet

- Strapi content types for User, UserProfile, FeedItem, BlogPost, Payment, ServiceRequest.
- Firebase token verification middleware or policy.
- Custom endpoints for Razorpay order creation and webhook verification.
- Email and WhatsApp notification providers.
- Cloud Run deployment automation (CI/CD, secrets management).
- Role/permission setup for authenticated users and astrologer/admin roles.

---

## 2.2) Verification Checklist

Use this to confirm the current repo state is working as expected.

- Strapi boots locally with `npm run develop` in `backend/`.
- Admin panel loads at `http://localhost:1337/admin`.
- Uploads use GCS provider when env vars are set (see [backend/config/plugins.ts](backend/config/plugins.ts)).
- CSP allows GCS assets (see [backend/config/middlewares.ts](backend/config/middlewares.ts)).
- Postgres config activates when `DATABASE_CLIENT=postgres` is set (see [backend/config/database.ts](backend/config/database.ts)).

---

## 3) Data Flow (End-to-End)

### 3.1 User Authentication Flow

1. User logs in on mobile app using Firebase Auth.
2. App receives a Firebase ID token.
3. App calls Strapi API with `Authorization: Bearer <firebase_id_token>`.
4. Strapi verifies the Firebase token and creates/updates a user record in Postgres.
5. Strapi returns a session response including user profile and premium status.

### 3.2 Feed and Blog Content Flow

1. Astrologers log into Strapi Admin.
2. They create or edit feed items and blog posts (text + image fields).
3. Images are uploaded to Strapi Media Library and stored in Cloud Storage.
4. Mobile app fetches feed and blog content via Strapi API.
5. App renders feed items and blog posts with text + images.

### 3.3 User Profile Flow

1. User submits birth details in the app.
2. App sends profile data to Strapi API.
3. Strapi saves to Postgres and returns updated profile.

### 3.4 Payments and Premium Flow

1. App requests payment order from Strapi.
2. Strapi calls Razorpay to create an order.
3. App completes payment using Razorpay SDK.
4. Razorpay sends webhook to Strapi.
5. Strapi verifies signature, updates payment record, and upgrades premium status.
6. Strapi sends confirmation:
   - Email to user.
   - WhatsApp + email to astrologers with service details.

### 3.5 Paid Service Request Flow (Ask Question / Call / Reports)

1. User selects a paid service after payment.
2. App creates a service request in Strapi.
3. Strapi stores request and triggers notifications:
   - WhatsApp message to astrologers.
   - Email message to astrologers.
4. Astrologer updates the request status or response in Strapi Admin.
5. User can see updates in-app (optional).

### 3.6 Astrology Engine Flow (Client-Side Only)

1. App calculates horoscope/kundli/compatibility locally.
2. No server calls required for astrology.
3. Works offline and reduces backend costs.

---

## 4) Key Data Models (Strapi Content Types)

Define these in Strapi as Content Types:

- **User**
  - firebase_uid, email, phone, name
  - premium_status, premium_expires_at

- **UserProfile**
  - birth_date, birth_time, birth_place, timezone, gender

- **FeedItem**
  - type, title, summary, body, media (image)
  - language_code, published_at, priority, is_active

- **BlogPost**
  - title, excerpt, body, featured_image
  - categories, author, published_at

- **Payment**
  - user, razorpay_order_id, razorpay_payment_id, razorpay_signature
  - amount, currency, status, plan_type, created_at

- **ServiceRequest**
  - user, service_type (question/call/report)
  - status, user_notes, response_text
  - created_at, updated_at

---

## 5) Security Model

- **Firebase Auth** tokens are required for all user-facing API calls.
- Strapi must validate tokens (JWT verification using Firebase public keys).
- Admin UI is restricted by role:
  - Astrologers (content + service request access)
  - Internal admins (full access)

---

## 6) Setup Process (Verbose Step-by-Step)

This section explains a full setup from scratch.

### 6.1 Prerequisites

Install and configure:

- Node.js 20+
- Docker (for local Postgres or Strapi dev)
- Firebase CLI
- Google Cloud SDK

### 6.2 Firebase Auth Setup

1. Create a Firebase project.
2. Enable providers: Email/Password, Phone, Google.
3. Obtain Firebase config keys for the mobile app.
4. Enable Authentication in Firebase console.

### 6.3 Strapi Setup (Local)

1. Strapi project already exists in `backend/`.
2. Default DB is SQLite; Postgres is available via env config in [backend/config/database.ts](backend/config/database.ts).
3. Copy [backend/.env.example](backend/.env.example) to `.env` and fill values.
4. Run Strapi locally and create the admin user.
5. Add content types listed in Section 4.
6. Configure roles and permissions for authenticated users.

### 6.4 Strapi Setup (GCP)

1. Create a Cloud SQL Postgres instance.
2. Create a Cloud Storage bucket for media.
3. Dockerfile already exists in `backend/Dockerfile`.
4. Deploy Strapi to Cloud Run.
5. Configure environment variables (see [backend/cloudrun.env.yaml](backend/cloudrun.env.yaml) for a template):
   - Database URL
   - JWT secrets
   - Firebase public keys or token verification settings
   - Storage bucket info
   - Razorpay keys
   - Email provider keys
   - WhatsApp API keys

### 6.5 Environment Variables (Baseline)

Start from [backend/.env.example](backend/.env.example). Minimum local values:

- `HOST`, `PORT`, `APP_KEYS`
- `API_TOKEN_SALT`, `ADMIN_JWT_SECRET`, `TRANSFER_TOKEN_SALT`, `JWT_SECRET`, `ENCRYPTION_KEY`
- `DATABASE_CLIENT` + DB connection fields (or leave defaults for SQLite)

When enabling GCS uploads:

- `GCS_BUCKET_NAME`
- `GCS_BASE_PATH` (optional)
- `GCS_BASE_URL` (optional)
- `GCS_PUBLIC_FILES`, `GCS_UNIFORM`

### 6.6 Token Verification (Firebase -> Strapi)

1. Strapi should verify Firebase JWT tokens on every request.
2. Use Firebase Admin SDK in Strapi to validate tokens.
3. On valid token, map Firebase user to Strapi user record.

### 6.7 Payments and Webhooks

1. Add Razorpay keys to Strapi.
2. Create endpoints:
   - `POST /payments/create-order`
   - `POST /payments/verify` or webhook handler
3. Razorpay webhook updates payment status and user premium state.

### 6.8 Email + WhatsApp Notifications

1. Add email provider (SendGrid/Mailgun) to Strapi.
2. Add WhatsApp provider (Meta Cloud API/Twilio/Gupshup).
3. On payment success:
   - Send email to user confirmation.
   - Send WhatsApp + email to astrologers with user details and service info.

### 6.9 Role and Permission Setup

1. Define roles for authenticated users, astrologers, and admins.
2. Restrict content types and endpoints per role.
3. Lock down public permissions to read-only content as needed.

### 6.10 Mobile App Integration

1. Use Firebase Auth for login.
2. Store Firebase ID token.
3. Attach token to Strapi API calls.
4. Use Strapi endpoints for:
   - Feed
   - Blogs
   - User profiles
   - Payments
   - Service requests
5. Keep astrology calculations in the app only.

---

## 7) Operational Notes

- Firestore is **not** used in this design; only Firebase Auth.
- All data lives in Postgres (Cloud SQL) through Strapi.
- Media is in Cloud Storage through Strapi upload provider.
- Payments and notifications are handled in Strapi custom controllers or plugins.

---

## 8) Next Steps (Implementation Roadmap)

### Content Types + Roles

1. Create the content types in Section 4.
2. Add relations between User and UserProfile, Payment, ServiceRequest.
3. Configure role permissions and default scopes.

### Auth (Firebase)

1. Add Firebase Admin SDK.
2. Implement token verification middleware.
3. Map Firebase UID to Strapi user on first request.

### Payments + Notifications

1. Create order and webhook endpoints for Razorpay.
2. Update Payment and premium status on webhook verification.
3. Add email and WhatsApp notification providers.

### Deployment + Operations

1. Add CI/CD for Cloud Run builds.
2. Move secrets to a managed store (GCP Secret Manager).
3. Verify GCS upload in production.

### Mobile Integration

1. Attach Firebase token to Strapi API requests.
2. Wire feeds, profiles, payments, and service requests.
3. Add error handling and retry logic.

---

## 9) Notes for AI Model

- Do not implement astrology logic in backend.
- Treat Firebase only as authentication.
- Treat Strapi as the single source of truth for user profiles, feed, blogs, and paid service tracking.
- Ensure all endpoints are protected by Firebase token validation.
- Use Postgres for storage and Cloud Storage for media.
- Always send payment confirmation to both user and astrologer team.
