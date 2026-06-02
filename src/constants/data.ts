// AutoCare 模拟数据（icon = Ionicons 名称，grad = Gradients key）

import type { Ionicons } from '@expo/vector-icons';
type IconName = keyof typeof Ionicons.glyphMap;

export type Service = {
  id: string;
  name: string;
  brand: string;
  icon: IconName;
  grad: 'wash' | 'tyre' | 'detail' | 'insure';
  desc: string;
  from: number; // 起价 RM
};

export const services: Service[] = [
  { id: 'wash', name: '洗车', brand: 'KeyWash', icon: 'water', grad: 'wash', desc: '自动洗车 · 免费吸尘', from: 12 },
  { id: 'tyre', name: '轮胎保养', brand: 'KeyTyre', icon: 'disc', grad: 'tyre', desc: '换胎 · 定位 · 一般保养', from: 80 },
  { id: 'detail', name: '镀膜美容', brand: 'KeyDetailing', icon: 'sparkles', grad: 'detail', desc: '内外清洁 · 镀膜 · 包膜', from: 199 },
  { id: 'insure', name: '车险续保', brand: 'KeyPlus', icon: 'shield-checkmark', grad: 'insure', desc: '多家比价 · 免息分期', from: 0 },
];

export type Outlet = {
  id: string;
  name: string;
  area: string;
  distanceKm: number;
  rating: number;
  reviews: number;
  open: string;
  icon: IconName;
};

export const outlets: Outlet[] = [
  { id: 'o1', name: 'KeyWash 甲洞旗舰店', area: 'Kepong, KL', distanceKm: 1.2, rating: 4.8, reviews: 326, open: '08:00 - 22:00', icon: 'storefront' },
  { id: 'o2', name: 'KeyWash Segambut 分行', area: 'Segambut, KL', distanceKm: 3.5, rating: 4.6, reviews: 188, open: '08:00 - 23:00', icon: 'business' },
  { id: 'o3', name: 'KeyTyre 轮胎中心', area: 'Kepong, KL', distanceKm: 2.1, rating: 4.7, reviews: 142, open: '09:00 - 19:00', icon: 'construct' },
];

export type Promo = {
  id: string;
  title: string;
  sub: string;
  tag: string;
  grad: 'promo1' | 'promo2' | 'promo3';
  icon: IconName;
};

export const promos: Promo[] = [
  { id: 'p1', title: 'RM50 / 月\n无限洗', sub: '大车小车 一视同车', tag: '本月热卖', grad: 'promo1', icon: 'water' },
  { id: 'p2', title: 'RM1\n体验洗车', sub: '半夜也能洗', tag: '新客限定', grad: 'promo2', icon: 'moon' },
  { id: 'p3', title: '车险续保\n最高省 30%', sub: 'KeyPlus 多家比价', tag: '免息分期', grad: 'promo3', icon: 'shield-checkmark' },
];

export type Order = {
  id: string;
  service: string;
  icon: IconName;
  grad: 'wash' | 'tyre' | 'detail' | 'insure';
  outlet: string;
  date: string;
  time: string;
  price: number;
  status: 'upcoming' | 'done' | 'cancelled';
};

export const orders: Order[] = [
  { id: '#A2391', service: '自动洗车 + 吸尘', icon: 'water', grad: 'wash', outlet: 'KeyWash 甲洞旗舰店', date: '2026-06-03', time: '14:30', price: 18, status: 'upcoming' },
  { id: '#A2384', service: '镀膜美容（小车）', icon: 'sparkles', grad: 'detail', outlet: 'KeyDetailing 甲洞', date: '2026-06-08', time: '10:00', price: 299, status: 'upcoming' },
  { id: '#A2360', service: '四轮定位', icon: 'disc', grad: 'tyre', outlet: 'KeyTyre 轮胎中心', date: '2026-05-21', time: '11:00', price: 80, status: 'done' },
  { id: '#A2351', service: '自动洗车', icon: 'water', grad: 'wash', outlet: 'KeyWash Segambut', date: '2026-05-12', time: '19:30', price: 12, status: 'done' },
];

export const dates = [
  { label: '今天', day: '03', week: '周三' },
  { label: '明天', day: '04', week: '周四' },
  { label: '后天', day: '05', week: '周五' },
  { label: '', day: '06', week: '周六' },
  { label: '', day: '07', week: '周日' },
  { label: '', day: '08', week: '周一' },
];

export const timeSlots = ['09:00', '10:30', '12:00', '14:30', '16:00', '17:30', '19:00', '20:30'];

export const profile = {
  name: 'John Sean',
  phone: '+60 12-345 6789',
  level: 'KeyAuto 金卡会员',
  car: { plate: 'WXY 8888', model: 'Honda Civic 1.5 TC-P', year: '2022' },
  packageName: '本月无限洗',
  packageLeft: 8,
  packageTotal: 12,
  points: 1280,
  coupons: 3,
};
