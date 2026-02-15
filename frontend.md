# Frontend Architecture and Design

This document defines the frontend architecture, navigation structure, tools, screens, and data flow for the React Native mobile application. It provides verbose, step-by-step implementation guidance for both human developers and AI models.

---

## 1) Goals and Scope

We are implementing a React Native (Expo) mobile application that focuses on:

- **User Authentication**: Firebase Auth (email/phone/Google OAuth)
- **Daily Engagement**: Feed-first experience with horoscopes, tips, and blog content
- **Astrology Tools**: Client-side calculations (Kundli Lite, Compatibility, Daily Horoscope, Panchang)
- **Monetization**: Ad revenue (primary) + paid services (Ask Question, Call, Reports)
- **Content Consumption**: Blog posts, daily feed, personalized insights
- **Premium Payments**: Razorpay integration for paid services

**Key Design Principles:**

- **Clean, uncluttered UI**: No more than 3 primary cards per screen
- **Progressive disclosure**: Summary first, details behind taps
- **Warm, grounded mood**: Calm guidance, modern spiritual aesthetic
- **Daily ritual**: Habit-forming features (streaks, daily focus, personalized feed)
- **Mainstream appeal**: Avoid technical jargon, keep tools simple and accessible

---

## 2) Architecture Overview (React Native + Expo + Firebase)

### Core Technologies

- **React Native (Expo SDK 54)**: Cross-platform mobile framework
- **TypeScript**: Type-safe development
- **React Navigation 6**: Stack and Tab navigation
- **React Query (@tanstack/react-query)**: Server state management and caching
- **AsyncStorage**: Local persistence (tokens, preferences, cached data)
- **Firebase Auth**: User authentication
- **Razorpay SDK**: Payment processing
- **Swiss Ephemeris (swisseph)**: Vedic astrology calculations
- **Expo APIs**: Image handling, notifications, linking

### Why This Stack

- **Expo**: Fast development, easy deployment, good native module support
- **React Query**: Automatic caching, refetching, and offline support for API data
- **Client-side astrology**: Zero backend costs for calculations, works offline
- **Firebase Auth**: Proven, reliable authentication with minimal setup
- **TypeScript**: Catches errors early, improves maintainability

---

## 3) App Structure and Navigation

### 3.1 Navigation Hierarchy

```
Root Navigator (Stack)
├── Auth Stack
│   └── LoginScreen
└── Main Navigator (Bottom Tabs)
    ├── Feed Tab → DailyFeedScreen
    ├── Tools Tab → ToolsScreen
    ├── Home Tab → HomeScreen (Dashboard)
    └── Profile Tab → ProfileScreen

Modal Stacks (overlays)
├── KundliScreen
├── CompatibilityScreen
├── BlogPostScreen
├── PremiumScreen
├── ReportDetailScreen
├── AskQuestionScreen
└── BookCallScreen
```

### 3.2 Tab Structure (4 Tabs)

**Tab 1: Feed** (default landing)

- Icon: Calendar or Feed icon
- Purpose: Daily personalized content feed
- Content: Daily horoscope, tips, blog cards, remedy of the day

**Tab 2: Tools**

- Icon: Grid or Compass
- Purpose: Astrology tools hub
- Content: Kundli Lite, Compatibility, Panchang, Lucky Factors

**Tab 3: Home** (Dashboard)

- Icon: Home
- Purpose: Quick overview and actions
- Content: User greeting, today's focus, quick access to tools and premium services

**Tab 4: Profile**

- Icon: Person
- Purpose: User account and settings
- Content: Birth details, premium status, payment history, settings

### 3.3 Why This Order

1. **Feed first**: Builds daily habit, maximizes ad impressions
2. **Tools second**: Easy access for engaged users
3. **Home third**: Quick actions for power users
4. **Profile last**: Standard convention, low frequency

---

## 4) Tool Set (Mainstream-Friendly, Uncluttered)

All tools are designed for **progressive disclosure**: show summary cards, hide complexity behind taps.

### 4.1 Kundli Lite

**Purpose**: Birth chart summary without overwhelming complexity

**Input**: User's birth details (date, time, place) from profile

**Output (Summary Card)**:

- Lagna (Ascendant)
- Rashi (Moon sign)
- Nakshatra (Birth star)
- 2 key insights (e.g., "Strong Mars in 10th house suggests career success")

**Progressive Disclosure**: "View Full Chart" button opens modal with:

- 12 houses with planet placements
- Dasha period timeline (current + upcoming)
- Visual chart representation (optional)

**Implementation Notes**:

- Calculate using Swiss Ephemeris on device
- Cache calculation results in AsyncStorage
- No server calls required

### 4.2 Compatibility Lite

**Purpose**: Relationship compatibility scoring

**Input**:

- User's birth details (from profile)
- Partner's birth date (single input field)

**Output (Summary Card)**:

- Compatibility score (e.g., "28/36 - Good Match")
- 3 bullet points:
  - Top 2 strengths (e.g., "Emotional harmony", "Shared values")
  - 1 caution (e.g., "Communication needs work")
- Simple advice line (e.g., "Focus on patience and understanding")

**Progressive Disclosure**: "View Details" opens modal with:

- 8-fold Ashtakoot breakdown (Varna, Vashya, Tara, Yoni, etc.)
- Detailed interpretation per category
- Remedies (if score < 18)

**Implementation Notes**:

- Simplified Ashtakoot Milan algorithm
- No need for exact birth time from partner (use noon default)
- Store recent compatibility checks in AsyncStorage

### 4.3 Daily Panchang Lite

**Purpose**: Hindu calendar essentials for the day

**Output (Compact Card)**:

- Tithi (lunar day)
- Nakshatra (current lunar mansion)
- Rahu Kaal (inauspicious time window)

**Progressive Disclosure**: "More Details" opens modal with:

- Yoga, Karana
- Sunrise/Sunset times
- Muhurat (auspicious times) for specific activities

**Implementation Notes**:

- Calculate based on user's location (latitude/longitude from profile or device GPS)
- Use Swiss Ephemeris for moon calculations
- Cache today's panchang until midnight

### 4.4 Today's Focus

**Purpose**: Single-line daily guidance that rotates focus areas

**Output (Single Card)**:

- One sentence (e.g., "Today favors career initiatives—take bold action")
- Icon representing focus area (career/love/health/finance)
- Lucky color dot

**Implementation Logic**:

- Rotate through focus areas based on day of week or user's transit data
- Generate guidance from templates + natal chart insights
- Changes daily at midnight

