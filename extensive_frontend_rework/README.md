# Extensive Frontend Rework — GitHub Copilot Prompt Pack

## Purpose

This folder contains a sequence of focused, self-contained GitHub Copilot prompts that together convert the AstroAppV2 React Native (Expo) mobile app from its current custom-styled implementation into a strict **Material Design 3** implementation using `react-native-paper` and `react-native-paper-dates`.

Each prompt is designed to be executable by GitHub Copilot (or any capable LLM-based coding assistant) **in a single pass** without requiring follow-up context. Complex screens are split across two prompts where necessary.

## Guiding Rules (apply to every prompt)

1. **Only `react-native-paper` components** for all UI — no custom `TouchableOpacity` button wrappers, no raw `View`+`StyleSheet` cards.
2. **Only `react-native-paper-dates`** for all date and time pickers.
3. **All colors from `useTheme().colors.*`** — no hardcoded hex values in component stylesheets.
4. **Keep all existing logic** — hooks, service calls, navigation, analytics, i18n — untouched. Only the UI layer changes.
5. **Keep all imports that are needed**; remove only the React Native primitives that are replaced by Paper equivalents.
6. Preserve every existing `accessibilityLabel` or add them to all interactive elements.

## Execution Order

| # | File | What it does |
|---|------|-------------|
| 01 | `prompt-01-theme-setup.md` | Create MD3 theme file; update `App.tsx` |
| 02 | `prompt-02-navigation.md` | Replace bottom tab navigator with Paper `BottomNavigation` |
| 03 | `prompt-03-login-screen.md` | Rewrite `LoginScreen.tsx` |
| 04 | `prompt-04-onboarding-part-a.md` | Rewrite `OnboardingScreen.tsx` steps 0–2 |
| 05 | `prompt-05-onboarding-part-b.md` | Rewrite `OnboardingScreen.tsx` steps 3–4 + outer shell |
| 06 | `prompt-06-daily-feed-screen.md` | Rewrite `DailyFeedScreen.tsx` |
| 07 | `prompt-07-feed-components.md` | Rewrite `FeedItemCard`, `AdCard`, `RemedyCard` |
| 08 | `prompt-08-tools-screen.md` | Rewrite `ToolsScreen.tsx` |
| 09 | `prompt-09-home-screen.md` | Rewrite `HomeScreen.tsx` |
| 10 | `prompt-10-profile-part-a.md` | Rewrite `ProfileScreen.tsx` — main view |
| 11 | `prompt-11-profile-part-b.md` | Rewrite `ProfileScreen.tsx` — edit-details modal |
| 12 | `prompt-12-kundli-screen.md` | Rewrite `KundliScreen.tsx` |
| 13 | `prompt-13-compatibility-screen.md` | Rewrite `CompatibilityScreen.tsx` |
| 14 | `prompt-14-panchang-screen.md` | Rewrite `PanchangScreen.tsx` |
| 15 | `prompt-15-blog-screens.md` | Rewrite `BlogListScreen.tsx` + `BlogPostScreen.tsx` |
| 16 | `prompt-16-service-screens.md` | Rewrite `AskQuestionScreen`, `BookCallScreen`, `RequestReportScreen` |

## Vedic / Jyotish Note

This frontend rework operates within the app's Vedic/Jyotish foundation:

- **Sidereal zodiac (Lahiri ayanamsa)** is the default everywhere — no tropical references in UI labels
- **Hindi / Devanagari** labels are shown alongside English on all tool screens
- **Panchang** (Tithi, Nakshatra, Yoga, Karana) is a first-class feature — not an afterthought
- All colors come from `useTheme().colors.*` — the MD3 theme (`md3Theme.ts` created in Prompt 01) uses warm, earthy tones appropriate for a Vedic spiritual app

After completing all 16 prompts in this folder, apply the **Tool Rework Plan** (`tool_rework_plan/`) which adds the full suite of 16 Jyotish tools on top of this MD3 foundation.

---



1. Open the relevant source file in VS Code.
2. Open the corresponding prompt file.
3. Copy the entire contents of the prompt file.
4. Open GitHub Copilot Chat (`Ctrl+Shift+I` / `Cmd+Shift+I`).
5. Paste the prompt and confirm.
6. Review the diff — logic must be identical, only UI components should change.
7. Run `cd mobile && npx expo start` to verify the screen renders without errors.

## Current package.json key deps (already installed)

```json
"react-native-paper": "^5.15.0",
"react-native-paper-dates": "^0.23.4",
"react-native-safe-area-context": "^5.6.2",
"@react-navigation/native": "^7.1.28",
"@react-navigation/native-stack": "^7.12.0",
"@react-navigation/bottom-tabs": "^7.13.0"
```

No new packages need to be installed before running any of these prompts.
