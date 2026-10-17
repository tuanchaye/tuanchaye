// Cloudflare Worker：Decap CMS GitHub OAuth 代理 + 文章互动 API（点赞/收藏/评论）
// 同时把其他所有请求代理到静态资源（ASSETS）。
//
// 部署方式：Cloudflare 项目通过 npx wrangler deploy 读取仓库根目录 wrangler.toml，
// 其中 main 指向本文件，assets directory 指向 ./dist。
//
// 需要的环境变量（在 Cloudflare 项目 → Settings → Variables 中设置）：
//   GITHUB_CLIENT_ID     —— GitHub OAuth App 的 Client ID
//   GITHUB_CLIENT_SECRET —— GitHub OAuth App 的 Client Secret（必须设为 Secret）
//
// 绑定资源（在 wrangler.toml 中声明）：
//   TEAKV  —— KV 命名空间，存点赞/收藏聚合计数
//   TEADB  —— D1 数据库，存评论（提交前经内容过滤）

// ───────────────────────────────────────────────────────────
// 评论内容过滤：拦截违法/违背公序良俗 与 泄露个人联系方式
// ───────────────────────────────────────────────────────────
const BANNED_WORDS = [
  // 明显违法/色情/暴力/赌博/毒品等（中英文常见词）
  'fuck', 'shit', 'bitch', 'porn', 'xxx', 'sex', '赌博', '博彩', '色情',
  '毒品', '枪支', '诈骗', '洗钱', '代开发票', '办证', '私彩', '鸦片',
  '海洛因', '冰毒', '大麻', '刀枪', '暴恐', '招嫖', '裸聊',
];

function containsBannedWord(text) {
  const lower = text.toLowerCase();
  for (const w of BANNED_WORDS) {
    if (lower.includes(w.toLowerCase())) return w;
  }
  return null;
}

// 检测泄露联系方式：邮箱 / 电话 / 微信 / QQ / 外链
function detectContactInfo(text) {
  const t = text.toLowerCase();
  // 邮箱
  if (/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/.test(t)) return '邮箱';
  // 中国大陆手机号 或 连续 7-15 位数字（含区号）
  if (/(?<!\d)(?:\+?86[-\s]?)?1[3-9]\d{9}(?!\d)/.test(t)) return '手机号';
  if (/\b\d{7,15}\b/.test(t)) return '电话号码';
  // 微信 / 微信号
  if (/微信|wechat|wx[\s-:]?\w|微信号|加微/.test(t)) return '微信号';
  // QQ
  if (/(qq|q\s?q)[\s:：-]?\d{5,12}|qq号/.test(t)) return 'QQ号';
  // 外链（http/https/www 或可点击域名）
  if (/https?:\/\/|www\.[a-z0-9.-]+\.|[a-z0-9.-]+\.(com|cn|net|org|info|top|vip|xyz)\b/.test(t)) return '外部链接';
  return null;
}

// 返回 { ok:true } 或 { ok:false, reason }
function filterComment(text) {
  const contact = detectContactInfo(text);
  if (contact) {
    return { ok: false, reason: `评论中不能包含${contact}等联系方式，请删除后重试。` };
  }
  const banned = containsBannedWord(text);
  if (banned) {
    return { ok: false, reason: '评论包含不被允许的内容，请修改后重试。' };
  }
  return { ok: true };
}

// ───────────────────────────────────────────────────────────
// 工具函数
// ───────────────────────────────────────────────────────────
async function getCount(env, key) {
  const v = await env.TEAKV.get(key);
  return v ? parseInt(v, 10) || 0 : 0;
}

async function incCount(env, key) {
  const cur = await getCount(env, key);
  const next = cur + 1;
  await env.TEAKV.put(key, String(next));
  return next;
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}

// 确保评论表存在（幂等）
async function ensureCommentsTable(env) {
  await env.TEADB.prepare(
    `CREATE TABLE IF NOT EXISTS comments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT NOT NULL,
      author TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at INTEGER NOT NULL
    )`
  ).run();
}

