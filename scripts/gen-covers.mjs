// 生成茶叶主题 SVG 封面图库（16:9，扁平插画风，零版权/零外链）
// 运行：node scripts/gen-covers.mjs
import { mkdirSync, writeFileSync } from 'node:fs';

const OUT = new URL('../public/images/covers/', import.meta.url);
mkdirSync(OUT, { recursive: true });

// 一片茶叶的 SVG 片段
function leaf(x, y, s, rot, fill, op = 1) {
  return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})" opacity="${op}">
    <path d="M0 0 C 18 -22 46 -22 60 0 C 46 22 18 22 0 0 Z" fill="${fill}"/>
    <path d="M0 0 L 60 0" stroke="rgba(255,255,255,.35)" stroke-width="1.2" fill="none"/>
  </g>`;
}

// 茶杯 + 热气 片段
function cup(accent, steam = 'rgba(255,255,255,.7)') {
  return `
    <g transform="translate(400 250)">
      <g stroke="${steam}" stroke-width="4" fill="none" stroke-linecap="round" opacity=".8">
        <path d="M-22 -40 q 10 -16 0 -32 q -10 -16 0 -32"/>
        <path d="M22 -40 q 10 -16 0 -32 q -10 -16 0 -32"/>
      </g>
      <path d="M-70 0 h140 l-16 70 a 54 18 0 0 1 -108 0 Z" fill="#fff" opacity=".95"/>
      <path d="M-70 0 h140 l-16 70 a 54 18 0 0 1 -108 0 Z" fill="${accent}" opacity=".12"/>
      <ellipse cx="0" cy="0" rx="70" ry="14" fill="${accent}" opacity=".25"/>
      <path d="M70 14 q 34 6 30 40 q -4 26 -34 26" stroke="#fff" stroke-width="10" fill="none" opacity=".9"/>
    </g>`;
}

// 茶枝（多片叶）片段
function sprig(accent) {
  return `<g transform="translate(400 235)">
    <path d="M0 90 C -6 40 -4 -10 0 -70" stroke="${accent}" stroke-width="6" fill="none" stroke-linecap="round"/>
    ${leaf(-26, -10, 1.1, -35, accent, .9)}
    ${leaf(26, 10, 1.1, 35, accent, .9)}
    ${leaf(-22, 40, 1.0, -30, accent, .85)}
    ${leaf(22, 60, 1.0, 30, accent, .85)}
    ${leaf(0, -50, 1.2, 0, accent, .95)}
  </g>`;
}

// 普洱茶饼 片段
function cake(accent) {
  return `<g transform="translate(400 265)">
    <ellipse cx="0" cy="20" rx="120" ry="34" fill="${accent}" opacity=".25"/>
    <ellipse cx="0" cy="0" rx="120" ry="40" fill="#fff" opacity=".95"/>
    <ellipse cx="0" cy="0" rx="120" ry="40" fill="${accent}" opacity=".15"/>
    <ellipse cx="0" cy="0" rx="44" ry="15" fill="none" stroke="${accent}" stroke-width="3" opacity=".5"/>
    <circle cx="0" cy="0" r="6" fill="${accent}" opacity=".6"/>
  </g>`;
}

// 茶山梯田 片段
function hills(accent) {
  return `<g>
    <path d="M0 360 q 200 -70 400 0 t 400 0 V450 H0 Z" fill="${accent}" opacity=".30"/>
    <path d="M0 395 q 200 -60 400 0 t 400 0 V450 H0 Z" fill="${accent}" opacity=".22"/>
    <path d="M0 425 q 200 -50 400 0 t 400 0 V450 H0 Z" fill="${accent}" opacity=".16"/>
  </g>`;
}

// 抹茶碗 + 竹筅 片段
function whisk(accent) {
  return `<g transform="translate(400 260)">
    <path d="M-78 10 h156 a 78 26 0 0 1 -156 0 Z" fill="#fff" opacity=".95"/>
    <ellipse cx="0" cy="10" rx="78" ry="26" fill="${accent}" opacity=".35"/>
    <rect x="-6" y="-90" width="12" height="90" rx="6" fill="#caa46a"/>
    <g stroke="#caa46a" stroke-width="2.2">
      ${Array.from({length:9}).map((_,i)=>`<line x1="${-30+i*7.5}" y1="-90" x2="${-22+i*5.5}" y2="-6"/>`).join('')}
    </g>
  </g>`;
}

const THEMES = {
  'overview':         { bg:['#1b6b3e','#0f4a2a'], accent:'#4a9b68', motif:'sprig' },
  'types':            { bg:['#9c6b1b','#6b4410'], accent:'#d9a24a', motif:'leaves' },
  'green':            { bg:['#2f8f4e','#155a2c'], accent:'#7ed99a', motif:'sprig' },
  'black':            { bg:['#7a3b1e','#4a1f0e'], accent:'#d98a5a', motif:'cup' },
  'white':            { bg:['#cdd6cf','#9fb0a3'], accent:'#ffffff', motif:'sprig' },
  'oolong':           { bg:['#b5801f','#7a5410'], accent:'#e8c46a', motif:'leaves' },
  'puerh':            { bg:['#5b3a1e','#33200f'], accent:'#c79a5a', motif:'cake' },
  'matcha':           { bg:['#3f7d2e','#234d18'], accent:'#9bd66b', motif:'whisk' },
  'brewing':          { bg:['#b5532a','#7a2f15'], accent:'#f0a878', motif:'cup' },
  'cup':              { bg:['#1b5b8c','#0f3a5a'], accent:'#7ec0e8', motif:'cup' },
  'ceremony':         { bg:['#5b3a8c','#331f5a'], accent:'#b08ad8', motif:'sprig' },
  'buying':           { bg:['#1b5b8c','#0f3a5a'], accent:'#6fb0e8', motif:'leaves' },
  'storage':          { bg:['#1b8c7a','#0f5247'], accent:'#5fd0b8', motif:'cake' },
  'health':           { bg:['#1b8c5a','#0f5234'], accent:'#5fd08a', motif:'cup' },
  'seasons':          { bg:['#c97b2e','#7a3f12'], accent:'#f0c06a', motif:'leaves' },
  'gift':             { bg:['#a23b6b','#5a1f3f'], accent:'#e87aa8', motif:'leaves' },
  'yellow':           { bg:['#d9b54a','#9c7a1f'], accent:'#fff0b8', motif:'sprig' },
  'tasting':          { bg:['#1b6b3e','#0f4a2a'], accent:'#7ed99a', motif:'cup' },
  'pairing':          { bg:['#5b3a8c','#331f5a'], accent:'#c8a8e8', motif:'leaves' },
  'water':            { bg:['#1b8c9c','#0f5260'], accent:'#7ed8e8', motif:'cup' },
};

function motifSvg(theme, accent) {
  switch (theme.motif) {
    case 'cup': return cup(accent);
    case 'sprig': return sprig(accent);
    case 'leaves': return sprig(accent);
    case 'cake': return cake(accent);
    case 'whisk': return whisk(accent);
    default: return cup(accent);
  }
}

for (const [name, t] of Object.entries(THEMES)) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450" width="800" height="450" role="img">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${t.bg[0]}"/>
      <stop offset="1" stop-color="${t.bg[1]}"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="38%" r="55%">
      <stop offset="0" stop-color="#ffffff" stop-opacity=".20"/>
      <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="800" height="450" fill="url(#bg)"/>
  <rect width="800" height="450" fill="url(#glow)"/>
  ${hills(t.accent)}
  ${motifSvg(t, t.accent)}
  ${leaf(120, 110, 1.4, -25, '#ffffff', .12)}
  ${leaf(680, 130, 1.6, 30, '#ffffff', .12)}
  ${leaf(640, 320, 1.2, 200, '#ffffff', .10)}
  ${leaf(150, 330, 1.1, 160, '#ffffff', .10)}
</svg>`;
  writeFileSync(new URL(`${name}.svg`, OUT), svg.trim() + '\n', 'utf8');
  console.log('wrote', name + '.svg');
}
console.log('done:', Object.keys(THEMES).length, 'covers');
