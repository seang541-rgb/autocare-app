import type { Ionicons } from '@expo/vector-icons';

type IconName = keyof typeof Ionicons.glyphMap;

export type CategoryId = 'car-care' | 'food' | 'retail' | 'services';
export type FulfilmentMode = 'booking' | 'pickup' | 'service';
export type MarketplaceStatus = 'new' | 'accepted' | 'preparing' | 'ready' | 'completed' | 'cancelled';
export type GradientKey = 'car' | 'food' | 'retail' | 'services' | 'merchant' | 'wash' | 'tyre' | 'detail';

export type Category = {
  id: CategoryId;
  name: string;
  subtitle: string;
  icon: IconName;
  grad: GradientKey;
};

export const categories: Category[] = [
  { id: 'car-care', name: 'Car care', subtitle: 'Wash, tyres, detailing', icon: 'car-sport', grad: 'car' },
  { id: 'food', name: 'Food', subtitle: 'Restaurants and cafes', icon: 'restaurant', grad: 'food' },
  { id: 'retail', name: 'Retail', subtitle: 'Shops and convenience', icon: 'bag-handle', grad: 'retail' },
  { id: 'services', name: 'Services', subtitle: 'Beauty, repair, errands', icon: 'sparkles', grad: 'services' },
];

export type Merchant = {
  id: string;
  categoryId: CategoryId;
  name: string;
  area: string;
  distanceKm: number;
  rating: number;
  reviews: number;
  open: string;
  openNow: boolean;
  etaMins: number;
  queueCount: number;
  fulfilment: FulfilmentMode[];
  icon: IconName;
  grad: GradientKey;
  hero: string;
  image: string;
};