**UI Notes**:

- Prominent card at top of Home screen
- Subtle gradient background matching lucky color

### 4.5 Lucky Factors

**Purpose**: Quick daily reference for auspicious elements

**Output (Compact Card)**:

- Lucky Number: Single digit (1-9)
- Lucky Color: Color name + color swatch
- Lucky Time: Time window (e.g., "2:00 PM - 4:00 PM")

**Implementation Logic**:

- Derive from user's Nakshatra and current day's transits
- Use traditional Vedic associations
- Update daily

**UI Notes**:

- Small card (half-width or full-width compact)
- Visual emphasis on color swatch

### 4.6 Remedy of the Day (Optional)

**Purpose**: Simple actionable suggestion for well-being

**Output (Small Card)**:

- One sentence remedy (e.g., "Donate yellow items on Thursday for Jupiter's blessings")
- Icon (lamp, flower, etc.)

**Implementation Logic**:

- Rotate through 7 planetary remedies based on day of week
- Personalize based on weak planet in user's chart (if available)
- Optional feature—can be disabled if cluttered

**UI Notes**:

- Small card at bottom of Feed
- Soft background, minimal design

---

## 5) Screen-by-Screen Design

### 5.1 LoginScreen (Auth Stack)

**Purpose**: User authentication entry point

**Layout**:

- App logo and tagline
- Tab selector: "Email" | "Phone"
- Input fields (email or phone + password)
- "Login" button
- "Don't have an account? Register" link
- "Continue with Google" button (OAuth)
- "Continue as Guest" button (limited features)

**Data Flow**:

1. User enters credentials
2. App calls Firebase Auth (signInWithEmailAndPassword or signInWithPhoneNumber)
3. Receive Firebase ID token
4. Store token in AsyncStorage
5. Call Strapi API to sync/create user record
6. Navigate to Main (Feed tab)

**Error Handling**:

- Show validation errors inline (empty fields, invalid email format)
- Show Firebase errors (wrong password, user not found)
- Retry mechanism for network errors

---

### 5.2 DailyFeedScreen (Feed Tab)

**Purpose**: Primary engagement screen - daily personalized content

**Layout (Vertical Scroll)**:

1. **FeedHeader Component**
   - Date display (e.g., "Saturday, Feb 15, 2026")
   - User greeting (e.g., "Good morning, Priya")
   - Streak indicator (e.g., "🔥 3 day streak")

2. **Daily Horoscope Card**
   - User's rashi name + icon
   - Today's prediction (2-3 sentences)
   - Mood indicator (emoji or color)
   - Lucky number & color
   - "View Weekly" link

3. **Today's Focus Card**
   - Single guidance sentence
   - Focus area icon (career/love/health)
   - Gradient background

4. **Feed Items** (from Strapi API)
   - Astro Tip Card
   - Blog Post Preview Card
   - Fun Fact Card
   - Transit Update Card
   - Remedy of the Day Card

5. **Ad Cards** (interspersed every 3-4 items)
   - Native ad format
   - "Sponsored" badge
   - Small, non-intrusive

**Pull-to-Refresh**: Refetches feed and horoscope data

**Infinite Scroll**: Auto-loads more feed items

**Data Flow**:

1. On mount, fetch user profile from React Query cache or API
2. Calculate daily horoscope client-side using birth details
3. Fetch feed items from Strapi API (`GET /feed-items?page=1`)
4. Render feed with ads interspersed
5. Cache feed items for 5 minutes (React Query staleTime)

**UI Notes**:

- Dark theme with jewel tone accents (deep purples, golds)
- Card-based design with consistent padding
- Smooth animations on card tap

---

### 5.3 ToolsScreen (Tools Tab)

**Purpose**: Hub for all astrology tools

**Layout (Grid or List)**:

1. **Section Header: "Daily Tools"**
   - Daily Panchang Lite (card)
   - Today's Focus (card)
   - Lucky Factors (card)

2. **Section Header: "Personal Tools"**
   - Kundli Lite (card with "View" CTA)
   - Compatibility Lite (card with "Check" CTA)

3. **Section Header: "Premium Services"** (if not premium user)
   - Ask a Question (₹49) - card with CTA
   - Detailed Report (₹499) - card with CTA
   - Book a Call (₹999) - card with CTA

**Card Design**:

- Icon on left, title + subtitle on right
- Arrow or CTA on far right
- Tap opens modal or navigates to tool screen

**Data Flow**:

1. Check user's premium status from React Query cache
2. Show/hide premium CTAs accordingly
3. For tool cards, navigate to respective screen or modal

**UI Notes**:

- Light theme with clean white cards
- 2-column grid for compact tools, full-width for services

---

### 5.4 HomeScreen (Home Tab - Dashboard)

**Purpose**: Quick overview and action hub

**Layout**:

1. **User Greeting**
   - "Hello, Priya!" or "Good evening, Priya!"
   - Personalized message based on time of day

2. **Today's Focus Card** (duplicate from Feed)
   - Prominent placement
   - "View More" link to Feed

3. **Quick Actions Grid** (2x2 or 3 cards)
   - Kundli Lite
   - Compatibility
   - Daily Panchang

4. **Premium Services Section**
   - "Ask a Question" card
   - "Get Detailed Report" card
   - "Book a Call" card
   - Shows "Upgrade" badge if not premium

5. **Recent Activity** (if available)
   - Last compatibility check
   - Last report purchased
   - Quick link to view

**Data Flow**:

1. Fetch user profile and premium status
2. Calculate today's focus client-side
3. Show cached data for quick actions
4. Navigate to tool or premium screen on tap

**UI Notes**:

- Light theme with soft gradients
- Large, tappable cards with clear CTAs
- Minimal text, icon-driven design

---

### 5.5 ProfileScreen (Profile Tab)

**Purpose**: User account, settings, and birth details management

**Layout**:

1. **Profile Header**
   - Avatar (initials or placeholder)
   - Name
   - Email/Phone
   - Premium badge (if premium)

2. **Birth Details Section**
   - Date of Birth
   - Time of Birth
   - Place of Birth
   - "Edit Details" button

3. **Premium Status Section** (if premium)
   - Plan type (Monthly/Yearly)
   - Expiry date
   - "Manage Subscription" link

4. **Payment History Section**
   - List of past payments
   - "View All" link

5. **Settings Section**
   - Language preference (Hindi/English)
   - Notifications on/off
   - Theme (Light/Dark)
   - "Privacy Policy" link
   - "Terms of Service" link
   - "Logout" button

