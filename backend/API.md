# ⚠️ DEPRECATED - API Documentation

> **This documentation has been migrated to the new repository.**
> 
> **New repository**: [cinderbrick1212/astroappv2backend](https://github.com/cinderbrick1212/astroappv2backend)
> 
> Please refer to the new repository for current API documentation.

---

## Original API Documentation

This document provides detailed information about all available API endpoints.

## Base URL

- Development: `http://localhost:1337/api`
- Production: `https://your-domain.com/api`

## Authentication

All API endpoints (except public ones) require a Firebase ID token in the Authorization header:

```
Authorization: Bearer <firebase_id_token>
```

### Public Endpoints (No Auth Required)

- `GET /api/feed-items` - List all feed items
- `GET /api/blog-posts` - List all blog posts
- `POST /api/payments/webhook` - Razorpay webhook handler

All other endpoints require authentication.

---

## User Endpoints

### Get Current User

```http
GET /api/users/me
```

**Response:**
```json
{
  "data": {
    "id": 1,
    "firebase_uid": "abc123",
    "email": "user@example.com",
    "phone": "+919876543210",
    "name": "John Doe",
    "premium_status": false,
    "premium_expires_at": null,
    "user_profile": {
      "id": 1,
      "birth_date": "1990-01-15",
      "birth_time": "14:30:00",
      "birth_place": "Mumbai, India",
      "timezone": "Asia/Kolkata",
      "gender": "male",
      "latitude": 19.0760,
      "longitude": 72.8777
    }
  }
}
```

### Update Current User

```http
PUT /api/users/me
```

**Body:**
```json
{
  "name": "John Doe",
  "phone": "+919876543210"
}
```

**Response:**
```json
{
  "data": {
    "id": 1,
    "name": "John Doe",
    "phone": "+919876543210",
    "email": "user@example.com",
    "premium_status": false
  },
  "message": "User updated successfully"
}
```

---

## User Profile Endpoints

### Get User Profile

```http
GET /api/user-profile/me
```

**Response:**
```json
{
  "data": {
    "id": 1,
    "birth_date": "1990-01-15",
    "birth_time": "14:30:00",
    "birth_place": "Mumbai, India",
    "timezone": "Asia/Kolkata",
    "gender": "male",
    "latitude": 19.0760,
    "longitude": 72.8777
  }
}
```

### Create/Update User Profile

```http
POST /api/user-profile
PUT /api/user-profile
```

**Body:**
```json
{
  "birth_date": "1990-01-15",
  "birth_time": "14:30:00",
  "birth_place": "Mumbai, India",
  "timezone": "Asia/Kolkata",
  "gender": "male",
  "latitude": 19.0760,
  "longitude": 72.8777
}
```

**Response:**
```json
{
  "data": {
    "id": 1,
    "birth_date": "1990-01-15",
    "birth_time": "14:30:00",
    "birth_place": "Mumbai, India",
    "timezone": "Asia/Kolkata",
    "gender": "male",
    "latitude": 19.0760,
    "longitude": 72.8777
  },
  "message": "Profile created successfully"
}
```

---

## Feed & Blog Endpoints

### Get Feed Items

```http
GET /api/feed-items
```

**Query Parameters:**
- `filters[type][$eq]` - Filter by type (daily_horoscope, tip, news, announcement)
- `filters[is_active][$eq]` - Filter by active status (true/false)
- `filters[language_code][$eq]` - Filter by language code
- `sort` - Sort field (e.g., `priority:desc`, `createdAt:desc`)
- `pagination[page]` - Page number
- `pagination[pageSize]` - Items per page (default: 25)

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "type": "daily_horoscope",
      "title": "Aries - Daily Horoscope",
      "summary": "Today is a great day for new beginnings",
      "body": "<p>Full horoscope content...</p>",
      "media": {
        "url": "https://storage.googleapis.com/bucket/image.jpg"
      },
      "language_code": "en",
      "priority": 1,
      "is_active": true,
      "publishedAt": "2026-02-15T10:00:00.000Z"
    }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "pageSize": 25,
      "pageCount": 2,
      "total": 50
    }
  }
}
```

### Get Blog Posts

```http
GET /api/blog-posts
```

**Query Parameters:**
- `filters[categories][$contains]` - Filter by category
- `sort` - Sort field (e.g., `publishedAt:desc`)
- `pagination[page]` - Page number
- `pagination[pageSize]` - Items per page

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "title": "Understanding Your Birth Chart",
      "excerpt": "Learn how to read your birth chart",
      "body": "<p>Full blog content...</p>",
      "featured_image": {
        "url": "https://storage.googleapis.com/bucket/blog-image.jpg"
      },
      "categories": ["astrology", "beginner"],
      "author": "Dr. Astrologer",
      "slug": "understanding-your-birth-chart",
      "publishedAt": "2026-02-10T10:00:00.000Z"
    }
  ]
}
```

---

## Payment Endpoints

### Create Payment Order

