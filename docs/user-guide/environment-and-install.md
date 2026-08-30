# 下载与安装

本教程会带你完成 Nori 的下载、解压和第一次启动。第一次使用时按顺序操作即可。

::: tip 当前稳定版
截至 2026 年 8 月 30 日，最新正式版本为 **v1.3.0-Serika**。
:::

## 1. 下载 Nori

前往 [Nori.Desktop Releases](https://github.com/MF-Dust/Nori.Desktop/releases/latest)，根据当前设备选择发布包：

| 你的设备 | 下载这个文件 |
| :--- | :--- |
| **Windows x64** | `nori-1.3.0-Serika-win-x64-framework-dependent.zip` |
| **Linux x64** | `nori-1.3.0-Serika-linux-x64.tar.gz` |
| **macOS Apple Silicon** | `nori-1.3.0-Serika-osx-arm64.zip` |

Windows x64 是目前主要的完整验收平台。Linux 和 macOS 已经提供正式发布包，部分桌面交互在不同系统环境下会有差异。

## 2. 安装运行环境

Nori 的正式发布包需要系统先安装对应的 .NET 运行环境。

### Windows x64

需要：

- **ASP.NET Core Runtime 10 x64**
- **Microsoft Edge WebView2 Evergreen Runtime**

Windows 10/11 通常已经带有 WebView2。只有在启动时提示缺失时，才需要另外安装。

### Linux x64

需要：

- **ASP.NET Core Runtime 10**
- **WebKitGTK 4.1**
- GTK 与可用的 OpenGL 驱动

### macOS Apple Silicon

需要：

- **ASP.NET Core Runtime 10**
- 系统自带 WebKit

::: details 为什么还需要安装运行环境？
当前 Release 为 framework-dependent 发布包，因此不会把完整 .NET 运行时一起打进压缩包。这里安装一次运行环境即可，平时使用 Nori 不需要处理这些内部细节。
:::

## 3. 解压并启动

下载完成后，请把压缩包完整解压到一个固定目录，不要直接在压缩包里运行。

### Windows

1. 把 ZIP 解压到你有写入权限的位置，例如 `D:\Apps\Nori`。
2. 打开解压后的 Nori 文件夹。
3. 双击最外层的 **`Nori.exe`**。

### Linux

解压整个 `tar.gz`，然后从 Nori 根目录启动最外层的 **`Nori`**。

### macOS

解压 ZIP 后，启动最外层的 **`Nori.app`**。

::: important 请从最外层启动 Nori
解压目录中还会看到内部版本文件。日常使用时只需要启动最外层的 `Nori.exe`、`Nori` 或 `Nori.app`，也不要只移动其中某个内部文件夹。
:::

## 4. 完成第一次设置

首次运行时会出现初始化向导：

<UiWizardPreview />

跟随向导完成语言和基础设置即可。AI 服务可以当场配置，也可以先跳过，之后再到设置中完成。

初始化结束后，主控制台会打开，桌面上也会显示 Live2D 角色。

🎉 到这里，Nori 已经安装完成。接下来可以继续看看 **[和桌宠互动](./desk-pet-interaction.md)**。

## Nori 的数据保存在哪里

Nori 会把设置、聊天、记忆、本地模型、插件和日志保存在程序根目录的 `data` 文件夹中。

```text
Nori/
├── Nori.exe 或 Nori
├── ...
└── data/
```

因此移动 Nori 时，保留整个文件夹最省心；更新程序时，也请保留原来的 `data` 文件夹。

::: warning 选择一个可以正常写入的目录
因为 Nori 的数据就在程序目录旁边，不建议把它放在普通用户无法写入的位置，例如受系统保护的程序目录。
:::

### 从旧版本升级

旧版 Nori 曾把数据放在系统用户目录。当前版本首次启动时会尝试迁移旧数据，之后以程序根目录的 `data` 文件夹为准。

## 可选：校验下载文件

Release 页面还会提供对应的 `.sha256` 文件。如果下载过程异常，或者想确认压缩包是否完整，可以用它核对文件的 SHA-256 值。
