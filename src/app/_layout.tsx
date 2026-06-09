import { Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { ReactNode, useEffect } from 'react';
import { router, Stack, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { Brand } from '@/constants/brand';
import { AccountProvider, useAccount } from '@/store/account';
import { I18nProvider } from '@/store/i18n';
import { OrderProvider } from '@/store/orders';
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
            <AccountProvider>
              <OrderProvider>
                <ToastProvider>
                  <StatusBar style="light" />
                  <AuthGate>
                    <Stack screenOptions={{ headerShown: false }}>
                      <Stack.Screen name="auth/login" options={{ gestureEnabled: false }} />
                      <Stack.Screen name="auth/register" options={{ presentation: 'card' }} />
                      <Stack.Screen name="(tabs)" />
                      <Stack.Screen name="service/[id]" options={{ presentation: 'card' }} />
                      <Stack.Screen name="promo/[id]" options={{ presentation: 'card' }} />
                      <Stack.Screen name="confirm" options={{ presentation: 'card' }} />
                      <Stack.Screen name="success" options={{ presentation: 'modal', gestureEnabled: false }} />
                      <Stack.Screen name="order/[id]" options={{ presentation: 'card' }} />
                      <Stack.Screen name="profile/vehicles" options={{ presentation: 'card' }} />
                      <Stack.Screen name="profile/coupons" options={{ presentation: 'card' }} />
                      <Stack.Screen name="profile/payments" options={{ presentation: 'card' }} />
                      <Stack.Screen name="profile/addresses" options={{ presentation: 'card' }} />
                      <Stack.Screen name="profile/member-qr" options={{ presentation: 'modal' }} />
                      <Stack.Screen name="profile/support" options={{ presentation: 'card' }} />
                      <Stack.Screen name="profile/complaints" options={{ presentation: 'card' }} />
                      <Stack.Screen name="profile/settings" options={{ presentation: 'card' }} />
                    </Stack>
                  </AuthGate>
                </ToastProvider>
              </OrderProvider>
            </AccountProvider>
          </I18nProvider>
        </SafeAreaProvider>
      </View>
    </GestureHandlerRootView>
  );
}


function AuthGate({ children }: { children: ReactNode }) {
  const segments = useSegments();
  const { hydrated, isAuthenticated } = useAccount();
  const inAuth = segments[0] === 'auth';

  useEffect(() => {
    if (!hydrated) return;
    if (!isAuthenticated && !inAuth) router.replace('/auth/login');
    if (isAuthenticated && inAuth) router.replace('/(tabs)');
  }, [hydrated, inAuth, isAuthenticated]);

  if (!hydrated || (!isAuthenticated && !inAuth) || (isAuthenticated && inAuth)) {
    return <View style={styles.loading} />;
  }

  return children;
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

