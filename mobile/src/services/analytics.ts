/**
 * Analytics service wrapping Firebase Analytics.
 * All event names follow the snake_case convention.
 */

// Lazily import firebase/analytics to avoid crashing in environments where
// the Analytics module is unavailable (e.g. Expo Go with limited SDK).
let logEventFunction: ((name: string, params?: Record<string, unknown>) => Promise<void>) | null = null;

async function getLogEvent() {
  if (logEventFunction) return logEventFunction;
  try {
    const { getAnalytics, logEvent } = await import('firebase/analytics');
    const { app } = await import('../firebase');
    const analytics = getAnalytics(app);
    logEventFunction = (name: string, params?: Record<string, unknown>) =>
      Promise.resolve(logEvent(analytics, name, params));
  } catch {
    // Firebase Analytics not available in this environment (e.g. Expo Go)
    logEventFunction = async () => {};
  }
  return logEventFunction;
}

async function track(name: string, params?: Record<string, unknown>): Promise<void> {
  try {
    const fn = await getLogEvent();
    await fn(name, params);
  } catch {
    // Silently ignore analytics errors
  }
}

export const analytics = {
  // Auth events
  userLogin: (method: string) => track('login', { method }),
  userRegister: (method: string) => track('sign_up', { method }),

  // Screen views
  screenView: (screenName: string) =>
    track('screen_view', { screen_name: screenName }),

  // Feed events
  feedItemTapped: (itemId: string, itemType: string) =>
    track('feed_item_tapped', { item_id: itemId, item_type: itemType }),

  // Tool events
  kundliViewed: () => track('kundli_viewed'),
  compatibilityChecked: () => track('compatibility_checked'),
  panchangViewed: () => track('panchang_viewed'),

  // Blog events
  blogPostViewed: (postId: string) => track('blog_post_viewed', { post_id: postId }),

  // Service request events
  questionSubmitted: () => track('question_submitted'),
  callBooked: () => track('call_booked'),

  // Payment events
  paymentInitiated: (planType: string, amount: number) =>
    track('payment_initiated', { plan_type: planType, amount }),
  paymentCompleted: (planType: string, amount: number) =>
    track('payment_completed', { plan_type: planType, amount }),
  paymentFailed: (planType: string) => track('payment_failed', { plan_type: planType }),

  // Profile events
  birthDetailsUpdated: () => track('birth_details_updated'),
  languageChanged: (language: string) => track('language_changed', { language }),

  // Engagement events
  streakUpdated: (days: number) => track('streak_updated', { days }),
};
