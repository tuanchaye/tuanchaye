#!/usr/bin/env node
/**
 * 外链图片自动转存（mirror external images）
 *
 * 背景：后台粘贴文章时，正文图片常留在第三方图床/生图空间（如 s.coze.cn、
 * bytemimg 等签名 URL），这些空间有有效期（如 1 年），到期后站内图片会批量失效。
 *
 * 做法：构建前扫描 src/content/posts 下所有 Markdown：
 *   1. 找出正文里的外链图片（Markdown ![](url) 和 <img src="url"> 两种写法）；
 *   2. 下载到 public/images/mirrored/<hash>.<ext>（跟随短链重定向，
 *      按内容类型定扩展名；同一 URL 全站只下载一次，幂等可重复运行）；
 *   3. 把文中 URL 改写为本地路径 /images/mirrored/<hash>.<ext>。
 *
 * 容错：单张下载失败只警告并保留原 URL，不中断构建（下次部署会重试）。
 */
import { readdirSync, readFileSync, writeFileSync, mkdirSync, existsSync, statSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const POSTS_DIR = join(ROOT, 'src', 'content', 'posts');
const OUT_DIR = join(ROOT, 'public', 'images', 'mirrored');
const LOCAL_PREFIX = '/images/mirrored/';

const MAX_SIZE = 20 * 1024 * 1024; // 20MB
const TIMEOUT_MS = 60_000;
const EXT_BY_TYPE = {
  'image/jpeg': '.jpg',
  'image/jpg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
  'image/avif': '.avif',
  'image/svg+xml': '.svg',
};

const contentFiles = [];
(function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const s = statSync(p);
    if (s.isDirectory()) walk(p);
    else if (/\.(md|mdx)$/i.test(name)) contentFiles.push(p);
  }
})(POSTS_DIR);

// 收集所有外链图片 URL（Markdown / HTML 两种写法），返回 [{file, url, match, isMarkdown}]
function collect(file) {
  const src = readFileSync(file, 'utf8');
  const found = [];
  // Markdown: ![alt](url)  — url 不含空格和括号
  const mdRe = /!\[([^\]]*)\]\((https?:\/\/[^)\s]+)\)/g;
  let m;
  while ((m = mdRe.exec(src))) found.push({ file, url: m[2], token: m[0], md: true, alt: m[1] });
  // HTML: <img ... src="url"> 或 src='url'
  const htmlRe = /<img\b[^>]*?\bsrc=["'](https?:\/\/[^"'\s>]+)["'][^>]*?>/gi;
  while ((m = htmlRe.exec(src))) found.push({ file, url: m[1], token: m[0], md: false });
  return found;
}

// 压缩图片：限制最大宽度 1600px，重编码减小体积（生图软件原图常达数百 KB～数 MB）
// 返回 { buf, ext }（ext 可能与原始不同，如 svg 原样跳过）
async function compress(buf, ext) {
  // 小于 150KB 的图不压（收益小，避免二次有损）
  if (buf.length < 150 * 1024) return { buf, ext };
  const img = sharp(buf, { failOn: 'none' }).rotate(); // 按 EXIF 自动转向
  const meta = await img.metadata();
  if (!meta.width || !meta.height) return { buf, ext };
  let pipeline = img;
  if (meta.width > 1600) pipeline = pipeline.resize({ width: 1600, withoutEnlargement: true });
  if (ext === '.jpg') {
    const out = await pipeline.jpeg({ quality: 78, progressive: true, mozjpeg: true }).toBuffer();
    if (out.length < buf.length) return { buf: out, ext };
  } else if (ext === '.png') {
    const out = await pipeline.png({ compressionLevel: 9, palette: true, quality: 80 }).toBuffer();
    if (out.length < buf.length) return { buf: out, ext };
  } else if (ext === '.webp') {
    const out = await pipeline.webp({ quality: 78 }).toBuffer();
    if (out.length < buf.length) return { buf: out, ext };
  }
  // gif/avif/svg 等原样保存
  return { buf, ext };
}

