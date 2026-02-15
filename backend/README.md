# Backend - Strapi CMS

This is the backend service for the Astrology App, built with Strapi v5.

## Tech Stack

- **Strapi v5**: Headless CMS and API
- **TypeScript**: Type-safe development
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

### Development

Start the development server:

```bash
npm run develop
```

The admin panel will be available at `http://localhost:1337/admin`

First time setup:
1. Navigate to `http://localhost:1337/admin`
2. Create your first admin user
3. Configure content types (see Data Models section)

### Build

Build the project:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

## Data Models

The following content types need to be created in Strapi:

### User
- firebase_uid (String, unique)
- email (Email)
- phone (String)
- name (String)
- premium_status (Boolean)
- premium_expires_at (DateTime)

### UserProfile
- user (Relation to User)
- birth_date (Date)
- birth_time (String)
- birth_place (String)
- timezone (String)
- gender (Enumeration: male, female, other)

### FeedItem
- type (Enumeration: horoscope, tip, blog, remedy)
- title (String)
- summary (Text)
- body (Rich Text)
- media (Media - single)
- language_code (String, default: 'en')
- published_at (DateTime)
- priority (Integer)
- is_active (Boolean)

### BlogPost
- title (String)
- excerpt (Text)
- body (Rich Text)
- featured_image (Media - single)
- categories (String, repeatable)
- author (String)
- published_at (DateTime)

### Payment
- user (Relation to User)
- razorpay_order_id (String)
- razorpay_payment_id (String)
- razorpay_signature (String)
- amount (Decimal)
- currency (String)
- status (Enumeration: created, pending, success, failed)
- plan_type (String)

### ServiceRequest
- user (Relation to User)
- service_type (Enumeration: question, call, report)
- status (Enumeration: pending, in_progress, completed, cancelled)
- user_notes (Text)
- response_text (Text)

## Configuration

Environment variables (create `.env` file):

```env
HOST=0.0.0.0
PORT=1337
APP_KEYS=your-app-keys
API_TOKEN_SALT=your-api-token-salt
ADMIN_JWT_SECRET=your-admin-jwt-secret
TRANSFER_TOKEN_SALT=your-transfer-token-salt
JWT_SECRET=your-jwt-secret

# Database (example for PostgreSQL)
DATABASE_CLIENT=postgres
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=astrology_db
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=your-password
DATABASE_SSL=false

# Firebase Admin (for token verification)
FIREBASE_PROJECT_ID=your-project-id

# Razorpay
RAZORPAY_KEY_ID=your-key-id
RAZORPAY_KEY_SECRET=your-key-secret
```

## Next Steps

1. Set up Firebase Admin SDK for token verification
2. Create custom controllers for:
   - Payment processing (Razorpay integration)
   - Service request handling
   - Notification sending (Email + WhatsApp)
3. Configure Cloud Storage for media uploads
4. Set up webhooks for Razorpay
5. Deploy to GCP Cloud Run

## Deployment

For deployment to GCP:

1. Create a Dockerfile
2. Set up Cloud SQL (PostgreSQL)
3. Configure Cloud Storage bucket
4. Deploy to Cloud Run
5. Configure environment variables
6. Set up domain and SSL

## 📚 Learn More

- [Strapi documentation](https://docs.strapi.io)
- [Strapi TypeScript](https://docs.strapi.io/dev-docs/typescript)
- [Strapi tutorials](https://strapi.io/tutorials)
- [Strapi GitHub repository](https://github.com/strapi/strapi)

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

