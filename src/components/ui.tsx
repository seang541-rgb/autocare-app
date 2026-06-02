import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { ReactNode } from 'react';
import { Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppBrand, Brand, Gradients, Radius, Shadow } from '@/constants/brand';

type IconName = keyof typeof Ionicons.glyphMap;

export function BackHeader({ title, sub }: { title: string; sub?: string }) {
  return (
    <LinearGradient colors={Gradients.hero} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={hdr.grad}>
      <SafeAreaView edges={['top']}>
        <View style={hdr.row}>
          <Pressable
            style={hdr.back}
            onPress={() => (router.canGoBack() ? router.back() : router.replace('/(tabs)'))}
            hitSlop={8}>
            <Ionicons name="chevron-back" size={22} color="#fff" />
          </Pressable>
          <View style={{ flex: 1 }}>
            <Text style={hdr.title}>{title}</Text>
            <Text style={hdr.sub}>{sub ?? AppBrand.name}</Text>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

export function Card({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function GradIcon({
  icon,
  grad,
  size = 48,
  iconSize = 22,
}: {
  icon: IconName;
  grad: keyof typeof Gradients;
  size?: number;
  iconSize?: number;
}) {
  return (
    <LinearGradient
      colors={Gradients[grad]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ width: size, height: size, borderRadius: Math.max(8, size * 0.24), alignItems: 'center', justifyContent: 'center' }}>
      <Ionicons name={icon} size={iconSize} color="#fff" />
    </LinearGradient>
  );
}

export function SectionTitle({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) {
  return (
    <View style={styles.sectionRow}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {action ? (
        <Text style={styles.sectionAction} onPress={onAction}>
          {action}
        </Text>
      ) : null}
    </View>
  );
}

export function Badge({
  text,
  color = Brand.primary,
  soft = Brand.primarySoft,
}: {
  text: string;
  color?: string;
  soft?: string;
}) {
  return (
    <View style={[styles.badge, { backgroundColor: soft }]}>
      <Text style={[styles.badgeText, { color }]}>{text}</Text>
    </View>
  );
}

export function Stars({ rating, size = 12 }: { rating: number; size?: number }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
      <Ionicons name="star" size={size} color={Brand.star} />
      <Text style={{ color: Brand.text, fontSize: size, fontWeight: '700' }}>{rating.toFixed(1)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Brand.card,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Brand.border,
    padding: 16,
    ...Shadow.card,
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: Brand.text },
  sectionAction: { fontSize: 12, color: Brand.primary, fontWeight: '800' },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: Radius.pill, alignSelf: 'flex-start' },
  badgeText: { fontSize: 11, fontWeight: '800' },
});

const hdr = StyleSheet.create({
  grad: { borderBottomLeftRadius: 18, borderBottomRightRadius: 18 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 14, paddingTop: 6, paddingBottom: 16 },
  back: { width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(255,255,255,0.12)', alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 18, fontWeight: '900', color: '#fff' },
  sub: { fontSize: 12, color: Brand.textOnDarkSub, marginTop: 2 },
});
