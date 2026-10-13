# Mne 网站：群晖 Docker 部署

本次为容器部署准备。网站版本 1.2.0 已完成中英双语、五种屏宽和交互检查；容器、反向代理、DNS 与证书由你在 NAS 上启动和配置。Mac 未安装 Docker，NAS 的 SSH 连接被拒绝，因此尚未执行 `docker compose config`、`nginx -t` 或生产 HTTP 验收。

采用官方 `nginx:stable-alpine` 镜像，直接只读挂载网页，无需构建镜像、Node、数据库、账号配置或 App 后端。首次启动需要 NAS 能从 Docker Hub 拉取镜像。后续可以继续使用已拉取的镜像；`stable-alpine` 是可更新标签。

| 项目 | 值 |
| --- | --- |
| Mac 上的 Finder 挂载目录 | `/Volumes/docker/mne-website` |
| NAS 上的项目路径 | `/volume1/docker/mne-website` |
| 项目／容器名 | `mne-website` |
| 域名 | `mne.yifanovo.com` |
| NAS 本机监听 | `127.0.0.1:18174` |
| 容器 HTTP 端口 | `80` |
| 反向代理目标 | `HTTP → 127.0.0.1:18174` |

`18174` 为此次预设端口，尚未确认 NAS 上有无占用。如启动提示端口被占用，把 Compose 的 `127.0.0.1:18174:80` 改为一个空闲端口，反向代理目标端口同步修改。

## 文件

```text
mne-website/
  docker-compose.yml
  nginx.conf
  部署步骤.md
  release.json             # 网站版本、源码提交、逐文件 SHA-256
  site/                    # 完整网页及图片
    index.html
    app.js
    ...
    assets/
```

使用项目根目录里的 `docker-compose.yml`，网站根目录是 `site/`。它与现有 `mne-api` 是独立目录与项目。

## 1. Container Manager 创建项目

1. 在 NAS 的 File Station 打开 `docker/mne-website`，确认能看到上述文件和 `site` 子目录。
2. Container Manager → **项目 → 新增／创建**。
3. 名称填 `mne-website`，路径选择 `/volume1/docker/mne-website`。
4. 使用已有的 `docker-compose.yml`。若只能选“上传”或“创建”，上传目录里的 Compose 文件，或在编辑器中粘贴它的完整内容。
5. 创建并启动。此项目没有 `build:`，不需要构建镜像；首次会拉取 Nginx。
6. 如果向导询问是否通过 Web Station 创建 Web 门户，保留未启用状态，按下一节使用已有的 DSM 反向代理。
7. 约 30–60 秒后确认容器持续运行、健康状态为 `healthy`。

配置为只读网站与配置挂载，Nginx 运行临时目录在内存中。容器健康检查访问 `/healthz`。默认日志仅保留错误，避免记录访问者浏览日志。

需要进一步验证时，在 Container Manager 中打开 **mne-website 容器的终端**，分别执行：

```sh
nginx -t
wget -qO- http://127.0.0.1/healthz
wget -S -O /dev/null http://127.0.0.1/app.js
```

第一项应显示配置语法成功，第二项应输出 `ok`，第三项应返回 HTTP 200 和 JavaScript 的 Content-Type。

这三个地址是在容器内使用的；由于宿主绑定 `127.0.0.1`，不能从 Mac 浏览器直接打开 `NAS局域网IP:18174`。外部访问走域名和 NAS 的 HTTPS 反向代理。

## 2. DSM 反向代理

控制面板 → **登录门户 → 高级 → 反向代理 → 新增**。

| 字段 | 填写 |
| --- | --- |
| 名称 | `mne-website` |
| 来源协议 | HTTPS |
| 来源主机名 | `mne.yifanovo.com` |
| 来源端口 | 443 |
| 目的协议 | HTTP |
| 目的主机名 | `127.0.0.1` |
| 目的端口 | 18174 |

网页只有静态 HTTP 请求，不需要 WebSocket 或特殊自定义头。沿用现有 NAS 的 443 入口，无需给 `18174` 新增路由器端口转发。

