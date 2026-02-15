# Backend - Strapi CMS

This is the backend service for the Astrology App, built with Strapi v5.

## Tech Stack

- **Strapi v5**: Headless CMS and API
- **TypeScript**: Type-safe development
- **Firebase Admin SDK**: Authentication
- **Razorpay**: Payment processing
- **SQLite**: Development database (switch to PostgreSQL for production)
- **Node.js 20+**: Runtime environment

## Getting Started

### Prerequisites

- Node.js 20 or higher
- npm or yarn

### Installation

```bash
cd backend
npm install
```

### Configuration

1. Copy `.env.example` to `.env`
2. Update the environment variables with your values

```env
HOST=0.0.0.0
PORT=1337
APP_KEYS=your-app-keys
API_TOKEN_SALT=your-api-token-salt
ADMIN_JWT_SECRET=your-admin-jwt-secret
TRANSFER_TOKEN_SALT=your-transfer-token-salt
JWT_SECRET=your-jwt-secret
ENCRYPTION_KEY=your-encryption-key

# Firebase Admin SDK (optional for local dev)
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account",...}

# Razorpay (required for payments)
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret

# Notification settings (optional)
ASTROLOGER_EMAILS=astrologer1@example.com,astrologer2@example.com
ASTROLOGER_PHONES=+919876543210,+919876543211
```

### Development

Start the development server:

```bash
npm run develop
```

The admin panel will be available at `http://localhost:1337/admin`

First time setup:
1. Navigate to `http://localhost:1337/admin`
2. Create your first admin user
3. Content types are pre-configured via schema files

### Build

Build the project:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

## Architecture

### Content Types

The following content types are automatically created from schemas:

#### User
- `firebase_uid` (String, unique) - Firebase authentication ID
- `email` (Email)
- `phone` (String)
- `name` (String)
- `premium_status` (Boolean)
- `premium_expires_at` (DateTime)

#### UserProfile
- `user` (Relation to User, one-to-one)
- `birth_date` (Date)
- `birth_time` (Time)
- `birth_place` (String)
- `timezone` (String)
- `gender` (Enumeration: male, female, other)
- `latitude` (Decimal)
- `longitude` (Decimal)

#### FeedItem
- `type` (Enumeration: daily_horoscope, tip, news, announcement)
- `title` (String)
- `summary` (Text)
- `body` (Rich Text)
- `media` (Media - single image)
- `language_code` (String, default: 'en')
- `priority` (Integer)
- `is_active` (Boolean)

#### BlogPost
- `title` (String)
- `excerpt` (Text)
- `body` (Rich Text)
- `featured_image` (Media - single)
- `categories` (JSON)
- `author` (String)
- `slug` (UID)

#### Payment
- `user` (Relation to User)
- `razorpay_order_id` (String)
- `razorpay_payment_id` (String)
- `razorpay_signature` (String)
- `amount` (Decimal)
- `currency` (String)
- `status` (Enumeration: created, pending, captured, failed)
- `plan_type` (Enumeration: monthly, yearly, question, call, report)

#### ServiceRequest
- `user` (Relation to User)
- `service_type` (Enumeration: question, call, report)
- `status` (Enumeration: pending, in_progress, completed, cancelled)
- `user_notes` (Text)
- `response_text` (Rich Text)
- `payment` (Relation to Payment, one-to-one)

## API Endpoints

All endpoints require Firebase ID token in Authorization header (except webhooks and public GET endpoints):
```
Authorization: Bearer <firebase_id_token>
```

### User Endpoints

- `GET /api/users/me` - Get current user profile
- `PUT /api/users/me` - Update current user (name, phone)

### User Profile Endpoints

- `GET /api/user-profile/me` - Get current user's profile
- `POST /api/user-profile` - Create user profile
- `PUT /api/user-profile` - Update user profile

### Feed & Blog Endpoints

- `GET /api/feed-items` - Get all feed items (public)
- `GET /api/blog-posts` - Get all blog posts (public)

### Payment Endpoints

- `POST /api/payments/create-order` - Create Razorpay order
  - Body: `{ amount: number, plan_type: string }`
  - Returns: `{ orderId, amount, currency, paymentId }`

