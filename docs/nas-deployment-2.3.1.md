# Mne 网站 2.3.1 · NAS 同步记录

用户明确要求同步 SMB 网站。2026-10-25 09:01 UTC（当地 02:01 PDT）使用已连接的 `//yifanovo@192.168.1.19/docker`，同步网站源码提交 `e146e05` 至 `/Volumes/docker/mne-website/site`。

- 同步前完整备份：`/Volumes/docker/mne-website-backups/2026-10-25T09-01-21-646Z`。NAS 对应目录为 `/volume1/docker/mne-website-backups/2026-10-25T09-01-21-646Z`。
- 更新 25 个文件，保留原 `site` 绑定目录；首页最后替换。全部 125 个静态文件与本地 `dist` 字节一致，NAS `release.json` 中 128 个文件哈希全部通过。
- `docker-compose.yml` 与 `nginx.conf` 和备份逐字节一致。未重建或重启容器，未修改后端、数据库、证书或代理设置。
- 公开 HTTPS 首页、功能脚本／样式、两张新卡、主题图标及三个隐私入口，共 11 项均返回 200 且与本地文件字节一致。Python 默认客户端收到 403 后，使用 curl 和 Chromium 独立确认成功。
- Chromium 实际打开首页返回 200，主脚本为 `app.js?v=2.3.1`，照片编辑概览五枚图标、旅途回望和八种主题均存在。记录位于忽略目录 `artifacts/deploy-2.3.1/`。

访问 https://mne.yifanovo.com/?v=2.3.1#photo-editing 查看新版。

回退时，将上述备份 `site` 内的内容覆盖回原目录，保留原目录本身，并恢复备份 `release.json`；本次无需恢复基础设施配置。
