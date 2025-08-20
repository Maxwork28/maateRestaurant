import React, { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import {
  Button,
  IconButton,
  Modal,
  Portal,
  Text,
  TextInput,
} from "react-native-paper";
import { modalStyles } from "../css/restaurant/planstyle";
import { Feature, Plan } from "./restaurantplan";

type PlanModalProps = {
  visible: boolean;
  onDismiss: () => void;
  onSave: (plan: Plan) => void;
  onDelete: (id: number) => void;
  plan?: Plan | null;
  isEdit?: boolean;
};

const PlanModal: React.FC<PlanModalProps> = ({
  visible,
  onDismiss,
  onSave,
  onDelete,
  plan = null,
  isEdit = false,
}) => {
  const [planName, setPlanName] = useState<string>("");
  const [planPrice, setPlanPrice] = useState<string>("");
  const [features, setFeatures] = useState<Feature[]>([]);

  useEffect(() => {
    if (isEdit && plan) {
      setPlanName(plan.name);
      setPlanPrice(plan.price.toString());
      setFeatures(plan.features || []);
    } else {
      setPlanName("");
      setPlanPrice("");
      setFeatures([]);
    }
  }, [visible, plan, isEdit]);

  const addFeature = () => {
    const newFeature: Feature = {
      id: Date.now(),
      name: "",
      details: "",
    };
    setFeatures((prev) => [...prev, newFeature]);
  };

  const updateFeature = (id: number, field: keyof Feature, value: string) => {
    setFeatures((prev) =>
      prev.map((feature) =>
        feature.id === id ? { ...feature, [field]: value } : feature
      )
    );
  };

  const deleteFeature = (id: number) => {
    setFeatures((prev) => prev.filter((feature) => feature.id !== id));
  };

  const handleSave = () => {
    const planData: Plan = {
      id: plan?.id || Date.now(),
      name: planName,
      price: parseFloat(planPrice) || 0,
      features: features.filter((f) => f.name.trim() !== ""),
      currency: "",
      period: "week",
      isActive: true,
      planid: undefined
    };
    onSave(planData);
    onDismiss();
  };

  const handleDelete = () => {
    if (plan?.id) {
      onDelete(plan.id);
    }
    onDismiss();
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={modalStyles.modalContainer}
      >
        <IconButton
          mode="outlined"
          icon="close"
          iconColor="#FF4500"
          size={24}
          onPress={onDismiss}
          style={modalStyles.closeIcon}
        />

        <View style={modalStyles.inputContainer}>
          <Text style={modalStyles.inputLabel}>PLAN NAME</Text>
          <TextInput
            value={planName}
            onChangeText={setPlanName}
            placeholder="Enter plan name"
            style={modalStyles.textInput}
            mode="outlined"
            textColor="#333"
          />
        </View>

        <View style={modalStyles.inputContainer}>
          <Text style={modalStyles.inputLabel}>PLAN PRICE PER WEEK</Text>
          <TextInput
            value={planPrice}
            onChangeText={setPlanPrice}
            placeholder="₹440.00"
            keyboardType="numeric"
            style={modalStyles.textInput}
            mode="outlined"
            textColor="#333"
          />
        </View>

        <View style={modalStyles.featuresSection}>
          <View style={modalStyles.featuresHeader}>
            <Text style={modalStyles.featuresTitle}>Features</Text>
            <Button
              mode="contained"
              onPress={addFeature}
              style={modalStyles.addFeatureButton}
              labelStyle={{ color: "white", fontSize: 14 }}
            >
              Add
            </Button>
          </View>

          <ScrollView
            style={modalStyles.scrollView}
            showsVerticalScrollIndicator={false}
          >
            {features.map((feature, index) => (
              <View key={feature.id} style={modalStyles.featureRow}>
                <View style={{ flex: 1 }}>
                  <Text style={modalStyles.inputLabel}>
                    FEATURE {index + 1}
                  </Text>
                  <TextInput
                    value={feature.name}
                    onChangeText={(text) =>
                      updateFeature(feature.id, "name", text)
                    }
                    placeholder="Feature details"
                    style={modalStyles.featureInput}
                    mode="outlined"
                    textColor="#333"
                  />
                </View>
                <IconButton
                  mode="outlined"
                  icon="delete-outline"
                  iconColor="#FF4500"
                  size={24}
                  onPress={() => deleteFeature(feature.id)}
                  style={modalStyles.deleteFeatureButton}
                />
              </View>
            ))}
          </ScrollView>
        </View>

        <View style={modalStyles.modalActions}>
          {isEdit && (
            <Button
              mode="contained"
              onPress={handleDelete}
              style={modalStyles.deleteButton}
              labelStyle={{ color: "white" }}
            >
              Delete Plan
            </Button>
          )}

          <Button
            mode="contained"
            onPress={handleSave}
            style={[modalStyles.saveButton, !isEdit && { flex: 1 }]}
            labelStyle={{ color: "white" }}
          >
            Save Details
          </Button>
        </View>
      </Modal>
    </Portal>
  );
};

export default PlanModal;
