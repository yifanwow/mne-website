# Mne 隐私核对 · 2026-10-24

本次只改网站。核对的是本机 iOS 源码与后端源码，不是已提交审核的二进制或线上服务验收；未运行 iOS 构建、测试、模拟器或设备操作。

## 核对范围与来源

- iOS 工程：`/Users/yifanovo/code/iOS Project/Mne`。
- 当前工作副本标记：**0.9.384 (415)**，`AppRelease.updatedOn = 2026-10-24`。HEAD：`55b6e0943c60c1f89f22e9e5d524eeb786a0defa`；存在用户未提交修改，尤其是项目版本、主题与后台模型。不能仅用 HEAD 代表工作副本，也不代表已发布。
- 官网：`/Users/yifanovo/Documents/ChatGPT/web开发`（`yifanwow/mne-website`），原版本 2.1.1，本次 2.2.0。
- 使用 codebase-memory Tier 2 定位、调用关系与逐路径 coverage；NASBackupStore 的 145–150 行解析不全，已直接阅读该范围及相关实现。网站 dist/deploy 不在图索引，直接阅读。负向结论还核对 Mne 下 Swift 导入、网络调用、项目依赖与配置，不把“图未找到”当作没有。
- 其余范围缺口主要是图片、Xcode 用户状态与 Python 缓存；未将这些作为隐私行为证据。没有用历史简报代替当前代码。

## 结论与证据

