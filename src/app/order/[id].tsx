import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams } from 'expo-router';
import { ReactNode, useState } from 'react';
import { Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

import { BackHeader, Card } from '@/components/ui';
import { Brand, Gradients, Radius, Shadow } from '@/constants/brand';
import { dates, timeSlots } from '@/constants/data';
import { useI18n } from '@/store/i18n';
import { useOrders } from '@/store/orders';
import { useToast } from '@/store/toast';

export default function OrderDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getById, redeem, reschedule, addReview, addComplaint } = useOrders();
  const order = getById(String(id));
  const toast = useToast();
  const { t, orderService, outletName, dateLabel } = useI18n();
  const [confirming, setConfirming] = useState(false);
  const [reschedOpen, setReschedOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [complaintOpen, setComplaintOpen] = useState(false);
  const [rDate, setRDate] = useState(0);
  const [rSlot, setRSlot] = useState('14:30');
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState(t('defaultReview'));
  const [complaint, setComplaint] = useState(t('defaultComplaint'));

  if (!order) {
    return (
      <View style={styles.root}>
        <BackHeader title={t('orderDetail')} />
        <View style={styles.empty}>
          <Ionicons name="alert-circle-outline" size={48} color={Brand.textSub} />
          <Text style={styles.emptyText}>{t('orderMissing')}</Text>
        </View>
      </View>
    );
  }

  const currentOrder = order;
  const done = currentOrder.status === 'done';

  function applyReschedule() {
    const d = dates[rDate];
    reschedule(currentOrder.id, `2026-06-${d.day}`, rSlot);
    setReschedOpen(false);
    toast(t('rescheduledToast'));
  }

  function doRedeem() {
    setConfirming(true);
    setTimeout(() => {
      redeem(currentOrder.id);
      setConfirming(false);
      toast(t('redeemSuccessToast'));
    }, 700);
  }

  function submitReview() {
    addReview(currentOrder.id, rating, review);
    setFeedbackOpen(false);
    toast(t('reviewToast'));
  }

  function submitComplaint() {
    addComplaint(currentOrder.id, complaint);
    setComplaintOpen(false);
    toast(t('complaintToast'));
  }

  return (
    <View style={styles.root}>
      <BackHeader title={t('orderDetail')} sub={currentOrder.id} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <Card style={styles.qrCard}>
          <View style={[styles.statusPill, done ? styles.pillDone : styles.pillWait]}>
            <Ionicons name={done ? 'checkmark-circle' : 'time'} size={14} color={done ? Brand.success : Brand.warn} />
            <Text style={[styles.statusText, { color: done ? Brand.success : Brand.warn }]}>
              {done ? t('done') : t('pendingRedeemLong')}
            </Text>
          </View>

          <View style={styles.qrWrap}>
            <QRCode value={currentOrder.qrCode} size={196} color={done ? '#C5C8D0' : Brand.ink} backgroundColor="#fff" />
            {done && (
              <View style={styles.qrMask}>
                <Ionicons name="checkmark-circle" size={64} color={Brand.success} />
              </View>
            )}
          </View>

          <Text style={styles.qrCode}>{currentOrder.id}</Text>
          <Text style={styles.qrHint}>{done ? t('qrDoneHint') : t('qrVisitHint')}</Text>
        </Card>

        <Card style={{ marginTop: 14 }}>
          <View style={styles.svcTop}>
            <LinearGradient colors={Gradients[currentOrder.grad]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.svcIcon}>
              <Ionicons name={currentOrder.icon} size={22} color="#fff" />
            </LinearGradient>
            <View style={{ flex: 1 }}>
              <Text style={styles.svcName}>{orderService(currentOrder)}</Text>
              <Text style={styles.svcOutlet}>{outletName(currentOrder.outletId, currentOrder.outlet)}</Text>
            </View>
            <Text style={styles.svcPrice}>RM {currentOrder.price}</Text>
          </View>

          <View style={styles.divider} />
          <Info icon="calendar-outline" label={t('bookingTime')} value={`${currentOrder.date} · ${currentOrder.time}`} />
          <Info icon="location-outline" label={t('outlet')} value={outletName(currentOrder.outletId, currentOrder.outlet)} />
          <Info icon="card-outline" label={t('paymentStatus')} value={t('paid')} valueColor={Brand.success} />
          <Info icon="receipt-outline" label={t('orderNo')} value={currentOrder.id} />
        </Card>

        {done && (
          <Card style={{ marginTop: 14 }}>
            <Text style={styles.sectionTitle}>{t('serviceReview')}</Text>
            {currentOrder.rating ? (
              <View style={styles.reviewBox}>
                <Text style={styles.stars}>{'★'.repeat(currentOrder.rating)}{'☆'.repeat(5 - currentOrder.rating)}</Text>
                <Text style={styles.reviewText}>{currentOrder.review}</Text>
              </View>
            ) : (
              <Text style={styles.reviewText}>{t('noReviewYet')}</Text>
            )}
            {currentOrder.complaint ? <Text style={styles.complaintText}>{t('complaintRecord', { complaint: currentOrder.complaint })}</Text> : null}
          </Card>
        )}

        <View style={{ height: 20 }} />
      </ScrollView>

      {!done ? (
        <View style={styles.footer}>
          <Pressable onPress={() => setReschedOpen(true)} style={styles.reschedBtn}>
            <Ionicons name="calendar-outline" size={16} color={Brand.text} />
            <Text style={styles.reschedText}>{t('reschedule')}</Text>
          </Pressable>
          <Pressable onPress={doRedeem} disabled={confirming} style={{ flex: 1 }}>
            <LinearGradient colors={Gradients.brand} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={[styles.cta, confirming && { opacity: 0.7 }]}>
              <Ionicons name="scan" size={18} color="#fff" />
              <Text style={styles.ctaText}>{confirming ? t('redeeming') : t('simulateRedeem')}</Text>
            </LinearGradient>
          </Pressable>
        </View>
      ) : (
        <View style={styles.footer}>
          <Pressable onPress={() => setComplaintOpen(true)} style={styles.reschedBtn}>
            <Ionicons name="alert-circle-outline" size={16} color={Brand.text} />
            <Text style={styles.reschedText}>{t('complaint')}</Text>
          </Pressable>
          <Pressable onPress={() => setFeedbackOpen(true)} style={{ flex: 1 }}>
            <LinearGradient colors={Gradients.brand} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.cta}>
              <Ionicons name="star" size={18} color="#fff" />
              <Text style={styles.ctaText}>{t('rateAndComment')}</Text>
            </LinearGradient>
          </Pressable>
        </View>
      )}

      <Modal visible={reschedOpen} transparent animationType="slide" onRequestClose={() => setReschedOpen(false)}>
        <Sheet onClose={() => setReschedOpen(false)} title={t('chooseNewSlot')}>
          <Text style={styles.sheetLabel}>{t('date')}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
            {dates.map((dd, i) => {
              const on = i === rDate;
              return (
                <Pressable key={dd.day} onPress={() => setRDate(i)} style={[styles.dateChip, on && styles.dateChipOn]}>
                  <Text style={[styles.dateWeek, on && { color: '#fff' }]}>{dateLabel(dd.label, dd.week)}</Text>
                  <Text style={[styles.dateDay, on && { color: '#fff' }]}>{dd.day}</Text>
                </Pressable>
              );
            })}
          </ScrollView>
          <Text style={styles.sheetLabel}>{t('timeSlot')}</Text>
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
              <Text style={styles.ctaText}>{t('confirmReschedule')}</Text>
            </LinearGradient>
          </Pressable>
        </Sheet>
      </Modal>

      <Modal visible={feedbackOpen} transparent animationType="slide" onRequestClose={() => setFeedbackOpen(false)}>
        <Sheet onClose={() => setFeedbackOpen(false)} title={t('rateAndComment')}>
          <View style={styles.ratingRow}>
            {[1, 2, 3, 4, 5].map((n) => (
              <Pressable key={n} onPress={() => setRating(n)}>
                <Ionicons name={n <= rating ? 'star' : 'star-outline'} size={32} color={Brand.star} />
              </Pressable>
            ))}
          </View>
          <TextInput value={review} onChangeText={setReview} multiline style={styles.input} />
          <Pressable onPress={submitReview}>
            <LinearGradient colors={Gradients.brand} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.sheetCta}>
              <Text style={styles.ctaText}>{t('submitReview')}</Text>
            </LinearGradient>
          </Pressable>
        </Sheet>
      </Modal>

      <Modal visible={complaintOpen} transparent animationType="slide" onRequestClose={() => setComplaintOpen(false)}>
        <Sheet onClose={() => setComplaintOpen(false)} title={t('complaintEntry')}>
          <TextInput value={complaint} onChangeText={setComplaint} multiline style={styles.input} />
          <Pressable onPress={submitComplaint}>
            <LinearGradient colors={Gradients.brand} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.sheetCta}>
              <Text style={styles.ctaText}>{t('submitComplaint')}</Text>
            </LinearGradient>
          </Pressable>
        </Sheet>
      </Modal>
    </View>
  );
}

