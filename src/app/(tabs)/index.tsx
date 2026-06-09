import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { ImageBackground, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BrandMark } from '@/components/brand-icons';
import { Badge, Card, GradIcon, SectionTitle, Stars } from '@/components/ui';
import { AppBrand, Brand, Gradients, Radius, Shadow } from '@/constants/brand';
import { categories, merchants, notifications, promos } from '@/constants/data';
import { useI18n } from '@/store/i18n';

export default function HomeScreen() {
  const [notifOpen, setNotifOpen] = useState(false);
  const { t, categoryName, promoDetail, notification, merchantHero } = useI18n();
  const openMerchants = useMemo(() => merchants.filter((m) => m.openNow), []);
  const topMerchants = useMemo(() => [...merchants].sort((a, b) => b.rating - a.rating || b.reviews - a.reviews).slice(0, 2), []);
  const sponsoredMerchants = useMemo(() => merchants.filter((m) => !topMerchants.some((top) => top.id === m.id)).slice(0, 2), [topMerchants]);
  const premiumPicks = useMemo(() => [
    ...topMerchants.map((merchant) => ({ merchant, slotType: 'top' as const })),
    ...sponsoredMerchants.map((merchant) => ({ merchant, slotType: 'sponsored' as const })),
  ], [sponsoredMerchants, topMerchants]);
  const heroMerchant = useMemo(() => openMerchants.find((m) => m.categoryId === 'food') ?? openMerchants[0] ?? merchants[0], [openMerchants]);
  const activeMerchants = openMerchants.length;
  const avgEta = Math.round(openMerchants.reduce((sum, m) => sum + m.etaMins, 0) / Math.max(activeMerchants, 1));

  return (
    <View style={styles.root}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <SafeAreaView edges={['top']} style={styles.safeTop}>
          <View style={styles.topPad}>
            <View style={styles.headerRow}>
              <View style={styles.brandLockup}>
                <BrandMark size={44} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.brandName}>{AppBrand.name}</Text>
                  <View style={styles.locationRow}>
                    <Ionicons name="location" size={13} color={Brand.primary} />
                    <Text style={styles.locationText}>Kepong, Kuala Lumpur</Text>
                  </View>
                </View>
              </View>
              <Pressable style={styles.iconButton} onPress={() => setNotifOpen(true)} hitSlop={8}>
                <Ionicons name="notifications-outline" size={20} color={Brand.text} />
                <View style={styles.dot} />
              </Pressable>
            </View>

            <View style={styles.searchBar}>
              <Ionicons name="search" size={17} color={Brand.textMuted} />
              <Text style={styles.searchText}>{t('searchPlaceholder')}</Text>
              <View style={styles.filterChip}><Ionicons name="options-outline" size={16} color="#fff" /></View>
            </View>

            <Text style={styles.feedTitle}>{t('homeHeroTitle')}</Text>
          </View>
        </SafeAreaView>

        <View style={styles.bodyNoTop}>
          <Pressable onPress={() => router.push({ pathname: '/merchant/[id]', params: { id: heroMerchant.id } })}>
            <ImageBackground source={{ uri: heroMerchant.image }} imageStyle={styles.heroImage} style={styles.heroCard}>
              <LinearGradient colors={['rgba(11,18,32,0.04)', 'rgba(11,18,32,0.88)']} style={styles.heroOverlay}>
                <View style={styles.heroTopRow}>
                  <Badge text={heroMerchant.openNow ? t('openNow') : t('closed')} color="#fff" soft="rgba(255,255,255,0.18)" />
                  <View style={styles.heroEtaPill}>
                    <Ionicons name="time-outline" size={13} color="#fff" />
                    <Text style={styles.heroEtaText}>{heroMerchant.etaMins || '-'} min</Text>
                  </View>
                </View>
                <View style={styles.heroBottomRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.heroName}>{heroMerchant.name}</Text>
                    <Text style={styles.heroMeta}>{merchantHero(heroMerchant)}</Text>
                  </View>
                  <View style={styles.heroArrow}><Ionicons name="chevron-forward" size={20} color="#fff" /></View>
                </View>
              </LinearGradient>
            </ImageBackground>
          </Pressable>

          <View style={styles.categoryGrid}>
            {categories.map((category) => (
              <Pressable key={category.id} style={styles.categoryChip} onPress={() => router.push({ pathname: '/(tabs)/booking', params: { category: category.id } })}>
                <GradIcon icon={category.icon} grad={category.grad} size={38} iconSize={19} />
                <Text style={styles.categoryName} numberOfLines={1}>{categoryName(category)}</Text>
              </Pressable>
            ))}
          </View>

          <Card style={styles.walletStrip}>
            <View style={styles.walletTop}>
              <View style={styles.walletMain}>
                <View style={styles.walletIcon}><Ionicons name="wallet-outline" size={20} color={Brand.primary} /></View>
                <View>
                  <Text style={styles.walletLabel}>{t('walletBalance')}</Text>
                  <Text style={styles.walletAmount}>RM 128.80</Text>
                </View>
              </View>
              <Pressable style={styles.scanButton} onPress={() => router.push('/profile/member-qr')}>
                <Ionicons name="qr-code-outline" size={17} color="#fff" />
                <Text style={styles.scanButtonText}>{t('scanPay')}</Text>
              </Pressable>
            </View>
            <View style={styles.walletActions}>
              <WalletButton icon="gift-outline" label={t('rewards')} onPress={() => router.push('/profile/coupons')} />
              <WalletButton icon="storefront-outline" label={t('merchantTools')} onPress={() => router.push('/(tabs)/staff')} />
            </View>
          </Card>

          <View style={styles.overviewRow}>
            <MiniMetric icon="flash" value={String(activeMerchants)} label={t('nearbyNow')} />
            <MiniMetric icon="time-outline" value={`${avgEta}m`} label={t('readyOrders')} />
            <MiniMetric icon="star" value="4.8" label={t('featuredMerchants')} />
          </View>

          <SectionTitle title={t('premiumPicks')} action={t('viewAll')} onAction={() => router.push('/(tabs)/booking')} />
          <View style={styles.premiumGrid}>
            {premiumPicks.map((item) => (
              <PremiumPickCard key={`${item.slotType}-${item.merchant.id}`} merchant={item.merchant} slotType={item.slotType} />
            ))}
          </View>

          <SectionTitle title={t('promos')} />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.promoRail}>
          {promos.map((promo) => {
            const copy = promoDetail(promo);
            return (
              <LinearGradient key={promo.id} colors={Gradients[promo.grad]} style={styles.promoCard}>
                <View style={styles.promoIcon}><Ionicons name={promo.icon} size={21} color="#fff" /></View>
                <Text style={styles.promoTag}>{copy.tag}</Text>
                <Text style={styles.promoTitle}>{copy.title}</Text>
                <Text style={styles.promoSub}>{copy.sub}</Text>
              </LinearGradient>
            );
          })}
        </ScrollView>
      </ScrollView>

      <Modal visible={notifOpen} transparent animationType="fade" onRequestClose={() => setNotifOpen(false)}>
        <Pressable style={styles.modalBg} onPress={() => setNotifOpen(false)}>
          <Pressable style={styles.modalCard} onPress={() => {}}>
            <View style={styles.modalHead}>
              <Text style={styles.modalTitle}>{t('notificationsWhatsapp')}</Text>
              <Pressable onPress={() => setNotifOpen(false)} hitSlop={8}>
                <Ionicons name="close" size={22} color={Brand.textSub} />
              </Pressable>
            </View>
            {notifications.map((item) => {
              const copy = notification(item.id, item);
              return (
                <View key={item.id} style={styles.notifItem}>
                  <View style={styles.notifIcon}><Ionicons name={item.icon} size={20} color={Brand.primary} /></View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.notifTitle}>{copy.title}</Text>
                    <Text style={styles.notifSub}>{copy.body}</Text>
                  </View>
                </View>
              );
            })}
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

