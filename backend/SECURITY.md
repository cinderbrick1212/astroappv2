# Security Considerations

This document outlines important security practices and considerations for the backend.

## ⚠️ Critical Security Rules

### 1. Never Commit Secrets

**NEVER** commit the following to version control:
- API keys (Razorpay, SendGrid, etc.)
- Database passwords
- JWT secrets
- Firebase service account keys
- Any `.env` files with real credentials
- Files like `.tmp_strapi_secrets` or `.tmp_db_pass`

**What to do if secrets are committed:**
1. Immediately rotate all exposed credentials
2. Remove the files from git history: `git rm --cached <file>`
3. Add to `.gitignore`
4. Push the changes
5. Update all affected services with new credentials

### 2. Secret Management

**Development:**
- Use `.env` files (excluded from git)
- Copy `.env.example` and fill in your values
- Never share `.env` files

**Production:**
- Use GCP Secret Manager for all secrets
- Reference secrets in Cloud Run using `--set-secrets` flag
- Never hardcode secrets in code or config files
- Example: `--set-secrets "JWT_SECRET=jwt-secret:latest"`

### 3. Environment Variables

Required environment variables:
```env
# Strapi Core (Generate with: openssl rand -base64 32)
APP_KEYS=key1,key2
ADMIN_JWT_SECRET=secret
JWT_SECRET=secret
API_TOKEN_SALT=salt
TRANSFER_TOKEN_SALT=salt
ENCRYPTION_KEY=key

# Database
DATABASE_PASSWORD=password

# Firebase
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account",...}

# Razorpay
RAZORPAY_KEY_ID=id
RAZORPAY_KEY_SECRET=secret
RAZORPAY_WEBHOOK_SECRET=secret
```

## 🔒 Authentication & Authorization

### Firebase Authentication

- All API endpoints (except public ones) require Firebase ID token
- Token verification happens in `firebase-auth` middleware
- Users are automatically created on first authenticated request
- Public endpoints: `/api/feed-items`, `/api/blog-posts`, `/api/health`

### Webhook Security

The Razorpay webhook endpoint (`/api/payments/webhook`) verifies signatures to ensure requests are genuine:

```typescript
const signature = ctx.request.headers['x-razorpay-signature'];
const expectedSignature = crypto
  .createHmac('sha256', webhookSecret)
  .update(body)
  .digest('hex');
```

Always verify webhook signatures before processing payments.

## 🛡️ Input Validation

### Payment Endpoints

- Amount values are validated and sanitized
- Plan types are restricted to enum values
- Razorpay signatures are verified using HMAC SHA-256

### Service Requests

- Service types are restricted to: `question`, `call`, `report`
- Status values are restricted to: `pending`, `in_progress`, `completed`, `cancelled`
- User can only access their own service requests

### User Data

- Firebase UID is required and unique
- Email and phone validation handled by Strapi
- Birth dates and times are validated by Strapi date/time fields

## 🔐 Database Security

### PostgreSQL (Production)

- Use SSL connections when available
- Set `DATABASE_SSL=true` for production
- Use strong passwords (min 16 chars, random)
- Restrict database access to Cloud SQL proxy or whitelisted IPs
- Enable automated backups
- Use Cloud SQL IAM authentication when possible

### SQLite (Development Only)

- SQLite is for development only
- Never use SQLite in production
- Data is stored in `.tmp/data.db` (gitignored)

## 🌐 CORS Configuration

Current CORS policy allows all origins. For production:

```typescript
// backend/config/middlewares.ts
{
  name: 'strapi::cors',
  config: {
    origin: ['https://yourdomain.com', 'https://app.yourdomain.com'],
    credentials: true,
  },
}
```

## 🔒 Content Security Policy (CSP)

CSP is configured to allow:
- Images and media from Google Cloud Storage
- HTTPS connections only

Update `backend/config/middlewares.ts` for your specific domain:

```typescript
contentSecurityPolicy: {
  useDefaults: true,
  directives: {
    'connect-src': ["'self'", 'https:'],
    'img-src': ["'self'", 'data:', 'blob:', 'https://storage.googleapis.com'],
    'media-src': ["'self'", 'data:', 'blob:', 'https://storage.googleapis.com'],
    upgradeInsecureRequests: null,
  },
}
```

## 🔐 Rate Limiting

Consider implementing rate limiting for:
- Payment endpoints (prevent abuse)
- Service request creation
- Authentication attempts

Use a package like `koa-ratelimit` or configure Cloud Armor.

## 📊 Monitoring & Logging

### What to Log

**DO log:**
- Authentication failures (for security monitoring)
- Payment transactions
- Service request status changes
- System errors

**DO NOT log:**
- Passwords or secrets
- Full credit card numbers
- Personal identification numbers
- Firebase tokens
- API keys

### Security Monitoring

Set up alerts for:
- Multiple failed authentication attempts
- Unusual payment patterns
- Database connection failures
- High error rates
- Webhook signature verification failures

## 🔄 Security Updates

### Regular Updates

```bash
# Check for security vulnerabilities
npm audit

# Fix vulnerabilities (review changes first)
npm audit fix

# Update dependencies
npm update
```

### Dependency Security

- Run `npm audit` regularly
- Keep Strapi and dependencies updated
- Subscribe to security advisories for:
  - Strapi
  - Firebase Admin SDK
  - Razorpay SDK
  - Node.js

## 🚨 Incident Response

### If Security Breach Occurs

1. **Immediate Actions:**
   - Disable affected API keys/secrets
   - Block suspicious IP addresses
   - Review logs for breach scope
   - Notify affected users if required

2. **Investigation:**
   - Identify vulnerability
   - Review access logs
   - Check for data exfiltration
   - Document timeline

3. **Recovery:**
   - Patch vulnerability
   - Rotate all credentials
   - Update security measures
   - Deploy fixes

4. **Post-Incident:**
   - Conduct security review
   - Update security procedures
   - Train team on lessons learned

## 📝 Security Checklist

Before deploying to production:

- [ ] All secrets stored in GCP Secret Manager
- [ ] No secrets committed to version control
- [ ] CORS configured for specific domains
- [ ] HTTPS enforced
- [ ] Database uses SSL
- [ ] Strong passwords for all accounts
- [ ] Firebase authentication configured
- [ ] Razorpay webhook signature verification enabled
- [ ] Rate limiting configured
- [ ] Monitoring and alerts set up
- [ ] Regular backup schedule enabled
- [ ] Security headers configured
- [ ] CSP properly configured
- [ ] Dependencies updated
- [ ] `npm audit` passes with no critical vulnerabilities

## 📚 Security Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Strapi Security Documentation](https://docs.strapi.io/dev-docs/admin-panel-customization#security)
- [Firebase Security Rules](https://firebase.google.com/docs/rules)
- [GCP Security Best Practices](https://cloud.google.com/security/best-practices)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)

## 🆘 Getting Help

If you discover a security vulnerability:
1. Do NOT create a public GitHub issue
2. Email security team immediately
3. Include details about the vulnerability
4. Wait for response before disclosing

For security questions or concerns, contact the security team directly.
