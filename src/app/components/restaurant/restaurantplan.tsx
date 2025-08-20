import { useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { ScrollView, TouchableOpacity, View, Alert } from 'react-native';
import {
  Button,
  Icon,
  Provider as PaperProvider,
  Switch,
  Text,
  ActivityIndicator
} from 'react-native-paper';
import { planStyles } from '../css/restaurant/planstyle';
import PlanModal from './plan-modal';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/index';
import { apiConnector } from '../../../services/apiConnector';

export type Feature = {
  id: number;
  name: string;
  details: string;
};

export type Plan = {
  id: number;
  name: string;
  price: number;
  currency: string;
  period: string;
  features: Feature[];
  planid : any,
  isActive?: boolean; // Add isActive property for switch toggle
};

// API Plan type to match backend
export type ApiPlan = {
  _id?: string;
  id?: string;
  name: string;
  pricePerWeek: number;
  features: string[];
  isActive: boolean;
  isAvailable: boolean;
  totalSubscribers: number;
  totalRevenue: number;
  averageRating: number;
  totalRatings: number;
  isRecommended: boolean;
  isPopular: boolean;
  maxSubscribers: number;
  createdAt: string;
  updatedAt: string;
};

// API Response type for plans
export type PlansApiResponse = {
  plans: ApiPlan[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalPlans: number;
    plansPerPage: number;
  };
};

const PlanManagement: React.FC = () => {
  // Redux state
  const { user, token } = useSelector((state: RootState) => state.auth);
  
  // Local state
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);

  // Fetch plans from API
  const fetchPlans = async () => {
    if (!user || !token) {
      console.log("❌ [PLAN_MANAGEMENT] User not authenticated");
      return;
    }

    console.log("🔄 [PLAN_MANAGEMENT] Fetching plans...");
    setIsLoading(true);

    try {
      const response = await apiConnector.getAllPlans(token);
      console.log("📥 [PLAN_MANAGEMENT] Plans API response:", response);

      if (response.success && response.data) {
        console.log("✅ [PLAN_MANAGEMENT] Plans fetched successfully");
        console.log("🔍 [PLAN_MANAGEMENT] Response data structure:", JSON.stringify(response.data, null, 2));
        console.log("🔍 [PLAN_MANAGEMENT] Response data type:", typeof response.data);
        console.log("🔍 [PLAN_MANAGEMENT] Response data keys:", Object.keys(response.data));
        
        // Handle different response structures
        let plansArray: ApiPlan[] = [];
        if (response.data.plans && Array.isArray(response.data.plans)) {
          plansArray = response.data.plans;
        } else if (Array.isArray(response.data)) {
          plansArray = response.data;
        }
        
        console.log("📊 [PLAN_MANAGEMENT] Plans array length:", plansArray.length);
        console.log("🔍 [PLAN_MANAGEMENT] First plan object keys:", plansArray.length > 0 ? Object.keys(plansArray[0]) : 'No plans');
        console.log("🔍 [PLAN_MANAGEMENT] First plan object:", plansArray.length > 0 ? plansArray[0] : 'No plans');
        
        // Transform API data to frontend format
        const transformedPlans: Plan[] = plansArray.map((apiPlan: ApiPlan, index: number) => {
          console.log("🔄 [PLAN_MANAGEMENT] Transforming plan:", apiPlan);
          console.log("🔍 [PLAN_MANAGEMENT] Plan _id:", apiPlan._id);
          console.log("🔍 [PLAN_MANAGEMENT] Plan id:", apiPlan.id);
          console.log("🔍 [PLAN_MANAGEMENT] Plan isActive:", apiPlan.isActive);
          console.log("🔍 [PLAN_MANAGEMENT] Plan isAvailable:", apiPlan.isAvailable);
          
          // Check if we have a valid MongoDB ObjectId
          const validPlanId = apiPlan.id || apiPlan._id;
          const isValidObjectId = validPlanId && /^[0-9a-fA-F]{24}$/.test(validPlanId);
          
          if (!isValidObjectId) {
            console.warn("⚠️ [PLAN_MANAGEMENT] Plan does not have a valid MongoDB ObjectId:", {
              planName: apiPlan.name,
              planId: validPlanId,
              expectedFormat: "24-character hex string"
            });
          }
          
          const transformedPlan = {
            id: index + 1, // Frontend ID for UI
            name: apiPlan.name,
            price: apiPlan.pricePerWeek,
            currency: '₹',
            period: 'week',
            features: apiPlan.features.map((feature: string, featureIndex: number) => ({
              id: featureIndex + 1,
              name: feature,
              details: feature
            })),
            planid: validPlanId || `temp_${Date.now()}_${index}`, // Backend ID for API calls with fallback
            isActive: apiPlan.isActive && apiPlan.isAvailable
          };
          console.log("✅ [PLAN_MANAGEMENT] Transformed plan:", transformedPlan);
          console.log("🔍 [PLAN_MANAGEMENT] Transformed plan.planid:", transformedPlan.planid);
          console.log("🔍 [PLAN_MANAGEMENT] Plan ID is valid MongoDB ObjectId:", isValidObjectId);
          return transformedPlan;
        });
        
        setPlans(transformedPlans);
      } else {
        console.log("❌ [PLAN_MANAGEMENT] Failed to fetch plans:", response.message);
        setPlans([]);
      }
    } catch (error: any) {
      console.error("❌ [PLAN_MANAGEMENT] Error fetching plans:", error);
      setPlans([]);
      Alert.alert("Error", "Failed to fetch plans. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Load plans on component mount
  useEffect(() => {
    if (user && token) {
      fetchPlans();
    }
  }, [user, token]);

  const handleCreatePlan = () => {
    setSelectedPlan(null);
    setIsEditMode(false);
    setModalVisible(true);
  };

  // Test function to create a sample plan for testing toggle functionality
  const createTestPlan = async () => {
    if (!user || !token) {
      Alert.alert("Error", "Please login to create plans");
      return;
    }

    console.log("🧪 [PLAN_MANAGEMENT] Creating test plan...");
    setIsCreating(true);

    try {
      const testPlanData = {
        name: "Test Plan",
        pricePerWeek: 500,
        features: ["3 meals per day", "Vegetarian", "Home delivery"],
        maxSubscribers: 10,
        isRecommended: false,
        isPopular: false
      };

      const response = await apiConnector.createPlan(testPlanData, token);
      console.log("📥 [PLAN_MANAGEMENT] Test plan creation response:", response);
      console.log("🔍 [PLAN_MANAGEMENT] Response data structure:", JSON.stringify(response.data, null, 2));

        if (response.success && response.data) {
          console.log("✅ [PLAN_MANAGEMENT] Test plan created successfully");
          console.log("📥 [PLAN_MANAGEMENT] Created plan data:", response.data);
          Alert.alert("Success", "Test plan created! You can now test the toggle functionality.");
          await fetchPlans();
        } else {
          Alert.alert("Error", response.message || "Failed to create test plan");
        }
    } catch (error: any) {
      console.error("❌ [PLAN_MANAGEMENT] Error creating test plan:", error);
      Alert.alert("Error", "Failed to create test plan. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  const handleEditPlan = (plan: Plan) => {
    setSelectedPlan(plan);
    setIsEditMode(true);
    setModalVisible(true);
  };

  const handleSavePlan = async (planData: Plan) => {
    if (!user || !token) {
      Alert.alert("Error", "Please login to manage plans");
      return;
    }

    if (isEditMode) {
      await handleUpdatePlan(planData);
    } else {
      await handleCreateNewPlan(planData);
    }
  };

  const handleCreateNewPlan = async (planData: Plan) => {
    console.log("🚀 [PLAN_MANAGEMENT] Creating new plan:", planData);
    setIsCreating(true);

    try {
      const apiData = {
        name: planData.name,
        pricePerWeek: planData.price,
        features: planData.features.map(f => f.name),
        maxSubscribers: 0,
        isRecommended: false,
        isPopular: false
      };

      const response = await apiConnector.createPlan(apiData, token);
      console.log("📥 [PLAN_MANAGEMENT] Create plan response:", response);

      if (response.success && response.data) {
        console.log("✅ [PLAN_MANAGEMENT] Plan created successfully");
        
        // Refresh plans list
        await fetchPlans();
        setModalVisible(false);
        Alert.alert("Success", "Plan created successfully!");
    } else {
        Alert.alert("Error", response.message || "Failed to create plan");
      }
    } catch (error: any) {
      console.error("❌ [PLAN_MANAGEMENT] Error creating plan:", error);
      Alert.alert("Error", "Failed to create plan. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdatePlan = async (planData: Plan) => {
    if (!selectedPlan?.planid) {
      Alert.alert("Error", "Invalid plan selected for update");
      return;
    }

    console.log("✏️ [PLAN_MANAGEMENT] Updating plan:", planData);
    setIsUpdating(true);

    try {
      const apiData = {
        name: planData.name,
        pricePerWeek: planData.price,
        features: planData.features.map(f => f.name),
        maxSubscribers: 0,
        isRecommended: false,
        isPopular: false
      };

      const response = await apiConnector.updatePlan(selectedPlan.planid, apiData, token);
      console.log("📥 [PLAN_MANAGEMENT] Update plan response:", response);

      if (response.success && response.data) {
        console.log("✅ [PLAN_MANAGEMENT] Plan updated successfully");
        
        // Refresh plans list
        await fetchPlans();
        setModalVisible(false);
        Alert.alert("Success", "Plan updated successfully!");
      } else {
        Alert.alert("Error", response.message || "Failed to update plan");
      }
    } catch (error: any) {
      console.error("❌ [PLAN_MANAGEMENT] Error updating plan:", error);
      Alert.alert("Error", "Failed to update plan. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeletePlan = async (planId: number) => {
    const planToDelete = plans.find(p => p.id === planId);
    if (!planToDelete?.planid) {
      Alert.alert("Error", "Invalid plan selected for deletion");
      return;
    }

    Alert.alert(
      "Delete Plan",
      `Are you sure you want to delete "${planToDelete.name}"?`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: async () => {
            console.log("🗑️ [PLAN_MANAGEMENT] Deleting plan:", planToDelete.name);
            setIsDeleting(true);

            try {
              const response = await apiConnector.deletePlan(planToDelete.planid, token);
              console.log("📥 [PLAN_MANAGEMENT] Delete plan response:", response);

              if (response.success) {
                console.log("✅ [PLAN_MANAGEMENT] Plan deleted successfully");
                
                // Refresh plans list
                await fetchPlans();
                Alert.alert("Success", "Plan deleted successfully!");
              } else {
                Alert.alert("Error", response.message || "Failed to delete plan");
              }
            } catch (error: any) {
              console.error("❌ [PLAN_MANAGEMENT] Error deleting plan:", error);
              Alert.alert("Error", "Failed to delete plan. Please try again.");
            } finally {
              setIsDeleting(false);
            }
          }
        }
      ]
    );
  };

  const handleTogglePlan = async (planId: number) => {
    console.log("🔄 [PLAN_MANAGEMENT] handleTogglePlan called with planId:", planId);
    console.log("🔍 [PLAN_MANAGEMENT] Available plans:", plans.map(p => ({ id: p.id, planid: p.planid, name: p.name })));
    
    const planToToggle = plans.find(p => p.id === planId);
    console.log("🔍 [PLAN_MANAGEMENT] Found plan:", planToToggle);
    
    if (!planToToggle) {
      Alert.alert("Error", "Plan not found");
      return;
    }
    
    if (!planToToggle.planid) {
      Alert.alert("Error", "Plan ID is missing");
      return;
    }

    console.log("🔄 [PLAN_MANAGEMENT] Toggling plan availability:", planToToggle.name);
    console.log("🔍 [PLAN_MANAGEMENT] Current plan status:", planToToggle.isActive);
    console.log("🔑 [PLAN_MANAGEMENT] Plan ID for API:", planToToggle.planid);
    
    setIsToggling(true);

    try {
      const response = await apiConnector.togglePlanAvailability(planToToggle.planid, token);
      console.log("📥 [PLAN_MANAGEMENT] Toggle plan response:", response);

      if (response.success && response.data) {
        console.log("✅ [PLAN_MANAGEMENT] Plan availability toggled successfully");
        
        // Show success message
        const newStatus = !planToToggle.isActive;
        Alert.alert(
          "Success", 
          `Plan "${planToToggle.name}" is now ${newStatus ? 'active' : 'inactive'}`,
          [{ text: "OK", onPress: () => fetchPlans() }]
        );
      } else {
        console.error("❌ [PLAN_MANAGEMENT] Toggle failed:", response.message);
        Alert.alert("Error", response.message || "Failed to toggle plan availability");
      }
    } catch (error: any) {
      console.error("❌ [PLAN_MANAGEMENT] Error toggling plan:", error);
      Alert.alert("Error", "Failed to toggle plan availability. Please try again.");
    } finally {
      setIsToggling(false);
    }
  };

  const renderPlanCard = (plan: Plan) => {
    // Check if plan ID is a valid MongoDB ObjectId
    const isValidObjectId = plan.planid && /^[0-9a-fA-F]{24}$/.test(plan.planid);
    
    return (
      <View key={plan.id} style={planStyles.planCard}>
        <View style={planStyles.planHeader}>
          <Text style={planStyles.planName}>{plan.name}</Text>
          
          {/* Only switch in header */}
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Switch
            value={plan.isActive || false}
            onValueChange={() => {
              console.log("🔄 [PLAN_MANAGEMENT] Switch toggled for plan:", plan.name);
              console.log("🔍 [PLAN_MANAGEMENT] Current status:", plan.isActive);
              console.log("🔍 [PLAN_MANAGEMENT] Plan object:", plan);
              console.log("🔍 [PLAN_MANAGEMENT] Plan.id:", plan.id);
              console.log("🔍 [PLAN_MANAGEMENT] Plan.planid:", plan.planid);
              handleTogglePlan(plan.id);
            }}
            thumbColor={plan.isActive ? '#FF4500' : '#f4f3f4'}
            trackColor={{ false: '#767577', true: '#FFB366' }}
              disabled={isToggling}
          />
            {isToggling && (
              <ActivityIndicator size="small" color="#FF4500" style={{ marginLeft: 8 }} />
            )}
          </View>
        </View>
        
        {/* Warning for invalid plan ID */}
        {!isValidObjectId && (
          <View style={{ 
            backgroundColor: '#FFF3CD', 
            borderColor: '#FFEAA7', 
            borderWidth: 1, 
            borderRadius: 8, 
            padding: 8, 
            marginTop: 8,
            marginBottom: 8
          }}>
            <Text style={{ color: '#856404', fontSize: 12, textAlign: 'center' }}>
              ⚠️ This plan may not have a valid ID. Some features may not work properly.
            </Text>
          </View>
        )}

      <View style={planStyles.priceContainer}>
        <Text style={planStyles.price}>
          {plan.currency}
          {plan.price}
        </Text>
        <Text style={planStyles.period}>/{plan.period}</Text>
      </View>

      <View style={planStyles.featuresContainer}>
        {plan.features.map((feature: Feature) => (
          <View key={feature.id} style={planStyles.featureItem}>
            <Icon
              source="check"
              size={16}
              color='#1FC16B'
            />
            <Text style={planStyles.featureText}>{feature.name}</Text>
          </View>
        ))}
      </View>

      {/* Set Menu button with Edit icon */}
      <View style={planStyles.buttonContainer}>
        <TouchableOpacity 
          style={[
            planStyles.setMenuButton,
            !plan.isActive && planStyles.setMenuButtonDisabled
          ]}
          disabled={!plan.isActive}
          onPress={() => {
            // Check if plan ID is a valid MongoDB ObjectId
            const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(plan.planid);
            if (!isValidObjectId) {
              Alert.alert(
                "Invalid Plan ID", 
                `The plan ID "${plan.planid}" is not in the correct format. Please refresh the page and try again.`
              );
              return;
            }
            router.push(`/plans/${plan.planid}/showmenu?userflag=false&userid=${plan.id}` as any);
          }}
        >
          <Text style={[
            planStyles.setMenuButtonText,
            !plan.isActive && planStyles.setMenuButtonTextDisabled
          ]}>
            Set Menu
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={planStyles.editButton}
          onPress={() => handleEditPlan(plan)}
          disabled={isUpdating}
        >
          <Icon
            source="square-edit-outline"
            size={20}
            color="white"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
  };

  // Loading state
  if (isLoading) {
    return (
      <PaperProvider>
        <View style={[planStyles.container, { justifyContent: 'center', alignItems: 'center' }]}>
          <ActivityIndicator size="large" color="#FF4500" />
          <Text style={{ marginTop: 16, color: '#666' }}>Loading plans...</Text>
        </View>
      </PaperProvider>
    );
  }

  return (
    <PaperProvider>
      <View style={planStyles.container}>
        <View style={planStyles.header}>
          <Text style={planStyles.headerTitle}>Set Plan</Text>
          <Button
            mode="contained"
            onPress={handleCreatePlan}
            style={planStyles.createButton}
            labelStyle={{ color: 'white' }}
            disabled={isCreating}
            loading={isCreating}
          >
            {isCreating ? 'Creating...' : 'Create Plan'}
          </Button>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {plans.length > 0 ? (
            plans.map(renderPlanCard)
          ) : (
            <View style={{ padding: 20, alignItems: 'center' }}>
              <Text style={{ color: '#666', fontSize: 16 }}>No plans created yet</Text>
              <Text style={{ color: '#999', fontSize: 14, marginTop: 8 }}>
                Create your first plan to get started
              </Text>
              <Button
                mode="outlined"
                onPress={handleCreatePlan}
                style={{ marginTop: 16 }}
                labelStyle={{ color: '#FF4500' }}
              >
                Create Your First Plan
              </Button>
              <Button
                mode="outlined"
                onPress={createTestPlan}
                style={{ marginTop: 8 }}
                labelStyle={{ color: '#666' }}
                disabled={isCreating}
              >
                {isCreating ? 'Creating...' : 'Create Test Plan'}
              </Button>
              <Button
                mode="outlined"
                onPress={() => {
                  console.log("🔍 [DEBUG] Current plans state:", plans);
                  plans.forEach((plan, index) => {
                    console.log(`🔍 [DEBUG] Plan ${index}:`, {
                      id: plan.id,
                      planid: plan.planid,
                      name: plan.name,
                      isActive: plan.isActive
                    });
                  });
                  Alert.alert("Debug Info", `Plans count: ${plans.length}\nCheck console for details`);
                }}
                style={{ marginTop: 8 }}
                labelStyle={{ color: '#999' }}
              >
                Debug Plans
              </Button>
            </View>
          )}
        </ScrollView>

        <PlanModal
          visible={modalVisible}
          onDismiss={() => setModalVisible(false)}
          onSave={handleSavePlan}
          onDelete={handleDeletePlan}
          plan={selectedPlan}
          isEdit={isEditMode}
        />
      </View>
    </PaperProvider>
  );
};

export default PlanManagement;