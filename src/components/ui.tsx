import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { ReactNode } from 'react';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';

import { Brand, Gradients, Radius, Shadow } from '@/constants/brand';

type IconName = keyof typeof Ionicons.glyphMap;

export function Card({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

/** 渐变图标圆角方块 */
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
      style={{ width: size, height: size, borderRadius: size * 0.32, alignItems: 'center', justifyContent: 'center' }}>
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
          {action} ›
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
    padding: 16,
    ...Shadow.card,
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: Brand.text, letterSpacing: 0.2 },
  sectionAction: { fontSize: 12, color: Brand.primary, fontWeight: '700' },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: Radius.pill, alignSelf: 'flex-start' },
  badgeText: { fontSize: 11, fontWeight: '800' },
});
