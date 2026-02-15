# Backend Quick Start Guide

This guide will help you get the Astrology App backend up and running quickly.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js 20+**: [Download](https://nodejs.org/)
- **npm** or **yarn**: Comes with Node.js
- **Git**: [Download](https://git-scm.com/)
- **PostgreSQL**: For production database (optional for development, SQLite is used by default)

## Quick Setup (5 minutes)

### 1. Clone the Repository

```bash
git clone https://github.com/cinderbrick1212/astroappv2-backend.git
cd astroappv2-backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Development Server

```bash
npm run develop
```

The Strapi admin panel will automatically open at `http://localhost:1337/admin`

**First time setup:**
1. Create your admin account
2. You're ready to go! Content types are pre-configured from schema files.

## What You'll See

- Strapi admin panel at `http://localhost:1337/admin`
- Pre-configured content types (User, UserProfile, FeedItem, BlogPost, Payment, ServiceRequest)
- API documentation available at `http://localhost:1337/documentation` (if enabled)

## Configuration

### Firebase Setup

To enable Firebase authentication verification:

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable Authentication methods (Email/Password, Google, Phone)
3. Download your service account JSON file
4. Create `.env` from `.env.example`
5. Add the service account key to `FIREBASE_SERVICE_ACCOUNT_KEY` environment variable

### Database Configuration (Production)

The backend uses SQLite by default (development). For production:

1. Set up PostgreSQL database
2. Update `.env` with database credentials
3. Restart Strapi

## Next Steps

### Backend Development

1. **Configure Content**
   - Add feed items and blog posts through admin panel
   - Test content retrieval via API

2. **Set Up Integrations**
   - Configure Razorpay for payments
   - Set up email provider (SendGrid/Mailgun)
   - Configure WhatsApp API (Twilio/Meta)

3. **Customize Extensions**
   - Add custom controllers in `src/api/`
   - Extend authentication middleware
   - Add custom business logic

4. **Deploy to Production**
   - See [DEPLOYMENT.md](DEPLOYMENT.md) for Cloud Run deployment
   - Configure Cloud SQL PostgreSQL
   - Set up Cloud Storage for media

## Troubleshooting

### Backend Won't Start
```bash
rm -rf node_modules
npm install
npm run develop
```

### TypeScript Errors
```bash
npx tsc --noEmit
```

### Clear Cache
```bash
rm -rf .cache build
npm run develop
```

### Database Issues
```bash
# Reset database (WARNING: deletes all data)
rm -rf .tmp/data.db
npm run develop
```

## Development Workflow

### Typical Day

1. **Start backend**:
   ```bash
   npm run develop
   ```

2. **Make changes**:
   - Edit files in `src/`
   - Hot reload will update automatically

3. **Test changes**:
   - Use admin panel at `http://localhost:1337/admin`
   - Test API endpoints with Postman/Insomnia
   - Check logs in terminal

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
- [API Documentation](API.md) - API endpoints and usage
- [DEPLOYMENT](DEPLOYMENT.md) - Deployment guide
- [SECURITY](SECURITY.md) - Security best practices

### External Docs
- [Strapi Documentation](https://docs.strapi.io/)
- [Strapi TypeScript](https://docs.strapi.io/dev-docs/typescript)
- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)
- [Razorpay API](https://razorpay.com/docs/api/)

## Support

For questions or issues:
1. Check the documentation files
2. Search existing issues
3. Create a new issue with details

## What's Next?

The backend is set up! Here's a suggested development timeline:

1. **Week 1**: Configure content types and add sample data
2. **Week 2**: Set up Firebase Admin SDK and test authentication
3. **Week 3**: Integrate Razorpay and test payment flows
4. **Week 4**: Configure notification services (email, WhatsApp)
5. **Week 5**: Deploy to Cloud Run and test production setup

Happy coding! 🚀