| 核对项 | 当前源码结论 | 核心文件（相对 iOS 工程） |
| --- | --- | --- |
| 权限 | Info.plist 由项目生成。读写照片库、添加照片、设备运动三项说明；没有相机、麦克风或实时位置的用途说明 | Mne.xcodeproj/project.pbxproj：1896–1901、1932–1937；Mne/Core/Services/MediaLibrary/PhotoLibraryStore.swift：282 |
| 隐私清单 | Tracking=false、空跟踪域；UserDefaults 的 CA92.1；已声明 Name / EmailAddress / UserID / DeviceID / PhotosorVideos / ProductInteraction / OtherDataTypes，均 linked=true / tracking=false / AppFunctionality | Mne/PrivacyInfo.xcprivacy |
| SDK | iOS 导入项均为 Apple 系统模块；Frameworks 阶段为空，未发现 SPM/Pods/Carthage 或嵌入的第三方统计、广告、登录、自动崩溃 SDK。后端 FastAPI/uvicorn/PyJWT/cryptography 等为自营服务依赖，并非 App 内 SDK | project.pbxproj：498–506；Mne 下全部 Swift imports；backend/requirements.txt |
| 自营服务器 | 两个 HTTPS 入口 mne-api.yifanovo.com / cn-api.yifanovo.com，共用账号；源码说明亚洲入口为香港中转。不能据此验证真实机房或中转服务商 | Mne/Core/Services/Account/NASAPIClient.swift：47–63、244–278 |
| 账号与头像 | 邮箱、密码、昵称、ID、邀请信息；生日可选；头像 JPEG 单独上传。密码服务端为 salted scrypt 验证摘要，本机只保存会话令牌，不保存密码 | NASPayload.swift；NASBackupStore.swift；backend/security.py：39–49；backend/models.py |
| 备份 | 登录后变更触发自动同步，另有立即同步；上传头像、资料、数字统计、整理日期、成就日期、主题/语言/比例、设备 UUID；不上传照片库原件、相册成员、媒体 ID 或逐张活动账本 | NASPayload.swift：NASMetricsSnapshot、NASPreferencesSnapshot、NASBackupSnapshot、NASProfileUpdate；NASBackupStore.swift：backup/scheduleBackup；Mne/App/MneApp.swift：232 |
| 使用统计 | 默认 true；访客随机凭据，登录关联访客历史；约每 60 秒与生命周期尝试上传。包含会话、标识、版本、数量、页面/操作/时长/导航、六类查询类别、主题和图标、容量汇总。无用户界面关闭开关；没有照片内容、媒体 ID、地名、照片坐标 | Mne/Core/Services/Telemetry/NASUsageTracker.swift：73–105、121–130、146–207、471–502、587–680；Mne/Core/Models/Telemetry/UsageBehavior.swift；backend/analytics.py |
| 手动报告 | 当前登录账号主动确认后才发；版本、设备环境、数量、资源/性能计数及最近事件。不是自动上传完整 RuntimeProbe，不含照片/ID/地名/路径/邮箱/令牌 | Mne/Core/Models/Telemetry/DiagnosticReport.swift；Mne/Features/Profile/Help/Components/DiagnosticUploadSection.swift；NASBackupStore.swift：169–183 |
| Apple 服务 | JourneyPlaceNameResolver 将抽样照片坐标和 locale 传 CLGeocoder；PhotoCityLabel 的城市解析先降低坐标精度，PhotoDetailsPopup 的明确查看则使用照片原坐标；PhotoCaptureLocationSession 将 naturalLanguageQuery 传 MKLocalSearch。地图显示也会向 Apple 请求区域；未发现 CLLocationManager 或实时定位请求 | Mne/Core/Services/Experiments/Journeys/JourneyPlaceNameResolver.swift：81–82；Mne/Shared/UI/Labels/PhotoCityLabel.swift：12–20；Mne/Features/Photos/Single/Components/PhotoDetailsPopup.swift：326–344；Mne/Features/Photos/Editor/Sessions/PhotoCaptureLocationSession.swift：60–80 |
| 地点编辑 | 旅程展示与地点解析不改照片；照片地点编辑在 save 确认时执行 PHAssetChangeRequest.location，用户可移除地点，不能写成“App 永不改地点” | PhotoCaptureLocationSession.swift：save |
| 本地识别 | 相似比较使用本地 160px 小图；六类用 Apple Vision，本地 384px 小图和视频至多三帧；Photos 请求 network=false；排除共享相册、不做身份识别 | Mne/Core/Services/Experiments/Duplicates/SimilarPhotoScanner.swift：173–220；Mne/Core/Services/Experiments/Themes/SubjectPhotoScanStore.swift：159–317、320–470；Mne/Core/Models/Experiments/SubjectPhotoTheme.swift |
| 其他 iCloud 读取 | 查看/播放/编辑/分享和主动读取原信息有 network=true 路径。因此“扫描不下载原件”不能扩大成“整个 App 从不访问 iCloud” | PhotoThumbnailPipeline.swift；PhotoCropEditSession.swift：44、204；PhotoMediaEditSession.swift：53、91；PhotoShareSheet.swift：46；PhotoLivePlayer.swift；PhotoDetailsPopup.swift：268–269 |
| 本机保存 | UserDefaults 保存相册顺序/封面引用/图标、偏好、暂存引用、统计及成就；Application Support 活动账本保存成功操作明细，包括媒体标识、拍摄/操作日期、尺寸、时长、容量和关联相册信息；识别/旅程缓存本地保存 | Mne/Core/Services/App/AppPreferences.swift；Mne/Core/Services/Statistics/MneMetrics.swift；Mne/Core/Services/Statistics/MneActivityJournal.swift；Mne/Core/Models/Statistics/MediaActivity.swift；Mne/Core/Models/Experiments/SimilarPhotoGroup.swift |
| iCloud 同步及卸载 | 没有 CloudKit/NSUbiquitous 独立同步；不等于所有本地数据均排除系统设备备份。凭据使用 device-only Keychain，重装仍可能读取。卸载/删除 App 不删除服务器与系统图库 | Mne/Core/Services/Account/NASSessionVault.swift；NASUsageTracker.swift：122–125；各缓存 isExcludedFromBackup 设置 |
| 清缓存 | 只清可重建缓存、扫描结果/进度和过期临时文件，不清账户/统计/成就/暂存/活动账本。没有一键删除全部本地个人记录 UI | Mne/Core/Services/Cache/AppCacheManager.swift：13–35；ProfileSettingsView.swift：206–212 |
| 删除照片 | 真正删除统一走 PHPhotoLibrary.performChanges / PHAssetChangeRequest.deleteAssets；只有系统成功回调才更新记录，取消/失败不计。最近删除、iCloud 同步由系统管理，没有永久清空最近删除接口 | PhotoLibraryStore.swift：717–810；PhotoLibraryStore+Albums.swift；TimelineView+Trash.swift |
| 账号删除/保留 | 长按设置连接区邮箱→确认密码→服务确认；主库级联删除资料/会话/备份/报告/统计/关联访客。使用统计及服务事件无固定天数清理；报告 30 天窗口+数量上限。保留单向撤销摘要，回执摘要七天到期。独立备份实际清理不能仅凭代码证明 | NASConnectionSection.swift：36–42、121–151；NASBackupStore.swift：deleteAccount；backend/storage.py：391–420；backend/analytics.py：249–253；backend/diagnostics.py：120–147 |
| 购买/订阅 | 未发现 StoreKit、SKPayment 或 App 内购买/自动续订实现；外部支持作者入口不等于 App 内订阅 | Mne 下 Swift imports、购买 API 文本核对；ProfileSettingsView.swift |

