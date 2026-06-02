import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Badge, Card, GradIcon } from '@/components/ui';
import { Brand, Gradients, Radius } from '@/constants/brand';
import { orders } from '@/constants/data';

const TABS = [
  { key: 'upcoming', label: '进行中' },
  { key: 'done', label: '已完成' },
] as const;

export default function OrdersScreen() {
  const [tab, setTab] = useState<'upcoming' | 'done'>('upcoming');
  const list = useMemo(() => orders.filter((o) => o.status === tab), [tab]);

  return (
    <View style={styles.root}>
      <LinearGradient colors={Gradients.hero} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.headerGrad}>
        <SafeAreaView edges={['top']}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>我的订单</Text>
          </View>
          {/* 分段控件 */}
          <View style={styles.segment}>
            {TABS.map((t) => {
              const on = t.key === tab;
              return (
                <Pressable key={t.key} style={[styles.segItem, on && styles.segItemOn]} onPress={() => setTab(t.key)}>
                  <Text style={[styles.segText, on && styles.segTextOn]}>{t.label}</Text>
                </Pressable>
              );
            })}
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {list.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="file-tray-outline" size={48} color={Brand.textSub} />
            <Text style={styles.emptyText}>暂无订单</Text>
          </View>
        ) : (
          list.map((o) => (
            <Card key={o.id} style={{ marginBottom: 12 }}>
              <View style={styles.cardTop}>
                <GradIcon icon={o.icon} grad={o.grad} size={46} iconSize={22} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.service}>{o.service}</Text>
                  <Text style={styles.outlet}>{o.outlet}</Text>
                </View>
                {o.status === 'upcoming' ? (
                  <Badge text="待到店" color={Brand.warn} soft={Brand.warnSoft} />
                ) : (
                  <Badge text="已完成" color={Brand.success} soft={Brand.successSoft} />
                )}
              </View>

              <View style={styles.divider} />

              <View style={styles.cardBottom}>
                <View style={styles.metaRow}>
                  <Ionicons name="time-outline" size={14} color={Brand.textSub} />
                  <Text style={styles.meta}>{o.date} · {o.time}</Text>
                </View>
                <Text style={styles.price}>RM {o.price}</Text>
              </View>

              <View style={styles.actions}>
                {o.status === 'upcoming' ? (
                  <>
                    <Pressable style={[styles.btn, styles.btnGhost]}>
                      <Ionicons name="calendar-outline" size={15} color={Brand.text} />
                      <Text style={styles.btnGhostText}>改期</Text>
                    </Pressable>
                    <Pressable style={[styles.btn, styles.btnPrimary]}>
                      <Ionicons name="qr-code-outline" size={15} color="#fff" />
                      <Text style={styles.btnPrimaryText}>核销二维码</Text>
                    </Pressable>
                  </>
                ) : (
                  <>
                    <Pressable style={[styles.btn, styles.btnGhost]}>
                      <Ionicons name="star-outline" size={15} color={Brand.text} />
                      <Text style={styles.btnGhostText}>评价</Text>
                    </Pressable>
                    <Pressable style={[styles.btn, styles.btnPrimary]}>
                      <Ionicons name="refresh" size={15} color="#fff" />
                      <Text style={styles.btnPrimaryText}>再次预约</Text>
                    </Pressable>
                  </>
                )}
              </View>
            </Card>
          ))
        )}
        <View style={{ height: 12 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Brand.bg },
  headerGrad: { borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  header: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 12 },
  headerTitle: { fontSize: 20, fontWeight: '900', color: '#fff' },
  segment: {
    flexDirection: 'row', marginHorizontal: 16, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: Radius.pill,
    padding: 4, marginBottom: 16,
  },
  segItem: { flex: 1, paddingVertical: 9, alignItems: 'center', borderRadius: Radius.pill },
  segItemOn: { backgroundColor: '#fff' },
  segText: { fontSize: 13, fontWeight: '700', color: 'rgba(255,255,255,0.7)' },
  segTextOn: { color: Brand.text },
  scroll: { paddingHorizontal: 16, paddingTop: 16 },
  cardTop: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  service: { fontSize: 15, fontWeight: '800', color: Brand.text },
  outlet: { fontSize: 12, color: Brand.textSub, marginTop: 3 },
  divider: { height: 1, backgroundColor: Brand.border, marginVertical: 12 },
  cardBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  meta: { fontSize: 13, color: Brand.textSub },
  price: { fontSize: 17, fontWeight: '900', color: Brand.text },
  actions: { flexDirection: 'row', gap: 10, marginTop: 14 },
  btn: { flex: 1, flexDirection: 'row', gap: 6, paddingVertical: 11, borderRadius: Radius.pill, alignItems: 'center', justifyContent: 'center' },
  btnGhost: { backgroundColor: Brand.bg },
  btnGhostText: { color: Brand.text, fontWeight: '700', fontSize: 13 },
  btnPrimary: { backgroundColor: Brand.primary },
  btnPrimaryText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  empty: { alignItems: 'center', paddingTop: 80, gap: 12 },
  emptyText: { fontSize: 15, color: Brand.textSub },
});
