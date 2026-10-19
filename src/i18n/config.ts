// 多语言站点配置
// 所有公开页面均带 /{lang}/ 前缀（含默认语言 en），由 Cloudflare Worker 按访客国家/手动选择跳转。

export const LOCALES = ['en', 'zh', 'es', 'fr', 'de', 'ja', 'pt', 'ru'] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'en';

// 语言显示名（用于切换器）
export const LOCALE_NAMES: Record<Locale, string> = {
  en: 'English',
  zh: '中文',
  es: 'Español',
  fr: 'Français',
  de: 'Deutsch',
  ja: '日本語',
  pt: 'Português',
  ru: 'Русский',
};

// Cloudflare 请求头 request.cf.country（ISO-3166-1 alpha-2）-> 站点语言
// 未列出或无法识别的国家一律回退到英文。
export const COUNTRY_TO_LOCALE: Record<string, Locale> = {
  // 中文圈
  CN: 'zh', HK: 'zh', TW: 'zh', MO: 'zh', SG: 'zh', MY: 'zh',
  // 西班牙语圈
  ES: 'es', MX: 'es', AR: 'es', CO: 'es', CL: 'es', PE: 'es', VE: 'es',
  EC: 'es', UY: 'es', PY: 'es', BO: 'es', CR: 'es', DO: 'es', PA: 'es',
  GT: 'es', SV: 'es', HN: 'es', NI: 'es', CU: 'es', PR: 'es', GQ: 'es',
  // 法语圈
  FR: 'fr', BE: 'fr', LU: 'fr', MC: 'fr', CH: 'fr',
  // 德语圈
  DE: 'de', AT: 'de', LI: 'de',
  // 日语圈
  JP: 'ja',
  // 葡萄牙语圈
  PT: 'pt', BR: 'pt', AO: 'pt', MZ: 'pt', CV: 'pt', GW: 'pt', ST: 'pt', TL: 'pt',
  // 俄语圈
  RU: 'ru', BY: 'ru', KZ: 'ru', KG: 'ru', TJ: 'ru', TM: 'ru', UZ: 'ru',
  AM: 'ru', GE: 'ru', MD: 'ru',
};

export function isLocale(s: string | undefined | null): s is Locale {
  return !!s && (LOCALES as readonly string[]).includes(s);
}

// 根据访客国家解析默认语言（IP 自动切换）
export function localeFromCountry(country?: string | null): Locale {
  if (!country || country === 'XX' || country === 'T1') return DEFAULT_LOCALE;
  return COUNTRY_TO_LOCALE[country.toUpperCase()] ?? DEFAULT_LOCALE;
}

// 站点支持的语言前缀集合（用于 Worker 识别已有语言前缀）
export const LOCALE_PREFIXES: string[] = [...LOCALES];
