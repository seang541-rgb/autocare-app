import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Badge, Card, GradIcon } from '@/components/ui';
import { Brand, Gradients, Radius, Shadow } from '@/constants/brand';
import { useI18n } from '@/store/i18n';
import { useOrders } from '@/store/orders';
import { useToast } from '@/store/toast';

export default function StaffScreen() {
  const { list, redeem } = useOrders();
  const toast = useToast();
  const { t, orderService, outletName } = useI18n();
  const todayList = useMemo(() => list.filter((o) => o.status === 'upcoming'), [list]);

  function scanOrder(id: string) {
    redeem(id);
    toast(t('redeemedToast', { id }));
  }

  return (
    <View style={styles.root}>
      <LinearGradient colors={Gradients.hero} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.headerGrad}>
        <SafeAreaView edges={['top']}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>{t('staffDesk')}</Text>
            <Text style={styles.headerSub}>{t('staffSub')}</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <Card style={styles.scanCard}>
          <LinearGradient colors={Gradients.brand} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.scanIcon}>
            <Ionicons name="scan" size={34} color="#fff" />
          </LinearGradient>
          <View style={{ flex: 1 }}>
            <Text style={styles.scanTitle}>{t('scanRedeem')}</Text>
            <Text style={styles.scanSub}>{t('staffDemo')}</Text>
          </View>
        </Card>

        <Text style={styles.section}>{t('todayBookings')}</Text>
        {todayList.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="checkmark-circle-outline" size={46} color={Brand.success} />
            <Text style={styles.emptyText}>{t('allDoneToday')}</Text>
          </View>
        ) : (
          todayList.map((o) => (
            <Card key={o.id} style={styles.orderCard}>
              <View style={styles.orderTop}>
                <GradIcon icon={o.icon} grad={o.grad} size={44} iconSize={21} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.service}>{orderService(o)}</Text>
                  <Text style={styles.meta}>{outletName(o.outletId, o.outlet)} · {o.time}</Text>
                </View>
                <Badge text={t('pendingRedeem')} color={Brand.warn} soft={Brand.warnSoft} />
              </View>
              <View style={styles.orderFoot}>
                <Text style={styles.orderId}>{o.id}</Text>
                <Pressable onPress={() => scanOrder(o.id)}>
                  <LinearGradient colors={Gradients.brand} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.cta}>
                    <Ionicons name="qr-code-outline" size={16} color="#fff" />
                    <Text style={styles.ctaText}>{t('scanDone')}</Text>
                  </LinearGradient>
                </Pressable>
              </View>
            </Card>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Brand.bg },
  headerGrad: { borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  header: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 18 },
  headerTitle: { fontSize: 20, fontWeight: '900', color: '#fff' },
  headerSub: { fontSize: 12, color: Brand.textOnDarkSub, marginTop: 3 },
  scroll: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 16 },
  scanCard: { flexDirection: 'row', alignItems: 'center', gap: 14, ...Shadow.soft },
  scanIcon: { width: 64, height: 64, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  scanTitle: { fontSize: 16, fontWeight: '900', color: Brand.text },
  scanSub: { fontSize: 12, color: Brand.textSub, marginTop: 4 },
  section: { fontSize: 14, fontWeight: '800', color: Brand.text, marginTop: 20, marginBottom: 12 },
  orderCard: { marginBottom: 12 },
  orderTop: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  service: { fontSize: 15, fontWeight: '800', color: Brand.text },
  meta: { fontSize: 12, color: Brand.textSub, marginTop: 3 },
  orderFoot: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 14 },
  orderId: { fontSize: 16, fontWeight: '900', color: Brand.text },
  cta: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 16, paddingVertical: 10, borderRadius: Radius.pill },
  ctaText: { color: '#fff', fontSize: 13, fontWeight: '800' },
  empty: { alignItems: 'center', paddingTop: 60, gap: 10 },
  emptyText: { color: Brand.textSub, fontSize: 14, fontWeight: '700' },
});
