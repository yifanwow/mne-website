# 网站 2.4.1 · NAS 同步记录

用户于 2026-10-27 明确要求移除「熟悉的操作，又轻了一点」完整栏目，并将其余已确认内容同步到 SMB NAS。

## 备份与同步

- 网站源码：`e8c083d`，版本 **2.4.1**。SMB 挂载为 `//yifanovo@aSkyFullOfStars._smb._tcp.local/docker`，沿用 `/Volumes/docker/mne-website/site`。
- 完整备份：`/Volumes/docker/mne-website-backups/2026-10-27T11-08-59-862Z`，即 2026-10-27 **04:08:59 PDT / 11:08:59 UTC**。NAS 路径为 `/volume1/docker/mne-website-backups/2026-10-27T11-08-59-862Z`。
- 更新 19 个文件；保留 `site` 绑定目录，首页最后替换。全部 **133 个静态文件** 与本地 `dist` 字节一致，NAS 清单 **136 个文件哈希** 全部通过。
- Docker Compose 与 nginx 配置和备份逐字节相同；未重启或重建容器，未修改后端、数据库、证书、域名代理或隐私正文。

## 线上验证

公开 HTTPS 首页、主脚本、新增脚本／样式、地球数据、目录、四张新卡及三个隐私入口，共 **14 项** 均返回 200，并与本地文件字节一致。

Chromium 实际导航返回 200，读取 `app.js?v=2.4.1`；被删除栏目及其导航不存在。地点切换、照片换组、新卡切换、中英文切换均正常，原照片编辑区保留五个图标。390px 手机视口无横向溢出，未出现页面异常。部署证据在忽略目录 `artifacts/deploy-2.4.1/`。

本地 Chromium／WebKit 已通过两语言、五档屏宽的地球与新卡检查，以及暂停、恢复、离屏停转和减少动态效果。其余 HTML 对照 2.4.0，除删除该块和缓存版本外完全一致。

访问 https://mne.yifanovo.com/?v=2.4.1#footprint-studio 查看新版。

完整替换包为 `releases/mne-website-update-2.4.1.zip`，134 项哈希及 ZIP 完整性通过，包内静态文件与发布源码一致。回退时把备份 `site` 内部内容覆盖回原目录，保留原目录本身，再恢复备份 `release.json`；本次无需恢复基础设施配置。
