import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Modal, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

import { BackHeader, Card } from '@/components/ui';
import { Brand, Gradients, Radius, Shadow } from '@/constants/brand';
import { dates, timeSlots } from '@/constants/data';
import { useOrders } from '@/store/orders';
import { useToast } from '@/store/toast';

export default function OrderDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getById, redeem, reschedule } = useOrders();
  const order = getById(String(id));
  const toast = useToast();
  const [confirming, setConfirming] = useState(false);
  const [reschedOpen, setReschedOpen] = useState(false);
  const [rDate, setRDate] = useState(0);
  const [rSlot, setRSlot] = useState('14:30');

  function applyReschedule() {
    const d = dates[rDate];
    reschedule(String(id), `2026-06-${d.day}`, rSlot);
    setReschedOpen(false);
    toast('改期成功');
  }

  if (!order) {
    return (
      <View style={styles.root}>
        <BackHeader title="订单详情" />
        <View style={styles.empty}>
          <Ionicons name="alert-circle-outline" size={48} color={Brand.textSub} />
          <Text style={styles.emptyText}>订单不存在</Text>
        </View>
      </View>
    );
  }

  const done = order.status === 'done';

  function doRedeem() {
    setConfirming(true);
    setTimeout(() => {
      redeem(order!.id);
      setConfirming(false);
    }, 900);
  }

  return (
    <View style={styles.root}>
      <BackHeader title="订单详情" sub={order.id} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* 二维码卡 —— 核心 */}
        <Card style={styles.qrCard}>
          <View style={[styles.statusPill, done ? styles.pillDone : styles.pillWait]}>
            <Ionicons name={done ? 'checkmark-circle' : 'time'} size={14} color={done ? Brand.success : Brand.warn} />
            <Text style={[styles.statusText, { color: done ? Brand.success : Brand.warn }]}>
              {done ? '已核销完成' : '待到店核销'}
            </Text>
          </View>

          <View style={styles.qrWrap}>
            <QRCode value={order.qrCode} size={196} color={done ? '#C5C8D0' : Brand.ink} backgroundColor="#fff" />
            {done && (
              <View style={styles.qrMask}>
                <Ionicons name="checkmark-circle" size={64} color={Brand.success} />
              </View>
            )}
          </View>

          <Text style={styles.qrCode}>{order.id}</Text>
          <Text style={styles.qrHint}>{done ? '本订单已完成服务' : '到店向员工出示此二维码'}</Text>
        </Card>

        {/* 服务信息 */}
        <Card style={{ marginTop: 14 }}>
          <View style={styles.svcTop}>
            <LinearGradient colors={Gradients[order.grad]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.svcIcon}>
              <Ionicons name={order.icon} size={22} color="#fff" />
            </LinearGradient>
            <View style={{ flex: 1 }}>
              <Text style={styles.svcName}>{order.service}</Text>
              <Text style={styles.svcOutlet}>{order.outlet}</Text>
            </View>
            <Text style={styles.svcPrice}>RM {order.price}</Text>
          </View>

          <View style={styles.divider} />

          <Info icon="calendar-outline" label="预约时间" value={`${order.date} · ${order.time}`} />
          <Info icon="location-outline" label="门店" value={order.outlet} />
          <Info icon="card-outline" label="支付状态" value="已支付" valueColor={Brand.success} />
          <Info icon="receipt-outline" label="订单号" value={order.id} />
        </Card>

        <View style={{ height: 20 }} />
      </ScrollView>

      {/* 底部：改期 + 模拟核销（DEMO 用，展示闭环） */}
      {!done && (
        <View style={styles.footer}>
          <Pressable onPress={() => setReschedOpen(true)} style={styles.reschedBtn}>
            <Ionicons name="calendar-outline" size={16} color={Brand.text} />
            <Text style={styles.reschedText}>改期</Text>
          </Pressable>
          <Pressable onPress={doRedeem} disabled={confirming} style={{ flex: 1 }}>
            <LinearGradient colors={Gradients.brand} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={[styles.cta, confirming && { opacity: 0.7 }]}>
              <Ionicons name="scan" size={18} color="#fff" />
              <Text style={styles.ctaText}>{confirming ? '核销中…' : '模拟扫码核销'}</Text>
            </LinearGradient>
          </Pressable>
        </View>
      )}
      {done && (
        <View style={styles.footer}>
          <Pressable onPress={() => router.replace('/(tabs)/orders')} style={{ flex: 1 }}>
            <View style={styles.ctaGhost}>
              <Text style={styles.ctaGhostText}>返回订单列表</Text>
            </View>
          </Pressable>
        </View>
      )}

      {/* 改期弹窗 */}
      <Modal visible={reschedOpen} transparent animationType="slide" onRequestClose={() => setReschedOpen(false)}>
        <Pressable style={styles.sheetBg} onPress={() => setReschedOpen(false)}>
          <Pressable style={styles.sheet} onPress={() => {}}>
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitle}>选择新的日期与时段</Text>

            <Text style={styles.sheetLabel}>日期</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
              {dates.map((dd, i) => {
                const on = i === rDate;
                return on ? (
                  <Pressable key={i} onPress={() => setRDate(i)}>
                    <LinearGradient colors={Gradients.brand} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={styles.dateChip}>
                      <Text style={[styles.dateWeek, { color: '#fff' }]}>{dd.label || dd.week}</Text>
                      <Text style={[styles.dateDay, { color: '#fff' }]}>{dd.day}</Text>
                    </LinearGradient>
                  </Pressable>
                ) : (
                  <Pressable key={i} onPress={() => setRDate(i)} style={styles.dateChip}>
                    <Text style={styles.dateWeek}>{dd.label || dd.week}</Text>
                    <Text style={styles.dateDay}>{dd.day}</Text>
                  </Pressable>
                );
              })}
            </ScrollView>

            <Text style={styles.sheetLabel}>时段</Text>
            <View style={styles.slotGrid}>
              {timeSlots.map((t) => {
                const on = t === rSlot;
                return (
                  <Pressable key={t} onPress={() => setRSlot(t)} style={[styles.slot, on && styles.slotOn]}>
                    <Text style={[styles.slotText, on && { color: '#fff', fontWeight: '800' }]}>{t}</Text>
                  </Pressable>
                );
              })}
            </View>

            <Pressable onPress={applyReschedule} style={{ marginTop: 18 }}>
              <LinearGradient colors={Gradients.brand} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.sheetCta}>
                <Text style={styles.ctaText}>确认改期</Text>
              </LinearGradient>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

