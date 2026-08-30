---
layout: home

hero:
  name: "Nori Desktop Pet"
  text: "Live2D 桌面智能伴侣"
  tagline: "当前稳定版 v1.3.0-Serika · Windows x64 为主要验收平台，同时提供 Linux x64 与 macOS Apple Silicon 发布包"
  image:
    src: /logo.png
    alt: Nori Logo
  actions:
    - theme: brand
      text: 用户操作手册
      link: /user-guide/
    - theme: alt
      text: 下载最新版
      link: https://github.com/MF-Dust/Nori.Desktop/releases/latest
    - theme: alt
      text: GitHub 源码
      link: https://github.com/MF-Dust/Nori.Desktop

features:
  - title: Live2D 桌面陪伴
    details: "支持模型拖动、视线跟随、触摸反馈与透明区域点击穿透，在桌面上保持自然的陪伴感。"
  - title: 多模型 AI 对话
    details: "可连接 OpenAI 兼容接口、Claude、Gemini 与本地 Ollama 等服务，按自己的需求选择模型。"
  - title: 语音与实时口型
    details: "支持 TTS 朗读、麦克风语音输入，并根据实际播放音量驱动 Live2D 嘴形。"
  - title: 提醒与长期记忆
    details: "可以通过自然语言创建提醒，也可以查看、修改和删除 Nori 保存的长期记忆。"
  - title: 本地模型管理
    details: "支持本地 Live2D 模型与 ZIP 导入，模型文件由本机管理，不依赖远程模型下载服务。"
  - title: MCP 与插件扩展
    details: "支持 MCP 外部工具与 NPS 2.0 本地插件，插件还可以向对话界面提供自己的交互卡片。"
  - title: 安全模式与诊断
    details: "遇到启动或配置问题时可使用安全模式，并可导出经过脱敏处理的诊断信息。"
  - title: 可移动的数据目录
    details: "正式版数据保存在 Nori 程序包根目录的 data 文件夹中，移动整套目录即可连同数据一起迁移。"
---

<div style="text-align: center; margin-top: 3rem; margin-bottom: 2rem;">
  <img src="/banner.png" alt="Nori Desktop Pet Banner" style="width: 100%; max-width: 900px; border-radius: 12px; margin: 0 auto; box-shadow: 0 10px 30px rgba(0,0,0,0.5);" />
</div>

## 关于这份文档

Nori 的开发节奏比较快，这里只记录当前已经落地、用户可以实际使用的功能。涉及平台支持时，也会区分“已经提供发布包”和“已经完成完整桌面环境验收”这两种状态。

::: tip 当前稳定版
截至 2026 年 8 月 30 日，最新正式 Release 为 **v1.3.0-Serika**。之后主分支仍有持续开发，因此源码中的新功能可能会早于下一次正式发布出现。
:::
