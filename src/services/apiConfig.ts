// API Configuration for Restaurant App
// Note: OTP is now 4 digits (1234) instead of 6 digits
export const API_CONFIG = {
  // Base URL - Change this based on your environment
  BASE_URL: process.env.EXPO_PUBLIC_API_URL || 'https://api.mangiee.com',
  
  // API Version
  API_VERSION: '/api',
  
  // Restaurant endpoints
  RESTAURANT: {
    SEND_OTP: '/restaurant/send-otp',
    VERIFY_OTP: '/restaurant/verify-otp',
    REGISTER: '/restaurant/register',
    PROFILE: '/restaurant/profile',
    DASHBOARD: '/restaurant/dashboard',
    LOGOUT: '/restaurant/logout',
    MESS_IMAGE: '/restaurant/mess-image',
    MESS_IMAGES: '/restaurant/mess-images',
    CATEGORIES: '/restaurant/categories',
    ITEMS: '/restaurant/items',
    OFFERS: '/restaurant/offers',
    PLANS: '/restaurant/plans',
  },
  
  // Auth endpoints
  AUTH: {
    REFRESH_TOKEN: '/auth/refresh',
  },
  
  // File upload endpoints
  UPLOAD: {
    RESTAURANT_DOCUMENTS: '/restaurant/upload-documents',
  }
};

// Complete API URLs
export const API_URLS = {
  // Restaurant APIs
  SEND_OTP: `${API_CONFIG.BASE_URL}${API_CONFIG.API_VERSION}${API_CONFIG.RESTAURANT.SEND_OTP}`,
  VERIFY_OTP: `${API_CONFIG.BASE_URL}${API_CONFIG.API_VERSION}${API_CONFIG.RESTAURANT.VERIFY_OTP}`,
  REGISTER: `${API_CONFIG.BASE_URL}${API_CONFIG.API_VERSION}${API_CONFIG.RESTAURANT.REGISTER}`,
  PROFILE: `${API_CONFIG.BASE_URL}${API_CONFIG.API_VERSION}${API_CONFIG.RESTAURANT.PROFILE}`,
  DASHBOARD: `${API_CONFIG.BASE_URL}${API_CONFIG.API_VERSION}${API_CONFIG.RESTAURANT.DASHBOARD}`,
  LOGOUT: `${API_CONFIG.BASE_URL}${API_CONFIG.API_VERSION}${API_CONFIG.RESTAURANT.LOGOUT}`,
  MESS_IMAGE: `${API_CONFIG.BASE_URL}${API_CONFIG.API_VERSION}${API_CONFIG.RESTAURANT.MESS_IMAGE}`,
  MESS_IMAGES: `${API_CONFIG.BASE_URL}${API_CONFIG.API_VERSION}${API_CONFIG.RESTAURANT.MESS_IMAGES}`,
  CATEGORIES: `${API_CONFIG.BASE_URL}${API_CONFIG.API_VERSION}${API_CONFIG.RESTAURANT.CATEGORIES}`,
  ITEMS: `${API_CONFIG.BASE_URL}${API_CONFIG.API_VERSION}${API_CONFIG.RESTAURANT.ITEMS}`,
  OFFERS: `${API_CONFIG.BASE_URL}${API_CONFIG.API_VERSION}${API_CONFIG.RESTAURANT.OFFERS}`,
  PLANS: `${API_CONFIG.BASE_URL}${API_CONFIG.API_VERSION}${API_CONFIG.RESTAURANT.PLANS}`,
  
  // Auth APIs
  REFRESH_TOKEN: `${API_CONFIG.BASE_URL}${API_CONFIG.API_VERSION}${API_CONFIG.AUTH.REFRESH_TOKEN}`,
};

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
};

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

// Restaurant Profile Types
export interface RestaurantProfile {
  id: string;
  phone: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  businessName: string;
  email: string;
  address: string;
  city: string;
  pinCode: string;
  state: string;
  category: 'Veg' | 'Non Veg' | 'Mix';
  specialization: string;
  bankDetails: {
    bankPhoneNumber: string;
    bankName: string;
    bankBranch: string;
    accountNumber: string;
    accountHolder: string;
    ifscCode: string;
    customerId: string;
  };
  documents: {
    profileImage: string;
    messImages: string[];
    passbook: string;
    aadharCard: string;
    panCard: string;
  };
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  isActive: boolean;
  isApproved: boolean;
  isVerified: boolean;
  isProfile: boolean;
  lastLogin: string;
  createdAt: string;
}

// Login Response Type
export interface LoginResponse {
  restaurant: RestaurantProfile;
  token: string;
  isProfile: boolean;
  message?: string;
}

// Dashboard Data Type
export interface DashboardData {
  restaurantInfo: {
    name: string;
    businessName: string;
    status: string;
    isActive: boolean;
    isApproved: boolean;
  };
  stats: {
    totalOrders: number;
    totalRevenue: number;
    totalCustomers: number;
    averageRating: number;
  };
  recentActivity: any[];
}
