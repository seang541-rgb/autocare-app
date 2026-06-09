import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { ImageBackground, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BrandMark } from '@/components/brand-icons';
import { Badge, Card, GradIcon, Stars } from '@/components/ui';
import { AppBrand, Brand, Radius, Shadow } from '@/constants/brand';
import { categories, CategoryId, merchants } from '@/constants/data';
import { useI18n } from '@/store/i18n';

function one(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

export default function ExploreScreen() {
  const params = useLocalSearchParams<{ category?: string }>();
  const { t, categoryName, merchantHero } = useI18n();
  const initial = one(params.category) as CategoryId | undefined;
  const [categoryId, setCategoryId] = useState<CategoryId | 'all'>(initial ?? 'all');
  const filtered = useMemo(() => (categoryId === 'all' ? merchants : merchants.filter((m) => m.categoryId === categoryId)), [categoryId]);
  const leadMerchant = filtered[0] ?? merchants[0];

  return (
    <View style={styles.root}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <SafeAreaView edges={['top']}>
          <View style={styles.header}>
            <View style={styles.headerTop}>
              <BrandMark size={42} />
              <View style={{ flex: 1 }}>
                <Text style={styles.appName}>{AppBrand.name}</Text>
                <Text style={styles.headerSub}>{t('exploreSub')}</Text>
              </View>
            </View>
            <Text style={styles.headerTitle}>{t('exploreTitle')}</Text>
            <View style={styles.searchBar}>
              <Ionicons name="search" size={17} color={Brand.textMuted} />
              <Text style={styles.searchText}>{t('searchPlaceholder')}</Text>
              <Ionicons name="options-outline" size={17} color={Brand.textSub} />
            </View>
          </View>
        </SafeAreaView>

        {leadMerchant ? (
          <Pressable style={styles.leadWrap} onPress={() => router.push({ pathname: '/merchant/[id]', params: { id: leadMerchant.id } })}>
            <ImageBackground source={{ uri: leadMerchant.image }} imageStyle={styles.leadImage} style={styles.leadCard}>
              <View style={styles.leadOverlay}>
                <Badge text={leadMerchant.openNow ? t('openNow') : t('closed')} color="#fff" soft="rgba(255,255,255,0.18)" />
                <View>
                  <Text style={styles.leadName}>{leadMerchant.name}</Text>
                  <Text style={styles.leadMeta}>{merchantHero(leadMerchant)}</Text>
                </View>
              </View>
            </ImageBackground>
          </Pressable>
        ) : null}

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
          <Pressable onPress={() => setCategoryId('all')} style={[styles.chip, categoryId === 'all' && styles.chipOn]}>
            <Text style={[styles.chipText, categoryId === 'all' && styles.chipTextOn]}>{t('allCategories')}</Text>
          </Pressable>
          {categories.map((category) => {
            const on = category.id === categoryId;
            return (
              <Pressable key={category.id} onPress={() => setCategoryId(category.id)} style={[styles.chip, on && styles.chipOn]}>
                <GradIcon icon={category.icon} grad={category.grad} size={30} iconSize={15} />
                <Text style={[styles.chipText, on && styles.chipTextOn]}>{categoryName(category)}</Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <View style={styles.listWrap}>
          {filtered.map((merchant) => (
            <Pressable key={merchant.id} onPress={() => router.push({ pathname: '/merchant/[id]', params: { id: merchant.id } })}>
              <Card style={styles.row}>
                <ImageBackground source={{ uri: merchant.image }} imageStyle={styles.thumbImage} style={styles.thumb} />
                <View style={{ flex: 1 }}>
                  <View style={styles.rowTop}>
                    <Text style={styles.name} numberOfLines={1}>{merchant.name}</Text>
                    <Badge text={merchant.openNow ? t('openNow') : t('closed')} color={merchant.openNow ? Brand.success : Brand.textSub} soft={merchant.openNow ? Brand.successSoft : Brand.border} />
                  </View>
                  <Text style={styles.hero} numberOfLines={1}>{merchantHero(merchant)}</Text>
                  <View style={styles.metaRow}>
                    <Stars rating={merchant.rating} />
                    <Text style={styles.meta}>{merchant.distanceKm} km</Text>
                    <Text style={styles.meta}>{merchant.etaMins || '-'} min</Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={18} color={Brand.textMuted} />
              </Card>
            </Pressable>
          ))}
        </View>

        <View style={styles.infoPanel}>
          <Ionicons name="business-outline" size={22} color={Brand.primary} />
          <View style={{ flex: 1 }}>
            <Text style={styles.infoTitle}>{t('merchantPlatformReady')}</Text>
            <Text style={styles.infoSub}>{t('merchantPlatformBody')}</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Brand.bg },
  scroll: { paddingBottom: 24 },
  header: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 8 },
  headerTop: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  appName: { color: Brand.text, fontSize: 16, fontWeight: '900' },
  headerSub: { fontSize: 12, color: Brand.textSub, marginTop: 3, lineHeight: 17 },
  headerTitle: { fontSize: 28, fontWeight: '900', color: Brand.text, marginTop: 18 },
  searchBar: { minHeight: 46, borderRadius: Radius.pill, backgroundColor: Brand.card, flexDirection: 'row', alignItems: 'center', gap: 9, paddingHorizontal: 14, borderWidth: 1, borderColor: Brand.border, marginTop: 14, ...Shadow.card },
  searchText: { flex: 1, color: Brand.textMuted, fontSize: 13, fontWeight: '800' },
  leadWrap: { paddingHorizontal: 16, paddingTop: 8 },
  leadCard: { minHeight: 166, borderRadius: 28, overflow: 'hidden', ...Shadow.soft },
  leadImage: { borderRadius: 28 },
  leadOverlay: { flex: 1, justifyContent: 'space-between', padding: 15, backgroundColor: 'rgba(11,18,32,0.34)' },
  leadName: { color: '#fff', fontSize: 23, fontWeight: '900' },
  leadMeta: { color: 'rgba(255,255,255,0.82)', fontSize: 12, fontWeight: '700', marginTop: 4 },
  chips: { gap: 8, paddingHorizontal: 16, paddingTop: 14, paddingBottom: 14 },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 7, paddingHorizontal: 12, paddingVertical: 8, borderRadius: Radius.pill, backgroundColor: Brand.card, borderWidth: 1, borderColor: Brand.border },
  chipOn: { backgroundColor: Brand.primarySoft, borderColor: Brand.primary },
  chipText: { color: Brand.textSub, fontSize: 13, fontWeight: '900' },
  chipTextOn: { color: Brand.primary },
  listWrap: { paddingHorizontal: 16, gap: 10 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 10 },
  thumb: { width: 72, height: 72, borderRadius: 20, overflow: 'hidden', backgroundColor: Brand.cardAlt },
  thumbImage: { borderRadius: 20 },
  rowTop: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  name: { flex: 1, color: Brand.text, fontSize: 16, fontWeight: '900' },
  hero: { color: Brand.textSub, fontSize: 12, marginTop: 4 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 9, marginTop: 8 },
  meta: { color: Brand.textSub, fontSize: 12, fontWeight: '800' },
  infoPanel: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: Brand.card, borderWidth: 1, borderColor: Brand.border, borderRadius: Radius.lg, padding: 14, marginTop: 18, marginHorizontal: 16, ...Shadow.card },
  infoTitle: { color: Brand.text, fontSize: 14, fontWeight: '900' },
  infoSub: { color: Brand.textSub, fontSize: 12, lineHeight: 17, marginTop: 3 },
});
