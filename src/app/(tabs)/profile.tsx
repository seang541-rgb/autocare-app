import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Card, GradIcon } from '@/components/ui';
import { AppBrand, Brand, Gradients, Radius, Shadow } from '@/constants/brand';
import { profile } from '@/constants/data';
import { Language, useI18n } from '@/store/i18n';
import { useToast } from '@/store/toast';

type IconName = keyof typeof Ionicons.glyphMap;

const MENU: { icon: IconName; labelKey: string; subKey?: string; sub?: string }[] = [
  { icon: 'car-sport-outline', labelKey: 'myVehicles', sub: profile.car.plate },
  { icon: 'ticket-outline', labelKey: 'coupons', subKey: 'availableCoupons' },
  { icon: 'card-outline', labelKey: 'paymentMethods', sub: 'TnG · FPX · Card' },
  { icon: 'location-outline', labelKey: 'addressBook' },
  { icon: 'logo-whatsapp', labelKey: 'whatsappAiCare', subKey: 'supportMenuSub' },
  { icon: 'alert-circle-outline', labelKey: 'complaintCenter', subKey: 'complaintMenuSub' },
  { icon: 'settings-outline', labelKey: 'settings' },
];

const LANGS: { key: Language; labelKey: string }[] = [
  { key: 'zh', labelKey: 'chinese' },
  { key: 'en', labelKey: 'english' },
  { key: 'ms', labelKey: 'malay' },
];

export default function ProfileScreen() {
  const toast = useToast();
  const { lang, setLang, t } = useI18n();

  return (
    <View style={styles.root}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <LinearGradient colors={Gradients.hero} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.headerGrad}>
          <SafeAreaView edges={['top']}>
            <View style={styles.headerPad}>
              <Text style={styles.pageTitle}>{t('profile')}</Text>
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
          <Card style={styles.statsCard}>
            <Stat num={profile.points} label={t('points')} />
            <View style={styles.statDiv} />
            <Stat num={profile.packageLeft} label={t('remainingWash')} />
            <View style={styles.statDiv} />
            <Stat num={profile.coupons} label={t('coupons')} />
          </Card>

          <Card style={{ marginTop: 14 }}>
            <Text style={styles.sectionTitle}>{t('language')}</Text>
            <View style={styles.langRow}>
              {LANGS.map((item) => {
                const on = item.key === lang;
                return (
                  <Pressable key={item.key} onPress={() => setLang(item.key)} style={[styles.langBtn, on && styles.langBtnOn]}>
                    <Text style={[styles.langText, on && styles.langTextOn]}>{t(item.labelKey)}</Text>
                  </Pressable>
                );
              })}
            </View>
          </Card>

          <Pressable onPress={() => toast(t('vehicleToast'))}>
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
          </Pressable>

          <Card style={{ marginTop: 14, paddingVertical: 4 }}>
            {MENU.map((m, i) => {
              const label = t(m.labelKey);
              const sub = m.subKey ? t(m.subKey, { count: profile.coupons }) : m.sub;
              return (
              <Pressable key={m.labelKey} onPress={() => toast(t('demoEntryToast', { label }))}>
                <View style={[styles.menuRow, i < MENU.length - 1 && styles.menuBorder]}>
                  <View style={styles.menuIconWrap}>
                    <Ionicons name={m.icon} size={19} color={Brand.primary} />
                  </View>
                  <Text style={styles.menuLabel}>{label}</Text>
                  <View style={{ flex: 1 }} />
                  {sub ? <Text style={styles.menuSub}>{sub}</Text> : null}
                  <Ionicons name="chevron-forward" size={18} color={Brand.textSub} />
                </View>
              </Pressable>
            )})}
          </Card>

          <Text style={styles.version}>{AppBrand.name} v0.4 · Malaysia-ready</Text>
          <View style={{ height: 20 }} />
        </View>
      </ScrollView>
    </View>
  );
}

function Stat({ num, label }: { num: number; label: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statNum}>{num}</Text>
      <Text style={styles.statLabel}>{label}</Text>
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
  sectionTitle: { fontSize: 15, fontWeight: '900', color: Brand.text, marginBottom: 10 },
  langRow: { flexDirection: 'row', gap: 8 },
  langBtn: { flex: 1, alignItems: 'center', paddingVertical: 10, borderRadius: Radius.pill, backgroundColor: Brand.bg },
  langBtnOn: { backgroundColor: Brand.primary },
  langText: { color: Brand.text, fontSize: 12, fontWeight: '800' },
  langTextOn: { color: '#fff' },
  carRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  carPlate: { fontSize: 16, fontWeight: '900', color: Brand.text },
  carModel: { fontSize: 12, color: Brand.textSub, marginTop: 3 },
  menuRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14, paddingHorizontal: 12 },
  menuBorder: { borderBottomWidth: 1, borderBottomColor: Brand.border },
  menuIconWrap: { width: 34, height: 34, borderRadius: 10, backgroundColor: Brand.primarySoft, alignItems: 'center', justifyContent: 'center' },
  menuLabel: { fontSize: 15, fontWeight: '600', color: Brand.text },
  menuSub: { fontSize: 12, color: Brand.textSub, marginRight: 6 },
  version: { textAlign: 'center', color: Brand.textSub, fontSize: 12, marginTop: 24 },
});
