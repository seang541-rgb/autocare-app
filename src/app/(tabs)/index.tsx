import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Badge, Card, GradIcon, SectionTitle, Stars } from '@/components/ui';
import { Brand, Gradients, Radius, Shadow } from '@/constants/brand';
import { outlets, profile, promos, services } from '@/constants/data';
import { useToast } from '@/store/toast';

export default function HomeScreen() {
  const [notifOpen, setNotifOpen] = useState(false);
  const toast = useToast();
  const goWash = () => router.push({ pathname: '/service/[id]', params: { id: 'wash' } });

  return (
    <View style={styles.root}>
      {/* 渐变英雄头部 */}
      <LinearGradient colors={Gradients.hero} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.heroGrad}>
        <SafeAreaView edges={['top']}>
          <View style={styles.heroPad}>
            <View style={styles.topBar}>
              <View style={{ flex: 1 }}>
                <Text style={styles.locLabel}>当前位置</Text>
                <View style={styles.locRow}>
                  <Ionicons name="location" size={14} color={Brand.primary} />
                  <Text style={styles.locValue}>Kepong, Kuala Lumpur</Text>
                  <Ionicons name="chevron-down" size={14} color={Brand.textOnDarkSub} />
                </View>
              </View>
              <Pressable style={styles.bell} onPress={() => setNotifOpen(true)} hitSlop={8}>
                <Ionicons name="notifications-outline" size={20} color="#fff" />
                <View style={styles.dot} />
              </Pressable>
            </View>

            <Text style={styles.hello}>嗨，{profile.name} 👋</Text>
            <Text style={styles.subHello}>今天想为爱车做点什么？</Text>

            <Pressable style={styles.search} onPress={() => toast('搜索功能开发中，敬请期待')}>
              <Ionicons name="search" size={18} color={Brand.textSub} />
              <Text style={styles.searchPh}>搜索服务、门店或套餐</Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* 套餐卡（叠在英雄区下方，制造层次） */}
        <View style={styles.body}>
          <LinearGradient colors={Gradients.brand} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.pkg}>
            <View style={styles.pkgRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.pkgLabel}>我的套餐 · {profile.packageName}</Text>
                <Text style={styles.pkgBig}>
                  {profile.packageLeft}
                  <Text style={styles.pkgBigSub}> / {profile.packageTotal} 次</Text>
                </Text>
              </View>
              <View style={styles.pkgBadge}>
                <Ionicons name="checkmark-circle" size={13} color="#fff" />
                <Text style={styles.pkgBadgeText}>生效中</Text>
              </View>
            </View>
            <View style={styles.pkgBarBg}>
              <View style={[styles.pkgBarFill, { width: `${(profile.packageLeft / profile.packageTotal) * 100}%` }]} />
            </View>
            <Text style={styles.pkgHint}>本月剩余洗车次数，到店出示二维码即可</Text>
          </LinearGradient>
        </View>

        {/* 促销横滑 */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 16 }} contentContainerStyle={{ gap: 10, paddingHorizontal: 16 }}>
          {promos.map((p) => (
            <Pressable key={p.id} onPress={() => router.push({ pathname: '/promo/[id]', params: { id: p.id } })}>
              <LinearGradient
                colors={Gradients[p.grad]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.promo}>
                <View style={styles.promoTag}>
                  <Text style={styles.promoTagText}>{p.tag}</Text>
                </View>
                <Text style={styles.promoTitle}>{p.title}</Text>
                <Text style={styles.promoSub}>{p.sub}</Text>
                <Ionicons name={p.icon} size={64} color="rgba(255,255,255,0.18)" style={styles.promoGhost} />
              </LinearGradient>
            </Pressable>
          ))}
        </ScrollView>

        <View style={styles.body}>
          {/* 服务宫格 2x2 */}
          <View style={{ marginTop: 16 }}>
            <SectionTitle title="选择服务" />
          </View>
          <View style={styles.grid}>
            {services.map((s) => (
              <Pressable key={s.id} style={styles.tile} onPress={() => router.push({ pathname: '/service/[id]', params: { id: s.id } })}>
                <GradIcon icon={s.icon} grad={s.grad} size={40} iconSize={19} />
                <Text style={styles.tileName}>{s.name}</Text>
                <Text style={styles.tileDesc} numberOfLines={1}>{s.desc}</Text>
                <View style={styles.tileFootRow}>
                  <Text style={styles.tileFrom}>{s.from > 0 ? `RM${s.from} 起` : '免费报价'}</Text>
                  <Ionicons name="arrow-forward-circle" size={20} color={Brand.primary} />
                </View>
              </Pressable>
            ))}
          </View>

          {/* 附近门店 */}
          <View style={{ marginTop: 16 }}>
            <SectionTitle title="附近门店" action="查看全部" onAction={() => toast('门店列表开发中，敬请期待')} />
          </View>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12, paddingHorizontal: 16 }}>
          {outlets.map((o) => (
            <Pressable key={o.id} onPress={goWash}>
            <Card style={styles.outlet}>
              <LinearGradient colors={Gradients.card} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.outletThumb}>
                <Ionicons name={o.icon} size={30} color="#fff" />
              </LinearGradient>
              <Text style={styles.outletName} numberOfLines={1}>{o.name}</Text>
              <View style={styles.outletMetaRow}>
                <Ionicons name="location-outline" size={12} color={Brand.textSub} />
                <Text style={styles.outletArea}>{o.area} · {o.distanceKm}km</Text>
              </View>
              <View style={styles.outletFoot}>
                <Stars rating={o.rating} />
                <Text style={styles.outletReviews}>({o.reviews})</Text>
              </View>
            </Card>
            </Pressable>
          ))}
        </ScrollView>

        <View style={{ height: 16 }} />
      </ScrollView>

      {/* 通知弹窗 */}
      <Modal visible={notifOpen} transparent animationType="fade" onRequestClose={() => setNotifOpen(false)}>
        <Pressable style={styles.modalBg} onPress={() => setNotifOpen(false)}>
          <Pressable style={styles.modalCard} onPress={() => {}}>
            <View style={styles.modalHead}>
              <Text style={styles.modalTitle}>通知</Text>
              <Pressable onPress={() => setNotifOpen(false)} hitSlop={8}>
                <Ionicons name="close" size={22} color={Brand.textSub} />
              </Pressable>
            </View>
            {[
              { icon: 'water' as const, grad: 'wash' as const, t: '预约提醒', s: '明天 14:30 甲洞旗舰店洗车，记得到店' },
              { icon: 'gift' as const, grad: 'detail' as const, t: '优惠到账', s: '新增 1 张 RM10 镀膜券，7 天内有效' },
              { icon: 'shield-checkmark' as const, grad: 'insure' as const, t: '车险将到期', s: '保单 30 天后到期，点此比价续保' },
            ].map((n, i, arr) => (
              <View key={n.t} style={[styles.notifItem, i === arr.length - 1 && { borderBottomWidth: 0 }]}>
                <GradIcon icon={n.icon} grad={n.grad} size={38} iconSize={18} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.notifTitle}>{n.t}</Text>
                  <Text style={styles.notifSub}>{n.s}</Text>
                </View>
              </View>
            ))}
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Brand.bg },
  heroGrad: { borderBottomLeftRadius: 28, borderBottomRightRadius: 28 },
  heroPad: { paddingHorizontal: 16, paddingBottom: 18 },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 8 },
  locLabel: { fontSize: 11, color: Brand.textOnDarkSub },
  locRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  locValue: { fontSize: 14, fontWeight: '700', color: '#fff' },
  bell: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },
  dot: { position: 'absolute', top: 9, right: 10, width: 8, height: 8, borderRadius: 4, backgroundColor: Brand.primary, borderWidth: 1.5, borderColor: Brand.navy },
  hello: { fontSize: 19, fontWeight: '900', color: '#fff', marginTop: 12 },
  subHello: { fontSize: 12, color: Brand.textOnDarkSub, marginTop: 2 },
  search: {
    flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#fff',
    borderRadius: Radius.pill, paddingHorizontal: 14, paddingVertical: 11, marginTop: 12, ...Shadow.soft,
  },
  searchPh: { color: Brand.textSub, fontSize: 13 },
  scroll: { paddingTop: 0 },
  body: { paddingHorizontal: 16 },
  // 套餐
  pkg: { borderRadius: Radius.lg, padding: 14, marginTop: -14, ...Shadow.soft },
  pkgRow: { flexDirection: 'row', alignItems: 'flex-start' },
  pkgLabel: { color: 'rgba(255,255,255,0.85)', fontSize: 11, fontWeight: '600' },
  pkgBig: { color: '#fff', fontSize: 24, fontWeight: '900', marginTop: 1 },
  pkgBigSub: { fontSize: 13, fontWeight: '700', color: 'rgba(255,255,255,0.8)' },
  pkgBadge: { flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: 'rgba(255,255,255,0.22)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: Radius.pill },
  pkgBadgeText: { color: '#fff', fontSize: 10, fontWeight: '800' },
  pkgBarBg: { height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.25)', marginTop: 10, overflow: 'hidden' },
  pkgBarFill: { height: 6, borderRadius: 3, backgroundColor: '#fff' },
  pkgHint: { color: 'rgba(255,255,255,0.8)', fontSize: 10, marginTop: 7 },
  // 促销
  promo: { width: 190, borderRadius: Radius.lg, padding: 14, minHeight: 104, overflow: 'hidden', ...Shadow.card },
  promoTag: { alignSelf: 'flex-start', backgroundColor: 'rgba(255,255,255,0.25)', paddingHorizontal: 8, paddingVertical: 2, borderRadius: Radius.pill, marginBottom: 8 },
  promoTagText: { color: '#fff', fontSize: 9, fontWeight: '800' },
  promoTitle: { color: '#fff', fontSize: 17, fontWeight: '900', lineHeight: 21 },
  promoSub: { color: 'rgba(255,255,255,0.9)', fontSize: 11, marginTop: 4 },
  promoGhost: { position: 'absolute', right: -8, bottom: -8 },
  // 服务宫格
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  tile: { width: '47%', flexGrow: 1, backgroundColor: Brand.card, borderRadius: Radius.md, padding: 12, ...Shadow.card },
  tileName: { fontSize: 14, fontWeight: '800', color: Brand.text, marginTop: 8 },
  tileDesc: { fontSize: 10, color: Brand.textSub, marginTop: 2 },
  tileFootRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 },
  tileFrom: { fontSize: 13, fontWeight: '800', color: Brand.primary },
  // 门店
  outlet: { width: 180, padding: 12 },
  outletThumb: { height: 78, borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  outletName: { fontSize: 14, fontWeight: '800', color: Brand.text },
  outletMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 5 },
  outletArea: { fontSize: 11, color: Brand.textSub },
  outletFoot: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 8 },
  outletReviews: { fontSize: 11, color: Brand.textSub },
  // modal
  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', paddingHorizontal: 24 },
  modalCard: { backgroundColor: '#fff', borderRadius: Radius.lg, padding: 18 },
  modalHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  modalTitle: { fontSize: 17, fontWeight: '900', color: Brand.text },
  notifItem: { flexDirection: 'row', gap: 12, alignItems: 'center', paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: Brand.border },
  notifTitle: { fontSize: 13, fontWeight: '800', color: Brand.text },
  notifSub: { fontSize: 12, color: Brand.textSub, marginTop: 2 },
});
