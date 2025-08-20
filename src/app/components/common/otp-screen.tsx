import { useRouter, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  TextInput as RNTextInput,
  StyleSheet,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import { Appbar, Button, IconButton, Text } from "react-native-paper";
import { apiConnector } from "../../../utils";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { 
  setCredentials, 
  setLoading, 
  setError, 
  clearError,
  selectAuth,
  selectIsAuthenticated,
  selectToken,
  selectUser,
  selectIsLoading,
  selectError
} from "../../../store/slices/authSlice";

type Props = {
  mobile: string;
};

const OtpScreen = ({ mobile }: Props) => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [timer, setTimer] = useState(60);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const inputs = useRef<RNTextInput[]>([]);
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  // Get Redux state using selectors
  const authState = useAppSelector((state) => state.auth);
  
  // Extract values from auth state
  const isAuthenticated = authState.isAuthenticated;
  const token = authState.token;
  const user = authState.user;
  const authLoading = authState.isLoading;
  const authError = authState.error;
  
  // Get params from route
  const params = useLocalSearchParams();
  const phoneNumber = params.mobile as string || mobile;

  const maskedMobile = phoneNumber ? `*****${phoneNumber.slice(-4)}` : "your number";

  useEffect(() => {
    if (timer === 0) return;
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (text: string, index: number) => {
    if (/^[0-9]$/.test(text) || text === "") {
      const newOtp = [...otp];
      newOtp[index] = text;
      setOtp(newOtp);
      if (text !== "" && index < 3) {
        inputs.current[index + 1].focus();
      }
    }
  };

  const handleResend = async () => {
    if (timer === 0) {
      setIsResending(true);
      try {
        const response = await apiConnector.sendOTP(phoneNumber);
        if (response.success) {
          setOtp(["", "", "", ""]);
          setTimer(60);
          Alert.alert("Success", "OTP resent successfully!");
        } else {
          Alert.alert("Error", response.message || "Failed to resend OTP");
        }
      } catch (error: any) {
        console.error("Resend OTP Error:", error);
        Alert.alert("Error", error.message || "Failed to resend OTP");
      } finally {
        setIsResending(false);
      }
    }
  };

  const handleVerifyOTP = async () => {
    const otpString = otp.join("");
    
    if (otpString.length !== 4) {
      Alert.alert("Invalid OTP", "Please enter the complete 4-digit OTP");
      return;
    }

    setIsLoading(true);
    dispatch(setLoading(true));
    dispatch(clearError());
    
    try {
      // Verify OTP
      const response = await apiConnector.verifyOTP(phoneNumber, otpString);
      
      if (response.success) {
        // Store authentication data in Redux
        const { token, restaurant } = response.data!;
        
        dispatch(setCredentials({
          user: restaurant,
          token: token
        }));
        
        console.log("✅ [OTP_SCREEN] Authentication data stored in Redux:", {
          token: token ? `${token.substring(0, 20)}...` : 'null',
          userId: restaurant?.id,
          isProfile: restaurant?.isProfile
        });
        
        // OTP verified successfully
        if (response.data?.isProfile === false) {
          // Profile not completed - show message and navigate to profile setup
          Alert.alert(
            "Profile Setup Required", 
            response.data?.message || "Please complete your profile setup to continue.",
            [
              {
                text: "Complete Profile",
                onPress: () => router.push("/(restaurant)/profile")
              }
            ]
          );
        } else {
          // Profile completed - navigate to dashboard
          Alert.alert(
            "Login Successful", 
            "Welcome back!",
            [
              {
                text: "OK",
                onPress: () => router.push("/(restaurant)")
              }
            ]
          );
        }
      } else {
        const errorMessage = response.message || "Invalid OTP";
        dispatch(setError(errorMessage));
        Alert.alert("Verification Failed", errorMessage);
      }
    } catch (error: any) {
      console.error("Verify OTP Error:", error);
      const errorMessage = error.message || "Failed to verify OTP. Please try again.";
      dispatch(setError(errorMessage));
      Alert.alert(
        "Error", 
        errorMessage
      );
    } finally {
      setIsLoading(false);
      dispatch(setLoading(false));
    }
  };

  const showReduxState = () => {
    Alert.alert(
      "Redux State Debug",
      `Auth State:
Is Authenticated: ${isAuthenticated}
Has Token: ${token ? 'Yes' : 'No'}
Has User: ${user ? 'Yes' : 'No'}
User ID: ${user?.id || 'N/A'}
Is Profile Complete: ${user?.isProfile || 'N/A'}
Loading: ${authLoading}
Error: ${authError || 'None'}`,
      [{ text: "OK" }]
    );
  };

  const isOtpComplete = otp.every(digit => digit !== "");

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <Appbar.Header style={{ backgroundColor: "#fff", elevation: 0 }}>
        <Appbar.BackAction
          onPress={() => router.push("/(auth)" as any)}
          color="#FA4A0C"
        />
        <Appbar.Content
          title="Verification"
          titleStyle={{ color: "#FA4A0C" }}
        />
        <Appbar.Action 
          icon="bug" 
          onPress={showReduxState}
          color="#FA4A0C"
        />
      </Appbar.Header>

      <View style={styles.content}>
        <Text style={styles.otpInfo}>Code has been sent to {maskedMobile}</Text>
        
        <View style={styles.otpInputs}>
          {otp.map((digit, index) => (
            <RNTextInput
              key={index}
              ref={(ref: any) => (inputs.current[index] = ref!)}
              style={styles.otpBox}
              value={digit}
              keyboardType="numeric"
              maxLength={1}
              onChangeText={(text) => handleChange(text, index)}
              placeholder=""
              textAlign="center"
              selectionColor="#FA4A0C"
            />
          ))}
        </View>

        <View style={styles.timerContainer}>
          <Text style={styles.timerText}>Didn&apos;t receive code?</Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <IconButton icon="clock-outline" size={16} disabled />
            <Text style={styles.timerCountdown}>
              00 : {timer.toString().padStart(2, "0")}
            </Text>
          </View>
          <TouchableOpacity 
            onPress={handleResend} 
            disabled={timer > 0 || isResending}
          >
            <Text
              style={[
                styles.resendText,
                { 
                  color: timer === 0 && !isResending ? "#FA4A0C" : "#CCCCCC" 
                },
              ]}
            >
              {isResending ? "Resending..." : "Resend Code"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={handleVerifyOTP}
          style={styles.confirmButton}
          contentStyle={styles.buttonContent}
          labelStyle={styles.buttonLabel}
          loading={isLoading}
          disabled={!isOtpComplete || isLoading}
        >
          {isLoading ? "Verifying..." : "Confirm OTP →"}
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    paddingHorizontal: 30,
    paddingTop: 40,
    alignItems: "center",
  },
  otpInfo: {
    fontSize: 16,
    color: "#333",
    marginBottom: 30,
  },
  otpInputs: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 30,
  },
  otpBox: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderColor: "#DDDDDD",
    borderRadius: 8,
    fontSize: 18,
  },
  timerContainer: {
    alignItems: "center",
  },
  timerText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  timerCountdown: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 4,
  },
  resendText: {
    fontSize: 14,
    fontWeight: "500",
    marginTop: 6,
  },
  buttonContainer: {
    marginTop: "auto",
    padding: 30,
  },
  confirmButton: {
    borderRadius: 25,
    backgroundColor: "#FA4A0C",
  },
  buttonContent: {
    paddingVertical: 12,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
});

export default OtpScreen;
