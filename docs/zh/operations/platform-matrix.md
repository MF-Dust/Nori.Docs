# 跨平台支持与能力差异

Nori 当前提供 Windows、Linux 和 macOS 正式发布包。核心功能共用同一套 .NET 10 + Avalonia 宿主，但桌面窗口、托盘、鼠标和音频能力会受到操作系统限制。

## 当前发布状态

| 平台 | 正式发布包 | 当前建议 |
| :--- | :---: | :--- |
| **Windows x64** | ✅ | 主要验收平台，桌面能力覆盖最完整 |
| **Linux x64** | ✅ | 可以使用正式包，X11 与 Wayland 行为会有差异 |
| **macOS Apple Silicon** | ✅ | 可以使用 arm64 正式包，麦克风等功能受系统权限管理 |

截至 2026 年 10 月 6 日，最新稳定版为 **v2.0.2-Kei**。

## 常见能力差异

| 功能 | Windows x64 | Linux X11 | Linux Wayland | macOS Apple Silicon |
| :--- | :---: | :---: | :---: | :---: |
| Live2D 伴侣视窗 | ✅ | ✅ | ✅ | ✅ |
| 原生用户界面 | ✅ | ✅ | ✅ | ✅ |
| 伴侣窗口置顶 | ✅ | ✅ | ✅ | ✅ |
| 透明区域点击穿透 | ✅ | ✅ | 有限制 | ✅ |
| 全局鼠标视线跟随 | ✅ | ✅ | 有限制 | ✅ |
| 系统托盘 | ✅ | 取决于桌面环境 | 取决于桌面环境 | ✅ |
| 音频播放/录音 | WASAPI | ALSA | ALSA | AudioQueue |
| 浏览器自动化 | ✅，需要 Edge | 暂不支持 | 暂不支持 | 暂不支持 |

## Linux 用户需要注意什么

### X11

X11 可以提供全局鼠标和窗口输入区域，因此点击穿透、视线跟随等桌面伴侣功能通常更完整。

### Wayland

Wayland 对全局输入和窗口输入区域限制更严格。Nori 会根据能力自动降级，例如：

- 伴侣视窗可能保持整窗可点击。
- 视线跟随可能只在窗口范围内工作。
- 部分拖动行为会交给桌面环境处理。

这些限制不会阻止 Live2D 正常渲染。

## 系统托盘

Windows 和 macOS 通常可以直接使用托盘。

Linux 是否显示托盘取决于桌面环境和 StatusNotifier 支持。托盘不可用时，不会影响 Nori 本身启动。

## 运行时要求

三平台正式包都是 framework-dependent 发布，需要 **.NET Runtime 10**。

额外需要：

- Windows：Windows 10/11 x64
- Linux：GTK 3、`libasound2t64` 或 `libasound2`、可用 OpenGL 驱动
- macOS：Apple Silicon；麦克风功能需要系统授权

2.x 原生界面不再要求 WebView2 或 WebKitGTK 作为主界面运行依赖。

## 当前没有正式发布的架构

当前 Release 没有 Linux arm64，也没有 macOS Intel 正式资产。源码可能可以继续适配其他架构，但文档不会把“理论可编译”写成“已有正式支持”。
