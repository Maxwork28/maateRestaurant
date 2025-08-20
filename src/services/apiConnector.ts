import { API_URLS, HTTP_STATUS, ApiResponse, RestaurantProfile, LoginResponse, DashboardData } from './apiConfig';

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

      const data: ApiResponse<T> = await response.json();

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

      const data: ApiResponse<T> = await response.json();
      console.log("📥 [API] Response received:", data);

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

  // ===== RESTAURANT API METHODS =====

  // Send OTP
  async sendOTP(phone: string, token: string | null): Promise<ApiResponse<{ phone: string; message: string }>> {
    const response = await this.post(API_URLS.SEND_OTP, { phone }, token);
    return response;
  }

  // Verify OTP and login
  async verifyOTP(phone: string, otp: string, token: string | null): Promise<ApiResponse<LoginResponse>> {
    const response = await this.post(API_URLS.VERIFY_OTP, { phone, otp }, token);
    
    if (response.success && response.data?.token) {
      // The original code saved the token here, but the new makeRequest doesn't have a saveToken method.
      // Assuming the intent was to return the token if successful.
      // For now, we'll just return the response.
    }
    
    return response;
  }

  // Register new restaurant
  async registerRestaurant(restaurantData: Partial<RestaurantProfile>, token: string | null): Promise<ApiResponse<{ restaurant: RestaurantProfile; message: string }>> {
    const response = await this.post(API_URLS.REGISTER, restaurantData, token);
    return response;
  }

  // Get restaurant profile
  async getProfile(token: string | null): Promise<ApiResponse<RestaurantProfile>> {
    const response = await this.get(API_URLS.PROFILE, token);
    return response;
  }

  // Update restaurant profile
  async updateProfile(profileData: Partial<RestaurantProfile>, token: string | null): Promise<ApiResponse<RestaurantProfile>> {
    const response = await this.post(API_URLS.PROFILE, profileData, token);
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
      const response = await this.postFormData(API_URLS.PROFILE, formData, token);
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
    const response = await this.get(API_URLS.DASHBOARD, token);
    return response;
  }

  // Remove specific mess image
  async removeMessImage(imageUrl: string, token: string | null): Promise<ApiResponse<{ messImages: string[] }>> {
    const url = `${API_URLS.MESS_IMAGE}/${encodeURIComponent(imageUrl)}`;
    const response = await this.delete(url, token);
    return response;
  }

  // Clear all mess images
  async clearMessImages(token: string | null): Promise<ApiResponse<{ messImages: string[] }>> {
    const response = await this.delete(API_URLS.MESS_IMAGES, token);
    return response;
  }

  // ===== CATEGORY METHODS =====

  // Get all categories for restaurant
  async getAllCategories(token: string | null): Promise<ApiResponse<any[]>> {
    try {
      console.log("🔄 [API] Fetching all categories...");
      console.log("🌐 [API] Base URL:", this.baseURL);
      const url = `${this.baseURL}/restaurant/categories`;
      console.log("🔗 [API] Full URL:", url);
      const response = await this.get(url, token);
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
      const response = await this.post(url, categoryData, token);
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
      
      const response = await this.postFormData(url, formData, token);
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