// ───────────────────────────────────────────────────────────
// 主入口
// ───────────────────────────────────────────────────────────
export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // 0) 强制 HTTPS：把 http 请求 301 重定向到 https
    if (request.headers.get('x-forwarded-proto') === 'http') {
      const secureUrl = `https://${url.host}${url.pathname}${url.search}`;
      return Response.redirect(secureUrl, 301);
    }

    // 1) OAuth 授权入口：重定向到 GitHub
    if (url.pathname === '/auth') {
      const redirectUri = `${url.origin}/callback`;
      const githubAuth = new URL('https://github.com/login/oauth/authorize');
      githubAuth.searchParams.set('client_id', env.GITHUB_CLIENT_ID);
      githubAuth.searchParams.set('redirect_uri', redirectUri);
      githubAuth.searchParams.set('scope', 'repo');
      githubAuth.searchParams.set('allow_signup', 'false');
      return Response.redirect(githubAuth.toString(), 302);
    }

    // 2) OAuth 回调：用 code 换 access_token，再回传给 Decap
    if (url.pathname === '/callback') {
      const code = url.searchParams.get('code');
      if (!code) {
        return new Response('Missing code parameter', { status: 400 });
      }

      const redirectUri = `${url.origin}/callback`;
      const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: env.GITHUB_CLIENT_ID,
          client_secret: env.GITHUB_CLIENT_SECRET,
          code,
          redirect_uri: redirectUri,
        }),
      });

      const tokenData = await tokenRes.json();
      const accessToken = tokenData.access_token;

      if (!accessToken) {
        return new Response(
          'Failed to obtain access token: ' + JSON.stringify(tokenData),
          { status: 400 }
        );
      }

      const html = `<!doctype html>
<html>
<head><meta charset="utf-8"><title>Authorizing...</title></head>
<body>
<script>
  (function () {
    var token = ${JSON.stringify(accessToken)};
    var content = JSON.stringify({ token: token, provider: 'github' });
    if (!window.opener) {
      document.body.innerHTML = '<h1>Error: window.opener is null</h1><p>Please close this window and try again.</p>';
      return;
    }
    function receiveMessage(e) {
      window.opener.postMessage('authorization:github:success:' + content, e.origin);
      window.removeEventListener('message', receiveMessage);
      setTimeout(function () { window.close(); }, 500);
    }
    window.addEventListener('message', receiveMessage, false);
    window.opener.postMessage('authorizing:github', '*');
  })();
</script>
</body>
</html>`;

      return new Response(html, {
        status: 200,
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      });
    }

    // 3) 互动 API（/api/*）
    if (url.pathname.startsWith('/api/')) {
      // 点赞 / 收藏 读取
      if (url.pathname === '/api/likes' && request.method === 'GET') {
        const slug = url.searchParams.get('slug') || '';
        return json({ slug, likes: await getCount(env, 'like:' + slug) });
      }
      if (url.pathname === '/api/favorites' && request.method === 'GET') {
        const slug = url.searchParams.get('slug') || '';
        return json({ slug, favorites: await getCount(env, 'fav:' + slug) });
      }
      // 点赞 / 收藏 提交（每个浏览器仅计一次，由前端 localStorage 控制）
      if (url.pathname === '/api/likes' && request.method === 'POST') {
        const slug = url.searchParams.get('slug') || '';
        if (!slug) return json({ error: 'missing slug' }, 400);
        const n = await incCount(env, 'like:' + slug);
        return json({ slug, likes: n });
      }
      if (url.pathname === '/api/favorites' && request.method === 'POST') {
        const slug = url.searchParams.get('slug') || '';
        if (!slug) return json({ error: 'missing slug' }, 400);
        const n = await incCount(env, 'fav:' + slug);
        return json({ slug, favorites: n });
      }

      // 评论：列表
      if (url.pathname === '/api/comments' && request.method === 'GET') {
        const slug = url.searchParams.get('slug') || '';
        await ensureCommentsTable(env);
        const { results } = await env.TEADB.prepare(
          'SELECT id, author, content, created_at FROM comments WHERE slug = ? ORDER BY created_at ASC'
        ).bind(slug).all();
        return json({ slug, comments: results || [] });
      }

      // 评论：提交（带内容过滤）
      if (url.pathname === '/api/comments' && request.method === 'POST') {
        let body;
        try {
          body = await request.json();
        } catch (e) {
          return json({ error: 'invalid body' }, 400);
        }
        const slug = (body.slug || '').toString().slice(0, 200);
        const author = (body.author || '').toString().trim().slice(0, 40);
        const content = (body.content || '').toString().trim().slice(0, 1000);
        if (!slug || !content) {
          return json({ error: 'missing slug or content' }, 400);
        }
        if (!author) {
          return json({ error: 'please enter your name' }, 400);
        }
        const check = filterComment(content);
        if (!check.ok) {
          return json({ ok: false, reason: check.reason }, 422);
        }
        await ensureCommentsTable(env);
        const now = Date.now();
        await env.TEADB.prepare(
          'INSERT INTO comments (slug, author, content, created_at) VALUES (?, ?, ?, ?)'
        ).bind(slug, author, content, now).run();
        return json({ ok: true, comment: { author, content, created_at: now } });
      }

      return json({ error: 'not found' }, 404);
    }

    // 4) 其他请求：交给 Cloudflare 静态资源（ASSETS 绑定）
    return env.ASSETS.fetch(request);
  },
};
