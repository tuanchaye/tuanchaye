# Decap CMS 后台登录配置（GitHub OAuth 代理）

> 问题：Decap CMS 默认通过 Netlify 的 OAuth 网关（`api.netlify.com/auth`）换取 GitHub token。
> 因为我们没用 Netlify 托管，登录会跳到 `api.netlify.com/auth` 返回 404。
> 解法：使用 Cloudflare **Pages Functions**（`functions/auth.js` + `functions/callback.js`）
> 作为 OAuth 代理，Decap 走你自己的站点地址即可。

---

## 一、准备材料（已具备）

- GitHub OAuth App（已建好，应用名 `Tuanchaye Decap CMS`）
  - **Client ID**：`Ov23li8laTinERnLyBux`
  - **Client Secret**：在 GitHub OAuth App 页面 → Client secrets → Generate a new client secret 生成
- Pages Functions 代码：本仓库的 `functions/auth.js` 和 `functions/callback.js`
- Decap 配置：`public/admin/config.yml` 已指向站点本身作为 `base_url`

---

## 二、在 Cloudflare Pages 项目中设置环境变量

1. 登录 cloudflare.com → 左侧 **Workers & Pages** → 点你的项目 **tuanchaye**
2. 顶部菜单切到 **Settings**
3. 左侧找到 **Functions**（或 **Variables** / **Environment variables**）
4. 添加两个环境变量（Production 环境）：
   - `GITHUB_CLIENT_ID` = `Ov23li8laTinERnLyBux`
   - `GITHUB_CLIENT_SECRET` = `06b17d102cd337dd9fcfa15868cd26c9c4df6ea2`
5. 点 **Save**

> 若 Cloudflare 将变量区分为 **Plain text** / **Secret**，请把 `GITHUB_CLIENT_SECRET` 设为 Secret。

---

## 三、更新 GitHub OAuth App 的回调地址

GitHub 的 **Authorization callback URL** 必须指向 Pages Functions 的 `/callback`。

1. GitHub → Settings → Developer settings → OAuth Apps → 点 **Tuanchaye Decap CMS**
2. 编辑 **Authorization callback URL**，改为：
   ```
   https://tuanchaye.zhishuyunqi001.workers.dev/callback
   ```
   如果之前填的是 Worker 代理地址或 `https://tuanchaye.zhishuyunqi001.workers.dev/admin/`，请替换为上面的地址。
   GitHub 新版支持多个 callback URL，用回车分行即可，旧的可保留也可删除。
3. 点 **Update application**

---

## 四、推送更新到 GitHub

本地改好的 `public/admin/config.yml` 和新增的 `functions/auth.js`、`functions/callback.js` 需要推到 GitHub，触发 Cloudflare Pages 重新部署：

```bash
cd "/d/WB/wbhc/AI网创项目建站1/tuanchaye"
git -c credential.helper= pull origin main
git -c credential.helper= push origin main
```

（若 token 已过期，到 GitHub → Developer settings → PAT 重新生成一个 scope=repo 的 token 再 push）

推送后 Cloudflare Pages 会自动重新构建。构建日志里应能看到 Functions 被上传：
- `functions/auth.js`
- `functions/callback.js`

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
  **Delete** 该 secret 并重新生成一个，然后同步更新 Cloudflare Pages 项目的
  `GITHUB_CLIENT_SECRET` 环境变量。
- `GITHUB_CLIENT_SECRET` 在 Cloudflare 后台必须设为 **Secret/Encrypted**，不要写在代码或
  配置文件里。
- 绑定 `tuanchaye.com` 自定义域后，需同步修改：
  - `public/admin/config.yml` 里的 `base_url`
  - GitHub OAuth App 里的 callback URL
