import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { BackHeader, Badge, Card } from '@/components/ui';
import { Brand, Gradients, Radius } from '@/constants/brand';
import { CouponStatus, useAccount } from '@/store/account';
import { useI18n } from '@/store/i18n';

const FILTERS: (CouponStatus | 'all')[] = ['usable', 'used', 'expired'];

export default function CouponsPage() {
  const { coupons } = useAccount();
  const { t } = useI18n();
  const [filter, setFilter] = useState<CouponStatus | 'all'>('usable');
  const visible = filter === 'all' ? coupons : coupons.filter((coupon) => coupon.status === filter);

  return (
    <View style={styles.root}>
      <BackHeader title={t('coupons')} sub={t('couponSub')} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={styles.segment}>
          {FILTERS.map((item) => {
            const on = filter === item;
            return (
              <Pressable key={item} onPress={() => setFilter(item)} style={[styles.segBtn, on && styles.segBtnOn]}>
                <Text style={[styles.segText, on && styles.segTextOn]}>{t(item)}</Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.list}>
          {visible.length === 0 ? (
            <Card style={styles.empty}>
              <Ionicons name="ticket-outline" size={34} color={Brand.textSub} />
              <Text style={styles.emptyText}>{t('noCoupons')}</Text>
            </Card>
          ) : (
            visible.map((coupon) => (
              <Card key={coupon.id} style={styles.coupon}>
                <View style={styles.leftRail}>
                  <LinearGradient colors={coupon.status === 'usable' ? Gradients.brand : Gradients.card} style={styles.ticketIcon}>
                    <Ionicons name="ticket" size={22} color="#fff" />
                  </LinearGradient>
                </View>
                <View style={{ flex: 1 }}>
                  <View style={styles.topRow}>
                    <Text style={styles.title}>{coupon.title}</Text>
                    <Badge
                      text={t(coupon.status)}
                      color={coupon.status === 'usable' ? Brand.success : coupon.status === 'used' ? Brand.textSub : Brand.warn}
                      soft={coupon.status === 'usable' ? Brand.successSoft : coupon.status === 'used' ? Brand.bg : Brand.warnSoft}
                    />
                  </View>
                  <Text style={styles.discount}>{coupon.discount}</Text>
                  <Text style={styles.expiry}>{t('date')}: {coupon.expiresAt}</Text>
                  <View style={styles.ruleBox}>
                    <Text style={styles.ruleLabel}>{t('couponRule')}</Text>
                    <Text style={styles.rule}>{coupon.rule}</Text>
                  </View>
                </View>
              </Card>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Brand.bg },
  scroll: { padding: 16, paddingBottom: 26 },
  segment: { flexDirection: 'row', gap: 8, backgroundColor: Brand.border, borderRadius: Radius.pill, padding: 4 },
  segBtn: { flex: 1, alignItems: 'center', paddingVertical: 10, borderRadius: Radius.pill },
  segBtnOn: { backgroundColor: Brand.card },
  segText: { fontSize: 12, color: Brand.textSub, fontWeight: '800' },
  segTextOn: { color: Brand.text },
  list: { gap: 12, marginTop: 14 },
  coupon: { flexDirection: 'row', gap: 12, overflow: 'hidden' },
  leftRail: { justifyContent: 'center' },
  ticketIcon: { width: 46, height: 46, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 },
  title: { flex: 1, fontSize: 15, fontWeight: '900', color: Brand.text },
  discount: { fontSize: 22, fontWeight: '900', color: Brand.primary, marginTop: 8 },
  expiry: { fontSize: 12, color: Brand.textSub, marginTop: 2 },
  ruleBox: { marginTop: 12, padding: 10, borderRadius: Radius.md, backgroundColor: Brand.cardAlt },
  ruleLabel: { fontSize: 11, fontWeight: '900', color: Brand.text },
  rule: { fontSize: 12, color: Brand.textSub, marginTop: 4, lineHeight: 17 },
  empty: { alignItems: 'center', gap: 8, paddingVertical: 30 },
  emptyText: { color: Brand.textSub, fontSize: 13, fontWeight: '700' },
});
