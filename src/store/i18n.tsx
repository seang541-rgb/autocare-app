import { createContext, ReactNode, useContext, useMemo, useState } from 'react';

export type Language = 'zh' | 'en' | 'ms';

const labels: Record<Language, Record<string, string>> = {
  zh: {
    home: '首页',
    booking: '预约',
    orders: '订单',
    staff: '核销',
    profile: '我的',
    language: '语言',
    chinese: '中文',
    english: 'English',
    malay: 'Bahasa Melayu',
    nearbyOutlets: '附近门店',
    queueStatus: '门店地图和排队状态',
    openNow: '营业中',
    closed: '休息中',
    wait: '预计等待',
    cars: '辆车排队',
    aiCare: 'AI 客服 / WhatsApp',
    askAi: '询问 AI 客服',
    staffDesk: '员工核销端',
  },
  en: {
    home: 'Home',
    booking: 'Book',
    orders: 'Orders',
    staff: 'Redeem',
    profile: 'Me',
    language: 'Language',
    chinese: '中文',
    english: 'English',
    malay: 'Bahasa Melayu',
    nearbyOutlets: 'Nearby outlets',
    queueStatus: 'Map and queue status',
    openNow: 'Open',
    closed: 'Closed',
    wait: 'Est. wait',
    cars: 'cars waiting',
    aiCare: 'AI Care / WhatsApp',
    askAi: 'Ask AI care',
    staffDesk: 'Staff redemption',
  },
  ms: {
    home: 'Utama',
    booking: 'Tempah',
    orders: 'Pesanan',
    staff: 'Tebus',
    profile: 'Saya',
    language: 'Bahasa',
    chinese: '中文',
    english: 'English',
    malay: 'Bahasa Melayu',
    nearbyOutlets: 'Cawangan berdekatan',
    queueStatus: 'Peta dan giliran',
    openNow: 'Dibuka',
    closed: 'Ditutup',
    wait: 'Anggaran tunggu',
    cars: 'kereta menunggu',
    aiCare: 'AI Khidmat / WhatsApp',
    askAi: 'Tanya AI',
    staffDesk: 'Tebusan staf',
  },
};

type I18nStore = {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
};

const Ctx = createContext<I18nStore | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>('zh');
  const store = useMemo(
    () => ({
      lang,
      setLang,
      t: (key: string) => labels[lang][key] ?? labels.zh[key] ?? key,
    }),
    [lang],
  );

  return <Ctx.Provider value={store}>{children}</Ctx.Provider>;
}

export function useI18n() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}
