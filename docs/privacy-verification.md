# 隐私政策网页验收 · 2.2.1

本轮补充 Cloudflare / 腾讯云、访问日志、不出售与年龄说明，并刷新本地字体子集。网站检查及 Chromium / WebKit 本地检查通过；四张新截图及机器记录位于 `artifacts/privacy-2.2.1/`。公开 HTTPS 检查与截图在其 `public/` 子目录。本轮部署结果见 [部署记录](privacy-deployment-2026-10-24.md)。本轮另新增该部署记录，HTML 邮箱增加 Cloudflare 保留标记，网页检查脚本支持指定外网地址与输出目录。

2.2.1 完整 ZIP 为 14,095,998 字节，113 个 manifest 文件全部校验通过，静态内容与 dist 逐一一致，不包含基础设施配置或凭据。SHA-256：`7e9702a44dba02736b8fa7375e613d67eb71e7a95fa9faa0340885c826d9f5a1`。NAS 115 个已记录文件哈希核对通过，Docker compose 与初次备份一致。

最终公开 Chromium / WebKit 回归通过，与本地相同的 12 种组合和三个入口无 JavaScript 阅读均通过，没有外部资源请求。部署 nginx 额外补 `no-transform`，防止代理自动注入网站统计脚本；实际响应内容与 dist 字节一致。App 清单与最终构建仍按核对记录待定。

以下保留 2.2.0 初次交付的验收记录；当时未部署，其 NAS 操作边界不代表本轮状态。

## 2.2.0 初次验收

日期：2026-10-24（America/Los_Angeles）。范围仅为官网，不包括 iOS 构建、测试、模拟器、真机或 NAS 操作。

## 本地结果

- 本地预览：http://127.0.0.1:4173/privacy
- `/privacy`、`/privacy/`、`/privacy.html`：本地均为 HTTP 200，Content-Type 为 text/html。两个 HTML 文件字节一致。
- Chromium 与 WebKit：1440×1080、390×1000、320×800，两种语言，共 12 种浏览器/语言/尺寸组合；无横向溢出，正文不小于 16px。
- 默认语言、手动切换、刷新保留、首页共享语言偏好、章节深链与禁用 localStorage：通过。
- 禁用 JavaScript：两种语言的 24 个章节与邮箱正文直接可读，三个路径在两个引擎均通过。
- title、description、唯一 ID、章节锚点、联系链接与首页页脚入口：通过。
- Inter / Noto Sans SC 400/500 字体本地加载；网页检查无外部资源请求或页面脚本错误。主站的外链仅作为链接保留。
- 尊重减少动态效果。页面没有背景动画，日期与内容均为静态 HTML。
- 网站原有 `npm run check`、新增文件语法与 `git diff --check`：通过。未运行任何 iOS 检查。

## 截图

浏览器视口截图，不是真机测试。四张截图及机器可读记录位于 `artifacts/privacy-2.2.0/`：

- desktop-zh.png、desktop-en.png
- mobile-zh.png、mobile-en.png
- verification.json

已实际打开截图检查单栏行宽、字体、标题、手机端分行和颜色。

## 文件清单

新增：

- `dist/privacy/index.html`：双语完整正文，作为编辑源。
- `dist/privacy.html`：相同正文的静态入口；打包拒绝两份正文不一致。
- `dist/privacy.css`、`dist/privacy.js`：阅读样式与渐进语言切换。
- `dist/assets/fonts/inter-400.ttf`、`inter-500.ttf`、`noto-sans-sc-400.ttf`、`noto-sans-sc-500.ttf`，两个 OFL 许可证与字体来源说明。
- `docs/privacy-audit.md`：逐项源码证据、网络清单与待开发者确认问题。
- `docs/app-store-privacy.md`：隐私标签填写建议与清单差异。
- `docs/privacy-verification.md`：本文。
- `scripts/privacy-qa.mjs`：本次网页行为检查。

修改：

- `dist/index.html`：页脚政策链接，版本查询参数。
- `dist/app.js`：中英文隐私简介校准账号、头像与统计联网事实。
- `deploy/nginx.conf`：两个精确路由，避免补斜杠时按上游 HTTP 生成跳转。
- `scripts/serve.mjs`：本地模拟这些路由，处理静态目录索引及字体 MIME。
- `scripts/package-update.mjs`：正文别名一致性/联系邮箱检查与隐私核对来源元数据。
- `package.json`：2.2.0，检查新脚本。
- `README.md`：版本记录、来源、预览、部署边界及文档入口。
- `docs/nas-update.md`：2.2.0 替换步骤与需确认后应用的精确路由。

## 尚未验收的边界

1. 本地没有 nginx 可执行程序，未运行 nginx -t；浏览器通过的是现有 Node 预览服务器。精确路由已写入仓库配置与包内说明，实际 NAS 需在获准部署后检查配置并重载。
2. 没有覆盖 NAS、连接线上数据库或核实外网 HTTPS 路由。包内静态文件不会自动改 nginx。
3. 本地源码审计不证明送审二进制或线上后端完全一致。隐私政策日期、后台保留/备份/日志、访客删除方式与儿童定位，见 privacy-audit.md 的待确认清单。
4. iOS 隐私清单与 Connect 标签需按当前数据收集补齐，不能用本网页替代。

## 复查

`npm run check`；使用已安装 Playwright 时运行 `node scripts/privacy-qa.mjs`。可通过 PLAYWRIGHT_MODULE / PLAYWRIGHT_BROWSERS_PATH 指定本机运行时，未为本任务新增网站依赖。

更新包仍由 `node scripts/package-update.mjs` 生成：完整 site、更新说明、逐文件 SHA-256 manifest；不含 App、数据库、凭据或 NAS 整份配置。

## 更新包校验

`releases/mne-website-update-2.2.0.zip`：14,088,157 字节。压缩包完整性检查通过，manifest 的 113 个文件逐一校验 SHA-256，站点内容与当前 dist 一致，两个政策入口字节一致。包中不含 nginx.conf、docker-compose.yml 或凭据。

ZIP SHA-256：`3b3021291f8791fc787b47ea9f9ad2f2ff65e9000a56333c6eec7231d7043625`。
