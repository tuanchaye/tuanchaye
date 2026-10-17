# Decap CMS 后台登录配置（GitHub OAuth 代理）

> 问题：Decap CMS 默认通过 Netlify 的 OAuth 网关（`api.netlify.com/auth`）换取 GitHub token。
> 因为我们没用 Netlify 托管，登录会跳到 `api.netlify.com/auth` 返回 404。
> 解法：使用 Cloudflare **Workers Static Assets** 的站点 Worker（`public/_worker.js`）
> 处理 `/auth` 和 `/callback`，Decap 走自己的站点地址即可。

---

## 一、准备材料（已具备）

- GitHub OAuth App（已建好，应用名 `Tuanchaye Decap CMS`）
  - **Client ID**：`Ov23li8laTinERnLyBux`
  - **Client Secret**：在 GitHub OAuth App 页面 → Client secrets → Generate a new client secret 生成
- 站点 Worker 代码：`public/_worker.js`
- Decap 配置：`public/admin/config.yml` 已指向站点本身作为 `base_url`

---

## 二、在 Cloudflare 项目中设置环境变量

1. 登录 cloudflare.com → 左侧 **Workers & Pages** → 点你的项目 **tuanchaye**
2. 顶部菜单切到 **Settings**
3. 左侧找到 **Variables**（或 **Runtime variables and secrets**）
4. 添加 Production 环境变量：
   - `GITHUB_CLIENT_ID` = `Ov23li8laTinERnLyBux`（类型选 **Plain text**）
   - `GITHUB_CLIENT_SECRET` = `06b17d102cd337dd9fcfa15868cd26c9c4df6ea2`（类型选 **Secret**）
5. 点 **Save**

---

## 三、更新 GitHub OAuth App 的回调地址

1. GitHub → Settings → Developer settings → OAuth Apps → 点 **Tuanchaye Decap CMS**
2. 在 **Redirect URIs** 区域，确保回调地址为：
   ```
   https://tuanchaye.zhishuyunqi001.workers.dev/callback
   ```
   如果之前填的是 `/admin/` 或其他地址，请删除并换成上面的地址。
3. 点 **Update application**

---

## 四、推送 `_worker.js` 到 GitHub

本地改好的 `public/_worker.js` 和 `public/admin/config.yml` 需要推到 GitHub，触发 Cloudflare 重新部署：

```bash
cd "/d/WB/wbhc/AI网创项目建站1/tuanchaye"
git -c credential.helper= pull origin main
git -c credential.helper= push origin main
```

（若 token 已过期，到 GitHub → Developer settings → PAT 重新生成一个 scope=repo 的 token 再 push）

---

## 五、验证登录

1. 打开 `https://tuanchaye.zhishuyunqi001.workers.dev/admin/`
2. 点 **Login with GitHub**
3. 浏览器跳到 GitHub 授权页 → 点 **Authorize tuanchaye-decap-cms**
4. 自动跳回 Decap 后台，左侧出现 **Tea Articles**
5. 点 **New Tea Article** 写一篇测试文章 → **Publish** → 约 1 分钟自动上线

---

## 安全提醒

- `GITHUB_CLIENT_SECRET` 已通过聊天明文发过。若担心泄露，可在 GitHub OAuth App 页面
  **Delete** 该 secret 并重新生成一个，然后同步更新 Cloudflare 项目的
  `GITHUB_CLIENT_SECRET` 环境变量。
- `GITHUB_CLIENT_SECRET` 在 Cloudflare 后台必须设为 **Secret/Encrypted**，不要写在代码或
  配置文件里。
- 绑定 `tuanchaye.com` 自定义域后，需同步修改：
  - `public/admin/config.yml` 里的 `base_url`
  - GitHub OAuth App 里的 Redirect URI
