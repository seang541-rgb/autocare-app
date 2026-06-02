import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Card } from '@/components/ui';
import { Brand, Radius } from '@/constants/brand';
import { profile } from '@/constants/data';

const MENU = [
  { icon: '🚗', label: '我的车辆', sub: profile.car.plate },
  { icon: '🛡️', label: '我的保单', sub: '1 份生效中' },
  { icon: '🎟️', label: '优惠券', sub: `${profile.coupons} 张可用` },
  { icon: '💳', label: '支付方式', sub: '' },
  { icon: '📍', label: '地址管理', sub: '' },
  { icon: '🎧', label: '联系客服', sub: '' },
  { icon: '⚙️', label: '设置', sub: '' },
];

export default function ProfileScreen() {
  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']} style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
          <Text style={styles.title}>我的</Text>

          {/* 用户卡片 */}
          <Card style={styles.userCard}>
            <View style={styles.userTop}>
              <View style={styles.avatar}>
                <Text style={{ fontSize: 28 }}>🧑‍💼</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{profile.name}</Text>
                <Text style={styles.phone}>{profile.phone}</Text>
                <View style={styles.levelBadge}>
                  <Text style={styles.levelText}>👑 {profile.level}</Text>
                </View>
              </View>
            </View>

            <View style={styles.statsRow}>
              <View style={styles.stat}>
                <Text style={styles.statNum}>{profile.points}</Text>
                <Text style={styles.statLabel}>积分</Text>
              </View>
              <View style={styles.statDiv} />
              <View style={styles.stat}>
                <Text style={styles.statNum}>{profile.packageLeft}</Text>
                <Text style={styles.statLabel}>剩余洗车</Text>
              </View>
              <View style={styles.statDiv} />
              <View style={styles.stat}>
                <Text style={styles.statNum}>{profile.coupons}</Text>
                <Text style={styles.statLabel}>优惠券</Text>
              </View>
            </View>
          </Card>

          {/* 车辆卡片 */}
          <Card style={{ marginTop: 14 }}>
            <View style={styles.carRow}>
              <View style={styles.carIcon}><Text style={{ fontSize: 26 }}>🚙</Text></View>
              <View style={{ flex: 1 }}>
                <Text style={styles.carPlate}>{profile.car.plate}</Text>
                <Text style={styles.carModel}>{profile.car.model} · {profile.car.year}</Text>
              </View>
              <Text style={styles.manage}>管理 ›</Text>
            </View>
          </Card>

          {/* 菜单 */}
          <Card style={{ marginTop: 14, paddingVertical: 4 }}>
            {MENU.map((m, i) => (
              <View key={m.label} style={[styles.menuRow, i < MENU.length - 1 && styles.menuBorder]}>
                <Text style={styles.menuIcon}>{m.icon}</Text>
                <Text style={styles.menuLabel}>{m.label}</Text>
                <View style={{ flex: 1 }} />
                {m.sub ? <Text style={styles.menuSub}>{m.sub}</Text> : null}
                <Text style={styles.menuArrow}>›</Text>
              </View>
            ))}
          </Card>

          <Text style={styles.version}>AutoCare 雏形 v0.1 · 参考 KeyAuto WeK4U</Text>
          <View style={{ height: 12 }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Brand.bg },
  scroll: { paddingHorizontal: 16, paddingBottom: 16 },
  title: { fontSize: 24, fontWeight: '900', color: Brand.text, marginTop: 8, marginBottom: 16 },
  userCard: { backgroundColor: Brand.navy },
  userTop: { flexDirection: 'row', gap: 14, alignItems: 'center' },
  avatar: { width: 60, height: 60, borderRadius: 30, backgroundColor: 'rgba(255,255,255,0.12)', alignItems: 'center', justifyContent: 'center' },
  name: { fontSize: 18, fontWeight: '900', color: '#fff' },
  phone: { fontSize: 13, color: 'rgba(255,255,255,0.6)', marginTop: 2 },
  levelBadge: { alignSelf: 'flex-start', backgroundColor: Brand.primary, paddingHorizontal: 10, paddingVertical: 4, borderRadius: Radius.pill, marginTop: 8 },
  levelText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  statsRow: { flexDirection: 'row', alignItems: 'center', marginTop: 18, paddingTop: 16, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)' },
  stat: { flex: 1, alignItems: 'center' },
  statDiv: { width: 1, height: 28, backgroundColor: 'rgba(255,255,255,0.1)' },
  statNum: { fontSize: 19, fontWeight: '900', color: '#fff' },
  statLabel: { fontSize: 11, color: 'rgba(255,255,255,0.6)', marginTop: 3 },
  carRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  carIcon: { width: 48, height: 48, borderRadius: Radius.md, backgroundColor: Brand.primarySoft, alignItems: 'center', justifyContent: 'center' },
  carPlate: { fontSize: 16, fontWeight: '900', color: Brand.text },
  carModel: { fontSize: 12, color: Brand.textSub, marginTop: 3 },
  manage: { fontSize: 13, color: Brand.primary, fontWeight: '700' },
  menuRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 15, paddingHorizontal: 12 },
  menuBorder: { borderBottomWidth: 1, borderBottomColor: Brand.border },
  menuIcon: { fontSize: 18, width: 24, textAlign: 'center' },
  menuLabel: { fontSize: 15, fontWeight: '600', color: Brand.text },
  menuSub: { fontSize: 13, color: Brand.textSub, marginRight: 6 },
  menuArrow: { fontSize: 20, color: Brand.textSub },
  version: { textAlign: 'center', color: Brand.textSub, fontSize: 12, marginTop: 24 },
});
