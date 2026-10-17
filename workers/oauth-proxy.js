// Cloudflare Worker：为 Decap CMS 提供 GitHub OAuth 代理
// 解决 Decap 默认走 Netlify 网关（api.netlify.com/auth）导致 404 的问题。
// 部署步骤见仓库根目录 DECAP_AUTH.md
//
// 需要设置的 Worker 环境变量（Secrets / Variables）：
//   CLIENT_ID     —— GitHub OAuth App 的 Client ID
//   CLIENT_SECRET —— GitHub OAuth App 的 Client Secret
//
// 部署后你的 Worker 地址形如：
//   https://tuanchaye-oauth.<你的workers子域>.workers.dev
// 本例 workers 子域为 zhishuyunqi001，故完整地址：
//   https://tuanchaye-oauth.zhishuyunqi001.workers.dev

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // 1) 开始授权：重定向到 GitHub 的 OAuth 授权页
    if (url.pathname === '/auth') {
      const redirectUri = `${url.origin}/callback`;
      const githubAuth = new URL('https://github.com/login/oauth/authorize');
      githubAuth.searchParams.set('client_id', env.CLIENT_ID);
      githubAuth.searchParams.set('redirect_uri', redirectUri);
      githubAuth.searchParams.set('scope', 'repo');
      githubAuth.searchParams.set('allow_signup', 'false');
      return Response.redirect(githubAuth.toString(), 302);
    }

    // 2) GitHub 回调：用 code 换 access_token，再回传给 Decap
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
          client_id: env.CLIENT_ID,
          client_secret: env.CLIENT_SECRET,
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

      // 把 token 通过 postMessage 发回 Decap 打开的 popup 的父窗口
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

    return new Response('Not Found', { status: 404 });
  },
};
