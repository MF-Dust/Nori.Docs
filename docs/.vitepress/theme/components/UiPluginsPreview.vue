<script setup lang="ts">
import { ref } from 'vue'
import UiIcon from './UiIcon.vue'

interface PluginItem {
  id: string
  name: string
  version: string
  apiVersion: string
  description: string
  author: string
  capabilities: string[]
  platforms: string[]
  enabled: boolean
  manifest: Record<string, any>
}

const activeManifestPlugin = ref<PluginItem | null>(null)

const plugins = ref<PluginItem[]>([
  {
    id: 'io.nori.pomodoro',
    name: 'Nori 番茄钟 (Pomodoro Focus)',
    version: '1.0.0',
    apiVersion: '2.0',
    description: '为桌宠添加精美的番茄工作法悬浮时钟与专注统计面板，支持倒计时提醒。',
    author: 'Nori Community',
    capabilities: ['ui.webview'],
    platforms: ['windows', 'linux', 'macos'],
    enabled: true,
    manifest: {
      schemaVersion: 1,
      id: 'io.nori.pomodoro',
      name: 'Nori 番茄钟',
      description: '为桌宠添加精美的番茄工作法悬浮时钟与专注统计',
      version: '1.0.0',
      apiVersion: '2.0',
      runtime: {
        kind: 'dotnet',
        assembly: 'lib/MyPlugin.dll',
        entryType: 'Nori.Plugins.PomodoroPlugin'
      },
      ui: { webRoot: 'web' },
      capabilities: ['ui.webview'],
      platforms: ['windows', 'linux', 'macos']
    }
  },
  {
    id: 'io.nori.translator',
    name: '实时悬浮划词翻译 (Hover Translator)',
    version: '1.2.0',
    apiVersion: '2.0',
    description: '全局鼠标划词快速呼出轻量翻译气泡，支持多语言地道互译与术语高亮。',
    author: 'Dust & Contributors',
    capabilities: ['ui.webview'],
    platforms: ['windows', 'macos'],
    enabled: true,
    manifest: {
      schemaVersion: 1,
      id: 'io.nori.translator',
      name: '实时悬浮划词翻译',
      version: '1.2.0',
      apiVersion: '2.0',
      runtime: {
        kind: 'dotnet',
        assembly: 'lib/Translator.dll',
        entryType: 'Nori.Plugins.TranslatorPlugin'
      },
      capabilities: ['ui.webview'],
      platforms: ['windows', 'macos']
    }
  },
  {
    id: 'io.nori.gametracker',
    name: 'Steam 游戏动态追踪 (Steam Companion)',
    version: '0.9.5',
    apiVersion: '2.0',
    description: '读取本机 Steam 客户端运行状态，当启动支持的游戏时桌宠换上专属联机装扮。',
    author: 'Erhio',
    capabilities: ['ui.webview'],
    platforms: ['windows'],
    enabled: false,
    manifest: {
      schemaVersion: 1,
      id: 'io.nori.gametracker',
      name: 'Steam 游戏动态追踪',
      version: '0.9.5',
      apiVersion: '2.0',
      runtime: {
        kind: 'dotnet',
        assembly: 'lib/SteamCompanion.dll',
        entryType: 'Nori.Plugins.SteamTracker'
      },
      capabilities: ['ui.webview'],
      platforms: ['windows']
    }
  }
])

const viewManifest = (p: PluginItem) => {
  activeManifestPlugin.value = p
}

const closeManifest = () => {
  activeManifestPlugin.value = null
}
</script>

