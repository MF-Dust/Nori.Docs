# 环境准备与安装运行

本章节介绍在 Windows 电脑上从零开始准备依赖环境、下载解压并完成 Nori 首次运行初始化的全过程。

---

## 1. 系统要求与运行前置依赖

Nori 采用轻量化分发模式，发布包不强制捆绑庞大的运行库。首次使用前，请确保电脑已安装以下两个微软官方运行环境。

### 系统要求
- **操作系统**：Windows 10 64 位（版本 1909 或更高）或 Windows 11 64 位。
- **处理器与内存**：支持 x64 架构的处理器，推荐 4GB 及以上内存。
- **显卡与驱动**：支持 OpenGL 2.0 及以上的集成或独立显卡。

---

## 2. 核心依赖下载与安装步骤

### 第一步：安装 .NET 10 桌面运行时（必需）

1. 前往微软官方下载页面：[Microsoft .NET 10.0 运行时下载](https://dotnet.microsoft.com/download/dotnet/10.0)。
2. 在 **“运行桌面应用 (Run desktop apps)”** 栏目下，找到 **.NET Desktop Runtime 10.0.x**。
3. 点击下载 **`x64`** 版本安装包（例如 `windowsdesktop-runtime-10.0.x-win-x64.exe`）。
4. 双击运行安装包，按照提示完成安装。

::: warning 注意事项
请务必选择 **Desktop Runtime (桌面运行时)** 的 **x64** 版本，而非单纯的 SDK、ARM64 版本或仅含 ASP.NET 的服务器版本。
:::

### 第二步：检查 WebView2 运行时（通常系统已内置）

Nori 的主控制台采用现代网页技术渲染，依赖 Microsoft Edge WebView2 运行时：
- **Windows 11 及更新后的 Windows 10**：系统默认已经预装该组件，无需额外操作。
- **如果启动时提示缺失 WebView2**：可前往微软官网下载安装：[Microsoft Edge WebView2 官方下载](https://developer.microsoft.com/microsoft-edge/webview2/)，选择“Evergreen 独立安装程序 (x64)”。

---

## 3. 下载、解压与运行

1. 下载最新的发布包文件：`Nori-Desktop-Pet-win-x64.zip`。
2. 将压缩包解压至电脑中任意有写入权限的目录（例如 `D:\Software\NoriPet` 或 `C:\Users\你的用户名\NoriPet`）。
   - **建议**：避免解压在需要管理员权限的 `C:\Program Files` 目录下，以防本地数据写入权限受限。
3. 进入解压后的文件夹，双击运行 **`Nori.Desktop.exe`**。

---

## 4. 首次运行向导（5 步配置）

首次启动时，程序会自动弹出半透明的初始化向导窗口：

<UiWizardPreview />

向导完成后，向导窗口自动销毁，你的屏幕上将出现透明无边框的 Nori 桌宠形象，并在屏幕右下角任务栏托盘中生成运行图标。

---

## 5. 认识程序运行结构与数据目录

Nori 启动后包含两个主要视图和一个托盘入口：

1. **桌面 Live2D 桌宠**：半透明悬浮在屏幕上方，随时陪伴你办公或娱乐。
2. **主控制台**：管理中心，双击右下角任务栏托盘图标即可打开或隐藏，用于聊天、调整模型与系统设置。
3. **本地数据存储目录**：
   - 配置文件、本地聊天记录与记忆库保存在：`%APPDATA%\cn.erhio.noriDesktopPet\data`（即 `C:\Users\你的用户名\AppData\Roaming\cn.erhio.noriDesktopPet\data`）。
   - 重装或升级程序时，只要保留该目录，所有历史聊天与配置均不会丢失。
