import { MEAL_DATA } from "@/constant/restaurant/mealdata";
import { subscriptionData } from "../../../../constant/restaurant/subscriptions";
import { Ionicons } from "@expo/vector-icons";
import dayjs from "dayjs";
import { useRouter } from "expo-router";
import React, { useCallback, useMemo, useState, useEffect } from "react";
import { ScrollView, TouchableOpacity, View, Alert } from "react-native";
import { Icon, Text, ActivityIndicator } from "react-native-paper";
import { showMenuStyles } from "../css/restaurant/restaurantmenuitem";
import EditMealModal from "./edit-meal-modal";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/index";
import { apiConnector } from "../../../services/apiConnector";

interface MealItem {
  name: string;
  calories: number;
}

interface MealDay {
  day: string;
  date: string;
  isActive: boolean;
  planid: any;
  items: {
    Breakfast: MealItem | MealItem[];
    Lunch: MealItem | MealItem[];
    Dinner: MealItem | MealItem[];
  };
}

// Database meal structure to match backend
interface DatabaseMeal {
  name: string;
  calories: number;
}

interface DatabaseWeeklyMeals {
  sunday: {
    breakfast: DatabaseMeal;
    lunch: DatabaseMeal;
    dinner: DatabaseMeal;
  };
  monday: {
    breakfast: DatabaseMeal;
    lunch: DatabaseMeal;
    dinner: DatabaseMeal;
  };
  tuesday: {
    breakfast: DatabaseMeal;
    lunch: DatabaseMeal;
    dinner: DatabaseMeal;
  };
  wednesday: {
    breakfast: DatabaseMeal;
    lunch: DatabaseMeal;
    dinner: DatabaseMeal;
  };
  thursday: {
    breakfast: DatabaseMeal;
    lunch: DatabaseMeal;
    dinner: DatabaseMeal;
  };
  friday: {
    breakfast: DatabaseMeal;
    lunch: DatabaseMeal;
    dinner: DatabaseMeal;
  };
  saturday: {
    breakfast: DatabaseMeal;
    lunch: DatabaseMeal;
    dinner: DatabaseMeal;
  };
}

interface DatabasePlan {
  _id?: string;
  id?: string;
  name: string;
  pricePerWeek: number;
  features: string[];
  weeklyMeals: DatabaseWeeklyMeals;
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
}

type ShowMenuProps = {
  id: any;
  userid: any;
  flag: boolean;
};

