import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { View, Text, StyleSheet } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

import { BackHeader, Card } from '@/components/ui';
import { AppBrand, Brand, Gradients, Radius, Shadow } from '@/constants/brand';
import { profile } from '@/constants/data';
import { useAccount } from '@/store/account';
import { useI18n } from '@/store/i18n';

export default function MemberQrPage() {
  const { t } = useI18n();
  const { currentUser, defaultVehicle } = useAccount();
  const qrValue = `${AppBrand.name.toUpperCase()}|MEMBER|${currentUser?.phone ?? profile.phone}|${defaultVehicle?.plate ?? 'NO-CAR'}`;

  return (
    <View style={styles.root}>
      <BackHeader title={t('memberQr')} sub={t('memberQrSub')} />
      <View style={styles.body}>
        <Card style={styles.card}>
          <LinearGradient colors={Gradients.brand} style={styles.avatar}>
            <Ionicons name="person" size={34} color="#fff" />
          </LinearGradient>
          <Text style={styles.name}>{currentUser?.name ?? profile.name}</Text>
          <Text style={styles.level}>{currentUser?.level ?? profile.level}</Text>
          <View style={styles.qrWrap}>
            <QRCode value={qrValue} size={210} color={Brand.ink} backgroundColor="#fff" />
          </View>
          <Text style={styles.hint}>{t('scanForMember')}</Text>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>{AppBrand.name}</Text>
            <Text style={styles.metaValue}>{defaultVehicle?.plate ?? '-'}</Text>
          </View>
        </Card>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Brand.bg },
  body: { flex: 1, padding: 16, justifyContent: 'center' },
  card: { alignItems: 'center', paddingVertical: 26, ...Shadow.soft },
  avatar: { width: 70, height: 70, borderRadius: 35, alignItems: 'center', justifyContent: 'center' },
  name: { fontSize: 22, fontWeight: '900', color: Brand.text, marginTop: 14 },
  level: { fontSize: 13, color: Brand.primary, fontWeight: '900', marginTop: 4 },
  qrWrap: { marginTop: 22, padding: 16, backgroundColor: '#fff', borderRadius: Radius.lg, borderWidth: 1, borderColor: Brand.border },
  hint: { fontSize: 13, color: Brand.textSub, marginTop: 18, textAlign: 'center' },
  metaRow: { marginTop: 18, flexDirection: 'row', gap: 10, paddingHorizontal: 14, paddingVertical: 9, borderRadius: Radius.pill, backgroundColor: Brand.bg },
  metaLabel: { fontSize: 12, color: Brand.textSub, fontWeight: '800' },
  metaValue: { fontSize: 12, color: Brand.text, fontWeight: '900' },
});

