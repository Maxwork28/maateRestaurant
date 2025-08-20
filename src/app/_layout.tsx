// app/_layout.tsx
import { Slot, Stack } from "expo-router";
import { PaperProvider } from "react-native-paper";
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '../store';

export default function RootLayout() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <PaperProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Slot />
          </Stack>
        </PaperProvider>
      </PersistGate>
    </Provider>
  );
}