function Info({ icon, label, value, valueColor }: { icon: any; label: string; value: string; valueColor?: string }) {
  return (
    <View style={styles.infoRow}>
      <Ionicons name={icon} size={16} color={Brand.textSub} />
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={[styles.infoValue, valueColor && { color: valueColor }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Brand.bg },
  scroll: { paddingHorizontal: 16, paddingTop: 14, paddingBottom: 16 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  emptyText: { fontSize: 15, color: Brand.textSub },
  qrCard: { alignItems: 'center', paddingVertical: 22 },
  statusPill: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 12, paddingVertical: 5, borderRadius: Radius.pill },
  pillWait: { backgroundColor: Brand.warnSoft },
  pillDone: { backgroundColor: Brand.successSoft },
  statusText: { fontSize: 12, fontWeight: '800' },
  qrWrap: { marginTop: 20, padding: 14, backgroundColor: '#fff', borderRadius: Radius.md, borderWidth: 1, borderColor: Brand.border, alignItems: 'center', justifyContent: 'center' },
  qrMask: { ...StyleSheet.absoluteFill, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.82)' },
  qrCode: { fontSize: 20, fontWeight: '900', color: Brand.text, marginTop: 18, letterSpacing: 1 },
  qrHint: { fontSize: 12, color: Brand.textSub, marginTop: 6 },
  svcTop: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  svcIcon: { width: 46, height: 46, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  svcName: { fontSize: 15, fontWeight: '800', color: Brand.text },
  svcOutlet: { fontSize: 12, color: Brand.textSub, marginTop: 3 },
  svcPrice: { fontSize: 16, fontWeight: '900', color: Brand.text },
  divider: { height: 1, backgroundColor: Brand.border, marginVertical: 14 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 7 },
  infoLabel: { fontSize: 13, color: Brand.textSub, width: 70 },
  infoValue: { flex: 1, fontSize: 13, fontWeight: '700', color: Brand.text, textAlign: 'right' },
  footer: {
    flexDirection: 'row', paddingHorizontal: 16, paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 28 : 14, backgroundColor: Brand.card, borderTopWidth: 1, borderTopColor: Brand.border,
  },
  cta: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 15, borderRadius: Radius.pill, ...Shadow.soft },
  ctaText: { color: '#fff', fontSize: 16, fontWeight: '800' },
  ctaGhost: { alignItems: 'center', paddingVertical: 15, borderRadius: Radius.pill, backgroundColor: Brand.bg },
  ctaGhostText: { color: Brand.text, fontSize: 15, fontWeight: '700' },
  reschedBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 18, paddingVertical: 15, borderRadius: Radius.pill, backgroundColor: Brand.bg, marginRight: 10 },
  reschedText: { color: Brand.text, fontSize: 14, fontWeight: '700' },
  // 改期弹窗
  sheetBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, paddingBottom: Platform.OS === 'ios' ? 36 : 24 },
  sheetHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: Brand.border, alignSelf: 'center', marginBottom: 16 },
  sheetTitle: { fontSize: 17, fontWeight: '900', color: Brand.text, marginBottom: 8 },
  sheetLabel: { fontSize: 13, fontWeight: '800', color: Brand.text, marginTop: 16, marginBottom: 10 },
  dateChip: { width: 60, paddingVertical: 12, borderRadius: Radius.md, backgroundColor: Brand.bg, alignItems: 'center', gap: 3 },
  dateWeek: { fontSize: 11, color: Brand.textSub, fontWeight: '700' },
  dateDay: { fontSize: 17, fontWeight: '900', color: Brand.text },
  slotGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  slot: { width: '22%', flexGrow: 1, paddingVertical: 11, borderRadius: Radius.md, backgroundColor: Brand.bg, borderWidth: 1.5, borderColor: Brand.border, alignItems: 'center' },
  slotOn: { backgroundColor: Brand.primary, borderColor: Brand.primary },
  slotText: { fontSize: 13, color: Brand.text, fontWeight: '700' },
  sheetCta: { alignItems: 'center', paddingVertical: 15, borderRadius: Radius.pill },
});
