import { defineConfig } from 'astro/config';

// 站点正式域名（上线后改为你的 tuanchaye.com）
// 注：@astrojs/sitemap 在当前 Astro 版本存在兼容问题，已改用 public/sitemap.xml 静态文件。

// 正文图片懒加载：给 Markdown/HTML 内容里的 <img>（顶部封面 .post-cover 除外）
// 自动加 loading="lazy" + decoding="async"，多图长文滚动到可视区才加载，首屏更快
function rehypeLazyImages() {
  return (tree) => {
    const walk = (node) => {
      if (!node) return;
      if (Array.isArray(node)) {
        node.forEach(walk);
        return;
      }
      if (node.type === 'element' && node.tagName === 'img') {
        const cls = node.properties?.className;
        const classes = Array.isArray(cls) ? cls : cls ? [cls] : [];
        if (!classes.includes('post-cover')) {
          node.properties.loading = 'lazy';
          node.properties.decoding = 'async';
        }
      }
      if (node.children) node.children.forEach(walk);
    };
    walk(tree);
  };
}

export default defineConfig({
  site: 'https://tuanchaye.com',
  markdown: {
    rehypePlugins: [rehypeLazyImages],
  },
  // Cloudflare Pages 会自动注入，本地无需特殊 adapter（静态输出）
});