**Data Flow**:

1. Fetch user profile and payment history from Strapi API
2. Show cached data if available
3. On "Edit Details", show modal with form
4. On save, update profile in Strapi and refresh cache

**UI Notes**:

- Clean, organized sections with separators
- Edit button for birth details
- Clear premium/free status indicator

---

### 5.6 KundliScreen (Modal)

**Purpose**: Display full birth chart with details

**Trigger**: Tap "View Full Chart" from Kundli Lite card

**Layout**:

1. **Header**: "Your Kundli" + Close button

2. **Chart Visual** (optional)
   - 12-house chart diagram with planets
   - Tap on house to see details

3. **Key Insights Section**
   - Lagna (Ascendant) with description
   - Rashi (Moon sign) with description
   - Nakshatra with description

4. **Planet Positions Table**
   - Planet | House | Sign | Degree
   - Scrollable table

5. **Dasha Timeline**
   - Current Mahadasha
   - Current Antardasha
   - Next period

6. **CTA Section**
   - "Get Detailed Report" button (premium service)
   - "Share Kundli" button (export as image or PDF)

**Data Flow**:

1. Calculate full Kundli using Swiss Ephemeris on mount
2. Render data in sections
3. Cache calculation for reuse

**UI Notes**:

- Full-screen modal with scroll
- Dark theme to match Feed aesthetic
- Clear hierarchy with section headers

---

### 5.7 CompatibilityScreen (Modal)

**Purpose**: Check relationship compatibility

**Trigger**: Tap "Check Compatibility" from Tools tab

**Layout**:

1. **Header**: "Compatibility Check" + Close button

2. **Input Section**
   - Label: "Enter partner's birth date"
   - Date picker
   - Optional: "Enter partner's name" (for display only)

3. **Results Section** (after calculation)
   - **Score Display**
     - Large number (e.g., "28/36")
     - Rating text (e.g., "Good Match")
     - Color-coded (green/yellow/red)
   - **Strengths**
     - 2 bullet points (e.g., "Emotional harmony", "Shared values")
   - **Cautions**
     - 1 bullet point (e.g., "Communication needs work")
   - **Advice**
     - Single sentence (e.g., "Focus on patience and understanding")

4. **Progressive Disclosure**
   - "View Detailed Breakdown" button
   - Opens accordion or new section with 8-fold Ashtakoot table

5. **CTA Section**
   - "Get Personalized Report" button (premium service)
   - "Save This Check" button (stores in AsyncStorage)

**Data Flow**:

1. User enters partner's birth date
2. App calculates Ashtakoot Milan client-side
3. Display score and interpretation
4. On "View Details", expand to show full breakdown

**UI Notes**:

- Clean, form-driven design
- Large, prominent score display
- Color-coded feedback (visual reinforcement)

---

### 5.8 BlogListScreen (Modal or Stack Screen)

**Purpose**: Browse blog posts by category

**Trigger**: Tap "View All Blogs" from Feed or Home

**Layout**:

1. **Header**: "Blog" + Back/Close button

2. **Category Filters** (horizontal scroll)
   - All
   - Horoscopes
   - Numerology
   - Vastu
   - Relationships
   - Wellness

3. **Blog Cards List** (vertical scroll)
   - Featured image thumbnail
   - Title
   - Excerpt (2 lines)
   - Author name + date
   - "Read More" CTA

4. **Pagination**
   - Infinite scroll or "Load More" button

**Data Flow**:

1. Fetch blog posts from Strapi API (`GET /blog-posts?category=X&page=1`)
2. Display with react-query pagination
3. Cache posts for 15 minutes
4. On tap, navigate to BlogPostScreen with post ID

**UI Notes**:

- Light theme
- Card-based design with clear images
- Category pills with active state

---

### 5.9 BlogPostScreen (Modal or Stack Screen)

**Purpose**: Display full blog post content

**Trigger**: Tap blog card from BlogListScreen or Feed

**Layout**:

1. **Header**: Back button + Share button

2. **Featured Image** (full-width)

3. **Title** (large, bold)

4. **Meta Info**: Author + Date + Category tags

5. **Content** (rich text)
   - HTML rendering with proper styles
   - Images inline
   - Lists, blockquotes, etc.

6. **Footer**
   - "Share this post" button
   - Related posts (3 cards)

**Data Flow**:

1. Fetch single blog post from Strapi API (`GET /blog-posts/:id`)
2. Render HTML content safely using `react-native-render-html`
3. Cache post content

**UI Notes**:

- Clean, readable typography
- Proper heading hierarchy
- Generous line height and padding

---

### 5.10 PremiumScreen (Modal)

**Purpose**: Display premium service offerings and handle payments

**Trigger**: Tap "Upgrade" or any premium CTA

**Layout**:

1. **Header**: "Premium Services" + Close button

2. **Service Cards** (3 options)
   - **Ask a Question** (₹49)
     - Description: "Get personalized answer from expert astrologer"
     - Response time: "Within 24 hours"
     - CTA: "Ask Now"
   - **Detailed Report** (₹499)
     - Description: "In-depth analysis of career, marriage, or finance"
     - Delivery: "PDF report within 48 hours"
     - CTA: "Get Report"
   - **Book a Call** (₹999)
     - Description: "1-on-1 consultation with expert astrologer"
     - Duration: "30 minutes"
     - CTA: "Book Now"

3. **Payment Flow**
   - User selects service
   - Brief form (for question/report type)
   - "Proceed to Payment" button
   - Razorpay checkout modal
   - Payment success confirmation
   - Service request created in Strapi
   - Confirmation screen with next steps

**Data Flow**:

1. User taps service CTA
2. If "Ask Question", show question input modal
3. If "Report", show report type selector (career/marriage/finance)
4. If "Call", show preferred date/time selector
5. Create Razorpay order via Strapi API (`POST /payments/create-order`)
6. Open Razorpay SDK with order details
7. On payment success, verify with Strapi (`POST /payments/verify`)
8. Create service request in Strapi (`POST /service-requests`)
9. Show confirmation screen
10. Navigate back to Home

**UI Notes**:

- Clean pricing cards with clear differentiation
- Secure payment badge (Razorpay logo)
- Success animation on payment completion

---

## 6) Component Library

### 6.1 Core Components

**FeedHeader**

- Props: `date`, `userName`, `streak`
- Displays formatted date, greeting, and streak indicator
- Used in: DailyFeedScreen

**FeedItemCard**

