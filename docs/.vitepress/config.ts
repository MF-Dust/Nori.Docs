import { defineConfig } from 'vitepress'
import {
  groupIconMdPlugin,
  groupIconVitePlugin,
  localIconLoader
} from 'vitepress-plugin-group-icons'

const userGuideSidebar = [
  {
    text: '用户操作手册',
    collapsed: false,
    items: [
      { text: '手册总览与快速导航', link: '/user-guide/' },
      {
        text: '环境准备与安装运行',
        link: '/user-guide/environment-and-install'
      },
      { text: '桌宠交互与外观调节', link: '/user-guide/desk-pet-interaction' },
      { text: 'AI 大模型接入配置', link: '/user-guide/ai-configuration' },
      { text: '语音交互与口型同步', link: '/user-guide/voice-and-speech' },
      { text: '生活提醒与长期记忆', link: '/user-guide/memory-and-reminders' },
      { text: '技能与 MCP 工具集成', link: '/user-guide/skills-and-mcp' },
      {
        text: '常见问题与安全排障',
        link: '/user-guide/troubleshooting-and-faq'
      }
    ]
  }
]

const technicalSidebar = [
  {
    text: '用户操作手册',
    collapsed: false,
    items: [
      { text: '手册总览与快速导航', link: '/user-guide/' },
      {
        text: '环境准备与安装运行',
        link: '/user-guide/environment-and-install'
      },
      { text: '桌宠交互与外观调节', link: '/user-guide/desk-pet-interaction' },
      { text: 'AI 大模型接入配置', link: '/user-guide/ai-configuration' },
      { text: '语音交互与口型同步', link: '/user-guide/voice-and-speech' },
      { text: '生活提醒与长期记忆', link: '/user-guide/memory-and-reminders' },
      { text: '技能与 MCP 工具集成', link: '/user-guide/skills-and-mcp' },
      {
        text: '常见问题与安全排障',
        link: '/user-guide/troubleshooting-and-faq'
      }
    ]
  },
  {
    text: '进阶架构与功能指南',
    collapsed: false,
    items: [
      { text: '快速开始（环境与编译）', link: '/guide/getting-started' },
      { text: '界面与四窗口架构', link: '/guide/ui-and-windows' },
      { text: 'Live2D 桌宠与模型管理', link: '/guide/live2d-models' },
      { text: 'AI 对话与 Agent 配置', link: '/guide/ai-chat-agent' },
      { text: 'Living Memory 长期记忆', link: '/guide/memory-system' },
      { text: '语音交互与口型同步', link: '/guide/voice-system' },
      { text: '技能扩展与定时提醒', link: '/guide/skills-reminders' },
      { text: 'MCP 协议扩展集成', link: '/guide/mcp-integration' },
      { text: '浏览器与桌面自动化', link: '/guide/automation' },
      { text: '插件系统 (NPS 2.0)', link: '/guide/plugin-system' }
    ]
  },
  {
    text: '运维与排障',
    collapsed: false,
    items: [
      { text: '安全模式 (--safe-mode)', link: '/operations/safe-mode' },
      { text: '脱敏诊断与日志导出', link: '/operations/diagnostics' },
      { text: '跨平台矩阵与能力降级', link: '/operations/platform-matrix' },
      { text: '常见问题与排障 (FAQ)', link: '/operations/faq' }
    ]
  },
  {
    text: '技术参考与规范',
    collapsed: false,
    items: [
      { text: '系统架构与桥接协议', link: '/reference/architecture' },
      { text: '安全存储与加密规范', link: '/reference/security-spec' }
    ]
  }
]

