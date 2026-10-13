# NAS 静态托管准备

当前只完成本地预览和 GitHub 源码备份。NAS 部署需要用户确认页面后再操作。

1. 将仓库 `dist/` 内的文件上传到一个独立站点目录。
2. 将 Nginx / Caddy / Web Station 的站点根目录指向该目录，以 `index.html` 为入口。
3. 使用单独网站域名和 HTTPS。无需连接 App 的 API 服务。
4. 检查 `/`、`/styles.css`、`/motion.css`、`/refinements.css`、`/app.js`、`/motion.js`、`/contacts.js`、`/assets/photos/city.webp` 返回 200。

无需执行构建或安装依赖。相对资源路径支持域名根目录与子目录部署。不要把开发预览脚本的 Node 服务作为公网生产服务。

示例 Nginx 配置（仅模板；未写入 NAS）：

```nginx
server {
    listen 80;
    server_name example.com;
    root /volume1/web/mne;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }

    add_header X-Content-Type-Options nosniff always;
    add_header Referrer-Policy strict-origin-when-cross-origin always;
}
```

实际路径、端口、域名和 HTTPS 方式在用户确认后根据现有 NAS 设置选定。
