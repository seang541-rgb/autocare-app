import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';

export type Vehicle = { id: string; plate: string; model: string; year: string; isDefault: boolean };
export type CouponStatus = 'usable' | 'used' | 'expired';
export type Coupon = { id: string; title: string; discount: string; expiresAt: string; rule: string; status: CouponStatus };
export type PaymentMethod = { id: string; type: 'tng' | 'fpx' | 'card' | 'cash'; label: string; detail: string; isDefault: boolean };
export type Address = { id: string; label: string; detail: string; isDefault: boolean };
export type SupportMessage = { id: string; from: 'user' | 'ai'; text: string; textKey?: string; createdAt: number };
export type ComplaintTicket = { id: string; topic: string; detail: string; status: 'open' | 'reviewing' | 'resolved'; createdAt: number };
export type AccountSettings = { bookingReminder: boolean; paymentAlert: boolean; whatsappFollowUp: boolean; darkHeader: boolean };
export type LocalUser = { id: string; name: string; phone: string; pin: string; level: string; points: number; packageLeft: number; packageTotal: number; createdAt: number };

type NewVehicle = Omit<Vehicle, 'id' | 'isDefault'>;
type NewPayment = Omit<PaymentMethod, 'id' | 'isDefault'>;
type NewAddress = Omit<Address, 'id' | 'isDefault'>;
type RegisterInput = { name: string; phone: string; pin: string; vehiclePlate: string };
type AuthResult = { ok: true } | { ok: false; reason: 'duplicate' | 'invalid' };

type AccountStore = {
  hydrated: boolean;
  users: LocalUser[];
  currentUser?: LocalUser;
  isAuthenticated: boolean;
  vehicles: Vehicle[];
  coupons: Coupon[];
  payments: PaymentMethod[];
  addresses: Address[];
  supportMessages: SupportMessage[];
  complaints: ComplaintTicket[];
  settings: AccountSettings;
  defaultVehicle?: Vehicle;
  defaultPayment?: PaymentMethod;
  defaultAddress?: Address;
  registerAccount: (input: RegisterInput) => AuthResult;
  login: (phone: string, pin: string) => boolean;
  logout: () => void;
  addVehicle: (vehicle: NewVehicle) => void;
  setDefaultVehicle: (id: string) => void;
  addPayment: (payment: NewPayment) => void;
  setDefaultPayment: (id: string) => void;
  addAddress: (address: NewAddress) => void;
  updateAddress: (id: string, address: NewAddress) => void;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  sendSupportMessage: (text: string, replyText?: string) => void;
  addComplaintTicket: (topic: string, detail: string) => void;
  resolveComplaintTicket: (id: string) => void;
  toggleSetting: (key: keyof AccountSettings) => void;
};

type AccountSnapshot = {
  users?: LocalUser[];
  currentUserId?: string;
  vehicles: Vehicle[];
  payments: PaymentMethod[];
  addresses: Address[];
  supportMessages: SupportMessage[];
  complaints: ComplaintTicket[];
  settings: AccountSettings;
};

const STORAGE_KEY = 'lokalgo:account:v1';

const seedVehicles: Vehicle[] = [
  { id: 'v1', plate: 'WXY 8888', model: 'Honda Civic 1.5 TC-P', year: '2022', isDefault: true },
  { id: 'v2', plate: 'VBR 2211', model: 'Toyota Vios 1.5G', year: '2020', isDefault: false },
];
const seedCoupons: Coupon[] = [
  { id: 'c1', title: 'RM8 marketplace voucher', discount: 'RM8 OFF', expiresAt: '2026-06-30', rule: 'Use on any LokalGo order above RM20.', status: 'usable' },
  { id: 'c2', title: 'Service upgrade', discount: '15% OFF', expiresAt: '2026-07-15', rule: 'Valid for selected service merchants.', status: 'usable' },
  { id: 'c3', title: 'Retail pickup add-on', discount: 'FREE', expiresAt: '2026-06-20', rule: 'Free pickup handling for selected retail orders.', status: 'usable' },
  { id: 'c4', title: 'First order trial', discount: 'RM1', expiresAt: '2026-05-10', rule: 'Redeemed on your previous order.', status: 'used' },
  { id: 'c5', title: 'May member treat', discount: 'RM5 OFF', expiresAt: '2026-05-31', rule: 'Expired member voucher.', status: 'expired' },
];
const seedPayments: PaymentMethod[] = [
  { id: 'p1', type: 'tng', label: "Touch 'n Go eWallet", detail: 'Ready for QR/manual payment setup', isDefault: true },
  { id: 'p2', type: 'fpx', label: 'FPX online banking', detail: 'Bank account will be connected later', isDefault: false },
  { id: 'p3', type: 'card', label: 'Credit / debit card', detail: 'Pending merchant gateway setup', isDefault: false },
];
const seedAddresses: Address[] = [
  { id: 'a1', label: 'Home', detail: 'Kepong Baru, 52100 Kuala Lumpur', isDefault: true },
  { id: 'a2', label: 'Office', detail: 'Mont Kiara, 50480 Kuala Lumpur', isDefault: false },
];
const seedSupportMessages: SupportMessage[] = [
  { id: 'm1', from: 'ai', text: 'Hi, I can help with bookings, queue time, payment status, and complaints.', textKey: 'supportSeedHello', createdAt: Date.now() - 1000 * 60 * 8 },
  { id: 'm2', from: 'user', text: 'Which merchant is fastest now?', textKey: 'quickQueue', createdAt: Date.now() - 1000 * 60 * 5 },
  { id: 'm3', from: 'ai', text: 'SparkWash Kepong is fastest now, while food pickup is around 18 minutes.', textKey: 'aiQueueReply', createdAt: Date.now() - 1000 * 60 * 5 + 800 },
];
const seedComplaints: ComplaintTicket[] = [
  { id: 'T1001', topic: 'Service quality follow-up', detail: 'The merchant marked the order ready later than expected.', status: 'reviewing', createdAt: Date.now() - 1000 * 60 * 60 * 22 },
];
const seedSettings: AccountSettings = { bookingReminder: true, paymentAlert: true, whatsappFollowUp: true, darkHeader: true };