- `POST /api/payments/verify` - Verify payment after completion
  - Body: `{ razorpay_order_id, razorpay_payment_id, razorpay_signature }`
  - Returns: `{ success: boolean, message: string }`

- `POST /api/payments/webhook` - Razorpay webhook handler (no auth required)

### Service Request Endpoints

- `POST /api/service-requests` - Create service request
  - Body: `{ service_type: string, user_notes?: string, payment_id?: number }`
  
- `GET /api/service-requests/my-requests` - Get user's service requests

- `PUT /api/service-requests/:id/status` - Update service request status
  - Body: `{ status: string, response_text?: string }`

## Authentication

The backend uses Firebase Admin SDK to verify Firebase ID tokens. On the first authenticated request, a user record is automatically created in Strapi based on the Firebase user data.

### Authentication Flow

1. User authenticates with Firebase Auth in the mobile app
2. App receives Firebase ID token
3. App includes token in `Authorization: Bearer <token>` header
4. Strapi middleware verifies token using Firebase Admin SDK
5. User record is created/retrieved from database
6. Request proceeds with user context

## Payment Flow

1. User initiates payment in app
2. App calls `POST /api/payments/create-order`
3. Backend creates Razorpay order and payment record
4. App completes payment using Razorpay SDK
5. App calls `POST /api/payments/verify` with payment details
6. Backend verifies signature and updates payment status
7. If premium plan, user's premium status is updated
8. Notifications sent to user and astrologers (if configured)

## Notifications

Basic notification service is implemented with placeholders for:
- Email notifications (SendGrid/Mailgun integration ready)
- WhatsApp notifications (Twilio/Meta Cloud API integration ready)

Current notification triggers:
- Payment confirmation (to user)
- New service request (to astrologers)
- Service request completion (to user)

## Deployment

For deployment to GCP Cloud Run:

1. Build Docker image using provided Dockerfile
2. Set up Cloud SQL (PostgreSQL)
3. Configure Cloud Storage bucket for media
4. Set environment variables in Cloud Run
5. Deploy container

See [DEPLOYMENT.md](DEPLOYMENT.md) for step-by-step Cloud Run + Postgres + GCS setup and baseline verification.

See [ARCHITECTURE.md](ARCHITECTURE.md) for detailed deployment instructions.

## 📚 Learn More

- [Strapi documentation](https://docs.strapi.io)
- [Strapi TypeScript](https://docs.strapi.io/dev-docs/typescript)
- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)
- [Razorpay API](https://razorpay.com/docs/api/)

---

## 🚀 Getting started with Strapi

Strapi comes with a full featured [Command Line Interface](https://docs.strapi.io/dev-docs/cli) (CLI) which lets you scaffold and manage your project in seconds.

### `develop`

Start your Strapi application with autoReload enabled. [Learn more](https://docs.strapi.io/dev-docs/cli#strapi-develop)

```
npm run develop
# or
yarn develop
```

### `start`

Start your Strapi application with autoReload disabled. [Learn more](https://docs.strapi.io/dev-docs/cli#strapi-start)

```
npm run start
# or
yarn start
```

### `build`

Build your admin panel. [Learn more](https://docs.strapi.io/dev-docs/cli#strapi-build)

```
npm run build
# or
yarn build
```

## ⚙️ Deployment

Strapi gives you many possible deployment options for your project including [Strapi Cloud](https://cloud.strapi.io). Browse the [deployment section of the documentation](https://docs.strapi.io/dev-docs/deployment) to find the best solution for your use case.

```
yarn strapi deploy
```

## ✨ Community

- [Discord](https://discord.strapi.io) - Come chat with the Strapi community including the core team.
- [Forum](https://forum.strapi.io/) - Place to discuss, ask questions and find answers, show your Strapi project and get feedback or just talk with other Community members.
- [Awesome Strapi](https://github.com/strapi/awesome-strapi) - A curated list of awesome things related to Strapi.

---

<sub>🤫 Psst! [Strapi is hiring](https://strapi.io/careers).</sub>

