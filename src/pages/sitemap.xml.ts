// 构建时动态生成 sitemap.xml（替换 public/ 下的过期静态文件）
// 覆盖：根路径 + 8 语言 ×（首页/文章列表/关于/联系/隐私/搜索 + 6 分类页 + 全部文章）
import { getCollection } from 'astro:content';
import { LOCALES } from '../i18n/config';
import { CATEGORIES } from '../lib/categories';

const SITE = 'https://tuanchaye.com';

export async function GET() {
  const all = await getCollection('posts');
  const bases = all
    .filter((p) => p.slug.startsWith('en/'))
    .map((p) => p.slug.split('/').slice(1).join('/'));

  const paths: string[] = ['/'];
  for (const lang of LOCALES) {
    // 全站统一无尾斜杠（与 html_handling=drop-trailing-slash 的最终 200 地址一致）
    paths.push(
      `/${lang}`,
      `/${lang}/posts`,
      `/${lang}/about`,
      `/${lang}/contact`,
      `/${lang}/privacy`,
      `/${lang}/search`
    );
    for (const c of CATEGORIES) paths.push(`/${lang}/category/${c.slug}`);
    for (const b of bases) paths.push(`/${lang}/posts/${b}`);
  }

  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    paths.map((p) => `  <url><loc>${SITE}${p}</loc></url>`).join('\n') +
    `\n</urlset>\n`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}