<template>
  <div class="nori-surface-card">
    <div class="card-header">
      <div class="header-left">
        <UiIcon name="plug" :size="16" class="header-icon" />
        <span class="header-title">NPS 2.0 插件系统与 ALC 依赖隔离管理</span>
      </div>
      <div class="header-right">
        <span class="badge-chip">Nori Plugin Spec 2.0</span>
      </div>
    </div>

    <div class="card-body nori-scroll">
      <!-- 顶部状态提示 -->
      <div class="plugin-warning-box">
        <UiIcon name="shield" :size="15" />
        <span>插件运行在 .NET 宿主进程内（ALC 隔离）。请仅安装来自可信来源的 <code>.noripack</code> 插件包。安全模式下插件强制禁用。</span>
      </div>

      <!-- 已安装插件列表 -->
      <div class="plugins-list">
        <div
          v-for="p in plugins"
          :key="p.id"
          class="plugin-card"
          :class="{ active: p.enabled }"
        >
          <div class="plugin-top-row">
            <div class="plugin-title-box">
              <span class="plugin-name">{{ p.name }}</span>
              <span class="plugin-version-tag">v{{ p.version }} (API {{ p.apiVersion }})</span>
            </div>

            <div class="plugin-action-box">
              <button class="manifest-btn" @click="viewManifest(p)">
                <UiIcon name="code" :size="12" /> 查看 manifest.json
              </button>
              <label class="nori-switch">
                <input type="checkbox" v-model="p.enabled" />
                <span class="slider"></span>
              </label>
            </div>
          </div>

          <div class="plugin-desc">{{ p.description }}</div>

          <div class="plugin-footer-meta">
            <div class="meta-tag-group">
              <span class="meta-tag author">作者: {{ p.author }}</span>
              <span class="meta-tag cap" v-for="c in p.capabilities" :key="c">能力: {{ c }}</span>
              <span class="meta-tag plat">平台: {{ p.platforms.join(', ') }}</span>
            </div>

            <span class="alc-status" :class="{ running: p.enabled }">
              {{ p.enabled ? '● ALC 上下文已加载' : '○ ALC 上下文已卸载' }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Manifest Modal -->
    <div class="modal-overlay" v-if="activeManifestPlugin" @click="closeManifest">
      <div class="modal-window" @click.stop>
        <div class="modal-header">
          <div class="modal-title">
            <UiIcon name="code" :size="16" />
            <span>{{ activeManifestPlugin.name }} · manifest.json</span>
          </div>
          <button class="modal-close" @click="closeManifest">
            <UiIcon name="close" :size="16" />
          </button>
        </div>
        <div class="modal-body">
          <pre class="manifest-pre">{{ JSON.stringify(activeManifestPlugin.manifest, null, 2) }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.nori-surface-card {
  background: var(--bg-card);
  border: 1px solid var(--line-subtle);
  border-radius: 12px;
  overflow: hidden;
  margin: 1.5rem 0;
  box-shadow: var(--shadow-elev-2);
  color: var(--text-body);
  backdrop-filter: blur(14px);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  position: relative;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.65rem 1rem;
  background: rgba(19, 23, 31, 0.7);
  border-bottom: 1px solid var(--line-subtle);
}
.header-left {
  display: flex;
  align-items: center;
  gap: 0.45rem;
}
.header-icon { color: var(--nori-teal); }
.header-title {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-primary);
}
.badge-chip {
  font-size: 0.7rem;
  background: rgba(94, 234, 212, 0.12);
  color: var(--nori-teal-bright);
  padding: 0.15rem 0.5rem;
  border-radius: 4px;
  border: 1px solid rgba(94, 234, 212, 0.25);
}

.card-body {
  padding: 1.2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-height: 520px;
}

.plugin-warning-box {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(241, 178, 74, 0.1);
  border: 1px solid rgba(241, 178, 74, 0.3);
  color: var(--warning);
  padding: 0.5rem 0.8rem;
  border-radius: 6px;
  font-size: 0.74rem;
  line-height: 1.4;
}
.plugin-warning-box code {
  color: var(--nori-teal-bright);
  background: rgba(0, 0, 0, 0.3);
  padding: 0.1rem 0.3rem;
  border-radius: 3px;
}

.plugins-list {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.plugin-card {
  background: rgba(23, 27, 34, 0.6);
  border: 1px solid var(--line-subtle);
  border-radius: 8px;
  padding: 0.9rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  transition: all 0.2s;
}
.plugin-card.active {
  background: rgba(36, 47, 61, 0.65);
  border-color: rgba(94, 234, 212, 0.35);
}

.plugin-top-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.plugin-title-box {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.plugin-name {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-primary);
}
.plugin-version-tag {
  font-size: 0.68rem;
  color: var(--nori-teal-soft);
  background: rgba(125, 227, 255, 0.08);
  padding: 0.1rem 0.4rem;
  border-radius: 3px;
}

.plugin-action-box {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}
.manifest-btn {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.7rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--line-subtle);
  color: var(--text-body);
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  cursor: pointer;
}
.manifest-btn:hover { background: rgba(255, 255, 255, 0.1); color: var(--text-primary); }

.plugin-desc {
  font-size: 0.76rem;
  color: var(--text-muted);
  line-height: 1.4;
}

.plugin-footer-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  padding-top: 0.45rem;
  font-size: 0.7rem;
}
.meta-tag-group {
  display: flex;
  gap: 0.5rem;
}
.meta-tag {
  color: var(--text-muted);
}
.meta-tag.cap {
  color: var(--nori-teal-bright);
}

.alc-status {
  font-size: 0.68rem;
  color: var(--text-faint);
}
.alc-status.running { color: var(--success); }

/* 开关 */
.nori-switch {
  position: relative;
  display: inline-block;
  width: 34px;
  height: 18px;
  flex-shrink: 0;
}
.nori-switch input { opacity: 0; width: 0; height: 0; }
.nori-switch .slider {
  position: absolute;
  cursor: pointer;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: rgba(255, 255, 255, 0.15);
  transition: 0.3s;
  border-radius: 18px;
}
.nori-switch .slider:before {
  position: absolute;
  content: "";
  height: 12px;
  width: 12px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: 0.3s;
  border-radius: 50%;
}
.nori-switch input:checked + .slider { background-color: var(--nori-teal); }
.nori-switch input:checked + .slider:before { transform: translateX(16px); background-color: var(--on-teal); }

/* Modal */
.modal-overlay {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  backdrop-filter: blur(4px);
}
.modal-window {
  width: 90%;
  max-width: 480px;
  background: var(--bg-glass-modal);
  border: 1px solid var(--nori-teal);
  border-radius: 10px;
  box-shadow: var(--shadow-window);
  overflow: hidden;
}
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.6rem 1rem;
  background: rgba(23, 27, 34, 0.8);
  border-bottom: 1px solid var(--line-subtle);
}
.modal-title {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--text-primary);
}
.modal-close {
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
}
.modal-close:hover { color: var(--text-primary); }

.modal-body {
  padding: 0.8rem;
}
.manifest-pre {
  background: rgba(0, 0, 0, 0.5);
  padding: 0.8rem;
  border-radius: 6px;
  font-family: monospace;
  font-size: 0.72rem;
  color: var(--nori-teal-soft);
  margin: 0;
  max-height: 260px;
  overflow-y: auto;
}
</style>
