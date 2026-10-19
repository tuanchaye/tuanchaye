import { getCollection } from 'astro:content';
import { type Locale } from '../i18n/config';
import { canonicalCategory, postCover } from './categories';

export interface PostView {
  base: string; // 去掉语言前缀后的 slug
  title: string;
  description: string;
  category?: string;
  cover: string;
  pubDate: Date;
  fallback: boolean; // true=该语言无译文，回退英文
}

function baseSlug(slug: string): string {
  return slug.split('/').slice(1).join('/');
}

// 取英文规范文章集合（作为各语言页面的"底稿"）
export async function getEnPosts() {
  const all = await getCollection('posts');
  return all.filter((p) => p.slug.startsWith('en/'));
}

// 取某语言下的文章视图：有译文用译文，否则回退英文
export async function getPostsForLocale(locale: Locale): Promise<PostView[]> {
  const all = await getCollection('posts');
  const enPosts = all.filter((p) => p.slug.startsWith('en/'));
  return enPosts.map((en) => {
    const base = baseSlug(en.slug);
    const tr = all.find((p) => p.slug === `${locale}/${base}`);
    const src = tr || en;
    return {
      base,
      title: src.data.title,
      description: src.data.description,
      category: src.data.category,
      cover: postCover(src.data.category, src.data.cover),
      pubDate: src.data.pubDate,
      fallback: !tr,
    };
  });
}

// 单篇文章在某语言下的视图（含 fallback 标记）
export async function getPostView(locale: Locale, base: string) {
  const all = await getCollection('posts');
  const tr = all.find((p) => p.slug === `${locale}/${base}`);
  const en = all.find((p) => p.slug === `en/${base}`);
  const src = tr || en;
  if (!src) return null;
  return {
    post: src,
    fallback: !tr && !!en,
    base,
  };
}

export function filterByCategory(posts: PostView[], catSlug: string): PostView[] {
  return posts.filter((p) => canonicalCategory(p.category) === catSlug);
}