function WalletButton({ icon, label, onPress }: { icon: keyof typeof Ionicons.glyphMap; label: string; onPress: () => void }) {
  return (
    <Pressable style={styles.walletBtn} onPress={onPress}>
      <Ionicons name={icon} size={16} color={Brand.primary} />
      <Text style={styles.walletBtnText} numberOfLines={1}>{label}</Text>
    </Pressable>
  );
}

function MiniMetric({ icon, value, label }: { icon: keyof typeof Ionicons.glyphMap; value: string; label: string }) {
  return (
    <View style={styles.miniMetric}>
      <Ionicons name={icon} size={15} color={Brand.primary} />
      <Text style={styles.miniValue}>{value}</Text>
      <Text style={styles.miniLabel} numberOfLines={1}>{label}</Text>
    </View>
  );
}


function PremiumPickCard({ merchant, slotType }: { merchant: (typeof merchants)[number]; slotType: 'top' | 'sponsored' }) {
  const { t, merchantHero } = useI18n();
  const isSponsored = slotType === 'sponsored';
  return (
    <Pressable style={styles.premiumCardPress} onPress={() => router.push({ pathname: '/merchant/[id]', params: { id: merchant.id } })}>
      <ImageBackground source={{ uri: merchant.image }} imageStyle={styles.premiumImage} style={styles.premiumCard}>
        <LinearGradient colors={['rgba(15,23,42,0.02)', 'rgba(15,23,42,0.78)']} style={styles.premiumOverlay}>
          <View style={[styles.slotBadge, isSponsored ? styles.slotSponsored : styles.slotTop]}>
            <Text style={styles.slotText}>{isSponsored ? t('sponsored') : t('topMerchant')}</Text>
          </View>
          <View>
            <Text style={styles.premiumName} numberOfLines={1}>{merchant.name}</Text>
            <Text style={styles.premiumMeta} numberOfLines={1}>{merchantHero(merchant)}</Text>
            <View style={styles.premiumStats}>
              <Stars rating={merchant.rating} size={11} />
              <Text style={styles.premiumStatText}>{merchant.etaMins || '-'} min</Text>
            </View>
          </View>
        </LinearGradient>
      </ImageBackground>
    </Pressable>
  );
}
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Brand.bg },
  scroll: { paddingBottom: 24 },
  safeTop: { backgroundColor: Brand.bg },
  topPad: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 8 },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingBottom: 14 },
  brandLockup: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12 },
  brandName: { fontSize: 21, fontWeight: '900', color: Brand.text },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  locationText: { color: Brand.textSub, fontSize: 12, fontWeight: '800' },
  iconButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: Brand.card, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Brand.border, ...Shadow.card },
  dot: { position: 'absolute', top: 10, right: 10, width: 8, height: 8, borderRadius: 4, backgroundColor: Brand.primary },
  searchBar: { minHeight: 48, borderRadius: Radius.pill, backgroundColor: Brand.card, flexDirection: 'row', alignItems: 'center', gap: 9, paddingLeft: 15, paddingRight: 7, borderWidth: 1, borderColor: Brand.border, ...Shadow.card },
  searchText: { flex: 1, color: Brand.textMuted, fontSize: 13, fontWeight: '800' },
  filterChip: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center', backgroundColor: Brand.ink },
  feedTitle: { color: Brand.text, fontSize: 25, lineHeight: 31, fontWeight: '900', marginTop: 16, letterSpacing: 0 },
  bodyNoTop: { paddingHorizontal: 16, paddingTop: 8 },
  heroCard: { minHeight: 190, borderRadius: 28, overflow: 'hidden', marginBottom: 13, ...Shadow.soft },
  heroImage: { borderRadius: 28 },
  heroOverlay: { flex: 1, padding: 15, justifyContent: 'space-between' },
  heroTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  heroEtaPill: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 10, paddingVertical: 6, borderRadius: Radius.pill, backgroundColor: 'rgba(255,255,255,0.18)' },
  heroEtaText: { color: '#fff', fontSize: 11, fontWeight: '900' },
  heroBottomRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 12 },
  heroName: { color: '#fff', fontSize: 23, fontWeight: '900' },
  heroMeta: { color: 'rgba(255,255,255,0.82)', fontSize: 12, fontWeight: '700', marginTop: 5 },
  heroArrow: { width: 42, height: 42, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.18)', alignItems: 'center', justifyContent: 'center' },
  categoryGrid: { flexDirection: 'row', justifyContent: 'space-between', gap: 8, marginBottom: 14 },
  categoryChip: { flex: 1, minHeight: 68, borderRadius: 18, alignItems: 'center', justifyContent: 'center', gap: 7 },
  categoryName: { color: Brand.text, fontSize: 11, fontWeight: '900', textAlign: 'center' },
  walletStrip: { padding: 14, marginBottom: 13, borderRadius: 26 },
  walletTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  walletMain: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10, minWidth: 0 },
  walletIcon: { width: 42, height: 42, borderRadius: 16, backgroundColor: Brand.primarySoft, alignItems: 'center', justifyContent: 'center' },
  walletLabel: { color: Brand.textSub, fontSize: 11, fontWeight: '800' },
  walletAmount: { color: Brand.text, fontSize: 22, fontWeight: '900', marginTop: 2 },
  scanButton: { minHeight: 48, borderRadius: 18, paddingHorizontal: 14, backgroundColor: Brand.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, ...Shadow.card },
  scanButtonText: { color: '#fff', fontSize: 12, fontWeight: '900' },
  walletActions: { flexDirection: 'row', gap: 8, marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: Brand.border },
  walletBtn: { flex: 1, minHeight: 38, paddingHorizontal: 10, borderRadius: 15, backgroundColor: Brand.primarySoft, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5 },
  walletBtnText: { color: Brand.primary, fontSize: 10, fontWeight: '900' },
  overviewRow: { flexDirection: 'row', backgroundColor: Brand.ink, borderRadius: 22, overflow: 'hidden', marginBottom: 16, ...Shadow.card },
  miniMetric: { flex: 1, paddingVertical: 12, paddingHorizontal: 6, minHeight: 72, alignItems: 'center', justifyContent: 'center', borderRightWidth: 1, borderRightColor: 'rgba(255,255,255,0.1)' },
  miniValue: { color: '#fff', fontSize: 18, fontWeight: '900', marginTop: 4 },
  miniLabel: { color: 'rgba(255,255,255,0.68)', fontSize: 10, fontWeight: '800', marginTop: 2, textAlign: 'center' },
  premiumGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 },
  premiumCardPress: { width: '48.5%' },
  premiumCard: { height: 138, borderRadius: 24, overflow: 'hidden', backgroundColor: Brand.cardAlt, ...Shadow.card },
  premiumImage: { borderRadius: 24 },
  premiumOverlay: { flex: 1, justifyContent: 'space-between', padding: 10 },
  slotBadge: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 5, borderRadius: Radius.pill },
  slotTop: { backgroundColor: 'rgba(18,183,106,0.88)' },
  slotSponsored: { backgroundColor: 'rgba(249,115,22,0.9)' },
  slotText: { color: '#fff', fontSize: 9, fontWeight: '900' },
  premiumName: { color: '#fff', fontSize: 14, fontWeight: '900' },
  premiumMeta: { color: 'rgba(255,255,255,0.78)', fontSize: 10, fontWeight: '700', marginTop: 3 },
  premiumStats: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 6 },
  premiumStatText: { color: 'rgba(255,255,255,0.85)', fontSize: 10, fontWeight: '900' },
  promoRail: { gap: 10, paddingHorizontal: 16, paddingBottom: 18 },
  promoCard: { width: 178, minHeight: 132, borderRadius: 24, padding: 15, overflow: 'hidden' },
  promoIcon: { width: 36, height: 36, borderRadius: 15, backgroundColor: 'rgba(255,255,255,0.18)', alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  promoTag: { color: 'rgba(255,255,255,0.82)', fontSize: 11, fontWeight: '900' },
  promoTitle: { color: '#fff', fontSize: 18, fontWeight: '900', lineHeight: 22, marginTop: 8 },
  promoSub: { color: 'rgba(255,255,255,0.78)', fontSize: 11, lineHeight: 16, marginTop: 5 },
  modalBg: { flex: 1, backgroundColor: 'rgba(15,23,42,0.62)', justifyContent: 'center', paddingHorizontal: 24 },
  modalCard: { backgroundColor: '#fff', borderRadius: Radius.xl, padding: 18, ...Shadow.strong },
  modalHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  modalTitle: { fontSize: 17, fontWeight: '900', color: Brand.text },
  notifItem: { flexDirection: 'row', gap: 12, alignItems: 'center', paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: Brand.border },
  notifIcon: { width: 38, height: 38, borderRadius: 14, backgroundColor: Brand.primarySoft, alignItems: 'center', justifyContent: 'center' },
  notifTitle: { color: Brand.text, fontSize: 13, fontWeight: '900' },
  notifSub: { color: Brand.textSub, fontSize: 12, marginTop: 3, lineHeight: 17 },
});