- Props: `type`, `title`, `subtitle`, `body`, `tag`, `timeLabel`, `onPress`
- Renders different card styles based on type (horoscope, tip, fact, blog preview)
- Used in: DailyFeedScreen

**AdCard**

- Props: `adProvider`, `adData`
- Renders native ad format with "Sponsored" badge
- Used in: DailyFeedScreen
- Fallback to placeholder if ad fails to load

**ToolCard**

- Props: `icon`, `title`, `description`, `onPress`, `badge`
- Reusable card for tool grid
- Used in: ToolsScreen, HomeScreen

**PremiumServiceCard**

- Props: `title`, `price`, `description`, `features`, `onPress`
- Premium service offering card
- Used in: PremiumScreen, HomeScreen

**BlogCard**

- Props: `image`, `title`, `excerpt`, `author`, `date`, `onPress`
- Blog post preview card
- Used in: BlogListScreen, DailyFeedScreen

**ScoreDisplay**

- Props: `score`, `maxScore`, `rating`, `color`
- Large circular or bar score visualization
- Used in: CompatibilityScreen

**LoadingSkeleton**

- Props: `type` (card, text, image)
- Loading placeholder with shimmer animation
- Used in: All screens with async data

**ErrorBoundary**

- Error fallback UI with retry button
- Wraps all screens

### 6.2 Layout Components

**SafeAreaContainer**

- Wrapper with SafeAreaView + StatusBar
- Consistent padding and background
- Used in: All screens

**SectionHeader**

- Props: `title`, `actionLabel`, `onActionPress`
- Section title with optional action link
- Used in: HomeScreen, ToolsScreen

**ModalContainer**

- Full-screen modal with header and close button
- Consistent modal styling
- Used in: KundliScreen, CompatibilityScreen, Premium

---

## 7) State Management Strategy

### 7.1 Server State (React Query)

**Queries**:

- `useUserProfile()` - Fetches user profile from Strapi
- `useFeedItems(page)` - Fetches feed items with pagination
- `useBlogPosts(category, page)` - Fetches blog posts
- `useBlogPost(id)` - Fetches single blog post
- `usePaymentHistory()` - Fetches user's payment history

**Mutations**:

- `useUpdateProfile()` - Updates user birth details
- `useCreatePayment()` - Creates Razorpay order
- `useVerifyPayment()` - Verifies payment and upgrades user
- `useCreateServiceRequest()` - Creates ask/call/report request

**Cache Strategy**:

- User profile: staleTime 5 minutes, cacheTime 30 minutes
- Feed items: staleTime 5 minutes, cacheTime 30 minutes
- Blog posts: staleTime 15 minutes, cacheTime 1 hour
- Payment history: staleTime 10 minutes, cacheTime 1 hour

**Offline Support**:

- React Query persister with AsyncStorage
- Cache persists between app launches
- Auto-refetch on network reconnect

### 7.2 Client State (useState/useReducer)

**Local State**:

- Form inputs (login, birth details, compatibility input)
- Modal visibility (open/close)
- Tab navigation state (handled by React Navigation)
- Calculated astrology data (horoscope, kundli, compatibility)

**Why Not Global State**:

- Server data is handled by React Query (no Redux needed)
- Authentication state is in AsyncStorage + React Query
- Navigation state is in React Navigation
- Local UI state doesn't need to be shared

### 7.3 AsyncStorage Persistence

**Stored Data**:

- `@auth_token` - Firebase ID token
- `@user_id` - Firebase user ID
- `@user_profile` - Cached user profile (birth details)
- `@streak_data` - Login streak count and last login date
- `@kundli_cache` - Cached kundli calculation
- `@compatibility_history` - Recent compatibility checks
- `@theme_preference` - Light/Dark mode
- `@language_preference` - Hindi/English

**Storage Strategy**:

- Write on significant events (login, profile update, calculation)
- Read on app launch for instant UI
- Clear on logout

---

## 8) Client-Side Astrology Engine

### 8.1 Swiss Ephemeris Integration

**Library**: `swisseph` (React Native compatible fork or JS port)

**Core Functions**:

- `calculatePlanetPositions(jd, latitude, longitude)` - Returns planet positions for Julian Day
- `calculateHouses(jd, latitude, longitude)` - Returns 12 house cusps
- `calculateNakshatra(moonLongitude)` - Returns nakshatra from moon position
- `calculateDasha(birthJD, currentJD)` - Returns Vimshottari Dasha periods

**Setup Notes**:

- Download ephemeris data files (sepl\_\*.se1) and bundle with app
- Store in app's local directory for offline access
- Initialize Swiss Ephemeris library on app launch

### 8.2 Calculation Pipeline

**Daily Horoscope**:

1. Get user's birth date, time, place from profile
2. Calculate birth chart (lagna, rashi, nakshatra)
3. Calculate today's transiting planets
4. Compare transits to natal chart
5. Generate prediction based on:
   - Transiting planets in relation to natal houses
   - Current Dasha period
   - Day of week (weekday rulers)
6. Format as horoscope card data

**Kundli Lite**:

1. Convert birth details to Julian Day
2. Calculate planet positions at birth
3. Calculate house cusps (Placidus or Whole Sign)
4. Identify Lagna (1st house cusp sign)
5. Identify Rashi (Moon sign)
6. Calculate Nakshatra from Moon longitude
7. Generate 2-3 key insights from planet strengths
8. Return summary data

**Compatibility**:

1. Calculate natal data for both partners
2. Compare Moon signs (rashis)
3. Run Ashtakoot Milan algorithm:
   - Varna (caste/temperament) - 1 point
   - Vashya (magnetic control) - 2 points
   - Tara (birth star) - 3 points
   - Yoni (nature) - 4 points
   - Graha Maitri (planetary friendship) - 5 points
   - Gana (temperament group) - 6 points
   - Bhakoot (sign lords) - 7 points
   - Nadi (pulse/energy) - 8 points
4. Sum total (max 36)
5. Generate interpretation:
   - 0-18: Needs work, show remedies
   - 19-27: Good match
   - 28-36: Excellent match
6. Return score + strengths + cautions

**Panchang**:

1. Get current date and user's location
2. Calculate sunrise/sunset for location
3. Calculate Moon position and tithi (lunar day)
4. Calculate nakshatra at current time
5. Calculate Rahu Kaal time window
6. Return compact panchang data

**Today's Focus**:

1. Get user's current Dasha period
2. Get transiting benefic planets
3. Determine strongest house activation today
4. Map to life area (career/love/health/finance)
5. Generate single-sentence guidance
6. Return focus data

