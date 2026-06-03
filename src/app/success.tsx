import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Animated, Easing, Pressable, StyleSheet, Text, View } from 'react-native';

import { Brand, Gradients, Radius, Shadow } from '@/constants/brand';
import { useI18n } from '@/store/i18n';

export default function Success() {
  const { id, price } = useLocalSearchParams<{ id: string; price: string }>();
  const { t } = useI18n();
  const [scale] = useState(() => new Animated.Value(0));
  const [fade] = useState(() => new Animated.Value(0));

  useEffect(() => {
    Animated.sequence([
      Animated.spring(scale, { toValue: 1, friction: 5, tension: 80, useNativeDriver: true }),
      Animated.timing(fade, { toValue: 1, duration: 350, easing: Easing.out(Easing.ease), useNativeDriver: true }),
    ]).start();
  }, [scale, fade]);

  return (
    <LinearGradient colors={Gradients.hero} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.root}>
      <View style={styles.center}>
        <Animated.View style={{ transform: [{ scale }] }}>
          <LinearGradient colors={Gradients.brand} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.circle}>
            <Ionicons name="checkmark-sharp" size={68} color="#fff" />
          </LinearGradient>
        </Animated.View>

        <Animated.View style={{ opacity: fade, alignItems: 'center' }}>
          <Text style={styles.title}>{t('successTitle')}</Text>
          <Text style={styles.sub}>{t('successSub', { id: id ?? '' })}</Text>
          <Text style={styles.amount}>RM {price}</Text>

          <View style={styles.tipCard}>
            <Ionicons name="logo-whatsapp" size={20} color="#25D366" />
            <Text style={styles.tipText}>{t('successTip')}</Text>
          </View>
        </Animated.View>
      </View>

      <Animated.View style={[styles.footer, { opacity: fade }]}>
        <Pressable style={styles.btnGhost} onPress={() => router.replace('/(tabs)/orders')}>
          <Text style={styles.btnGhostText}>{t('viewAllOrders')}</Text>
        </Pressable>
        <Pressable onPress={() => router.replace({ pathname: '/order/[id]', params: { id: String(id) } })}>
          <LinearGradient colors={Gradients.brand} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.btnPrimary}>
            <Ionicons name="qr-code-outline" size={18} color="#fff" />
            <Text style={styles.btnPrimaryText}>{t('viewQr')}</Text>
          </LinearGradient>
        </Pressable>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },
  circle: { width: 130, height: 130, borderRadius: 65, alignItems: 'center', justifyContent: 'center', ...Shadow.soft },
  title: { color: '#fff', fontSize: 26, fontWeight: '900', marginTop: 30 },
  sub: { color: Brand.textOnDarkSub, fontSize: 14, marginTop: 8 },
  amount: { color: Brand.primary, fontSize: 32, fontWeight: '900', marginTop: 14 },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: Radius.md,
    marginTop: 28,
  },
  tipText: { color: '#fff', fontSize: 12, flex: 1 },
  footer: { flexDirection: 'row', gap: 12, paddingHorizontal: 24, paddingBottom: 40 },
  btnGhost: { flex: 1, paddingVertical: 15, borderRadius: Radius.pill, alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.12)' },
  btnGhostText: { color: '#fff', fontSize: 14, fontWeight: '700' },
  btnPrimary: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 24, paddingVertical: 15, borderRadius: Radius.pill },
  btnPrimaryText: { color: '#fff', fontSize: 14, fontWeight: '800' },
});
