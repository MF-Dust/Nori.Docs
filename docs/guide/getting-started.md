# 从源码运行 Nori

这一页面向想体验最新开发版本、参与测试或进行二次开发的用户。

::: tip 只想正常使用 Nori？
直接查看 [下载与安装](../user-guide/environment-and-install.md) 会更省事。正式 Release 已经提供 Windows x64、Linux x64 和 macOS Apple Silicon 发布包。
:::

## 准备开发环境

桌面端源码位于 [MF-Dust/Nori.Desktop](https://github.com/MF-Dust/Nori.Desktop) 的 `app/desktop/` 目录。

开发环境需要：

- .NET 10 SDK
- Node.js
- pnpm

不同系统仍需要对应的桌面运行依赖，例如 Windows WebView2 或 Linux WebKitGTK 4.1。

## 安装依赖并检查项目

进入 `app/desktop/` 后，可以先运行：

```bash
pnpm install
pnpm build
pnpm test

dotnet build Nori.slnx
dotnet test Nori.slnx
```

## 启动桌面端

正常启动：

```bash
dotnet run --project Nori.Desktop
```

需要前端热更新时，先运行：

```bash
pnpm dev
```

然后在另一个终端启动开发模式。

Linux / macOS：

```bash
NORI_DEV=1 dotnet run --project Nori.Desktop
```

Windows PowerShell：

```powershell
$env:NORI_DEV = "1"
dotnet run --project Nori.Desktop
```

## 正式版和源码运行有什么不同

正式 Release 会使用最外层的 `Nori` 启动入口管理当前可运行版本，并把用户数据统一保存在程序根目录的 `data` 文件夹中。

普通用户只需要记住从最外层启动；开发时才需要直接运行 `Nori.Desktop` 项目。

::: details 正式包的内部版本目录
正式包中会看到 `.current` 和 `app-*` 等内部文件或目录。它们用于启动入口选择当前版本，日常使用时无需手动修改。
:::

## 安全模式

排查插件、模型或外部服务引起的启动问题时，可以给正式版启动入口加上：

```text
--safe-mode
```

例如 Windows：

```powershell
.\Nori.exe --safe-mode
```

安全模式会跳过部分外部服务和自动加载项，同时保留设置、插件管理和诊断能力。

## 当前平台边界

- Windows x64 是主要验收平台。
- Linux x64 与 macOS Apple Silicon 已有正式 Release。
- Linux Wayland 的全局鼠标与点击穿透能力受到系统协议限制。
- 当前没有 Linux arm64 与 macOS Intel 正式发布包。