## 网络请求清单

1. **自营 API / 两个配置入口**：health 检查与选路；注册、登录、退出；读/写资料与生日；备份读写；访客身份注册、关联、使用会话；手动错误报告；删除账号。登录与访客请求按路径携带不同凭据。X-MNE-Server-Entry / X-MNE-Analytics-Environment 描述路由和运行环境，不是推断的用户地理位置。
2. **更新检查**：AppUpdateStore 请求 `v1/app/update?ios=<系统版本>`；不带登录令牌。内容仓库请求 `v1/content/manifest` 和按哈希标识的公开文字/卡画对象，带缓存验证标记，不带图库或登录凭据。
3. **Apple Maps/CoreLocation**：地图区域、照片坐标反向地理编码、用户输入地名的搜索；可能产生 Apple 自身的网络元数据。App 源码无法枚举 Apple 框架内部所有请求头和底层域名，页面没有作此承诺。
4. **PhotoKit/iCloud**：仅识别路径明确禁网；其他特定媒体操作可取云端内容。
5. **用户发起的系统分享/外链**：交给用户选择的接收方；不属于自动上传全库。
6. 后端入口关闭 uvicorn access log，应用短期限流映射使用连接地址；**不能据此声称整条 NAS/反向代理/中转链没有 IP 日志**。

## 页面里有意没有写的承诺

- “开发者不收集个人数据”“访客完全匿名”“没有任何联网/第三方服务”均不符合当前源码。
- “不出售数据”以及开发者在线下不作其他使用无法单靠源码验证；初版未写，本轮开发者确认后已补入 2.2.1。
- 未承诺独立备份立即删除、固定服务机房、具体法律适用/儿童年龄门槛、App 内数据总清除开关。
- App 内文案写七天内清除服务器数据，主数据库代码会同步删除；**七天是否覆盖外部备份需要确认**，页面只描述已核实主库行为。
- 清单没有覆盖本次发现的全部统计/诊断类别与 Analytics 用途。网页不能修复清单或 App Store 问卷；见 app-store-privacy.md。

## 初次核对问题（本轮回复见下方补充确认）

1. 准备送审的具体版本/构建是否就是本次工作副本 0.9.384 (415)？服务器是否已部署相应访客统计、账号删除、保留策略与最新接口能力？如果不同，请给出对应版本以重新对齐。
2. 服务商和开发者访问日志已确认：Cloudflare、腾讯云；开发者不持久保存 IP/HTTP 访问日志，无源码之外接收方或用途。具体存储/转发地区未确认，页面不写固定机房；服务商自身处理适用其政策。
3. 独立数据库备份/快照保存多久？账号删除如何传播至备份，实际最长期限是多少？是否确实满足 App 内七天说明？
4. 未登录访客希望删除已上传数据时，如何验证身份/定位其记录？当前没有显示访客 ID 或自助删除访客记录的界面；仅卸载不能可靠做到这一点。
5. 已确认不出售数据，没有源码之外的接收方或用途；源码未发现广告或跨 App 广告跟踪。
6. 本轮按不另设产品最低使用年龄表述，保留监护人提示。App Store 年龄分级、是否进入儿童类别仍需在送审时确定。
7. 生效日期采用本轮授权公开日期 2026-10-24（America/Los_Angeles）；联系方式已确认：yifanovo@gmail.com。
8. 送审前需同步 PrivacyInfo.xcprivacy 与 App Store Connect 标签中的实际收集类别及用途。本次网站任务没有修改 iOS 工程。

## 开发者补充确认与本次部署授权 · 2026-10-24

开发者确认使用 Cloudflare、腾讯云；不保存 IP 或访问日志；数据不出售，没有源码外的接收方或用途。此处不保存日志按 IP/HTTP 访问日志理解，不能与源码已存在的使用统计、账号事件及主动报告混同。页面说明连接信息仍须经过网络服务商，不代服务商承诺不处理任何网络元数据。

送审构建尚未确定；最低年龄按不另设产品门槛表述，保留监护人提示，商店年龄分级另行填写。本轮用户明确要求部署官网，替代上一轮不覆盖 NAS 的边界；不包含 App 后端更新、数据库变更或 App 提交。独立备份轮转与访客自助删除流程仍待进一步确定，页面没有新增固定清理期限。

公开 health 只读核实：apiVersion 1.22、usageAnalyticsVersion 8、guestAnalytics=true、accountDeletion=true、usageRetention=until_account_deletion。它证明服务声明这些能力，不证明最新客户端所有字段或删除流程已端到端验收。
