import type { Ionicons } from '@expo/vector-icons';

type IconName = keyof typeof Ionicons.glyphMap;

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
  { id: 'wash', name: '洗车', brand: 'JagaWash', icon: 'water', grad: 'wash', desc: '自动洗车 · 免费吸尘', from: 12 },
  { id: 'tyre', name: '轮胎保养', brand: 'JagaTyre', icon: 'disc', grad: 'tyre', desc: '换胎 · 定位 · 快速检查', from: 80 },
  { id: 'detail', name: '美容护理', brand: 'JagaDetail', icon: 'sparkles', grad: 'detail', desc: '内外清洁 · 镀膜护理', from: 199 },
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

export const outlets: Outlet[] = [
  {
    id: 'o1',
    name: 'JagaWash 甲洞店',
    area: 'Kepong, KL',
    distanceKm: 1.2,
    rating: 4.8,
    reviews: 326,
    open: '08:00 - 22:00',
    openNow: true,
    queueCars: 3,
    waitMins: 12,
    lat: 3.2141,
    lng: 101.6387,
    icon: 'storefront',
  },
  {
    id: 'o2',
    name: 'JagaWash Segambut',
    area: 'Segambut, KL',
    distanceKm: 3.5,
    rating: 4.6,
    reviews: 188,
    open: '08:00 - 23:00',
    openNow: true,
    queueCars: 6,
    waitMins: 25,
    lat: 3.1898,
    lng: 101.6671,
    icon: 'business',
  },
  {
    id: 'o3',
    name: 'JagaTyre 轮胎中心',
    area: 'Kepong, KL',
    distanceKm: 2.1,
    rating: 4.7,
    reviews: 142,
    open: '09:00 - 19:00',
    openNow: false,
    queueCars: 0,
    waitMins: 0,
    lat: 3.2063,
    lng: 101.6429,
    icon: 'construct',
  },
];

export type Promo = {
  id: string;
  title: string;
  sub: string;
  tag: string;
  grad: 'promo1' | 'promo2';
  icon: IconName;
  fullTitle: string;
  price: number;
  originalPrice?: number;
  unit: string;
  ctaText: string;
  bullets: string[];
  terms: string[];
  bookServiceId: 'wash';
  bookPrice?: number;
};

export const promos: Promo[] = [
  {
    id: 'p1',
    title: 'RM50 / 月\n无限洗',
    sub: '适合高频用车',
    tag: '月卡',
    grad: 'promo1',
    icon: 'water',
    fullTitle: 'JagaWash 月卡',
    price: 50,
    originalPrice: 144,
    unit: '/月',
    ctaText: '开通月卡',
    bullets: ['30 天内不限次数洗车', '同一车辆不限大车小车', '含高压冲洗、泡沫和风干', '会员快速通道'],
    terms: ['有效期为开通起 30 天', '限本人车辆使用', '到店出示会员二维码核销', '不可转让或退款'],
    bookServiceId: 'wash',
    bookPrice: 50,
  },
  {
    id: 'p2',
    title: 'RM1\n新客体验',
    sub: '第一次洗车更轻松',
    tag: '新客',
    grad: 'promo2',
    icon: 'moon',
    fullTitle: 'RM1 新客体验洗车',
    price: 1,
    originalPrice: 12,
    unit: '/次',
    ctaText: 'RM1 抢购',
    bullets: ['仅限新用户首单', '24 小时门店可用', '标准自动洗车一次', '包含免费内部吸尘'],
    terms: ['每个新账号限购 1 次', '需在 7 天内到店使用', '到店出示订单二维码', '不与其他优惠同享'],
    bookServiceId: 'wash',
    bookPrice: 1,
  },
];

export type Order = {
  id: string;
  service: string;
  icon: IconName;
  grad: 'wash' | 'tyre' | 'detail';
  outletId: string;
  outlet: string;
  date: string;
  time: string;
  price: number;
  status: 'upcoming' | 'done' | 'cancelled';
  rating?: number;
  review?: string;
  complaint?: string;
};

export const orders: Order[] = [
  { id: '#A2391', service: '自动洗车 + 吸尘', icon: 'water', grad: 'wash', outletId: 'o1', outlet: 'JagaWash 甲洞店', date: '2026-06-03', time: '14:30', price: 18, status: 'upcoming' },
  { id: '#A2384', service: '美容护理（小车）', icon: 'sparkles', grad: 'detail', outletId: 'o1', outlet: 'JagaWash 甲洞店', date: '2026-06-08', time: '10:00', price: 299, status: 'upcoming' },
  { id: '#A2360', service: '四轮定位', icon: 'disc', grad: 'tyre', outletId: 'o3', outlet: 'JagaTyre 轮胎中心', date: '2026-05-21', time: '11:00', price: 80, status: 'done', rating: 5, review: '服务很快，定位后方向盘稳定很多。' },
  { id: '#A2351', service: '自动洗车', icon: 'water', grad: 'wash', outletId: 'o2', outlet: 'JagaWash Segambut', date: '2026-05-12', time: '19:30', price: 12, status: 'done' },
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
  level: 'JagaCar Gold',
  car: { plate: 'WXY 8888', model: 'Honda Civic 1.5 TC-P', year: '2022' },
  packageName: 'JagaWash 月卡',
  packageLeft: 8,
  packageTotal: 12,
  points: 1280,
  coupons: 3,
};

export const notifications = [
  { id: 'n1', icon: 'calendar' as const, title: '预约提醒', body: '明天 14:30 到 JagaWash 甲洞店洗车，请提前 10 分钟到店。' },
  { id: 'n2', icon: 'logo-whatsapp' as const, title: 'WhatsApp 已发送', body: '付款成功通知和二维码链接已发送到你的 WhatsApp。' },
  { id: 'n3', icon: 'chatbubble-ellipses' as const, title: 'AI 客服', body: '可以询问改期、排队时间、门店营业状态和投诉进度。' },
];
