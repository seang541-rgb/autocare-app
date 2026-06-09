import { Ionicons } from '@expo/vector-icons';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { BackHeader, Card } from '@/components/ui';
import { AccountSettings, useAccount } from '@/store/account';
import { Brand, Radius } from '@/constants/brand';
import { useI18n } from '@/store/i18n';

const SETTINGS: { key: keyof AccountSettings; labelKey: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { key: 'bookingReminder', labelKey: 'bookingReminderSetting', icon: 'calendar-outline' },
  { key: 'paymentAlert', labelKey: 'paymentAlertSetting', icon: 'card-outline' },
  { key: 'whatsappFollowUp', labelKey: 'whatsappFollowUpSetting', icon: 'logo-whatsapp' },
  { key: 'darkHeader', labelKey: 'darkHeaderSetting', icon: 'contrast-outline' },
];

export default function SettingsPage() {
  const { settings, toggleSetting } = useAccount();
  const { t } = useI18n();

  return (
    <View style={styles.root}>
      <BackHeader title={t('settings')} sub={t('settingsSub')} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <Card style={styles.card}>
          {SETTINGS.map((item, index) => {
            const on = settings[item.key];
            return (
              <Pressable key={item.key} onPress={() => toggleSetting(item.key)}>
                <View style={[styles.row, index < SETTINGS.length - 1 && styles.border]}>
                  <View style={styles.iconWrap}>
                    <Ionicons name={item.icon} size={19} color={Brand.primary} />
                  </View>
                  <Text style={styles.label}>{t(item.labelKey)}</Text>
                  <View style={[styles.switch, on && styles.switchOn]}>
                    <View style={[styles.knob, on && styles.knobOn]} />
                  </View>
                </View>
              </Pressable>
            );
          })}
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Brand.bg },
  scroll: { padding: 16, paddingBottom: 26 },
  card: { paddingVertical: 4 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14, paddingHorizontal: 10 },
  border: { borderBottomWidth: 1, borderBottomColor: Brand.border },
  iconWrap: { width: 34, height: 34, borderRadius: 10, backgroundColor: Brand.primarySoft, alignItems: 'center', justifyContent: 'center' },
  label: { flex: 1, fontSize: 15, color: Brand.text, fontWeight: '800' },
  switch: { width: 48, height: 28, borderRadius: Radius.pill, padding: 3, backgroundColor: Brand.border, justifyContent: 'center' },
  switchOn: { backgroundColor: Brand.primary },
  knob: { width: 22, height: 22, borderRadius: 11, backgroundColor: '#fff' },
  knobOn: { alignSelf: 'flex-end' },
});
