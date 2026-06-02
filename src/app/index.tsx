import { router } from 'expo-router';
import { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Badge, Card, SectionTitle, Stars } from '@/components/ui';
import { Brand, Radius } from '@/constants/brand';
import { outlets, profile, promos, services } from '@/constants/data';

export default function HomeScreen() {
  const [notifOpen, setNotifOpen] = useState(false);

  return (
    <View style={styles.root}>
      {/* 深色头部区，解决"太白太素" + 顶部安全区 */}
      <SafeAreaView edges={['top']} style={styles.headerArea}>
        <View style={styles.topBar}>
          <View style={{ flex: 1 }}>
            <Text style={styles.locLabel}>当前位置 📍</Text>
            <Text style={styles.locValue}>Kepong, Kuala Lumpur ▾</Text>
          </View>
          <Pressable style={styles.bell} onPress={() => setNotifOpen(true)} hitSlop={8}>
            <Text style={{ fontSize: 16 }}>🔔</Text>
            <View style={styles.dot} />
          </Pressable>
        </View>

        <Text style={styles.hello}>嗨，{profile.name} 👋</Text>
        <Text style={styles.subHello}>今天想为爱车做点什么？</Text>

        <Pressable style={styles.search} onPress={() => {}}>
          <Text style={{ fontSize: 14 }}>🔍</Text>
          <Text style={styles.searchPh}>搜索服务、门店或套餐</Text>
        </Pressable>
      </SafeAreaView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* 促销 Banner */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 10, paddingHorizontal: 14 }}>
          {promos.map((p) => (
            <View key={p.id} style={[styles.promo, { backgroundColor: p.from }]}>
              <View style={styles.promoTag}>
                <Text style={styles.promoTagText}>{p.tag}</Text>
              </View>
              <Text style={styles.promoTitle}>{p.title}</Text>
              <Text style={styles.promoSub}>{p.sub}</Text>
            </View>
          ))}
        </ScrollView>

        <View style={styles.body}>
          {/* 服务宫格 */}
          <SectionTitle title="选择服务" />
          <View style={styles.grid}>
            {services.map((s) => (
              <Pressable key={s.id} style={styles.tile} onPress={() => router.push('/booking')}>
                <View style={[styles.tileIcon, { backgroundColor: s.soft }]}>
                  <Text style={{ fontSize: 22 }}>{s.emoji}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.tileName}>{s.name}</Text>
                  <Text style={styles.tileBrand}>{s.brand}</Text>
                </View>
                <Text style={[styles.tileFrom, { color: s.color }]}>
                  {s.from > 0 ? `RM${s.from} 起` : '免费报价'}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* 我的套餐 */}
          <Card style={styles.pkg}>
            <View style={styles.pkgRow}>
              <View>
                <Text style={styles.pkgLabel}>我的套餐</Text>
                <Text style={styles.pkgName}>{profile.packageName}</Text>
              </View>
              <Badge text="生效中" color={Brand.success} soft={Brand.successSoft} />
            </View>
            <View style={styles.pkgBarBg}>
              <View style={[styles.pkgBarFill, { width: `${(profile.packageLeft / profile.packageTotal) * 100}%` }]} />
            </View>
            <Text style={styles.pkgLeft}>
              本月还可洗 <Text style={{ color: Brand.primary, fontWeight: '800' }}>{profile.packageLeft}</Text>/
              {profile.packageTotal} 次
            </Text>
          </Card>

          {/* 附近门店 */}
          <View style={{ marginTop: 16 }}>
            <SectionTitle title="附近门店" action="查看全部" />
          </View>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10, paddingHorizontal: 14 }}>
          {outlets.map((o) => (
            <Card key={o.id} style={styles.outlet}>
              <View style={styles.outletThumb}>
                <Text style={{ fontSize: 26 }}>{o.emoji}</Text>
              </View>
              <Text style={styles.outletName} numberOfLines={1}>{o.name}</Text>
              <Text style={styles.outletArea}>📍 {o.area} · {o.distanceKm} km</Text>
              <View style={styles.outletFoot}>
                <Stars rating={o.rating} />
                <Text style={styles.outletReviews}>({o.reviews})</Text>
              </View>
            </Card>
          ))}
        </ScrollView>

        <View style={{ height: 16 }} />
      </ScrollView>

      {/* 通知弹窗 */}
      <Modal visible={notifOpen} transparent animationType="fade" onRequestClose={() => setNotifOpen(false)}>
        <Pressable style={styles.modalBg} onPress={() => setNotifOpen(false)}>
          <Pressable style={styles.modalCard} onPress={() => {}}>
            <View style={styles.modalHead}>
              <Text style={styles.modalTitle}>🔔 通知</Text>
              <Pressable onPress={() => setNotifOpen(false)} hitSlop={8}>
                <Text style={styles.modalClose}>✕</Text>
              </Pressable>
            </View>
            <View style={styles.notifItem}>
              <Text style={styles.notifEmoji}>💧</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.notifTitle}>预约提醒</Text>
                <Text style={styles.notifSub}>明天 14:30 甲洞旗舰店洗车，记得到店</Text>
              </View>
            </View>
            <View style={styles.notifItem}>
              <Text style={styles.notifEmoji}>🎁</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.notifTitle}>优惠到账</Text>
                <Text style={styles.notifSub}>新增 1 张 RM10 镀膜券，7 天内有效</Text>
              </View>
            </View>
            <View style={[styles.notifItem, { borderBottomWidth: 0 }]}>
              <Text style={styles.notifEmoji}>🛡️</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.notifTitle}>车险将到期</Text>
                <Text style={styles.notifSub}>保单 30 天后到期，点此比价续保</Text>
              </View>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Brand.bg },
  headerArea: { backgroundColor: Brand.navy, paddingHorizontal: 16, paddingBottom: 16 },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 6 },
  locLabel: { fontSize: 10, color: 'rgba(255,255,255,0.55)' },
  locValue: { fontSize: 13, fontWeight: '700', color: '#fff', marginTop: 1 },
  bell: { width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(255,255,255,0.12)', alignItems: 'center', justifyContent: 'center' },
  dot: { position: 'absolute', top: 9, right: 10, width: 7, height: 7, borderRadius: 4, backgroundColor: Brand.primary },
  hello: { fontSize: 19, fontWeight: '900', color: '#fff', marginTop: 14 },
  subHello: { fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 2 },
  search: {
    flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#fff',
    borderRadius: Radius.pill, paddingHorizontal: 14, paddingVertical: 11, marginTop: 14,
  },
  searchPh: { color: Brand.textSub, fontSize: 13 },
  scroll: { paddingTop: 14 },
  body: { paddingHorizontal: 16 },
  promo: { width: 250, borderRadius: Radius.lg, padding: 15, justifyContent: 'center', minHeight: 96 },
  promoTag: { alignSelf: 'flex-start', backgroundColor: 'rgba(255,255,255,0.22)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: Radius.pill, marginBottom: 8 },
  promoTagText: { color: '#fff', fontSize: 10, fontWeight: '700' },
  promoTitle: { color: '#fff', fontSize: 19, fontWeight: '900' },
  promoSub: { color: 'rgba(255,255,255,0.9)', fontSize: 12, marginTop: 3 },
  grid: { gap: 8 },
  tile: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: Brand.card, borderRadius: Radius.md, padding: 12 },
  tileIcon: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  tileName: { fontSize: 15, fontWeight: '800', color: Brand.text },
  tileBrand: { fontSize: 11, color: Brand.textSub, marginTop: 1 },
  tileFrom: { fontSize: 13, fontWeight: '800' },
  pkg: { marginTop: 14, backgroundColor: Brand.navy, padding: 14 },
  pkgRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  pkgLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 11 },
  pkgName: { color: '#fff', fontSize: 16, fontWeight: '800', marginTop: 1 },
  pkgBarBg: { height: 7, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.15)', marginTop: 12, overflow: 'hidden' },
  pkgBarFill: { height: 7, borderRadius: 4, backgroundColor: Brand.primary },
  pkgLeft: { color: 'rgba(255,255,255,0.85)', fontSize: 12, marginTop: 8 },
  outlet: { width: 170, padding: 10 },
  outletThumb: { height: 70, borderRadius: Radius.md, backgroundColor: Brand.bg, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  outletName: { fontSize: 13, fontWeight: '800', color: Brand.text },
  outletArea: { fontSize: 11, color: Brand.textSub, marginTop: 3 },
  outletFoot: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6 },
  outletReviews: { fontSize: 11, color: Brand.textSub },
  // modal
  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'center', paddingHorizontal: 24 },
  modalCard: { backgroundColor: '#fff', borderRadius: Radius.lg, padding: 16 },
  modalHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  modalTitle: { fontSize: 16, fontWeight: '900', color: Brand.text },
  modalClose: { fontSize: 16, color: Brand.textSub },
  notifItem: { flexDirection: 'row', gap: 10, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: Brand.border },
  notifEmoji: { fontSize: 20 },
  notifTitle: { fontSize: 13, fontWeight: '700', color: Brand.text },
  notifSub: { fontSize: 12, color: Brand.textSub, marginTop: 2 },
});
