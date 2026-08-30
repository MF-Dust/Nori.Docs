# 环境准备与安装运行

这一页介绍如何下载、解压并启动 Nori，以及最新版正式发布包需要的运行环境。

## 1. 选择适合你的发布包

截至 2026 年 8 月 30 日，最新稳定版是 **v1.3.0-Serika**。GitHub Release 当前提供三种平台包：

| 平台 | 发布文件 | 当前说明 |
| :--- | :--- | :--- |
| **Windows x64** | `nori-1.3.0-Serika-win-x64-framework-dependent.zip` | 主要验收与推荐平台 |
| **Linux x64** | `nori-1.3.0-Serika-linux-x64.tar.gz` | 已提供正式发布包，桌面环境能力存在差异 |
| **macOS Apple Silicon** | `nori-1.3.0-Serika-osx-arm64.zip` | 已提供正式发布包 |

可以从 [Nori.Desktop Releases](https://github.com/MF-Dust/Nori.Desktop/releases/latest) 获取最新版。

::: warning 下载时请注意
当前发布包是 **framework-dependent** 版本，包内不会附带完整 .NET 运行时。第一次使用前需要安装系统运行环境。
:::

## 2. 运行环境

### Windows x64

需要：

- **ASP.NET Core Runtime 10 x64**
- **Microsoft Edge WebView2 Evergreen Runtime**

Windows 10/11 通常已经带有 WebView2。如果启动时提示 WebView2 缺失，再从微软官方页面安装即可。

::: tip 为什么是 ASP.NET Core Runtime 10
Nori 的本地界面资源和音频传输会使用内置的本机服务，因此正式发布包需要 ASP.NET Core Runtime 10。旧文档中写成“.NET Desktop Runtime 10”已经不符合当前发布结构。
:::

### Linux x64

需要：

- ASP.NET Core Runtime 10
- WebKitGTK 4.1
- GTK 与可用的 OpenGL 驱动

Linux 的托盘、全局鼠标和点击穿透效果会受 X11、Wayland 以及桌面环境影响，详情见 [跨平台支持与能力降级](../operations/platform-matrix.md)。

### macOS Apple Silicon

需要：

- ASP.NET Core Runtime 10
- 系统自带 WebKit

当前 Release 提供的是 **Apple Silicon / arm64** 包。

## 3. 解压与启动

Nori 现在采用完整程序根目录分发。解压后请保留整个目录结构，不要只拿其中某个可执行文件出来运行。

### Windows

1. 将 ZIP 解压到一个你有写入权限的目录，例如 `D:\Apps\Nori`。
2. 打开解压后的根目录。
3. 运行最外层的 **`Nori.exe`**。

### Linux

解压整个 tar.gz 后，从根目录运行 **`Nori`**。

### macOS

解压后从最外层启动 **`Nori.app`**。

::: warning 不要直接运行内部版本目录
发布包内部会包含 `.current` 和 `app-*` 等文件或目录，它们用于 Nori 选择当前可运行版本。日常启动只使用最外层的 `Nori` 入口即可。
:::

## 4. 第一次启动

首次运行时会出现初始化向导：

<UiWizardPreview />

可以在向导中完成语言、模型和 AI 服务等基础设置。AI 配置可以暂时跳过，稍后再到主控制台中填写。

初始化完成后，Nori 会进入主控制台并显示桌面 Live2D 角色。

## 5. 数据保存在哪里

当前正式版会把运行数据放在 **Nori 程序根目录下的 `data` 文件夹**：

```text
Nori/
├── Nori.exe 或 Nori
├── .current
├── app-*/
└── data/
```

聊天、设置、记忆、本地模型、插件和日志都会放在这套数据目录中对应的位置。

这意味着：

- 把整套 Nori 文件夹移动到另一处时，数据也会跟着移动。
- 更新程序时请保留现有的 `data` 文件夹。
- 不建议把 Nori 解压到 `Program Files` 等普通用户无法直接写入的目录。

### 从旧版本升级

旧版 Nori 曾使用系统用户目录保存数据，例如 Windows 的 `%APPDATA%\cn.erhio.noriDesktopPet\data`。当前版本会在首次启动时尝试迁移旧数据。迁移完成后，新数据以程序根目录的 `data` 文件夹为准。

## 6. 校验下载文件

正式 Release 同时提供对应的 `.sha256` 文件。需要确认下载是否完整时，可以使用它核对压缩包的 SHA-256 值。
