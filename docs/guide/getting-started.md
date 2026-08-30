# 快速开始与源码运行

这一页适合想体验最新版源码、参与测试或进行二次开发的用户。只想正常使用 Nori 时，直接查看 [环境准备与安装运行](../user-guide/environment-and-install.md) 会更省事。

## 正式版下载

截至 2026 年 8 月 30 日，最新稳定版为 **v1.3.0-Serika**。

GitHub Release 已提供：

- Windows x64 ZIP
- Linux x64 tar.gz
- macOS Apple Silicon ZIP

三平台发布包都采用 framework-dependent 方式，因此需要系统安装 **ASP.NET Core Runtime 10**。Windows 还需要 WebView2，Linux 需要 WebKitGTK 4.1。

## 从源码运行

项目源码位于 [MF-Dust/Nori.Desktop](https://github.com/MF-Dust/Nori.Desktop)。桌面端工作目录是：

```text
app/desktop/
```

准备好 .NET 10 SDK、Node.js 与 pnpm 后，可以执行：

```bash
pnpm install
pnpm build
pnpm test

dotnet build Nori.slnx
dotnet test Nori.slnx
```

正常启动宿主：

```bash
dotnet run --project Nori.Desktop
```

需要前端热更新时，可以先运行：

```bash
pnpm dev
```

然后在另一个终端使用开发模式启动宿主：

```bash
NORI_DEV=1 dotnet run --project Nori.Desktop
```

Windows PowerShell 可以使用：

```powershell
$env:NORI_DEV = "1"
dotnet run --project Nori.Desktop
```

## 正式发布包的目录结构

正式版会使用一个最外层启动入口管理当前可运行版本。对普通使用者来说，只需要记住两件事：

1. 启动最外层的 `Nori.exe`、`Nori` 或 `Nori.app`。
2. 保留整个解压目录，不要单独移动内部 `app-*` 文件夹。

程序运行数据统一保存在：

```text
<PackageRoot>/data/
```

这个目录不会包含在新下载的 Release 压缩包中，因此升级或移动程序时要保留现有 `data`。

## 安全模式

遇到插件、模型或外部服务导致的启动问题时，可以加上：

```text
--safe-mode
```

例如 Windows：

```powershell
.\Nori.exe --safe-mode
```

安全模式会暂时跳过部分外部服务和自动加载项，同时保留主界面、设置与诊断能力，方便修复配置。

## 当前发布边界

- Windows x64 是主要验收平台。
- Linux x64 和 macOS Apple Silicon 已有正式 Release 资产。
- Linux Wayland 的全局鼠标与点击穿透能力受系统协议限制。
- 当前没有 Linux arm64 与 macOS Intel 正式发布包。
- Nori 不随 Release 提供远程 Live2D 模型下载服务，本地模型需要自行导入。