function Info({ icon, label, value, valueColor }: { icon: keyof typeof Ionicons.glyphMap; label: string; value: string; valueColor?: string }) {
  return (
    <View style={styles.infoRow}>
      <Ionicons name={icon} size={16} color={Brand.textSub} />
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={[styles.infoValue, valueColor && { color: valueColor }]}>{value}</Text>
    </View>
  );
}

function Sheet({ children, onClose, title }: { children: ReactNode; onClose: () => void; title: string }) {
  return (
    <Pressable style={styles.sheetBg} onPress={onClose}>
      <Pressable style={styles.sheet} onPress={() => {}}>
        <View style={styles.sheetHandle} />
        <Text style={styles.sheetTitle}>{title}</Text>
        {children}
      </Pressable>
    </Pressable>
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
  sectionTitle: { fontSize: 15, fontWeight: '900', color: Brand.text, marginBottom: 10 },
  reviewBox: { gap: 6 },
  stars: { color: Brand.star, fontSize: 18, letterSpacing: 1 },
  reviewText: { fontSize: 13, color: Brand.textSub, lineHeight: 19 },
  complaintText: { fontSize: 12, color: Brand.warn, marginTop: 10 },
  footer: { flexDirection: 'row', paddingHorizontal: 16, paddingTop: 12, paddingBottom: Platform.OS === 'ios' ? 28 : 14, backgroundColor: Brand.card, borderTopWidth: 1, borderTopColor: Brand.border },
  cta: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 15, borderRadius: Radius.pill, ...Shadow.soft },
  ctaText: { color: '#fff', fontSize: 16, fontWeight: '800' },
  reschedBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 18, paddingVertical: 15, borderRadius: Radius.pill, backgroundColor: Brand.bg, marginRight: 10 },
  reschedText: { color: Brand.text, fontSize: 14, fontWeight: '700' },
  sheetBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, paddingBottom: Platform.OS === 'ios' ? 36 : 24 },
  sheetHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: Brand.border, alignSelf: 'center', marginBottom: 16 },
  sheetTitle: { fontSize: 17, fontWeight: '900', color: Brand.text, marginBottom: 8 },
  sheetLabel: { fontSize: 13, fontWeight: '800', color: Brand.text, marginTop: 16, marginBottom: 10 },
  dateChip: { width: 60, paddingVertical: 12, borderRadius: Radius.md, backgroundColor: Brand.bg, alignItems: 'center', gap: 3 },
  dateChipOn: { backgroundColor: Brand.primary },
  dateWeek: { fontSize: 11, color: Brand.textSub, fontWeight: '700' },
  dateDay: { fontSize: 17, fontWeight: '900', color: Brand.text },
  slotGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  slot: { width: '22%', flexGrow: 1, paddingVertical: 11, borderRadius: Radius.md, backgroundColor: Brand.bg, borderWidth: 1.5, borderColor: Brand.border, alignItems: 'center' },
  slotOn: { backgroundColor: Brand.primary, borderColor: Brand.primary },
  slotText: { fontSize: 13, color: Brand.text, fontWeight: '700' },
  sheetCta: { alignItems: 'center', paddingVertical: 15, borderRadius: Radius.pill, marginTop: 14 },
  ratingRow: { flexDirection: 'row', gap: 8, marginTop: 12, marginBottom: 14 },
  input: { minHeight: 92, borderWidth: 1, borderColor: Brand.border, borderRadius: Radius.md, padding: 12, color: Brand.text, textAlignVertical: 'top' },
});
