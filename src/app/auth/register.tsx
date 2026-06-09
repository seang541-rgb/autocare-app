import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppBrand, Brand, Gradients, Radius, Shadow } from '@/constants/brand';
import { useAccount } from '@/store/account';
import { useI18n } from '@/store/i18n';
import { useToast } from '@/store/toast';

export default function RegisterPage() {
  const { registerAccount } = useAccount();
  const { t } = useI18n();
  const toast = useToast();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState('');
  const [vehiclePlate, setVehiclePlate] = useState('');

  function submit() {
    const result = registerAccount({ name, phone, pin, vehiclePlate });
    if (!result.ok) {
      toast(t(result.reason === 'duplicate' ? 'accountExists' : 'requiredFields'));
      return;
    }
    toast(t('registerSuccess'));
    router.replace('/(tabs)');
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.root}>
      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" contentContainerStyle={styles.page}>
        <LinearGradient colors={Gradients.heroWarm} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.hero}>
          <SafeAreaView edges={['top']}>
            <View style={styles.heroPad}>
              <Pressable onPress={() => router.replace('/auth/login')} style={styles.back} hitSlop={8}>
                <Ionicons name="chevron-back" size={22} color="#fff" />
              </Pressable>
              <View style={styles.heroCopy}>
                <Text style={styles.brand}>{t('registerTitle')}</Text>
                <Text style={styles.tagline}>{AppBrand.name} - {t('registerSub')}</Text>
              </View>
            </View>
            <View style={styles.steps}>
              <Step index="1" label={t('fullName')} active />
              <Step index="2" label={t('phoneNumber')} active />
              <Step index="3" label={t('vehiclePlate')} active />
            </View>
          </SafeAreaView>
        </LinearGradient>

        <View style={styles.formWrap}>
          <View style={styles.form}>
            <AuthField icon="person-outline" label={t('fullName')} value={name} onChangeText={setName} autoComplete="name" />
            <AuthField icon="call-outline" label={t('phoneNumber')} value={phone} onChangeText={setPhone} keyboardType="phone-pad" autoComplete="tel" />
            <AuthField icon="lock-closed-outline" label={t('pinCode')} value={pin} onChangeText={setPin} keyboardType="number-pad" secureTextEntry />
            <AuthField icon="car-sport-outline" label={t('vehiclePlate')} value={vehiclePlate} onChangeText={setVehiclePlate} autoCapitalize="characters" />

            <Pressable onPress={submit} accessibilityRole="button">
              <LinearGradient colors={Gradients.brand} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.cta}>
                <Ionicons name="person-add-outline" size={18} color="#fff" />
                <Text style={styles.ctaText}>{t('createAccount')}</Text>
              </LinearGradient>
            </Pressable>

            <Pressable onPress={() => router.replace('/auth/login')} style={styles.altBtn} accessibilityRole="button">
              <Text style={styles.altText}>{t('haveAccount')} <Text style={styles.altLink}>{t('login')}</Text></Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Step({ index, label, active }: { index: string; label: string; active?: boolean }) {
  return (
    <View style={styles.step}>
      <View style={[styles.stepIndex, active && styles.stepIndexOn]}><Text style={styles.stepIndexText}>{index}</Text></View>
      <Text style={styles.stepLabel} numberOfLines={1}>{label}</Text>
    </View>
  );
}

function AuthField({ icon, label, value, onChangeText, keyboardType, secureTextEntry, autoCapitalize, autoComplete }: { icon: keyof typeof Ionicons.glyphMap; label: string; value: string; onChangeText: (value: string) => void; keyboardType?: 'default' | 'phone-pad' | 'number-pad'; secureTextEntry?: boolean; autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters'; autoComplete?: 'name' | 'tel' }) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputWrap}>
        <Ionicons name={icon} size={18} color={Brand.primary} />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry}
          autoCapitalize={autoCapitalize}
          autoComplete={autoComplete}
          placeholder={label}
          placeholderTextColor={Brand.textMuted}
          style={styles.input}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Brand.bg },
  page: { flexGrow: 1, paddingBottom: 28 },
  hero: { borderBottomLeftRadius: Radius.xxl, borderBottomRightRadius: Radius.xxl, paddingBottom: 42, ...Shadow.strong },
  heroPad: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingTop: 10 },
  back: { width: 42, height: 42, borderRadius: 21, backgroundColor: 'rgba(255,255,255,0.14)', borderWidth: 1, borderColor: Brand.borderDark, alignItems: 'center', justifyContent: 'center' },
  heroCopy: { flex: 1, minWidth: 0 },
  brand: { fontSize: 23, fontWeight: '900', color: '#fff' },
  tagline: { fontSize: 13, color: Brand.textOnDarkSub, marginTop: 3, lineHeight: 18 },
  steps: { flexDirection: 'row', gap: 8, paddingHorizontal: 16, paddingTop: 18 },
  step: { flex: 1, minHeight: 64, borderRadius: Radius.lg, backgroundColor: 'rgba(255,255,255,0.11)', borderWidth: 1, borderColor: Brand.borderDark, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 6 },
  stepIndex: { width: 24, height: 24, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.16)', alignItems: 'center', justifyContent: 'center' },
  stepIndexOn: { backgroundColor: Brand.primary },
  stepIndexText: { color: '#fff', fontSize: 11, fontWeight: '900' },
  stepLabel: { color: Brand.textOnDarkSub, fontSize: 10, fontWeight: '800', marginTop: 5, textAlign: 'center' },
  formWrap: { paddingHorizontal: 16, marginTop: -22 },
  form: { padding: 16, borderRadius: Radius.xl, backgroundColor: Brand.card, borderWidth: 1, borderColor: Brand.border, ...Shadow.strong },
  field: { marginBottom: 13 },
  label: { fontSize: 12, color: Brand.textSub, fontWeight: '900', marginBottom: 7 },
  inputWrap: { minHeight: 52, flexDirection: 'row', alignItems: 'center', gap: 10, borderWidth: 1, borderColor: Brand.border, borderRadius: Radius.lg, paddingHorizontal: 13, backgroundColor: Brand.cardAlt },
  input: { flex: 1, minWidth: 0, color: Brand.text, fontSize: 15, fontWeight: '700', paddingVertical: 0 },
  cta: { marginTop: 6, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, minHeight: 52, borderRadius: Radius.pill, ...Shadow.soft },
  ctaText: { color: '#fff', fontSize: 16, fontWeight: '900' },
  altBtn: { alignItems: 'center', paddingTop: 16, paddingBottom: 2 },
  altText: { color: Brand.textSub, fontSize: 13, fontWeight: '700', textAlign: 'center' },
  altLink: { color: Brand.primary, fontWeight: '900' },
});
