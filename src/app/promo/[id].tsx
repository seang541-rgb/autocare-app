import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Card } from '@/components/ui';
import { Brand, Gradients, Radius, Shadow } from '@/constants/brand';
import { promos } from '@/constants/data';
import { useToast } from '@/store/toast';

export default function PromoDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const promo = promos.find((p) => p.id === id) ?? promos[0];
  const toast = useToast();

  function buy() {
    if (promo.bookServiceId) {
      router.push({
        pathname: '/confirm',
        params: {
          service: promo.fullTitle,
          icon: promo.icon,
          grad: 'wash',
          addons: '促销活动',
          price: String(promo.bookPrice ?? promo.price),
        },
      });
    } else {
      toast('报价功能开发中，敬请期待');
    }
  }

  return (
    <View style={styles.root}>
      {/* 渐变大头图 */}
      <LinearGradient colors={Gradients[promo.grad]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.hero}>
        <SafeAreaView edges={['top']}>
          <View style={styles.heroTop}>
            <Pressable style={styles.back} onPress={() => (router.canGoBack() ? router.back() : router.replace('/(tabs)'))} hitSlop={8}>
              <Ionicons name="chevron-back" size={22} color="#fff" />
            </Pressable>
          </View>
          <View style={styles.heroBody}>
            <View style={styles.tag}>
              <Text style={styles.tagText}>{promo.tag}</Text>
            </View>
            <Text style={styles.heroTitle}>{promo.fullTitle}</Text>
            <Text style={styles.heroSub}>{promo.sub}</Text>
            <Ionicons name={promo.icon} size={120} color="rgba(255,255,255,0.16)" style={styles.ghost} />
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* 价格卡 */}
        <Card style={styles.priceCard}>
          {promo.price > 0 ? (
            <View style={styles.priceRow}>
              <Text style={styles.priceCur}>RM</Text>
              <Text style={styles.priceVal}>{promo.price}</Text>
              <Text style={styles.priceUnit}>{promo.unit}</Text>
              {promo.originalPrice ? <Text style={styles.priceOrig}>RM{promo.originalPrice}</Text> : null}
            </View>
          ) : (
            <Text style={styles.priceFree}>免费报价</Text>
          )}
          {promo.originalPrice ? (
            <View style={styles.saveBadge}>
              <Ionicons name="pricetag" size={12} color="#fff" />
              <Text style={styles.saveText}>立省 RM{promo.originalPrice - promo.price}</Text>
            </View>
          ) : null}
        </Card>

        {/* 卖点 */}
        <Text style={styles.section}>活动权益</Text>
        <Card>
          {promo.bullets.map((b, i, arr) => (
            <View key={b} style={[styles.bulletRow, i === arr.length - 1 && { borderBottomWidth: 0 }]}>
              <Ionicons name="checkmark-circle" size={18} color={Brand.success} />
              <Text style={styles.bulletText}>{b}</Text>
            </View>
          ))}
        </Card>

        {/* 条款 */}
        <Text style={styles.section}>使用须知</Text>
        <Card>
          {promo.terms.map((t) => (
            <View key={t} style={styles.termRow}>
              <Text style={styles.termDot}>•</Text>
              <Text style={styles.termText}>{t}</Text>
            </View>
          ))}
        </Card>

        <View style={{ height: 20 }} />
      </ScrollView>

      {/* 底部购买 */}
      <View style={styles.footer}>
        {promo.price > 0 ? (
          <View>
            <Text style={styles.footLabel}>优惠价</Text>
            <Text style={styles.footPrice}>RM {promo.price}<Text style={styles.footUnit}>{promo.unit}</Text></Text>
          </View>
        ) : (
          <View>
            <Text style={styles.footLabel}>限时活动</Text>
            <Text style={styles.footPrice}>0 元报价</Text>
          </View>
        )}
        <Pressable onPress={buy}>
          <LinearGradient colors={Gradients.brand} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.cta}>
            <Text style={styles.ctaText}>{promo.ctaText}</Text>
            <Ionicons name="arrow-forward" size={18} color="#fff" />
          </LinearGradient>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Brand.bg },
  hero: { borderBottomLeftRadius: 28, borderBottomRightRadius: 28 },
  heroTop: { paddingHorizontal: 12, paddingTop: 6 },
  back: { width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(255,255,255,0.14)', alignItems: 'center', justifyContent: 'center' },
  heroBody: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 28, overflow: 'hidden' },
  tag: { alignSelf: 'flex-start', backgroundColor: 'rgba(255,255,255,0.25)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: Radius.pill, marginBottom: 12 },
  tagText: { color: '#fff', fontSize: 11, fontWeight: '800' },
  heroTitle: { color: '#fff', fontSize: 24, fontWeight: '900' },
  heroSub: { color: 'rgba(255,255,255,0.9)', fontSize: 13, marginTop: 6 },
  ghost: { position: 'absolute', right: -10, bottom: -20 },
  scroll: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 16 },
  priceCard: { marginTop: -16, ...Shadow.soft, alignItems: 'flex-start' },
  priceRow: { flexDirection: 'row', alignItems: 'flex-end' },
  priceCur: { fontSize: 16, fontWeight: '800', color: Brand.primary, marginBottom: 6, marginRight: 2 },
  priceVal: { fontSize: 40, fontWeight: '900', color: Brand.primary, lineHeight: 44 },
  priceUnit: { fontSize: 15, fontWeight: '700', color: Brand.textSub, marginBottom: 7, marginLeft: 2 },
  priceOrig: { fontSize: 15, color: Brand.textSub, textDecorationLine: 'line-through', marginBottom: 8, marginLeft: 10 },
  priceFree: { fontSize: 28, fontWeight: '900', color: Brand.success },
  saveBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: Brand.primary, paddingHorizontal: 10, paddingVertical: 4, borderRadius: Radius.pill, marginTop: 12 },
  saveText: { color: '#fff', fontSize: 12, fontWeight: '800' },
  section: { fontSize: 14, fontWeight: '800', color: Brand.text, marginTop: 20, marginBottom: 10 },
  bulletRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 11, borderBottomWidth: 1, borderBottomColor: Brand.border },
  bulletText: { fontSize: 13, color: Brand.text, flex: 1, fontWeight: '600' },
  termRow: { flexDirection: 'row', gap: 8, paddingVertical: 5 },
  termDot: { color: Brand.textSub, fontSize: 13 },
  termText: { fontSize: 12, color: Brand.textSub, flex: 1, lineHeight: 18 },
  footer: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingTop: 12, paddingBottom: Platform.OS === 'ios' ? 28 : 14,
    backgroundColor: Brand.card, borderTopWidth: 1, borderTopColor: Brand.border,
  },
  footLabel: { fontSize: 11, color: Brand.textSub },
  footPrice: { fontSize: 22, fontWeight: '900', color: Brand.text, marginTop: 2 },
  footUnit: { fontSize: 13, fontWeight: '700', color: Brand.textSub },
  cta: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 28, paddingVertical: 15, borderRadius: Radius.pill, ...Shadow.soft },
  ctaText: { color: '#fff', fontSize: 16, fontWeight: '800' },
});
