# tuanchaye.com — 出海中国茶叶内容站 上线与运营指引

> 技术栈：Astro（静态站） + Cloudflare Pages（免费托管） + Decap CMS（网页后台）
> 特点：0 服务器成本、免备案、海外访问快、有图形后台、你日常写文章即可自动上线。

---

## 一、你需要准备的两个免费账号（已注册）

- **GitHub** 用户名：`tuanchaye`（邮箱 `zhishuyunqi001@hwpys.com`）
- **Cloudflare**：免费账号，用于托管 + 接管域名 DNS

---

## 二、上线 6 步（按序操作）

### 第 1 步：GitHub 上建一个空仓库

1. 登录 github.com → 右上角 **+** → **New repository**
2. Repository name 填：`tuanchaye`（必须和后台配置一致）
3. 选 **Public**
4. **不要**勾选 "Add a README file" / 不要勾 LICENSE（本地已有代码，避免冲突）
5. 点 **Create repository**
6. 建好后页面会显示仓库地址 `https://github.com/tuanchaye/tuanchaye.git`，先留着。

### 第 2 步：把本地代码推到 GitHub

代码已在本地 `D:/WB/wbhc/AI网创项目建站1/tuanchaye/`，且已 `git commit` 好。

**方法 A（推荐，你来执行，安全）：生成 Personal Access Token 后推**
1. GitHub → 右上角头像 → **Settings** → 左侧 **Developer settings** → **Personal access tokens** → **Tokens (classic)** → **Generate new token (classic)**
2. Note 填 `tuanchaye-push`，Expiration 选 7 days（用完可删）
3. 勾选 scope：`repo`（全选 repo 那一组）
4. 点 **Generate token**，把生成的 `ghp_xxx` 一串**复制保存好**（只显示一次）
5. 在电脑上打开 **Git Bash**（装 Git 后右键菜单有），依次执行：

```bash
cd "D:/WB/wbhc/AI网创项目建站1/tuanchaye"
git remote add origin https://github.com/tuanchaye/tuanchaye.git
git push -u origin main
```

> 若提示输入用户名/密码：用户名填 `tuanchaye`，密码**粘贴刚才的 token**（粘贴时屏幕不显示，回车即可）。

**方法 B（你发我 token，我代推）**：把上一步生成的 `ghp_xxx` 发给我，我直接跑推送；推送完成后你去 GitHub 把该 token 删除/撤销即可。

推送成功后，GitHub 仓库里就能看到所有文件。

### 第 3 步：Cloudflare Pages 连接 GitHub 自动部署

1. 登录 cloudflare.com → 左侧 **Workers & Pages** → **Create** → **Pages** → **Connect to Git**
2. 授权 Cloudflare 访问你的 GitHub，选中 `tuanchaye` 仓库
3. 构建设置：
   - Framework preset：**None（或 Astro，选 None 更稳）**
   - Build command：`npm run build`
   - Build output directory：`dist`
4. 点 **Save and Deploy**
5. 约 1–2 分钟后得到一个地址 `https://tuanchaye.pages.dev`（这是临时测试域名）

> 每次你以后在后台发文章，GitHub 仓库一变，Cloudflare 会自动重新构建上线，无需你手动部署。

### 第 4 步：建 GitHub OAuth App（Decap 后台登录用，必做）

Decap 后台要能"登录并写文章"，必须配 GitHub OAuth：

1. GitHub → Settings → **Developer settings** → **OAuth Apps** → **New OAuth App**
2. Application name：`tuanchaye-admin`
3. Homepage URL：`https://tuanchaye.pages.dev/admin/`（先用 pages.dev 临时地址，绑好正式域名后再改成 `https://tuanchaye.com/admin/`）
4. Authorization callback URL：`https://tuanchaye.pages.dev/admin/`（同上，绑域名后改正式）
5. 点 **Register application** → 进入后点 **Generate a new client secret**，复制 **Client ID**（一长串字母数字）
6. 打开本地文件 `public/admin/config.yml`，把第 7 行：
   ```
   client_id: YOUR_OAUTH_CLIENT_ID
   ```
   改成你的真实 Client ID，保存后**重新推一次到 GitHub**（让 Cloudflare 重新部署）：
   ```bash
   git add -A
   git commit -m "set decap client_id"
   git push
   ```

