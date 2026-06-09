import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BrandMark } from '@/components/brand-icons';
import { Card, GradIcon } from '@/components/ui';
import { AppBrand, Brand, Gradients, Radius, Shadow } from '@/constants/brand';
import { profile } from '@/constants/data';
import { useAccount } from '@/store/account';
import { Language, useI18n } from '@/store/i18n';
import { useOrders } from '@/store/orders';

type IconName = keyof typeof Ionicons.glyphMap;
type ProfileRoute =
  | '/profile/vehicles'
  | '/profile/coupons'
  | '/profile/payments'
  | '/profile/addresses'
  | '/profile/support'
  | '/profile/complaints'
  | '/profile/settings'
  | '/(tabs)/staff';

const MENU: { icon: IconName; labelKey: string; subKey?: string; route: ProfileRoute; tone: keyof typeof Gradients }[] = [
  { icon: 'storefront-outline', labelKey: 'merchantMode', subKey: 'merchantModeSub', route: '/(tabs)/staff', tone: 'merchant' },
  { icon: 'location-outline', labelKey: 'addresses', subKey: 'addressSub', route: '/profile/addresses', tone: 'retail' },
  { icon: 'card-outline', labelKey: 'paymentMethods', subKey: 'paymentSub', route: '/profile/payments', tone: 'promo2' },
  { icon: 'ticket-outline', labelKey: 'vouchers', subKey: 'couponSub', route: '/profile/coupons', tone: 'promo1' },
  { icon: 'car-sport-outline', labelKey: 'carCareProfile', subKey: 'carCareProfileSub', route: '/profile/vehicles', tone: 'wash' },
  { icon: 'logo-whatsapp', labelKey: 'whatsappAiCare', subKey: 'supportMenuSub', route: '/profile/support', tone: 'promo3' },
  { icon: 'alert-circle-outline', labelKey: 'complaintCenter', subKey: 'complaintMenuSub', route: '/profile/complaints', tone: 'detail' },
  { icon: 'settings-outline', labelKey: 'settings', subKey: 'settingsSub', route: '/profile/settings', tone: 'tyre' },
];

const LANGS: { key: Language; labelKey: string }[] = [
  { key: 'zh', labelKey: 'chinese' },
  { key: 'en', labelKey: 'english' },
  { key: 'ms', labelKey: 'malay' },
];

