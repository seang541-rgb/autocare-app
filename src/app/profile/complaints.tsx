import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { BackHeader, Badge, Card } from '@/components/ui';
import { Brand, Gradients, Radius, Shadow } from '@/constants/brand';
import { ComplaintTicket, useAccount } from '@/store/account';
import { useI18n } from '@/store/i18n';
import { useToast } from '@/store/toast';

export default function ComplaintsPage() {
  const { complaints, addComplaintTicket, resolveComplaintTicket } = useAccount();
  const { t } = useI18n();
  const toast = useToast();
  const [topic, setTopic] = useState('');
  const [detail, setDetail] = useState('');

  function submit() {
    if (!topic.trim() || !detail.trim()) {
      toast(t('requiredFields'));
      return;
    }
    addComplaintTicket(topic, detail);
    setTopic('');
    setDetail('');
    toast(t('savedToast'));
  }

  return (
    <View style={styles.root}>
      <BackHeader title={t('complaintCenter')} sub={t('complaintMenuSub')} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <Card style={styles.form}>
          <Text style={styles.section}>{t('submitTicket')}</Text>
          <Field label={t('complaintTopic')} value={topic} onChangeText={setTopic} />
          <Field label={t('complaintDetail')} value={detail} onChangeText={setDetail} multiline />
          <Pressable onPress={submit}>
            <LinearGradient colors={Gradients.brand} style={styles.cta}>
              <Ionicons name="alert-circle-outline" size={18} color="#fff" />
              <Text style={styles.ctaText}>{t('submitTicket')}</Text>
            </LinearGradient>
          </Pressable>
        </Card>

        <View style={styles.list}>
          {complaints.length === 0 ? (
            <Card style={styles.empty}>
              <Ionicons name="checkmark-circle-outline" size={34} color={Brand.textSub} />
              <Text style={styles.emptyText}>{t('noComplaints')}</Text>
            </Card>
          ) : (
            complaints.map((ticket) => <TicketCard key={ticket.id} ticket={ticket} onResolve={() => resolveComplaintTicket(ticket.id)} />)
          )}
        </View>
      </ScrollView>
    </View>
  );
}

function TicketCard({ ticket, onResolve }: { ticket: ComplaintTicket; onResolve: () => void }) {
  const { t } = useI18n();
  const color = ticket.status === 'resolved' ? Brand.success : ticket.status === 'reviewing' ? Brand.warn : Brand.primary;
  const soft = ticket.status === 'resolved' ? Brand.successSoft : ticket.status === 'reviewing' ? Brand.warnSoft : Brand.primarySoft;
  return (
    <Card style={styles.ticket}>
      <View style={styles.ticketTop}>
        <View style={{ flex: 1 }}>
          <Text style={styles.ticketId}>{ticket.id}</Text>
          <Text style={styles.ticketTitle}>{ticket.topic}</Text>
        </View>
        <Badge text={t(ticket.status)} color={color} soft={soft} />
      </View>
      <Text style={styles.ticketDetail}>{ticket.detail}</Text>
      {ticket.status !== 'resolved' ? (
        <Pressable onPress={onResolve} style={styles.resolveBtn}>
          <Ionicons name="checkmark" size={15} color={Brand.success} />
          <Text style={styles.resolveText}>{t('markResolved')}</Text>
        </Pressable>
      ) : null}
    </Card>
  );
}

function Field({ label, value, onChangeText, multiline }: { label: string; value: string; onChangeText: (text: string) => void; multiline?: boolean }) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput value={value} onChangeText={onChangeText} multiline={multiline} style={[styles.input, multiline && styles.textArea]} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Brand.bg },
  scroll: { padding: 16, paddingBottom: 26 },
  form: { gap: 12 },
  section: { fontSize: 16, fontWeight: '900', color: Brand.text },
  field: { gap: 6 },
  label: { fontSize: 12, fontWeight: '800', color: Brand.textSub },
  input: { minHeight: 46, borderWidth: 1, borderColor: Brand.border, borderRadius: Radius.md, paddingHorizontal: 12, backgroundColor: Brand.cardAlt, color: Brand.text },
  textArea: { minHeight: 92, paddingTop: 12, textAlignVertical: 'top' },
  cta: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14, borderRadius: Radius.pill, ...Shadow.soft },
  ctaText: { color: '#fff', fontSize: 15, fontWeight: '900' },
  list: { gap: 10, marginTop: 16 },
  ticket: { gap: 10 },
  ticketTop: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  ticketId: { fontSize: 11, color: Brand.textSub, fontWeight: '900' },
  ticketTitle: { fontSize: 15, color: Brand.text, fontWeight: '900', marginTop: 2 },
  ticketDetail: { fontSize: 12, color: Brand.textSub, lineHeight: 18 },
  resolveBtn: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 10, paddingVertical: 8, borderRadius: Radius.pill, backgroundColor: Brand.successSoft },
  resolveText: { fontSize: 12, color: Brand.success, fontWeight: '900' },
  empty: { alignItems: 'center', gap: 8, paddingVertical: 30 },
  emptyText: { color: Brand.textSub, fontSize: 13, fontWeight: '700' },
});
