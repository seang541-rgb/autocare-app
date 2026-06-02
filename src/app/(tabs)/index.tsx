import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Badge, Card, GradIcon, SectionTitle, Stars } from '@/components/ui';
import { AppBrand, Brand, Gradients, Radius, Shadow } from '@/constants/brand';
import { notifications, outlets, profile, promos, services } from '@/constants/data';
import { useI18n } from '@/store/i18n';
import { useToast } from '@/store/toast';

export default function HomeScreen() {
  const [notifOpen, setNotifOpen] = useState(false);
  const toast = useToast();
  const { t } = useI18n();
  const bestOutlet = useMemo(
    () => [...outlets].sort((a, b) => Number(b.openNow) - Number(a.openNow) || a.waitMins - b.waitMins)[0],
    [],
  );

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <SafeAreaView edges={['top']}>
          <View style={styles.headerRow}>
            <View style={styles.brandMark}>
              <Ionicons name="car-sport" size={19} color="#fff" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.brandName}>{AppBrand.name}</Text>
              <View style={styles.locationRow}>
                <Ionicons name="location" size={13} color={Brand.primary} />
                <Text style={styles.locationText}>Kepong, Kuala Lumpur</Text>
              </View>
            </View>
            <Pressable style={styles.iconButton} onPress={() => setNotifOpen(true)} hitSlop={8}>
              <Ionicons name="notifications-outline" size={20} color={Brand.text} />
              <View style={styles.dot} />
            </Pressable>
          </View>
        </SafeAreaView>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={styles.body}>
          <Card style={styles.readyCard}>
            <View style={styles.readyTop}>
              <View>
                <Text style={styles.eyebrow}>最快可预约</Text>
                <Text style={styles.readyTitle}>{bestOutlet.name}</Text>
                <Text style={styles.readyMeta}>{bestOutlet.area} · {bestOutlet.distanceKm}km · {bestOutlet.open}</Text>
              </View>
              <Badge text={bestOutlet.openNow ? '营业中' : '休息中'} color={bestOutlet.openNow ? Brand.success : Brand.textSub} soft={bestOutlet.openNow ? Brand.successSoft : Brand.border} />
            </View>

            <View style={styles.availability}>
              <Metric icon="car-sport-outline" label="排队车辆" value={`${bestOutlet.queueCars} 辆`} />
              <Metric icon="time-outline" label="预计等待" value={`${bestOutlet.waitMins} 分钟`} />
              <Metric icon="star" label="门店评分" value={bestOutlet.rating.toFixed(1)} />
            </View>

            <Pressable onPress={() => router.push({ pathname: '/service/[id]', params: { id: 'wash' } })}>
              <LinearGradient colors={Gradients.brand} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.primaryCta}>
                <Text style={styles.primaryCtaText}>立即预约洗车</Text>
                <Ionicons name="arrow-forward" size={18} color="#fff" />
              </LinearGradient>
            </Pressable>
          </Card>

          <View style={styles.packageRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.packageLabel}>我的月卡</Text>
              <Text style={styles.packageValue}>{profile.packageLeft}/{profile.packageTotal} 次可用</Text>
            </View>
            <View style={styles.packageBar}>
              <View style={[styles.packageFill, { width: `${(profile.packageLeft / profile.packageTotal) * 100}%` }]} />
            </View>
          </View>

          <SectionTitle title="服务分类" />
          <View style={styles.serviceGrid}>
            {services.map((service) => (
              <Pressable key={service.id} style={styles.serviceTile} onPress={() => router.push({ pathname: '/service/[id]', params: { id: service.id } })}>
                <GradIcon icon={service.icon} grad={service.grad} size={38} iconSize={18} />
                <Text style={styles.serviceName}>{service.name}</Text>
                <Text style={styles.serviceDesc} numberOfLines={1}>{service.desc}</Text>
              </Pressable>
            ))}
          </View>

          <SectionTitle title={t('queueStatus')} action="问 AI 客服" onAction={() => toast('AI 客服：JagaWash 甲洞店最快，预计等 12 分钟。')} />
          <Card style={styles.mapCard}>
            <View style={styles.mapCanvas}>
              <View style={styles.mapRoadH} />
              <View style={styles.mapRoadV} />
              {outlets.map((outlet, index) => (
                <View key={outlet.id} style={[styles.pin, { left: `${16 + index * 30}%`, top: `${24 + (index % 2) * 36}%` }]}>
                  <Ionicons name="location-sharp" size={25} color={outlet.openNow ? Brand.primary : Brand.textMuted} />
                </View>
              ))}
            </View>
            <View style={styles.outletList}>
              {outlets.map((outlet) => (
                <View key={outlet.id} style={styles.outletRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.outletName}>{outlet.name}</Text>
                    <Text style={styles.outletSub}>{outlet.queueCars} 辆排队 · 等 {outlet.waitMins} 分钟</Text>
                  </View>
                  <Stars rating={outlet.rating} />
                </View>
              ))}
            </View>
          </Card>

          <SectionTitle title="优惠" />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hScroll}>
          {promos.map((promo) => (
            <Pressable key={promo.id} onPress={() => router.push({ pathname: '/promo/[id]', params: { id: promo.id } })}>
              <View style={styles.promoCard}>
                <View style={styles.promoHead}>
                  <Badge text={promo.tag} color={Brand.primary} soft={Brand.primarySoft} />
                  <Ionicons name={promo.icon} size={22} color={Brand.primary} />
                </View>
                <Text style={styles.promoTitle}>{promo.title}</Text>
                <Text style={styles.promoSub}>{promo.sub}</Text>
              </View>
            </Pressable>
          ))}
        </ScrollView>

        <View style={styles.body}>
          <Pressable style={styles.aiPanel} onPress={() => toast('AI 客服：可以帮你改期、查排队、提交投诉。')}>
            <Ionicons name="logo-whatsapp" size={22} color="#25D366" />
            <View style={{ flex: 1 }}>
              <Text style={styles.aiTitle}>{t('aiCare')}</Text>
              <Text style={styles.aiSub}>预约提醒、付款通知和投诉跟进都从这里处理。</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={Brand.textSub} />
          </Pressable>
        </View>

        <View style={{ height: 18 }} />
      </ScrollView>

      <Modal visible={notifOpen} transparent animationType="fade" onRequestClose={() => setNotifOpen(false)}>
        <Pressable style={styles.modalBg} onPress={() => setNotifOpen(false)}>
          <Pressable style={styles.modalCard} onPress={() => {}}>
            <View style={styles.modalHead}>
              <Text style={styles.modalTitle}>通知与 WhatsApp</Text>
              <Pressable onPress={() => setNotifOpen(false)} hitSlop={8}>
                <Ionicons name="close" size={22} color={Brand.textSub} />
              </Pressable>
            </View>
            {notifications.map((item) => (
              <View key={item.id} style={styles.notifItem}>
                <Ionicons name={item.icon} size={22} color={Brand.primary} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.notifTitle}>{item.title}</Text>
                  <Text style={styles.notifSub}>{item.body}</Text>
                </View>
              </View>
            ))}
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

