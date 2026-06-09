import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { BackHeader, Badge, Card, GradIcon } from '@/components/ui';
import { Brand, Gradients, Radius, Shadow } from '@/constants/brand';
import { useAccount } from '@/store/account';
import { useI18n } from '@/store/i18n';
import { useToast } from '@/store/toast';

export default function VehiclesPage() {
  const { vehicles, addVehicle, setDefaultVehicle } = useAccount();
  const { t } = useI18n();
  const toast = useToast();
  const [plate, setPlate] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');

  function submit() {
    if (!plate.trim() || !model.trim()) {
      toast(t('requiredFields'));
      return;
    }
    addVehicle({ plate: plate.trim().toUpperCase(), model: model.trim(), year: year.trim() || '2026' });
    setPlate('');
    setModel('');
    setYear('');
    toast(t('savedToast'));
  }

  return (
    <View style={styles.root}>
      <BackHeader title={t('myVehicles')} sub={t('vehicleSub')} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={styles.list}>
          {vehicles.map((vehicle) => (
            <Card key={vehicle.id} style={styles.vehicleCard}>
              <GradIcon icon="car-sport" grad="brand" size={46} iconSize={22} />
              <View style={{ flex: 1 }}>
                <View style={styles.titleRow}>
                  <Text style={styles.plate}>{vehicle.plate}</Text>
                  {vehicle.isDefault ? <Badge text={t('default')} color={Brand.success} soft={Brand.successSoft} /> : null}
                </View>
                <Text style={styles.meta}>{vehicle.model} · {vehicle.year}</Text>
              </View>
              <Pressable onPress={() => setDefaultVehicle(vehicle.id)} style={[styles.defaultBtn, vehicle.isDefault && styles.defaultBtnOn]}>
                <Ionicons name={vehicle.isDefault ? 'checkmark-circle' : 'ellipse-outline'} size={18} color={vehicle.isDefault ? Brand.success : Brand.textSub} />
              </Pressable>
            </Card>
          ))}
        </View>

        <Card style={styles.form}>
          <Text style={styles.sectionTitle}>{t('addVehicle')}</Text>
          <Field label={t('plateNo')} value={plate} onChangeText={setPlate} autoCapitalize="characters" />
          <Field label={t('vehicleModel')} value={model} onChangeText={setModel} />
          <Field label={t('vehicleYear')} value={year} onChangeText={setYear} keyboardType="number-pad" />
          <Pressable onPress={submit}>
            <LinearGradient colors={Gradients.brand} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.cta}>
              <Ionicons name="add" size={18} color="#fff" />
              <Text style={styles.ctaText}>{t('addVehicle')}</Text>
            </LinearGradient>
          </Pressable>
        </Card>
      </ScrollView>
    </View>
  );
}

function Field({ label, value, onChangeText, autoCapitalize, keyboardType }: { label: string; value: string; onChangeText: (text: string) => void; autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters'; keyboardType?: 'default' | 'number-pad' }) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput value={value} onChangeText={onChangeText} autoCapitalize={autoCapitalize} keyboardType={keyboardType} style={styles.input} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Brand.bg },
  scroll: { padding: 16, paddingBottom: 26 },
  list: { gap: 10 },
  vehicleCard: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  plate: { fontSize: 17, fontWeight: '900', color: Brand.text },
  meta: { fontSize: 12, color: Brand.textSub, marginTop: 3 },
  defaultBtn: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center', backgroundColor: Brand.bg },
  defaultBtnOn: { backgroundColor: Brand.successSoft },
  form: { marginTop: 16, gap: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '900', color: Brand.text },
  field: { gap: 6 },
  label: { fontSize: 12, fontWeight: '800', color: Brand.textSub },
  input: { minHeight: 46, borderWidth: 1, borderColor: Brand.border, borderRadius: Radius.md, paddingHorizontal: 12, backgroundColor: Brand.cardAlt, color: Brand.text },
  cta: { marginTop: 4, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14, borderRadius: Radius.pill, ...Shadow.soft },
  ctaText: { color: '#fff', fontSize: 15, fontWeight: '900' },
});
