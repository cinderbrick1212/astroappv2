// User types
export interface User {
  id: string;
  firebase_uid?: string;
  email?: string;
  phone?: string;
  name?: string;
  premium_status: boolean;
  premium_expires_at?: string;
}

export interface UserProfile {
  id: string;
  birth_date: string;
  birth_time: string;
  birth_place: string;
  timezone: string;
  gender: 'male' | 'female' | 'other';
  latitude?: number;
  longitude?: number;
}

// Feed types
export interface FeedItem {
  id: string;
  type: 'horoscope' | 'tip' | 'blog' | 'remedy';
  title: string;
  summary: string;
  body?: string;
  media?: {
    url: string;
    alternativeText?: string;
  };
  language_code: string;
  published_at: string;
  priority: number;
  is_active: boolean;
}

// Blog types
export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  body: string;
  featured_image?: {
    url: string;
    alternativeText?: string;
  };
  categories?: string[];
  author?: string;
  published_at: string;
}

// Payment types
export interface Payment {
  id: string;
  razorpay_order_id: string;
  razorpay_payment_id?: string;
  razorpay_signature?: string;
  amount: number;
  currency: string;
  status: 'created' | 'pending' | 'captured' | 'success' | 'failed';
  plan_type: string;
  created_at: string;
}

// Service Request types
export interface ServiceRequest {
  id: string;
  service_type: 'question' | 'call' | 'report';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  user_notes?: string;
  response_text?: string;
  created_at: string;
  updated_at: string;
}

// Navigation types
export type RootStackParamList = {
  Auth: undefined;
  Onboarding: undefined;
  App: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
};

export type AppStackParamList = {
  Main: undefined;
  Kundli: undefined;
  Compatibility: undefined;
  Panchang: undefined;
  AskQuestion: undefined;
  RequestReport: undefined;
  BlogList: { category?: string };
  BlogPost: { id: string };
  BookCall: undefined;
};

export type MainTabParamList = {
  Feed: undefined;
  Tools: undefined;
  Home: undefined;
  Profile: undefined;
};

/** @deprecated Use AppStackParamList for modal screens */
export type ModalStackParamList = {
  Kundli: undefined;
  Compatibility: undefined;
  BlogPost: { id: string };
  Premium: undefined;
  AskQuestion: undefined;
  BookCall: undefined;
};