async function download(url) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      signal: ctrl.signal,
      redirect: 'follow',
      headers: { 'user-agent': 'Mozilla/5.0 (compatible; tuanchaye-bot/1.0)' },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const type = (res.headers.get('content-type') || '').split(';')[0].trim().toLowerCase();
    if (!EXT_BY_TYPE[type]) throw new Error(`非图片类型: ${type || '未知'}`);
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length === 0) throw new Error('空文件');
    if (buf.length > MAX_SIZE) throw new Error(`超过 ${MAX_SIZE / 1024 / 1024}MB 上限`);
    return { buf, ext: EXT_BY_TYPE[type] };
  } finally {
    clearTimeout(timer);
  }
}

let ok = 0, skip = 0, fail = 0;
const urlCache = new Map(); // url -> local path or null(失败)

// 全部待处理条目
const entries = contentFiles.flatMap(collect);
if (entries.length === 0) {
  console.log('[mirror-images] 未发现外链图片，无需处理。');
  process.exit(0);
}
console.log(`[mirror-images] 发现 ${entries.length} 处外链图片引用（含多语言重复），开始转存…`);

// 逐 URL 转存（去重）
for (const e of entries) {
  if (e.url.startsWith(LOCAL_PREFIX)) { skip++; continue; }
  if (!urlCache.has(e.url)) {
    const hash = createHash('sha1').update(e.url).digest('hex').slice(0, 16);
    try {
    const { buf: raw, ext } = await download(e.url);
    let buf = raw, finalExt = ext;
    try {
      ({ buf, ext: finalExt } = await compress(raw, ext));
    } catch (cErr) {
      console.warn(`  ⚠ 压缩失败（用原图保存）: ${cErr.message}`);
    }
    const name = `${hash}${finalExt}`;
    const outPath = join(OUT_DIR, name);
    if (!existsSync(outPath)) {
      mkdirSync(OUT_DIR, { recursive: true });
      writeFileSync(outPath, buf);
    }
    urlCache.set(e.url, `${LOCAL_PREFIX}${name}`);
    const saved = raw.length === buf.length ? '' : `，压缩 ${(raw.length / 1024).toFixed(0)}KB→${(buf.length / 1024).toFixed(0)}KB`;
    console.log(`  ✔ ${e.url} -> ${LOCAL_PREFIX}${name} (${(buf.length / 1024).toFixed(0)}KB${saved})`);
    } catch (err) {
      urlCache.set(e.url, null);
      console.warn(`  ✖ ${e.url} 下载失败（保留原链接，下次部署重试）: ${err.message}`);
    }
  }
}

// 改写文件
const byFile = new Map();
for (const e of entries) {
  const local = urlCache.get(e.url);
  if (!local) { fail++; continue; }
  if (local === `${LOCAL_PREFIX}`) continue;
  if (!byFile.has(e.file)) byFile.set(e.file, { src: readFileSync(e.file, 'utf8'), list: [] });
  byFile.get(e.file).list.push({ token: e.token, url: e.url, local, md: e.md, alt: e.alt });
}

for (const [file, { src, list }] of byFile) {
  let out = src;
  let changed = 0;
  for (const { token, local, md, alt } of list) {
    const replacement = md ? `![${alt || ''}](${local})` : token.replace(/src=["'][^"']+["']/, `src="${local}"`);
    if (out.includes(token)) {
      out = out.split(token).join(replacement);
      changed++;
    }
  }
  if (changed > 0) {
    writeFileSync(file, out);
    ok += changed;
    console.log(`  ✎ ${file.replace(ROOT + '\\', '').replace(ROOT + '/', '')} 改写 ${changed} 处`);
  }
}

console.log(`[mirror-images] 完成：转写成功 ${ok} 处，跳过 ${skip} 处，失败保留原链 ${fail} 处。`);
process.exit(0); // 单张失败不阻断构建
