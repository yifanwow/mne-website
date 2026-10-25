# App Store 隐私标签填写建议

核对日期：2026-10-24。基于本地 Mne **0.9.384 (415)** 工作副本及后端源码；目标送审二进制与线上服务仍需开发者确认。证据见 [隐私核对](privacy-audit.md)。

## 首要选项

**“你或你的第三方合作伙伴是否从此 App 收集数据？”选“是”。不要选“不收集数据”。**

账号可选、本地识别、没有统计 SDK，都不能抵消已存在的服务器收集。访客默认统计在登录后可与账号关联，应按关联身份处理。苹果对仅设备内处理以及 Apple 自身收集有单独说明；参考 [App privacy details](https://developer.apple.com/app-store/app-privacy-details/)。

## 建议申报类别

以下标为“申报”的类别：**与用户关联=是；用于跟踪=否**。用途按该数据实际的每条用途选择，不能只因清单现有 App Functionality 就遗漏 Analytics。

| 类别 | 建议 | 用途 | 源码理由 |
| --- | --- | --- | --- |
| 联系信息 → 电子邮件地址 / Email Address | 申报 | App Functionality | 注册、登录、资料；服务端保存 |
| 联系信息 → 姓名 / Name | 保守按现有清单申报 | App Functionality | 资料昵称；清单已声明 Name。若产品语义明确只有 handle 而非姓名，应与下行统一并校准清单，不能直接删声明 |
| 标识符 → 用户 ID / User ID | 申报 | App Functionality、Analytics | 账号 ID、公开 ID、访客 ID、访客关联/邀请关系 |
| 标识符 → 设备 ID / Device ID | 申报 | App Functionality、Analytics | 随机设备 UUID 用于备份及统计；不需要是广告 ID 才算标识符 |
| 用户内容 → 照片或视频 / Photos or Videos | 申报 | App Functionality | 用户选择的个人头像上传；不是整库照片上传 |
| 使用数据 → 产品交互 / Product Interaction | 申报 | Analytics；作为同步整理进度使用的部分也选 App Functionality | 打开、页面/功能访问、操作与导航汇总、时长、六类主题查询、整理计数 |
| 使用数据 → 其他使用数据 / Other Usage Data | 建议申报 | Analytics、App Functionality | 图库数量、权限/偏好、容量、整理日期等账户使用汇总 |
| 诊断 → 性能数据 / Performance Data | 建议申报 | App Functionality | 主动报告中的性能/资源计数与诊断事件，用于排错和改善性能 |
| 诊断 → 其他诊断数据 / Other Diagnostic Data | 申报 | App Functionality | 手动上传设备/系统环境、诊断状态，与当前账号关联 |
| 其他数据 → 其他数据类型 / Other Data Types | 申报 | App Functionality；纳入统计的字段也选 Analytics | 生日及不落入上述类别的资料、偏好/成就日期。生日已入服务端资料，并非仅本地 |
| 用户内容 → 客户支持 / Customer Support | 取决于实际支持工作流 | 若保存客服请求则 App Functionality | 当前上报是结构化诊断，不是自由文字反馈。若实际把报告作为客服工单或加入内置反馈，再申报此类；不要凭空认定存在工单 |

Analytics 是功能使用分析；App Functionality 包含认证、同步、安全、排错与支持。不要勾选广告或营销用途。若以后确实做资料个性化推荐，需按实际增加 Product Personalization；不能从主题颜色设置推定存在推荐系统。

## 当前不需要仅凭本地访问而申报的类别

- **照片库原件、视频内容、逐张照片标识、相似指纹/识别标签、旅程照片坐标**：不上传 Mne 服务器。Photos or Videos 的申报来自头像，必须区分。
- **精确/粗略位置、搜索历史**：当前照片坐标与地名搜索仅交 Apple 系统服务，未见 Mne 保存这些请求到服务器；不替 Apple 申报 Apple 自己收集的数据。若代理日志或新增接口实际保存地点/搜索内容，需要重评。
- **健康/健身、联系人、音频、敏感生物身份、浏览历史、购买记录、付款信息、广告数据**：本次源码未发现对应服务器收集。设备倾斜只用于本地动效，不能因此申报健身数据。
- **崩溃数据 / Crash Data**：当前手动结构化错误报告不等于崩溃日志，未发现自动崩溃日志上传。已有性能/其他诊断数据仍要按上表申报。
- 若实际保留 IP 地址，按其用途重新判断设备标识/诊断/位置类别，**不能因为 App JSON 没有 IP 字段就声称全链路未收集**。本轮开发者确认不持久保存 IP/HTTP 访问日志；服务商自身处理按其政策评估。

## 可选上报不自动等于可省略披露

手动报告逐次确认，但目前提交确认并未完整展示全部报告字段及显著的账号名称；不建议未经进一步核对就套用 Apple 的可选披露例外。可选账号后的持续自动同步也不是逐次可选提交。保守方案为按实际类别申报。

## 清单与问卷的差异

现有 PrivacyInfo.xcprivacy 声明了七类数据，全部只列 App Functionality；没有单独列出 Other Usage Data、Performance Data、Other Diagnostic Data，也没有体现 Analytics。需要在送审前对照实际实现校准。此网站任务没有改清单、App 版本或 Connect 设置。

“无第三方 SDK”和“不用于跨 App 广告跟踪”不等于“不收集”。随机/伪匿名访客在之后可关联账号，因此不应选“未关联用户”。若数据用途或关联方式改变，需同时改政策、清单和问卷。

## 参考资料（2026-10-24 查阅）

- [Apple App privacy details](https://developer.apple.com/app-store/app-privacy-details/)：收集、类别、用途、关联身份、跟踪、Apple 框架与可选披露。
- [Apple 隐私政策](https://www.apple.com/legal/privacy/)；[Apple Maps & Privacy](https://www.apple.com/legal/privacy/data/en/apple-maps/)。
- [删除照片与最近删除](https://support.apple.com/en-us/104967)；[删除 App 与卸载 App 的数据区别](https://support.apple.com/en-us/108429)。

最后提交前，请以实际送审版本和已部署服务完成隐私核对；不能把本地源码版本当作线上事实。

## 2026-10-24 开发者补充

已确认 Cloudflare/腾讯云提供网络或基础设施支持，开发者不持久保存 IP/HTTP 访问日志，不出售数据、无源码外额外用途。不能据此改选“不收集数据”：自营使用统计、账户资料和主动报告仍按前文申报。送审版本尚未确定，需在构建确定后核对清单与标签。商店年龄分级与是否设产品最低年龄是两个不同事项；现有政策保留未成年人/监护人说明。
