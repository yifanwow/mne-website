# 网站内容同步 · 2026-10-16

网站版本：1.4.0。App 来源：[yifanwow/mne · cf56cac2ce6a4f8e241f2dfcae058254ef3f322c](https://github.com/yifanwow/mne/tree/cf56cac2ce6a4f8e241f2dfcae058254ef3f322c)，该快照源码标记为 0.9.127 (158)。本轮没有修改或构建 iOS App，也没有连接 NAS。

## 页面更新

- 保留 02B 桌面四列竖卡，以及平板两列、手机单列。快捷添加文案更新为预览最近五个 / 完整添加页最近十个相册。
- 新增相册设计展示：进入 / 退出编辑的收拢动画、三张作者摄影可切换封面、编辑名称与置顶反馈。真实 App 支持最多七张指定封面，网站只用三张样图演示，不接入真实图库。
- 成就由七张扩为二十张，按 App 分类提供六普通、八主题、六三星（愚者＋五神秘）浏览。八张新主题卡展示原有卡面和原文故事；五神秘模糊展示，不透露名称、故事或解锁条件。切换分类、滚动、触控、键盘与减少动画模式保留。
- 图谱改为默认年柱形图，2022—2026 年示意数据支持起止年份选择、周/月/年分组和趋势/柱形/饼图。选区统计随范围变化；容量详情明确是估算和演示，不代表系统实测或实际释放。
- 同步最新旧梦图标与主题名称，说明离线整理、内置卡面以及联网更新内容的边界。
- 新增三段 App 开发手记，最新构建 158 的事实表述为已上传 App Store Connect、进入 Apple 处理，未核验后续分发或审核状态。网站无公开下载链接。

## 内容依据

- `README.md`、`docs/development-2026-10-16.md`、`docs/achievement-art.md`、`docs/testflight-checklist.md`。
- `Mne/Core/Models/MemorySeal.swift`、`AppLanguage.swift`、`AppTheme.swift`、`AppRelease.swift`。
- `Mne/Assets.xcassets/Achievement*.imageset` 与 `AppIconPurple.appiconset`。

卡面只做网页尺寸及无损 WebP 导出，不重新绘制。摄影沿用作者此前授权的本机相册；新增三张不与页面其他摄影重复，EXIF/GPS 不随导出保留。

## 交付

使用 `node scripts/package-update.mjs` 生成 `releases/mne-website-update-1.4.0.zip`。包内只有完整 `site/`、更新步骤与逐文件 SHA-256 清单。用户备份旧 `site/` 后，覆盖现有静态目录内部文件；保留原挂载目录、Compose、Nginx 配置、证书、后端与数据库。无需重建 Docker 镜像。
