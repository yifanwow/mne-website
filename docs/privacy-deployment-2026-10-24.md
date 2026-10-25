# Mne 官网隐私页部署 · 2.2.1

开发者于 2026-10-24（America/Los_Angeles）明确要求部署。网站版本 2.2.1；政策生效及更新日期均为 2026-10-24。联系人：yifanovo@gmail.com。

## 本轮确认

- Cloudflare、腾讯云提供网络或基础设施支持。开发者确认不持久保存 IP/HTTP 访问日志，不出售数据，没有源码之外的接收方或用途。
- 不保存访问日志与已有使用统计、账号事件、主动错误报告分别说明；不替服务商承诺不处理连接信息。
- 产品不另设最低使用年龄，保留监护人提示；App Store 年龄分级在送审时单独确定。
- 送审构建尚未确定。网页基于已核对的本地 App 工作副本，不代表已验证最终二进制与线上后端完全一致。

## 部署与恢复

沿用现有完整静态文件同步和 ZIP 打包流程，保留 NAS 上的 `site` 绑定目录与专用 Docker 配置。

初次同步前完整备份：

`/Volumes/docker/mne-website-backups/2026-10-25T05-49-18-396Z`

NAS 内对应：

`/volume1/docker/mne-website-backups/2026-10-25T05-49-18-396Z`

在原 `nginx.conf` 中仅加入 `/privacy`、`/privacy/` 两个精确路由，返回 `privacy.html`；保留原配置文件 inode，避免单文件绑定挂载继续读取旧文件。通过 NAS 原管理服务对实际 `mne-website` 容器运行 `nginx -t`，成功后执行 `nginx -s reload`。完成于 **2026-10-25 05:53:22 UTC / 2026-10-24 22:53:22 PDT**。未重建镜像。

外网验收发现 Cloudflare 邮箱混淆会使无 JavaScript 的联系方式不可读，按 [Cloudflare 官方说明](https://developers.cloudflare.com/waf/tools/scrape-shield/email-address-obfuscation/#prevent-cloudflare-from-obfuscating-email) 为三个邮箱链接增加 `email_off` 标记；仅再次同步两个 HTML 文件。该次同步前另有备份：`/Volumes/docker/mne-website-backups/2026-10-25T05-54-25-479Z`，它已包含新路由。初次备份仍保留。

NAS `release.json` 记录完整文件哈希、网站版本、配置验证/重载结果及初次备份位置。凭据仅用于现有管理服务认证，不写入仓库、更新包或记录。未修改 App 后端、数据库、域名代理或证书。

如需恢复初次部署前状态，将初次备份 `site` 内的文件复制回原 `site`，保留目录本身；将备份配置内容写回原 `nginx.conf`，保留该文件本身，再检查配置并重载。同步恢复备份 `release.json`。不要移走正在绑定的目录或配置文件。

## 公开 HTTPS 验收

以下入口均无需登录，直接 **200 / text/html; charset=utf-8**，无补斜杠跳转：

- https://mne.yifanovo.com/privacy
- https://mne.yifanovo.com/privacy/
- https://mne.yifanovo.com/privacy.html

三个入口返回相同 HTML；邮箱直接存在于 HTML，无需邮箱解码脚本。首页页脚带政策链接。

浏览器验收另发现 Cloudflare 自动注入 `static.cloudflareinsights.com/beacon.min.js`，该脚本并不在网站仓库。按 [Cloudflare 官方说明](https://developers.cloudflare.com/web-analytics/get-started/)，将既有 `Cache-Control: no-cache` 补充为 `no-cache, no-transform`，禁止代理改写源站内容及自动注入网站统计脚本。配置再次检查成功并重载，完成于 **2026-10-25 05:59:08 UTC / 2026-10-24 22:59:08 PDT**；其他配置保持。这不阻止服务商自身的网络/边缘请求处理，不改变 App 默认使用统计。

外网与本地浏览器检查记录位于 `artifacts/privacy-2.2.1/`；公开 HTTP 结果为 `public/http-verification.json`。截图是浏览器桌面/手机视口，不是真机测试。外网 Chromium 观察到 Cloudflare Speed Brain 对未缓存的预取返回 503，并带 `sec-purpose: prefetch` / `cf-speculation-refused: prefetch refused: not eligible`；这是 [官方文档说明的预取拒绝行为](https://developers.cloudflare.com/speed/optimization/content/speed-brain/)，实际打开页面仍须独立通过 200 检查。验收脚本单独记录这种预取响应，其他错误照常失败，未改 Cloudflare 设置。

最终公开回归通过：Chromium 和 WebKit，各六种语言/视口组合；三个入口禁用 JavaScript 后仍有完整双语正文与邮箱；语言切换/刷新/章节深链/受限存储、首页链接、字体、正文尺寸与横向溢出检查均通过，没有外部资源请求。WebKit 将预取标为 xhr，Chromium 标为 other；以明确的 Cloudflare 预取拒绝响应头识别并单独记录，两者真实导航均成功。补充 no-transform 后，公开首页及三个政策入口均与本地文件字节一致。

最终更新包 14,095,998 字节，manifest 113 个文件的 SHA-256 全部通过；ZIP SHA-256 为 `7e9702a44dba02736b8fa7375e613d67eb71e7a95fa9faa0340885c826d9f5a1`。NAS 最终 115 个已记录文件哈希逐一通过，静态文件与 dist 一致。

## 交付与仍待确认

完整静态更新包：`releases/mne-website-update-2.2.1.zip`。README 已新增版本记录。文件清单和验收方法见 [网页验收](privacy-verification.md)，数据类别及隐私清单差异见 [App Store 标签建议](app-store-privacy.md)。

送审前仍需确定：最终构建与实际后台字段是否一致；独立备份/快照的保留和账号删除期限；未登录访客数据的身份验证与删除流程；商店年龄分级及隐私清单与标签。网站部署不等于这些事项已完成，不能选“不收集数据”。
