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
// 评论内容过滤（最严格）：禁止任何违法/违背公序良俗内容，
// 禁止任何形式的联系方式漏出（电话/邮箱/微信/QQ/各类社交账号及ID/外链等）
// ───────────────────────────────────────────────────────────
const BANNED_WORDS = [
  // 色情 / 淫秽
  'porn', 'xxx', 'sex', 'nude', 'naked', '色情', '裸聊', '约炮', '援交',
  '招嫖', '成人', '黄片', '性爱', '做爱',
  // 赌博 / 博彩
  '赌博', '博彩', '私彩', '彩票私推', '赌场', 'bet365', '赌球', '百家乐',
  '开元棋牌', '时时彩', '私彩', '澳门赌场',
  // 毒品 / 违禁药物
  '毒品', '鸦片', '海洛因', '冰毒', '大麻', '可卡因', '摇头丸', 'K粉', '笑气',
  '贩毒', '吸毒',
  // 暴力 / 恐怖主义 / 武器
  '枪支', '枪械', '炸药', '炸弹', '暴恐', '恐怖袭击', '杀人', '砍人', '武器买卖',
  // 诈骗 / 违法交易
  '诈骗', '洗钱', '代开发票', '办证', '刻章', '假币', '走私', '贩卖人口',
  '招嫖', '外围', '黑客', '入侵', '盗号', '刷单', '返利诈骗',
  // 违禁医药 / 虚假宣传
  '壮阳', '迷药', '催情', '偏方治癌', '包治百病', '祖传秘方',
  // 极端 / 仇恨 / 歧视
  '种族灭绝', '纳粹', 'jugend', '仇恨言论', '恐怖组织',
  // 英文脏话 / 辱骂
  'fuck', 'shit', 'bitch', 'asshole', 'bastard', 'cunt', 'slut', 'whore',
  'nigger', 'retard', 'idiot', 'stupid', 'scam', 'fraud', 'rape',
  // 政治敏感（按当地法规保守过滤）
  '游行', '示威', '颠覆', '分裂', '独立运动',
];

function containsBannedWord(text) {
  const lower = text.toLowerCase();
  for (const w of BANNED_WORDS) {
    if (lower.includes(w.toLowerCase())) return w;
  }
  return null;
}

// 检测各类联系方式 / 社交账号及 ID 漏出
function detectContactInfo(text) {
  const t = text.toLowerCase();

  // 1) 邮箱
  if (/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/.test(t)) return '邮箱';

  // 2) 电话号码（手机号 / 固话 / 含区号 / 连续数字串）
  if (/(?<!\d)(?:\+?\d{1,3}[\s-]?)?(?:\d{3,4}[\s-]?){2,4}(?!\d)/.test(t)) {
    // 排除纯年份/普通数字：要求至少 7 位连续或带分隔的电话形态
    if (/(?:\+?\d[\s-]?){7,}/.test(t.replace(/[^\d+\s-]/g, ''))) return '电话';
  }
  if (/(?<!\d)1[3-9]\d{9}(?!\d)/.test(t)) return '手机号';
  if (/(?<!\d)(?:00\d{1,3}|\+?\d{1,3})[\s-]?\d{6,12}(?!\d)/.test(t)) return '电话号码';

  // 3) 微信 / 微信号
  if (/微信|wechat|wxid|wx[\s:_:-]?[a-z0-9_-]{4,}|微信号|加微|薇信|wei xin/.test(t)) return '微信号';

  // 4) QQ / QQ号 / QQ邮箱
  if (/q\s?q[\s:_:-]?\d{5,12}|qq号|qq邮箱|@qq\.com/.test(t)) return 'QQ号';

  // 5) 支付宝 / 淘宝 / 银行卡 / 收款码
  if (/支付宝|alipay|淘宝|taobao|银行卡|卡号|收款码|支付宝账号|微信支付/.test(t)) return '支付/银行账号';

  // 6) 各类社交平台账号及 ID（含 @用户名 形态）
  const SOCIAL = [
    'weibo', '微博', 'sina', 'twitter', '推特', 'x\.com', 'telegram', '电报', 'tg[\s:_:-]?',
    'instagram', 'insta', 'ig[\s:_:-]?', 'tiktok', '抖音', 'douyin', '小红书', 'xiaohongshu',
    'line', 'whatsapp', 'skype', 'discord', 'facebook', 'fb[\s:_:-]?', '脸书', 'kakaotalk',
    'snapchat', 'viber', 'signal', 'linkedin', '领英', 'youtube', '油管', 'bilibili', '哔哩哔哩',
    'reddit', 'quora', 'pinterest', '知乎', '豆瓣', '陌陌', 'soul', '探探',
  ];
  const socialRe = new RegExp('(?:' + SOCIAL.join('|') + ')', 'i');
  if (socialRe.test(t)) return '社交账号';
  // @用户名 / handle（社交 ID 常见形态，且与茶叶无关时拦截）
  if (/[@＠][a-z0-9_]{2,}/.test(t)) return '社交账号ID';

  // 7) 外链 / 网址 / 邀请码
  if (/https?:\/\/|www\.[a-z0-9.-]+\.|[a-z0-9.-]+\.(com|cn|net|org|info|top|vip|xyz|io|co|me)\b/i.test(t)) return '外部链接';
  if (/[a-z0-9_-]+\.(com|cn|net|org|info|top|vip)\b/i.test(t)) return '外部链接';
  if (/邀请码|优惠码|折扣码|promo code|referral|我的码|加群|粉丝群|扫码/.test(t)) return '推广信息';

  // 8) 诱导私聊 / 交易话术
  if (/加我|私聊|私我|联系我|详聊|代购|代卖|招代理|招加盟|兼职|刷单|返利|低价出|出闲置|有需要联系/.test(t)) return '诱导联系方式';

  return null;
}

// 返回 { ok:true } 或 { ok:false, reason }
function filterComment(text) {
  const contact = detectContactInfo(text);
  if (contact) {
    return {
      ok: false,
      reason: `评论中不能包含${contact}等联系方式或社交账号信息，请删除后重试。`,
    };
  }
  const banned = containsBannedWord(text);
  if (banned) {
    return { ok: false, reason: '评论包含不被允许的内容（违反法律法规或公序良俗），请修改后重试。' };
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
      // 管理后台 API：评论列表 / 删除（需 ADMIN_TOKEN 鉴权）
      if (url.pathname === '/api/admin/comments') {
        const auth = request.headers.get('Authorization') || '';
        const token = auth.replace(/^Bearer\s+/i, '');
        if (!env.ADMIN_TOKEN || token !== env.ADMIN_TOKEN) {
          return json({ error: 'unauthorized' }, 401);
        }

        if (request.method === 'GET') {
          await ensureCommentsTable(env);
          const { results } = await env.TEADB.prepare(
            'SELECT id, slug, author, content, created_at FROM comments ORDER BY created_at DESC'
          ).all();
          return json({ comments: results || [] });
        }

        if (request.method === 'DELETE') {
          const id = url.searchParams.get('id');
          if (!id || !/^\d+$/.test(id)) {
            return json({ error: 'missing or invalid id' }, 400);
          }
          await ensureCommentsTable(env);
          const { changes } = await env.TEADB.prepare(
            'DELETE FROM comments WHERE id = ?'
          ).bind(parseInt(id, 10)).run();
          return json({ ok: true, deleted: changes });
        }

        return json({ error: 'method not allowed' }, 405);
      }

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
