import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { ReactNode } from 'react';
import { Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BrandIcon } from '@/components/brand-icons';
import { AppBrand, Brand, Gradients, Radius, Shadow } from '@/constants/brand';

type IconName = keyof typeof Ionicons.glyphMap;

export function BackHeader({ title, sub }: { title: string; sub?: string }) {
  return (
    <LinearGradient colors={Gradients.heroWarm} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={hdr.grad}>
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

export function Surface({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[styles.surface, style]}>{children}</View>;
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
  return <BrandIcon icon={icon} size={size} />;
}

export function SectionTitle({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) {
  return (
    <View style={styles.sectionRow}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {action ? (
        <Pressable onPress={onAction} hitSlop={8} style={styles.sectionActionPill}>
          <Text style={styles.sectionAction}>{action}</Text>
          <Ionicons name="chevron-forward" size={13} color={Brand.primary} />
        </Pressable>
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
      <Text style={[styles.badgeText, { color }]} numberOfLines={1}>{text}</Text>
    </View>
  );
}

export function Stars({ rating, size = 12 }: { rating: number; size?: number }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
      <Ionicons name="star" size={size} color={Brand.star} />
      <Text style={{ color: Brand.text, fontSize: size, fontWeight: '800' }}>{rating.toFixed(1)}</Text>
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
  surface: {
    backgroundColor: Brand.cardElevated,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Brand.border,
    padding: 18,
    ...Shadow.soft,
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 17, fontWeight: '900', color: Brand.text, letterSpacing: 0 },
  sectionActionPill: { flexDirection: 'row', alignItems: 'center', gap: 2, paddingHorizontal: 10, paddingVertical: 6, borderRadius: Radius.pill, backgroundColor: Brand.primarySoft },
  sectionAction: { fontSize: 12, color: Brand.primary, fontWeight: '900' },
  badge: { maxWidth: 130, paddingHorizontal: 10, paddingVertical: 5, borderRadius: Radius.pill, alignSelf: 'flex-start' },
  badgeText: { fontSize: 11, fontWeight: '900' },
});

const hdr = StyleSheet.create({
  grad: { borderBottomLeftRadius: 24, borderBottomRightRadius: 24, ...Shadow.strong },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingTop: 8, paddingBottom: 18 },
  back: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.14)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Brand.borderDark },
  title: { fontSize: 20, fontWeight: '900', color: '#fff' },
  sub: { fontSize: 12, color: Brand.textOnDarkSub, marginTop: 3, lineHeight: 17 },
});

