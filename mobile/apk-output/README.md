# APK Output Directory

This directory is the designated output folder for MVP APK builds.

APK files are **not committed to the repository** (see `.gitignore`). They are produced by the build commands below.

---

## Option A — Local Gradle Build (recommended for MVP)

Build the APK entirely on your local machine using Gradle, with no Expo account or cloud service required.

### Prerequisites

- **Node.js** ≥ 18 and npm installed
- **Android SDK** installed and `ANDROID_HOME` set (Android Studio installs this automatically)
- **Java 17** (required by React Native 0.73+). Verify: `java -version`
- **Gradle** is included via the Gradle wrapper (`android/gradlew`) — no separate installation needed

### Steps

```bash
# 1. Install JS dependencies (if not already done)
cd mobile
npm install

# 2. Copy environment variables
cp .env.example .env
# Edit .env and fill in your Firebase and Strapi credentials

# 3. Run prebuild to generate the native android/ folder, then assemble the APK
npm run build:gradle
```

This single command:
1. Runs `expo prebuild --platform android --clean` to generate the `android/` Gradle project from the Expo config
2. Invokes `./gradlew assembleRelease` to compile a release APK
3. Copies the finished APK to `apk-output/astroapp-mvp-release.apk`

For a **debug** APK (no signing required):

```bash
npm run build:gradle:debug
# Output: apk-output/astroapp-mvp-debug.apk
```

### Install on Android device

1. Enable **Install from unknown sources** on the device (Settings → Security)
2. Transfer `apk-output/astroapp-mvp-release.apk` to the device and open it

---

## Option B — EAS Local Build (Gradle via EAS CLI, offline)

Uses the EAS CLI to drive Gradle locally — same Gradle commands as Option A but with EAS's build orchestration.

```bash
npm install -g eas-cli
eas login
npm run build:mvp:local    # runs eas build --local, uses :app:assembleRelease
```

---

## Option C — EAS Cloud Build

Build in Expo's managed cloud infrastructure. Requires an Expo account.

```bash
npm install -g eas-cli
eas login
eas init                   # one-time: links app.json projectId to your account
npm run build:mvp          # triggers cloud build, returns download URL
```

---

## All Build Commands

| Command | Output | Method |
|---|---|---|
| `npm run build:gradle` | `apk-output/astroapp-mvp-release.apk` | Local Gradle (`assembleRelease`) |
| `npm run build:gradle:debug` | `apk-output/astroapp-mvp-debug.apk` | Local Gradle (`assembleDebug`) |
| `npm run build:mvp:local` | `apk-output/` (EAS writes here) | EAS CLI + local Gradle |
| `npm run build:mvp` | APK download URL (Expo dashboard) | EAS Cloud |
| `npm run build:production` | AAB download URL (Expo dashboard) | EAS Cloud → Play Store |

---

## Offline-Ready Features (MVP)

The following features work fully offline without a network connection:

| Feature | Offline Support |
|---|---|
| Daily Horoscope | ✅ Deterministic local engine |
| Kundli (Birth Chart) | ✅ Pure-JS astrology engine |
| Compatibility | ✅ Local calculation |
| Daily Panchang | ✅ Local calculation |
| Today's Remedy | ✅ Local data |
| Feed / Blog | ✅ Cached via AsyncStorage (react-query persistence) |
| Push Notifications | ❌ Requires network |
| Booking / Payments | ❌ Requires network |

When offline, the **offline banner** is shown at the top of the Feed screen and stale cached data is displayed transparently.
