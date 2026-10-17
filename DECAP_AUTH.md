# Decap CMS 后台登录配置（GitHub OAuth 代理）

> 问题：Decap CMS 默认通过 Netlify 的 OAuth 网关（`api.netlify.com/auth`）换取 GitHub token。
> 因为我们没用 Netlify 托管，登录会跳到 `api.netlify.com/auth` 返回 404。
> 解法：自己部署一个 Cloudflare Worker 作为 OAuth 代理，Decap 走你自己的 Worker。

---

## 一、准备材料（已具备）

- GitHub OAuth App（已建好，应用名 `Tuanchaye Decap CMS`）
  - **Client ID**：`Ov23li8laTinERnLyBux`
  - **Client Secret**：在 GitHub OAuth App 页面 → Client secrets → Generate a new client secret 生成
- Worker 代码：`workers/oauth-proxy.js`（本仓库已包含）
- Decap 配置：`public/admin/config.yml` 已指向 `base_url` + `auth_endpoint`

---

## 二、在 Cloudflare 创建 OAuth 代理 Worker

1. 登录 cloudflare.com → 左侧 **Workers & Pages** → 点 **Create** → 选 **Worker**
2. **Name** 填：`tuanchaye-oauth`（决定地址 `https://tuanchaye-oauth.<你的子域>.workers.dev`）
3. 点 **Deploy** 先建一个空 Worker
4. 进入该 Worker → 点 **Edit code**（或 **Quick edit**）
5. 把 `workers/oauth-proxy.js` 的全部内容粘贴进去，覆盖默认代码
6. 点 **Save and Deploy**

### 设置环境变量（关键，否则 Worker 拿不到密钥）

1. 在该 Worker 页面 → 右侧 **Settings** → **Variables**
2. 在 **Environment Variables** 下点 **Add variable**：
   - 变量名 `CLIENT_ID`，值 `Ov23li8laTinERnLyBux` → **加密/Encrypt**（可选，建议）
   - 变量名 `CLIENT_SECRET`，值 `06b17d102cd337dd9fcfa15868cd26c9c4df6ea2` → **加密/Encrypt**（必须）
3. 保存后 Worker 自动生效

> 你的 workers.dev 子域在创建 Pages 项目时已确定为 `zhishuyunqi001`，
> 故 Worker 地址为：`https://tuanchaye-oauth.zhishuyunqi001.workers.dev`
> 若你的子域不同，把 `zhishuyunqi001` 换成实际子域，并同步修改
> `public/admin/config.yml` 里的 `base_url`。

---

## 三、更新 GitHub OAuth App 的回调地址

GitHub 的 **Authorization callback URL** 必须指向 Worker 的 `/callback`（不是 Decap 前端）。

1. GitHub → Settings → Developer settings → OAuth Apps → 点 **Tuanchaye Decap CMS**
2. 编辑 **Authorization callback URL**，改为：
   ```
   https://tuanchaye-oauth.zhishuyunqi001.workers.dev/callback
   ```
   （如果之前填的是 `https://tuanchaye.zhishuyunqi001.workers.dev/admin/`，请替换为上面的 Worker 回调地址；GitHub 新版支持填多个，用回车分行即可，可不删旧的）
3. 点 **Update application**

---

## 四、推送 Decap 配置更新

本地改好的 `public/admin/config.yml` 需要推到 GitHub，触发 Cloudflare Pages 重新部署：

```bash
cd "/d/WB/wbhc/AI网创项目建站1/tuanchaye"
git -c credential.helper= pull origin main   # 先拉取最新
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

- `CLIENT_SECRET` 已通过聊天发过，仅用于本项目。若担心泄露，可在 GitHub OAuth App 页面
  **Delete** 该 secret 并重新生成一个，然后同步更新 Worker 的 `CLIENT_SECRET` 环境变量。
- Worker 的 `CLIENT_SECRET` 务必使用 **Encrypt** 存储，不要明文写在代码里。
