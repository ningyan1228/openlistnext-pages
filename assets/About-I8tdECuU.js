import{Gr as e,Jn as t,Kr as n,Q as r,Y as i,Yr as a,p as o,ra as s}from"./store-C_VpuKpd.js";import{Y as c}from"./components-JzA44ZhB.js";var l=`<div align="center">\r
\r
<img src="/logo.png" width="128" alt="OpenListNext Logo" />\r
\r
# OpenListNext\r
\r
**一个现代化的全栈文件列表 / 网盘管理系统**\r
\r
OpenListNext 是 [OpenList](https://github.com/OpenListTeam/OpenList) 的定制全栈分支，用轻量级 **Node.js (Hono + TypeScript)** 后端替代了原版 Go 后端，部署更轻量、启动更快、无需编译 Go 二进制。\r
\r
<br/>\r
\r
### 👥 贡献者 & 协作者\r
\r
<a href="https://github.com/Polonium-salts"><img src="https://github.com/Polonium-salts.png" width="48" height="48" alt="Polonium-salts" style="border-radius: 50%; margin: 2px;" title="Polonium-salts" /></a>\r
<a href="https://github.com/Dummysky06"><img src="https://github.com/Dummysky06.png" width="48" height="48" alt="Dummysky06" style="border-radius: 50%; margin: 2px;" title="Dummysky06" /></a>\r
<a href="https://github.com/lie-jiu"><img src="https://github.com/lie-jiu.png" width="48" height="48" alt="lie-jiu (烈酒)" style="border-radius: 50%; margin: 2px;" title="lie-jiu (烈酒)" /></a>\r
<a href="https://github.com/Astroptis"><img src="https://github.com/Astroptis.png" width="48" height="48" alt="Astroptis" style="border-radius: 50%; margin: 2px;" title="Astroptis" /></a>\r
<a href="https://github.com/BAJJDY"><img src="https://github.com/BAJJDY.png" width="48" height="48" alt="BAJJDY" style="border-radius: 50%; margin: 2px;" title="BAJJDY" /></a>\r
<a href="https://github.com/chenyimaio"><img src="https://github.com/chenyimaio.png" width="48" height="48" alt="chenyimaio" style="border-radius: 50%; margin: 2px;" title="chenyimaio" /></a>\r
\r
<br/><br/>\r
\r
[技术架构](#-技术架构) · [快速开始](#-快速开始) · [部署方法](#-部署方法) · [贡献指南](CONTRIBUTING.md) · [原版项目](#-原版项目) · [许可证](#-许可证)\r
\r
</div>\r
\r
---\r
\r
## ✨ 功能特性\r
\r
- 📁 文件浏览、搜索、排序、分页\r
- 👁️ 多格式预览：PDF、Markdown、代码、Office、图片画廊、视频 / 音频（字幕 / 弹幕 / 歌词）\r
- 📥 上传 / 下载 / 删除 / 重命名 / 移动 / 复制，文件夹打包下载\r
- 🔗 文件永久链接、直链下载、分享链接（含提取码）\r
- 🌙 黑暗模式、国际化（中 / 英）\r
- 🔐 JWT 认证、密码保护、后台管理\r
- ☁️ 多网盘驱动：夸克网盘、阿里云盘、Google Drive、OneDrive、百度网盘、123 云盘、本地文件系统\r
- ⚡ 边缘部署：Cloudflare Workers / Vercel / Serverless 开箱即用（SFTP / FTP 等 Node 专属驱动除外，见 [核心设计](#核心设计)）\r
\r
---\r
\r
## 🧱 技术架构\r
\r
\`\`\`\r
┌─────────────────────────────────────────────────────┐\r
│                    前端 (SolidJS)                    │\r
│  SolidJS 1.9 · @hope-ui/solid · Vite 8 · TS 5.9     │\r
└──────────────────────┬──────────────────────────────┘\r
                       │ HTTP /api\r
┌──────────────────────▼──────────────────────────────┐\r
│                    后端 (Hono)                       │\r
│  Hono 4 · TypeScript · Web 标准优先（fetch / Streams）│\r
│  ├── /api/fs     文件操作（列表/上传/下载/管理）      │\r
│  ├── /api/auth   JWT 认证                            │\r
│  ├── /api/admin  后台管理（存储/用户/元数据/分享）    │\r
│  ├── /api/share  分享管理                            │\r
│  ├── /api/task   任务管理                            │\r
│  ├── /api/raw · /d · /p · /sd  下载与代理            │\r
│  └── /api/mcp    MCP 协议支持                        │\r
└──────────────────────┬──────────────────────────────┘\r
                       │ 存储驱动接口 (StorageDriver)\r
┌──────────────────────▼──────────────────────────────┐\r
│     存储驱动层：Local · Quark · AliyundriveOpen ·    │\r
│           GoogleDrive · Onedrive · BaiduNetdisk      │\r
│                   · 123Pan                           │\r
└──────────────────────┬──────────────────────────────┘\r
                       │ 持久化\r
        ┌──────────────┴───────────────┐\r
        ▼                              ▼\r
  Cloudflare KV (边缘)          public_data/db.json (容器)\r
\`\`\`\r
\r
### 核心设计\r
\r
| 设计点               | 说明                                                                                            |\r
| -------------------- | ----------------------------------------------------------------------------------------------- |\r
| **全栈 TypeScript**  | 前端与后端同语言，类型共享，无 Go 编译链                                                        |\r
| **Web 标准优先**     | 后端主体只用 \`fetch\` / \`Web Crypto\` / \`ReadableStream\`，不依赖 \`fs\` / \`http\` 等 Node.js 模块    |\r
| **Node 专属驱动**    | SFTP / FTP 依赖 \`ssh2\`、\`node:net\` 等 Node 模块，边缘构建时替换为空实现，仅完整 Node 环境可用   |\r
| **驱动抽象**         | 统一的 \`StorageDriver\` 接口（list/get/mkdir/rename/remove/move/copy），接入新网盘只需实现一个类 |\r
| **多平台运行**       | 同一套代码可部署到 Node.js 容器、Cloudflare Workers、Vercel、AWS Lambda                         |\r
| **JSON / KV 持久化** | 配置、存储、用户、分享、任务全部存 JSON（容器）或 KV（边缘），无数据库依赖                      |\r
\r
---\r
\r
## 🚀 快速开始\r
\r
### 环境要求\r
\r
- Node.js 18+（推荐 20+）\r
- 包管理器：\`pnpm\`（推荐）或 \`npm\`\r
\r
### 安装依赖\r
\r
\`\`\`bash\r
pnpm install\r
# 或\r
npm install\r
\`\`\`\r
\r
### 本地开发\r
\r
\`\`\`bash\r
npm run dev\r
\`\`\`\r
\r
同时启动后端 API 与 Vite 前端开发服务器，访问 \`http://localhost:3000\`。\r
\r
### 管理凭据（默认）\r
\r
| 项     | 值      |\r
| ------ | ------- |\r
| 用户名 | \`admin\` |\r
| 密码   | \`admin\` |\r
\r
> ⚠️ 首次部署后请务必在「用户管理」中修改默认密码。\r
\r
### 本地文件系统（Mock / Local FS）\r
\r
本地驱动将文件上传、读取、下载直接映射到 \`public_data/\` 目录；设置与存储配置持久化为 \`public_data/db.json\`。\r
\r
---\r
\r
## 📦 部署方法\r
\r
### 方式一：Node.js 容器（Docker / 裸机）\r
\r
\`\`\`bash\r
# 生产构建（前端静态资源 + 后端 Serverless 入口）\r
npm run build\r
\r
# 启动生产服务（内置 Hono 后端 + 静态资源）\r
npm run start\r
\`\`\`\r
\r
容器内将 \`public_data/\` 挂载为数据卷即可持久化。\r
\r
### 方式二：Cloudflare Workers（推荐，免费边缘部署）\r
\r
项目内置 [wrangler.toml](wrangler.toml) 与 [部署指南](docs/deploy-cloudflare-workers.md)。\r
\r
\`\`\`bash\r
# 一键部署（自动检测/创建 KV namespace 并写入 wrangler.toml，无需手动填 id）\r
npm run deploy\r
\r
# 或分步执行：\r
# 1) 登录 Cloudflare\r
npx wrangler login\r
# 2) 确保 KV 绑定（自动检测/创建，无需手动编辑 wrangler.toml）\r
node scripts/deploy.js --kv\r
# 3) 部署\r
npm run deploy:worker\r
# 本地预览\r
npm run dev:worker   # wrangler dev\r
\`\`\`\r
\r
\`npm run deploy\` 会自动完成：检测 \`OPENLISTNEXT_KV\` namespace（不存在则自动创建）→ 构建前端 → \`wrangler deploy\`。\`wrangler.toml\` 只声明绑定、**不存储 KV id**，由 wrangler 4.x 的 Automatic provisioning 在部署时自动创建/关联同名 namespace——全程无需手动填写 KV id。\r
\r
部署完成后静态资源由 Workers 的 \`ASSETS\` binding 托管，API 由 Hono 后端处理，配置数据持久化在 KV 中。\r
\r
### 方式三：腾讯云 EdgeOne Makers / EdgeOne Pages\r
\r
项目原生内置 \`edgeone.json\` 与 EdgeOne 边缘函数适配器：\r
\r
1. **导入项目**：在腾讯云 [EdgeOne Makers 控制台](https://edgeone.ai/) 新建项目，关联 GitHub 仓库或直接上传项目代码。\r
2. **构建配置**：\r
   - 构建命令：\`pnpm run build\` 或 \`npm run build\`\r
   - 输出目录：\`dist\`\r
   - 安装命令：\`pnpm install --no-frozen-lockfile\`（EdgeOne 会自动读取 \`edgeone.json\`）。\r
3. **存储配置**：无需手动配置。后端使用 \`@edgeone/pages-blob\` SDK（HTTP API）自动持久化配置数据，避免 KV 命名空间绑定的 Redis RESP 协议崩溃问题。详见 [docs/edgeone.md](docs/edgeone.md)。\r
4. **定时任务（可选）**：已内置每天凌晨 2:00 自动刷新网盘 Token 的调度，需在控制台设置 \`CRON_SECRET\` 环境变量并在 \`edgeone.json\` 中填入相同值才会生效；不配置则该接口仅接受管理员手动触发。⚠️ 公开 fork 请勿把真实密钥提交进仓库。详见 [docs/edgeone.md · 定时任务](docs/edgeone.md#定时任务与长时任务-schedules)。\r
\r
### 方式四：Vercel / 边缘 Serverless\r
\r
\`\`\`bash\r
# 构建（输出 dist-server/api/[...route].js Serverless 入口）\r
npm run build\r
\r
# 由 Vercel 识别 vercel.json 自动部署\r
\`\`\`\r
\r
\`api/[...route].ts\` 导出 Vercel 规范句柄（\`GET/POST/...\`）与 EdgeOne \`onRequest\` 句柄，\`edge-functions/[[default]].ts\` 导出 EdgeOne Makers 边缘函数，\`handler.ts\` 导出 AWS Lambda 句柄，\`wrangler.toml\` 配置 Cloudflare Workers。\r
\r
---\r
\r
### 方式五：阿里云ESA边缘安全加速\r
\r
1. **创建KV存储**：在阿里云ESA边缘安全加速(https://esa.console.aliyun.com/)主页/边缘计算和 AI/KV 存储中创建存储空间名称随意例如\`openlistnext\`。\r
2. **导入项目**：在阿里云ESA边缘安全加速(https://esa.console.aliyun.com/)主页/边缘计算和 AI/函数和 Pages中创建导入GitHub仓库。\r
3. **构建配置**：\r
   - 安装命令：\`npm install\` 默认即可。\r
   - 构建命令：\`npm run build\` 默认即可。\r
   - 高级配置/环境变量：\`KV_NAMESPACE\` 你KV存储的名称 \`JWT_SECRET\` 随机英文字符20位左右即可。\r
\r
## 🔗 原版项目\r
\r
OpenListNext 是以下项目的分支 / 衍生实现：\r
\r
| 项目                  | 说明                                    | 链接                                                                         |\r
| --------------------- | --------------------------------------- | ---------------------------------------------------------------------------- |\r
| **OpenList**          | 本项目的上游原版（Go 后端）             | [github.com/OpenListTeam/OpenList](https://github.com/OpenListTeam/OpenList) |\r
| **OpenList Docs**     | 官方文档（配置 / 驱动 / FAQ）           | [doc.oplist.org](https://doc.oplist.org/)                                    |\r
| **AList**             | OpenList 的前身，开箱即用的文件列表程序 | [github.com/alist-org/alist](https://github.com/alist-org/alist)             |\r
| **OpenList 在线 API** | 部分网盘驱动的 token 获取服务           | [api.oplist.org](https://api.oplist.org/)                                    |\r
\r
---\r
\r
## 📄 许可证\r
\r
[AGPL-3.0 License](LICENSE)\r
\r
---\r
\r
<div align="center">\r
\r
**Powered by OpenListNext** · 由 [OpenList 社区](https://github.com/OpenListTeam/OpenList) 驱动\r
\r
</div>\r
`,u=()=>{let u=r();i(`manage.sidemenu.about`);let d=o(`version`)||``;return[s(t,{mb:`$2`,spacing:`$2`,alignItems:`center`,get children(){return[s(e,{colorScheme:`accent`,rounded:`$full`,get children(){return s(n,{children:d||`OpenListNext`})}}),s(a,{color:`$neutral9`,fontSize:`$sm`,get children(){return u(`manage.sidemenu.about`)}})]}}),s(c,{children:l,sanitize:!0})]};export{u as default};