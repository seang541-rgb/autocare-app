import { Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { Brand } from '@/constants/brand';
import { OrderProvider } from '@/store/orders';
import { I18nProvider } from '@/store/i18n';
import { ToastProvider } from '@/store/toast';

export default function RootLayout() {
  const [fontsLoaded] = useFonts(Ionicons.font);

  if (!fontsLoaded) {
    return <View style={styles.loading} />;
  }

  return (
    <GestureHandlerRootView style={styles.host}>
      <View style={styles.shell}>
        <SafeAreaProvider>
          <I18nProvider>
            <OrderProvider>
              <ToastProvider>
                <StatusBar style="light" />
                <Stack screenOptions={{ headerShown: false }}>
                  <Stack.Screen name="(tabs)" />
                  <Stack.Screen name="service/[id]" options={{ presentation: 'card' }} />
                  <Stack.Screen name="promo/[id]" options={{ presentation: 'card' }} />
                  <Stack.Screen name="confirm" options={{ presentation: 'card' }} />
                  <Stack.Screen name="success" options={{ presentation: 'modal', gestureEnabled: false }} />
                  <Stack.Screen name="order/[id]" options={{ presentation: 'card' }} />
                </Stack>
              </ToastProvider>
            </OrderProvider>
          </I18nProvider>
        </SafeAreaProvider>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  host: {
    flex: 1,
    backgroundColor: Platform.OS === 'web' ? '#111827' : Brand.bg,
    alignItems: Platform.OS === 'web' ? 'center' : 'stretch',
  },
  shell: {
    flex: 1,
    width: '100%',
    maxWidth: Platform.OS === 'web' ? 430 : undefined,
    backgroundColor: Brand.bg,
    overflow: 'hidden',
  },
  loading: {
    flex: 1,
    backgroundColor: Brand.bg,
  },
});
