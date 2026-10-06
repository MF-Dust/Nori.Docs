---
layout: home

hero:
  name: "Nori Desktop"
  text: "让 Nori 留在你的桌面上"
  tagline: "Live2D 桌面陪伴、AI 对话、语音、记忆、提醒与可扩展工具"
  image:
    src: /logo.png
    alt: Nori Logo
  actions:
    - theme: brand
      text: 开始使用
      link: /user-guide/
    - theme: alt
      text: 下载最新版
      link: https://github.com/MF-Dust/Nori.Desktop/releases/latest
    - theme: alt
      text: GitHub
      link: https://github.com/MF-Dust/Nori.Desktop

features:
  - title: Live2D 桌面陪伴
    details: "把角色留在桌面上，支持拖动、视线跟随、互动区域，以及受平台能力影响的透明区域点击穿透。"
  - title: AI 对话
    details: "连接常见云端模型服务，也可以使用本机或自建的兼容接口。"
  - title: 原生语音
    details: "让 Nori 朗读回复、接收麦克风输入，并根据实际播放声音同步 Live2D 嘴形。"
  - title: 提醒与长期记忆
    details: "创建提醒，管理 Nori 保存的长期记忆，并按需要导入或导出。"
  - title: 自定义 Live2D
    details: "从本地导入模型，在模型管理中调整大小、表情和互动。"
  - title: 技能、MCP 与插件
    details: "用技能和 MCP 扩展工具，也可以安装受信任的 .noripack 插件为 AI 增加动作。"
---

<div style="text-align: center; margin-top: 3rem; margin-bottom: 2rem;">
  <img src="/banner.png" alt="Nori Desktop Banner" style="width: 100%; max-width: 900px; border-radius: 12px; margin: 0 auto; box-shadow: 0 10px 30px rgba(0,0,0,0.5);" />
</div>

::: info 社区开源声明
本项目由社区同好维护，是非官方、非商业的开源项目，与官方团队或母公司没有商业关联或从属关系。
:::

## 欢迎来到 Nori 文档

第一次使用 Nori 时，从 **[快速上手](./user-guide/)** 开始就够了。文档会按实际使用顺序介绍下载、启动、桌面伴侣、AI 和语音配置；需要进一步调整时，再查看记忆、提醒、技能、MCP、插件和排障页面。

::: tip 当前稳定版
截至 2026 年 10 月 6 日，最新正式版本为 **v2.0.2-Kei**。Release 提供 Windows x64、Linux x64 和 macOS Apple Silicon 发布包。
:::

::: info 关于开发中的功能
Nori.Desktop 的主分支可能已经包含晚于当前正式版的功能。用户文档以正式发布内容为主；涉及尚未发布的主线能力时，会单独说明。
:::

## 第一次使用

1. **[下载与安装](./user-guide/environment-and-install.md)**：选择适合当前系统的发布包并完成首次启动。
2. **[桌面伴侣互动](./user-guide/desk-pet-interaction.md)**：移动 Nori、调整大小、切换模型，并了解当前平台的点击穿透能力。
3. **[连接 AI 模型](./user-guide/ai-configuration.md)**：填写模型服务信息，测试连接后开始聊天。
4. **[开启语音](./user-guide/voice-and-speech.md)**：配置朗读、麦克风输入和口型同步。

## 继续了解

- [提醒与长期记忆](./user-guide/memory-and-reminders.md)
- [技能与 MCP](./user-guide/skills-and-mcp.md)
- [安装与使用插件](./guide/plugin-system.md)
- [常见问题与排障](./user-guide/troubleshooting-and-faq.md)
- [跨平台支持](./operations/platform-matrix.md)
