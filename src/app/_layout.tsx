import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { OrderProvider } from '@/store/orders';
import { ToastProvider } from '@/store/toast';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <OrderProvider>
          <ToastProvider>
            <StatusBar style="light" />
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="service/[id]" options={{ presentation: 'card' }} />
              <Stack.Screen name="confirm" options={{ presentation: 'card' }} />
              <Stack.Screen name="success" options={{ presentation: 'modal', gestureEnabled: false }} />
              <Stack.Screen name="order/[id]" options={{ presentation: 'card' }} />
            </Stack>
          </ToastProvider>
        </OrderProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
