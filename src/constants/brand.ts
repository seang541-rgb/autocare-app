// AutoCare 设计系统 —— 高级渐变 + 现代深色调

export const Brand = {
  // 主色（暖橙，汽车养护活力感）
  primary: '#FF6A2B',
  primaryDark: '#E8501A',
  primarySoft: '#FFEDE4',

  // 深色系（高级感底色）
  ink: '#0B1020',        // 最深背景
  navy: '#141A2E',       // 卡片深色
  navy2: '#1E2740',      // 次级深色

  // 浅色页面
  bg: '#F5F6FA',
  card: '#FFFFFF',
  cardAlt: '#FBFBFD',

  text: '#0B1020',
  textSub: '#7A8194',
  textOnDark: '#FFFFFF',
  textOnDarkSub: 'rgba(255,255,255,0.62)',

  border: '#EDEEF3',
  borderDark: 'rgba(255,255,255,0.08)',

  success: '#1DBF73',
  successSoft: '#E3F9EF',
  warn: '#F5A623',
  warnSoft: '#FEF3DC',
  star: '#FFB020',
  blue: '#3B82F6',
} as const;

// 渐变色板（配 expo-linear-gradient，[start, end]）
export const Gradients = {
  brand: ['#FF8A3D', '#FF5A1F'] as const,        // 主橙渐变
  brandDeep: ['#FF6A2B', '#E8501A'] as const,
  hero: ['#1E2740', '#0B1020'] as const,         // 英雄区深色
  wash: ['#4F8DFD', '#2563EB'] as const,         // 洗车蓝
  tyre: ['#3A4256', '#1E2740'] as const,         // 轮胎深灰
  detail: ['#FF8A3D', '#FF5A1F'] as const,       // 美容橙
  insure: ['#22C98B', '#12A06A'] as const,       // 车险绿
  promo1: ['#FF8A3D', '#E8501A'] as const,
  promo2: ['#5B8DEF', '#2152C9'] as const,
  promo3: ['#22C98B', '#0E8F5C'] as const,
  card: ['#1E2740', '#141A2E'] as const,
} as const;

export const Radius = { sm: 12, md: 16, lg: 22, xl: 30, pill: 999 } as const;
export const Gap = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24 } as const;

// 统一阴影（提升层次感）
export const Shadow = {
  soft: {
    shadowColor: '#0B1020',
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  card: {
    shadowColor: '#0B1020',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
} as const;