const Ctx = createContext<AccountStore | null>(null);

function nextId(prefix: string) { return prefix + Date.now().toString(36) + Math.floor(Math.random() * 1000); }
function cleanPhone(phone: string) { return phone.replace(/\s+/g, '').trim(); }
function setDefault<T extends { id: string; isDefault: boolean }>(items: T[], id: string) { return items.map((item) => ({ ...item, isDefault: item.id === id })); }
function hasDefault<T extends { isDefault: boolean }>(items: T[]) { return items.some((item) => item.isDefault); }
function normalizeDefault<T extends { isDefault: boolean }>(items: T[]) {
  if (items.length === 0 || hasDefault(items)) return items;
  return items.map((item, index) => ({ ...item, isDefault: index === 0 }));
}

function parseSnapshot(raw: string | null): AccountSnapshot | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<AccountSnapshot>;
    if (!Array.isArray(parsed.vehicles) || !Array.isArray(parsed.payments) || !Array.isArray(parsed.addresses)) return null;
    if (!Array.isArray(parsed.supportMessages) || !Array.isArray(parsed.complaints) || !parsed.settings) return null;
    return {
      users: Array.isArray(parsed.users) ? (parsed.users as LocalUser[]) : [],
      currentUserId: typeof parsed.currentUserId === 'string' ? parsed.currentUserId : undefined,
      vehicles: normalizeDefault(parsed.vehicles as Vehicle[]),
      payments: normalizeDefault(parsed.payments as PaymentMethod[]),
      addresses: normalizeDefault(parsed.addresses as Address[]),
      supportMessages: parsed.supportMessages as SupportMessage[],
      complaints: parsed.complaints as ComplaintTicket[],
      settings: { ...seedSettings, ...parsed.settings },
    };
  } catch {
    return null;
  }
}

function makeAiReply(text: string) {
  const lower = text.toLowerCase();
  if (lower.includes('queue') || lower.includes('wait') || lower.includes('giliran') || lower.includes('tunggu')) return 'SparkWash Kepong is currently fastest, and Nasi Lemak Station pickup is around 18 minutes.';
  if (lower.includes('payment') || lower.includes('pay') || lower.includes('bayar')) return 'Payment is still in demo mode. TnG, FPX, and card gateway can be connected when the merchant account is ready.';
  if (lower.includes('complaint') || lower.includes('aduan')) return 'You can open a complaint ticket here. AI Care will keep the WhatsApp follow-up enabled.';
  return 'I can help with order changes, merchant wait times, payment confirmation, and complaint follow-up.';
}