## 3. 证书

控制面板 → **安全性 → 证书 → 设置／配置**，给 `mne.yifanovo.com` 对应的反向代理分配匹配证书。

已有有效的 `*.yifanovo.com` 通配符证书可以覆盖该子域名；如果现有证书只覆盖 `mne-api.yifanovo.com`，需要给 `mne.yifanovo.com` 添加证书，或扩展已有证书的域名范围。浏览器应正常验证 HTTPS。

## 4. Cloudflare DNS

2026-10-13 只读查询确认已有 `mne-api.yifanovo.com` 的 CNAME 指向 `yifanovo.synology.me`。沿用这条 NAS DDNS 目标：

| 字段 | 填写 |
| --- | --- |
| 类型 | CNAME |
| 名称 | `mne` |
| 目标 | `yifanovo.synology.me` |
| TTL | 自动 |
| 代理状态 | DNS only／灰云，先与已有 NAS 服务保持一致 |

如已有同名 DNS 记录，核对后编辑该记录。保存后打开 `https://mne.yifanovo.com`。如果之后启用 Cloudflare 橙云，源站证书正常时使用 **Full (strict)**，不要使用 Flexible；确认 HTML、CSS 和 JS 没有被额外的“缓存所有内容”规则长期缓存。

## 5. 上线验收

- `https://mne.yifanovo.com/healthz` 返回 `ok`。
- 首页正常加载，图片、字体与 Logo 完整；没有证书警告。
- `/app.js`、`/styles.css`、`/motion.js`、`/refinements.css` 和 `/assets/photos/city.webp` 返回 200；不存在的路径返回 404。
- 中文／英文切换、滚动演示、成就卡、统计动画和微信二维码正常。
- 在家庭网络和手机蜂窝网络各打开一次。

终端可选检查（可在 Mac 上执行）：

```sh
curl --fail --show-error https://mne.yifanovo.com/healthz
curl --head https://mne.yifanovo.com/app.js
```

## 更新、回退与故障定位

以后更新网页之前，先在 File Station 复制整个 `mne-website` 目录到带日期的备份目录，再替换 `site/` 内的完整网页。这是只读挂载的静态文件，通常不需要重新构建或重启容器；浏览器刷新会重新验证缓存。更新配置或端口时，在 Container Manager 重新创建项目容器。

需要回退时，停止此项目，恢复备份中的网页及配置，再启动此项目。

- **镜像拉取失败**：在 Container Manager 的镜像页面拉取 `nginx:stable-alpine`，成功后启动项目。
- **挂载路径不存在**：项目路径必须选到 `mne-website`，并确认 `site/` 和 `nginx.conf` 都存在。
- **HTTP 502**：检查容器是否运行及反向代理目标端口是否一致。
- **HTTP 403**：检查 `site/index.html` 存在，并在 File Station 权限中确保容器能够读取这些网页文件。
- **证书报错**：确认给此域名分配了匹配证书。
- **页面仍旧**：强制刷新；若启用了 Cloudflare 网站缓存，清除此域名的缓存。

## 从仓库重新准备

在 Mac 的仓库目录中：

```sh
node scripts/stage-nas.mjs --output /Volumes/docker/mne-website
node scripts/stage-nas.mjs --verify /Volumes/docker/mne-website
```

打包脚本会拒绝覆盖已存在的目录。更新时请先生成到一个新的目录，再备份与更新运行站点。

有 NAS SSH 权限时，可选使用以下启动方式代替界面操作（在 NAS 上执行）：

```sh
cd /volume1/docker/mne-website
docker compose config --quiet
docker compose up -d
docker compose ps
```

参考：[官方 Nginx 镜像](https://hub.docker.com/_/nginx)、[Docker Compose 服务配置](https://docs.docker.com/reference/compose-file/services/)、[群晖反向代理](https://kb.synology.com/en-af/DSM/tutorial/Quick_Start_Synology_SSO)、[Cloudflare DNS 记录](https://developers.cloudflare.com/dns/manage-dns-records/how-to/create-dns-records/)。