export default defineConfig({
  title: 'Nori Desktop Pet',
  description:
    '基于 .NET 10 + Avalonia 12 原生宿主与 Vue 3 + UnoCSS 架构的高性能 Live2D 桌面智能伴侣',

  lastUpdated: true,
  cleanUrls: true,

  markdown: {
    math: true,
    config(md) {
      md.use(groupIconMdPlugin)
    }
  },

  head: [
    ['link', { rel: 'icon', type: 'image/png', href: '/logo.png' }],
    ['meta', { name: 'theme-color', content: '#1fe0ba' }]
  ],

  themeConfig: {
    logo: { src: '/logo.png', width: 24, height: 24 },

    nav: [
      { text: '首页', link: '/' },
      {
        text: '用户操作手册',
        items: [
          { text: '手册总览', link: '/user-guide/' },
          {
            text: '环境准备与安装',
            link: '/user-guide/environment-and-install'
          },
          { text: '桌宠交互与外观', link: '/user-guide/desk-pet-interaction' },
          { text: 'AI 大模型接入', link: '/user-guide/ai-configuration' },
          { text: '语音与口型同步', link: '/user-guide/voice-and-speech' },
          { text: '提醒与长期记忆', link: '/user-guide/memory-and-reminders' },
          { text: '技能与 MCP 集成', link: '/user-guide/skills-and-mcp' },
          {
            text: '常见问题与排障',
            link: '/user-guide/troubleshooting-and-faq'
          }
        ]
      },
      {
        text: '进阶与开发指南',
        items: [
          { text: '快速开始（源码构建）', link: '/guide/getting-started' },
          { text: '四窗口架构', link: '/guide/ui-and-windows' },
          { text: 'Live2D 渲染引擎', link: '/guide/live2d-models' },
          { text: 'AI 对话与 Agent', link: '/guide/ai-chat-agent' },
          { text: 'Living Memory 记忆库', link: '/guide/memory-system' },
          { text: '全链路语音交互', link: '/guide/voice-system' },
          { text: '技能与定时提醒', link: '/guide/skills-reminders' },
          { text: 'MCP 协议扩展', link: '/guide/mcp-integration' },
          { text: '自动化与审计', link: '/guide/automation' },
          { text: '插件系统 NPS 2.0', link: '/guide/plugin-system' }
        ]
      },
      {
        text: '运维与排障',
        items: [
          { text: '安全排障模式', link: '/operations/safe-mode' },
          { text: '脱敏诊断与日志', link: '/operations/diagnostics' },
          { text: '跨平台矩阵与降级', link: '/operations/platform-matrix' },
          { text: '常见问题 (FAQ)', link: '/operations/faq' }
        ]
      },
      {
        text: '技术参考',
        items: [
          { text: '系统架构与通信桥接', link: '/reference/architecture' },
          { text: '安全存储与加密规范', link: '/reference/security-spec' }
        ]
      },
      {
        text: '相关链接',
        items: [
          {
            text: 'Steam 商店页',
            link: 'https://store.steampowered.com/app/4996280/I_NORI/'
          },
          {
            text: 'DeepWiki 知识库',
            link: 'https://deepwiki.ai/MF-Dust/Nori-Desktop-Pet'
          }
        ]
      }
    ],

    sidebar: {
      '/user-guide/': userGuideSidebar,
      '/zh/user-guide/': userGuideSidebar,
      '/guide/': technicalSidebar,
      '/operations/': technicalSidebar,
      '/reference/': technicalSidebar,
      '/zh/guide/': technicalSidebar,
      '/zh/operations/': technicalSidebar,
      '/zh/reference/': technicalSidebar,
      '/': technicalSidebar
    },

    search: {
      provider: 'local',
      options: {
        locales: {
          root: {
            translations: {
              button: {
                buttonText: '搜索文档',
                buttonAriaLabel: '搜索文档'
              },
              modal: {
                noResultsText: '无法找到相关结果',
                resetButtonTitle: '清除查询条件',
                footer: {
                  selectText: '选择',
                  navigateText: '切换',
                  closeText: '关闭'
                }
              }
            }
          }
        }
      }
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/MF-Dust/Nori-Desktop-Pet' }
    ],

    footer: {
      message: '基于 GPLv3 开源协议发布 · 实事求是 · 纯粹守护',
      copyright: 'Copyright © 2025-2026 Nori Desktop Pet Team'
    },

    docFooter: {
      prev: '上一篇',
      next: '下一篇'
    },

    outline: {
      label: '本页导航',
      level: [2, 3]
    },

    lastUpdated: {
      text: '最后更新时间'
    }
  },

  vite: {
    plugins: [
      groupIconVitePlugin({
        customIcon: {
          nori: localIconLoader(import.meta.url, '../public/logo.png')
        }
      })
    ]
  }
})