### 第 5 步：绑定正式域名 tuanchaye.com（海外 CDN + 免备案）

1. Cloudflare → **Websites** → **Add a site** → 输入 `tuanchaye.com` → 选 Free 套餐
2. Cloudflare 会给出两个 **Nameserver（NS）** 地址（形如 `xxx.ns.cloudflare.com`）
3. 登录你买域名的平台（阿里云/万网）→ 域名管理 → `tuanchaye.com` 的 **DNS / 修改 DNS 服务器** → 把默认 NS 改成 Cloudflare 给的这两个
4. 回到 Cloudflare，等几分钟～24 小时 NS 生效（通常很快）
5. Cloudflare → 你的站点 → **Pages** → 项目 → **Custom domains** → 添加 `tuanchaye.com`，按提示验证
6. 生效后访问 `https://tuanchaye.com` 即正式站点；此时把第 4 步 OAuth App 的 Homepage/Callback 都改成 `https://tuanchaye.com/admin/`，再改一次 `config.yml` 推上去。

> 域名解析到 Cloudflare = 服务器在海外，国内无需 ICP 备案，合规且免备案。

### 第 6 步：运营 1–2 个月后申请 Google AdSense

前置条件（本项目已帮你备齐）：
- 原创内容 ≥ 30 篇、每篇 300+ 词
- 已有 **隐私政策页** `/privacy`、**关于页** `/about`、**联系页** `/contact`
- 导航清晰、无诱导点击、图片用原创或授权图

申请入口：adsense.com → 填站点 `https://tuanchaye.com` → 等审核（几天～几周）。
过审后，把 AdSense 给的代码粘到 `src/pages/posts/[...slug].astro` 里标了 `.ad-slot` 的位置（代码里已留注释），重新推一次即可展示广告。

---

## 三、你日常怎么发文章（Decap 网页后台）

部署完成后，浏览器打开 `https://tuanchaye.com/admin/`（或 pages.dev 地址）：
1. 用 GitHub 账号登录（OAuth）
2. 左侧 **Tea Articles** → **New Tea Article**
3. 填 Title / Meta Description / 分类 / 正文（支持 Markdown）
4. 点右上角 **Publish** → 自动写入 GitHub → Cloudflare 自动重新构建 → 几分钟前台可见

发文章无需碰代码、无需部署，和用 WordPress 发文体验接近。

---

## 四、内容建议（SEO 起量关键）

不要写泛泛的 "tea"，聚焦长尾意图词：
- 茶种类：`what is oolong tea`、`types of Chinese green tea`
- 冲泡：`how to brew pu erh tea`、`green tea steeping time`
- 选购：`best Chinese oolong to buy`（广告单价高）
- 文化：`Chinese tea ceremony meaning`（易获外链）
- 健康：`pu erh tea benefits`（需注明非医疗建议）

旧站中文素材用 AI 改写成英文直接复用，冷启动快。

---

## 五、常见坑

- **AI 纯洗稿会被 Google/AdSense 判低质**：每篇 AI 初稿后人工加观点/结构/本地化。
- **图片版权**：用 AI 生图或 Unsplash 等 CC0 授权图，勿随手扒网图。
- **AdSense 付款**：满 $100 才付；非美税务居民注册时填 **W-8BEN**，否则预扣 30%。
- **Decap 后台国内访问略慢**：后台你偶尔用，可接受；前台靠 Cloudflare 全球 CDN 不受影响。

---

## 六、本地预览（可选）

想本地先看效果：
```bash
cd "D:/WB/wbhc/AI网创项目建站1/tuanchaye"
npm install   # 已装过可跳过
npm run dev   # 打开 http://localhost:4321
```
