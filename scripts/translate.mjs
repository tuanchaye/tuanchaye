// 批量翻译脚本：把 src/content/posts/en/*.md 翻译为各语言，写入 src/content/posts/{locale}/
// 保留 pubDate / category / cover，翻译 title / description / 正文。
//
// 用法：
//   node scripts/translate.mjs                 # 翻译全部目标语言
//   node scripts/translate.mjs --locales zh es # 仅翻译指定语言
//   node scripts/translate.mjs --force         # 覆盖已存在的译文
//
// 需要环境变量（二选一）：
//   DEEPSEEK_API_KEY=sk-...      （默认使用 DeepSeek，便宜且质量好）
//   OPENAI_API_KEY=sk-...        （设置后自动用 OpenAI）
// 可选：
//   TRANSLATE_MODEL=gpt-4o-mini  （OpenAI 模型，默认 gpt-4o-mini）
//   CONCURRENCY=5                （并发数，默认 5）

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const POSTS_EN = path.resolve(__dirname, '../src/content/posts/en');
const POSTS_ROOT = path.resolve(__dirname, '../src/content/posts');

const LANG_NAMES = {
  zh: 'Simplified Chinese (中文)',
  es: 'Spanish (Español)',
  fr: 'French (Français)',
  de: 'German (Deutsch)',
  ja: 'Japanese (日本語)',
  pt: 'Portuguese (Português)',
  ru: 'Russian (Русский)',
};

const ALL_LOCALES = Object.keys(LANG_NAMES);

// 解析命令行
const argv = process.argv.slice(2);
let FORCE = false;
let LOCALES = ALL_LOCALES;
for (let i = 0; i < argv.length; i++) {
  if (argv[i] === '--force') FORCE = true;
  if (argv[i] === '--locales') {
    LOCALES = argv[++i].split(',').map((s) => s.trim()).filter(Boolean);
  }
}

const provider = process.env.OPENAI_API_KEY ? 'openai' : 'deepseek';
const apiKey = provider === 'openai' ? process.env.OPENAI_API_KEY : process.env.DEEPSEEK_API_KEY;
const model = provider === 'openai' ? (process.env.TRANSLATE_MODEL || 'gpt-4o-mini') : 'deepseek-chat';
const CONCURRENCY = parseInt(process.env.CONCURRENCY || '5', 10);

if (!apiKey) {
  console.error('✗ 未找到 API Key。请设置 DEEPSEEK_API_KEY 或 OPENAI_API_KEY 环境变量。');
  process.exit(1);
}

// ─── 解析 / 重组 frontmatter ───
function parseFrontmatter(md) {
  const m = md.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) return { fm: '', body: md };
  return { fm: m[1], body: m[2] };
}
function getFmValue(fm, key) {
  const line = fm.split('\n').find((l) => l.startsWith(key + ':'));
  if (!line) return '';
  return line.slice(key.length + 1).trim().replace(/^["']|["']$/g, '');
}
function yamlStr(s) {
  // 转义双引号，整体用双引号包裹
  return '"' + String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '"';
}

// 容错解析：兼容偶发的 ```json 代码围栏包裹，或前后多余文本
function extractJson(text) {
  text = String(text).trim();
  const fence = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fence) text = fence[1].trim();
  if (!text.startsWith('{')) {
    const s = text.indexOf('{');
    const e = text.lastIndexOf('}');
    if (s !== -1 && e !== -1 && e > s) text = text.slice(s, e + 1);
  }
  return JSON.parse(text);
}

// ─── 调用 LLM ───
async function translateArticle(md, langName) {
  const url =
    provider === 'openai'
      ? 'https://api.openai.com/v1/chat/completions'
      : 'https://api.deepseek.com/chat/completions';
  const system =
    `You are a professional translator specializing in Chinese tea content. ` +
    `Translate the following Markdown article from English into ${langName}. ` +
    `Return ONLY a JSON object (no markdown fences) with exactly three keys:\n` +
    `  "title": string — the translated article title\n` +
    `  "description": string — the translated meta description\n` +
    `  "body": string — the FULL translated article body in Markdown, ` +
    `preserving every heading, list, link, code span, and emphasis exactly; ` +
    `only translate the human-readable text. Do not include YAML frontmatter in body.`;
  const resp = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + apiKey,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: md },
      ],
      temperature: 0.3,
      response_format: { type: 'json_object' },
    }),
  });
  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`API ${resp.status}: ${text.slice(0, 300)}`);
  }
  const data = await resp.json();
  const content = data.choices?.[0]?.message?.content || '{}';
  return extractJson(content);
}

async function withRetry(fn, n = 3) {
  let lastErr;
  for (let i = 0; i < n; i++) {
    try {
      return await fn();
    } catch (e) {
      lastErr = e;
      console.warn(`    ↳ 重试 ${i + 1}/${n}: ${e.message}`);
      await new Promise((r) => setTimeout(r, 1500 * (i + 1)));
    }
  }
  throw lastErr;
}

async function run() {
  const files = fs.readdirSync(POSTS_EN).filter((f) => f.endsWith('.md'));
  console.log(`源文章：${files.length} 篇；目标语言：${LOCALES.join(', ')}；provider=${provider}；并发=${CONCURRENCY}`);

  let total = 0;
  for (const locale of LOCALES) {
    if (!LANG_NAMES[locale]) {
      console.warn(`✗ 未知语言 ${locale}，跳过`);
      continue;
    }
    const outDir = path.join(POSTS_ROOT, locale);
    fs.mkdirSync(outDir, { recursive: true });
    const langName = LANG_NAMES[locale];
    console.log(`\n▶ 语言 ${locale} (${langName})`);

    // 并发控制
    let idx = 0;
    const worker = async () => {
      while (idx < files.length) {
        const file = files[idx++];
        const base = file;
        const outPath = path.join(outDir, base);
        if (fs.existsSync(outPath) && !FORCE) {
          console.log(`  ✓ 已存在，跳过 ${base}`);
          continue;
        }
        const md = fs.readFileSync(path.join(POSTS_EN, file), 'utf8');
        const { fm, body } = parseFrontmatter(md);
        const pubDate = getFmValue(fm, 'pubDate');
        const category = getFmValue(fm, 'category');
        const cover = getFmValue(fm, 'cover');
        try {
          const obj = await withRetry(() => translateArticle(md, langName));
          const out =
            `---\n` +
            `title: ${yamlStr(obj.title || getFmValue(fm, 'title'))}\n` +
            `description: ${yamlStr(obj.description || getFmValue(fm, 'description'))}\n` +
            (pubDate ? `pubDate: ${pubDate}\n` : '') +
            (category ? `category: ${yamlStr(category)}\n` : '') +
            (cover ? `cover: ${yamlStr(cover)}\n` : '') +
            `---\n\n` +
            (obj.body || body);
          fs.writeFileSync(outPath, out, 'utf8');
          console.log(`  ✓ ${base}`);
          total++;
        } catch (e) {
          console.error(`  ✗ ${base} 失败：${e.message}`);
        }
      }
    };
    const pool = Array.from({ length: CONCURRENCY }, () => worker());
    await Promise.all(pool);
  }
  console.log(`\n完成。共写入/更新 ${total} 篇译文。`);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
