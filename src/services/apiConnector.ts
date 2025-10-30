import { API_URLS, HTTP_STATUS, ApiResponse, RestaurantProfile, LoginResponse, DashboardData, Order, OrderStats, PaginationInfo, OrderStatus, Review, ReviewStats, ReviewPaginationInfo } from './apiConfig';

// Storage keys
const STORAGE_KEYS = {
  TOKEN: 'restaurant_token',
  USER_DATA: 'restaurant_user_data',
};

// API Connector Class
class ApiConnector {
  private baseURL: string;

  constructor() {
    this.baseURL = API_URLS.SEND_OTP.split('/restaurant')[0]; // Extract base URL
  }

  // Get headers for requests
  private getHeaders(token: string | null, contentType: string = 'application/json'): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': contentType,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
      console.log("🔑 [API] Authorization header set:", `Bearer ${token.substring(0, 20)}...`);
    } else {
      console.log("⚠️ [API] No token provided, Authorization header not set");
    }

    console.log("📋 [API] Final headers:", headers);
    return headers;
  }

  // Generic request method
  private async makeRequest<T>(
    url: string,
    token: string | null,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      // Create AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch(url, {
        ...options,
        headers: this.getHeaders(token),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Debug: Log response details
      console.log("🔍 [API] Response status:", response.status);
      console.log("🔍 [API] Response headers:", response.headers);
      
      let data: ApiResponse<T>;
      try {
        const responseText = await response.text();
        console.log("🔍 [API] Response text:", responseText.substring(0, 200) + "...");
        
        if (responseText.trim() === '') {
          throw new Error('Empty response from server');
        }
        
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error("❌ [API] JSON Parse Error:", parseError);
        console.error("❌ [API] Response was not valid JSON");
        throw new Error(`Server returned invalid response: ${parseError.message}`);
      }

      if (!response.ok) {
        // Handle specific error cases
        if (response.status === HTTP_STATUS.UNAUTHORIZED) {
          throw new Error('Session expired. Please login again.');
        }

        throw new Error(data.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      return data;
    } catch (error: any) {
      console.error('API Request Error:', error);
      
      // Handle timeout specifically
      if (error.name === 'AbortError') {
        throw new Error('Request timeout - server took too long to respond');
      }
      
      throw error;
    }
  }

  // POST request method
  private async post<T>(url: string, body: any, token: string | null): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(url, token, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  // GET request method
  private async get<T>(url: string, token: string | null): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(url, token, {
      method: 'GET',
    });
  }

  // PUT request method
  private async put<T>(url: string, body: any, token: string | null): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(url, token, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  // PATCH request method
  private async patch<T>(url: string, body: any, token: string | null): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(url, token, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  }

  // DELETE request method
  private async delete<T>(url: string, token: string | null): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(url, token, {
      method: 'DELETE',
    });
  }

  // Multipart form data request method
  private async postFormData<T>(url: string, formData: FormData, token: string | null): Promise<ApiResponse<T>> {
    try {
      console.log("📤 [API] Making POST request to:", url);
      console.log("📁 [API] FormData contents:", formData);
      
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
        headers: this.getHeaders(token, 'multipart/form-data'),
      });

      console.log("🔍 [API] Response status:", response.status);
      console.log("🔍 [API] Response headers:", response.headers);
      
      let data: ApiResponse<T>;
      let responseText: string;
      try {
        responseText = await response.text();
        console.log("🔍 [API] Response text:", responseText.substring(0, 200) + "...");
        
        if (responseText.trim() === '') {
          throw new Error('Empty response from server');
        }
        
        data = JSON.parse(responseText);
        console.log("📥 [API] Response parsed successfully:", data);
      } catch (parseError: any) {
        console.error("❌ [API] JSON Parse Error in postFormData:", parseError);
        console.error("❌ [API] Response was not valid JSON");
        console.error("❌ [API] Full response text:", responseText);
        throw new Error(`Server returned invalid response: ${parseError.message}`);
      }

      if (!response.ok) {
        // Handle specific error cases
        if (response.status === HTTP_STATUS.UNAUTHORIZED) {
          throw new Error('Session expired. Please login again.');
        }

        throw new Error(data.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      return data;
    } catch (error) {
      console.error('❌ [API] FormData request error:', error);
      throw error;
    }
  }

  // PUT multipart form data request method
  private async putFormData<T>(url: string, formData: FormData, token: string | null): Promise<ApiResponse<T>> {
    try {
      console.log("📤 [API] Making PUT request to:", url);
      console.log("📁 [API] FormData contents:", formData);
      
      const response = await fetch(url, {
        method: 'PUT',
        body: formData,
        headers: this.getHeaders(token, 'multipart/form-data'),
      });

      console.log("🔍 [API] Response status:", response.status);
      console.log("🔍 [API] Response headers:", response.headers);
      
      let data: ApiResponse<T>;
      let responseText: string;
      try {
        responseText = await response.text();
        console.log("🔍 [API] Response text:", responseText.substring(0, 200) + "...");
        
        if (responseText.trim() === '') {
          throw new Error('Empty response from server');
        }
        
        data = JSON.parse(responseText);
        console.log("📥 [API] Response parsed successfully:", data);
      } catch (parseError: any) {
        console.error("❌ [API] JSON Parse Error in putFormData:", parseError);
        console.error("❌ [API] Response was not valid JSON");
        console.error("❌ [API] Full response text:", responseText);
        throw new Error(`Server returned invalid response: ${parseError.message}`);
      }

      if (!response.ok) {
        // Handle specific error cases
        if (response.status === HTTP_STATUS.UNAUTHORIZED) {
          throw new Error('Session expired. Please login again.');
        }

        throw new Error(data.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      return data;
    } catch (error) {
      console.error('❌ [API] FormData PUT request error:', error);
      throw error;
    }
  }

  // ===== RESTAURANT API METHODS =====

  // Send OTP
  async sendOTP(phone: string, token: string | null): Promise<ApiResponse<{ phone: string; message: string }>> {
    const response = await this.post<{ phone: string; message: string }>(API_URLS.SEND_OTP, { phone }, token);
    return response;
  }

  // Verify OTP and login
  async verifyOTP(phone: string, otp: string, token: string | null): Promise<ApiResponse<LoginResponse>> {
    const response = await this.post<LoginResponse>(API_URLS.VERIFY_OTP, { phone, otp }, token);
    
    if (response.success && response.data?.token) {
      // The original code saved the token here, but the new makeRequest doesn't have a saveToken method.
      // Assuming the intent was to return the token if successful.
      // For now, we'll just return the response.
    }
    
    return response;
  }

  // Register new restaurant
  async registerRestaurant(restaurantData: Partial<RestaurantProfile>, token: string | null): Promise<ApiResponse<{ restaurant: RestaurantProfile; message: string }>> {
    const response = await this.post<{ restaurant: RestaurantProfile; message: string }>(API_URLS.REGISTER, restaurantData, token);
    return response;
  }

  // Get restaurant profile
  async getProfile(token: string | null): Promise<ApiResponse<RestaurantProfile>> {
    const response = await this.get<RestaurantProfile>(API_URLS.PROFILE, token);
    return response;
  }

  // Update restaurant profile
  async updateProfile(profileData: Partial<RestaurantProfile>, token: string | null): Promise<ApiResponse<RestaurantProfile>> {
    const response = await this.post<RestaurantProfile>(API_URLS.PROFILE, profileData, token);
    return response;
  }

  // Update profile with media files
  async updateProfileWithMedia(
    profileData: Partial<RestaurantProfile>,
    files: {
      profileImage?: any; // React Native ImageAsset
      messImages?: any[]; // React Native ImageAsset[]
      qrCode?: any;
      passbook?: any;
      aadharCard?: any;
      panCard?: any;
    },
    token: string | null
  ): Promise<ApiResponse<RestaurantProfile>> {
    try {
      console.log("🔄 [API] Starting profile update with media...");
      console.log("📝 [API] Profile data:", profileData);
      console.log("📁 [API] Files:", files);
      
      const formData = new FormData();

      // Add text fields
      if (profileData && typeof profileData === 'object') {
        Object.entries(profileData).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            if (key === 'dateOfBirth' && value instanceof Date) {
              formData.append(key, value.toISOString());
              console.log(`✅ [API] Added ${key} to FormData:`, value.toISOString());
            } else {
              formData.append(key, String(value));
              console.log(`✅ [API] Added ${key} to FormData:`, String(value));
            }
          } else {
            console.log(`⚠️ [API] Skipping ${key} (undefined/null):`, value);
          }
        });
      } else {
        console.warn("apiConnector: profileData is invalid:", profileData);
      }

      // Add files - convert React Native ImageAsset to proper file objects
      if (files.profileImage) {
        const profileFile = this.createFileFromImageAsset(files.profileImage, 'profileImage');
        if (profileFile) {
          formData.append('profileImage', profileFile);
          console.log("✅ [API] Profile image added to FormData");
        }
      }
      
      if (files.messImages && files.messImages.length > 0) {
        files.messImages.forEach((imageAsset, index) => {
          const messFile = this.createFileFromImageAsset(imageAsset, `messImage_${index}`);
          if (messFile) {
            formData.append('messImages', messFile);
            console.log(`✅ [API] Mess image ${index} added to FormData`);
          }
        });
      }
      
      if (files.qrCode) {
        const qrCodeFile = this.createFileFromImageAsset(files.qrCode, 'qrCode');
        if (qrCodeFile) {
          formData.append('qrCode', qrCodeFile);
          console.log("✅ [API] QR Code added to FormData");
        }
      }
      
      if (files.passbook) {
        const passbookFile = this.createFileFromImageAsset(files.passbook, 'passbook');
        if (passbookFile) {
          formData.append('passbook', passbookFile);
          console.log("✅ [API] Passbook added to FormData");
        }
      }
      
      if (files.aadharCard) {
        const aadharFile = this.createFileFromImageAsset(files.aadharCard, 'aadharCard');
        if (aadharFile) {
          formData.append('aadharCard', aadharFile);
          console.log("✅ [API] Aadhar card added to FormData");
        }
      }
      
      if (files.panCard) {
        const panFile = this.createFileFromImageAsset(files.panCard, 'panCard');
        if (panFile) {
          formData.append('panCard', panFile);
          console.log("✅ [API] PAN card added to FormData");
        }
      }

      console.log("📤 [API] Sending FormData to:", API_URLS.PROFILE);
      const response = await this.postFormData<RestaurantProfile>(API_URLS.PROFILE, formData, token);
      console.log("✅ [API] Profile update response:", response);
      return response;
    } catch (error) {
      console.error("❌ [API] Profile update error:", error);
      throw error;
    }
  }

  // Helper method to convert React Native ImageAsset to File object
  private createFileFromImageAsset(imageAsset: any, fileName: string): File | null {
    try {
      if (!imageAsset || !imageAsset.uri) {
        console.warn("⚠️ [API] Invalid image asset:", imageAsset);
        return null;
      }

      // For React Native, we need to create a file-like object
      // that can be appended to FormData
      const file = {
        uri: imageAsset.uri,
        type: imageAsset.type || 'image/jpeg',
        name: imageAsset.fileName || fileName,
      } as any;

      console.log("🔄 [API] Created file object:", file);
      return file;
    } catch (error) {
      console.error("❌ [API] Error creating file from image asset:", error);
      return null;
    }
  }

  // Get dashboard data
  async getDashboard(token: string | null): Promise<ApiResponse<DashboardData>> {
    const response = await this.get<DashboardData>(API_URLS.DASHBOARD, token);
    return response;
  }

  // Remove specific mess image
  async removeMessImage(imageUrl: string, token: string | null): Promise<ApiResponse<{ messImages: string[] }>> {
    const url = `${API_URLS.MESS_IMAGE}/${encodeURIComponent(imageUrl)}`;
    const response = await this.delete<{ messImages: string[] }>(url, token);
    return response;
  }

  // Clear all mess images
  async clearMessImages(token: string | null): Promise<ApiResponse<{ messImages: string[] }>> {
    const response = await this.delete<{ messImages: string[] }>(API_URLS.MESS_IMAGES, token);
    return response;
  }

  // Toggle restaurant online/offline status
  async toggleOnlineStatus(token: string | null): Promise<ApiResponse<{ isOnline: boolean; message: string }>> {
    try {
      console.log("🔄 [API] Toggling restaurant online status...");
      const response = await this.post<{ isOnline: boolean; message: string }>(API_URLS.TOGGLE_ONLINE, {}, token);
      console.log("✅ [API] Online status toggled successfully:", response.data);
      return response;
    } catch (error) {
      console.error("❌ [API] Error toggling online status:", error);
      throw error;
    }
  }

  // ===== ORDER METHODS =====

  // Get restaurant orders
  async getRestaurantOrders(token: string | null, status?: OrderStatus, page: number = 1, limit: number = 10): Promise<ApiResponse<{ orders: Order[]; pagination: PaginationInfo }>> {
    try {
      console.log("📦 [API] Fetching restaurant orders...");
      
      // Validate token
      if (!token) {
        throw new Error('Authentication token is required to fetch restaurant orders');
      }
      
      // Validate parameters
      if (page < 1) {
        console.warn("⚠️ [API] Page number cannot be less than 1, setting to 1");
        page = 1;
      }
      if (limit < 1 || limit > 100) {
        console.warn("⚠️ [API] Limit must be between 1 and 100, setting to 10");
        limit = 10;
      }
      
      const params = new URLSearchParams();
      if (status && status.trim() !== '') {
        params.append('status', status);
        console.log("📦 [API] Applied status filter:", status);
      }
      params.append('page', page.toString());
      params.append('limit', limit.toString());
      
      const url = `${API_URLS.GET_RESTAURANT_ORDERS}?${params.toString()}`;
      console.log("🔗 [API] Orders URL:", url);
      
      const response = await this.get<{ orders: Order[]; pagination: PaginationInfo }>(url, token);
      console.log("✅ [API] Restaurant orders fetched successfully");
      return response;
    } catch (error) {
      console.error("❌ [API] Error fetching restaurant orders:", error);
      throw error;
    }
  }

  // Get order by ID
  async getOrderById(orderId: string, token: string | null): Promise<ApiResponse<Order>> {
    try {
      console.log("📦 [API] Fetching order by ID:", orderId);
      
      // Validate order ID
      if (!orderId || orderId.trim() === '') {
        throw new Error('Order ID is required');
      }
      
      const url = `${API_URLS.GET_ORDER_BY_ID}/${orderId}`;
      const response = await this.get<Order>(url, token);
      console.log("✅ [API] Order fetched successfully");
      return response;
    } catch (error) {
      console.error("❌ [API] Error fetching order:", error);
      throw error;
    }
  }

  // Update order status
  async updateOrderStatus(orderId: string, status: OrderStatus, token: string | null): Promise<ApiResponse<{ orderId: string; status: string; updatedAt: string }>> {
    try {
      console.log("📦 [API] Updating order status:", orderId, status);
      
      // Validate order ID
      if (!orderId || orderId.trim() === '') {
        throw new Error('Order ID is required');
      }
      
      // Validate status
      if (!status || status.trim() === '') {
        throw new Error('Order status is required');
      }
      
      const url = `${API_URLS.UPDATE_ORDER_STATUS}/${orderId}/status`;
      const response = await this.patch<{ orderId: string; status: string; updatedAt: string }>(url, { status }, token);
      console.log("✅ [API] Order status updated successfully");
      return response;
    } catch (error) {
      console.error("❌ [API] Error updating order status:", error);
      throw error;
    }
  }

  // Cancel order
  async cancelOrder(orderId: string, reason: string, token: string | null): Promise<ApiResponse<{ orderId: string; status: string; cancellationReason: string }>> {
    try {
      console.log("📦 [API] Cancelling order:", orderId, reason);
      
      // Validate order ID
      if (!orderId || orderId.trim() === '') {
        throw new Error('Order ID is required');
      }
      
      // Validate reason
      if (!reason || reason.trim() === '') {
        throw new Error('Cancellation reason is required');
      }
      
      const url = `${API_URLS.CANCEL_ORDER}/${orderId}/cancel`;
      const response = await this.patch<{ orderId: string; status: string; cancellationReason: string }>(url, { reason, cancelledBy: 'restaurant' }, token);
      console.log("✅ [API] Order cancelled successfully");
      return response;
    } catch (error) {
      console.error("❌ [API] Error cancelling order:", error);
      throw error;
    }
  }

  // Get order statistics
  async getOrderStats(token: string | null): Promise<ApiResponse<OrderStats>> {
    try {
      console.log("📦 [API] Fetching order statistics...");
      
      // Validate token
      if (!token) {
        throw new Error('Authentication token is required to fetch order statistics');
      }
      
      const response = await this.get<OrderStats>(API_URLS.GET_ORDER_STATS, token);
      console.log("✅ [API] Order statistics fetched successfully");
      return response;
    } catch (error) {
      console.error("❌ [API] Error fetching order statistics:", error);
      throw error;
    }
  }

  // Get orders by specific status (convenience method)
  async getOrdersByStatus(status: OrderStatus, token: string | null, page: number = 1, limit: number = 10): Promise<ApiResponse<{ orders: Order[]; pagination: PaginationInfo }>> {
    try {
      console.log("📦 [API] Fetching orders by status:", status);
      return await this.getRestaurantOrders(token, status, page, limit);
    } catch (error) {
      console.error("❌ [API] Error fetching orders by status:", error);
      throw error;
    }
  }

  // Get pending orders (convenience method)
  async getPendingOrders(token: string | null, page: number = 1, limit: number = 10): Promise<ApiResponse<{ orders: Order[]; pagination: PaginationInfo }>> {
    return this.getOrdersByStatus('pending', token, page, limit);
  }

  // Get confirmed orders (convenience method)
  async getConfirmedOrders(token: string | null, page: number = 1, limit: number = 10): Promise<ApiResponse<{ orders: Order[]; pagination: PaginationInfo }>> {
    return this.getOrdersByStatus('confirmed', token, page, limit);
  }

  // Get preparing orders (convenience method)
  async getPreparingOrders(token: string | null, page: number = 1, limit: number = 10): Promise<ApiResponse<{ orders: Order[]; pagination: PaginationInfo }>> {
    return this.getOrdersByStatus('preparing', token, page, limit);
  }

  // Get ready orders (convenience method)
  async getReadyOrders(token: string | null, page: number = 1, limit: number = 10): Promise<ApiResponse<{ orders: Order[]; pagination: PaginationInfo }>> {
    return this.getOrdersByStatus('ready', token, page, limit);
  }

  // Get delivered orders (convenience method)
  async getDeliveredOrders(token: string | null, page: number = 1, limit: number = 10): Promise<ApiResponse<{ orders: Order[]; pagination: PaginationInfo }>> {
    return this.getOrdersByStatus('delivered', token, page, limit);
  }

  // Get cancelled orders (convenience method)
  async getCancelledOrders(token: string | null, page: number = 1, limit: number = 10): Promise<ApiResponse<{ orders: Order[]; pagination: PaginationInfo }>> {
    return this.getOrdersByStatus('cancelled', token, page, limit);
  }

  // ===== REVIEW METHODS =====

  // Get reviews for current restaurant
  async getRestaurantReviews(token: string | null, page: number = 1, limit: number = 10, rating?: number, sortBy: string = 'reviewDate', sortOrder: 'asc' | 'desc' = 'desc'): Promise<ApiResponse<{ reviews: Review[]; pagination: ReviewPaginationInfo }>> {
    try {
      console.log("⭐ [API] Fetching restaurant reviews...");
      
      // Validate token
      if (!token) {
        throw new Error('Authentication token is required to fetch restaurant reviews');
      }
      
      // Validate parameters
      if (page < 1) {
        console.warn("⚠️ [API] Page number cannot be less than 1, setting to 1");
        page = 1;
      }
      if (limit < 1 || limit > 100) {
        console.warn("⚠️ [API] Limit must be between 1 and 100, setting to 10");
        limit = 10;
      }
      
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', limit.toString());
      if (rating) {
        params.append('rating', rating.toString());
      }
      params.append('sortBy', sortBy);
      params.append('sortOrder', sortOrder);
      
      const url = `${API_URLS.GET_RESTAURANT_REVIEWS}?${params.toString()}`;
      console.log("🔗 [API] Reviews URL:", url);
      
      const response = await this.get<{ reviews: Review[]; pagination: ReviewPaginationInfo }>(url, token);
      console.log("✅ [API] Restaurant reviews fetched successfully");
      return response;
    } catch (error) {
      console.error("❌ [API] Error fetching restaurant reviews:", error);
      throw error;
    }
  }

  // Get reviews by restaurant ID (public access)
  async getReviewsByRestaurant(restaurantId: string, page: number = 1, limit: number = 10, rating?: number, sortBy: string = 'reviewDate', sortOrder: 'asc' | 'desc' = 'desc'): Promise<ApiResponse<{ reviews: Review[]; pagination: ReviewPaginationInfo }>> {
    try {
      console.log("⭐ [API] Fetching reviews by restaurant ID:", restaurantId);
      
      // Validate restaurant ID
      if (!restaurantId || restaurantId.trim() === '') {
        throw new Error('Restaurant ID is required');
      }
      
      // Validate parameters
      if (page < 1) {
        console.warn("⚠️ [API] Page number cannot be less than 1, setting to 1");
        page = 1;
      }
      if (limit < 1 || limit > 100) {
        console.warn("⚠️ [API] Limit must be between 1 and 100, setting to 10");
        limit = 10;
      }
      
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', limit.toString());
      if (rating) {
        params.append('rating', rating.toString());
      }
      params.append('sortBy', sortBy);
      params.append('sortOrder', sortOrder);
      
      const url = `${API_URLS.GET_REVIEWS_BY_RESTAURANT}/${restaurantId}?${params.toString()}`;
      console.log("🔗 [API] Reviews URL:", url);
      
      const response = await this.get<{ reviews: Review[]; pagination: ReviewPaginationInfo }>(url, null);
      console.log("✅ [API] Reviews by restaurant fetched successfully");
      return response;
    } catch (error) {
      console.error("❌ [API] Error fetching reviews by restaurant:", error);
      throw error;
    }
  }

  // Get review by ID
  async getReviewById(reviewId: string): Promise<ApiResponse<Review>> {
    try {
      console.log("⭐ [API] Fetching review by ID:", reviewId);
      
      // Validate review ID
      if (!reviewId || reviewId.trim() === '') {
        throw new Error('Review ID is required');
      }
      
      const url = `${API_URLS.GET_REVIEW_BY_ID}/${reviewId}`;
      const response = await this.get<Review>(url, null);
      console.log("✅ [API] Review fetched successfully");
      return response;
    } catch (error) {
      console.error("❌ [API] Error fetching review:", error);
      throw error;
    }
  }

  // Get review statistics for current restaurant
  async getReviewStats(token: string | null): Promise<ApiResponse<ReviewStats>> {
    try {
      console.log("⭐ [API] Fetching review statistics...");
      
      // Validate token
      if (!token) {
        throw new Error('Authentication token is required to fetch review statistics');
      }
      
      const response = await this.get<ReviewStats>(API_URLS.GET_REVIEW_STATS, token);
      console.log("✅ [API] Review statistics fetched successfully");
      return response;
    } catch (error) {
      console.error("❌ [API] Error fetching review statistics:", error);
      throw error;
    }
  }

  // Get review statistics by restaurant ID (public access)
  async getReviewStatsByRestaurant(restaurantId: string): Promise<ApiResponse<ReviewStats>> {
    try {
      console.log("⭐ [API] Fetching review statistics for restaurant:", restaurantId);
      
      // Validate restaurant ID
      if (!restaurantId || restaurantId.trim() === '') {
        throw new Error('Restaurant ID is required');
      }
      
      const url = `${API_URLS.GET_REVIEW_STATS}/${restaurantId}`;
      const response = await this.get<ReviewStats>(url, null);
      console.log("✅ [API] Review statistics by restaurant fetched successfully");
      return response;
    } catch (error) {
      console.error("❌ [API] Error fetching review statistics by restaurant:", error);
      throw error;
    }
  }

  // Mark review as helpful/unhelpful
  async markReviewHelpful(reviewId: string, isHelpful: boolean, token: string | null): Promise<ApiResponse<{ reviewId: string; helpfulCount: number; unhelpfulCount: number }>> {
    try {
      console.log("⭐ [API] Marking review as helpful/unhelpful:", reviewId, isHelpful);
      
      // Validate review ID
      if (!reviewId || reviewId.trim() === '') {
        throw new Error('Review ID is required');
      }
      
      // Validate token
      if (!token) {
        throw new Error('Authentication token is required to mark review as helpful/unhelpful');
      }
      
      const url = `${API_URLS.MARK_REVIEW_HELPFUL}/${reviewId}/helpful`;
      const response = await this.patch<{ reviewId: string; helpfulCount: number; unhelpfulCount: number }>(url, { isHelpful }, token);
      console.log("✅ [API] Review marked as helpful/unhelpful successfully");
      return response;
    } catch (error) {
      console.error("❌ [API] Error marking review as helpful/unhelpful:", error);
      throw error;
    }
  }

  // Report review
  async reportReview(reviewId: string, reason: string, token: string | null): Promise<ApiResponse<{ reviewId: string; reportCount: number }>> {
    try {
      console.log("⭐ [API] Reporting review:", reviewId, reason);
      
      // Validate review ID
      if (!reviewId || reviewId.trim() === '') {
        throw new Error('Review ID is required');
      }
      
      // Validate reason
      if (!reason || reason.trim() === '') {
        throw new Error('Report reason is required');
      }
      
      // Validate token
      if (!token) {
        throw new Error('Authentication token is required to report review');
      }
      
      const url = `${API_URLS.REPORT_REVIEW}/${reviewId}/report`;
      const response = await this.patch<{ reviewId: string; reportCount: number }>(url, { reason }, token);
      console.log("✅ [API] Review reported successfully");
      return response;
    } catch (error) {
      console.error("❌ [API] Error reporting review:", error);
      throw error;
    }
  }



  // ===== CATEGORY METHODS =====

  // Get all categories for restaurant
  async getAllCategories(token: string | null): Promise<ApiResponse<any[]>> {
    try {
      console.log("🔄 [API] Fetching all categories...");
      console.log("🌐 [API] Base URL:", this.baseURL);
      const url = `${this.baseURL}/restaurant/categories`;
      console.log("🔗 [API] Full URL:", url);
      const response = await this.get<any[]>(url, token);
      console.log("✅ [API] Categories fetched successfully");
      return response;
    } catch (error) {
      console.error("❌ [API] Error fetching categories:", error);
      throw error;
    }
  }

  // Create new category
  async createCategory(categoryData: { name: string; description?: string }, token: string | null): Promise<ApiResponse<any>> {
    try {
      console.log("🚀 [API] Creating new category:", categoryData);
      console.log("🌐 [API] Base URL:", this.baseURL);
      const url = `${this.baseURL}/restaurant/categories`;
      console.log("🔗 [API] Full URL:", url);
      const response = await this.post<any>(url, categoryData, token);
      console.log("✅ [API] Category created successfully");
      return response;
    } catch (error) {
      console.error("❌ [API] Error creating category:", error);
      throw error;
    }
  }

  // Create new category with image upload
  async createCategoryWithImage(formData: FormData, token: string | null): Promise<ApiResponse<any>> {
    try {
      console.log("🚀 [API] Creating new category with image upload");
      console.log("🌐 [API] Base URL:", this.baseURL);
      const url = `${this.baseURL}/restaurant/categories`;
      console.log("🔗 [API] Full URL:", url);
      console.log("📁 [API] FormData contents:", formData);
      
      const response = await this.postFormData(url, formData, token);
      console.log("✅ [API] Category with image created successfully");
      return response;
    } catch (error) {
      console.error("❌ [API] Error creating category with image:", error);
      throw error;
    }
  }

  // Get category by ID
  async getCategoryById(categoryId: string, token: string | null): Promise<ApiResponse<any>> {
    try {
      console.log("🔍 [API] Fetching category by ID:", categoryId);
      console.log("🌐 [API] Base URL:", this.baseURL);
      const url = `${this.baseURL}/restaurant/categories/${categoryId}`;
      console.log("🔗 [API] Full URL:", url);
      const response = await this.get<any>(url, token);
      console.log("✅ [API] Category fetched successfully");
      return response;
    } catch (error) {
      console.error("❌ [API] Error fetching category:", error);
      throw error;
    }
  }

  // Update category
  async updateCategory(categoryId: string, categoryData: any, token: string | null): Promise<ApiResponse<any>> {
    try {
      console.log("✏️ [API] Updating category:", categoryId, categoryData);
      console.log("🌐 [API] Base URL:", this.baseURL);
      const url = `${this.baseURL}/restaurant/categories/${categoryId}`;
      console.log("🔗 [API] Full URL:", url);
      const response = await this.put<any>(url, categoryData, token);
      console.log("✅ [API] Category updated successfully");
      return response;
    } catch (error) {
      console.error("❌ [API] Error updating category:", error);
      throw error;
    }
  }

  // Update category with image
  async updateCategoryWithImage(categoryId: string, formData: FormData, token: string | null): Promise<ApiResponse<any>> {
    try {
      console.log("✏️ [API] Updating category with image:", categoryId);
      console.log("🌐 [API] Base URL:", this.baseURL);
      const url = `${this.baseURL}/restaurant/categories/${categoryId}`;
      console.log("🔗 [API] Full URL:", url);
      const response = await this.postFormData(url, formData, token);
      console.log("✅ [API] Category with image updated successfully");
      return response;
    } catch (error) {
      console.error("❌ [API] Error updating category with image:", error);
      throw error;
    }
  }

  // Delete category
  async deleteCategory(categoryId: string, token: string | null): Promise<ApiResponse<any>> {
    try {
      console.log("🗑️ [API] Deleting category:", categoryId);
      console.log("🌐 [API] Base URL:", this.baseURL);
      const url = `${this.baseURL}/restaurant/categories/${categoryId}`;
      console.log("🔗 [API] Full URL:", url);
      const response = await this.delete(url, token);
      console.log("✅ [API] Category deleted successfully");
      return response;
    } catch (error) {
      console.error("❌ [API] Error deleting category:", error);
      throw error;
    }
  }

  // ===== ITEM METHODS =====

  // Get all items for restaurant
  async getAllItems(token: string | null): Promise<ApiResponse<any[]>> {
    try {
      console.log("🔄 [API] Fetching all items...");
      console.log("🌐 [API] Base URL:", this.baseURL);
      const url = `${this.baseURL}/restaurant/items`;
      console.log("🔗 [API] Full URL:", url);
      const response = await this.get(url, token);
      console.log("✅ [API] Items fetched successfully");
      return response;
    } catch (error) {
      console.error("❌ [API] Error fetching items:", error);
      throw error;
    }
  }

  // Get item by ID
  async getItemById(itemId: string, token: string | null): Promise<ApiResponse<any>> {
    try {
      console.log("🔍 [API] Fetching item by ID:", itemId);
      console.log("🌐 [API] Base URL:", this.baseURL);
      const url = `${this.baseURL}/restaurant/items/${itemId}`;
      console.log("🔗 [API] Full URL:", url);
      const response = await this.get(url, token);
      console.log("✅ [API] Item fetched successfully");
      return response;
    } catch (error) {
      console.error("❌ [API] Error fetching item:", error);
      throw error;
    }
  }

  // ===== OFFER METHODS =====

  // Get all offers for restaurant
  async getAllOffers(token: string | null): Promise<ApiResponse<any[]>> {
    try {
      console.log("🔄 [API] Fetching all offers...");
      console.log("🌐 [API] Base URL:", this.baseURL);
      const url = `${this.baseURL}/restaurant/offers/all`; // Use real offers endpoint
      console.log("🔗 [API] Full URL:", url);
      console.log("⏱️ [API] Starting offers request with 10s timeout...");
      
      const startTime = Date.now();
      const response = await this.get(url, token);
      const endTime = Date.now();
      
      console.log("✅ [API] Offers fetched successfully in", endTime - startTime, "ms");
      return response;
    } catch (error: any) {
      console.error("❌ [API] Error fetching offers:", error);
      console.error("❌ [API] Error details:", {
        message: error.message,
        name: error.name,
        stack: error.stack
      });
      throw error;
    }
  }

  // Get offer by ID
  async getOfferById(offerId: string, token: string | null): Promise<ApiResponse<any>> {
    try {
      console.log("🔍 [API] Fetching offer by ID:", offerId);
      console.log("🌐 [API] Base URL:", this.baseURL);
      const url = `${this.baseURL}/restaurant/offers/${offerId}`;
      console.log("🔗 [API] Full URL:", url);
      const response = await this.get(url, token);
      console.log("✅ [API] Offer fetched successfully");
      return response;
    } catch (error) {
      console.error("❌ [API] Error fetching offer:", error);
      throw error;
    }
  }

  // ===== PLAN METHODS =====

  // Get all plans for restaurant
  async getAllPlans(token: string | null): Promise<ApiResponse<{
    plans: any[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalPlans: number;
      plansPerPage: number;
    };
  }>> {
    try {
      console.log("🔄 [API] Fetching all plans...");
      console.log("🌐 [API] Base URL:", this.baseURL);
      const url = `${this.baseURL}/restaurant/plans`;
      console.log("🔗 [API] Full URL:", url);
      const response = await this.get(url, token);
      console.log("✅ [API] Plans fetched successfully");
      return response;
    } catch (error) {
      console.error("❌ [API] Error fetching plans:", error);
      throw error;
    }
  }

  // Get plan by ID
  async getPlanById(planId: string, token: string | null): Promise<ApiResponse<any>> {
    try {
      console.log("🔍 [API] Fetching plan by ID:", planId);
      console.log("🌐 [API] Base URL:", this.baseURL);
      const url = `${this.baseURL}/restaurant/plans/${planId}`;
      console.log("🔗 [API] Full URL:", url);
      const response = await this.get(url, token);
      console.log("✅ [API] Plan fetched successfully");
      return response;
    } catch (error) {
      console.error("❌ [API] Error fetching plan:", error);
      throw error;
    }
  }

  // Create new plan
  async createPlan(planData: { 
    name: string; 
    pricePerWeek: number; 
    features?: string[]; 
    weeklyMeals?: any; 
    maxSubscribers?: number; 
    isRecommended?: boolean; 
    isPopular?: boolean; 
  }, token: string | null): Promise<ApiResponse<any>> {
    try {
      console.log("🚀 [API] Creating new plan:", planData);
      console.log("🌐 [API] Base URL:", this.baseURL);
      const url = `${this.baseURL}/restaurant/plans`;
      console.log("🔗 [API] Full URL:", url);
      const response = await this.post(url, planData, token);
      console.log("✅ [API] Plan created successfully");
      return response;
    } catch (error) {
      console.error("❌ [API] Error creating plan:", error);
      throw error;
    }
  }

  // Update plan
  async updatePlan(planId: string, planData: any, token: string | null): Promise<ApiResponse<any>> {
    try {
      console.log("✏️ [API] Updating plan:", planId);
      console.log("🌐 [API] Base URL:", this.baseURL);
      const url = `${this.baseURL}/restaurant/plans/${planId}`;
      console.log("🔗 [API] Full URL:", url);
      const response = await this.put(url, planData, token);
      console.log("✅ [API] Plan updated successfully");
      return response;
    } catch (error) {
      console.error("❌ [API] Error updating plan:", error);
      throw error;
    }
  }

  // Delete plan
  async deletePlan(planId: string, token: string | null): Promise<ApiResponse<any>> {
    try {
      console.log("🗑️ [API] Deleting plan:", planId);
      console.log("🌐 [API] Base URL:", this.baseURL);
      const url = `${this.baseURL}/restaurant/plans/${planId}`;
      console.log("🔗 [API] Full URL:", url);
      const response = await this.delete(url, token);
      console.log("✅ [API] Plan deleted successfully");
      return response;
    } catch (error) {
      console.error("❌ [API] Error deleting plan:", error);
      throw error;
    }
  }

  // Toggle plan availability
  async togglePlanAvailability(planId: string, token: string | null): Promise<ApiResponse<any>> {
    try {
      console.log("🔄 [API] Toggling plan availability:", planId);
      console.log("🌐 [API] Base URL:", this.baseURL);
      const url = `${this.baseURL}/restaurant/plans/${planId}/toggle-availability`;
      console.log("🔗 [API] Full URL:", url);
      console.log("🔑 [API] Token:", token ? `${token.substring(0, 20)}...` : 'null');
      
      const response = await this.put(url, {}, token);
      console.log("📥 [API] Toggle response:", response);
      console.log("✅ [API] Plan availability toggled successfully");
      return response;
    } catch (error) {
      console.error("❌ [API] Error toggling plan availability:", error);
      throw error;
    }
  }

  // Get plan statistics
  async getPlanStats(planId: string, token: string | null): Promise<ApiResponse<any>> {
    try {
      console.log("📊 [API] Fetching plan statistics:", planId);
      console.log("🌐 [API] Base URL:", this.baseURL);
      const url = `${this.baseURL}/restaurant/plans/${planId}/stats`;
      console.log("🔗 [API] Full URL:", url);
      const response = await this.get(url, token);
      console.log("✅ [API] Plan statistics fetched successfully");
      return response;
    } catch (error) {
      console.error("❌ [API] Error fetching plan statistics:", error);
      throw error;
    }
  }

  // Get all plan statistics for restaurant
  async getAllPlanStats(token: string | null): Promise<ApiResponse<any>> {
    try {
      console.log("📊 [API] Fetching all plan statistics...");
      console.log("🌐 [API] Base URL:", this.baseURL);
      const url = `${this.baseURL}/restaurant/plans/stats`;
      console.log("🔗 [API] Full URL:", url);
      const response = await this.get(url, token);
      console.log("✅ [API] All plan statistics fetched successfully");
      return response;
    } catch (error) {
      console.error("❌ [API] Error fetching all plan statistics:", error);
      throw error;
    }
  }

  // Update meal for a specific day and meal type
  async updateMeal(planId: string, mealData: {
    day: string; 
    mealType: string; 
    meals: Array<{
      name: string; 
      calories: number; 
    }>; 
  }, token: string | null): Promise<ApiResponse<any>> {
    try {
      console.log("🍽️ [API] Updating meal for plan:", planId);
      console.log("🔍 [API] Meal data:", mealData);
      console.log("🌐 [API] Base URL:", this.baseURL);
      const url = `${this.baseURL}/restaurant/plans/${planId}/meals`;
      console.log("🔗 [API] Full URL:", url);
      const response = await this.put(url, mealData, token);
      console.log("✅ [API] Meal updated successfully");
      return response;
    } catch (error) {
      console.error("❌ [API] Error updating meal:", error);
      throw error;
    }
  }

  // Add feature to plan
  async addFeature(planId: string, feature: string, token: string | null): Promise<ApiResponse<any>> {
    try {
      console.log("✨ [API] Adding feature to plan:", planId);
      console.log("🔍 [API] Feature:", feature);
      console.log("🌐 [API] Base URL:", this.baseURL);
      const url = `${this.baseURL}/restaurant/plans/${planId}/features`;
      console.log("🔗 [API] Full URL:", url);
      const response = await this.post(url, { feature }, token);
      console.log("✅ [API] Feature added successfully");
      return response;
    } catch (error) {
      console.error("❌ [API] Error adding feature:", error);
      throw error;
    }
  }

  // Remove feature from plan
  async removeFeature(planId: string, feature: string, token: string | null): Promise<ApiResponse<any>> {
    try {
      console.log("🗑️ [API] Removing feature from plan:", planId);
      console.log("🔍 [API] Feature:", feature);
      console.log("🌐 [API] Base URL:", this.baseURL);
      const url = `${this.baseURL}/restaurant/plans/${planId}/features`;
      console.log("🔗 [API] Full URL:", url);
      const response = await this.delete(url, token);
      console.log("✅ [API] Feature removed successfully");
      return response;
    } catch (error) {
      console.error("❌ [API] Error removing feature:", error);
      throw error;
    }
  }

  // Get active offers for restaurant
  async getActiveOffers(token: string | null): Promise<ApiResponse<any[]>> {
    try {
      console.log("🏆 [API] Fetching active offers...");
      console.log("🌐 [API] Base URL:", this.baseURL);
      const url = `${this.baseURL}/restaurant/offers/active`;
      console.log("🔗 [API] Full URL:", url);
      const response = await this.get(url, token);
      console.log("✅ [API] Active offers fetched successfully");
      return response;
    } catch (error) {
      console.error("❌ [API] Error fetching active offers:", error);
      throw error;
    }
  }

  // Create new offer
  async createOffer(offerData: { 
    offerTitle: string; 
    discountAmount: number; 
    startDate: string; 
    endDate: string; 
  }, token: string | null): Promise<ApiResponse<any>> {
    try {
      console.log("🚀 [API] Creating new offer:", offerData);
      console.log("🌐 [API] Base URL:", this.baseURL);
      const url = `${this.baseURL}/restaurant/offers/create`;
      console.log("🔗 [API] Full URL:", url);
      const response = await this.post(url, offerData, token);
      console.log("✅ [API] Offer created successfully");
      return response;
    } catch (error) {
      console.error("❌ [API] Error creating offer:", error);
      throw error;
    }
  }

  // Create new offer with image upload
  async createOfferWithImage(formData: FormData, token: string | null): Promise<ApiResponse<any>> {
    try {
      console.log("🚀 [API] Creating new offer with image upload");
      console.log("🌐 [API] Base URL:", this.baseURL);
      const url = `${this.baseURL}/restaurant/offers/create`;
      console.log("🔗 [API] Full URL:", url);
      console.log("📁 [API] FormData contents:", formData);
      
      const response = await this.postFormData(url, formData, token);
      console.log("✅ [API] Offer with image created successfully");
      return response;
    } catch (error) {
      console.error("❌ [API] Error creating offer with image:", error);
      throw error;
    }
  }

  // Update offer
  async updateOffer(offerId: string, offerData: any, token: string | null): Promise<ApiResponse<any>> {
    try {
      console.log("✏️ [API] Updating offer:", offerId);
      console.log("🌐 [API] Base URL:", this.baseURL);
      const url = `${this.baseURL}/restaurant/offers/${offerId}`;
      console.log("🔗 [API] Full URL:", url);
      const response = await this.put(url, offerData, token);
      console.log("✅ [API] Offer updated successfully");
      return response;
    } catch (error) {
      console.error("❌ [API] Error updating offer:", error);
      throw error;
    }
  }

  // Update offer with image
  async updateOfferWithImage(offerId: string, formData: FormData, token: string | null): Promise<ApiResponse<any>> {
    try {
      console.log("✏️ [API] Updating offer with image:", offerId);
      console.log("🌐 [API] Base URL:", this.baseURL);
      const url = `${this.baseURL}/restaurant/offers/${offerId}`;
      console.log("🔗 [API] Full URL:", url);
      console.log("📁 [API] FormData contents:", formData);
      
      const response = await this.postFormData(url, formData, token);
      console.log("✅ [API] Offer with image updated successfully");
      return response;
    } catch (error) {
      console.error("❌ [API] Error updating offer with image:", error);
      throw error;
    }
  }

  // Delete offer
  async deleteOffer(offerId: string, token: string | null): Promise<ApiResponse<any>> {
    try {
      console.log("🗑️ [API] Deleting offer:", offerId);
      console.log("🌐 [API] Base URL:", this.baseURL);
      const url = `${this.baseURL}/restaurant/offers/${offerId}`;
      console.log("🔗 [API] Full URL:", url);
      const response = await this.delete(url, token);
      console.log("✅ [API] Offer deleted successfully");
      return response;
    } catch (error) {
      console.error("❌ [API] Error deleting offer:", error);
      throw error;
    }
  }

  // Get best seller items for restaurant
  async getBestSellers(token: string | null, limit?: number): Promise<ApiResponse<any[]>> {
    try {
      console.log("🏆 [API] Fetching best sellers...");
      console.log("🔍 [API] Best seller limit:", limit);
      console.log("🌐 [API] Base URL:", this.baseURL);
      
      // Build query parameters - only limit
      const params = new URLSearchParams();
      if (limit) params.append('limit', limit.toString());
      
      const url = `${this.baseURL}/restaurant/items/best-sellers${params.toString() ? `?${params.toString()}` : ''}`;
      console.log("🔗 [API] Full URL:", url);
      
      const response = await this.get(url, token);
      console.log("✅ [API] Best sellers fetched successfully");
      return response;
    } catch (error) {
      console.error("❌ [API] Error fetching best sellers:", error);
      throw error;
    }
  }

  // Create new item
  async createItem(itemData: { 
    name: string; 
    description?: string; 
    category: string; 
    itemCategory?: string; 
    price: number; 
    availability?: string; 
    isDietMeal?: boolean; 
    calories?: number; 
  }, token: string | null): Promise<ApiResponse<any>> {
    try {
      console.log("🚀 [API] Creating new item:", itemData);
      console.log("🌐 [API] Base URL:", this.baseURL);
      const url = `${this.baseURL}/restaurant/items`;
      console.log("🔗 [API] Full URL:", url);
      const response = await this.post(url, itemData, token);
      console.log("✅ [API] Item created successfully");
      return response;
    } catch (error) {
      console.error("❌ [API] Error creating item:", error);
      throw error;
    }
  }

  // Create new item with image upload
  async createItemWithImage(formData: FormData, token: string | null): Promise<ApiResponse<any>> {
    try {
      console.log("🚀 [API] Creating new item with image upload");
      console.log("🌐 [API] Base URL:", this.baseURL);
      const url = `${this.baseURL}/restaurant/items`;
      console.log("🔗 [API] Full URL:", url);
      console.log("📁 [API] FormData contents:", formData);
      
      const response = await this.postFormData(url, formData, token);
      console.log("✅ [API] Item with image created successfully");
      return response;
    } catch (error) {
      console.error("❌ [API] Error creating item with image:", error);
      throw error;
    }
  }

  // Update item
  async updateItem(itemId: string, itemData: any, token: string | null): Promise<ApiResponse<any>> {
    try {
      console.log("✏️ [API] Updating item:", itemId);
      console.log("🌐 [API] Base URL:", this.baseURL);
      const url = `${this.baseURL}/restaurant/items/${itemId}`;
      console.log("🔗 [API] Full URL:", url);
      const response = await this.put(url, itemData, token);
      console.log("✅ [API] Item updated successfully");
      return response;
    } catch (error) {
      console.error("❌ [API] Error updating item:", error);
      throw error;
    }
  }

  // Update item with image
  async updateItemWithImage(itemId: string, formData: FormData, token: string | null): Promise<ApiResponse<any>> {
    try {
      console.log("✏️ [API] Updating item with image:", itemId);
      console.log("🌐 [API] Base URL:", this.baseURL);
      const url = `${this.baseURL}/restaurant/items/${itemId}`;
      console.log("🔗 [API] Full URL:", url);
      console.log("📁 [API] FormData contents:", formData);
      
      const response = await this.putFormData(url, formData, token);
      console.log("✅ [API] Item with image updated successfully");
      return response;
    } catch (error) {
      console.error("❌ [API] Error updating item with image:", error);
      throw error;
    }
  }

  // Delete item
  async deleteItem(itemId: string, token: string | null): Promise<ApiResponse<any>> {
    try {
      console.log("🗑️ [API] Deleting item:", itemId);
      console.log("🌐 [API] Base URL:", this.baseURL);
      const url = `${this.baseURL}/restaurant/items/${itemId}`;
      console.log("🔗 [API] Full URL:", url);
      const response = await this.delete(url, token);
      console.log("✅ [API] Item deleted successfully");
      return response;
    } catch (error) {
      console.error("❌ [API] Error deleting item:", error);
      throw error;
    }
  }

  // Update item order count
  async updateItemOrderCount(itemId: string, orderData: {
    totalOrder?: number;
    action?: 'set' | 'increment' | 'decrement';
  }, token: string | null): Promise<ApiResponse<any>> {
    try {
      console.log("📊 [API] Updating item order count:", itemId);
      console.log("🔍 [API] Order data:", orderData);
      console.log("🌐 [API] Base URL:", this.baseURL);
      const url = `${this.baseURL}/restaurant/items/${itemId}/update-order-count`;
      console.log("🔗 [API] Full URL:", url);
      const response = await this.put(url, orderData, token);
      console.log("✅ [API] Item order count updated successfully");
      return response;
    } catch (error) {
      console.error("❌ [API] Error updating item order count:", error);
      throw error;
    }
  }

  // Toggle item availability
  async toggleItemAvailability(itemId: string, token: string | null): Promise<ApiResponse<any>> {
    try {
      console.log("🔄 [API] Toggling item availability:", itemId);
      console.log("🌐 [API] Base URL:", this.baseURL);
      const url = `${this.baseURL}/restaurant/items/${itemId}/toggle-availability`;
      console.log("🔗 [API] Full URL:", url);
      const response = await this.put(url, {}, token);
      console.log("✅ [API] Item availability toggled successfully");
      return response;
    } catch (error) {
      console.error("❌ [API] Error toggling item availability:", error);
      throw error;
    }
  }

  // Get item statistics
  async getItemStats(token: string | null): Promise<ApiResponse<any>> {
    try {
      console.log("📊 [API] Fetching item statistics...");
      console.log("🌐 [API] Base URL:", this.baseURL);
      const url = `${this.baseURL}/restaurant/items/stats`;
      console.log("🔗 [API] Full URL:", url);
      const response = await this.get(url, token);
      console.log("✅ [API] Item statistics fetched successfully");
      return response;
    } catch (error) {
      console.error("❌ [API] Error fetching item statistics:", error);
      throw error;
    }
  }

  // Logout
  async logout(token: string | null): Promise<ApiResponse<{ message: string }>> {
    try {
      const response = await this.post(API_URLS.LOGOUT, {}, token);
      // The original code had await this.clearToken(); here, but clearToken is removed.
      // Assuming the intent was to return the response.
      return response;
    } catch (error) {
      // Even if logout fails, clear the token
      // The original code had await this.clearToken(); here, but clearToken is removed.
      throw error;
    }
  }

  // ===== UTILITY METHODS =====

  // Check if user is logged in
  isLoggedIn(token: string | null): boolean {
    return !!token;
  }

  // Get current token
  getToken(token: string | null): string | null {
    return token;
  }

  // Set token manually (useful for testing or token restoration)
  setToken(token: string): void {
    // This method is no longer needed as tokens are passed directly.
    // Keeping it for now, but it will not be called from the new code.
    console.warn("setToken is deprecated. Tokens are now passed directly.");
  }

  // Clear all stored data
  async clearAllData(): Promise<void> {
    // This method is no longer needed as tokens are passed directly.
    // Keeping it for now, but it will not be called from the new code.
    console.warn("clearAllData is deprecated. Tokens are now passed directly.");
  }
}

// Export singleton instance
export const apiConnector = new ApiConnector();

// Export the class for testing or custom instances
export { ApiConnector };
