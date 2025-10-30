import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  Alert,
} from "react-native";
import { Button, Text, TextInput, TouchableRipple } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import Blankscreen from "./blank-screen";
import { apiConnector, validatePhone } from "../../../utils";

const AuthScreen = () => {
  const [mobileNumber, setMobileNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSkip = () => console.log("Skip pressed");

  const handleLogin = async () => {
    // Validate phone number
    if (!validatePhone(mobileNumber)) {
      Alert.alert("Invalid Phone Number", "Please enter a valid 10-digit phone number");
      return;
    }

    setIsLoading(true);
    try {
      // Send OTP to the phone number
      const response = await apiConnector.sendOTP(mobileNumber);
      
      if (response.success) {
        // Navigate to OTP screen with phone number
        router.push({
          pathname: "/(auth)/otp",
          params: { 
            mobile: mobileNumber
          },
        });
      } else {
        Alert.alert("Error", response.message || "Failed to send OTP");
      }
    } catch (error: any) {
      console.error("Send OTP Error:", error);
      Alert.alert(
        "Error", 
        error.message || "Failed to send OTP. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardAvoidingView}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {/* Header */}
              <View style={styles.header}>
                <TouchableRipple onPress={handleSkip} borderless>
                  <View style={styles.skipButton}>
                    <Text style={styles.skipText}>Skip ›</Text>
                  </View>
                </TouchableRipple>
              </View>

              {/* Logo Container */}
              <View style={styles.logoContainer}>
                <Blankscreen primaryColor="#FA4A0C" backgroundColor="none" />
              </View>

              {/* Form */}
              <View style={styles.formContainer}>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Mobile No.</Text>
                  <TextInput
                    mode="flat"
                    value={mobileNumber}
                    onChangeText={setMobileNumber}
                    placeholder="Enter 10-digit number"
                    keyboardType="phone-pad"
                    underlineColor="#E5E5E5"
                    activeUnderlineColor="#6F32AB"
                    style={styles.textInput}
                    contentStyle={styles.textInputContent}
                    theme={{
                      colors: {
                        text: "#434140",
                        placeholder: "#CCCCCC",
                        background: "transparent",
                      },
                    }}
                    textColor="#434140"
                    maxLength={10}
                  />
                </View>
              </View>

              {/* Spacer to push button to bottom */}
              <View style={styles.spacer} />

              {/* Login Button */}
              <View style={styles.loginButtonContainer}>
                <Button
                  mode="contained"
                  buttonColor="#6F32AB"
                  contentStyle={styles.loginButtonContent}
                  labelStyle={styles.loginLabel}
                  onPress={handleLogin}
                  style={styles.loginButton}
                  loading={isLoading}
                  disabled={isLoading || !mobileNumber}
                >
                  {isLoading ? "Sending OTP..." : "Continue →"}
                </Button>
              </View>
            </ScrollView>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
};

export default AuthScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FDF7F1",
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    backgroundColor: "#FDF7F1",
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: Platform.OS === "ios" ? 20 : 30,
    paddingBottom: 20,
    alignItems: "flex-end",
  },
  skipButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#6F32AB",
    borderRadius: 20,
  },
  skipText: {
    color: "#6F32AB",
    fontSize: 14,
    fontWeight: "bold",
  },
  logoContainer: {
    alignItems: "center",
    paddingVertical: 40,
    marginBottom: 20,
  },
  formContainer: {
    paddingHorizontal: 24,
  },
  inputContainer: {
    marginBottom: 32,
  },
  inputLabel: {
    fontSize: 16,
    color: "#434140",
    marginBottom: 12,
    fontWeight: "bold",
  },
  textInput: {
    backgroundColor: "transparent",
    paddingHorizontal: 0,
  },
  textInputContent: {
    paddingLeft: 0,
  },
  spacer: {
    flex: 1,
    minHeight: 80,
  },
  loginButtonContainer: {
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === "ios" ? 34 : 24,
  },
  loginButton: {
    borderRadius: 30,
    elevation: 0,
    shadowOpacity: 0,
  },
  loginButtonContent: {
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  loginLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
});