const ShowMenu = ({ id, userid, flag }: ShowMenuProps) => {
  const [selectedTab, setSelectedTab] = useState(id || 'basic@');
  const [activeDate, setActiveDate] = useState(""); // Will be set dynamically
  const [selectedSlotIndex, setSelectedSlotIndex] = useState(0); // Track selected slot
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [databasePlan, setDatabasePlan] = useState<DatabasePlan | null>(null);
  const [isLoadingPlan, setIsLoadingPlan] = useState(false);
  const [isUpdatingMeal, setIsUpdatingMeal] = useState(false);
  const router = useRouter();
  const [selectedEditItem, setSelectedEditItem] = useState<{
    day: string;
    mealType: string;
    item: MealItem[];
  } | null>(null);

  // Redux state
  const { user, token } = useSelector((state: RootState) => state.auth);

  // Add debugging for props and initial state
  console.log("🔍 [SHOW_MENU] Component props:", { id, userid, flag });
  console.log("🔍 [SHOW_MENU] Initial selectedTab:", selectedTab);
  console.log("🔍 [SHOW_MENU] ID prop type:", typeof id, "value:", id);
  console.log("🔍 [SHOW_MENU] SelectedTab state type:", typeof selectedTab, "value:", selectedTab);

  // Helper function to validate MongoDB ObjectId
  const isValidObjectId = (id: string): boolean => {
    return /^[0-9a-fA-F]{24}$/.test(id);
  };

  // Fetch plan data from database
  const fetchPlanFromDatabase = useCallback(async () => {
    console.log("🔄 [SHOW_MENU] fetchPlanFromDatabase called with selectedTab:", selectedTab);
    
    if (!selectedTab || !token) {
      console.log("❌ [SHOW_MENU] Cannot fetch plan - missing selectedTab or token");
      return;
    }

    // Check if the plan ID is a valid MongoDB ObjectId
    if (!isValidObjectId(selectedTab)) {
      console.log("❌ [SHOW_MENU] Invalid plan ID format:", selectedTab);
      console.log("🔍 [SHOW_MENU] Plan ID should be a 24-character hex string");
      setDatabasePlan(null);
      return;
    }

    console.log("🔄 [SHOW_MENU] Fetching plan from database:", selectedTab);
    setIsLoadingPlan(true);

    try {
      const response = await apiConnector.getPlanById(selectedTab, token);
      console.log("📥 [SHOW_MENU] Database plan response:", response);

      if (response.success && response.data) {
        console.log("✅ [SHOW_MENU] Plan fetched successfully from database");
        console.log("🔍 [SHOW_MENU] Plan data structure:", response.data);
        console.log("🔍 [SHOW_MENU] Plan _id:", response.data._id);
        console.log("🔍 [SHOW_MENU] Plan id:", response.data.id);
        console.log("🔍 [SHOW_MENU] Plan data keys:", Object.keys(response.data));
        
        // Validate that we have a plan ID
        const planId = response.data._id || response.data.id;
        if (!planId) {
          console.error("❌ [SHOW_MENU] Plan data missing ID field:", response.data);
          setDatabasePlan(null);
          return;
        }
        
        console.log("✅ [SHOW_MENU] Plan ID validated:", planId);
        setDatabasePlan(response.data);
      } else {
        console.log("❌ [SHOW_MENU] Failed to fetch plan from database:", response.message);
        setDatabasePlan(null);
      }
    } catch (error: any) {
      console.error("❌ [SHOW_MENU] Error fetching plan from database:", error);
      setDatabasePlan(null);
      Alert.alert("Error", "Failed to fetch plan data. Please try again.");
    } finally {
      setIsLoadingPlan(false);
    }
  }, [selectedTab, token]);

  // Monitor id prop changes
  useEffect(() => {
    console.log("🔄 [SHOW_MENU] ID prop changed:", id);
    if (id && id !== selectedTab) {
      console.log("🔄 [SHOW_MENU] Updating selectedTab from", selectedTab, "to", id);
      setSelectedTab(id);
    }
  }, [id, selectedTab]);

  // Monitor databasePlan state changes
  useEffect(() => {
    console.log("🔄 [SHOW_MENU] databasePlan state changed:", databasePlan);
    if (databasePlan) {
      console.log("🔍 [SHOW_MENU] databasePlan._id:", databasePlan._id);
      console.log("🔍 [SHOW_MENU] databasePlan.id:", databasePlan.id);
    }
  }, [databasePlan]);

  // Load plan data when selectedTab changes
  useEffect(() => {
    console.log("🔄 [SHOW_MENU] useEffect triggered - selectedTab:", selectedTab, "token:", !!token);
    if (selectedTab && token) {
      fetchPlanFromDatabase();
    }
  }, [selectedTab, token, fetchPlanFromDatabase]);

  const userPlan = useMemo(() => {
    const plan = subscriptionData.find((user) => user.id == userid || user.id === parseInt(userid));
    console.log("🔍 [SHOW_MENU] Found userPlan:", plan);
    return plan;
  }, [userid]);

  // Generate slot tabs from user's subscription data
  const slotTabs = useMemo(() => {
    if (!userPlan?.slots) {
      return [];
    }
    
    const tabs = userPlan.slots.map((slot, index) => ({
      id: index,
      label: `${dayjs(slot.startDate).format("D MMM YYYY")} - ${dayjs(slot.endDate).format("D MMM YYYY")}`,
      startDate: slot.startDate,
      endDate: slot.endDate,
      mealDates: slot.mealDates || []
    }));
    
    return tabs;
  }, [userPlan]);

  // Generate all dates between selected slot's start and end date
  const slotDates = useMemo(() => {
    
    if (!slotTabs[selectedSlotIndex]) {
      return [];
    }
    
    const { startDate, endDate, mealDates } = slotTabs[selectedSlotIndex];
    
    const dates = [];
    let currentDate = dayjs(startDate);
    const end = dayjs(endDate);
    
    while (currentDate.isBefore(end) || currentDate.isSame(end)) {
      const dateStr = currentDate.format("YYYY-MM-DD");
      dates.push({
        date: currentDate.format("D"), // Day number
        fullDate: dateStr,
        dayName: currentDate.format("ddd").charAt(0), // M, T, W, etc.
        hasMeal: mealDates.includes(dateStr)
      });
      currentDate = currentDate.add(1, 'day');
    }
    
    return dates;
  }, [selectedSlotIndex, slotTabs]);

  // Set initial active date when slotDates change
  React.useEffect(() => {
    if (slotDates.length > 0 && !activeDate) {
      setActiveDate(slotDates[0].date);
    }
  }, [slotDates, activeDate]);

  // Generate default meal structure with N/A values
  const generateDefaultMealStructure = useCallback(() => {
    console.log("🔄 [SHOW_MENU] generateDefaultMealStructure called with selectedTab:", selectedTab);
    
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days.map((day, index) => ({
      day: day,
      date: String(index + 1),
      isActive: true,
      planid: selectedTab,
      items: {
        Breakfast: [{
          name: 'N/A',
          calories: 0
        }],
        Lunch: [{
          name: 'N/A',
          calories: 0
        }],
        Dinner: [{
          name: 'N/A',
          calories: 0
        }]
      }
    }));
  }, [selectedTab]);

  // Get meal items for display - use database data or default N/A structure
  const getMealItems = useCallback(() => {
    console.log("🔄 [SHOW_MENU] getMealItems called with selectedTab:", selectedTab);
    
    if (databasePlan?.weeklyMeals) {
      console.log("🔍 [SHOW_MENU] Using database meal data");
      // Convert database weekly meals to frontend format
      const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
      const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      
      return days.map((day, index) => {
        const dayMeals = databasePlan.weeklyMeals[day as keyof DatabaseWeeklyMeals];
        return {
          day: dayNames[index],
          date: String(index + 1),
          isActive: true,
          planid: selectedTab,
          items: {
            Breakfast: dayMeals?.breakfast && Array.isArray(dayMeals.breakfast) && dayMeals.breakfast.length > 0 ? 
              dayMeals.breakfast.map(meal => ({
                name: meal.name || 'N/A',
                calories: meal.calories || 0
              })) : [{
                name: 'N/A',
                calories: 0
              }],
            Lunch: dayMeals?.lunch && Array.isArray(dayMeals.lunch) && dayMeals.lunch.length > 0 ? 
              dayMeals.lunch.map(meal => ({
                name: meal.name || 'N/A',
                calories: meal.calories || 0
              })) : [{
                name: 'N/A',
                calories: 0
              }],
            Dinner: dayMeals?.dinner && Array.isArray(dayMeals.dinner) && dayMeals.dinner.length > 0 ? 
              dayMeals.dinner.map(meal => ({
                name: meal.name || 'N/A',
                calories: meal.calories || 0
              })) : [{
                name: 'N/A',
                calories: 0
              }]
          }
        };
      });
    } else {
      console.log("🔍 [SHOW_MENU] No database plan, using default N/A structure");
      return generateDefaultMealStructure();
    }
  }, [databasePlan, selectedTab, generateDefaultMealStructure]);

  // Update meal in database
  const updateMealInDatabase = useCallback(async (day: string, mealType: string, mealData: MealItem[]) => {
    if (!databasePlan || !token) {
      console.log("❌ [SHOW_MENU] Cannot update meal - missing database plan or token");
      return;
    }

    // Get the plan ID from either _id or id field
    const planId = databasePlan._id || databasePlan.id;
    if (!planId) {
      console.error("❌ [SHOW_MENU] Cannot update meal - plan ID is missing from database plan");
      console.log("🔍 [SHOW_MENU] Database plan:", databasePlan);
      Alert.alert("Error", "Plan ID is missing. Please refresh the page and try again.");
      return;
    }

    console.log("🔄 [SHOW_MENU] Updating meal in database:", { day, mealType, mealData, planId });
    setIsUpdatingMeal(true);

    try {
      // Convert frontend meal data to database format
      const dbMealData = {
        day: day.toLowerCase(),
        mealType: mealType.toLowerCase(),
        meals: mealData.map(meal => ({
          name: meal.name,
          calories: meal.calories
        }))
      };

      const response = await apiConnector.updateMeal(planId, dbMealData, token);
      console.log("�� [SHOW_MENU] Update meal response:", response);

      if (response.success) {
        console.log("✅ [SHOW_MENU] Meal updated successfully in database");
        // Refresh plan data
        await fetchPlanFromDatabase();
        Alert.alert("Success", "Meal updated successfully!");
      } else {
        Alert.alert("Error", response.message || "Failed to update meal");
      }
    } catch (error: any) {
      console.error("❌ [SHOW_MENU] Error updating meal in database:", error);
      Alert.alert("Error", "Failed to update meal. Please try again.");
    } finally {
      setIsUpdatingMeal(false);
    }
  }, [databasePlan, token, fetchPlanFromDatabase]);

  // Optimized update function with better state management
  const updateMealItems = useCallback(
    (day: string, mealType: string, updatedItems: MealItem[]) => {
      console.log("🔄 [SHOW_MENU] updateMealItems called with:", { day, mealType, updatedItems });
      console.log("🔍 [SHOW_MENU] Current databasePlan:", databasePlan);
      
      // If we have a database plan, update it there
      if (databasePlan) {
        updateMealInDatabase(day, mealType, updatedItems);
        return;
      }

      // If no database plan, show message that plan needs to be created first
      Alert.alert("Info", "Please create a plan first before adding meals.");
    },
    [databasePlan, updateMealInDatabase]
  );

  // Optimized edit handler
  const handleEditMeal = useCallback((meal: MealDay, mealType: string) => {
    console.log("🔄 [SHOW_MENU] handleEditMeal called with:", { meal, mealType });
    console.log("🔍 [SHOW_MENU] Current databasePlan:", databasePlan);
    
    if (!databasePlan) {
      Alert.alert("Info", "Please create a plan first before editing meals.");
      return;
    }

    const selectedItem = meal.items[mealType as keyof typeof meal.items];
    setSelectedEditItem({
      day: meal.day,
      mealType,
      item: Array.isArray(selectedItem)
        ? selectedItem
        : selectedItem
        ? [selectedItem]
        : [],
    });
    setEditModalVisible(true);
  }, [databasePlan]);

  // Handle slot tab change
  const handleSlotChange = useCallback((slotIndex: number) => {
    setSelectedSlotIndex(slotIndex);
    if (slotTabs[slotIndex]) {
      const firstDate = dayjs(slotTabs[slotIndex].startDate);
      const newActiveDate = firstDate.format("D");
      setActiveDate(newActiveDate);
    }
  }, [slotTabs]);

  // Optimized date change handler
  const handleDateChange = useCallback((date: string) => {
    setActiveDate(date);
  }, []);

  // Optimized modal handlers
  const handleModalClose = useCallback(() => {
    setEditModalVisible(false);
    setSelectedEditItem(null);
  }, []);

  const handleModalSave = useCallback(
    (updatedItems: MealItem[], day: string, mealType: string) => {
      updateMealItems(day, mealType, updatedItems);
      handleModalClose();
    },
    [updateMealItems, handleModalClose]
  );

  // eslint-disable-next-line react/display-name
  const MealCell = React.memo(
    ({ meal, mealType }: { meal: MealDay; mealType: string }) => {
      const mealData = meal.items[mealType as keyof typeof meal.items];
      
      console.log("🔍 [SHOW_MENU] MealCell rendering:", { 
        day: meal.day, 
        mealType, 
        planid: meal.planid,
        hasDatabasePlan: !!databasePlan 
      });

      return (
        <View style={showMenuStyles.mealCell}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View style={{ flex: 1 }}>
              {Array.isArray(mealData)
                ? mealData.map((item: MealItem, index: number) => (
                    <View
                      key={`${meal.day}-${mealType}-${index}`}
                      style={{ marginBottom: 4 }}
                    >
                      <Text style={showMenuStyles.mealName}>
                        {item.name || 'N/A'}
                      </Text>
                      <Text style={showMenuStyles.mealCal}>
                        Cal {item.calories || 'N/A'}
                      </Text>
                    </View>
                  ))
                : mealData && mealData.name && mealData.name !== 'N/A' ? (
                    <>
                      <Text style={showMenuStyles.mealName}>
                        {mealData.name}
                      </Text>
                      <Text style={showMenuStyles.mealCal}>
                        Cal {mealData.calories || 'N/A'}
                      </Text>
                    </>
                  ) : (
                    <Text style={showMenuStyles.mealName}>N/A</Text>
                  )}
            </View>
            {!flag && databasePlan && (
              <TouchableOpacity onPress={() => handleEditMeal(meal, mealType)}>
                <Icon source="square-edit-outline" size={20} color="black" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      );
    }
  );

  if (isLoadingPlan) {
    return (
      <View style={showMenuStyles.container}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#FF4500" />
          <Text style={{ marginTop: 16, color: '#666' }}>Loading plan data...</Text>
        </View>
      </View>
    );
  }

  // Check if plan ID is invalid
  if (selectedTab && !isValidObjectId(selectedTab)) {
    return (
      <View style={showMenuStyles.container}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <Icon source="alert-circle" size={64} color="#FF4500" />
          <Text style={{ marginTop: 16, color: '#FF4500', fontSize: 18, fontWeight: 'bold', textAlign: 'center' }}>
            Invalid Plan ID
          </Text>
          <Text style={{ marginTop: 8, color: '#666', fontSize: 14, textAlign: 'center', lineHeight: 20 }}>
            The plan ID "{selectedTab}" is not in the correct format. Please return to the plans page and try again.
          </Text>
          <TouchableOpacity 
            style={{ 
              marginTop: 20, 
              backgroundColor: '#FF4500', 
              paddingHorizontal: 20, 
              paddingVertical: 12, 
              borderRadius: 8 
            }}
            onPress={() => router.back()}
          >
            <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
              Go Back
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Get meal items for display
  const mealItems = getMealItems();

  return (
    <ScrollView style={showMenuStyles.container}>
      <View style={showMenuStyles.topSection}>
        {/* Header Row */}
        <View style={showMenuStyles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={showMenuStyles.planText}>
              {databasePlan ? databasePlan.name : 'New Plan'}
            </Text>
            <Text style={showMenuStyles.activeStatus}>
              {databasePlan ? 
                (databasePlan.isActive && databasePlan.isAvailable ? "Active" : "Inactive") :
                "Not Created"
              }
            </Text>
          </View>
        </View>
        
        {flag && (
          <View
            style={{
              backgroundColor: "#FFF1EC",
              borderRadius: 30,
              padding: 10,
            }}
          >
            {/* Week Row - Show dates from selected slot */}
            <View style={showMenuStyles.weekRow}>
              {slotDates.length > 0 ? (
                slotDates.map((dateInfo, index) => (
                  <View
                    key={`${dateInfo.fullDate}-${index}`}
                    style={showMenuStyles.weekItem}
                  >
                    <Text style={showMenuStyles.weekDayText}>{dateInfo.dayName}</Text>
                    
                    <TouchableOpacity
                      style={[
                        showMenuStyles.dateCircle,
                        dateInfo.hasMeal && showMenuStyles.dateActive,
                        activeDate === dateInfo.date && showMenuStyles.dateSelected,
                      ]}
                      onPress={() => handleDateChange(dateInfo.date)}
                    >
                      <Text
                        style={[
                          activeDate === dateInfo.date
                            ? showMenuStyles.dateTextSelected
                            : showMenuStyles.dateText,
                        ]}
                      >
                        {dateInfo.date}
                      </Text>
                    </TouchableOpacity>
                    
                    {/* Meal Status Indicator at the bottom */}
                    <View style={{
                      marginTop: 4,
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {dateInfo.hasMeal ? (
                        // Show checkmark for days with meals
                        <View style={{
                          backgroundColor: '#FF6B35',
                          borderRadius: 10,
                          width: 20,
                          height: 20,
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <Ionicons name="checkmark" size={12} color="white" />
                        </View>
                      ) : (
                        // Show empty circle for days without meals
                        <View style={{
                          borderWidth: 2,
                          borderColor: '#E0E0E0',
                          borderRadius: 10,
                          width: 20,
                          height: 20,
                          backgroundColor: 'transparent'
                        }} />
                      )}
                    </View>
                  </View>
                ))
              ) : (
                <Text>No dates available</Text>
              )}
            </View>

            {/* Slot Tabs - Horizontal scrollable with fixed height */}
            <View style={{ marginTop: 10, height: 50 }}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                  paddingHorizontal: 5,
                }}
                style={{ height: 50 }}
              >
                {slotTabs.length > 0 ? (
                  slotTabs.map((tab, index) => (
                    <TouchableOpacity
                      key={tab.id}
                      onPress={() => handleSlotChange(index)}
                      style={[
                        showMenuStyles.weekTab,
                        selectedSlotIndex === index && showMenuStyles.weekTabActive,
                        {
                          height: 40,
                          minWidth: 120,
                          maxWidth: 200,
                          paddingHorizontal: 12,
                          marginRight: 8,
                          justifyContent: 'center',
                          alignItems: 'center',
                          borderRadius: 8,
                        }
                      ]}
                    >
                      <Text
                        style={[
                          selectedSlotIndex === index
                            ? showMenuStyles.weekTabTextActive
                            : showMenuStyles.weekTabText,
                          {
                            fontSize: 11,
                            textAlign: 'center',
                            flexShrink: 1,
                          }
                        ]}
                        numberOfLines={2}
                        ellipsizeMode="tail"
                      >
                        {tab.label}
                      </Text>
                    </TouchableOpacity>
                  ))
                ) : (
                  <Text>No slots available</Text>
                )}
              </ScrollView>
            </View>
          </View>
        )}
      </View>

      <View style={{ maxHeight: flag ? 600 : 750, marginTop: 10 }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={showMenuStyles.matrixContainer}>
            {/* Header Row: Meal Types */}
            <View style={showMenuStyles.matrixRow}>
              <Text style={showMenuStyles.matrixHeaderlabel}>Day</Text>
              {["Breakfast", "Lunch", "Dinner"].map((mealType) => (
                <Text key={mealType} style={showMenuStyles.matrixHeader}>
                  {mealType}
                </Text>
              ))}
            </View>

            {/* Rows: Each Day */}
            {mealItems.map((meal: any) => {
              console.log("🔍 [SHOW_MENU] Rendering meal row:", { day: meal.day, planid: meal.planid });
              return (
                <View
                  key={`${meal.day}-${meal.date}`}
                  style={showMenuStyles.matrixRow}
                >
                  <Text style={showMenuStyles.mealType}>{meal.day}</Text>
                  {["Breakfast", "Lunch", "Dinner"].map((mealType) => (
                    <MealCell
                      key={`${meal.day}-${mealType}`}
                      meal={meal}
                      mealType={mealType}
                    />
                  ))}
                </View>
              );
            })}
          </View>
        </ScrollView>

        <EditMealModal
          visible={editModalVisible}
          itemData={selectedEditItem}
          onClose={handleModalClose}
          onSave={handleModalSave}
        />
      </View>
    </ScrollView>
  );
};

export default ShowMenu;