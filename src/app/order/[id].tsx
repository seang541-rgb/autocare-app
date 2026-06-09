import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

import { BackHeader, Badge, Card, GradIcon } from '@/components/ui';
import { Brand, Gradients, Radius } from '@/constants/brand';
import { MarketplaceStatus } from '@/constants/data';
import { useI18n } from '@/store/i18n';
import { useOrders } from '@/store/orders';
import { useToast } from '@/store/toast';

const NEXT: Partial<Record<MarketplaceStatus, MarketplaceStatus>> = {
  new: 'accepted',
  accepted: 'preparing',
  preparing: 'ready',
  ready: 'completed',
};

const FLOW: MarketplaceStatus[] = ['new', 'accepted', 'preparing', 'ready', 'completed'];

export default function OrderDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getById, updateStatus, redeem } = useOrders();
  const { t, orderLineName, statusText, fulfilmentText } = useI18n();
  const toast = useToast();
  const order = getById(String(id));

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
  const done = currentOrder.status === 'completed';

  function advance() {
    const next = NEXT[currentOrder.status];
    if (!next) return;
    if (next === 'completed') redeem(currentOrder.id);
    else updateStatus(currentOrder.id, next);
    toast(t('orderUpdatedToast', { id: currentOrder.id, status: statusText(next) }));
  }

  return (
    <View style={styles.root}>
      <BackHeader title={t('orderDetail')} sub={currentOrder.id} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <Card style={styles.statusCard}>
          <View style={[styles.statusPill, done ? styles.pillDone : styles.pillWait]}>
            <Ionicons name={done ? 'checkmark-circle' : 'time'} size={15} color={done ? Brand.success : Brand.warn} />
            <Text style={[styles.statusText, { color: done ? Brand.success : Brand.warn }]}>{statusText(currentOrder.status)}</Text>
          </View>
          <View style={styles.qrWrap}>
            <QRCode value={currentOrder.qrCode} size={180} color={done ? '#C5C8D0' : Brand.ink} backgroundColor="#fff" />
            {done ? (
              <View style={styles.qrMask}>
                <Ionicons name="checkmark-circle" size={60} color={Brand.success} />
              </View>
            ) : null}
          </View>
          <Text style={styles.qrHint}>{done ? t('qrCompleted') : t('qrHintMerchant')}</Text>
        </Card>

        <Card style={{ marginTop: 14 }}>
          <View style={styles.topRow}>
            <GradIcon icon={currentOrder.icon} grad={currentOrder.grad} size={50} iconSize={24} />
            <View style={{ flex: 1 }}>
              <Text style={styles.merchant}>{currentOrder.merchantName}</Text>
              <Text style={styles.meta}>{fulfilmentText(currentOrder.type)} / {currentOrder.date} / {currentOrder.time}</Text>
            </View>
            <Badge text={currentOrder.categoryId} />
          </View>
          <View style={styles.divider} />
          {currentOrder.lines.map((line) => (
            <View key={line.itemId} style={styles.lineRow}>
              <Text style={styles.lineName}>{line.qty}x {orderLineName(line)}</Text>
              <Text style={styles.linePrice}>RM {line.qty * line.price}</Text>
            </View>
          ))}
          <View style={styles.divider} />
          <Fee label={t('subtotal')} value={`RM ${currentOrder.subtotal}`} />
          <Fee label={t('voucher')} value={`- RM ${currentOrder.discount}`} success />
          <Fee label={t('total')} value={`RM ${currentOrder.total}`} total />
          {currentOrder.note ? <Text style={styles.note}>{t('note')}: {currentOrder.note}</Text> : null}
        </Card>

        <Card style={{ marginTop: 14 }}>
          <Text style={styles.sectionTitle}>{t('merchantTimeline')}</Text>
          {FLOW.map((status) => {
            const active = FLOW.indexOf(currentOrder.status) >= FLOW.indexOf(status);
            return (
              <View key={status} style={styles.timelineRow}>
                <View style={[styles.timelineDot, active && { backgroundColor: Brand.primary }]} />
                <Text style={[styles.timelineText, active && { color: Brand.text }]}>{statusText(status)}</Text>
              </View>
            );
          })}
        </Card>

        <View style={{ height: 92 }} />
      </ScrollView>

      {!done ? (
        <View style={styles.footer}>
          <Pressable onPress={advance} disabled={!NEXT[currentOrder.status]} style={{ flex: 1 }}>
            <LinearGradient colors={Gradients.brand} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={[styles.cta, !NEXT[currentOrder.status] && { opacity: 0.5 }]}>
              <Ionicons name={currentOrder.status === 'ready' ? 'qr-code-outline' : 'arrow-forward'} size={18} color="#fff" />
              <Text style={styles.ctaText}>{currentOrder.status === 'ready' ? t('completeRedeem') : t('moveToStatus', { status: statusText(NEXT[currentOrder.status] ?? currentOrder.status) })}</Text>
            </LinearGradient>
          </Pressable>
        </View>
      ) : null}
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
  scroll: { paddingHorizontal: 16, paddingTop: 14 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  emptyText: { fontSize: 15, color: Brand.textSub },
  statusCard: { alignItems: 'center', paddingVertical: 22 },
  statusPill: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 6, borderRadius: Radius.pill },
  pillWait: { backgroundColor: Brand.warnSoft },
  pillDone: { backgroundColor: Brand.successSoft },
  statusText: { fontSize: 12, fontWeight: '900' },
  qrWrap: { marginTop: 18, padding: 14, backgroundColor: '#fff', borderRadius: Radius.lg, borderWidth: 1, borderColor: Brand.border },
  qrMask: { ...StyleSheet.absoluteFill, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.76)' },
  qrHint: { color: Brand.textSub, fontSize: 12, marginTop: 12, textAlign: 'center' },
  topRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  merchant: { color: Brand.text, fontSize: 16, fontWeight: '900' },
  meta: { color: Brand.textSub, fontSize: 12, marginTop: 4, fontWeight: '700' },
  divider: { height: 1, backgroundColor: Brand.border, marginVertical: 12 },
  lineRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 6 },
  lineName: { flex: 1, color: Brand.text, fontSize: 13, fontWeight: '800' },
  linePrice: { color: Brand.text, fontSize: 13, fontWeight: '900' },
  feeRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  feeLabel: { color: Brand.textSub, fontSize: 13 },
  feeVal: { color: Brand.text, fontSize: 13, fontWeight: '800' },
  feeTotalLabel: { color: Brand.text, fontSize: 15, fontWeight: '900' },
  feeTotal: { color: Brand.primary, fontSize: 18, fontWeight: '900' },
  note: { marginTop: 10, color: Brand.textSub, fontSize: 12, lineHeight: 17 },
  sectionTitle: { color: Brand.text, fontSize: 15, fontWeight: '900', marginBottom: 8 },
  timelineRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8 },
  timelineDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: Brand.border },
  timelineText: { color: Brand.textSub, fontSize: 13, fontWeight: '800' },
  footer: { position: 'absolute', left: 0, right: 0, bottom: 0, padding: 16, backgroundColor: Brand.card, borderTopWidth: 1, borderTopColor: Brand.border },
  cta: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 15, borderRadius: Radius.pill },
  ctaText: { color: '#fff', fontSize: 15, fontWeight: '900' },
});

