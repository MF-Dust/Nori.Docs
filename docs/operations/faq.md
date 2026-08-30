# 常见问题与故障排查

这页补充一些更具体的排障场景。日常问题也可以先看 [用户手册中的常见问题](../user-guide/troubleshooting-and-faq.md)。

## Nori 双击后没有窗口

Windows 正式版应运行解压目录最外层的：

```text
Nori.exe
```

当前正式包需要 **ASP.NET Core Runtime 10 x64** 与 **Microsoft Edge WebView2 Evergreen Runtime**。

新版发布包内部还会包含 `.current` 与 `app-*` 等版本文件。它们由最外层启动入口管理，不需要手动进入内部目录运行 `Nori.Desktop.exe`。

## 启动后一直停在加载界面

可以先用安全模式启动：

```powershell
.\Nori.exe --safe-mode
```

进入主控制台后检查最近修改过的 AI、语音、MCP、插件或模型设置。安全模式会暂时避开大部分外部服务和第三方插件，适合判断问题是否来自这些功能。

## 桌宠不能点击穿透

Windows 当前主分支已经恢复模型区域与透明区域的点击穿透逻辑。

Linux 上需要区分显示环境：

- X11 可以使用输入形状实现点击穿透。
- Wayland 受协议能力限制，可能退化为整窗可点击。

macOS 也会采用系统对应的鼠标忽略机制。详情见 [跨平台支持与能力差异](./platform-matrix.md)。

## 导入 Live2D 模型后无法显示

可以检查模型目录是否包含有效的 `*.model3.json`、对应的 `.moc3` 与纹理文件。

更推荐从 Nori 的模型管理页面使用“导入本地模型”，让程序自行完成路径与文件结构检查。当前 Nori 不提供远程模型下载或在线模型市场。

## AI 对话提示网络或认证错误

先到 **设置 → AI** 使用连接测试。

常见原因包括：

- API Key 无效或已经失效
- Base URL 填写错误
- 当前模型名在服务商侧不可用
- 本地 Ollama 等服务没有启动
- 网络或代理环境无法连接目标服务

当前开发分支已经加入一个可选设置，允许“公开网页类请求”在需要时跟随系统代理；默认仍保持关闭。这个选项主要影响网页获取、搜索和天气等公共网络能力，不会改变本地地址与敏感网络目标的安全限制。

## 收到回复但没有语音

当前 TTS 支持 OpenAI、Gemini、MiniMax、自定义 HTTP 与 GPT-SoVITS；语音识别使用 Whisper 接口。

可以检查：

- 自动朗读是否开启
- 当前 TTS 服务地址、模型、音色与 API Key 是否完整
- 主音量是否为 0
- 主控制台是否仍在运行

旧版的浏览器 Web Speech / Edge TTS 路径已经停用，旧配置会提示迁移到当前语音提供商。

## 数据应该备份哪里

当前正式版的新数据统一位于：

```text
<Nori 程序根目录>/data/
```

旧版 Windows 的 `%APPDATA%\cn.erhio.noriDesktopPet\data`、macOS Application Support 目录以及 Linux XDG 数据目录现在只作为历史数据迁移来源。

更新或搬家时保留整个 `data` 文件夹即可。为了避免漏掉启动入口和版本信息，直接保留整套 Nori 根目录会更省事。

## 跨系统迁移后 API Key 为什么需要重填

当前敏感配置使用 `nsec2:` AES-256-GCM 格式，并由各平台自己的安全存储保护主密钥。

旧 Windows 版本还可能存在 `enc:dpapi:` 密文。此类旧密钥无法直接在 macOS 或 Linux 上解密时，Nori 会要求重新填写对应凭据；聊天、记忆等普通数据不会因此被清空。

## 怎样提交 Bug

在主控制台导出脱敏诊断信息后，可以前往 [Nori.Desktop Issues](https://github.com/MF-Dust/Nori.Desktop/issues) 提交问题。

诊断包不会按常规流程包含聊天正文、长期记忆正文、提示词、录音、API Key 或数据库文件。