### 8.3 Caching Strategy

**Calculation Cache**:

- Kundli: Cache for lifetime (only recalculate if birth details change)
- Horoscope: Cache until midnight, then recalculate
- Panchang: Cache until midnight
- Compatibility: Cache for 30 days per partner

**Storage**:

- Use AsyncStorage for persistent cache
- Use in-memory cache (React state) for current session

**Invalidation**:

- Clear kundli cache on birth details update
- Clear daily caches at midnight (background task or on first launch of new day)

---

## 9) Data Flow: End-to-End Examples

### 9.1 User Login Flow

1. User opens app
2. App checks AsyncStorage for `@auth_token`
3. If token exists:
   - Verify token with Firebase (optional refresh)
   - Fetch user profile from Strapi API
   - Cache profile in React Query
   - Navigate to Main (Feed tab)
4. If no token:
   - Show LoginScreen
   - User enters email/password
   - Call Firebase Auth `signInWithEmailAndPassword()`
   - Receive Firebase ID token
   - Store token in AsyncStorage
   - Fetch/create user profile in Strapi
   - Navigate to Main (Feed tab)

### 9.2 Daily Feed Flow

1. User lands on DailyFeedScreen
2. App checks if birth details exist in profile
3. If birth details exist:
   - Calculate daily horoscope client-side
   - Fetch feed items from Strapi API
   - Render horoscope card + feed items + ads
4. If no birth details:
   - Show "Add birth details" CTA card
   - Navigate to ProfileScreen on tap
5. User scrolls:
   - Lazy load more feed items (pagination)
   - Render ads every 3-4 items
6. User pulls to refresh:
   - Refetch feed items
   - Recalculate horoscope (if past midnight)

### 9.3 Kundli View Flow

1. User taps "Kundli Lite" card in Tools tab
2. App checks AsyncStorage for cached kundli
3. If cached and birth details unchanged:
   - Show summary from cache
4. If not cached:
   - Calculate kundli client-side using Swiss Ephemeris
   - Cache result in AsyncStorage
   - Show summary
5. User taps "View Full Chart":
   - Open KundliScreen modal
   - Render full chart data from cache
6. User taps "Get Detailed Report":
   - Close modal
   - Navigate to PremiumScreen with "Report" preselected

### 9.4 Premium Payment Flow

1. User taps "Ask a Question" from PremiumScreen
2. App shows question input modal
3. User types question and taps "Proceed to Payment"
4. App calls Strapi API: `POST /payments/create-order` with `{ amount: 49, planType: 'ask_question' }`
5. Strapi creates Razorpay order and returns order details
6. App opens Razorpay SDK with order details
7. User completes payment in Razorpay UI
8. Razorpay returns payment details to app
9. App calls Strapi API: `POST /payments/verify` with `{ razorpay_order_id, razorpay_payment_id, razorpay_signature }`
10. Strapi verifies signature with Razorpay
11. If valid:
    - Strapi updates payment record to "completed"
    - Strapi creates service request record with user's question
    - Strapi sends WhatsApp + Email to astrologer team
    - Strapi sends confirmation email to user
12. App receives success response
13. App shows success screen: "Your question has been submitted. You'll receive an answer within 24 hours."
14. App invalidates React Query cache for payment history
15. User navigates back to Home

### 9.5 Compatibility Check Flow

1. User taps "Compatibility" tool from Tools tab
2. App opens CompatibilityScreen modal
3. User enters partner's birth date
4. User taps "Check Compatibility"
5. App calculates compatibility client-side:
   - Calculate user's rashi (from profile)
   - Calculate partner's rashi (from input date)
   - Run Ashtakoot Milan algorithm
   - Generate score + insights
6. App shows results:
   - Score display (e.g., "28/36 - Good Match")
   - Strengths + cautions + advice
7. User taps "View Detailed Breakdown":
   - Expand to show 8-fold table
8. User taps "Save This Check":
   - Store in AsyncStorage under `@compatibility_history`
9. User taps "Get Personalized Report":
   - Close modal
   - Navigate to PremiumScreen with "Report" preselected

---

## 10) UI/UX Design System

### 10.1 Color Palette

**Primary Colors**:

- Primary Purple: `#4a148c` (CTAs, highlights)
- Deep Purple: `#6a1b9a` (gradients, backgrounds)
- Gold Accent: `#ffd54f` (premium badges, stars)

**Background Colors** (Dark Theme):

- Screen Background: `#1a1a2e` (deep navy/black)
- Card Background: `#16213e` (dark slate)
- Elevated Card: `#0f3460` (lighter slate)

**Background Colors** (Light Theme):

- Screen Background: `#f5f5f5` (light gray)
- Card Background: `#ffffff` (white)
- Elevated Card: `#fafafa` (off-white)

**Text Colors**:

- Primary Text (Dark): `#ffffff`
- Secondary Text (Dark): `#b0b0b0`
- Primary Text (Light): `#212121`
- Secondary Text (Light): `#757575`

**Semantic Colors**:

- Success: `#4caf50` (good compatibility, completed)
- Warning: `#ff9800` (caution, moderate)
- Error: `#f44336` (low compatibility, failed)
- Info: `#2196f3` (neutral info)

### 10.2 Typography

**Font Family**: System default (SF Pro on iOS, Roboto on Android)

**Type Scale**:

- H1: 28px, Bold (screen titles)
- H2: 22px, SemiBold (section headers)
- H3: 18px, SemiBold (card titles)
- Body: 16px, Regular (main text)
- Caption: 14px, Regular (metadata, labels)
- Small: 12px, Regular (disclaimers, fine print)

**Line Height**: 1.5x font size (for readability)

### 10.3 Spacing System

**Base Unit**: 8px

**Spacing Scale**:

- XS: 4px (tight padding)
- S: 8px (compact elements)
- M: 16px (standard padding)
- L: 24px (section spacing)
- XL: 32px (screen margins)

**Card Padding**: 16px (M)
**Screen Padding**: 20px horizontal, 16px vertical

### 10.4 Component Patterns

**Card**:

- Border radius: 12px
- Shadow: `elevation: 3` (Android), `shadowOffset: {width: 0, height: 2}` (iOS)
- Background: Card background color from theme
- Padding: 16px

**Button (Primary)**:

- Background: Primary Purple
- Text: White
- Border radius: 8px
- Height: 48px
- Font: Body, SemiBold

**Button (Secondary)**:

- Background: Transparent
- Border: 1px Primary Purple
- Text: Primary Purple
- Border radius: 8px
- Height: 48px

