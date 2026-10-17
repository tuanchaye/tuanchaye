import { defineConfig } from 'astro/config';

// 站点正式域名（上线后改为你的 tuanchaye.com）
// 注：@astrojs/sitemap 在当前 Astro 版本存在兼容问题，已改用 public/sitemap.xml 静态文件。
export default defineConfig({
  site: 'https://tuanchaye.com',
  // Cloudflare Pages 会自动注入，本地无需特殊 adapter（静态输出）
});
