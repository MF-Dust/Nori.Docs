import { defineConfig } from 'vitepress'
import {
  groupIconMdPlugin,
  groupIconVitePlugin,
  localIconLoader
} from 'vitepress-plugin-group-icons'

const userGuideSidebar = [
  {
    text: '快速上手',
    collapsed: false,
    items: [
      { text: '快速上手', link: '/user-guide/' },
      { text: '下载与安装', link: '/user-guide/environment-and-install' },
      { text: '和桌宠互动', link: '/user-guide/desk-pet-interaction' },
      { text: '连接 AI 模型', link: '/user-guide/ai-configuration' },
      { text: '开启语音', link: '/user-guide/voice-and-speech' },
      { text: '提醒与长期记忆', link: '/user-guide/memory-and-reminders' },
      { text: '技能与 MCP', link: '/user-guide/skills-and-mcp' },
      { text: '常见问题与排障', link: '/user-guide/troubleshooting-and-faq' }
    ]
  }
]

const technicalSidebar = [
  {
    text: '开始使用',
    collapsed: false,
    items: [
      { text: '快速上手', link: '/user-guide/' },
      { text: '下载与安装', link: '/user-guide/environment-and-install' },
      { text: '和桌宠互动', link: '/user-guide/desk-pet-interaction' },
      { text: '连接 AI 模型', link: '/user-guide/ai-configuration' },
      { text: '开启语音', link: '/user-guide/voice-and-speech' },
      { text: '提醒与长期记忆', link: '/user-guide/memory-and-reminders' },
      { text: '技能与 MCP', link: '/user-guide/skills-and-mcp' },
      { text: '常见问题与排障', link: '/user-guide/troubleshooting-and-faq' }
    ]
  },
  {
    text: '功能与进阶',
    collapsed: false,
    items: [
      { text: '界面与窗口', link: '/guide/ui-and-windows' },
      { text: 'Live2D 模型管理', link: '/guide/live2d-models' },
      { text: 'AI 对话与 Agent', link: '/guide/ai-chat-agent' },
      { text: '长期记忆', link: '/guide/memory-system' },
      { text: '语音系统', link: '/guide/voice-system' },
      { text: '技能与定时提醒', link: '/guide/skills-reminders' },
      { text: 'MCP 工具', link: '/guide/mcp-integration' },
      { text: '浏览器与桌面自动化', link: '/guide/automation' }
    ]
  },
  {
    text: '开发与扩展',
    collapsed: false,
    items: [
      { text: '从源码运行 Nori', link: '/guide/getting-started' },
      { text: '安装与使用插件', link: '/guide/plugin-system' }
    ]
  },
  {
    text: '排障与兼容性',
    collapsed: false,
    items: [
      { text: '安全模式', link: '/operations/safe-mode' },
      { text: '诊断与日志', link: '/operations/diagnostics' },
      { text: '跨平台支持', link: '/operations/platform-matrix' },
      { text: '常见问题', link: '/operations/faq' }
    ]
  },
  {
    text: '进一步了解',
    collapsed: false,
    items: [
      { text: 'Nori 是怎样组成的', link: '/reference/architecture' },
      { text: '凭据与本地数据安全', link: '/reference/security-spec' }
    ]
  }
]

export default defineConfig({
  title: 'Nori Desktop Pet',
  description:
    'Nori Desktop Pet 用户文档：下载安装、Live2D 桌宠、AI、语音、记忆、MCP、插件与排障',

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
        text: '开始使用',
        items: [
          { text: '快速上手', link: '/user-guide/' },
          { text: '下载与安装', link: '/user-guide/environment-and-install' },
          { text: '和桌宠互动', link: '/user-guide/desk-pet-interaction' },
          { text: '连接 AI 模型', link: '/user-guide/ai-configuration' },
          { text: '开启语音', link: '/user-guide/voice-and-speech' },
          { text: '提醒与长期记忆', link: '/user-guide/memory-and-reminders' },
          { text: '技能与 MCP', link: '/user-guide/skills-and-mcp' },
          { text: '常见问题与排障', link: '/user-guide/troubleshooting-and-faq' }
        ]
      },
      {
        text: '功能与进阶',
        items: [
          { text: '界面与窗口', link: '/guide/ui-and-windows' },
          { text: 'Live2D 模型管理', link: '/guide/live2d-models' },
          { text: 'AI 对话与 Agent', link: '/guide/ai-chat-agent' },
          { text: '长期记忆', link: '/guide/memory-system' },
          { text: '语音系统', link: '/guide/voice-system' },
          { text: '技能与定时提醒', link: '/guide/skills-reminders' },
          { text: 'MCP 工具', link: '/guide/mcp-integration' },
          { text: '自动化', link: '/guide/automation' }
        ]
      },
      {
        text: '开发与扩展',
        items: [
          { text: '从源码运行 Nori', link: '/guide/getting-started' },
          { text: '安装与使用插件', link: '/guide/plugin-system' },
          {
            text: 'Nori.PluginSDK',
            link: 'https://github.com/MF-Dust/Nori.PluginSDK'
          }
        ]
      },
      {
        text: '排障',
        items: [
          { text: '安全模式', link: '/operations/safe-mode' },
          { text: '诊断与日志', link: '/operations/diagnostics' },
          { text: '跨平台支持', link: '/operations/platform-matrix' },
          { text: '常见问题', link: '/operations/faq' }
        ]
      },
      {
        text: '相关链接',
        items: [
          {
            text: '下载最新版',
            link: 'https://github.com/MF-Dust/Nori.Desktop/releases/latest'
          },
          {
            text: 'Nori.Desktop 源码',
            link: 'https://github.com/MF-Dust/Nori.Desktop'
          },
          {
            text: 'Steam 商店页',
            link: 'https://store.steampowered.com/app/4996280/I_NORI/'
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
      { icon: 'github', link: 'https://github.com/MF-Dust/Nori.Desktop' }
    ],

    footer: {
      message: '基于 GPLv3 开源协议发布 · 文档以当前实际功能为准',
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
