# 从源码运行 Nori

这一页面向想体验最新开发版本、参与测试或进行二次开发的用户。只想正常使用 Nori 时，直接看 [下载与安装](../user-guide/environment-and-install.md) 会轻松得多。

## 准备开发环境

桌面端源码位于 [MF-Dust/Nori.Desktop](https://github.com/MF-Dust/Nori.Desktop) 的 `app/desktop/` 目录。

开发环境需要：

- .NET 10 SDK
- Node.js 24 或更高版本
- pnpm

Linux 还需要 GTK 与 ALSA 运行库，并准备可用的 OpenGL 驱动。

## 安装依赖并检查项目

进入 `app/desktop/` 后运行：

```bash
pnpm install
pnpm check:todo
pnpm build
pnpm test

dotnet build Nori.slnx
dotnet test Nori.slnx
```

当前前端资源已经收敛为原生界面的主题令牌与检查脚本，不需要再启动旧式 WebView 前端开发服务器。

## 启动桌面端

```bash
dotnet run --project Nori.Desktop
```

如果要排查启动问题，也可以带上安全模式：

```bash
dotnet run --project Nori.Desktop -- --safe-mode
```

## 正式版和源码运行有什么不同

正式发布包使用最外层的 `Nori` 启动入口管理当前可运行版本，并把运行数据统一放在包根目录的 `data` 中。

普通用户只需要从最外层入口启动。开发时才直接运行 `Nori.Desktop` 项目。

::: details 正式包里的内部目录
`.current` 和 `app-*` 用于版本选择与更新。日常使用时不需要手动修改。
:::

## 当前平台边界

- Windows x64 是主要验收平台。
- Linux x64 与 macOS Apple Silicon 已提供正式 Release。
- Linux Wayland 的全局鼠标位置和透明区域点击穿透受到协议限制。
- 当前没有 Linux arm64 与 macOS Intel 正式发布包。
