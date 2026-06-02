import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { BackHeader, Card } from '@/components/ui';
import { Brand, Gradients, Radius, Shadow } from '@/constants/brand';
import { services } from '@/constants/data';

// 洗车规格（按车型）
const specs = [
  { id: 'sedan', name: '小型车 / 轿车', icon: 'car-outline' as const, price: 12 },
  { id: 'suv', name: 'SUV / MPV', icon: 'car-sport-outline' as const, price: 18 },
  { id: 'big', name: '大型车 / 商用', icon: 'bus-outline' as const, price: 25 },
];

// 加购项
const addons = [
  { id: 'vacuum', name: '内部吸尘', desc: '座椅+地毯深度吸尘', price: 0, free: true },
  { id: 'wax', name: '快速打蜡', desc: '车漆增亮保护', price: 15 },
  { id: 'tyre', name: '轮胎上光', desc: '轮胎黑亮如新', price: 8 },
  { id: 'fragrance', name: '车内香氛', desc: '7 天清新留香', price: 10 },
];

const included = ['高压预冲洗', '泡沫清洁', '轮毂清洗', '清水冲洗', '风干', '免费吸尘'];

export default function ServiceDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const service = services.find((s) => s.id === id) ?? services[0];

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
    const addNames = addons.filter((a) => picked.includes(a.id)).map((a) => a.name);
    router.push({
      pathname: '/confirm',
      params: {
        service: `${service.name}（${spec.name}）`,
        icon: service.icon,
        grad: service.grad,
        addons: addNames.join('、') || '无',
        price: String(total),
      },
    });
  }

  return (
    <View style={styles.root}>
      <BackHeader title={service.name} sub={service.brand} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* 服务大图卡 */}
        <LinearGradient colors={Gradients[service.grad]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.hero}>
          <Ionicons name={service.icon} size={44} color="#fff" />
          <View style={{ flex: 1 }}>
            <Text style={styles.heroTitle}>{service.name}</Text>
            <Text style={styles.heroDesc}>{service.desc}</Text>
          </View>
        </LinearGradient>

        {/* 包含项 */}
        <Text style={styles.section}>套餐包含</Text>
        <Card>
          <View style={styles.incWrap}>
            {included.map((it) => (
              <View key={it} style={styles.incItem}>
                <Ionicons name="checkmark-circle" size={16} color={Brand.success} />
                <Text style={styles.incText}>{it}</Text>
              </View>
            ))}
          </View>
        </Card>

        {/* 选车型 */}
        <Text style={styles.section}>选择车型</Text>
        <View style={{ gap: 10 }}>
          {specs.map((s) => {
            const on = s.id === specId;
            return (
              <Pressable key={s.id} onPress={() => setSpecId(s.id)}>
                <Card style={[styles.specRow, on && { borderWidth: 2, borderColor: Brand.primary }]}>
                  <Ionicons name={s.icon} size={24} color={on ? Brand.primary : Brand.textSub} />
                  <Text style={[styles.specName, on && { color: Brand.primary }]}>{s.name}</Text>
                  <Text style={styles.specPrice}>RM{s.price}</Text>
                  <View style={[styles.radio, on && styles.radioOn]}>
                    {on && <Ionicons name="checkmark" size={12} color="#fff" />}
                  </View>
                </Card>
              </Pressable>
            );
          })}
        </View>

        {/* 加购 */}
        <Text style={styles.section}>增值加购</Text>
        <View style={{ gap: 10 }}>
          {addons.map((a) => {
            const on = picked.includes(a.id);
            return (
              <Pressable key={a.id} onPress={() => toggle(a.id)}>
                <Card style={[styles.addRow, on && { borderWidth: 2, borderColor: Brand.primary }]}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.addName}>{a.name}</Text>
                    <Text style={styles.addDesc}>{a.desc}</Text>
                  </View>
                  <Text style={[styles.addPrice, a.free && { color: Brand.success }]}>
                    {a.free ? '免费' : `+RM${a.price}`}
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

      {/* 底部金额 + 下一步 */}
      <View style={styles.footer}>
        <View>
          <Text style={styles.footLabel}>合计</Text>
          <Text style={styles.footPrice}>RM {total}</Text>
        </View>
        <Pressable onPress={next}>
          <LinearGradient colors={Gradients.brand} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.cta}>
            <Text style={styles.ctaText}>选择门店时段</Text>
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
