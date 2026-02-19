# Deployment Guide - GCP Cloud Run

This guide walks you through deploying the Strapi backend to Google Cloud Platform using Cloud Run.

## Prerequisites

- Google Cloud Platform account
- `gcloud` CLI installed and configured
- Docker installed locally
- Firebase project set up

## Step 1: Set Up GCP Resources

### 1.1 Select the GCP Project

```bash
gcloud config set project astroinsights-487814
```

### 1.2 Enable Required APIs

```bash
gcloud services enable \
  cloudbuild.googleapis.com \
  run.googleapis.com \
  sqladmin.googleapis.com \
  storage.googleapis.com \
  secretmanager.googleapis.com
```

### 1.3 Create Cloud SQL Instance

```bash
# Generate and save a secure DB password (copy the output – you'll need it below)
DB_PASSWORD=$(openssl rand -base64 32)
echo "DB_PASSWORD=$DB_PASSWORD"

# Create PostgreSQL instance
gcloud sql instances create astroapp-db \
  --database-version=POSTGRES_18 \
  --tier=db-f1-micro \
  --region=asia-south1 \
  --root-password="$DB_PASSWORD"

# Create database
gcloud sql databases create strapi --instance=astroapp-db

# Create user
gcloud sql users create strapi \
  --instance=astroapp-db \
  --password="$DB_PASSWORD"
```

### 1.4 Create Cloud Storage Bucket

```bash
# Create bucket for media uploads with Uniform Bucket-Level Access (no public access)
gsutil mb -l asia-south1 --uniform-bucket-level-access gs://astroapp-media
```

> **Public access is prevented.** The bucket uses Uniform Bucket-Level Access so all
> object ACLs are disabled. Media files are served via short-lived signed URLs generated
> by the Strapi upload provider using the Cloud Run service account. No `allUsers`
> IAM binding is set on this bucket.
>
> The Cloud Run service account must have the **Storage Object Admin**
> (`roles/storage.objectAdmin`) role on the bucket so it can read, write, and sign URLs:
>
> ```bash
> PROJECT_NUMBER=$(gcloud projects describe astroinsights-487814 --format="value(projectNumber)")
> gsutil iam ch \
>   serviceAccount:${PROJECT_NUMBER}-compute@developer.gserviceaccount.com:roles/storage.objectAdmin \
>   gs://astroapp-media
> ```

## Step 2: Set Up Secrets

### 2.1 Create Secrets in Secret Manager

```bash
# App keys – two independent random values joined by a comma
APP_KEY1=$(openssl rand -base64 32)
APP_KEY2=$(openssl rand -base64 32)
echo -n "${APP_KEY1},${APP_KEY2}" | gcloud secrets create app-keys --data-file=-

# JWT secrets and salts – each independently random
echo -n "$(openssl rand -base64 32)" | gcloud secrets create admin-jwt-secret --data-file=-
echo -n "$(openssl rand -base64 32)" | gcloud secrets create jwt-secret --data-file=-
echo -n "$(openssl rand -base64 32)" | gcloud secrets create api-token-salt --data-file=-
echo -n "$(openssl rand -base64 32)" | gcloud secrets create transfer-token-salt --data-file=-
echo -n "$(openssl rand -base64 32)" | gcloud secrets create encryption-key --data-file=-

# Database password – use the same value generated in Step 1.3
# If you are running this in a new shell session, retrieve the existing password
# from Secret Manager (once it exists) or from Cloud SQL directly:
#   DB_PASSWORD=$(gcloud secrets versions access latest --secret=database-password)
echo -n "$DB_PASSWORD" | gcloud secrets create database-password --data-file=-

# Firebase service account (paste the JSON content)
gcloud secrets create firebase-service-account --data-file=firebase-service-account.json

# Razorpay credentials – set variables from your Razorpay Dashboard before running
# https://dashboard.razorpay.com/app/keys
RAZORPAY_KEY_ID="rzp_live_XXXXXXXXXXXXXXXXXXXX"
RAZORPAY_KEY_SECRET="YOUR_RAZORPAY_KEY_SECRET"
RAZORPAY_WEBHOOK_SECRET="YOUR_RAZORPAY_WEBHOOK_SECRET"
echo -n "$RAZORPAY_KEY_ID" | gcloud secrets create razorpay-key-id --data-file=-
echo -n "$RAZORPAY_KEY_SECRET" | gcloud secrets create razorpay-key-secret --data-file=-
echo -n "$RAZORPAY_WEBHOOK_SECRET" | gcloud secrets create razorpay-webhook-secret --data-file=-
```

