export const AppBrand = {
  name: 'JagaCar',
  tagline: 'Car care made simple',
} as const;

export const Brand = {
  primary: '#F46A2A',
  primaryDark: '#D94F18',
  primarySoft: '#FFF0E8',

  ink: '#111827',
  navy: '#1F2937',
  navy2: '#374151',

  bg: '#F6F7F9',
  card: '#FFFFFF',
  cardAlt: '#FAFAFB',

  text: '#111827',
  textSub: '#6B7280',
  textMuted: '#9CA3AF',
  textOnDark: '#FFFFFF',
  textOnDarkSub: 'rgba(255,255,255,0.72)',

  border: '#E5E7EB',
  borderDark: 'rgba(255,255,255,0.12)',

  success: '#16A34A',
  successSoft: '#EAF7EE',
  warn: '#D97706',
  warnSoft: '#FFF7E6',
  danger: '#DC2626',
  dangerSoft: '#FEECEC',
  star: '#F59E0B',
  blue: '#2563EB',
  blueSoft: '#EAF1FF',
} as const;

export const Gradients = {
  brand: ['#F97316', '#EA580C'] as const,
  brandDeep: ['#F46A2A', '#D94F18'] as const,
  hero: ['#1F2937', '#111827'] as const,
  wash: ['#3B82F6', '#2563EB'] as const,
  tyre: ['#4B5563', '#1F2937'] as const,
  detail: ['#F97316', '#EA580C'] as const,
  promo1: ['#F97316', '#EA580C'] as const,
  promo2: ['#3B82F6', '#1D4ED8'] as const,
  promo3: ['#10B981', '#059669'] as const,
  card: ['#374151', '#1F2937'] as const,
} as const;

export const Radius = { sm: 8, md: 10, lg: 12, xl: 18, pill: 999 } as const;
export const Gap = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24 } as const;

export const Shadow = {
  soft: {
    shadowColor: '#111827',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  card: {
    shadowColor: '#111827',
    shadowOpacity: 0.035,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 1,
  },
} as const;