export default function ProfileScreen() {
  const { lang, setLang, t } = useI18n();
  const { coupons, currentUser, defaultAddress, defaultPayment, logout } = useAccount();
  const { list } = useOrders();
  const usableCouponCount = coupons.filter((coupon) => coupon.status === 'usable').length;
  const activeOrderCount = list.filter((order) => !['completed', 'cancelled'].includes(order.status)).length;
  const displayName = currentUser?.name ?? profile.name;
  const displayPhone = currentUser?.phone ?? profile.phone;

  return (
    <View style={styles.root}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <SafeAreaView edges={['top']}>
          <View style={styles.header}>
            <View style={styles.headerTop}>
              <BrandMark size={42} />
              <View style={{ flex: 1 }}>
                <Text style={styles.appName}>{AppBrand.name}</Text>
                <Text style={styles.headerSub}>{t('marketplaceAccount')}</Text>
              </View>
              <Pressable style={styles.qrButton} onPress={() => router.push('/profile/member-qr')} hitSlop={8}>
                <Ionicons name="qr-code-outline" size={22} color={Brand.text} />
              </Pressable>
            </View>
            <Text style={styles.pageTitle}>{t('profile')}</Text>
          </View>
        </SafeAreaView>

        <View style={styles.body}>
          <Card style={styles.memberCard}>
            <View style={styles.identityRow}>
              <LinearGradient colors={Gradients.brand} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.avatar}>
                <Ionicons name="person" size={30} color="#fff" />
              </LinearGradient>
              <View style={styles.identityText}>
                <Text style={styles.name}>{displayName}</Text>
                <Text style={styles.phone}>{displayPhone}</Text>
                <View style={styles.levelBadge}>
                  <Ionicons name="diamond" size={11} color="#fff" />
                  <Text style={styles.levelText}>{currentUser?.level ?? profile.level}</Text>
                </View>
              </View>
            </View>
            <View style={styles.statGrid}>
              <Stat num={currentUser?.points ?? profile.points} label={t('points')} />
              <Stat num={activeOrderCount} label={t('activeOrders')} />
              <Stat num={usableCouponCount} label={t('vouchers')} />
            </View>
          </Card>

          <Card style={styles.walletCard}>
            <GradIcon icon="storefront" grad="merchant" size={42} iconSize={20} />
            <View style={styles.accountInfo}>
              <Text style={styles.accountTitle}>{t('marketplaceAccount')}</Text>
              <Text style={styles.accountSub} numberOfLines={1}>{defaultAddress?.label ?? t('noAddress')} / {defaultPayment?.label ?? t('noPaymentMethod')}</Text>
            </View>
            <Pressable style={styles.exploreBtn} onPress={() => router.push('/(tabs)/booking')}>
              <Text style={styles.exploreText}>{t('explore')}</Text>
            </Pressable>
          </Card>

          <Card style={styles.languageCard}>
            <View style={styles.cardTitleRow}>
              <Ionicons name="language-outline" size={18} color={Brand.primary} />
              <Text style={styles.sectionTitle}>{t('language')}</Text>
            </View>
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

          <View style={styles.quickGrid}>
            <QuickAction icon="storefront-outline" label={t('merchantMode')} route="/(tabs)/staff" grad="merchant" />
            <QuickAction icon="ticket-outline" label={t('vouchers')} route="/profile/coupons" grad="promo1" />
            <QuickAction icon="logo-whatsapp" label={t('whatsappAiCare')} route="/profile/support" grad="promo3" />
          </View>

          <Card style={styles.menuCard}>
            {MENU.map((m, i) => (
              <Pressable key={m.labelKey} onPress={() => router.push(m.route)}>
                <View style={[styles.menuRow, i < MENU.length - 1 && styles.menuBorder]}>
                  <GradIcon icon={m.icon} grad={m.tone} size={38} iconSize={18} />
                  <View style={styles.menuText}>
                    <Text style={styles.menuLabel}>{t(m.labelKey)}</Text>
                    {m.subKey ? <Text style={styles.menuSubText}>{t(m.subKey)}</Text> : null}
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={Brand.textMuted} />
                </View>
              </Pressable>
            ))}
          </Card>

          <Pressable onPress={() => { logout(); router.replace('/auth/login'); }} style={styles.logoutBtn}>
            <Ionicons name="log-out-outline" size={18} color={Brand.danger} />
            <Text style={styles.logoutText}>{t('logout')}</Text>
          </Pressable>

          <Text style={styles.version}>{AppBrand.name} v0.5 / {t('marketplaceRebuild')}</Text>
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

function QuickAction({ icon, label, route, grad }: { icon: IconName; label: string; route: ProfileRoute; grad: keyof typeof Gradients }) {
  return (
    <Pressable style={styles.quickCard} onPress={() => router.push(route)}>
      <GradIcon icon={icon} grad={grad} size={38} iconSize={18} />
      <Text style={styles.quickLabel} numberOfLines={2}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Brand.bg },
  scrollContent: { paddingBottom: 24 },
  header: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 6 },
  headerTop: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  appName: { color: Brand.text, fontSize: 16, fontWeight: '900' },
  headerSub: { color: Brand.textSub, fontSize: 12, fontWeight: '800', marginTop: 3 },
  pageTitle: { fontSize: 28, fontWeight: '900', color: Brand.text, marginTop: 18 },
  qrButton: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', backgroundColor: Brand.card, borderWidth: 1, borderColor: Brand.border, ...Shadow.card },
  body: { paddingHorizontal: 16, paddingTop: 8 },
  memberCard: { padding: 0, overflow: 'hidden', ...Shadow.soft },
  identityRow: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 14, paddingBottom: 12 },
  avatar: { width: 64, height: 64, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  identityText: { flex: 1 },
  name: { fontSize: 20, fontWeight: '900', color: Brand.text },
  phone: { fontSize: 13, color: Brand.textSub, marginTop: 3 },
  levelBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, alignSelf: 'flex-start', backgroundColor: Brand.primary, paddingHorizontal: 11, paddingVertical: 5, borderRadius: Radius.pill, marginTop: 9 },
  levelText: { color: '#fff', fontSize: 11, fontWeight: '900' },
  statGrid: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: Brand.border, paddingVertical: 16 },
  stat: { flex: 1, alignItems: 'center' },
  statNum: { fontSize: 21, fontWeight: '900', color: Brand.text },
  statLabel: { fontSize: 11, color: Brand.textSub, marginTop: 4, textAlign: 'center' },
  walletCard: { marginTop: 12, flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12 },
  accountInfo: { flex: 1, minWidth: 0 },
  accountTitle: { fontSize: 14, fontWeight: '900', color: Brand.text },
  accountSub: { fontSize: 11, color: Brand.textSub, marginTop: 3 },
  exploreBtn: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: Radius.pill, backgroundColor: Brand.primarySoft },
  exploreText: { fontSize: 11, fontWeight: '900', color: Brand.primary },
  languageCard: { marginTop: 12 },
  cardTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '900', color: Brand.text },
  langRow: { flexDirection: 'row', gap: 8 },
  langBtn: { flex: 1, alignItems: 'center', justifyContent: 'center', minHeight: 42, borderRadius: Radius.pill, backgroundColor: Brand.cardAlt, paddingHorizontal: 8 },
  langBtnOn: { backgroundColor: Brand.primary },
  langText: { color: Brand.text, fontSize: 12, fontWeight: '900', textAlign: 'center' },
  langTextOn: { color: '#fff' },
  quickGrid: { flexDirection: 'row', gap: 10, marginTop: 12 },
  quickCard: { flex: 1, minHeight: 100, padding: 12, borderRadius: Radius.lg, backgroundColor: Brand.card, borderWidth: 1, borderColor: Brand.border, justifyContent: 'space-between', ...Shadow.card },
  quickLabel: { fontSize: 12, lineHeight: 16, fontWeight: '900', color: Brand.text },
  menuCard: { marginTop: 12, paddingVertical: 4 },
  menuRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14, paddingHorizontal: 8 },
  menuBorder: { borderBottomWidth: 1, borderBottomColor: Brand.border },
  menuText: { flex: 1, minWidth: 0 },
  menuLabel: { fontSize: 15, fontWeight: '900', color: Brand.text, lineHeight: 20 },
  menuSubText: { fontSize: 11, color: Brand.textSub, marginTop: 2, lineHeight: 15 },
  logoutBtn: { marginTop: 14, minHeight: 50, borderRadius: Radius.pill, flexDirection: 'row', gap: 8, alignItems: 'center', justifyContent: 'center', backgroundColor: Brand.dangerSoft },
  logoutText: { color: Brand.danger, fontSize: 14, fontWeight: '900' },
  version: { textAlign: 'center', color: Brand.textSub, fontSize: 12, marginTop: 24 },
});
