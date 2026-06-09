import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { ActivityIndicator, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { BackHeader, Card } from '@/components/ui';
import { Brand, Gradients, Radius, Shadow } from '@/constants/brand';
import { merchants, OrderLine } from '@/constants/data';
import { useI18n } from '@/store/i18n';
import { useOrders } from '@/store/orders';

function one(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

function parseLines(value?: string | string[]): OrderLine[] {
  const raw = one(value);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(decodeURIComponent(raw));
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((line) => ({ itemId: String(line.itemId), name: String(line.name), qty: Number(line.qty), price: Number(line.price) }))
      .filter((line) => line.itemId && line.name && line.qty > 0 && line.price >= 0);
  } catch {
    return [];
  }
}

export default function Confirm() {
  const params = useLocalSearchParams<{ merchantId?: string; lines?: string }>();
  const { t, orderLineName } = useI18n();
  const { addOrder } = useOrders();
  const merchant = merchants.find((m) => m.id === one(params.merchantId)) ?? merchants[0];
  const lines = useMemo(() => parseLines(params.lines), [params.lines]);
  const [mode, setMode] = useState(merchant.fulfilment[0] ?? 'pickup');
  const [pay, setPay] = useState('manual');
  const [note, setNote] = useState('');
  const [paying, setPaying] = useState(false);
  const subtotal = lines.reduce((sum, line) => sum + line.qty * line.price, 0);
  const discount = subtotal >= 20 ? 2 : 0;
  const total = Math.max(0, subtotal - discount);

  function payNow() {
    if (lines.length === 0) return;
    setPaying(true);
    setTimeout(() => {
      const order = addOrder({ merchantId: merchant.id, type: mode, lines, note, discount, date: '2026-06-07', time: mode === 'pickup' ? 'ASAP' : '14:30' });
      setPaying(false);
      router.replace({ pathname: '/success', params: { id: order.id, price: String(order.total) } });
    }, 900);
  }

  return (
    <View style={styles.root}>
      <BackHeader title={t('checkout')} sub={merchant.name} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <Card style={styles.merchantCard}>
          <LinearGradient colors={Gradients[merchant.grad]} style={styles.merchantIcon}>
            <Ionicons name={merchant.icon} size={24} color="#fff" />
          </LinearGradient>
          <View style={{ flex: 1 }}>
            <Text style={styles.merchantName}>{merchant.name}</Text>
            <Text style={styles.merchantMeta}>{merchant.area} - {merchant.etaMins || '-'} min</Text>
          </View>
        </Card>

        <Text style={styles.section}>{t('fulfilment')}</Text>
        <View style={styles.modeRow}>
          {merchant.fulfilment.map((item) => {
            const on = item === mode;
            const label = item === 'pickup' ? t('pickup') : item === 'booking' ? t('booking') : t('service');
            return (
              <Pressable key={item} style={[styles.modeChip, on && styles.modeChipOn]} onPress={() => setMode(item)}>
                <Ionicons name={item === 'pickup' ? 'bag-check-outline' : item === 'booking' ? 'calendar-outline' : 'construct-outline'} size={16} color={on ? '#fff' : Brand.textSub} />
                <Text style={[styles.modeText, on && styles.modeTextOn]}>{label}</Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.section}>{t('orderSummary')}</Text>
        <Card>
          {lines.length === 0 ? (
            <Text style={styles.empty}>{t('noItemsSelected')}</Text>
          ) : (
            lines.map((line) => (
              <View key={line.itemId} style={styles.lineRow}>
                <Text style={styles.lineName}>{line.qty}x {orderLineName(line)}</Text>
                <Text style={styles.linePrice}>RM {line.qty * line.price}</Text>
              </View>
            ))
          )}
        </Card>

        <Text style={styles.section}>{t('customerNote')}</Text>
        <TextInput value={note} onChangeText={setNote} placeholder={t('notePlaceholder')} placeholderTextColor={Brand.textMuted} style={styles.input} />

        <Text style={styles.section}>{t('paymentMethod')}</Text>
        <View style={{ gap: 10 }}>
          {[
            { id: 'manual', name: t('manualPayment'), icon: 'receipt-outline' as const },
            { id: 'tng', name: t('tngPlaceholder'), icon: 'wallet-outline' as const },
            { id: 'bank', name: t('bankPlaceholder'), icon: 'business-outline' as const },
          ].map((m) => {
            const on = m.id === pay;
            return (
              <Pressable key={m.id} onPress={() => setPay(m.id)}>
                <Card style={[styles.payRow, on && { borderWidth: 2, borderColor: Brand.primary }]}>
                  <Ionicons name={m.icon} size={20} color={on ? Brand.primary : Brand.textSub} />
                  <Text style={styles.payName}>{m.name}</Text>
                  <View style={[styles.radio, on && styles.radioOn]}>{on && <Ionicons name="checkmark" size={12} color="#fff" />}</View>
                </Card>
              </Pressable>
            );
          })}
        </View>

        <Card style={{ marginTop: 20 }}>
          <Fee label={t('subtotal')} value={`RM ${subtotal}`} />
          <Fee label={t('platformVoucher')} value={`- RM ${discount}`} success />
          <View style={styles.feeDivider} />
          <Fee label={t('amountDue')} value={`RM ${total}`} total />
        </Card>

        <View style={{ height: 20 }} />
      </ScrollView>

      <View style={styles.footer}>
        <View>
          <Text style={styles.footLabel}>{t('amountDue')}</Text>
          <Text style={styles.footPrice}>RM {total}</Text>
        </View>
        <Pressable onPress={payNow} disabled={paying || lines.length === 0}>
          <LinearGradient colors={Gradients.brand} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={[styles.cta, (paying || lines.length === 0) && { opacity: 0.6 }]}>
            {paying ? <ActivityIndicator color="#fff" size="small" /> : <Ionicons name="checkmark-circle" size={17} color="#fff" />}
            <Text style={styles.ctaText}>{paying ? t('confirming') : t('placeOrder')}</Text>
          </LinearGradient>
        </Pressable>
      </View>
    </View>
  );
}

function Fee({ label, value, success, total }: { label: string; value: string; success?: boolean; total?: boolean }) {
  return (
    <View style={styles.feeRow}>
      <Text style={total ? styles.feeTotalLabel : styles.feeLabel}>{label}</Text>
      <Text style={[total ? styles.feeTotal : styles.feeVal, success && { color: Brand.success }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Brand.bg },
  scroll: { paddingHorizontal: 16, paddingTop: 14, paddingBottom: 16 },
  merchantCard: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  merchantIcon: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  merchantName: { fontSize: 16, fontWeight: '900', color: Brand.text },
  merchantMeta: { fontSize: 12, color: Brand.textSub, marginTop: 3 },
  section: { fontSize: 14, fontWeight: '900', color: Brand.text, marginTop: 20, marginBottom: 10 },
  modeRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  modeChip: { flexDirection: 'row', alignItems: 'center', gap: 7, paddingHorizontal: 13, paddingVertical: 10, borderRadius: Radius.pill, backgroundColor: Brand.card, borderWidth: 1, borderColor: Brand.border },
  modeChipOn: { backgroundColor: Brand.primary, borderColor: Brand.primary },
  modeText: { color: Brand.textSub, fontSize: 13, fontWeight: '800' },
  modeTextOn: { color: '#fff' },
  empty: { color: Brand.textSub, fontSize: 13 },
  lineRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 7, borderBottomWidth: 1, borderBottomColor: Brand.border },
  lineName: { flex: 1, color: Brand.text, fontSize: 13, fontWeight: '800' },
  linePrice: { color: Brand.text, fontSize: 13, fontWeight: '900' },
  input: { backgroundColor: Brand.card, borderWidth: 1, borderColor: Brand.border, borderRadius: Radius.lg, minHeight: 48, paddingHorizontal: 14, color: Brand.text, fontSize: 14 },
  payRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
  payName: { flex: 1, color: Brand.text, fontSize: 14, fontWeight: '800' },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: Brand.border, alignItems: 'center', justifyContent: 'center' },
  radioOn: { borderColor: Brand.primary, backgroundColor: Brand.primary },
  feeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 4 },
  feeLabel: { fontSize: 13, color: Brand.textSub },
  feeVal: { fontSize: 13, fontWeight: '700', color: Brand.text },
  feeDivider: { height: 1, backgroundColor: Brand.border, marginVertical: 8 },
  feeTotalLabel: { fontSize: 14, fontWeight: '900', color: Brand.text },
  feeTotal: { fontSize: 19, fontWeight: '900', color: Brand.primary },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 12, paddingBottom: Platform.OS === 'ios' ? 28 : 14, backgroundColor: Brand.card, borderTopWidth: 1, borderTopColor: Brand.border },
  footLabel: { fontSize: 11, color: Brand.textSub },
  footPrice: { fontSize: 22, fontWeight: '900', color: Brand.text, marginTop: 2 },
  cta: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 30, paddingVertical: 15, borderRadius: Radius.pill, ...Shadow.soft },
  ctaText: { color: '#fff', fontSize: 16, fontWeight: '900' },
});

