import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { ActivityIndicator, Button, Icon } from "react-native-paper";
import { showMenuStyles } from "../css/restaurant/restaurantmenuitem";

interface MealItem {
  name: string;
  calories: number;
  description?: string;
}

interface EditMealModalProps {
  visible: boolean;
  itemData: {
    day: string;
    mealType: string;
    item: MealItem[];
  } | null;
  onClose: () => void;
  onSave: (items: MealItem[], day: string, mealType: string) => void;
}

const EditMealModal = ({ visible, itemData, onClose, onSave }: EditMealModalProps) => {
  const [items, setItems] = useState<MealItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Initialize items when modal opens
  useEffect(() => {
    if (visible && itemData?.item) {
      // Deep clone to avoid mutations
      const clonedItems = itemData.item.map(item => ({
        name: item.name || "",
        calories: typeof item.calories === 'number' ? item.calories : 0,
        description: item.description || ""
      }));
      setItems(clonedItems);
    }
  }, [visible, itemData]);

  // Optimized update function with proper validation
  const updateItem = useCallback((index: number, field: keyof MealItem, value: string) => {
    setItems(prevItems => {
      const updated = [...prevItems];
      if (field === "calories") {
        const numValue = value === "" ? 0 : parseInt(value.replace(/[^0-9]/g, ""), 10);
        updated[index] = {
          ...updated[index],
          [field]: isNaN(numValue) ? 0 : numValue
        };
      } else {
        updated[index] = {
          ...updated[index],
          [field]: value
        };
      }
      return updated;
    });
  }, []);

  // Optimized add item function
  const addItem = useCallback(() => {
    setItems(prevItems => [...prevItems, { name: "", calories: 0, description: "" }]);
  }, []);

  // Remove item function
  const removeItem = useCallback((index: number) => {
    setItems(prevItems => prevItems.filter((_, idx) => idx !== index));
  }, []);

  // Optimized save function without artificial delay
  const handleSave = useCallback(async () => {
    console.log("Hii")
    if (!itemData || loading) return;
    setLoading(true);  
    try {
      const validItems = items.filter(item => item.name.trim() !== ""); 
      onSave(validItems, itemData.day, itemData.mealType);
      onClose();
    } catch (error) {
      console.error("Error saving meal:", error);
    } finally {
      setLoading(false);
    }
  }, [items, itemData, loading, onSave, onClose]);

  // Memoize the form validation
  const isFormValid = useMemo(() => {
    return items.some(item => item.name.trim() !== "");
  }, [items]);

  if (!visible || !itemData) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={showMenuStyles.modalOverlay}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={showMenuStyles.modalContainer}>
              <Text style={showMenuStyles.modalTitle}>Edit Meal</Text>

              {items.map((item, idx) => (
                <View
                  key={`item-${idx}`}
                  style={{ flexDirection: "row", gap: 10, marginBottom: 10 }}
                >
                  <TextInput
                    placeholder="Item Name"
                    value={item.name}
                    onChangeText={(text) => updateItem(idx, "name", text)}
                    style={[showMenuStyles.modalInput, { flex: 1 }]}
                    maxLength={50}
                  />
                  <TextInput
                    placeholder="Calories"
                    keyboardType="numeric"
                    value={item.calories === 0 ? "" : item.calories.toString()}
                    onChangeText={(text) => updateItem(idx, "calories", text)}
                    style={[showMenuStyles.modalInput, { flex: 1 }]}
                    maxLength={5}
                  />
                  
                  <View style={{ flexDirection: "row", alignItems: "center", marginTop: 7 }}>
                    {/* Remove button (show if more than 1 item) */}
                    {items.length > 1 && (
                      <TouchableOpacity
                        onPress={() => removeItem(idx)}
                        style={{ marginRight: 5 }}
                      >
                        <Icon
                          source="minus-circle-outline"
                          size={22}
                          color="#FF4444"
                        />
                      </TouchableOpacity>
                    )}
                    
                    {/* Add button (show only on last item) */}
                    {idx === items.length - 1 && (
                      <TouchableOpacity onPress={addItem}>
                        <Icon
                          source="plus-circle-outline"
                          size={22}
                          color="#FF5A1F"
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              ))}

              <View style={{ flexDirection: "row", gap: 10, marginTop: 20 }}>
               
                <Button
                  onPress={handleSave}
                  mode="contained"
                  style={[showMenuStyles.saveButton, { flex: 1 }]}
                  disabled={loading || !isFormValid}
                  labelStyle={{ color: "white" }}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" size="small" />
                  ) : (
                    "Save"
                  )}
                </Button>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default EditMealModal;