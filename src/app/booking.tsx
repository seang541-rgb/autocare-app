import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { Alert, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Card, GradIcon } from '@/components/ui';
import { Brand, Gradients, Radius, Shadow } from '@/constants/brand';
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
      <LinearGradient colors={Gradients.hero} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.headerGrad}>
        <SafeAreaView edges={['top']}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>预约服务</Text>
            <Text style={styles.headerSub}>几步搞定，到店即享</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* 1. 服务 */}
        <Text style={styles.step}><Text style={styles.stepNo}>1</Text>  选择服务</Text>
        <View style={styles.chips}>
          {services.map((s) => {
            const on = s.id === serviceId;
            return (
              <Pressable
                key={s.id}
                onPress={() => setServiceId(s.id)}
                style={[styles.svcChip, on && styles.svcChipOn]}>
                <Ionicons name={s.icon} size={17} color={on ? '#fff' : Brand.textSub} />
                <Text style={[styles.svcChipText, on && { color: '#fff' }]}>{s.name}</Text>
              </Pressable>
            );
          })}
        </View>

        {/* 2. 门店 */}
        <Text style={styles.step}><Text style={styles.stepNo}>2</Text>  选择门店</Text>
        <View style={{ gap: 10 }}>
          {outlets.map((o) => {
            const on = o.id === outletId;
            return (
              <Pressable key={o.id} onPress={() => setOutletId(o.id)}>
                <Card style={[styles.outletRow, on && { borderWidth: 2, borderColor: Brand.primary }]}>
                  <GradIcon icon={o.icon} grad="tyre" size={44} iconSize={20} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.outletName}>{o.name}</Text>
                    <View style={styles.outletMetaRow}>
                      <Ionicons name="navigate" size={11} color={Brand.textSub} />
                      <Text style={styles.outletMeta}>{o.distanceKm}km</Text>
                      <Ionicons name="star" size={11} color={Brand.star} />
                      <Text style={styles.outletMeta}>{o.rating}</Text>
                      <Ionicons name="time-outline" size={11} color={Brand.textSub} />
                      <Text style={styles.outletMeta}>{o.open}</Text>
                    </View>
                  </View>
                  <View style={[styles.radio, on && styles.radioOn]}>
                    {on && <Ionicons name="checkmark" size={13} color="#fff" />}
                  </View>
                </Card>
              </Pressable>
            );
          })}
        </View>

        {/* 3. 日期 */}
        <Text style={styles.step}><Text style={styles.stepNo}>3</Text>  选择日期</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
          {dates.map((d, i) => {
            const on = i === dateIdx;
            return on ? (
              <Pressable key={i} onPress={() => setDateIdx(i)}>
                <LinearGradient colors={Gradients.brand} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={styles.dateChip}>
                  <Text style={[styles.dateWeek, { color: '#fff' }]}>{d.label || d.week}</Text>
                  <Text style={[styles.dateDay, { color: '#fff' }]}>{d.day}</Text>
                </LinearGradient>
              </Pressable>
            ) : (
              <Pressable key={i} onPress={() => setDateIdx(i)} style={styles.dateChip}>
                <Text style={styles.dateWeek}>{d.label || d.week}</Text>
                <Text style={styles.dateDay}>{d.day}</Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* 4. 时段 */}
        <Text style={styles.step}><Text style={styles.stepNo}>4</Text>  选择时段</Text>
        <View style={styles.slotGrid}>
          {timeSlots.map((t) => {
            const on = t === slot;
            return (
              <Pressable
                key={t}
                onPress={() => setSlot(t)}
                style={[styles.slot, on && styles.slotOn]}>
                <Text style={[styles.slotText, on && { color: '#fff', fontWeight: '800' }]}>{t}</Text>
              </Pressable>
            );
          })}
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>

      {/* 底部确认条 */}
      <View style={styles.footer}>
        <View>
          <Text style={styles.footPriceLabel}>预估金额</Text>
          <Text style={styles.footPrice}>{service.from > 0 ? `RM ${service.from}` : '免费报价'}</Text>
        </View>
        <Pressable onPress={confirm} disabled={!canBook} style={!canBook && { opacity: 0.4 }}>
          <LinearGradient colors={Gradients.brand} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.confirm}>
            <Text style={styles.confirmText}>确认预约</Text>
            <Ionicons name="arrow-forward" size={18} color="#fff" />
          </LinearGradient>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Brand.bg },
  headerGrad: { borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  header: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 18 },
  headerTitle: { fontSize: 20, fontWeight: '900', color: '#fff' },
  headerSub: { fontSize: 12, color: Brand.textOnDarkSub, marginTop: 3 },
  scroll: { paddingHorizontal: 16, paddingBottom: 20, paddingTop: 4 },
  step: { fontSize: 14, fontWeight: '800', color: Brand.text, marginTop: 20, marginBottom: 12 },
  stepNo: {
    color: Brand.primary, fontWeight: '900', fontSize: 14,
  },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  svcChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 10,
    backgroundColor: Brand.card, borderRadius: Radius.pill, borderWidth: 1.5, borderColor: Brand.border, ...Shadow.card,
  },
  svcChipOn: { backgroundColor: Brand.primary, borderColor: Brand.primary },
  svcChipText: { fontSize: 14, fontWeight: '700', color: Brand.text },
  outletRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12 },
  outletName: { fontSize: 14, fontWeight: '800', color: Brand.text },
  outletMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 5, flexWrap: 'wrap' },
  outletMeta: { fontSize: 11, color: Brand.textSub, marginRight: 6 },
  radio: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: Brand.border, alignItems: 'center', justifyContent: 'center' },
  radioOn: { borderColor: Brand.primary, backgroundColor: Brand.primary },
  dateChip: {
    width: 62, paddingVertical: 14, borderRadius: Radius.md, backgroundColor: Brand.card,
    alignItems: 'center', gap: 4, ...Shadow.card,
  },
  dateWeek: { fontSize: 11, color: Brand.textSub, fontWeight: '700' },
  dateDay: { fontSize: 18, fontWeight: '900', color: Brand.text },
  slotGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  slot: {
    width: '22%', flexGrow: 1, paddingVertical: 12, borderRadius: Radius.md, backgroundColor: Brand.card,
    borderWidth: 1.5, borderColor: Brand.border, alignItems: 'center',
  },
  slotOn: { backgroundColor: Brand.primary, borderColor: Brand.primary },
  slotText: { fontSize: 14, color: Brand.text, fontWeight: '700' },
  footer: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingTop: 12, paddingBottom: Platform.OS === 'ios' ? 28 : 14,
    backgroundColor: Brand.card, borderTopWidth: 1, borderTopColor: Brand.border,
  },
  footPriceLabel: { fontSize: 11, color: Brand.textSub },
  footPrice: { fontSize: 20, fontWeight: '900', color: Brand.text, marginTop: 2 },
  confirm: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 32, paddingVertical: 15, borderRadius: Radius.pill, ...Shadow.soft },
  confirmText: { color: '#fff', fontSize: 16, fontWeight: '800' },
});