**Input Field**:

- Background: Elevated card color
- Border: 1px transparent (focus: 1px Primary Purple)
- Border radius: 8px
- Height: 48px
- Padding: 12px horizontal
- Font: Body

**Tab Bar**:

- Height: 60px
- Background: Card background
- Active icon: Primary Purple
- Inactive icon: Secondary text color
- Label: Caption size

---

## 11) Offline Support and Performance

### 11.1 Offline Capabilities

**What Works Offline**:

- Daily horoscope (if calculated today and cached)
- Kundli Lite (if birth details cached)
- Compatibility checks (client-side calculation)
- Panchang (if today's data cached)
- Previously viewed feed items (from React Query cache)
- Previously viewed blog posts (from cache)

**What Requires Network**:

- Login/Registration
- Fetching new feed items
- Fetching new blog posts
- Payment processing
- Submitting service requests
- Profile updates

**Offline UX**:

- Show cached data with "Offline" indicator
- Disable network-dependent CTAs with "Requires network" message
- Queue mutations for retry when online (React Query)

### 11.2 Performance Optimizations

**Image Loading**:

- Use `react-native-fast-image` for caching and performance
- Lazy load images in feed (only visible items)
- Compress images before upload (backend)
- Use appropriate image sizes (thumbnail vs full)

**List Rendering**:

- Use `FlatList` with `windowSize` optimization
- Implement `getItemLayout` for fixed-height items
- Use `keyExtractor` with stable IDs
- Avoid inline function definitions in renderItem

**Navigation**:

- Lazy load screens with `React.lazy()` (if large)
- Use native stack for better performance
- Avoid deep navigation stacks

**Astrology Calculations**:

- Calculate once and cache aggressively
- Use Web Workers (if heavy calculation) - optional
- Debounce compatibility calculations on input change

**App Size**:

- Enable Hermes bytecode (React Native)
- Use Expo's app.json asset optimization
- ProGuard/tree-shaking for production builds

---

## 12) Testing Strategy

### 12.1 Unit Tests (Jest + React Testing Library)

**Components to Test**:

- `FeedItemCard` renders correctly for each type
- `AdCard` renders and handles ad load failure
- `ScoreDisplay` shows correct color for score ranges
- `ToolCard` calls onPress with correct params

**Utilities to Test**:

- Astrology engine functions (calculateKundli, calculateCompatibility)
- Date formatting helpers
- Validation functions (email, phone format)

**API Client to Test**:

- Token attachment to requests
- 401 handling (logout)
- Error response parsing

### 12.2 Integration Tests

**User Flows to Test**:

- Login → Fetch profile → Show feed
- Add birth details → Calculate horoscope
- Compatibility check end-to-end
- Payment flow (mocked Razorpay)

**Setup**:

- Mock Strapi API responses
- Mock Firebase Auth
- Mock AsyncStorage
- Mock Swiss Ephemeris calculations

### 12.3 E2E Tests (Detox or Maestro)

**Critical Paths**:

- User can sign up and log in
- User can view horoscope after adding birth details
- User can complete a payment
- User can navigate all tabs

**Test Environment**:

- Use test backend instance
- Mock payment verification
- Pre-seeded test data

---

## 13) Accessibility (a11y)

**Requirements**:

- All interactive elements have `accessibilityLabel`
- Screen readers can navigate logically
- Sufficient color contrast (WCAG AA: 4.5:1 for text)
- Touch targets ≥44x44 pixels
- Form inputs have labels and error messages
- Dynamic text sizing support

**Testing**:

- Enable VoiceOver (iOS) or TalkBack (Android) and navigate app
- Check contrast ratios in design tool
- Test with large text settings

---

## 14) Localization (i18n)

**Languages**:

- English (default)
- Hindi (primary target market)

**Implementation**:

- Use `react-i18next` or `expo-localization`
- Store translations in JSON files
- Allow language toggle in ProfileScreen settings

**Translatable Content**:

- All UI labels and buttons
- Screen titles
- Error messages
- Horoscope prediction templates
- Tool descriptions

**Not Translated**:

- User-generated content (questions, names)
- Blog posts (authored in specific language)

---

## 15) Push Notifications

**Use Cases**:

1. **Daily Horoscope Reminder**: "Your daily horoscope is ready!" at 8 AM
2. **Service Response**: "Your astrologer has answered your question!"
3. **Payment Confirmation**: "Payment successful! Your report will arrive soon."
4. **Streak Reminder**: "Don't break your 5-day streak! Check today's horoscope."
5. **Premium Expiry**: "Your premium access expires in 3 days."

**Implementation**:

- Use Expo Push Notifications
- Store push tokens in Strapi user record
- Send from Strapi backend (scheduled jobs or event triggers)

**User Control**:

- Settings toggle for each notification type
- System-level notification permissions

---

## 16) Analytics and Tracking

**Key Metrics**:

- Daily Active Users (DAU)
- Horoscope view rate
- Tool usage (Kundli, Compatibility, Panchang)
- Blog post engagement (clicks, time on post)
- Feed scroll depth
- Payment conversion rate
- Service request completion rate
- Streak retention (7-day, 30-day)

**Events to Track**:

- Screen views
- Tool usage (Kundli viewed, Compatibility checked)
- Payment initiated / completed / failed
- Birth details added/updated
- Feed item tapped
- Blog post viewed
- User registered / logged in
- Premium service purchased

**Tools**:

- Firebase Analytics (basic, free)
- Mixpanel or Amplitude (detailed funnel analysis)

**Privacy**:

- Anonymize birth details in events
- Comply with GDPR/privacy policies
- Allow opt-out in settings

---

## 17) Security Considerations

### 17.1 Authentication Security

- Store Firebase ID token securely in AsyncStorage
- Auto-refresh token before expiry
- Logout clears all stored tokens
- No password stored on device (Firebase handles)

### 17.2 API Communication

- All API calls over HTTPS
- Token validation on every request
- Rate limiting on sensitive endpoints (Strapi handles)
- No sensitive data in URL params

### 17.3 Payment Security

- Razorpay SDK handles card data (PCI compliant)
- App never sees card numbers
- Payment verification happens server-side
- Display order ID for user reference

### 17.4 Data Privacy

- Birth details encrypted at rest (Strapi/Cloud SQL encryption)
- No third-party sharing of personal data
- User can delete account (deletes all data)
- Privacy policy and consent on first launch

---

## 18) Setup Process (Verbose Step-by-Step)

This section provides complete setup instructions for a developer starting from scratch.

### 18.1 Prerequisites

**Install Required Software**:

- Node.js 20+ (LTS version)
- npm or yarn
- Expo CLI: `npm install -g expo-cli`
- Git
- VS Code (recommended) with extensions:
  - React Native Tools
  - ESLint
  - Prettier
  - TypeScript

**Accounts/Services**:

- Firebase account (for Auth)
- Strapi backend deployed (see backend.md)
- Razorpay account (test and live keys)

### 18.2 Project Initialization

1. **Create Expo App**:

   ```bash
   npx create-expo-app astrology-mobile --template expo-template-blank-typescript
   cd astrology-mobile
   ```

2. **Install Core Dependencies**:

   ```bash
   npm install @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs
   npm install react-native-screens react-native-safe-area-context
   npm install @tanstack/react-query
   npm install @react-native-async-storage/async-storage
   npm install axios
   npm install react-native-dotenv
   ```

3. **Install Firebase**:

   ```bash
   npm install firebase
   ```

4. **Install Razorpay**:

   ```bash
   npm install react-native-razorpay
   ```

5. **Install Swiss Ephemeris** (if available for RN):

   ```bash
   npm install swisseph
   # Or use a JavaScript port/implementation
   ```

6. **Install Utility Libraries**:

   ```bash
   npm install date-fns
   npm install react-native-render-html
   npm install react-native-fast-image
   npm install react-i18next i18next
   ```

7. **Install Dev Dependencies**:
   ```bash
   npm install --save-dev @types/react @types/react-native
   npm install --save-dev @testing-library/react-native @testing-library/jest-native
   npm install --save-dev jest-expo
   npm install --save-dev eslint prettier eslint-config-prettier
   ```

### 18.3 Project Structure Setup

Create the following directory structure:

```
mobile/
├── src/
│   ├── api.ts                 # Axios API client
│   ├── config.ts              # Environment config
│   ├── firebase.ts            # Firebase initialization
│   ├── navigation/
│   │   ├── AuthNavigator.tsx
│   │   ├── MainNavigator.tsx
│   │   └── RootNavigator.tsx
│   ├── screens/
│   │   ├── LoginScreen.tsx
│   │   ├── DailyFeedScreen.tsx
│   │   ├── ToolsScreen.tsx
│   │   ├── HomeScreen.tsx
│   │   ├── ProfileScreen.tsx
│   │   ├── KundliScreen.tsx
│   │   ├── CompatibilityScreen.tsx
│   │   ├── BlogListScreen.tsx
│   │   ├── BlogPostScreen.tsx
│   │   └── PremiumScreen.tsx
│   ├── components/
│   │   ├── FeedHeader.tsx
│   │   ├── FeedItemCard.tsx
│   │   ├── AdCard.tsx
│   │   ├── ToolCard.tsx
│   │   ├── PremiumServiceCard.tsx
│   │   ├── BlogCard.tsx
│   │   ├── ScoreDisplay.tsx
│   │   ├── LoadingSkeleton.tsx
│   │   └── ErrorBoundary.tsx
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useUserProfile.ts
│   │   ├── useFeedItems.ts
│   │   └── usePayments.ts
│   ├── services/
│   │   ├── astrologyEngine.ts  # Swiss Ephemeris wrapper
│   │   ├── horoscope.ts        # Daily horoscope logic
│   │   ├── kundli.ts           # Kundli calculation
│   │   ├── compatibility.ts    # Compatibility logic
│   │   └── panchang.ts         # Panchang calculation
│   ├── utils/
│   │   ├── dateHelpers.ts
│   │   ├── validation.ts
│   │   └── storage.ts
│   ├── types/
│   │   └── index.ts            # TypeScript interfaces
│   ├── theme/
│   │   ├── colors.ts
│   │   ├── typography.ts
│   │   └── spacing.ts
│   └── locales/
│       ├── en.json
│       └── hi.json
├── assets/
│   ├── fonts/
│   ├── images/
│   └── ephemeris/              # Swiss Ephemeris data files
├── App.tsx
├── app.json
├── package.json
├── tsconfig.json
├── .env.example
└── .env
```

### 18.4 Configuration Files

**app.json**:

```json
{
  "expo": {
    "name": "Astrology App",
    "slug": "astrology-app",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#4a148c"
    },
    "updates": {
      "fallbackToCacheTimeout": 0
    },
    "assetBundlePatterns": ["**/*"],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.yourcompany.astrologyapp"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#4a148c"
      },
      "package": "com.yourcompany.astrologyapp"
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    "plugins": ["@react-native-firebase/app", "react-native-razorpay"]
  }
}
```

**.env.example**:

```
FIREBASE_API_KEY=
FIREBASE_AUTH_DOMAIN=
FIREBASE_PROJECT_ID=
FIREBASE_STORAGE_BUCKET=
FIREBASE_MESSAGING_SENDER_ID=
FIREBASE_APP_ID=

STRAPI_API_URL=https://your-strapi.com/api
RAZORPAY_KEY_ID=rzp_test_xxxxx

EXPO_PUBLIC_ENV=development
```

**tsconfig.json**:

```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
```

### 18.5 Firebase Configuration

**src/firebase.ts**:

```typescript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
```

### 18.6 API Client Configuration

**src/api.ts**:

```typescript
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from './firebase';

const api = axios.create({
  baseURL: process.env.STRAPI_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: Attach Firebase ID token
api.interceptors.request.use(
  async (config) => {
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Handle 401 errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.multiRemove(['@auth_token', '@user_id', '@user_profile']);
      // Trigger logout navigation (handled in app)
    }
    return Promise.reject(error);
  }
);

export default api;
```

### 18.7 React Query Setup

**App.tsx**:

```typescript
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootNavigator from './src/navigation/RootNavigator';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 30 * 60 * 1000, // 30 minutes
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <RootNavigator />
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
```

### 18.8 Running the App

1. **Start Expo Dev Server**:

   ```bash
   npm start
   ```

2. **Run on iOS Simulator**:

   ```bash
   npm run ios
   ```

3. **Run on Android Emulator**:

   ```bash
   npm run android
   ```

4. **Run on Physical Device**:
   - Install Expo Go app
   - Scan QR code from terminal

---

## 19) Development Workflow

### 19.1 Daily Development Tasks

1. Pull latest code from main branch
2. Create feature branch: `git checkout -b feature/kundli-screen`
3. Develop screen/component
4. Write tests for new code
5. Run tests: `npm test`
6. Run linter: `npm run lint`
7. Format code: `npm run format`
8. Commit with clear message: `git commit -m "Add Kundli screen with chart display"`
9. Push and create pull request

### 19.2 Code Review Checklist

- [ ] TypeScript types are correct (no `any`)
- [ ] Components use React Query for server data
- [ ] Loading and error states handled
- [ ] Accessibility labels added
- [ ] Navigation works correctly
- [ ] Offline behavior is acceptable
- [ ] Tests pass
- [ ] No console warnings

### 19.3 Common Commands

```bash
# Start dev server
npm start

# Run tests
npm test

# Run tests with coverage
npm test -- --coverage

# Type check
npx tsc --noEmit

# Lint
npm run lint

# Format
npm run format

# Clear cache
npx expo start -c

# Build for production (iOS)
eas build --platform ios --profile production

# Build for production (Android)
eas build --platform android --profile production
```

---

## 20) Deployment Process

### 20.1 Pre-Deployment Checklist

- [ ] All tests passing
- [ ] No TypeScript errors
- [ ] Environment variables set for production
- [ ] API URLs point to production Strapi
- [ ] Razorpay keys switched to live mode
- [ ] Analytics enabled
- [ ] Sentry error tracking configured
- [ ] Push notification certificates/keys configured
- [ ] App icons and splash screens finalized
- [ ] Privacy policy and terms linked
- [ ] App Store / Play Store assets prepared

### 20.2 Build Process (EAS Build)

1. **Install EAS CLI**:

   ```bash
   npm install -g eas-cli
   ```

2. **Login to Expo**:

   ```bash
   eas login
   ```

3. **Configure EAS**:

   ```bash
   eas build:configure
   ```

4. **Create Production Build (iOS)**:

   ```bash
   eas build --platform ios --profile production
   ```

5. **Create Production Build (Android)**:

   ```bash
   eas build --platform android --profile production
   ```

6. **Download and Test Build**

7. **Submit to App Store**:

   ```bash
   eas submit --platform ios
   ```

8. **Submit to Play Store**:
   ```bash
   eas submit --platform android
   ```

### 20.3 Post-Deployment

- Monitor error rates in Sentry
- Track analytics for adoption and engagement
- Respond to user reviews
- Plan hotfixes or next version features

---

## 21) Maintenance and Updates

### 21.1 Regular Maintenance Tasks

**Weekly**:

- Review crash reports (Sentry)
- Check analytics for anomalies
- Update feed content (Strapi admin)

**Monthly**:

- Update dependencies: `npm update`
- Review and close stale issues
- Test on latest iOS/Android versions

**Quarterly**:

- Performance audit (app size, load times)
- Accessibility audit
- Security audit (dependency vulnerabilities)

### 21.2 Content Updates

**Daily**:

- Astrologers create new feed items in Strapi
- Daily horoscope content (optional, if not client-generated)

**Weekly**:

- New blog posts published
- Review user questions and add responses

**Monthly**:

- Update app banners or promotions
- Add seasonal content (festivals, special dates)

---

## 22) Troubleshooting Common Issues

### Issue: App crashes on launch

- Check that Firebase config is correct
- Verify Strapi API URL is reachable
- Clear AsyncStorage: `AsyncStorage.clear()`
- Clear Expo cache: `npx expo start -c`

### Issue: Horoscope not calculating

- Verify birth details are complete in profile
- Check Swiss Ephemeris data files are bundled
- Check console logs for calculation errors

### Issue: Payment fails

- Verify Razorpay keys (test vs live)
- Check network connectivity
- Verify Strapi payment endpoint is working
- Test signature verification on backend

### Issue: Feed items not loading

- Check Strapi API response in logs
- Verify React Query cache status
- Test API endpoint directly (Postman)
- Check authentication token validity

### Issue: Slow performance

- Profile FlatList rendering with React DevTools
- Reduce image sizes
- Check for unnecessary re-renders
- Optimize astrology calculations (cache)

---

## 23) Future Enhancements (Roadmap)

**Phase 1 (Current)**: Core app with tools and feed
**Phase 2**: Advanced features

- Streak rewards and gamification
- Personalized daily tips based on Dasha
- Calendar view for auspicious dates
- Offline mode improvements

**Phase 3**: Social features

- Share horoscope on social media
- Invite friends (referral system)
- Community forum (optional)

**Phase 4**: Advanced tools

- Transit tracking with alerts
- Detailed Dasha timeline with notifications
- Remedies library with progress tracking
- Numerology and palmistry tools

**Phase 5**: Monetization expansion

- In-app ads optimization
- Affiliate partnerships (wellness products)
- Premium tier with ad-free experience (if business model changes)

---

## 24) Notes for AI Model

**Key Implementation Priorities**:

1. Navigation and screens first (structure before logic)
2. Authentication and API client (foundation)
3. Client-side astrology engine (core value)
4. Feed and content display (engagement)
5. Premium payment flow (monetization)
6. Polish and testing (quality)

**What to Avoid**:

- Do NOT implement astrology calculations on backend
- Do NOT create complex state management (React Query handles server state)
- Do NOT add features without progressive disclosure (keep UI clean)
- Do NOT skip caching (critical for performance and offline support)

**What to Prioritize**:

- Clean, simple UI with clear CTAs
- Fast load times (cache aggressively)
- Accurate astrology calculations (accuracy = trust)
- Smooth payment flow (conversion = revenue)
- Daily habit formation (engagement = retention)

**Design Philosophy**:

- Less is more: 3 cards max per screen
- Clarity over cleverness: simple language, clear actions
- Calm over hype: warm, grounded, trustworthy
- Mobile-first: optimize for thumb-friendly navigation

---

## 25) Glossary (Astrology Terms)

- **Lagna**: Ascendant, the rising sign at birth
- **Rashi**: Moon sign in Vedic astrology
- **Nakshatra**: Lunar mansion, one of 27 divisions of the zodiac
- **Kundli**: Birth chart showing planetary positions
- **Dasha**: Planetary time period system (Vimshottari Dasha is most common)
- **Bhava**: House in the birth chart (12 houses)
- **Ashtakoot Milan**: 8-fold compatibility matching system
- **Panchang**: Hindu almanac with daily astrological data
- **Tithi**: Lunar day (1-30)
- **Rahu Kaal**: Inauspicious time period each day
- **Muhurat**: Auspicious time for specific activities
- **Transit**: Current planetary positions vs natal chart
- **Yoga**: Planetary combination with specific meaning
- **Karana**: Half of a Tithi

---

**End of Frontend Architecture Document**
