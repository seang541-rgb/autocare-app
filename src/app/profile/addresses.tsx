import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { BackHeader, Badge, Card } from '@/components/ui';
import { Address, useAccount } from '@/store/account';
import { Brand, Gradients, Radius, Shadow } from '@/constants/brand';
import { useI18n } from '@/store/i18n';
import { useToast } from '@/store/toast';

export default function AddressesPage() {
  const { addresses, addAddress, updateAddress, deleteAddress, setDefaultAddress } = useAccount();
  const { t } = useI18n();
  const toast = useToast();
  const [editing, setEditing] = useState<Address | null>(null);
  const [label, setLabel] = useState('');
  const [detail, setDetail] = useState('');

  function startEdit(address: Address) {
    setEditing(address);
    setLabel(address.label);
    setDetail(address.detail);
  }

  function resetForm() {
    setEditing(null);
    setLabel('');
    setDetail('');
  }

  function submit() {
    if (!label.trim() || !detail.trim()) {
      toast(t('requiredFields'));
      return;
    }
    if (editing) {
      updateAddress(editing.id, { label: label.trim(), detail: detail.trim() });
    } else {
      addAddress({ label: label.trim(), detail: detail.trim() });
    }
    resetForm();
    toast(t('savedToast'));
  }

  function remove(id: string) {
    deleteAddress(id);
    if (editing?.id === id) resetForm();
    toast(t('deletedToast'));
  }

  return (
    <View style={styles.root}>
      <BackHeader title={t('addressBook')} sub={t('addressSub')} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={styles.list}>
          {addresses.length === 0 ? (
            <Card style={styles.empty}>
              <Ionicons name="location-outline" size={34} color={Brand.textSub} />
              <Text style={styles.emptyText}>{t('noAddresses')}</Text>
            </Card>
          ) : (
            addresses.map((address) => (
              <Card key={address.id} style={styles.addressCard}>
                <View style={styles.addressHead}>
                  <View style={styles.pin}>
                    <Ionicons name="location" size={20} color={Brand.primary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={styles.titleRow}>
                      <Text style={styles.title}>{address.label}</Text>
                      {address.isDefault ? <Badge text={t('default')} color={Brand.success} soft={Brand.successSoft} /> : null}
                    </View>
                    <Text style={styles.detail}>{address.detail}</Text>
                  </View>
                </View>
                <View style={styles.actions}>
                  <Pressable onPress={() => setDefaultAddress(address.id)} style={styles.actionBtn}>
                    <Ionicons name="checkmark-circle-outline" size={16} color={Brand.text} />
                    <Text style={styles.actionText}>{t('setDefault')}</Text>
                  </Pressable>
                  <Pressable onPress={() => startEdit(address)} style={styles.actionBtn}>
                    <Ionicons name="create-outline" size={16} color={Brand.text} />
                    <Text style={styles.actionText}>{t('editAddress')}</Text>
                  </Pressable>
                  <Pressable onPress={() => remove(address.id)} style={[styles.actionBtn, styles.deleteBtn]}>
                    <Ionicons name="trash-outline" size={16} color={Brand.danger} />
                    <Text style={[styles.actionText, { color: Brand.danger }]}>{t('delete')}</Text>
                  </Pressable>
                </View>
              </Card>
            ))
          )}
        </View>

        <Card style={styles.form}>
          <Text style={styles.sectionTitle}>{editing ? t('editAddress') : t('addAddress')}</Text>
          <Field label={t('addressLabel')} value={label} onChangeText={setLabel} placeholder={t('addressLabelPlaceholder')} />
          <Field label={t('addressDetail')} value={detail} onChangeText={setDetail} placeholder={t('addressDetailPlaceholder')} multiline />
          <View style={styles.formActions}>
            {editing ? (
              <Pressable onPress={resetForm} style={styles.cancelBtn}>
                <Text style={styles.cancelText}>{t('cancel')}</Text>
              </Pressable>
            ) : null}
            <Pressable onPress={submit} style={{ flex: 1 }}>
              <LinearGradient colors={Gradients.brand} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.cta}>
                <Ionicons name="save-outline" size={18} color="#fff" />
                <Text style={styles.ctaText}>{t('save')}</Text>
              </LinearGradient>
            </Pressable>
          </View>
        </Card>
      </ScrollView>
    </View>
  );
}

function Field({ label, value, onChangeText, placeholder, multiline }: { label: string; value: string; onChangeText: (text: string) => void; placeholder: string; multiline?: boolean }) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Brand.textMuted}
        multiline={multiline}
        style={[styles.input, multiline && styles.textArea]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Brand.bg },
  scroll: { padding: 16, paddingBottom: 26 },
  list: { gap: 10 },
  addressCard: { gap: 12 },
  addressHead: { flexDirection: 'row', gap: 12 },
  pin: { width: 42, height: 42, borderRadius: 13, alignItems: 'center', justifyContent: 'center', backgroundColor: Brand.primarySoft },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  title: { fontSize: 15, fontWeight: '900', color: Brand.text },
  detail: { fontSize: 12, color: Brand.textSub, marginTop: 4, lineHeight: 17 },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 10, paddingVertical: 8, borderRadius: Radius.pill, backgroundColor: Brand.bg },
  deleteBtn: { backgroundColor: Brand.dangerSoft },
  actionText: { fontSize: 12, color: Brand.text, fontWeight: '800' },
  form: { marginTop: 16, gap: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '900', color: Brand.text },
  field: { gap: 6 },
  label: { fontSize: 12, fontWeight: '800', color: Brand.textSub },
  input: { minHeight: 46, borderWidth: 1, borderColor: Brand.border, borderRadius: Radius.md, paddingHorizontal: 12, backgroundColor: Brand.cardAlt, color: Brand.text },
  textArea: { minHeight: 86, paddingTop: 12, textAlignVertical: 'top' },
  formActions: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  cancelBtn: { paddingHorizontal: 18, paddingVertical: 14, borderRadius: Radius.pill, backgroundColor: Brand.bg },
  cancelText: { fontSize: 14, fontWeight: '900', color: Brand.text },
  cta: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14, borderRadius: Radius.pill, ...Shadow.soft },
  ctaText: { color: '#fff', fontSize: 15, fontWeight: '900' },
  empty: { alignItems: 'center', gap: 8, paddingVertical: 30 },
  emptyText: { color: Brand.textSub, fontSize: 13, fontWeight: '700' },
});
