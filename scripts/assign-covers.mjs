// 为 30 篇文章按主题分配封面：在 frontmatter 写入 cover 字段
// 运行：node scripts/assign-covers.mjs
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const POSTS = new URL('../src/content/posts/', import.meta.url);

const MAP = {
  'chinese-tea-ceremony': 'ceremony',
  'how-to-brew-green-tea': 'green',
  'what-is-oolong-tea': 'oolong',
  'six-major-tea-types': 'types',
  'black-tea-guide': 'black',
  'white-tea-guide': 'white',
  'choose-teapot': 'brewing',
  'tea-caffeine-guide': 'health',
  'cold-brew-tea': 'cup',
  'puerh-tea-guide': 'puerh',
  'buy-green-tea': 'buying',
  'english-vs-chinese-tea': 'ceremony',
  'clean-tea-ware': 'cup',
  'store-tea': 'storage',
  'yellow-tea-guide': 'yellow',
  'matcha-guide': 'matcha',
  'herbal-teas-china': 'types',
  'tea-by-season': 'seasons',
  'tea-gift-guide': 'gift',
  'beginner-tea-myths': 'overview',
  'tea-food-pairing': 'pairing',
  'how-to-brew-oolong': 'brewing',
  'tea-tasting-guide': 'tasting',
  'chinese-tea-history': 'ceremony',
  'teapot-materials': 'brewing',
  'water-temperature-guide': 'water',
  'tie-guan-yin-guide': 'oolong',
  'long-jing-guide': 'green',
  'tea-for-beginners': 'overview',
  'tea-and-water': 'water',
};

const files = readdirSync(POSTS).filter((f) => f.endsWith('.md'));
let updated = 0, skipped = 0, missing = 0;

for (const f of files) {
  const slug = f.replace(/\.md$/, '');
  const cover = MAP[slug];
  const text = readFileSync(new URL(f, POSTS), 'utf8');

  // 已存在 cover 则跳过
  if (/^cover\s*:/m.test(text)) { skipped++; continue; }

  if (!cover) { missing++; console.log('NO MAP for', slug); continue; }

  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  if (!m) { console.log('NO FRONTMATTER', slug); continue; }

  const fm = m[1];
  const rest = text.slice(m[0].length);
  const newFm = fm + `\ncover: /images/covers/${cover}.svg`;
  writeFileSync(new URL(f, POSTS), `---\n${newFm}\n---\n${rest}`, 'utf8');
  updated++;
}

console.log(`updated=${updated} skipped=${skipped} missing=${missing} total=${files.length}`);
