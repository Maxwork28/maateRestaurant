import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'expo-router';
import { useAppSelector } from '../../store/hooks';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ROUTE_STORAGE_KEY = 'currentRoute';

export const useNavigationPersistence = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isRestored, setIsRestored] = useState(false);
  const { user, token } = useAppSelector((state) => state.auth);

  // Save current route to AsyncStorage
  const saveCurrentRoute = async (route: string) => {
    try {
      await AsyncStorage.setItem(ROUTE_STORAGE_KEY, route);
      console.log('💾 [NAV_PERSISTENCE] Saved current route:', route);
    } catch (error) {
      console.error('❌ [NAV_PERSISTENCE] Error saving route:', error);
    }
  };

  // Load saved route from AsyncStorage
  const loadSavedRoute = async (): Promise<string | null> => {
    try {
      const savedRoute = await AsyncStorage.getItem(ROUTE_STORAGE_KEY);
      console.log('📂 [NAV_PERSISTENCE] Loaded saved route:', savedRoute);
      return savedRoute;
    } catch (error) {
      console.error('❌ [NAV_PERSISTENCE] Error loading route:', error);
      return null;
    }
  };

  // Clear saved route (useful for logout)
  const clearSavedRoute = async () => {
    try {
      await AsyncStorage.removeItem(ROUTE_STORAGE_KEY);
      console.log('🗑️ [NAV_PERSISTENCE] Cleared saved route');
    } catch (error) {
      console.error('❌ [NAV_PERSISTENCE] Error clearing route:', error);
    }
  };

  // Restore saved route on app start
  const restoreRoute = async () => {
    if (isRestored) return; // Prevent multiple restorations
    
    try {
      const savedRoute = await loadSavedRoute();
      if (savedRoute && savedRoute !== pathname) {
        console.log('🔄 [NAV_PERSISTENCE] Restoring saved route:', savedRoute);
        router.replace(savedRoute as any);
      }
      setIsRestored(true);
    } catch (error) {
      console.error('❌ [NAV_PERSISTENCE] Error restoring route:', error);
      setIsRestored(true);
    }
  };

  // Save route whenever pathname changes
  useEffect(() => {
    if (pathname && isRestored && user && token) {
      saveCurrentRoute(pathname);
    }
  }, [pathname, isRestored, user, token]);

  // Clear saved route when user logs out
  useEffect(() => {
    if (!user || !token) {
      clearSavedRoute();
      setIsRestored(false);
      console.log('🗑️ [NAV_PERSISTENCE] User logged out, cleared saved route');
    }
  }, [user, token]);

  return {
    saveCurrentRoute,
    loadSavedRoute,
    clearSavedRoute,
    restoreRoute,
    isRestored
  };
};
