import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BrandMark } from '@/components/brand-icons';
import { Badge, Card, GradIcon } from '@/components/ui';
import { AppBrand, Brand, Radius, Shadow } from '@/constants/brand';
import { MarketplaceStatus as OrderStatus } from '@/constants/data';
import { useI18n } from '@/store/i18n';
import { useOrders } from '@/store/orders';

const ACTIVE: OrderStatus[] = ['new', 'accepted', 'preparing', 'ready'];
const STAGES: OrderStatus[] = ['new', 'accepted', 'preparing', 'ready', 'completed'];

export default function OrdersScreen() {
  const [tab, setTab] = useState<'active' | 'completed'>('active');
  const { t, orderLineName, statusText, fulfilmentText } = useI18n();
  const { list: all } = useOrders();
  const activeCount = all.filter((order) => ACTIVE.includes(order.status)).length;
  const historyCount = all.filter((order) => ['completed', 'cancelled'].includes(order.status)).length;
  const list = useMemo(
    () => all.filter((order) => (tab === 'active' ? ACTIVE.includes(order.status) : ['completed', 'cancelled'].includes(order.status))),
    [all, tab],
  );

  return (
    <View style={styles.root}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <SafeAreaView edges={['top']}>
          <View style={styles.header}>
            <View style={styles.headerTop}>
              <BrandMark size={42} />
              <View style={{ flex: 1 }}>
                <Text style={styles.appName}>{AppBrand.name}</Text>
                <Text style={styles.headerSub}>{t('ordersSub')}</Text>
              </View>
            </View>
            <Text style={styles.headerTitle}>{t('myOrders')}</Text>
            <View style={styles.summaryRow}>
              <SummaryPill icon="radio-button-on" value={String(activeCount)} label={t('active')} />
              <SummaryPill icon="checkmark-done-outline" value={String(historyCount)} label={t('history')} />
            </View>
            <View style={styles.segment}>
              {(['active', 'completed'] as const).map((item) => {
                const on = item === tab;
                return (
                  <Pressable key={item} style={[styles.segItem, on && styles.segItemOn]} onPress={() => setTab(item)}>
                    <Text style={[styles.segText, on && styles.segTextOn]}>{item === 'active' ? t('active') : t('history')}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </SafeAreaView>

        <View style={styles.listWrap}>
          {list.length === 0 ? (
            <View style={styles.empty}>
              <Ionicons name="file-tray-outline" size={48} color={Brand.textSub} />
              <Text style={styles.emptyText}>{t('noOrdersHere')}</Text>
            </View>
          ) : (
            list.map((order) => (
              <Pressable key={order.id} onPress={() => router.push({ pathname: '/order/[id]', params: { id: order.id } })}>
                <Card style={styles.card}>
                  <View style={styles.cardTop}>
                    <GradIcon icon={order.icon} grad={order.grad} size={50} iconSize={23} />
                    <View style={{ flex: 1 }}>
                      <View style={styles.orderLineTop}>
                        <Text style={styles.merchant} numberOfLines={1}>{order.merchantName}</Text>
                        <Text style={styles.price}>RM {order.total}</Text>
                      </View>
                      <Text style={styles.items} numberOfLines={1}>{order.lines.map((line) => `${line.qty}x ${orderLineName(line)}`).join(', ')}</Text>
                    </View>
                  </View>
                  <View style={styles.progressTrack}>
                    {STAGES.map((stage) => (
                      <View key={stage} style={[styles.progressDot, stage === order.status && styles.progressDotOn]} />
                    ))}
                  </View>
                  <View style={styles.cardBottom}>
                    <View style={styles.metaRow}>
                      <Ionicons name={order.type === 'pickup' ? 'bag-check-outline' : 'calendar-outline'} size={15} color={Brand.textSub} />
                      <Text style={styles.meta}>{fulfilmentText(order.type)} / {order.date} / {order.time}</Text>
                    </View>
                    <Badge text={statusText(order.status)} color={order.status === 'completed' ? Brand.success : Brand.warn} soft={order.status === 'completed' ? Brand.successSoft : Brand.warnSoft} />
                  </View>
                </Card>
              </Pressable>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

function SummaryPill({ icon, value, label }: { icon: keyof typeof Ionicons.glyphMap; value: string; label: string }) {
  return (
    <View style={styles.summaryPill}>
      <Ionicons name={icon} size={15} color={Brand.primary} />
      <Text style={styles.summaryValue}>{value}</Text>
      <Text style={styles.summaryLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Brand.bg },
  scroll: { paddingBottom: 24 },
  header: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 8 },
  headerTop: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  appName: { color: Brand.text, fontSize: 16, fontWeight: '900' },
  headerSub: { fontSize: 12, color: Brand.textSub, marginTop: 3, lineHeight: 17 },
  headerTitle: { fontSize: 28, fontWeight: '900', color: Brand.text, marginTop: 18 },
  summaryRow: { flexDirection: 'row', gap: 10, marginTop: 14 },
  summaryPill: { flex: 1, minHeight: 72, borderRadius: 22, backgroundColor: Brand.card, borderWidth: 1, borderColor: Brand.border, alignItems: 'center', justifyContent: 'center', ...Shadow.card },
  summaryValue: { color: Brand.text, fontSize: 20, fontWeight: '900', marginTop: 3 },
  summaryLabel: { color: Brand.textSub, fontSize: 11, fontWeight: '900', marginTop: 2 },
  segment: { flexDirection: 'row', backgroundColor: Brand.card, borderRadius: Radius.pill, padding: 5, marginTop: 14, borderWidth: 1, borderColor: Brand.border },
  segItem: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: Radius.pill },
  segItemOn: { backgroundColor: Brand.primary },
  segText: { fontSize: 13, fontWeight: '900', color: Brand.textSub },
  segTextOn: { color: '#fff' },
  listWrap: { paddingHorizontal: 16, paddingTop: 10 },
  card: { marginBottom: 12, padding: 14 },
  cardTop: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  orderLineTop: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  merchant: { flex: 1, fontSize: 15, fontWeight: '900', color: Brand.text },
  items: { fontSize: 12, color: Brand.textSub, marginTop: 3 },
  progressTrack: { flexDirection: 'row', gap: 6, marginTop: 14, marginBottom: 5 },
  progressDot: { flex: 1, height: 4, borderRadius: Radius.pill, backgroundColor: Brand.border },
  progressDotOn: { backgroundColor: Brand.primary },
  cardBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8, marginTop: 10 },
  metaRow: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 5 },
  meta: { fontSize: 12, color: Brand.textSub, fontWeight: '700' },
  price: { fontSize: 16, fontWeight: '900', color: Brand.text },
  empty: { alignItems: 'center', paddingTop: 80, gap: 12 },
  emptyText: { fontSize: 15, color: Brand.textSub },
});


