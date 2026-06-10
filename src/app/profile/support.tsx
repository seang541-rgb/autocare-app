import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
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
  const { supportMessages, sendSupportMessage, addSupportMessage } = useAccount();
  const { t } = useI18n();
  const params = useLocalSearchParams<{ ask?: string }>();
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const autoAsked = useRef(false);

  const replyFor = useCallback((value: string) => {
    const lower = value.toLowerCase();
    if (lower.includes('queue') || lower.includes('wait') || lower.includes('merchant') || lower.includes('tunggu')) return t('aiQueueReply');
    if (lower.includes('payment') || lower.includes('pay') || lower.includes('bayar')) return t('aiPaymentReply');
    if (lower.includes('change') || lower.includes('reschedule') || lower.includes('ubah')) return t('aiChangeReply');
    if (lower.includes('complaint') || lower.includes('aduan')) return t('aiComplaintReply');
    return t('aiDefaultReply');
  }, [t]);

  async function askLocalAi(value: string) {
    const response = await fetch('http://localhost:11434/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'lokalgo-care:12b',
        stream: false,
        think: false,
        messages: [{ role: 'user', content: value }],
      }),
    });
    if (!response.ok) throw new Error(`Ollama returned ${response.status}`);
    const data = await response.json();
    const reply = data?.message?.content;
    if (typeof reply !== 'string' || !reply.trim()) throw new Error('Empty AI reply');
    return reply.trim();
  }

  const submit = useCallback(async (value = text) => {
    const trimmed = value.trim();
    if (!trimmed || loading) return;
    addSupportMessage('user', trimmed);
    setText('');
    setLoading(true);
    try {
      const reply = await askLocalAi(trimmed);
      addSupportMessage('ai', reply);
    } catch {
      addSupportMessage('ai', replyFor(trimmed));
    } finally {
      setLoading(false);
    }
  }, [addSupportMessage, loading, replyFor, text]);

  useEffect(() => {
    const ask = typeof params.ask === 'string' ? params.ask : '';
    if (!ask || autoAsked.current) return;
    autoAsked.current = true;
    submit(ask);
  }, [params.ask, submit]);

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
          {loading ? (
            <View style={styles.bubbleRow}>
              <Ionicons name="sparkles" size={18} color={Brand.primary} />
              <View style={[styles.bubble, styles.bubbleAi]}>
                <Text style={styles.bubbleText}>AI Care is checking...</Text>
              </View>
            </View>
          ) : null}
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <TextInput value={text} onChangeText={setText} placeholder={t('supportPlaceholder')} placeholderTextColor={Brand.textMuted} style={styles.input} editable={!loading} />
        <Pressable onPress={() => submit()} disabled={loading}>
          <LinearGradient colors={loading ? Gradients.card : Gradients.brand} style={styles.sendBtn}>
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
