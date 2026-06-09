import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { BackHeader, Badge, Card, GradIcon, Stars } from '@/components/ui';
import { Brand, Gradients, Radius, Shadow } from '@/constants/brand';
import { catalogItems, merchants } from '@/constants/data';
import { useI18n } from '@/store/i18n';

function one(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

export default function MerchantDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t, merchantHero, catalogItemName, catalogItemDesc } = useI18n();
  const merchant = merchants.find((m) => m.id === one(id)) ?? merchants[0];
  const items = catalogItems.filter((item) => item.merchantId === merchant.id);
  const [qty, setQty] = useState<Record<string, number>>({});

  const lines = useMemo(
    () => items
      .map((item) => ({ itemId: item.id, name: item.name, qty: qty[item.id] ?? 0, price: item.price }))
      .filter((line) => line.qty > 0),
    [items, qty],
  );
  const subtotal = lines.reduce((sum, line) => sum + line.qty * line.price, 0);
  const count = lines.reduce((sum, line) => sum + line.qty, 0);

  function change(itemId: string, delta: number) {
    setQty((prev) => ({ ...prev, [itemId]: Math.max(0, (prev[itemId] ?? 0) + delta) }));
  }

  function checkout() {
    if (lines.length === 0) return;
    router.push({ pathname: '/confirm', params: { merchantId: merchant.id, lines: encodeURIComponent(JSON.stringify(lines)) } });
  }

  return (
    <View style={styles.root}>
      <BackHeader title={merchant.name} sub={merchant.area} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <LinearGradient colors={Gradients[merchant.grad]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.hero}>
          <View style={styles.heroTop}>
            <GradIcon icon={merchant.icon} grad="card" size={58} iconSize={28} />
            <View style={{ flex: 1 }}>
              <Text style={styles.heroTitle}>{merchantHero(merchant)}</Text>
              <View style={styles.heroStats}>
                <Stars rating={merchant.rating} />
                <Text style={styles.heroMeta}>{t('reviews', { count: merchant.reviews })}</Text>
                <Text style={styles.heroMeta}>{merchant.distanceKm} km</Text>
              </View>
            </View>
          </View>
          <View style={styles.statusRow}>
            <Badge text={merchant.openNow ? t('openNow') : t('closed')} color={merchant.openNow ? Brand.success : Brand.textSub} soft="#fff" />
            <Text style={styles.statusText}>{merchant.open} / {merchant.etaMins || '-'} min / {t('inQueue', { count: merchant.queueCount })}</Text>
          </View>
        </LinearGradient>

        <Text style={styles.section}>{t('menuServices')}</Text>
        <View style={{ gap: 12 }}>
          {items.map((item) => {
            const current = qty[item.id] ?? 0;
            return (
              <Card key={item.id} style={styles.itemRow}>
                <View style={styles.itemIcon}>
                  <Ionicons name={item.icon} size={22} color={Brand.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <View style={styles.itemTitleRow}>
                    <Text style={styles.itemName}>{catalogItemName(item)}</Text>
                    {item.popular ? <Badge text={t('popular')} /> : null}
                  </View>
                  <Text style={styles.itemDesc}>{catalogItemDesc(item)}</Text>
                  <Text style={styles.itemPrice}>RM {item.price}</Text>
                </View>
                <View style={styles.stepper}>
                  <Pressable style={styles.stepBtn} onPress={() => change(item.id, -1)}>
                    <Ionicons name="remove" size={16} color={current > 0 ? Brand.primary : Brand.textMuted} />
                  </Pressable>
                  <Text style={styles.stepQty}>{current}</Text>
                  <Pressable style={[styles.stepBtn, styles.stepBtnOn]} onPress={() => change(item.id, 1)}>
                    <Ionicons name="add" size={16} color="#fff" />
                  </Pressable>
                </View>
              </Card>
            );
          })}
        </View>

        <View style={{ height: 96 }} />
      </ScrollView>

      <View style={styles.footer}>
        <View>
          <Text style={styles.footLabel}>{t('itemCount', { count, suffix: count === 1 ? '' : 's' })}</Text>
          <Text style={styles.footPrice}>RM {subtotal}</Text>
        </View>
        <Pressable onPress={checkout} disabled={lines.length === 0}>
          <LinearGradient colors={Gradients.brand} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={[styles.cta, lines.length === 0 && { opacity: 0.45 }]}>
            <Text style={styles.ctaText}>{t('checkout')}</Text>
            <Ionicons name="arrow-forward" size={18} color="#fff" />
          </LinearGradient>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Brand.bg },
  scroll: { paddingHorizontal: 16, paddingTop: 14 },
  hero: { borderRadius: Radius.xl, padding: 16, marginBottom: 20, ...Shadow.soft },
  heroTop: { flexDirection: 'row', gap: 14, alignItems: 'center' },
  heroTitle: { color: '#fff', fontSize: 21, fontWeight: '900' },
  heroStats: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 8 },
  heroMeta: { color: 'rgba(255,255,255,0.78)', fontSize: 12, fontWeight: '700' },
  statusRow: { marginTop: 18, flexDirection: 'row', alignItems: 'center', gap: 10 },
  statusText: { flex: 1, color: '#fff', fontSize: 12, fontWeight: '700' },
  section: { color: Brand.text, fontSize: 16, fontWeight: '900', marginBottom: 12 },
  itemRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12 },
  itemIcon: { width: 42, height: 42, borderRadius: 12, backgroundColor: Brand.primarySoft, alignItems: 'center', justifyContent: 'center' },
  itemTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  itemName: { flex: 1, color: Brand.text, fontSize: 15, fontWeight: '900' },
  itemDesc: { color: Brand.textSub, fontSize: 12, lineHeight: 17, marginTop: 3 },
  itemPrice: { color: Brand.text, fontSize: 14, fontWeight: '900', marginTop: 7 },
  stepper: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  stepBtn: { width: 28, height: 28, borderRadius: 14, backgroundColor: Brand.bg, alignItems: 'center', justifyContent: 'center' },
  stepBtnOn: { backgroundColor: Brand.primary },
  stepQty: { width: 18, textAlign: 'center', color: Brand.text, fontSize: 14, fontWeight: '900' },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 12, paddingBottom: Platform.OS === 'ios' ? 28 : 14, backgroundColor: Brand.card, borderTopWidth: 1, borderTopColor: Brand.border },
  footLabel: { fontSize: 11, color: Brand.textSub, fontWeight: '700' },
  footPrice: { fontSize: 22, fontWeight: '900', color: Brand.text, marginTop: 2 },
  cta: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 30, paddingVertical: 15, borderRadius: Radius.pill, ...Shadow.soft },
  ctaText: { color: '#fff', fontSize: 16, fontWeight: '900' },
});


