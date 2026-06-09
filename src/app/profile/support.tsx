import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { BackHeader } from '@/components/ui';
import { Brand, Gradients, Radius, Shadow } from '@/constants/brand';
import { useAccount } from '@/store/account';
import { useI18n } from '@/store/i18n';

const QUICK = [
  { labelKey: 'quickQueue', replyKey: 'aiQueueReply' },
  { labelKey: 'quickPayment', replyKey: 'aiPaymentReply' },
  { labelKey: 'quickChangeBooking', replyKey: 'aiChangeReply' },
  { labelKey: 'quickComplaintFollow', replyKey: 'aiComplaintReply' },
] as const;

export default function SupportPage() {
  const { supportMessages, sendSupportMessage } = useAccount();
  const { t } = useI18n();
  const [text, setText] = useState('');

  function replyFor(value: string) {
    const lower = value.toLowerCase();
    if (lower.includes('queue') || lower.includes('wait') || lower.includes('merchant') || lower.includes('tunggu')) return t('aiQueueReply');
    if (lower.includes('payment') || lower.includes('pay') || lower.includes('bayar')) return t('aiPaymentReply');
    if (lower.includes('change') || lower.includes('reschedule') || lower.includes('ubah')) return t('aiChangeReply');
    if (lower.includes('complaint') || lower.includes('aduan')) return t('aiComplaintReply');
    return t('aiDefaultReply');
  }

  function submit(value = text) {
    if (!value.trim()) return;
    sendSupportMessage(value, replyFor(value));
    setText('');
  }

  return (
    <View style={styles.root}>
      <BackHeader title={t('whatsappAiCare')} sub={t('supportMenuSub')} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={styles.quickRow}>
          {QUICK.map((item) => (
            <Pressable key={item.labelKey} onPress={() => sendSupportMessage(t(item.labelKey), t(item.replyKey))} style={styles.quickBtn}>
              <Text style={styles.quickText}>{t(item.labelKey)}</Text>
            </Pressable>
          ))}
        </View>
        <View style={styles.messages}>
          {supportMessages.map((message) => {
            const user = message.from === 'user';
            const body = message.textKey ? t(message.textKey) : message.text;
            return (
              <View key={message.id} style={[styles.bubbleRow, user && styles.bubbleRowUser]}>
                {!user ? <Ionicons name="sparkles" size={18} color={Brand.primary} /> : null}
                <View style={[styles.bubble, user ? styles.bubbleUser : styles.bubbleAi]}>
                  <Text style={[styles.bubbleText, user && styles.bubbleTextUser]}>{body}</Text>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <TextInput value={text} onChangeText={setText} placeholder={t('supportPlaceholder')} placeholderTextColor={Brand.textMuted} style={styles.input} />
        <Pressable onPress={() => submit()}>
          <LinearGradient colors={Gradients.brand} style={styles.sendBtn}>
            <Ionicons name="send" size={18} color="#fff" />
          </LinearGradient>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Brand.bg },
  scroll: { padding: 16, paddingBottom: 18 },
  quickRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 14 },
  quickBtn: { paddingHorizontal: 12, paddingVertical: 9, borderRadius: Radius.pill, backgroundColor: Brand.primarySoft },
  quickText: { fontSize: 12, color: Brand.primary, fontWeight: '900' },
  messages: { gap: 12 },
  bubbleRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  bubbleRowUser: { justifyContent: 'flex-end' },
  bubble: { maxWidth: '82%', paddingHorizontal: 13, paddingVertical: 10, borderRadius: Radius.lg, ...Shadow.card },
  bubbleAi: { backgroundColor: Brand.card, borderBottomLeftRadius: 4 },
  bubbleUser: { backgroundColor: Brand.primary, borderBottomRightRadius: 4 },
  bubbleText: { fontSize: 13, color: Brand.text, lineHeight: 18 },
  bubbleTextUser: { color: '#fff', fontWeight: '700' },
  footer: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 14, backgroundColor: Brand.card, borderTopWidth: 1, borderTopColor: Brand.border },
  input: { flex: 1, minHeight: 44, borderRadius: Radius.pill, backgroundColor: Brand.bg, paddingHorizontal: 14, color: Brand.text },
  sendBtn: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
});
