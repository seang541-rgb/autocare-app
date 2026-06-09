import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { BackHeader, Badge, Card } from '@/components/ui';
import { Brand, Gradients, Radius, Shadow } from '@/constants/brand';
import { PaymentMethod, useAccount } from '@/store/account';
import { useI18n } from '@/store/i18n';
import { useToast } from '@/store/toast';

const ICONS: Record<PaymentMethod['type'], keyof typeof Ionicons.glyphMap> = {
  tng: 'wallet-outline',
  fpx: 'business-outline',
  card: 'card-outline',
  cash: 'cash-outline',
};

export default function PaymentsPage() {
  const { payments, addPayment, setDefaultPayment } = useAccount();
  const { t } = useI18n();
  const toast = useToast();
  const [label, setLabel] = useState('');
  const [detail, setDetail] = useState('');

  function submit() {
    if (!label.trim()) {
      toast(t('requiredFields'));
      return;
    }
    addPayment({ type: 'cash', label: label.trim(), detail: detail.trim() || t('paymentDetailPlaceholder') });
    setLabel('');
    setDetail('');
    toast(t('savedToast'));
  }

  return (
    <View style={styles.root}>
      <BackHeader title={t('paymentMethods')} sub={t('paymentSub')} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={styles.list}>
          {payments.map((payment) => (
            <Card key={payment.id} style={styles.card}>
              <LinearGradient colors={payment.isDefault ? Gradients.brand : Gradients.card} style={styles.icon}>
                <Ionicons name={ICONS[payment.type]} size={22} color="#fff" />
              </LinearGradient>
              <View style={{ flex: 1 }}>
                <View style={styles.titleRow}>
                  <Text style={styles.title}>{payment.label}</Text>
                  {payment.isDefault ? <Badge text={t('default')} color={Brand.success} soft={Brand.successSoft} /> : null}
                </View>
                <Text style={styles.detail}>{payment.detail}</Text>
              </View>
              <Pressable onPress={() => setDefaultPayment(payment.id)} style={styles.radio}>
                <Ionicons name={payment.isDefault ? 'checkmark-circle' : 'ellipse-outline'} size={20} color={payment.isDefault ? Brand.success : Brand.textSub} />
              </Pressable>
            </Card>
          ))}
        </View>

        <Card style={styles.form}>
          <Text style={styles.sectionTitle}>{t('addPayment')}</Text>
          <Field label={t('paymentName')} value={label} onChangeText={setLabel} placeholder={t('paymentPlaceholder')} />
          <Field label={t('paymentDetail')} value={detail} onChangeText={setDetail} placeholder={t('paymentDetailPlaceholder')} />
          <Pressable onPress={submit}>
            <LinearGradient colors={Gradients.brand} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.cta}>
              <Ionicons name="add" size={18} color="#fff" />
              <Text style={styles.ctaText}>{t('addPayment')}</Text>
            </LinearGradient>
          </Pressable>
        </Card>
      </ScrollView>
    </View>
  );
}

function Field({ label, value, onChangeText, placeholder }: { label: string; value: string; onChangeText: (text: string) => void; placeholder: string }) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput value={value} onChangeText={onChangeText} placeholder={placeholder} placeholderTextColor={Brand.textMuted} style={styles.input} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Brand.bg },
  scroll: { padding: 16, paddingBottom: 26 },
  list: { gap: 10 },
  card: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  icon: { width: 46, height: 46, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  title: { fontSize: 15, fontWeight: '900', color: Brand.text },
  detail: { fontSize: 12, color: Brand.textSub, marginTop: 3 },
  radio: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center', backgroundColor: Brand.bg },
  form: { marginTop: 16, gap: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '900', color: Brand.text },
  field: { gap: 6 },
  label: { fontSize: 12, fontWeight: '800', color: Brand.textSub },
  input: { minHeight: 46, borderWidth: 1, borderColor: Brand.border, borderRadius: Radius.md, paddingHorizontal: 12, backgroundColor: Brand.cardAlt, color: Brand.text },
  cta: { marginTop: 4, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14, borderRadius: Radius.pill, ...Shadow.soft },
  ctaText: { color: '#fff', fontSize: 15, fontWeight: '900' },
});
