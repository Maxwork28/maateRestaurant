// app/_layout.tsx
import { Slot, Stack } from "expo-router";
import { View, Text } from "react-native";
import { PaperProvider } from "react-native-paper";
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '../store';

// Loading component for PersistGate
const LoadingComponent = () => (
  <View style={{ 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#FDF7F1' 
  }}>
    <Text style={{ fontSize: 16, color: '#333' }}>Loading...</Text>
  </View>
);

export default function RootLayout() {
  return (
    <Provider store={store}>
      <PersistGate loading={<LoadingComponent />} persistor={persistor}>
        <PaperProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Slot />
          </Stack>
        </PaperProvider>
      </PersistGate>
    </Provider>
  );
}