function Metric({ icon, label, value }: { icon: keyof typeof Ionicons.glyphMap; label: string; value: string }) {
  return (
    <View style={styles.metric}>
      <Ionicons name={icon} size={16} color={Brand.primary} />
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Brand.bg },
  header: { backgroundColor: Brand.card, borderBottomWidth: 1, borderBottomColor: Brand.border },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingTop: 8, paddingBottom: 14 },
  brandMark: { width: 38, height: 38, borderRadius: 10, backgroundColor: Brand.ink, alignItems: 'center', justifyContent: 'center' },
  brandName: { fontSize: 19, fontWeight: '900', color: Brand.text },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  locationText: { color: Brand.textSub, fontSize: 12, fontWeight: '700' },
  iconButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: Brand.bg, alignItems: 'center', justifyContent: 'center' },
  dot: { position: 'absolute', top: 9, right: 10, width: 8, height: 8, borderRadius: 4, backgroundColor: Brand.primary },
  scroll: { paddingTop: 14 },
  body: { paddingHorizontal: 16 },
  readyCard: { ...Shadow.soft },
  readyTop: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  eyebrow: { color: Brand.primary, fontSize: 11, fontWeight: '900', marginBottom: 5 },
  readyTitle: { color: Brand.text, fontSize: 20, fontWeight: '900' },
  readyMeta: { color: Brand.textSub, fontSize: 12, marginTop: 4 },
  availability: { flexDirection: 'row', gap: 8, marginTop: 16 },
  metric: { flex: 1, backgroundColor: Brand.bg, borderRadius: Radius.md, padding: 10, gap: 3 },
  metricValue: { color: Brand.text, fontSize: 15, fontWeight: '900' },
  metricLabel: { color: Brand.textSub, fontSize: 10, fontWeight: '700' },
  primaryCta: { marginTop: 16, borderRadius: Radius.md, paddingVertical: 14, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8 },
  primaryCtaText: { color: '#fff', fontWeight: '900', fontSize: 15 },
  packageRow: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: Brand.card, borderWidth: 1, borderColor: Brand.border, borderRadius: Radius.lg, padding: 14, marginTop: 12, marginBottom: 18 },
  packageLabel: { color: Brand.textSub, fontSize: 11, fontWeight: '700' },
  packageValue: { color: Brand.text, fontSize: 15, fontWeight: '900', marginTop: 2 },
  packageBar: { width: 96, height: 8, borderRadius: 4, overflow: 'hidden', backgroundColor: Brand.border },
  packageFill: { height: 8, borderRadius: 4, backgroundColor: Brand.primary },
  serviceGrid: { flexDirection: 'row', gap: 10, marginBottom: 18 },
  serviceTile: { flex: 1, backgroundColor: Brand.card, borderWidth: 1, borderColor: Brand.border, borderRadius: Radius.lg, padding: 12 },
  serviceName: { color: Brand.text, fontSize: 13, fontWeight: '900', marginTop: 8 },
  serviceDesc: { color: Brand.textSub, fontSize: 10, marginTop: 3 },
  mapCard: { padding: 12, marginBottom: 18 },
  mapCanvas: { height: 112, borderRadius: Radius.md, backgroundColor: Brand.blueSoft, overflow: 'hidden' },
  mapRoadH: { position: 'absolute', left: -20, right: -20, top: 52, height: 14, backgroundColor: 'rgba(255,255,255,0.72)', transform: [{ rotate: '-8deg' }] },
  mapRoadV: { position: 'absolute', top: -20, bottom: -20, left: 172, width: 14, backgroundColor: 'rgba(255,255,255,0.72)', transform: [{ rotate: '15deg' }] },
  pin: { position: 'absolute' },
  outletList: { marginTop: 10 },
  outletRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 9, borderBottomWidth: 1, borderBottomColor: Brand.border },
  outletName: { color: Brand.text, fontSize: 13, fontWeight: '800' },
  outletSub: { color: Brand.textSub, fontSize: 11, marginTop: 2 },
  hScroll: { gap: 10, paddingHorizontal: 16, paddingBottom: 16 },
  promoCard: { width: 170, minHeight: 116, borderRadius: Radius.lg, borderWidth: 1, borderColor: Brand.border, backgroundColor: Brand.card, padding: 14 },
  promoHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  promoTitle: { color: Brand.text, fontSize: 18, fontWeight: '900', lineHeight: 22, marginTop: 12 },
  promoSub: { color: Brand.textSub, fontSize: 11, marginTop: 6 },
  aiPanel: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: Brand.card, borderWidth: 1, borderColor: Brand.border, borderRadius: Radius.lg, padding: 14 },
  aiTitle: { color: Brand.text, fontSize: 14, fontWeight: '900' },
  aiSub: { color: Brand.textSub, fontSize: 11, marginTop: 3 },
  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', paddingHorizontal: 24 },
  modalCard: { backgroundColor: '#fff', borderRadius: Radius.lg, padding: 18 },
  modalHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  modalTitle: { fontSize: 17, fontWeight: '900', color: Brand.text },
  notifItem: { flexDirection: 'row', gap: 12, alignItems: 'center', paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: Brand.border },
  notifTitle: { fontSize: 13, fontWeight: '800', color: Brand.text },
  notifSub: { fontSize: 12, color: Brand.textSub, marginTop: 2 },
});
