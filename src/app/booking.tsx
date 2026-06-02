import { useState } from 'react';
import { Alert, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Card } from '@/components/ui';
import { Brand, Radius } from '@/constants/brand';
import { dates, outlets, services, timeSlots } from '@/constants/data';

export default function BookingScreen() {
  const [serviceId, setServiceId] = useState(services[0].id);
  const [outletId, setOutletId] = useState(outlets[0].id);
  const [dateIdx, setDateIdx] = useState(0);
  const [slot, setSlot] = useState<string | null>('14:30');

  const service = services.find((s) => s.id === serviceId)!;
  const canBook = !!slot;

  function confirm() {
    const d = dates[dateIdx];
    const msg = `${service.name} · ${service.brand}\n${outlets.find((o) => o.id === outletId)!.name}\n6月${d.day}日 ${d.week} ${slot}\n金额：RM${service.from || '—'}`;
    if (Platform.OS === 'web') {
      // eslint-disable-next-line no-alert
      window.alert('预约成功 ✅\n\n' + msg);
    } else {
      Alert.alert('预约成功 ✅', msg, [{ text: '好的' }]);
    }
  }

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']} style={{ flex: 1 }}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>预约服务</Text>
          <Text style={styles.headerSub}>几步搞定，到店即享</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
          {/* 1. 服务 */}
          <Text style={styles.step}>1 · 选择服务</Text>
          <View style={styles.chips}>
            {services.map((s) => {
              const on = s.id === serviceId;
              return (
                <Pressable
                  key={s.id}
                  onPress={() => setServiceId(s.id)}
                  style={[styles.svcChip, on && { borderColor: Brand.primary, backgroundColor: Brand.primarySoft }]}>
                  <Text style={{ fontSize: 18 }}>{s.emoji}</Text>
                  <Text style={[styles.svcChipText, on && { color: Brand.primaryDark }]}>{s.name}</Text>
                </Pressable>
              );
            })}
          </View>

          {/* 2. 门店 */}
          <Text style={styles.step}>2 · 选择门店</Text>
          <View style={{ gap: 10 }}>
            {outlets.map((o) => {
              const on = o.id === outletId;
              return (
                <Pressable key={o.id} onPress={() => setOutletId(o.id)}>
                  <Card style={[styles.outletRow, on && { borderWidth: 2, borderColor: Brand.primary }]}>
                    <Text style={{ fontSize: 26 }}>{o.emoji}</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.outletName}>{o.name}</Text>
                      <Text style={styles.outletMeta}>📍 {o.distanceKm} km · ⭐ {o.rating} · {o.open}</Text>
                    </View>
                    <View style={[styles.radio, on && styles.radioOn]}>{on && <View style={styles.radioInner} />}</View>
                  </Card>
                </Pressable>
              );
            })}
          </View>

          {/* 3. 日期 */}
          <Text style={styles.step}>3 · 选择日期</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
            {dates.map((d, i) => {
              const on = i === dateIdx;
              return (
                <Pressable
                  key={i}
                  onPress={() => setDateIdx(i)}
                  style={[styles.dateChip, on && { backgroundColor: Brand.primary }]}>
                  <Text style={[styles.dateWeek, on && { color: '#fff' }]}>{d.label || d.week}</Text>
                  <Text style={[styles.dateDay, on && { color: '#fff' }]}>{d.day}</Text>
                </Pressable>
              );
            })}
          </ScrollView>

          {/* 4. 时段 */}
          <Text style={styles.step}>4 · 选择时段</Text>
          <View style={styles.slotGrid}>
            {timeSlots.map((t) => {
              const on = t === slot;
              return (
                <Pressable
                  key={t}
                  onPress={() => setSlot(t)}
                  style={[styles.slot, on && { borderColor: Brand.primary, backgroundColor: Brand.primarySoft }]}>
                  <Text style={[styles.slotText, on && { color: Brand.primaryDark, fontWeight: '800' }]}>{t}</Text>
                </Pressable>
              );
            })}
          </View>

          <View style={{ height: 16 }} />
        </ScrollView>

        {/* 底部确认条 */}
        <View style={styles.footer}>
          <View>
            <Text style={styles.footPriceLabel}>预估金额</Text>
            <Text style={styles.footPrice}>{service.from > 0 ? `RM ${service.from}` : '免费报价'}</Text>
          </View>
          <Pressable
            onPress={confirm}
            disabled={!canBook}
            style={[styles.confirm, !canBook && { opacity: 0.4 }]}>
            <Text style={styles.confirmText}>确认预约</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Brand.bg },
  header: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 4 },
  headerTitle: { fontSize: 24, fontWeight: '900', color: Brand.text },
  headerSub: { fontSize: 13, color: Brand.textSub, marginTop: 2 },
  scroll: { paddingHorizontal: 16, paddingBottom: 24 },
  step: { fontSize: 15, fontWeight: '800', color: Brand.text, marginTop: 22, marginBottom: 12 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  svcChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 10,
    backgroundColor: Brand.card, borderRadius: Radius.pill, borderWidth: 1.5, borderColor: Brand.border,
  },
  svcChipText: { fontSize: 14, fontWeight: '600', color: Brand.text },
  outletRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
  outletName: { fontSize: 15, fontWeight: '700', color: Brand.text },
  outletMeta: { fontSize: 12, color: Brand.textSub, marginTop: 4 },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: Brand.border, alignItems: 'center', justifyContent: 'center' },
  radioOn: { borderColor: Brand.primary },
  radioInner: { width: 11, height: 11, borderRadius: 6, backgroundColor: Brand.primary },
  dateChip: {
    width: 60, paddingVertical: 14, borderRadius: Radius.md, backgroundColor: Brand.card,
    alignItems: 'center', gap: 4,
  },
  dateWeek: { fontSize: 12, color: Brand.textSub, fontWeight: '600' },
  dateDay: { fontSize: 18, fontWeight: '900', color: Brand.text },
  slotGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  slot: {
    width: '22%', flexGrow: 1, paddingVertical: 12, borderRadius: Radius.md, backgroundColor: Brand.card,
    borderWidth: 1.5, borderColor: Brand.border, alignItems: 'center',
  },
  slotText: { fontSize: 14, color: Brand.text, fontWeight: '600' },
  footer: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingTop: 12, paddingBottom: Platform.OS === 'ios' ? 28 : 14,
    backgroundColor: Brand.card, borderTopWidth: 1, borderTopColor: Brand.border,
  },
  footPriceLabel: { fontSize: 11, color: Brand.textSub },
  footPrice: { fontSize: 20, fontWeight: '900', color: Brand.text, marginTop: 2 },
  confirm: { backgroundColor: Brand.primary, paddingHorizontal: 36, paddingVertical: 15, borderRadius: Radius.pill },
  confirmText: { color: '#fff', fontSize: 16, fontWeight: '800' },
});
