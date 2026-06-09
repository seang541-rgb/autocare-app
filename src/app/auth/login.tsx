import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppBrand, Brand, Gradients, Radius, Shadow } from '@/constants/brand';
import { useAccount } from '@/store/account';
import { Language, useI18n } from '@/store/i18n';
import { useToast } from '@/store/toast';

const LANGS: { key: Language; labelKey: string }[] = [
  { key: 'zh', labelKey: 'chinese' },
  { key: 'en', labelKey: 'english' },
  { key: 'ms', labelKey: 'malay' },
];

export default function LoginPage() {
  const { login } = useAccount();
  const { lang, setLang, t } = useI18n();
  const toast = useToast();
  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState('');

  function submit() {
    if (!phone.trim() || pin.trim().length < 4) {
      toast(t('requiredFields'));
      return;
    }
    if (!login(phone, pin)) {
      toast(t('invalidLogin'));
      return;
    }
    toast(t('loginSuccess'));
    router.replace('/(tabs)');
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.root}>
      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" contentContainerStyle={styles.page}>
        <LinearGradient colors={Gradients.heroWarm} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.hero}>
          <SafeAreaView edges={['top']}>
            <View style={styles.heroPad}>
              <View style={styles.logoRow}>
                <LinearGradient colors={Gradients.brand} style={styles.logo}><Ionicons name="storefront" size={27} color="#fff" /></LinearGradient>
                <View style={{ flex: 1 }}>
                  <Text style={styles.brand}>{AppBrand.name}</Text>
                  <Text style={styles.tagline}>{t('loginSub')}</Text>
                </View>
              </View>
              <View style={styles.heroStats}>
                <MiniStat icon="bag-check-outline" value="24/7" label={t('marketplace')} />
                <MiniStat icon="logo-whatsapp" value="AI" label={t('whatsappAiCare')} />
                <MiniStat icon="qr-code-outline" value="QR" label={t('merchantTools')} />
              </View>
            </View>
          </SafeAreaView>
        </LinearGradient>

        <View style={styles.body}>
          <View style={styles.langRow}>
            {LANGS.map((item) => {
              const on = item.key === lang;
              return (
                <Pressable key={item.key} onPress={() => setLang(item.key)} style={[styles.langBtn, on && styles.langBtnOn]}>
                  <Text style={[styles.langText, on && styles.langTextOn]}>{t(item.labelKey)}</Text>
                </Pressable>
              );
            })}
          </View>

          <Text style={styles.title}>{t('loginTitle')}</Text>
          <AuthField icon="call-outline" label={t('phoneNumber')} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
          <AuthField icon="lock-closed-outline" label={t('pinCode')} value={pin} onChangeText={setPin} keyboardType="number-pad" secureTextEntry />

          <Pressable onPress={submit} accessibilityRole="button">
            <LinearGradient colors={Gradients.brand} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.cta}>
              <Ionicons name="log-in-outline" size={18} color="#fff" />
              <Text style={styles.ctaText}>{t('login')}</Text>
            </LinearGradient>
          </Pressable>

          <Pressable onPress={() => router.push('/auth/register')} style={styles.altBtn} accessibilityRole="button">
            <Text style={styles.altText}>{t('noAccount')} <Text style={styles.altLink}>{t('createAccount')}</Text></Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function MiniStat({ icon, value, label }: { icon: keyof typeof Ionicons.glyphMap; value: string; label: string }) {
  return (
    <View style={styles.miniStat}>
      <Ionicons name={icon} size={15} color={Brand.primary} />
      <Text style={styles.miniValue}>{value}</Text>
      <Text style={styles.miniLabel} numberOfLines={1}>{label}</Text>
    </View>
  );
}

function AuthField({ icon, label, value, onChangeText, keyboardType, secureTextEntry }: { icon: keyof typeof Ionicons.glyphMap; label: string; value: string; onChangeText: (value: string) => void; keyboardType?: 'default' | 'phone-pad' | 'number-pad'; secureTextEntry?: boolean }) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputWrap}>
        <Ionicons name={icon} size={18} color={Brand.primary} />
        <TextInput value={value} onChangeText={onChangeText} keyboardType={keyboardType} secureTextEntry={secureTextEntry} placeholder={label} style={styles.input} placeholderTextColor={Brand.textMuted} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Brand.bg },
  page: { flexGrow: 1, paddingBottom: 26 },
  hero: { borderBottomLeftRadius: Radius.xxl, borderBottomRightRadius: Radius.xxl, paddingBottom: 40, ...Shadow.strong },
  heroPad: { paddingHorizontal: 18, paddingTop: 12 },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 13 },
  logo: { width: 58, height: 58, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  brand: { fontSize: 26, fontWeight: '900', color: '#fff' },
  tagline: { fontSize: 13, color: Brand.textOnDarkSub, marginTop: 3, lineHeight: 18 },
  heroStats: { flexDirection: 'row', gap: 10, marginTop: 20 },
  miniStat: { flex: 1, minHeight: 70, borderRadius: Radius.lg, backgroundColor: 'rgba(255,255,255,0.11)', borderWidth: 1, borderColor: Brand.borderDark, alignItems: 'center', justifyContent: 'center', padding: 8 },
  miniValue: { color: '#fff', fontSize: 15, fontWeight: '900', marginTop: 4 },
  miniLabel: { color: Brand.textOnDarkSub, fontSize: 9, fontWeight: '800', marginTop: 2, textAlign: 'center' },
  body: { marginHorizontal: 16, marginTop: -22, padding: 16, borderRadius: Radius.xl, backgroundColor: Brand.card, borderWidth: 1, borderColor: Brand.border, ...Shadow.strong },
  langRow: { flexDirection: 'row', gap: 8, marginBottom: 18, padding: 4, backgroundColor: Brand.bg, borderRadius: Radius.pill },
  langBtn: { flex: 1, alignItems: 'center', paddingVertical: 9, borderRadius: Radius.pill },
  langBtnOn: { backgroundColor: Brand.primary },
  langText: { color: Brand.textSub, fontSize: 12, fontWeight: '900' },
  langTextOn: { color: '#fff' },
  title: { fontSize: 21, fontWeight: '900', color: Brand.text, marginBottom: 14 },
  field: { marginBottom: 13 },
  label: { fontSize: 12, color: Brand.textSub, fontWeight: '900', marginBottom: 7 },
  inputWrap: { minHeight: 52, flexDirection: 'row', alignItems: 'center', gap: 10, borderWidth: 1, borderColor: Brand.border, borderRadius: Radius.lg, paddingHorizontal: 13, backgroundColor: Brand.cardAlt },
  input: { flex: 1, minWidth: 0, color: Brand.text, fontSize: 15, fontWeight: '700', paddingVertical: 0 },
  cta: { marginTop: 6, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, minHeight: 52, borderRadius: Radius.pill, ...Shadow.soft },
  ctaText: { color: '#fff', fontSize: 16, fontWeight: '900' },
  altBtn: { alignItems: 'center', paddingTop: 16 },
  altText: { color: Brand.textSub, fontSize: 13, fontWeight: '700', textAlign: 'center' },
  altLink: { color: Brand.primary, fontWeight: '900' },
});
