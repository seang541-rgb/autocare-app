import { ReactNode } from 'react';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';

import { Brand, Radius } from '@/constants/brand';

export function Card({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function SectionTitle({ title, action }: { title: string; action?: string }) {
  return (
    <View style={styles.sectionRow}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {action ? <Text style={styles.sectionAction}>{action}</Text> : null}
    </View>
  );
}

export function Badge({ text, color = Brand.primary, soft = Brand.primarySoft }: { text: string; color?: string; soft?: string }) {
  return (
    <View style={[styles.badge, { backgroundColor: soft }]}>
      <Text style={[styles.badgeText, { color }]}>{text}</Text>
    </View>
  );
}

export function Stars({ rating, size = 12 }: { rating: number; size?: number }) {
  return <Text style={{ color: Brand.star, fontSize: size, fontWeight: '700' }}>★ {rating.toFixed(1)}</Text>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Brand.card,
    borderRadius: Radius.md,
    padding: 14,
    shadowColor: '#0F172A',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  sectionTitle: { fontSize: 15, fontWeight: '800', color: Brand.text },
  sectionAction: { fontSize: 12, color: Brand.primary, fontWeight: '600' },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: Radius.pill, alignSelf: 'flex-start' },
  badgeText: { fontSize: 11, fontWeight: '700' },
});
