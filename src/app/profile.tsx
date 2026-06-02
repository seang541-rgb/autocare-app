import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Card, GradIcon } from '@/components/ui';
import { Brand, Gradients, Radius, Shadow } from '@/constants/brand';
import { profile } from '@/constants/data';

type IconName = keyof typeof Ionicons.glyphMap;
const MENU: { icon: IconName; label: string; sub: string }[] = [
  { icon: 'car-sport-outline', label: '我的车辆', sub: profile.car.plate },
  { icon: 'shield-checkmark-outline', label: '我的保单', sub: '1 份生效中' },
  { icon: 'ticket-outline', label: '优惠券', sub: `${profile.coupons} 张可用` },
  { icon: 'card-outline', label: '支付方式', sub: '' },
  { icon: 'location-outline', label: '地址管理', sub: '' },
  { icon: 'headset-outline', label: '联系客服', sub: '' },
  { icon: 'settings-outline', label: '设置', sub: '' },
];

export default function ProfileScreen() {
  return (
    <View style={styles.root}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 渐变会员头部 */}
        <LinearGradient colors={Gradients.hero} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.headerGrad}>
          <SafeAreaView edges={['top']}>
            <View style={styles.headerPad}>
              <Text style={styles.pageTitle}>我的</Text>
              <View style={styles.userTop}>
                <LinearGradient colors={Gradients.brand} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.avatar}>
                  <Ionicons name="person" size={28} color="#fff" />
                </LinearGradient>
                <View style={{ flex: 1 }}>
                  <Text style={styles.name}>{profile.name}</Text>
                  <Text style={styles.phone}>{profile.phone}</Text>
                  <View style={styles.levelBadge}>
                    <Ionicons name="diamond" size={11} color="#fff" />
                    <Text style={styles.levelText}>{profile.level}</Text>
                  </View>
                </View>
                <Ionicons name="qr-code-outline" size={24} color="rgba(255,255,255,0.8)" />
              </View>
            </View>
          </SafeAreaView>
        </LinearGradient>

        <View style={styles.body}>
          {/* 数据统计卡（上浮） */}
          <Card style={styles.statsCard}>
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
          </Card>

          {/* 车辆卡 */}
          <Card style={{ marginTop: 14 }}>
            <View style={styles.carRow}>
              <GradIcon icon="car-sport" grad="brand" size={48} iconSize={24} />
              <View style={{ flex: 1 }}>
                <Text style={styles.carPlate}>{profile.car.plate}</Text>
                <Text style={styles.carModel}>{profile.car.model} · {profile.car.year}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={Brand.textSub} />
            </View>
          </Card>

          {/* 菜单 */}
          <Card style={{ marginTop: 14, paddingVertical: 4 }}>
            {MENU.map((m, i) => (
              <View key={m.label} style={[styles.menuRow, i < MENU.length - 1 && styles.menuBorder]}>
                <View style={styles.menuIconWrap}>
                  <Ionicons name={m.icon} size={19} color={Brand.primary} />
                </View>
                <Text style={styles.menuLabel}>{m.label}</Text>
                <View style={{ flex: 1 }} />
                {m.sub ? <Text style={styles.menuSub}>{m.sub}</Text> : null}
                <Ionicons name="chevron-forward" size={18} color={Brand.textSub} />
              </View>
            ))}
          </Card>

          <Text style={styles.version}>AutoCare v0.2 · 参考 KeyAuto WeK4U</Text>
          <View style={{ height: 20 }} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Brand.bg },
  headerGrad: { borderBottomLeftRadius: 28, borderBottomRightRadius: 28, paddingBottom: 30 },
  headerPad: { paddingHorizontal: 16, paddingTop: 8 },
  pageTitle: { fontSize: 20, fontWeight: '900', color: '#fff', marginBottom: 16 },
  userTop: { flexDirection: 'row', gap: 14, alignItems: 'center' },
  avatar: { width: 60, height: 60, borderRadius: 30, alignItems: 'center', justifyContent: 'center' },
  name: { fontSize: 18, fontWeight: '900', color: '#fff' },
  phone: { fontSize: 13, color: Brand.textOnDarkSub, marginTop: 2 },
  levelBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, alignSelf: 'flex-start', backgroundColor: Brand.primary, paddingHorizontal: 10, paddingVertical: 4, borderRadius: Radius.pill, marginTop: 8 },
  levelText: { color: '#fff', fontSize: 11, fontWeight: '800' },
  body: { paddingHorizontal: 16, marginTop: -18 },
  statsCard: { flexDirection: 'row', alignItems: 'center', ...Shadow.soft },
  stat: { flex: 1, alignItems: 'center' },
  statDiv: { width: 1, height: 30, backgroundColor: Brand.border },
  statNum: { fontSize: 20, fontWeight: '900', color: Brand.text },
  statLabel: { fontSize: 11, color: Brand.textSub, marginTop: 3 },
  carRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  carPlate: { fontSize: 16, fontWeight: '900', color: Brand.text },
  carModel: { fontSize: 12, color: Brand.textSub, marginTop: 3 },
  menuRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14, paddingHorizontal: 12 },
  menuBorder: { borderBottomWidth: 1, borderBottomColor: Brand.border },
  menuIconWrap: { width: 34, height: 34, borderRadius: 10, backgroundColor: Brand.primarySoft, alignItems: 'center', justifyContent: 'center' },
  menuLabel: { fontSize: 15, fontWeight: '600', color: Brand.text },
  menuSub: { fontSize: 13, color: Brand.textSub, marginRight: 6 },
  version: { textAlign: 'center', color: Brand.textSub, fontSize: 12, marginTop: 24 },
});
