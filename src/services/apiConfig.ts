// API Configuration for Restaurant App
// Note: OTP is now 4 digits (1234) instead of 6 digits
//
// To change the API base URL:
// 1. For local development: Update the fallback URL below
// 2. For production: Set EXPO_PUBLIC_API_URL environment variable
// 3. For different environments: Create .env files with EXPO_PUBLIC_API_URL
export const API_CONFIG = {
  // Base URL - Change this based on your environment
  // For local development, use your local IP address
  // For production, set EXPO_PUBLIC_API_URL environment variable
  BASE_URL: process.env.EXPO_PUBLIC_API_URL || 'http://18.xxx.xxx.xxx:3001',
  // BASE_URL: process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.4:3001',

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
    TOGGLE_ONLINE: '/restaurant/toggle-online',
    CATEGORIES: '/restaurant/categories',
    ITEMS: '/restaurant/items',
    OFFERS: '/restaurant/offers',
    PLANS: '/restaurant/plans',
  },
  
  // Order endpoints
  ORDERS: {
    GET_RESTAURANT_ORDERS: '/orders/restaurant',
    GET_ORDER_BY_ID: '/orders',
    UPDATE_ORDER_STATUS: '/orders',
    CANCEL_ORDER: '/orders',
    GET_ORDER_STATS: '/orders/stats/overview',
  },
  
  // Review endpoints
  REVIEWS: {
    GET_RESTAURANT_REVIEWS: '/reviews/restaurant',
    GET_REVIEWS_BY_RESTAURANT: '/reviews/restaurant',
    GET_REVIEW_BY_ID: '/reviews',
    GET_REVIEW_STATS: '/reviews/stats/restaurant',
    MARK_REVIEW_HELPFUL: '/reviews',
    REPORT_REVIEW: '/reviews',
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
  TOGGLE_ONLINE: `${API_CONFIG.BASE_URL}${API_CONFIG.API_VERSION}${API_CONFIG.RESTAURANT.TOGGLE_ONLINE}`,
  CATEGORIES: `${API_CONFIG.BASE_URL}${API_CONFIG.API_VERSION}${API_CONFIG.RESTAURANT.CATEGORIES}`,
  ITEMS: `${API_CONFIG.BASE_URL}${API_CONFIG.API_VERSION}${API_CONFIG.RESTAURANT.ITEMS}`,
  OFFERS: `${API_CONFIG.BASE_URL}${API_CONFIG.API_VERSION}${API_CONFIG.RESTAURANT.OFFERS}`,
  PLANS: `${API_CONFIG.BASE_URL}${API_CONFIG.API_VERSION}${API_CONFIG.RESTAURANT.PLANS}`,
  
  // Order APIs
  GET_RESTAURANT_ORDERS: `${API_CONFIG.BASE_URL}${API_CONFIG.API_VERSION}${API_CONFIG.ORDERS.GET_RESTAURANT_ORDERS}`,
  GET_ORDER_BY_ID: `${API_CONFIG.BASE_URL}${API_CONFIG.API_VERSION}${API_CONFIG.ORDERS.GET_ORDER_BY_ID}`,
  UPDATE_ORDER_STATUS: `${API_CONFIG.BASE_URL}${API_CONFIG.API_VERSION}${API_CONFIG.ORDERS.UPDATE_ORDER_STATUS}`,
  CANCEL_ORDER: `${API_CONFIG.BASE_URL}${API_CONFIG.API_VERSION}${API_CONFIG.ORDERS.CANCEL_ORDER}`,
  GET_ORDER_STATS: `${API_CONFIG.BASE_URL}${API_CONFIG.API_VERSION}${API_CONFIG.ORDERS.GET_ORDER_STATS}`,
  
  // Review APIs
  GET_RESTAURANT_REVIEWS: `${API_CONFIG.BASE_URL}${API_CONFIG.API_VERSION}${API_CONFIG.REVIEWS.GET_RESTAURANT_REVIEWS}`,
  GET_REVIEWS_BY_RESTAURANT: `${API_CONFIG.BASE_URL}${API_CONFIG.API_VERSION}${API_CONFIG.REVIEWS.GET_REVIEWS_BY_RESTAURANT}`,
  GET_REVIEW_BY_ID: `${API_CONFIG.BASE_URL}${API_CONFIG.API_VERSION}${API_CONFIG.REVIEWS.GET_REVIEW_BY_ID}`,
  GET_REVIEW_STATS: `${API_CONFIG.BASE_URL}${API_CONFIG.API_VERSION}${API_CONFIG.REVIEWS.GET_REVIEW_STATS}`,
  MARK_REVIEW_HELPFUL: `${API_CONFIG.BASE_URL}${API_CONFIG.API_VERSION}${API_CONFIG.REVIEWS.MARK_REVIEW_HELPFUL}`,
  REPORT_REVIEW: `${API_CONFIG.BASE_URL}${API_CONFIG.API_VERSION}${API_CONFIG.REVIEWS.REPORT_REVIEW}`,
  
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
    aadhaarCard: string;
    panCard: string;
  };
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  isActive: boolean;
  isApproved: boolean;
  isVerified: boolean;
  isProfile: boolean;
  isOnline: boolean;
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

// Order Types
export interface OrderItem {
  itemId: string;
  name: string;
  description?: string;
  price: number;
  quantity: number;
  image?: string;
  category?: string;
  itemTotal: number;
}

export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';

export interface Order {
  _id: string;
  orderNumber: string;
  orderDate: string;
  orderTime: string;
  customer: string | {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    profileImage?: string;
  };
  customerName: string;
  restaurant: string;
  restaurantName: string;
  items: OrderItem[];
  subtotal: number;
  totalAmount: number;
  deliveryAddress: {
    street: string;
    city: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  estimatedDelivery: string;
  status: OrderStatus;
  specialInstructions?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalOrders: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface OrderStats {
  statusCounts: {
    [key: string]: number;
  };
  totals: {
    totalOrders: number;
    totalRevenue: number;
    avgOrderValue: number;
  };
  dailyOrders: Array<{
    _id: string;
    count: number;
    revenue: number;
  }>;
}

// Review Types
export interface ReviewCustomer {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  profileImage?: string;
}

export interface ReviewOrder {
  _id: string;
  orderNumber: string;
  orderDate: string;
}

export interface ReviewRestaurant {
  _id: string;
  businessName: string;
  address: string;
  city: string;
  state?: string;
}

export interface Review {
  _id: string;
  reviewDate: string;
  customer: ReviewCustomer;
  customerName: string;
  customerImage?: string;
  restaurant: string;
  restaurantName: string;
  restaurantLocation?: string;
  order: ReviewOrder;
  orderNumber: string;
  orderDate: string;
  rating: number;
  review: string;
  helpfulCount: number;
  unhelpfulCount: number;
  reportCount: number;
  viewCount: number;
  isVisible: boolean;
  isFlagged: boolean;
  tags?: string[];
  sentiment?: 'positive' | 'neutral' | 'negative';
  sentimentScore?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewStats {
  totalReviews: number;
  averageRating: number;
  ratingDistribution: {
    [key: number]: number;
  };
  totalRating: number;
}

export interface ReviewPaginationInfo {
  currentPage: number;
  totalPages: number;
  totalReviews: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}
