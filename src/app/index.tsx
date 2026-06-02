import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Badge, Card, SectionTitle, Stars } from '@/components/ui';
import { Brand, Radius } from '@/constants/brand';
import { outlets, profile, promos, services } from '@/constants/data';

export default function HomeScreen() {
  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']} style={styles.safe}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
          {/* 顶部：位置 + 通知 */}
          <View style={styles.topBar}>
            <View>
              <Text style={styles.locLabel}>当前位置 📍</Text>
              <Text style={styles.locValue}>Kepong, Kuala Lumpur ▾</Text>
            </View>
            <View style={styles.bell}>
              <Text style={{ fontSize: 18 }}>🔔</Text>
              <View style={styles.dot} />
            </View>
          </View>

          {/* 问候 + 搜索 */}
          <Text style={styles.hello}>嗨，{profile.name} 👋</Text>
          <Text style={styles.subHello}>今天想为爱车做点什么？</Text>
          <View style={styles.search}>
            <Text style={{ fontSize: 16 }}>🔍</Text>
            <Text style={styles.searchPh}>搜索服务、门店或套餐</Text>
          </View>

          {/* 促销 Banner 横向滚动 */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.promoScroll}
            contentContainerStyle={{ gap: 12, paddingRight: 16 }}>
            {promos.map((p) => (
              <View key={p.id} style={[styles.promo, { backgroundColor: p.from }]}>
                <View style={[styles.promoTag, { backgroundColor: 'rgba(255,255,255,0.22)' }]}>
                  <Text style={styles.promoTagText}>{p.tag}</Text>
                </View>
                <Text style={styles.promoTitle}>{p.title}</Text>
                <Text style={styles.promoSub}>{p.sub}</Text>
              </View>
            ))}
          </ScrollView>

          {/* 服务宫格 */}
          <SectionTitle title="选择服务" />
          <View style={styles.grid}>
            {services.map((s) => (
              <Pressable
                key={s.id}
                style={styles.tile}
                onPress={() => router.push('/booking')}>
                <View style={[styles.tileIcon, { backgroundColor: s.soft }]}>
                  <Text style={{ fontSize: 26 }}>{s.emoji}</Text>
                </View>
                <Text style={styles.tileName}>{s.name}</Text>
                <Text style={styles.tileBrand}>{s.brand}</Text>
                <Text style={[styles.tileFrom, { color: s.color }]}>
                  {s.from > 0 ? `RM${s.from} 起` : '免费报价'}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* 我的套餐 */}
          <Card style={{ marginTop: 8, backgroundColor: Brand.navy }}>
            <View style={styles.pkgRow}>
              <View>
                <Text style={styles.pkgLabel}>我的套餐</Text>
                <Text style={styles.pkgName}>{profile.packageName}</Text>
              </View>
              <Badge text="生效中" color={Brand.success} soft={Brand.successSoft} />
            </View>
            <View style={styles.pkgBarBg}>
              <View
                style={[styles.pkgBarFill, { width: `${(profile.packageLeft / profile.packageTotal) * 100}%` }]}
              />
            </View>
            <Text style={styles.pkgLeft}>
              本月还可洗 <Text style={{ color: Brand.primary, fontWeight: '800' }}>{profile.packageLeft}</Text> /
              {profile.packageTotal} 次
            </Text>
          </Card>

          {/* 附近门店 */}
          <View style={{ marginTop: 20 }}>
            <SectionTitle title="附近门店" action="查看全部" />
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 12, paddingRight: 16 }}>
            {outlets.map((o) => (
              <Card key={o.id} style={styles.outlet}>
                <View style={styles.outletThumb}>
                  <Text style={{ fontSize: 30 }}>{o.emoji}</Text>
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

          <View style={{ height: 12 }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Brand.bg },
  safe: { flex: 1 },
  scroll: { paddingHorizontal: 16, paddingBottom: 16 },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 8 },
  locLabel: { fontSize: 11, color: Brand.textSub },
  locValue: { fontSize: 15, fontWeight: '700', color: Brand.text, marginTop: 2 },
  bell: { width: 42, height: 42, borderRadius: 21, backgroundColor: Brand.card, alignItems: 'center', justifyContent: 'center' },
  dot: { position: 'absolute', top: 10, right: 11, width: 8, height: 8, borderRadius: 4, backgroundColor: Brand.primary },
  hello: { fontSize: 24, fontWeight: '900', color: Brand.text, marginTop: 16 },
  subHello: { fontSize: 14, color: Brand.textSub, marginTop: 4 },
  search: {
    flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: Brand.card,
    borderRadius: Radius.pill, paddingHorizontal: 16, paddingVertical: 13, marginTop: 16,
  },
  searchPh: { color: Brand.textSub, fontSize: 14 },
  promoScroll: { marginTop: 18 },
  promo: { width: 280, borderRadius: Radius.lg, padding: 18, justifyContent: 'center', minHeight: 120 },
  promoTag: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: Radius.pill, marginBottom: 10 },
  promoTagText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  promoTitle: { color: '#fff', fontSize: 22, fontWeight: '900' },
  promoSub: { color: 'rgba(255,255,255,0.9)', fontSize: 13, marginTop: 4 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  tile: {
    width: '47%', flexGrow: 1, backgroundColor: Brand.card, borderRadius: Radius.lg, padding: 16,
  },
  tileIcon: { width: 52, height: 52, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  tileName: { fontSize: 16, fontWeight: '800', color: Brand.text },
  tileBrand: { fontSize: 12, color: Brand.textSub, marginTop: 2 },
  tileFrom: { fontSize: 13, fontWeight: '800', marginTop: 10 },
  pkgRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  pkgLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 12 },
  pkgName: { color: '#fff', fontSize: 18, fontWeight: '800', marginTop: 2 },
  pkgBarBg: { height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.15)', marginTop: 16, overflow: 'hidden' },
  pkgBarFill: { height: 8, borderRadius: 4, backgroundColor: Brand.primary },
  pkgLeft: { color: 'rgba(255,255,255,0.85)', fontSize: 13, marginTop: 10 },
  outlet: { width: 190, padding: 12 },
  outletThumb: { height: 80, borderRadius: Radius.md, backgroundColor: Brand.bg, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  outletName: { fontSize: 14, fontWeight: '800', color: Brand.text },
  outletArea: { fontSize: 12, color: Brand.textSub, marginTop: 4 },
  outletFoot: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 8 },
  outletReviews: { fontSize: 12, color: Brand.textSub },
});
