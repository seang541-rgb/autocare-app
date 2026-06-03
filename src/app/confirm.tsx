import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { ActivityIndicator, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { BackHeader, Card } from '@/components/ui';
import { Brand, Gradients, Radius, Shadow } from '@/constants/brand';
import { dates, outlets, timeSlots } from '@/constants/data';
import { useI18n } from '@/store/i18n';
import { useOrders } from '@/store/orders';

const payIds = [
  { id: 'tng', icon: 'wallet-outline' as const },
  { id: 'card', icon: 'card-outline' as const },
  { id: 'fpx', icon: 'business-outline' as const },
];

export default function Confirm() {
  const p = useLocalSearchParams<{ service: string; icon: string; grad: keyof typeof Gradients; addons: string; price: string }>();
  const { addOrder } = useOrders();
  const { t, outletName, dateLabel } = useI18n();

  const [outletId, setOutletId] = useState(outlets[0].id);
  const [dateIdx, setDateIdx] = useState(0);
  const [slot, setSlot] = useState('14:30');
  const [pay, setPay] = useState('tng');
  const [paying, setPaying] = useState(false);

  const outlet = outlets.find((o) => o.id === outletId)!;
  const d = dates[dateIdx];
  const price = Number(p.price ?? 0);
  const pays = useMemo(
    () => [
      { ...payIds[0], name: "Touch 'n Go eWallet" },
      { ...payIds[1], name: t('cardDebit') },
      { ...payIds[2], name: t('fpxBank') },
    ],
    [t],
  );

  function payNow() {
    setPaying(true);
    setTimeout(() => {
      const order = addOrder({
        service: p.service ?? t('booking'),
        icon: (p.icon as any) ?? 'water',
        grad: (p.grad as any) ?? 'wash',
        outlet: outletName(outlet.id, outlet.name),
        outletId: outlet.id,
        date: `2026-06-${d.day}`,
        time: slot,
        price,
      });
      setPaying(false);
      router.replace({ pathname: '/success', params: { id: order.id, price: String(price) } });
    }, 1400);
  }

  return (
    <View style={styles.root}>
      <BackHeader title={t('confirmOrder')} sub={t('confirmSub')} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <Card style={styles.sumCard}>
          <LinearGradient colors={Gradients[p.grad || 'wash']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.sumIcon}>
            <Ionicons name={(p.icon as any) ?? 'water'} size={24} color="#fff" />
          </LinearGradient>
          <View style={{ flex: 1 }}>
            <Text style={styles.sumTitle}>{p.service}</Text>
            <Text style={styles.sumSub}>{t('addOnPrefix', { addons: p.addons ?? t('none') })}</Text>
          </View>
        </Card>

        <Text style={styles.section}>{t('outlet')}</Text>
        <View style={{ gap: 10 }}>
          {outlets.map((o) => {
            const on = o.id === outletId;
            return (
              <Pressable key={o.id} onPress={() => setOutletId(o.id)}>
                <Card style={[styles.row, on && { borderWidth: 2, borderColor: Brand.primary }]}>
                  <Ionicons name="storefront" size={20} color={on ? Brand.primary : Brand.textSub} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.rowName}>{outletName(o.id, o.name)}</Text>
                    <Text style={styles.rowMeta}>{o.distanceKm}km · {o.open}</Text>
                  </View>
                  <View style={[styles.radio, on && styles.radioOn]}>{on && <Ionicons name="checkmark" size={12} color="#fff" />}</View>
                </Card>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.section}>{t('date')}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
          {dates.map((dd, i) => {
            const on = i === dateIdx;
            const label = dateLabel(dd.label, dd.week);
            return on ? (
              <Pressable key={i} onPress={() => setDateIdx(i)}>
                <LinearGradient colors={Gradients.brand} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={styles.dateChip}>
                  <Text style={[styles.dateWeek, { color: '#fff' }]}>{label}</Text>
                  <Text style={[styles.dateDay, { color: '#fff' }]}>{dd.day}</Text>
                </LinearGradient>
              </Pressable>
            ) : (
              <Pressable key={i} onPress={() => setDateIdx(i)} style={styles.dateChip}>
                <Text style={styles.dateWeek}>{label}</Text>
                <Text style={styles.dateDay}>{dd.day}</Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <Text style={styles.section}>{t('timeSlot')}</Text>
        <View style={styles.slotGrid}>
          {timeSlots.map((time) => {
            const on = time === slot;
            return (
              <Pressable key={time} onPress={() => setSlot(time)} style={[styles.slot, on && styles.slotOn]}>
                <Text style={[styles.slotText, on && { color: '#fff', fontWeight: '800' }]}>{time}</Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.section}>{t('paymentMethod')}</Text>
        <View style={{ gap: 10 }}>
          {pays.map((m) => {
            const on = m.id === pay;
            return (
              <Pressable key={m.id} onPress={() => setPay(m.id)}>
                <Card style={[styles.row, on && { borderWidth: 2, borderColor: Brand.primary }]}>
                  <Ionicons name={m.icon} size={20} color={on ? Brand.primary : Brand.textSub} />
                  <Text style={[styles.rowName, { flex: 1 }]}>{m.name}</Text>
                  <View style={[styles.radio, on && styles.radioOn]}>{on && <Ionicons name="checkmark" size={12} color="#fff" />}</View>
                </Card>
              </Pressable>
            );
          })}
        </View>

        <Card style={{ marginTop: 20 }}>
          <View style={styles.feeRow}>
            <Text style={styles.feeLabel}>{t('serviceFee')}</Text>
            <Text style={styles.feeVal}>RM {price}</Text>
          </View>
          <View style={styles.feeRow}>
            <Text style={styles.feeLabel}>{t('platformDiscount')}</Text>
            <Text style={[styles.feeVal, { color: Brand.success }]}>- RM 0</Text>
          </View>
          <View style={styles.feeDivider} />
          <View style={styles.feeRow}>
            <Text style={styles.feeTotalLabel}>{t('amountDue')}</Text>
            <Text style={styles.feeTotal}>RM {price}</Text>
          </View>
        </Card>

        <View style={{ height: 20 }} />
      </ScrollView>

      <View style={styles.footer}>
        <View>
          <Text style={styles.footLabel}>{t('amountDue')}</Text>
          <Text style={styles.footPrice}>RM {price}</Text>
        </View>
        <Pressable onPress={payNow} disabled={paying}>
          <LinearGradient colors={Gradients.brand} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={[styles.cta, paying && { opacity: 0.7 }]}>
            {paying ? (
              <>
                <ActivityIndicator color="#fff" size="small" />
                <Text style={styles.ctaText}>{t('paying')}</Text>
              </>
            ) : (
              <>
                <Ionicons name="lock-closed" size={16} color="#fff" />
                <Text style={styles.ctaText}>{t('payNow')}</Text>
              </>
            )}
          </LinearGradient>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Brand.bg },
  scroll: { paddingHorizontal: 16, paddingTop: 14, paddingBottom: 16 },
  sumCard: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  sumIcon: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  sumTitle: { fontSize: 15, fontWeight: '800', color: Brand.text },
  sumSub: { fontSize: 12, color: Brand.textSub, marginTop: 3 },
  section: { fontSize: 14, fontWeight: '800', color: Brand.text, marginTop: 20, marginBottom: 10 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
  rowName: { fontSize: 14, fontWeight: '700', color: Brand.text },
  rowMeta: { fontSize: 11, color: Brand.textSub, marginTop: 3 },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: Brand.border, alignItems: 'center', justifyContent: 'center' },
  radioOn: { borderColor: Brand.primary, backgroundColor: Brand.primary },
  dateChip: { width: 72, paddingVertical: 14, borderRadius: Radius.md, backgroundColor: Brand.card, alignItems: 'center', gap: 4, ...Shadow.card },
  dateWeek: { fontSize: 11, color: Brand.textSub, fontWeight: '700', textAlign: 'center' },
  dateDay: { fontSize: 18, fontWeight: '900', color: Brand.text },
  slotGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  slot: { width: '22%', flexGrow: 1, paddingVertical: 12, borderRadius: Radius.md, backgroundColor: Brand.card, borderWidth: 1.5, borderColor: Brand.border, alignItems: 'center' },
  slotOn: { backgroundColor: Brand.primary, borderColor: Brand.primary },
  slotText: { fontSize: 14, color: Brand.text, fontWeight: '700' },
  feeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 4 },
  feeLabel: { fontSize: 13, color: Brand.textSub },
  feeVal: { fontSize: 13, fontWeight: '700', color: Brand.text },
  feeDivider: { height: 1, backgroundColor: Brand.border, marginVertical: 8 },
  feeTotalLabel: { fontSize: 14, fontWeight: '800', color: Brand.text },
  feeTotal: { fontSize: 18, fontWeight: '900', color: Brand.primary },
  footer: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingTop: 12, paddingBottom: Platform.OS === 'ios' ? 28 : 14,
    backgroundColor: Brand.card, borderTopWidth: 1, borderTopColor: Brand.border,
  },
  footLabel: { fontSize: 11, color: Brand.textSub },
  footPrice: { fontSize: 22, fontWeight: '900', color: Brand.text, marginTop: 2 },
  cta: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 32, paddingVertical: 15, borderRadius: Radius.pill, ...Shadow.soft },
  ctaText: { color: '#fff', fontSize: 16, fontWeight: '800' },
});
