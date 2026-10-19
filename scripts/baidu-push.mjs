// 百度普通收录 API 推送
// 用法：BAIDU_PUSH_TOKEN=xxx node scripts/baidu-push.mjs
// 可选环境变量：
//   BAIDU_SITE  —— 百度资源平台绑定的站点（默认 https://www.tuanchaye.com）
//   BAIDU_LIMIT —— 单次最多推送条数（默认 50；新站每日配额有限，中文页优先）
// 逻辑：读取构建产物 dist/sitemap.xml，中文页排最前，其次英文，URL 统一改写为绑定站点域名后推送。
import { readFileSync } from 'node:fs';

const TOKEN = process.env.BAIDU_PUSH_TOKEN || '';
const SITE = (process.env.BAIDU_SITE || 'https://www.tuanchaye.com').replace(/\/$/, '');
const LIMIT = parseInt(process.env.BAIDU_LIMIT || '50', 10);

if (!TOKEN) {
  console.log('⚠️ 未配置 BAIDU_PUSH_TOKEN，跳过百度推送。');
  process.exit(0);
}

// 1) 读取 sitemap 全量 URL
let xml = '';
try {
  xml = readFileSync(new URL('../dist/sitemap.xml', import.meta.url), 'utf8');
} catch {
  console.log('⚠️ 找不到 dist/sitemap.xml（需先执行 npm run build），跳过推送。');
  process.exit(0);
}

const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
if (!locs.length) {
  console.log('⚠️ sitemap 中没有 URL，跳过推送。');
  process.exit(0);
}

// 2) 排序：中文页优先 → 英文页 → 其余；并统一改写为百度绑定站点域名
const rank = (u) => (u.includes('/zh/') ? 0 : u.includes('/en/') ? 1 : 2);
const urls = locs
  .sort((a, b) => rank(a) - rank(b) || a.length - b.length)
  .map((u) => u.replace(/^https?:\/\/[^/]+/, SITE))
  .slice(0, LIMIT);

// 3) 推送（百度要求一行一条、Content-Type: text/plain）
const api = `http://data.zz.baidu.com/urls?site=${SITE.replace(/^https?:\/\//, '')}&token=${TOKEN}`;
try {
  const resp = await fetch(api, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body: urls.join('\n'),
  });
  const text = await resp.text();
  console.log(`📤 已推送 ${urls.length} 条 URL 到百度（${SITE}）`);
  console.log(`   百度响应: HTTP ${resp.status} ${text}`);
  console.log('   说明: success=成功条数, remain=当日剩余配额');
} catch (e) {
  console.log(`⚠️ 百度推送请求失败（不影响部署）: ${e.message}`);
}
// 无论推送结果如何都不让部署失败
process.exit(0);