export function AccountProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<LocalUser[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | undefined>();
  const [vehicles, setVehicles] = useState(seedVehicles);
  const [coupons] = useState(seedCoupons);
  const [payments, setPayments] = useState(seedPayments);
  const [addresses, setAddresses] = useState(seedAddresses);
  const [supportMessages, setSupportMessages] = useState(seedSupportMessages);
  const [complaints, setComplaints] = useState(seedComplaints);
  const [settings, setSettings] = useState(seedSettings);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let mounted = true;
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (!mounted) return;
        const snapshot = parseSnapshot(raw);
        if (!snapshot) return;
        setUsers(snapshot.users ?? []);
        setCurrentUserId(snapshot.currentUserId);
        setVehicles(snapshot.vehicles);
        setPayments(snapshot.payments);
        setAddresses(snapshot.addresses);
        setSupportMessages(snapshot.supportMessages);
        setComplaints(snapshot.complaints);
        setSettings(snapshot.settings);
      })
      .finally(() => { if (mounted) setHydrated(true); });
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const snapshot: AccountSnapshot = { users, currentUserId, vehicles, payments, addresses, supportMessages, complaints, settings };
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot)).catch(() => {});
  }, [addresses, complaints, currentUserId, hydrated, payments, settings, supportMessages, users, vehicles]);

  const store = useMemo<AccountStore>(() => {
    const currentUser = users.find((item) => item.id === currentUserId);
    return {
      hydrated,
      users,
      currentUser,
      isAuthenticated: Boolean(currentUser),
      vehicles,
      coupons,
      payments,
      addresses,
      supportMessages,
      complaints,
      settings,
      defaultVehicle: vehicles.find((item) => item.isDefault) ?? vehicles[0],
      defaultPayment: payments.find((item) => item.isDefault) ?? payments[0],
      defaultAddress: addresses.find((item) => item.isDefault) ?? addresses[0],
      registerAccount: (input) => {
        const name = input.name.trim();
        const phone = cleanPhone(input.phone);
        const pin = input.pin.trim();
        const vehiclePlate = input.vehiclePlate.trim().toUpperCase();
        if (!name || !phone || pin.length < 4 || !vehiclePlate) return { ok: false, reason: 'invalid' };
        if (users.some((item) => cleanPhone(item.phone) === phone)) return { ok: false, reason: 'duplicate' };
        const user: LocalUser = { id: nextId('u'), name, phone, pin, level: 'LokalGo Plus', points: 0, packageLeft: 0, packageTotal: 0, createdAt: Date.now() };
        setUsers((prev) => [...prev, user]);
        setCurrentUserId(user.id);
        setVehicles([{ id: nextId('v'), plate: vehiclePlate, model: 'Car-care vehicle', year: 'N/A', isDefault: true }]);
        return { ok: true };
      },
      login: (phone, pin) => {
        const cleanedPhone = cleanPhone(phone);
        const found = users.find((item) => cleanPhone(item.phone) === cleanedPhone && item.pin === pin.trim());
        if (!found) return false;
        setCurrentUserId(found.id);
        return true;
      },
      logout: () => setCurrentUserId(undefined),
      addVehicle: (vehicle) => setVehicles((prev) => [...prev.map((item) => ({ ...item, isDefault: false })), { ...vehicle, id: nextId('v'), isDefault: true }]),
      setDefaultVehicle: (id) => setVehicles((prev) => setDefault(prev, id)),
      addPayment: (payment) => setPayments((prev) => [...prev.map((item) => ({ ...item, isDefault: false })), { ...payment, id: nextId('p'), isDefault: true }]),
      setDefaultPayment: (id) => setPayments((prev) => setDefault(prev, id)),
      addAddress: (address) => setAddresses((prev) => [...prev.map((item) => ({ ...item, isDefault: false })), { ...address, id: nextId('a'), isDefault: true }]),
      updateAddress: (id, address) => setAddresses((prev) => prev.map((item) => (item.id === id ? { ...item, ...address } : item))),
      deleteAddress: (id) => setAddresses((prev) => {
        const remaining = prev.filter((item) => item.id !== id);
        if (!prev.find((item) => item.id === id)?.isDefault || remaining.length === 0) return remaining;
        return remaining.map((item, index) => ({ ...item, isDefault: index === 0 }));
      }),
      setDefaultAddress: (id) => setAddresses((prev) => setDefault(prev, id)),
      sendSupportMessage: (text, replyText) => {
        const trimmed = text.trim();
        if (!trimmed) return;
        const createdAt = Date.now();
        const userMessage: SupportMessage = { id: nextId('m'), from: 'user', text: trimmed, createdAt };
        const aiMessage: SupportMessage = { id: nextId('m'), from: 'ai', text: replyText ?? makeAiReply(trimmed), createdAt: createdAt + 1 };
        setSupportMessages((prev) => [...prev, userMessage, aiMessage]);
      },
      addComplaintTicket: (topic, detail) => setComplaints((prev) => [
        { id: 'T' + (1001 + prev.length), topic: topic.trim(), detail: detail.trim(), status: 'open', createdAt: Date.now() },
        ...prev,
      ]),
      resolveComplaintTicket: (id) => setComplaints((prev) => prev.map((item) => (item.id === id ? { ...item, status: 'resolved' } : item))),
      toggleSetting: (key) => setSettings((prev) => ({ ...prev, [key]: !prev[key] })),
    };
  }, [addresses, complaints, coupons, currentUserId, hydrated, payments, settings, supportMessages, users, vehicles]);

  return <Ctx.Provider value={store}>{children}</Ctx.Provider>;
}

export function useAccount() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useAccount must be used within AccountProvider');
  return ctx;
}

