# 下载与安装

这页会带你完成 Nori 的下载、解压和第一次启动。

::: tip 当前稳定版
截至 2026 年 10 月 6 日，最新正式版本为 **v2.0.2-Kei**。
:::

## 1. 下载 Nori

前往 [Nori.Desktop Releases](https://github.com/MF-Dust/Nori.Desktop/releases/latest)，根据设备选择发布包：

| 你的设备 | 下载文件 |
| :--- | :--- |
| **Windows x64** | `nori-2.0.2-Kei-win-x64-framework-dependent.zip` |
| **Linux x64** | `nori-2.0.2-Kei-linux-x64.tar.gz` |
| **macOS Apple Silicon** | `nori-2.0.2-Kei-osx-arm64.zip` |

Windows x64 是目前最主要的验收平台。Linux 和 macOS 可以使用正式包，但部分桌面交互会受到桌面环境和系统权限影响。

## 2. 安装运行环境

当前正式包采用 framework-dependent 分发，因此系统需要安装 **.NET Runtime 10**。

### Windows x64

需要：

- Windows 10 或 Windows 11 x64
- .NET Runtime 10

2.x 的用户界面已经使用 Avalonia 原生窗口，不再要求 WebView2 作为 Nori 主界面的运行依赖。

### Linux x64

需要：

- .NET Runtime 10
- GTK 3
- ALSA 运行库
- 可用的 OpenGL 驱动

在 Ubuntu 24.04 及较新的环境中，ALSA 包通常是 `libasound2t64`；较旧发行版常见为 `libasound2`。

### macOS Apple Silicon

需要：

- Apple Silicon Mac
- .NET Runtime 10

使用麦克风时，macOS 会按系统规则请求麦克风权限。

## 3. 解压并启动

下载完成后，把整个压缩包解压到固定目录，不要直接在压缩包中运行。

### Windows

1. 把 ZIP 解压到你有写入权限的位置，例如 `D:\Apps\Nori`。
2. 打开解压后的 Nori 文件夹。
3. 双击最外层的 **`Nori.exe`**。

### Linux

解压整个 `tar.gz`，然后从 Nori 根目录启动最外层的 **`Nori`**。

### macOS

解压 ZIP 后，启动最外层的 **`Nori.app`**。

::: important 从最外层入口启动
发布包中还会看到 `.current` 和 `app-*` 等内部版本文件。日常使用时不需要进入这些目录，也不要单独移动内部版本目录。
:::

## 4. 完成第一次设置

首次运行时会出现初始化向导：

<UiWizardPreview />

跟随向导完成语言和基础设置即可。AI 服务可以当场配置，也可以先跳过，之后再从设置中补上。

完成后，Nori 会进入桌面伴侣状态，其他功能窗口可以按需要打开。

## 数据保存在哪里

当前版本把运行数据统一保存在 Nori 根目录下的 `data` 文件夹：

```text
Nori/
├── Nori.exe 或 Nori
├── ...
└── data/
```

设置、数据库、本地模型、插件和日志都会从这里管理。移动或备份 Nori 时，保留整个根目录最省心。

::: warning 选择可写目录
Nori 会在程序目录旁写入 `data`。不要把它放在普通用户没有写入权限的受保护目录中。
:::

## 从较老版本升级

2.x 的数据布局已经统一到包根目录。升级前保留旧版数据备份；如果升级后发现历史数据没有出现，不要先删除旧目录，可以结合 [诊断与日志](../operations/diagnostics.md) 继续确认。

## 可选：校验下载文件

Release 页面同时提供对应的 `.sha256` 文件。下载过程异常，或者想确认文件是否完整时，可以核对 SHA-256。
