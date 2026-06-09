import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { BackHeader, Card } from '@/components/ui';
import { Brand, Gradients, Radius, Shadow } from '@/constants/brand';
import { services } from '@/constants/data';
import { useI18n } from '@/store/i18n';

const specs = [
  { id: 'sedan', icon: 'car-outline' as const, price: 12 },
  { id: 'suv', icon: 'car-sport-outline' as const, price: 18 },
  { id: 'big', icon: 'bus-outline' as const, price: 25 },
];

const addons = [
  { id: 'vacuum', price: 0, free: true },
  { id: 'wax', price: 15 },
  { id: 'tyre', price: 8 },
  { id: 'fragrance', price: 10 },
];

export default function ServiceDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const service = services.find((s) => s.id === id) ?? services[0];
  const { t, serviceName, serviceDesc, vehicleSpec, addOn, includedItems } = useI18n();

  const [specId, setSpecId] = useState('sedan');
  const [picked, setPicked] = useState<string[]>(['vacuum']);

  const spec = specs.find((s) => s.id === specId)!;
  const total = useMemo(() => {
    const add = addons.filter((a) => picked.includes(a.id)).reduce((s, a) => s + a.price, 0);
    return spec.price + add;
  }, [spec, picked]);

  function toggle(aid: string) {
    setPicked((p) => (p.includes(aid) ? p.filter((x) => x !== aid) : [...p, aid]));
  }

  function next() {
    const addNames = addons.filter((a) => picked.includes(a.id)).map((a) => addOn(a.id).name);
    router.push({
      pathname: '/confirm',
      params: {
        service: `${serviceName(service.id)} (${vehicleSpec(spec.id)})`,
        icon: service.icon,
        grad: service.grad,
        addons: addNames.join(', ') || t('none'),
        price: String(total),
      },
    });
  }

  return (
    <View style={styles.root}>
      <BackHeader title={serviceName(service.id)} sub={service.brand} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <LinearGradient colors={Gradients[service.grad]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.hero}>
          <Ionicons name={service.icon} size={44} color="#fff" />
          <View style={{ flex: 1 }}>
            <Text style={styles.heroTitle}>{serviceName(service.id)}</Text>
            <Text style={styles.heroDesc}>{serviceDesc(service.id)}</Text>
          </View>
        </LinearGradient>

        <Text style={styles.section}>{t('packageIncluded')}</Text>
        <Card>
          <View style={styles.incWrap}>
            {includedItems().map((it) => (
              <View key={it} style={styles.incItem}>
                <Ionicons name="checkmark-circle" size={16} color={Brand.success} />
                <Text style={styles.incText}>{it}</Text>
              </View>
            ))}
          </View>
        </Card>

        <Text style={styles.section}>{t('chooseVehicle')}</Text>
        <View style={{ gap: 10 }}>
          {specs.map((s) => {
            const on = s.id === specId;
            return (
              <Pressable key={s.id} onPress={() => setSpecId(s.id)}>
                <Card style={[styles.specRow, on && { borderWidth: 2, borderColor: Brand.primary }]}>
                  <Ionicons name={s.icon} size={24} color={on ? Brand.primary : Brand.textSub} />
                  <Text style={[styles.specName, on && { color: Brand.primary }]}>{vehicleSpec(s.id)}</Text>
                  <Text style={styles.specPrice}>RM{s.price}</Text>
                  <View style={[styles.radio, on && styles.radioOn]}>
                    {on && <Ionicons name="checkmark" size={12} color="#fff" />}
                  </View>
                </Card>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.section}>{t('addOns')}</Text>
        <View style={{ gap: 10 }}>
          {addons.map((a) => {
            const on = picked.includes(a.id);
            const copy = addOn(a.id);
            return (
              <Pressable key={a.id} onPress={() => toggle(a.id)}>
                <Card style={[styles.addRow, on && { borderWidth: 2, borderColor: Brand.primary }]}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.addName}>{copy.name}</Text>
                    <Text style={styles.addDesc}>{copy.desc}</Text>
                  </View>
                  <Text style={[styles.addPrice, a.free && { color: Brand.success }]}>
                    {a.free ? t('free') : `+RM${a.price}`}
                  </Text>
                  <View style={[styles.check, on && styles.checkOn]}>
                    {on && <Ionicons name="checkmark" size={13} color="#fff" />}
                  </View>
                </Card>
              </Pressable>
            );
          })}
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>

      <View style={styles.footer}>
        <View>
          <Text style={styles.footLabel}>{t('total')}</Text>
          <Text style={styles.footPrice}>RM {total}</Text>
        </View>
        <Pressable onPress={next}>
          <LinearGradient colors={Gradients.brand} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.cta}>
            <Text style={styles.ctaText}>{t('chooseOutletSlot')}</Text>
            <Ionicons name="arrow-forward" size={18} color="#fff" />
          </LinearGradient>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Brand.bg },
  scroll: { paddingHorizontal: 16, paddingTop: 14, paddingBottom: 16 },
  hero: { flexDirection: 'row', alignItems: 'center', gap: 14, borderRadius: Radius.lg, padding: 16, ...Shadow.soft },
  heroTitle: { color: '#fff', fontSize: 18, fontWeight: '900' },
  heroDesc: { color: 'rgba(255,255,255,0.9)', fontSize: 12, marginTop: 3 },
  section: { fontSize: 14, fontWeight: '800', color: Brand.text, marginTop: 20, marginBottom: 10 },
  incWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  incItem: { flexDirection: 'row', alignItems: 'center', gap: 5, width: '46%' },
  incText: { fontSize: 12, color: Brand.text },
  specRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
  specName: { flex: 1, fontSize: 14, fontWeight: '700', color: Brand.text },
  specPrice: { fontSize: 14, fontWeight: '800', color: Brand.text, marginRight: 4 },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: Brand.border, alignItems: 'center', justifyContent: 'center' },
  radioOn: { borderColor: Brand.primary, backgroundColor: Brand.primary },
  addRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
  addName: { fontSize: 14, fontWeight: '700', color: Brand.text },
  addDesc: { fontSize: 11, color: Brand.textSub, marginTop: 2 },
  addPrice: { fontSize: 13, fontWeight: '800', color: Brand.primary, marginRight: 4 },
  check: { width: 22, height: 22, borderRadius: 6, borderWidth: 2, borderColor: Brand.border, alignItems: 'center', justifyContent: 'center' },
  checkOn: { borderColor: Brand.primary, backgroundColor: Brand.primary },
  footer: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingTop: 12, paddingBottom: Platform.OS === 'ios' ? 28 : 14,
    backgroundColor: Brand.card, borderTopWidth: 1, borderTopColor: Brand.border,
  },
  footLabel: { fontSize: 11, color: Brand.textSub },
  footPrice: { fontSize: 22, fontWeight: '900', color: Brand.text, marginTop: 2 },
  cta: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 28, paddingVertical: 15, borderRadius: Radius.pill, ...Shadow.soft },
  ctaText: { color: '#fff', fontSize: 16, fontWeight: '800' },
});
