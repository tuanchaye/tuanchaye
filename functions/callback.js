// Cloudflare Pages Function：GitHub OAuth 回调
// 用 GitHub 返回的 code 换取 access_token，并通过 postMessage 回传给 Decap CMS。
// 部署方式见 DECAP_AUTH.md

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
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
