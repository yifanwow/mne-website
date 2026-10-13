# Mne website

Mne 的公开介绍页：暗色 / 梦幻紫、克制留白、磨砂玻璃、中英双语。记忆盒线绘动画、滚动驱动的浏览演示、成就卡的 3D 滚动 / 触控联动、App 原始几何统计与数字入场，以及星空和缓慢变化的背景光。摄影作品均来自作者授权的原图。原生 HTML、CSS、JavaScript，无框架、无第三方运行时依赖。产品本体是 iPhone App，网页支持手机、平板和桌面。

The public bilingual website for Mne, a native iPhone app for thoughtful photo curation. Built with HTML, CSS and vanilla JavaScript. No framework, dependencies, analytics, API calls, or build step.

## 本地预览 / Local preview

Node.js 18+：

```sh
npm run dev
```

打开 http://127.0.0.1:4173 。如果 Node 不在 PATH，也可以用安装的 Node 的绝对路径运行 `scripts/serve.mjs`。

也可以无需 Node，使用 Python 3：

```sh
python3 -m http.server 4173 --bind 127.0.0.1 --directory dist
```

手机 / 平板同 Wi-Fi 预览：

```sh
HOST=0.0.0.0 npm run dev
```

打开 `http://你的电脑局域网地址:4173`。默认仅监听本机。预览服务器不作为生产服务器。

## 内容和维护 / Content

- `dist/index.html`：页面、元信息与语义结构。
- `dist/styles.css`：主题、手机 ≤600px / 平板 ≤850px / 桌面布局、动画和系统无障碍偏好。
- `dist/app.js`：`copy` 中英文文案、`journal` 开发时间线、布局和图表演示。
- `dist/motion.js`：滚动演示、触控卡牌、图谱、每次进入时重播的数字与背景星空。
- `dist/motion.css`：滚动场景和手机 / 平板 / 桌面适配。
- `dist/motion-copy.js`：新增场景的双语文案。
- `dist/refinements.css`：标题与演示共用的停留区、视口尺寸适配、记忆盒设计展示、署名和联系方式排版。
- `dist/contacts.js`、`dist/contact-icons.js`：个人站已有联系方式、品牌图标和微信二维码交互。
- `dist/app-art.js`：App 原始 Logo 与天体统计几何的 SVG 实现。
- `dist/fragments-data.js`：可继续扩展的卡面名称与 App 原文描述。
- `dist/assets/`：公开品牌素材与作者授权摄影的网页导出，来源见 `docs/asset-credits.md`。

编辑文案需要同步两种语言。时间线取自 Mne 本地 README，核对日期 2026-10-13。0.8.8 (29) 是当前源码版本，0.8.2 (23) 是已确认进入私人 TestFlight 的构建；不把源码更新称为已发布版本。网站没有公开下载链接或邀请码。

界面与图表数字明确标为示意，使用作者明确授权的摄影作品，不使用账号资料或真实用户统计。切换语言会在本机 localStorage 保存偏好；不发送到服务器。照片、Logo 和成就卡面版权归各自作者所有。

滚动由浏览器原生处理，不拦截滚轮、不锁定页面。卡牌横向触控保留上下滑动；背景 Canvas 限制为 24fps，页面隐藏时暂停。支持系统减少动态效果：改为静态演示和完整卡面网格。右下角可暂停背景与自动演示。

Experience 和成就碎片从标题进入视野时开始推进；标题、图像和描述共用一个 sticky 区域。微信公众号二维码支持鼠标悬停、点击、触控、键盘焦点及 Escape 关闭。

## 检查 / Validation

```sh
npm run check
```

浏览器验收：中文与英文、窄手机 / 手机 / 平板 / 桌面、滚动入场、布局切换、图表切换、展开时间线、素材弹窗、键盘导航、减少动态效果。详情见 `docs/verification.md`。

## NAS 部署 / NAS hosting

`dist/` 是完整静态站，直接由 Nginx / Caddy / NAS Web Station 托管。无需 Node、数据库或 Mne 后端。部署操作等待用户验收，当前没有向 NAS 写入文件。准备说明见 `docs/nas-hosting.md`。

GitHub 仅用于公开源码备份；没有启用 GitHub Pages。