```http
POST /api/payments/create-order
```

**Body:**
```json
{
  "amount": 499.00,
  "plan_type": "monthly"
}
```

**Plan Types:**
- `monthly` - Monthly premium subscription
- `yearly` - Yearly premium subscription
- `question` - Ask a question service
- `call` - Call with astrologer
- `report` - Detailed report

**Response:**
```json
{
  "orderId": "order_xyz123",
  "amount": 49900,
  "currency": "INR",
  "paymentId": 1
}
```

### Verify Payment

```http
POST /api/payments/verify
```

**Body:**
```json
{
  "razorpay_order_id": "order_xyz123",
  "razorpay_payment_id": "pay_abc456",
  "razorpay_signature": "signature_hash"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Payment verified successfully"
}
```

### Razorpay Webhook

```http
POST /api/payments/webhook
```

This endpoint is called by Razorpay when payment events occur. No authentication required.

**Headers:**
- `x-razorpay-signature` - Webhook signature for verification

---

## Service Request Endpoints

### Create Service Request

```http
POST /api/service-requests
```

**Body:**
```json
{
  "service_type": "question",
  "user_notes": "I want to know about my career prospects",
  "payment_id": 1
}
```

**Service Types:**
- `question` - Ask a question
- `call` - Schedule a call
- `report` - Request a detailed report

**Response:**
```json
{
  "data": {
    "id": 1,
    "service_type": "question",
    "status": "pending",
    "user_notes": "I want to know about my career prospects",
    "response_text": null,
    "payment": 1,
    "createdAt": "2026-02-15T10:00:00.000Z"
  },
  "message": "Service request created successfully"
}
```

### Get User's Service Requests

```http
GET /api/service-requests/my-requests
```

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "service_type": "question",
      "status": "completed",
      "user_notes": "I want to know about my career prospects",
      "response_text": "<p>Based on your chart...</p>",
      "payment": {
        "id": 1,
        "amount": 299.00,
        "status": "captured"
      },
      "createdAt": "2026-02-15T10:00:00.000Z",
      "updatedAt": "2026-02-15T12:00:00.000Z"
    }
  ]
}
```

### Update Service Request Status

```http
PUT /api/service-requests/:id/status
```

**Body:**
```json
{
  "status": "completed",
  "response_text": "<p>Based on your birth chart, your career prospects look promising...</p>"
}
```

**Statuses:**
- `pending` - Request submitted
- `in_progress` - Astrologer working on it
- `completed` - Response provided
- `cancelled` - Request cancelled

**Response:**
```json
{
  "data": {
    "id": 1,
    "status": "completed",
    "response_text": "<p>Based on your birth chart...</p>"
  },
  "message": "Service request updated successfully"
}
```

---

## Error Responses

### 401 Unauthorized
```json
{
  "error": {
    "status": 401,
    "name": "UnauthorizedError",
    "message": "Invalid authentication token"
  }
}
```

### 400 Bad Request
```json
{
  "error": {
    "status": 400,
    "name": "BadRequestError",
    "message": "Amount and plan_type are required"
  }
}
```

### 404 Not Found
```json
{
  "error": {
    "status": 404,
    "name": "NotFoundError",
    "message": "Service request not found"
  }
}
```

### 500 Internal Server Error
```json
{
  "error": {
    "status": 500,
    "name": "InternalServerError",
    "message": "An internal server error occurred"
  }
}
```

---

## Pagination

List endpoints support pagination using query parameters:

```
GET /api/feed-items?pagination[page]=1&pagination[pageSize]=10
```

**Parameters:**
- `pagination[page]` - Page number (default: 1)
- `pagination[pageSize]` - Items per page (default: 25, max: 100)

**Response includes pagination metadata:**
```json
{
  "data": [...],
  "meta": {
    "pagination": {
      "page": 1,
      "pageSize": 10,
      "pageCount": 5,
      "total": 50
    }
  }
}
```

---

## Filtering

Use Strapi's filtering syntax for list endpoints:

```
GET /api/feed-items?filters[type][$eq]=daily_horoscope&filters[is_active][$eq]=true
```

**Common operators:**
- `$eq` - Equals
- `$ne` - Not equals
- `$lt` - Less than
- `$lte` - Less than or equal
- `$gt` - Greater than
- `$gte` - Greater than or equal
- `$contains` - Contains substring
- `$notContains` - Does not contain substring

---

## Sorting

Sort results using the `sort` parameter:

```
GET /api/feed-items?sort=priority:desc,createdAt:desc
```

- Use `:asc` for ascending order
- Use `:desc` for descending order
- Separate multiple sort fields with commas

---

## Rate Limiting

API endpoints may be rate-limited to prevent abuse. Rate limit headers are included in responses:

- `X-RateLimit-Limit` - Request limit per time window
- `X-RateLimit-Remaining` - Remaining requests
- `X-RateLimit-Reset` - Time when limit resets

If rate limit is exceeded, you'll receive a `429 Too Many Requests` response.