export const merchants: Merchant[] = [
  { id: 'm-wash-kepong', categoryId: 'car-care', name: 'SparkWash Kepong', area: 'Kepong, Kuala Lumpur', distanceKm: 1.2, rating: 4.8, reviews: 326, open: '08:00 - 22:00', openNow: true, etaMins: 12, queueCount: 3, fulfilment: ['booking', 'service'], icon: 'car-sport', grad: 'car', hero: 'Fast lane car wash', image: 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?q=80&w=900&auto=format&fit=crop' },
  { id: 'm-nasi-lemak', categoryId: 'food', name: 'Nasi Lemak Station', area: 'Metro Prima', distanceKm: 1.8, rating: 4.7, reviews: 512, open: '07:00 - 21:30', openNow: true, etaMins: 18, queueCount: 6, fulfilment: ['pickup'], icon: 'restaurant', grad: 'food', hero: 'Local meals ready for pickup', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=900&auto=format&fit=crop' },
  { id: 'm-kopi', categoryId: 'food', name: 'Kopi Corner', area: 'Desa ParkCity', distanceKm: 3.1, rating: 4.6, reviews: 228, open: '09:00 - 20:00', openNow: true, etaMins: 10, queueCount: 2, fulfilment: ['pickup'], icon: 'cafe', grad: 'food', hero: 'Coffee and pastries', image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=900&auto=format&fit=crop' },
  { id: 'm-mini-mart', categoryId: 'retail', name: 'QuickMart Local', area: 'Segambut', distanceKm: 2.4, rating: 4.5, reviews: 149, open: '09:00 - 23:00', openNow: true, etaMins: 15, queueCount: 1, fulfilment: ['pickup'], icon: 'bag-handle', grad: 'retail', hero: 'Daily essentials', image: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?q=80&w=900&auto=format&fit=crop' },
  { id: 'm-barber', categoryId: 'services', name: 'Urban Barber', area: 'Kepong Baru', distanceKm: 2.0, rating: 4.9, reviews: 91, open: '10:00 - 20:00', openNow: false, etaMins: 0, queueCount: 0, fulfilment: ['booking', 'service'], icon: 'cut', grad: 'services', hero: 'Appointments and walk-ins', image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=900&auto=format&fit=crop' },
];

export type CatalogItem = {
  id: string;
  merchantId: string;
  name: string;
  desc: string;
  price: number;
  icon: IconName;
  popular?: boolean;
};

export const catalogItems: CatalogItem[] = [
  { id: 'wash-basic', merchantId: 'm-wash-kepong', name: 'Express wash', desc: 'Exterior wash and quick dry', price: 12, icon: 'water', popular: true },
  { id: 'wash-vacuum', merchantId: 'm-wash-kepong', name: 'Wash + vacuum', desc: 'Exterior wash with interior vacuum', price: 18, icon: 'car-sport' },
  { id: 'detail-small', merchantId: 'm-wash-kepong', name: 'Mini detailing', desc: 'Interior wipe, wax shine, tyre dressing', price: 99, icon: 'sparkles' },
  { id: 'nasi-classic', merchantId: 'm-nasi-lemak', name: 'Classic nasi lemak', desc: 'Rice, sambal, egg, peanuts, anchovies', price: 8, icon: 'restaurant', popular: true },
  { id: 'ayam-rempah', merchantId: 'm-nasi-lemak', name: 'Ayam rempah set', desc: 'Spiced fried chicken with nasi lemak', price: 14, icon: 'flame' },
  { id: 'kopi-o', merchantId: 'm-kopi', name: 'Kopi O ais', desc: 'Local iced black coffee', price: 4, icon: 'cafe' },
  { id: 'latte', merchantId: 'm-kopi', name: 'Cafe latte', desc: 'Fresh espresso with steamed milk', price: 11, icon: 'cafe', popular: true },
  { id: 'mart-snack', merchantId: 'm-mini-mart', name: 'Snack bundle', desc: 'Chips, drink and tissue pack', price: 16, icon: 'bag-handle' },
  { id: 'mart-water', merchantId: 'm-mini-mart', name: 'Mineral water 6-pack', desc: 'Pickup-ready household pack', price: 9, icon: 'water' },
  { id: 'barber-cut', merchantId: 'm-barber', name: 'Classic haircut', desc: 'Men haircut with styling', price: 35, icon: 'cut', popular: true },
  { id: 'barber-shave', merchantId: 'm-barber', name: 'Haircut + shave', desc: 'Full grooming appointment', price: 55, icon: 'sparkles' },
];

export type OrderLine = {
  itemId: string;
  name: string;
  qty: number;
  price: number;
};

export type Order = {
  id: string;
  merchantId: string;
  merchantName: string;
  categoryId: CategoryId;
  type: FulfilmentMode;
  status: MarketplaceStatus;
  lines: OrderLine[];
  subtotal: number;
  discount: number;
  total: number;
  date: string;
  time: string;
  note?: string;
  qrCode?: string;
  rating?: number;
  review?: string;
  complaint?: string;
  service: string;
  icon: IconName;
  grad: GradientKey;
  outletId: string;
  outlet: string;
  price: number;
};

export const orders: Order[] = [
  { id: '#LG2401', merchantId: 'm-nasi-lemak', merchantName: 'Nasi Lemak Station', categoryId: 'food', type: 'pickup', status: 'preparing', lines: [{ itemId: 'nasi-classic', name: 'Classic nasi lemak', qty: 2, price: 8 }, { itemId: 'ayam-rempah', name: 'Ayam rempah set', qty: 1, price: 14 }], subtotal: 30, discount: 2, total: 28, date: '2026-06-07', time: '12:20', qrCode: 'LOKALGO|#LG2401|28', service: 'Food pickup', icon: 'restaurant', grad: 'food', outletId: 'm-nasi-lemak', outlet: 'Nasi Lemak Station', price: 28 },
  { id: '#LG2398', merchantId: 'm-wash-kepong', merchantName: 'SparkWash Kepong', categoryId: 'car-care', type: 'booking', status: 'accepted', lines: [{ itemId: 'wash-vacuum', name: 'Wash + vacuum', qty: 1, price: 18 }], subtotal: 18, discount: 0, total: 18, date: '2026-06-07', time: '14:30', qrCode: 'LOKALGO|#LG2398|18', service: 'Car care booking', icon: 'car-sport', grad: 'car', outletId: 'm-wash-kepong', outlet: 'SparkWash Kepong', price: 18 },
  { id: '#LG2380', merchantId: 'm-barber', merchantName: 'Urban Barber', categoryId: 'services', type: 'booking', status: 'completed', lines: [{ itemId: 'barber-cut', name: 'Classic haircut', qty: 1, price: 35 }], subtotal: 35, discount: 0, total: 35, date: '2026-06-02', time: '17:00', qrCode: 'LOKALGO|#LG2380|35', rating: 5, review: 'Clean service and on time.', service: 'Service appointment', icon: 'cut', grad: 'services', outletId: 'm-barber', outlet: 'Urban Barber', price: 35 },
];

export type Promo = {
  id: string;
  title: string;
  sub: string;
  tag: string;
  grad: 'promo1' | 'promo2' | 'promo3';
  icon: IconName;
  fullTitle: string;
  price: number;
  originalPrice?: number;
  unit: string;
  ctaText: string;
  bullets: string[];
  terms: string[];
  bookServiceId?: 'wash';
  bookPrice?: number;
};

export const promos: Promo[] = [
  { id: 'p1', title: 'RM2 off pickup', sub: 'Food and retail merchants', tag: 'Pickup', grad: 'promo1' as const, icon: 'bag-check' as IconName, fullTitle: 'Pickup Saver', price: 0, unit: '', ctaText: 'Use voucher', bullets: ['Valid for pickup orders above RM20', 'Auto applied at checkout'], terms: ['Voucher for marketplace launch preview'], bookServiceId: 'wash' as const, bookPrice: 0 },
  { id: 'p2', title: 'Car wash deals', sub: 'Fast lane appointments', tag: 'Car care', grad: 'promo2' as const, icon: 'car-sport' as IconName, fullTitle: 'Car Care Deals', price: 12, unit: '/slot', ctaText: 'Book now', bullets: ['Selected merchants only'], terms: ['Subject to merchant availability'], bookServiceId: 'wash' as const, bookPrice: 0 },
];

export const notifications = [
  { id: 'n1', icon: 'receipt-outline' as IconName, title: 'Order accepted', body: 'Nasi Lemak Station accepted your pickup order.' },
  { id: 'n2', icon: 'storefront-outline' as IconName, title: 'Merchant update', body: 'SparkWash Kepong has 3 cars in queue, estimated 12 minutes.' },
  { id: 'n3', icon: 'logo-whatsapp' as IconName, title: 'WhatsApp care', body: 'Payment confirmation and order reminders can be sent by WhatsApp.' },
];

export const profile = {
  name: 'John Sean',
  phone: '+60 12-345 6789',
  level: 'LokalGo Member',
  car: { plate: 'WXY 8888', model: 'Honda Civic 1.5 TC-P', year: '2022' },
  packageName: 'Marketplace rewards',
  packageLeft: 8,
  packageTotal: 12,
  points: 1280,
  coupons: 3,
};

export const dates = [
  { label: 'Today', day: '07', week: 'Sun' },
  { label: 'Tomorrow', day: '08', week: 'Mon' },
  { label: '', day: '09', week: 'Tue' },
  { label: '', day: '10', week: 'Wed' },
  { label: '', day: '11', week: 'Thu' },
  { label: '', day: '12', week: 'Fri' },
];

export const timeSlots = ['09:00', '10:30', '12:00', '14:30', '16:00', '17:30', '19:00', '20:30'];

export type Service = {
  id: 'wash' | 'tyre' | 'detail';
  name: string;
  brand: string;
  icon: IconName;
  grad: 'wash' | 'tyre' | 'detail';
  desc: string;
  from: number;
};

export const services: Service[] = [
  { id: 'wash', name: 'Car wash', brand: 'SparkWash', icon: 'water', grad: 'wash', desc: 'Wash and vacuum', from: 12 },
  { id: 'tyre', name: 'Tyre care', brand: 'WheelPro', icon: 'disc', grad: 'tyre', desc: 'Alignment and checks', from: 80 },
  { id: 'detail', name: 'Detailing', brand: 'SparkDetail', icon: 'sparkles', grad: 'detail', desc: 'Interior and polish', from: 99 },
];

export type Outlet = {
  id: string;
  name: string;
  area: string;
  distanceKm: number;
  rating: number;
  reviews: number;
  open: string;
  openNow: boolean;
  queueCars: number;
  waitMins: number;
  lat: number;
  lng: number;
  icon: IconName;
};

export const outlets: Outlet[] = merchants.map((m, index) => ({
  id: m.id,
  name: m.name,
  area: m.area,
  distanceKm: m.distanceKm,
  rating: m.rating,
  reviews: m.reviews,
  open: m.open,
  openNow: m.openNow,
  queueCars: m.queueCount,
  waitMins: m.etaMins,
  lat: 3.2141 + index * 0.01,
  lng: 101.6387 + index * 0.01,
  icon: m.icon,
}));




