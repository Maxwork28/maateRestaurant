import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { View, Text } from "react-native";
import { useAppSelector } from "../store/hooks";
import Home from "./components/common/home-screen";

export default function Index() {
  const router = useRouter();
  const { user, token, isAuthenticated, isLoading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    console.log("🔍 [INDEX] Auth state check:", {
      hasUser: !!user,
      hasToken: !!token,
      isAuthenticated,
      isLoading,
      userIsProfile: user?.isProfile
    });

    // Only proceed if not loading
    if (isLoading) {
      console.log("⏳ [INDEX] Still loading auth state...");
      return;
    }

    // If user is authenticated and has a token
    if (isAuthenticated && user && token) {
      console.log("✅ [INDEX] User is authenticated, checking profile status");
      
      // Small delay to ensure navigation works properly
      const navigationTimer = setTimeout(() => {
        if (user.isProfile === false) {
          // User is logged in but profile is not complete - redirect to profile
          console.log("📝 [INDEX] Profile incomplete, redirecting to profile creation");
          router.replace("/(restaurant)/profile");
        } else {
          // User is logged in and profile is complete - redirect to dashboard
          console.log("🏠 [INDEX] Profile complete, redirecting to dashboard");
          router.replace("/(restaurant)");
        }
      }, 100);

      return () => clearTimeout(navigationTimer);
    } else {
      // User is not authenticated - show home screen
      console.log("🏠 [INDEX] User not authenticated, showing home screen");
    }
  }, [isAuthenticated, user, token, isLoading, router]);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FDF7F1' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  // Show home screen if not authenticated
  if (!isAuthenticated || !user || !token) {
    return (
      <View style={{ flex: 1 }}>
        <Home/>
      </View>
    );
  }

  // This should not be reached due to useEffect navigation, but just in case
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FDF7F1' }}>
      <Text>Redirecting...</Text>
    </View>
  );
}
