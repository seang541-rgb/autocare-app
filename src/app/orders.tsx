import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Badge, Card } from '@/components/ui';
import { Brand, Radius } from '@/constants/brand';
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
      <SafeAreaView edges={['top']} style={{ flex: 1 }}>
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

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
          {list.length === 0 ? (
            <View style={styles.empty}>
              <Text style={{ fontSize: 44 }}>🗂️</Text>
              <Text style={styles.emptyText}>暂无订单</Text>
            </View>
          ) : (
            list.map((o) => (
              <Card key={o.id} style={{ marginBottom: 12 }}>
                <View style={styles.cardTop}>
                  <View style={styles.thumb}>
                    <Text style={{ fontSize: 24 }}>{o.emoji}</Text>
                  </View>
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
                  <Text style={styles.meta}>🕑 {o.date} · {o.time}</Text>
                  <Text style={styles.price}>RM {o.price}</Text>
                </View>

                <View style={styles.actions}>
                  {o.status === 'upcoming' ? (
                    <>
                      <Pressable style={[styles.btn, styles.btnGhost]}>
                        <Text style={styles.btnGhostText}>改期</Text>
                      </Pressable>
                      <Pressable style={[styles.btn, styles.btnPrimary]}>
                        <Text style={styles.btnPrimaryText}>查看二维码</Text>
                      </Pressable>
                    </>
                  ) : (
                    <>
                      <Pressable style={[styles.btn, styles.btnGhost]}>
                        <Text style={styles.btnGhostText}>评价</Text>
                      </Pressable>
                      <Pressable style={[styles.btn, styles.btnPrimary]}>
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
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Brand.bg },
  header: { paddingHorizontal: 16, paddingTop: 6, paddingBottom: 10 },
  headerTitle: { fontSize: 19, fontWeight: '900', color: Brand.text },
  segment: {
    flexDirection: 'row', marginHorizontal: 16, backgroundColor: Brand.card, borderRadius: Radius.pill,
    padding: 4, marginBottom: 16,
  },
  segItem: { flex: 1, paddingVertical: 9, alignItems: 'center', borderRadius: Radius.pill },
  segItemOn: { backgroundColor: Brand.primary },
  segText: { fontSize: 14, fontWeight: '700', color: Brand.textSub },
  segTextOn: { color: '#fff' },
  scroll: { paddingHorizontal: 16 },
  cardTop: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  thumb: { width: 48, height: 48, borderRadius: Radius.md, backgroundColor: Brand.bg, alignItems: 'center', justifyContent: 'center' },
  service: { fontSize: 15, fontWeight: '800', color: Brand.text },
  outlet: { fontSize: 12, color: Brand.textSub, marginTop: 3 },
  divider: { height: 1, backgroundColor: Brand.border, marginVertical: 12 },
  cardBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  meta: { fontSize: 13, color: Brand.textSub },
  price: { fontSize: 16, fontWeight: '900', color: Brand.text },
  actions: { flexDirection: 'row', gap: 10, marginTop: 14 },
  btn: { flex: 1, paddingVertical: 11, borderRadius: Radius.pill, alignItems: 'center' },
  btnGhost: { backgroundColor: Brand.bg },
  btnGhostText: { color: Brand.text, fontWeight: '700', fontSize: 14 },
  btnPrimary: { backgroundColor: Brand.primary },
  btnPrimaryText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  empty: { alignItems: 'center', paddingTop: 80, gap: 12 },
  emptyText: { fontSize: 15, color: Brand.textSub },
});
