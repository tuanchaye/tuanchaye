// Cloudflare Worker：为 Decap CMS 提供 GitHub OAuth 代理
// 同时把其他所有请求代理到静态资源（ASSETS）。
//
// 部署方式：Cloudflare 项目通过 npx wrangler deploy 读取仓库根目录 wrangler.toml，
// 其中 main 指向本文件，assets directory 指向 ./dist。
//
// 需要的环境变量（在 Cloudflare 项目 → Settings → Variables 中设置）：
//   GITHUB_CLIENT_ID     —— GitHub OAuth App 的 Client ID
//   GITHUB_CLIENT_SECRET —— GitHub OAuth App 的 Client Secret（必须设为 Secret）

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

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

      // 通过 postMessage 把 token 传回 Decap 打开的 popup 的父窗口
      const html = `<!doctype html>
<html>
<head><meta charset="utf-8"><title>Authorizing...</title></head>
<body>
<script>
  (function () {
    var token = ${JSON.stringify(accessToken)};
    if (window.opener) {
      window.opener.postMessage({ type: 'authorizing:github', token: token }, '*');
    }
    window.close();
  })();
</script>
</body>
</html>`;

      return new Response(html, {
        status: 200,
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      });
    }

    // 3) 临时调试用：查看 env 里有哪些变量（不暴露具体值）
    if (url.pathname === '/debug-env') {
      return new Response(
        JSON.stringify({
          keys: Object.keys(env),
          hasClientId: !!env.GITHUB_CLIENT_ID,
          hasClientSecret: !!env.GITHUB_CLIENT_SECRET,
        }, null, 2),
        { headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 4) 其他请求：交给 Cloudflare 静态资源（ASSETS 绑定）
    return env.ASSETS.fetch(request);
  },
};
