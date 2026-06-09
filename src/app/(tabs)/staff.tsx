import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useMemo, useState } from 'react';
import { ImageBackground, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BrandMark } from '@/components/brand-icons';
import { Badge, Card, GradIcon } from '@/components/ui';
import { Brand, Gradients, Radius, Shadow } from '@/constants/brand';
import { MarketplaceStatus, merchants } from '@/constants/data';
import { useI18n } from '@/store/i18n';
import { useOrders } from '@/store/orders';
import { useToast } from '@/store/toast';

const NEXT: Partial<Record<MarketplaceStatus, MarketplaceStatus>> = {
  new: 'accepted',
  accepted: 'preparing',
  preparing: 'ready',
  ready: 'completed',
};

const LABEL: Record<MarketplaceStatus, string> = {
  new: 'accept',
  accepted: 'startPreparing',
  preparing: 'markReady',
  ready: 'complete',
  completed: 'completed',
  cancelled: 'cancelled',
};

type MetricKey = 'live' | 'preparing' | 'ready' | 'completed' | 'revenue';

export default function MerchantConsole() {
  const { t, orderLineName, statusText, fulfilmentText } = useI18n();
  const { list, updateStatus, redeem } = useOrders();
  const toast = useToast();
  const [open, setOpen] = useState(true);
  const [metric, setMetric] = useState<MetricKey>('live');
  const merchant = merchants[0];
  const liveOrders = useMemo(() => list.filter((order) => order.status !== 'completed' && order.status !== 'cancelled'), [list]);
  const preparingOrders = liveOrders.filter((order) => order.status === 'accepted' || order.status === 'preparing');
  const readyOrders = liveOrders.filter((order) => order.status === 'ready');
  const completedOrders = useMemo(() => list.filter((order) => order.status === 'completed'), [list]);
  const revenue = completedOrders.reduce((sum, order) => sum + order.total, 0);
  const pendingValue = liveOrders.reduce((sum, order) => sum + order.total, 0);
  const visibleOrders = metric === 'completed' || metric === 'revenue' ? completedOrders : metric === 'preparing' ? preparingOrders : metric === 'ready' ? readyOrders : liveOrders;
  const emptyLabel = metric === 'live' ? t('noActiveOrders') : t('noOrdersHere');

  function advance(id: string, status: MarketplaceStatus) {
    const next = NEXT[status];
    if (!next) return;
    if (next === 'completed') redeem(id);
    else updateStatus(id, next);
    toast(t('orderUpdatedToast', { id, status: statusText(next) }));
  }

  return (
    <View style={styles.root}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <ImageBackground source={{ uri: merchant.image }} imageStyle={styles.heroImage} style={styles.hero}>
          <LinearGradient colors={['rgba(11,18,32,0.36)', 'rgba(11,18,32,0.96)']} style={styles.heroOverlay}>
            <SafeAreaView edges={['top']}>
              <View style={styles.header}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.headerKicker}>{t('businessAccount')}</Text>
                  <Text style={styles.headerTitle}>{t('merchantConsoleTitle')}</Text>
                  <Text style={styles.headerSub}>{t('merchantConsoleSub')}</Text>
                </View>
                <Pressable onPress={() => setOpen((x) => !x)} style={styles.storeStatus} accessibilityRole="button">
                  <View style={[styles.statusDot, open ? styles.statusDotOpen : styles.statusDotClosed]} />
                  <Text style={[styles.storeStatusText, { color: open ? Brand.success : Brand.textSub }]}>{open ? t('openNow') : t('closed')}</Text>
                </Pressable>
              </View>
            </SafeAreaView>
          </LinearGradient>
        </ImageBackground>

        <View style={styles.body}>
          <Card style={styles.accountCard}>
            <BrandMark size={58} />
            <View style={{ flex: 1 }}>
              <Text style={styles.businessName}>{t('demoMerchantName')}</Text>
              <Text style={styles.businessMeta}>{merchant.name} / {merchant.area}</Text>
            </View>
            <View style={styles.qrBadge}>
              <Ionicons name="qr-code-outline" size={20} color={Brand.primary} />
            </View>
          </Card>

          <LinearGradient colors={Gradients.card} style={styles.settlementCard}>
            <View>
              <Text style={styles.settlementLabel}>{t('settlement')}</Text>
              <Text style={styles.settlementValue}>RM {revenue}</Text>
              <Text style={styles.settlementSub}>{t('revenue')} / RM {pendingValue} {t('liveOrders')}</Text>
            </View>
            <View style={styles.settlementSide}>
              <Ionicons name="shield-checkmark" size={20} color="#fff" />
              <Text style={styles.settlementSideText}>T+1</Text>
            </View>
          </LinearGradient>

          <View style={styles.quickOps}>
            <OpsTile icon="qr-code-outline" title={t('qrCounter')} value={String(readyOrders.length)} tone="orange" onPress={() => setMetric('ready')} />
            <OpsTile icon="analytics-outline" title={t('merchantInsights')} value={`${liveOrders.length}/${list.length}`} tone="blue" onPress={() => setMetric('live')} />
          </View>

          <View style={styles.metricsGrid}>
            <Metric icon="radio-button-on" label={t('liveOrders')} value={String(liveOrders.length)} selected={metric === 'live'} onPress={() => setMetric('live')} tone="orange" />
            <Metric icon="restaurant-outline" label={t('preparingOrders')} value={String(preparingOrders.length)} selected={metric === 'preparing'} onPress={() => setMetric('preparing')} tone="blue" />
            <Metric icon="bag-check-outline" label={t('readyOrders')} value={String(readyOrders.length)} selected={metric === 'ready'} onPress={() => setMetric('ready')} tone="teal" />
            <Metric icon="checkmark-done-outline" label={t('completed')} value={String(completedOrders.length)} selected={metric === 'completed'} onPress={() => setMetric('completed')} tone="green" />
          </View>

          <View style={styles.sectionRow}>
            <Text style={styles.section}>{metric === 'live' ? t('orderQueue') : t(metric === 'preparing' ? 'preparingOrders' : metric === 'ready' ? 'readyOrders' : metric === 'completed' ? 'completed' : 'revenue')}</Text>
            <Badge text={String(visibleOrders.length)} color={Brand.primary} soft={Brand.primarySoft} />
          </View>

          {visibleOrders.length === 0 ? (
            <View style={styles.empty}>
              <Ionicons name="checkmark-circle-outline" size={46} color={Brand.success} />
              <Text style={styles.emptyText}>{emptyLabel}</Text>
            </View>
          ) : (
            visibleOrders.map((order) => (
              <Card key={order.id} style={styles.orderCard}>
                <View style={styles.orderTop}>
                  <GradIcon icon={order.icon} grad={order.grad} size={48} iconSize={22} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.service}>{order.merchantName}</Text>
                    <Text style={styles.meta}>{order.lines.map((line) => `${line.qty}x ${orderLineName(line)}`).join(', ')}</Text>
                  </View>
                  <Badge text={statusText(order.status)} color={order.status === 'completed' ? Brand.success : Brand.warn} soft={order.status === 'completed' ? Brand.successSoft : Brand.warnSoft} />
                </View>
                <View style={styles.progressTrack}>
                  {(['new', 'accepted', 'preparing', 'ready', 'completed'] as MarketplaceStatus[]).map((stage) => (
                    <View key={stage} style={[styles.progressDot, stage === order.status && styles.progressDotOn]} />
                  ))}
                </View>
                <View style={styles.orderFoot}>
                  <View>
                    <Text style={styles.orderId}>{order.id}</Text>
                    <Text style={styles.total}>RM {order.total} / {fulfilmentText(order.type)}</Text>
                  </View>
                  {order.status !== 'completed' ? (
                    <Pressable disabled={!NEXT[order.status]} onPress={() => advance(order.id, order.status)} accessibilityRole="button">
                      <LinearGradient colors={Gradients.brand} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={[styles.cta, !NEXT[order.status] && { opacity: 0.5 }]}>
                        <Ionicons name={order.status === 'ready' ? 'qr-code-outline' : 'arrow-forward'} size={16} color="#fff" />
                        <Text style={styles.ctaText}>{t(LABEL[order.status])}</Text>
                      </LinearGradient>
                    </Pressable>
                  ) : null}
                </View>
              </Card>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

function OpsTile({ icon, title, value, tone, onPress }: { icon: keyof typeof Ionicons.glyphMap; title: string; value: string; tone: 'orange' | 'blue'; onPress: () => void }) {
  const color = tone === 'blue' ? Brand.blue : Brand.primary;
  const soft = tone === 'blue' ? Brand.blueSoft : Brand.primarySoft;
  return (
    <Pressable style={styles.opsTile} onPress={onPress}>
      <View style={[styles.opsIcon, { backgroundColor: soft }]}><Ionicons name={icon} size={20} color={color} /></View>
      <View style={{ flex: 1 }}>
        <Text style={styles.opsTitle}>{title}</Text>
        <Text style={styles.opsValue}>{value}</Text>
      </View>
      <Ionicons name="chevron-forward" size={17} color={Brand.textMuted} />
    </Pressable>
  );
}

function Metric({ label, value, selected, onPress, icon, tone }: { label: string; value: string; selected: boolean; onPress: () => void; icon: keyof typeof Ionicons.glyphMap; tone: 'orange' | 'blue' | 'teal' | 'green' }) {
  const color = tone === 'blue' ? Brand.blue : tone === 'teal' ? Brand.teal : tone === 'green' ? Brand.success : Brand.primary;
  const soft = tone === 'blue' ? Brand.blueSoft : tone === 'teal' ? Brand.tealSoft : tone === 'green' ? Brand.successSoft : Brand.primarySoft;
  return (
    <Pressable onPress={onPress} style={styles.metricPressable} accessibilityRole="button">
      <Card style={[styles.metric, selected && { borderColor: color, backgroundColor: soft }]}>
        <View style={[styles.metricIcon, { backgroundColor: selected ? '#fff' : soft }]}>
          <Ionicons name={icon} size={16} color={color} />
        </View>
        <Text style={[styles.metricValue, selected && { color }]}>{value}</Text>
        <Text style={[styles.metricLabel, selected && { color }]} numberOfLines={2}>{label}</Text>
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Brand.bg },
  scroll: { paddingBottom: 24 },
  hero: { minHeight: 238, borderBottomLeftRadius: 34, borderBottomRightRadius: 34, overflow: 'hidden' },
  heroImage: { borderBottomLeftRadius: 34, borderBottomRightRadius: 34 },
  heroOverlay: { flex: 1, justifyContent: 'flex-end' },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingTop: 8, paddingBottom: 28 },
  headerKicker: { color: Brand.primary, fontSize: 12, fontWeight: '900', marginBottom: 5 },
  headerTitle: { fontSize: 26, fontWeight: '900', color: '#fff' },
  headerSub: { fontSize: 12, color: Brand.textOnDarkSub, lineHeight: 17, marginTop: 4 },
  storeStatus: { flexDirection: 'row', alignItems: 'center', gap: 7, paddingHorizontal: 11, paddingVertical: 9, borderRadius: Radius.pill, backgroundColor: '#fff' },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  statusDotOpen: { backgroundColor: Brand.success },
  statusDotClosed: { backgroundColor: Brand.textMuted },
  storeStatusText: { fontSize: 12, fontWeight: '900' },
  body: { paddingHorizontal: 16, marginTop: -24 },
  accountCard: { flexDirection: 'row', alignItems: 'center', gap: 13, ...Shadow.strong },
  businessIcon: { width: 58, height: 58, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  businessName: { fontSize: 17, fontWeight: '900', color: Brand.text },
  businessMeta: { fontSize: 12, color: Brand.textSub, lineHeight: 17, marginTop: 3 },
  qrBadge: { width: 42, height: 42, borderRadius: 17, backgroundColor: Brand.primarySoft, alignItems: 'center', justifyContent: 'center' },
  settlementCard: { marginTop: 12, minHeight: 116, borderRadius: 26, padding: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', ...Shadow.soft },
  settlementLabel: { color: 'rgba(255,255,255,0.75)', fontSize: 12, fontWeight: '800' },
  settlementValue: { color: '#fff', fontSize: 31, fontWeight: '900', marginTop: 4 },
  settlementSub: { color: 'rgba(255,255,255,0.72)', fontSize: 11, fontWeight: '700', marginTop: 5 },
  settlementSide: { width: 58, height: 58, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  settlementSideText: { color: '#fff', fontSize: 11, fontWeight: '900', marginTop: 3 },
  quickOps: { flexDirection: 'row', gap: 10, marginTop: 12 },
  opsTile: { flex: 1, minHeight: 84, borderRadius: 22, backgroundColor: Brand.card, borderWidth: 1, borderColor: Brand.border, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 9, ...Shadow.card },
  opsIcon: { width: 38, height: 38, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  opsTitle: { color: Brand.textSub, fontSize: 11, fontWeight: '800' },
  opsValue: { color: Brand.text, fontSize: 19, fontWeight: '900', marginTop: 2 },
  metricsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 12 },
  metricPressable: { width: '48.5%' },
  metric: { minHeight: 106, padding: 12, justifyContent: 'space-between' },
  metricIcon: { width: 32, height: 32, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  metricValue: { color: Brand.text, fontSize: 24, fontWeight: '900', marginTop: 8 },
  metricLabel: { color: Brand.textSub, fontSize: 11, fontWeight: '900', lineHeight: 14, marginTop: 2 },
  sectionRow: { marginTop: 20, marginBottom: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  section: { fontSize: 17, fontWeight: '900', color: Brand.text },
  orderCard: { marginBottom: 12, padding: 14 },
  orderTop: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  service: { fontSize: 15, fontWeight: '900', color: Brand.text },
  meta: { fontSize: 12, color: Brand.textSub, marginTop: 3, lineHeight: 16 },
  progressTrack: { flexDirection: 'row', gap: 6, marginTop: 14, marginBottom: 4 },
  progressDot: { flex: 1, height: 4, borderRadius: Radius.pill, backgroundColor: Brand.border },
  progressDotOn: { backgroundColor: Brand.primary },
  orderFoot: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginTop: 14 },
  orderId: { fontSize: 16, fontWeight: '900', color: Brand.text },
  total: { color: Brand.textSub, fontSize: 12, fontWeight: '800', marginTop: 3 },
  cta: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 15, paddingVertical: 11, borderRadius: Radius.pill },
  ctaText: { color: '#fff', fontSize: 12, fontWeight: '900' },
  empty: { alignItems: 'center', paddingTop: 60, gap: 10 },
  emptyText: { color: Brand.textSub, fontSize: 14, fontWeight: '800' },
});



