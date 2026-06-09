export const AppBrand = {
  name: 'LokalGo',
  tagline: 'Local merchants, one tap away',
} as const;

export const Brand = {
  primary: '#F97316',
  primaryDark: '#C2410C',
  primarySoft: '#FFF3E8',

  ink: '#0B1220',
  navy: '#111827',
  navy2: '#253044',
  slate: '#475569',

  bg: '#F4F6FA',
  bgWarm: '#FFF8F2',
  card: '#FFFFFF',
  cardAlt: '#F9FAFB',
  cardElevated: '#FFFFFF',

  text: '#101828',
  textSub: '#667085',
  textMuted: '#98A2B3',
  textOnDark: '#FFFFFF',
  textOnDarkSub: 'rgba(255,255,255,0.74)',

  border: '#EAECF0',
  borderStrong: '#D0D5DD',
  borderDark: 'rgba(255,255,255,0.14)',

  success: '#12B76A',
  successSoft: '#EAFBF3',
  warn: '#F79009',
  warnSoft: '#FFF6E6',
  danger: '#D92D20',
  dangerSoft: '#FEF3F2',
  star: '#FDB022',
  blue: '#2E6BFF',
  blueSoft: '#EEF4FF',
  teal: '#0E9384',
  tealSoft: '#E6FFFB',
  purple: '#7A5AF8',
  purpleSoft: '#F4F3FF',
} as const;

export const Gradients = {
  brand: ['#FB923C', '#F97316', '#EA580C'] as const,
  brandDeep: ['#F97316', '#C2410C'] as const,
  hero: ['#111827', '#0B1220'] as const,
  heroWarm: ['#1F2937', '#111827', '#7C2D12'] as const,
  car: ['#38BDF8', '#2563EB'] as const,
  food: ['#FB923C', '#EA580C'] as const,
  retail: ['#34D399', '#059669'] as const,
  services: ['#A78BFA', '#7C3AED'] as const,
  merchant: ['#2DD4BF', '#0F766E'] as const,
  wash: ['#38BDF8', '#2563EB'] as const,
  tyre: ['#64748B', '#1F2937'] as const,
  detail: ['#FB923C', '#EA580C'] as const,
  promo1: ['#FB923C', '#EA580C'] as const,
  promo2: ['#60A5FA', '#2563EB'] as const,
  promo3: ['#34D399', '#059669'] as const,
  card: ['#334155', '#111827'] as const,
  glass: ['rgba(255,255,255,0.22)', 'rgba(255,255,255,0.08)'] as const,
} as const;

export const Radius = { sm: 8, md: 12, lg: 16, xl: 22, xxl: 28, pill: 999 } as const;
export const Gap = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24 } as const;

export const Shadow = {
  soft: {
    shadowColor: '#101828',
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 3,
  },
  card: {
    shadowColor: '#101828',
    shadowOpacity: 0.05,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
    elevation: 2,
  },
  strong: {
    shadowColor: '#101828',
    shadowOpacity: 0.14,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 5,
  },
} as const;
