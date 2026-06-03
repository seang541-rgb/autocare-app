import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Card, GradIcon } from '@/components/ui';
import { Brand, Gradients, Radius, Shadow } from '@/constants/brand';
import { services } from '@/constants/data';
import { useI18n } from '@/store/i18n';

export default function BookingScreen() {
  const [serviceId, setServiceId] = useState(services[0].id);
  const service = services.find((s) => s.id === serviceId)!;
  const { t, serviceName, serviceDesc } = useI18n();

  function startBooking() {
    router.push({ pathname: '/service/[id]', params: { id: serviceId } });
  }

  return (
    <View style={styles.root}>
      <LinearGradient colors={Gradients.hero} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.headerGrad}>
        <SafeAreaView edges={['top']}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>{t('bookingTitle')}</Text>
            <Text style={styles.headerSub}>{t('bookingSub')}</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <Text style={styles.section}>{t('chooseServiceType')}</Text>
        <View style={{ gap: 12 }}>
          {services.map((s) => {
            const on = s.id === serviceId;
            return (
              <Pressable key={s.id} onPress={() => setServiceId(s.id)}>
                <Card style={[styles.svcRow, on && { borderWidth: 2, borderColor: Brand.primary }]}>
                  <GradIcon icon={s.icon} grad={s.grad} size={48} iconSize={24} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.svcName}>{serviceName(s.id)}</Text>
                    <Text style={styles.svcDesc}>{serviceDesc(s.id)}</Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={styles.svcFrom}>{s.from > 0 ? t('fromPrice', { price: s.from }) : t('free')}</Text>
                    <View style={[styles.radio, on && styles.radioOn]}>
                      {on && <Ionicons name="checkmark" size={12} color="#fff" />}
                    </View>
                  </View>
                </Card>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.section}>{t('bookingFlow')}</Text>
        <Card>
          {[
            { n: '1', title: t('step1Title'), desc: t('step1Desc') },
            { n: '2', title: t('step2Title'), desc: t('step2Desc') },
            { n: '3', title: t('step3Title'), desc: t('step3Desc') },
            { n: '4', title: t('step4Title'), desc: t('step4Desc') },
          ].map((step, i, arr) => (
            <View key={step.n} style={[styles.stepRow, i === arr.length - 1 && { borderBottomWidth: 0 }]}>
              <LinearGradient colors={Gradients.brand} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.stepNo}>
                <Text style={styles.stepNoText}>{step.n}</Text>
              </LinearGradient>
              <View style={{ flex: 1 }}>
                <Text style={styles.stepTitle}>{step.title}</Text>
                <Text style={styles.stepDesc}>{step.desc}</Text>
              </View>
            </View>
          ))}
        </Card>

        <View style={{ height: 20 }} />
      </ScrollView>

      <View style={styles.footer}>
        <View>
          <Text style={styles.footLabel}>{t('selected')}</Text>
          <Text style={styles.footVal}>{serviceName(service.id)}</Text>
        </View>
        <Pressable onPress={startBooking}>
          <LinearGradient colors={Gradients.brand} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.cta}>
            <Text style={styles.ctaText}>{t('startBooking')}</Text>
            <Ionicons name="arrow-forward" size={18} color="#fff" />
          </LinearGradient>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Brand.bg },
  headerGrad: { borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  header: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 18 },
  headerTitle: { fontSize: 20, fontWeight: '900', color: '#fff' },
  headerSub: { fontSize: 12, color: Brand.textOnDarkSub, marginTop: 3 },
  scroll: { paddingHorizontal: 16, paddingTop: 14, paddingBottom: 16 },
  section: { fontSize: 14, fontWeight: '800', color: Brand.text, marginTop: 6, marginBottom: 12 },
  svcRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12 },
  svcName: { fontSize: 15, fontWeight: '800', color: Brand.text },
  svcDesc: { fontSize: 12, color: Brand.textSub, marginTop: 3 },
  svcFrom: { fontSize: 13, fontWeight: '800', color: Brand.primary, marginBottom: 6 },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: Brand.border, alignItems: 'center', justifyContent: 'center' },
  radioOn: { borderColor: Brand.primary, backgroundColor: Brand.primary },
  stepRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: Brand.border },
  stepNo: { width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  stepNoText: { color: '#fff', fontSize: 14, fontWeight: '900' },
  stepTitle: { fontSize: 14, fontWeight: '700', color: Brand.text },
  stepDesc: { fontSize: 12, color: Brand.textSub, marginTop: 2 },
  footer: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingTop: 12, paddingBottom: Platform.OS === 'ios' ? 28 : 14,
    backgroundColor: Brand.card, borderTopWidth: 1, borderTopColor: Brand.border,
  },
  footLabel: { fontSize: 11, color: Brand.textSub },
  footVal: { fontSize: 18, fontWeight: '900', color: Brand.text, marginTop: 2 },
  cta: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 32, paddingVertical: 15, borderRadius: Radius.pill, ...Shadow.soft },
  ctaText: { color: '#fff', fontSize: 16, fontWeight: '800' },
});
