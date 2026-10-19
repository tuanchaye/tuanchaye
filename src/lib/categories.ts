// 规范分类定义 + 旧分类值映射（用于归并现有 11 个散分类）
// 每个分类配主题渐变色，用于首页入口"首图"banner（纯 CSS/SVG，无外部图片，零版权风险）

export interface CategoryDef {
  slug: string; // URL 与展示用的规范标识
  name: string; // 显示名
  gradient: string; // banner 渐变背景
  cover: string; // 分类封面图（/images/covers/*.svg）
  description: string; // 分类一句话描述（用于首页入口）
}

export const CATEGORIES: CategoryDef[] = [
  {
    slug: 'tea-basics',
    name: 'Tea Basics',
    gradient: 'linear-gradient(135deg,#1b6b3e 0%,#4a9b68 100%)',
    cover: '/images/covers/overview.svg',
    description:
      'What tea is, how it is made, and the fundamentals every beginner should know.',
  },
  {
    slug: 'tea-types',
    name: 'Tea Types',
    gradient: 'linear-gradient(135deg,#9c6b1b 0%,#c8954a 100%)',
    cover: '/images/covers/types.svg',
    description:
      'Green, black, white, oolong, pu-erh and more — explore the six major types.',
  },
  {
    slug: 'brewing',
    name: 'Brewing',
    gradient: 'linear-gradient(135deg,#b5532a 0%,#d98a5a 100%)',
    cover: '/images/covers/brewing.svg',
    description:
      'Water temperature, ratios and step-by-step methods to brew a great cup.',
  },
  {
    slug: 'culture',
    name: 'Culture',
    gradient: 'linear-gradient(135deg,#5b3a8c 0%,#8a6bc0 100%)',
    cover: '/images/covers/ceremony.svg',
    description:
      'Tea ceremonies, history and how tea is enjoyed around the world.',
  },
  {
    slug: 'buying-guide',
    name: 'Buying Guide',
    gradient: 'linear-gradient(135deg,#1b5b8c 0%,#4a8ac0 100%)',
    cover: '/images/covers/buying.svg',
    description: 'How to choose, buy and not overpay for quality tea.',
  },
  {
    slug: 'care-wellbeing',
    name: 'Care & Wellbeing',
    gradient: 'linear-gradient(135deg,#1b8c7a 0%,#4ac0a8 100%)',
    cover: '/images/covers/storage.svg',
    description:
      'Storing tea, cleaning ware, and tea and your health.',
  },
];

// 旧/散分类值 -> 规范 slug
export const CATEGORY_MAP: Record<string, string> = {
  'Tea Basics': 'tea-basics',
  'Tea Types': 'tea-types',
  'Brewing': 'brewing',
  'Brewing Guides': 'brewing',
  'Culture': 'culture',
  'Tea Culture': 'culture',
  'Buying Guide': 'buying-guide',
  'Care & Wellbeing': 'care-wellbeing',
  'Care': 'care-wellbeing',
  'Wellness': 'care-wellbeing',
  'Tea & Health': 'care-wellbeing',
  'Lifestyle': 'care-wellbeing',
};

// 将文章原始 category 归一到规范 slug
export function canonicalCategory(raw?: string): string {
  if (!raw) return 'tea-basics';
  if (CATEGORIES.some((c) => c.slug === raw)) return raw;
  return CATEGORY_MAP[raw] ?? 'tea-basics';
}

export function getCategory(slug: string): CategoryDef {
  return CATEGORIES.find((c) => c.slug === slug) ?? CATEGORIES[0];
}

// 文章封面：优先用文章自带 cover，否则回退到其分类封面
export function postCover(rawCategory?: string, cover?: string): string {
  if (cover) return cover;
  return getCategory(canonicalCategory(rawCategory)).cover;
}

// 本地化分类（名称/描述按语言返回，封面与渐变保持原样）
import { type Locale } from '../i18n/config';
import { getCatI18n } from '../i18n/categories';
export function getCategoryLocalized(slug: string, locale: Locale) {
  const base = getCategory(slug);
  const t = getCatI18n(slug, locale);
  return { ...base, name: t.name, description: t.description };
}