> Replace the `RAZORPAY_*` variable values above with the real keys from your [Razorpay Dashboard](https://dashboard.razorpay.com/app/keys) before running the block.

### 2.2 Grant Cloud Run Access to Secrets

```bash
PROJECT_NUMBER=$(gcloud projects describe astroinsights-487814 --format="value(projectNumber)")
SA="serviceAccount:${PROJECT_NUMBER}-compute@developer.gserviceaccount.com"
ROLE="roles/secretmanager.secretAccessor"

for SECRET in \
  app-keys \
  admin-jwt-secret \
  jwt-secret \
  api-token-salt \
  transfer-token-salt \
  encryption-key \
  database-password \
  firebase-service-account \
  razorpay-key-id \
  razorpay-key-secret \
  razorpay-webhook-secret; do
  gcloud secrets add-iam-policy-binding "$SECRET" \
    --member="$SA" \
    --role="$ROLE"
done
```

## Step 3: Build and Deploy

### 3.1 Build Docker Image

```bash
cd backend

# Build the image
gcloud builds submit --tag gcr.io/astroinsights-487814/strapi-backend
```

### 3.2 Deploy to Cloud Run

```bash
# Get Cloud SQL connection name
INSTANCE_CONNECTION_NAME=$(gcloud sql instances describe astroapp-db --format="value(connectionName)")

# Deploy to Cloud Run
gcloud run deploy strapi-backend \
  --image gcr.io/astroinsights-487814/strapi-backend \
  --platform managed \
  --region asia-south1 \
  --allow-unauthenticated \
  --memory 512Mi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 10 \
  --add-cloudsql-instances $INSTANCE_CONNECTION_NAME \
  --set-env-vars "DATABASE_CLIENT=postgres" \
  --set-env-vars "DATABASE_HOST=/cloudsql/${INSTANCE_CONNECTION_NAME}" \
  --set-env-vars "DATABASE_NAME=strapi" \
  --set-env-vars "DATABASE_USERNAME=strapi" \
  --set-env-vars "GCS_BUCKET_NAME=astroapp-media" \
  --set-env-vars "GCS_PUBLIC_FILES=true" \
  --set-env-vars "HOST=0.0.0.0" \
  --set-env-vars "PORT=8080" \
  --set-secrets "APP_KEYS=app-keys:latest" \
  --set-secrets "ADMIN_JWT_SECRET=admin-jwt-secret:latest" \
  --set-secrets "JWT_SECRET=jwt-secret:latest" \
  --set-secrets "API_TOKEN_SALT=api-token-salt:latest" \
  --set-secrets "TRANSFER_TOKEN_SALT=transfer-token-salt:latest" \
  --set-secrets "ENCRYPTION_KEY=encryption-key:latest" \
  --set-secrets "DATABASE_PASSWORD=database-password:latest" \
  --set-secrets "FIREBASE_SERVICE_ACCOUNT_KEY=firebase-service-account:latest" \
  --set-secrets "RAZORPAY_KEY_ID=razorpay-key-id:latest" \
  --set-secrets "RAZORPAY_KEY_SECRET=razorpay-key-secret:latest" \
  --set-secrets "RAZORPAY_WEBHOOK_SECRET=razorpay-webhook-secret:latest"
```

## Step 4: Configure Custom Domain (Optional)

### 4.1 Map Custom Domain

```bash
gcloud run domain-mappings create \
  --service strapi-backend \
  --domain api.yourdomain.com \
  --region asia-south1
```

### 4.2 Configure DNS

Add the DNS records shown in the output to your domain registrar.

## Step 5: Set Up CI/CD (Optional)

### 5.1 Create cloudbuild.yaml

Use the ready-made file at [backend/cloudbuild.yaml](backend/cloudbuild.yaml). Update the substitutions at the bottom:

```yaml
substitutions:
  _INSTANCE_CONNECTION_NAME: "astroinsights-487814:asia-south1:astroapp-db"
  _GCS_BUCKET_NAME: "astroapp-media"
```

### 5.2 Connect GitHub Repository

```bash
gcloud beta builds triggers create github \
  --repo-name=astroappv2 \
  --repo-owner=cinderbrick1212 \
  --branch-pattern="^main$" \
  --build-config=cloudbuild.yaml
```

### 5.3 Manual One-Click Deploy

If you want a single command deploy without setting up a trigger:

```bash
gcloud builds submit --config backend/cloudbuild.yaml \
  --substitutions _INSTANCE_CONNECTION_NAME="astroinsights-487814:asia-south1:astroapp-db",_GCS_BUCKET_NAME="astroapp-media"
```

## Step 6: Post-Deployment

### 6.1 Create Admin User

1. Visit `https://your-domain.com/admin`
2. Create your first admin user
3. Log in to the admin panel

### 6.2 Set Up Monitoring

```bash
# Create uptime check
gcloud monitoring uptime create \
  --display-name="Strapi Backend Health" \
  --http-check-path="/_health" \
  --resource-type=url \
  --url="https://your-domain.com/_health"
```

### 6.3 Verify Environment Baseline

Use these checks to confirm Cloud Run, Postgres, and GCS are wired correctly:

1. **Health check**
  - Open `https://your-domain.com/_health` and verify a `200` response.

2. **Admin panel**
  - Visit `https://your-domain.com/admin` and create the first admin user.

3. **Database connectivity**
  - Create a test FeedItem or BlogPost in the admin panel; ensure it saves without errors.

4. **GCS uploads**
  - Upload a test image in the Media Library and confirm it loads from your GCS bucket URL.

## Step 7: Security Hardening

### 7.1 Configure CORS

Update `config/middlewares.ts` to restrict CORS origins:

```typescript
{
  name: 'strapi::cors',
  config: {
    origin: ['https://yourdomain.com', 'https://app.yourdomain.com'],
    credentials: true,
  },
}
```

### 7.2 Enable HTTPS Only

Cloud Run automatically provides HTTPS. Ensure your app always redirects HTTP to HTTPS.

### 7.3 Set Up WAF (Web Application Firewall)

Consider using Cloud Armor for DDoS protection and WAF rules.

## Monitoring and Logs

### View Logs

```bash
# View Cloud Run logs
gcloud run services logs read strapi-backend --region asia-south1

# View Cloud SQL logs
gcloud sql operations list --instance=astroapp-db
```

### Set Up Alerts

1. Go to GCP Console > Monitoring > Alerting
2. Create alerts for:
   - High error rate
   - High latency
   - Database connection errors
   - Low disk space

## Backup and Recovery

### Database Backups

```bash
# Manual backup
gcloud sql backups create --instance=astroapp-db

# Configure automated backups
gcloud sql instances patch astroapp-db \
  --backup-start-time=03:00
```

### Restore from Backup

```bash
# List backups
gcloud sql backups list --instance=astroapp-db

# Restore
gcloud sql backups restore BACKUP_ID \
  --backup-instance=astroapp-db \
  --backup-id=BACKUP_ID
```

## Cost Optimization

1. **Cloud Run**: Use min-instances=0 for dev/staging
2. **Cloud SQL**: Use f1-micro or g1-small for development
3. **Cloud Storage**: Set lifecycle rules to delete old files
4. **Monitoring**: Set up budget alerts

## Troubleshooting

### Connection Issues

```bash
# Test Cloud SQL connection
gcloud sql connect astroapp-db --user=strapi
```

### View Service Details

```bash
gcloud run services describe strapi-backend --region asia-south1
```

### Rebuild and Redeploy

```bash
gcloud builds submit --tag gcr.io/astroinsights-487814/strapi-backend
gcloud run deploy strapi-backend --image gcr.io/astroinsights-487814/strapi-backend --region asia-south1
```

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| HOST | Server host | 0.0.0.0 |
| PORT | Server port | 1337 |
| APP_KEYS | Strapi app keys | key1,key2 |
| ADMIN_JWT_SECRET | Admin JWT secret | secret123 |
| JWT_SECRET | API JWT secret | secret456 |
| API_TOKEN_SALT | API token salt | salt123 |
| TRANSFER_TOKEN_SALT | Transfer token salt | salt456 |
| DATABASE_CLIENT | Database type | postgres |
| DATABASE_HOST | Database host | /cloudsql/project:region:instance |
| DATABASE_NAME | Database name | strapi |
| DATABASE_USERNAME | Database user | strapi |
| DATABASE_PASSWORD | Database password | password123 |
| GCS_BUCKET_NAME | Storage bucket | astroapp-media |
| FIREBASE_SERVICE_ACCOUNT_KEY | Firebase credentials | {"type":"service_account",...} |
| RAZORPAY_KEY_ID | Razorpay key ID | rzp_test_xxx |
| RAZORPAY_KEY_SECRET | Razorpay key secret | secret |
| RAZORPAY_WEBHOOK_SECRET | Webhook secret | webhook_secret |

---

For more information, refer to:
- [Cloud Run Documentation](https://cloud.google.com/run/docs)
- [Cloud SQL Documentation](https://cloud.google.com/sql/docs)
- [Strapi Deployment Guide](https://docs.strapi.io/dev-docs/deployment)
