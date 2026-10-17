// Cloudflare Pages Function：Decap CMS GitHub OAuth 授权入口
// 部署方式见 DECAP_AUTH.md
//
// 需要在 Cloudflare Pages 项目 → Settings → Functions → Variables 中设置：
//   GITHUB_CLIENT_ID     —— GitHub OAuth App 的 Client ID
//   GITHUB_CLIENT_SECRET —— GitHub OAuth App 的 Client Secret

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const redirectUri = `${url.origin}/callback`;

  const githubAuth = new URL('https://github.com/login/oauth/authorize');
  githubAuth.searchParams.set('client_id', env.GITHUB_CLIENT_ID);
  githubAuth.searchParams.set('redirect_uri', redirectUri);
  githubAuth.searchParams.set('scope', 'repo');
  githubAuth.searchParams.set('allow_signup', 'false');

  return Response.redirect(githubAuth.toString(), 302);
}
