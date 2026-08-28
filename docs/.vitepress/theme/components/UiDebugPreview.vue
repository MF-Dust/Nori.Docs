<script setup lang="ts">
import { ref, computed } from 'vue'
import UiIcon from './UiIcon.vue'

interface LogEntry {
  id: string
  time: string
  level: 'INFO' | 'WARN' | 'ERROR'
  source: string
  message: string
}

const selectedLevel = ref<'ALL' | 'INFO' | 'WARN' | 'ERROR'>('ALL')
const searchKeyword = ref('')
const redactSensitive = ref(true)
const isExporting = ref(false)
const exportSuccess = ref(false)

const logs = ref<LogEntry[]>([
  {
    id: 'l1',
    time: '15:45:01.102',
    level: 'INFO',
    source: 'WindowManager',
    message: '四窗口分权调度器已就绪: first-run (idle), main (active, audio host), pet (OpenGL 60fps)'
  },
  {
    id: 'l2',
    time: '15:45:01.240',
    level: 'INFO',
    source: 'Live2DGL',
    message: 'Native OpenGL ES 2.0 渲染底盘初始化完成: 模型=ARG_Nori (2048px 遮罩缓冲, 各向异性过滤=16x)'
  },
  {
    id: 'l3',
    time: '15:45:01.520',
    level: 'INFO',
    source: 'VoiceService',
    message: 'WebAudio 单例宿主已挂载, TTS 队列就绪, 一次性媒体 Token 总线已连接 (GET /{secret}/media/tts/{token})'
  },
  {
    id: 'l4',
    time: '15:45:02.010',
    level: 'INFO',
    source: 'LivingMemory',
    message: '三路混合检索索引已挂载: SQLite FTS5 (142 atoms) + BAAI/bge-m3 向量索引 (142 vectors)'
  },
  {
    id: 'l5',
    time: '15:45:03.118',
    level: 'WARN',
    source: 'TrayService',
    message: '部分桌面环境无 StatusNotifier 托盘规范, 系统已自动自适应降级 supportsTray=false 并开启主窗常驻按钮'
  },
  {
    id: 'l6',
    time: '15:45:04.880',
    level: 'INFO',
    source: 'BridgeCommands',
    message: '双层 JSON 编码信封解构成功: invoke(ai_chat_stream, { model: "deepseek-chat", key: "sk-9a8b***" })'
  },
  {
    id: 'l7',
    time: '15:45:06.402',
    level: 'ERROR',
    source: 'McpTransport',
    message: 'MCP 服务器 [mcp_legacy_sql] 握手超时 (5000ms), 进程已安全隔离 (Fail-Closed)'
  }
])

const filteredLogs = computed(() => {
  return logs.value.filter(l => {
    if (selectedLevel.value !== 'ALL' && l.level !== selectedLevel.value) return false
    const q = searchKeyword.value.trim().toLowerCase()
    if (q && !l.message.toLowerCase().includes(q) && !l.source.toLowerCase().includes(q)) return false
    return true
  })
})

const getDisplayMessage = (msg: string) => {
  if (redactSensitive.value) {
    return msg.replace(/sk-[a-zA-Z0-9_-]+/g, 'sk-***[REDACTED]***')
  }
  return msg
}

const exportDiagnostics = () => {
  isExporting.value = true
  exportSuccess.value = false

  setTimeout(() => {
    isExporting.value = false
    exportSuccess.value = true
    setTimeout(() => {
      exportSuccess.value = false
    }, 3500)
  }, 1000)
}
</script>

<template>
  <div class="nori-surface-card">
    <div class="card-header">
      <div class="header-left">
        <UiIcon name="terminal" :size="16" class="header-icon" />
        <span class="header-title">脱敏诊断日志与安全模式 (Safe Mode) 仿真</span>
      </div>
      <div class="header-right">
        <span class="badge-chip">AES-256 全链路脱敏</span>
      </div>
    </div>

    <div class="card-body nori-scroll">
      <!-- 1. 安全模式状态条 -->
      <div class="safe-mode-banner">
        <div class="sm-left">
          <UiIcon name="shield" :size="16" />
          <div class="sm-text">
            <span class="sm-title">安全排障模式 (--safe-mode) 支持</span>
            <span class="sm-desc">当因配置错误或插件异常导致启动失败时，以安全模式启动将硬禁用自动化、跳过插件并使用保底模型。</span>
          </div>
        </div>
        <span class="sm-status-chip">正常运行态</span>
      </div>

      <!-- 2. 日志工具栏 -->
      <div class="log-toolbar">
        <div class="level-filter-bar">
          <button
            class="level-btn"
            :class="{ active: selectedLevel === 'ALL' }"
            @click="selectedLevel = 'ALL'"
          >
            全部日志 ({{ logs.length }})
          </button>
          <button
            class="level-btn info"
            :class="{ active: selectedLevel === 'INFO' }"
            @click="selectedLevel = 'INFO'"
          >
            INFO ({{ logs.filter(l => l.level === 'INFO').length }})
          </button>
          <button
            class="level-btn warn"
            :class="{ active: selectedLevel === 'WARN' }"
            @click="selectedLevel = 'WARN'"
          >
            WARN ({{ logs.filter(l => l.level === 'WARN').length }})
          </button>
          <button
            class="level-btn error"
            :class="{ active: selectedLevel === 'ERROR' }"
            @click="selectedLevel = 'ERROR'"
          >
            ERROR ({{ logs.filter(l => l.level === 'ERROR').length }})
          </button>
        </div>

        <div class="search-wrap">
          <UiIcon name="search" :size="13" class="s-icon" />
          <input
            type="text"
            v-model="searchKeyword"
            class="s-input"
            placeholder="搜索日志关键字..."
          />
        </div>
      </div>

      <!-- 3. 日志流控制台视口 -->
      <div class="console-viewport nori-scroll">
        <div
          v-for="l in filteredLogs"
          :key="l.id"
          class="log-line"
          :class="l.level.toLowerCase()"
        >
          <span class="log-time">{{ l.time }}</span>
          <span class="log-level-tag" :class="l.level.toLowerCase()">{{ l.level }}</span>
          <span class="log-source">[{{ l.source }}]</span>
          <span class="log-msg">{{ getDisplayMessage(l.message) }}</span>
        </div>
      </div>

      <!-- 4. 底部脱敏控制与导出按钮 -->
      <div class="log-footer-bar">
        <div class="redact-toggle-box">
          <label class="nori-switch">
            <input type="checkbox" v-model="redactSensitive" />
            <span class="slider"></span>
          </label>
          <span class="redact-label">自动脱敏敏感 API 密钥与个人路径 (隐私保护)</span>
        </div>

        <div class="export-box">
          <button
            class="export-btn"
            :disabled="isExporting"
            @click="exportDiagnostics"
          >
            <UiIcon v-if="isExporting" name="loading" :size="13" spin />
            <UiIcon v-else name="download" :size="13" />
            <span>{{ isExporting ? '正在打包脱敏诊断包...' : '导出脱敏诊断归档 (ZIP)' }}</span>
          </button>
          <span v-if="exportSuccess" class="export-success-msg">✓ 诊断包已成功生成 (nori-diag-20250518.zip)</span>
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
  gap: 0.9rem;
  max-height: 540px;
}

.safe-mode-banner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(125, 227, 255, 0.06);
  border: 1px solid var(--line-subtle);
  border-radius: 8px;
  padding: 0.7rem 1rem;
}
.sm-left {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}
.sm-text {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}
.sm-title { font-size: 0.8rem; font-weight: 600; color: var(--text-primary); }
.sm-desc { font-size: 0.7rem; color: var(--text-muted); line-height: 1.35; }
.sm-status-chip {
  font-size: 0.7rem;
  color: var(--success);
  background: rgba(32, 224, 144, 0.15);
  padding: 0.15rem 0.5rem;
  border-radius: 4px;
  white-space: nowrap;
}

.log-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.8rem;
  flex-wrap: wrap;
}
.level-filter-bar {
  display: flex;
  gap: 0.35rem;
}
.level-btn {
  font-size: 0.72rem;
  padding: 0.2rem 0.55rem;
  background: rgba(19, 23, 31, 0.8);
  border: 1px solid var(--line-subtle);
  border-radius: 4px;
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.2s;
}
.level-btn:hover { color: var(--text-primary); border-color: var(--nori-teal); }
.level-btn.active { background: var(--nori-teal); color: var(--on-teal); font-weight: 600; }
.level-btn.info.active { background: #38bdf8; color: #03101c; }
.level-btn.warn.active { background: var(--warning); color: #03101c; }
.level-btn.error.active { background: var(--danger); color: white; }

.search-wrap {
  position: relative;
  display: flex;
  align-items: center;
}
.s-icon {
  position: absolute;
  left: 0.5rem;
  color: var(--text-muted);
}
.s-input {
  background: rgba(19, 23, 31, 0.8);
  border: 1px solid var(--line-subtle);
  color: var(--text-primary);
  padding: 0.25rem 0.6rem 0.25rem 1.8rem;
  border-radius: 4px;
  font-size: 0.75rem;
  outline: none;
}
.s-input:focus { border-color: var(--nori-teal); }

/* 控制台视口 */
.console-viewport {
  background: rgba(10, 13, 18, 0.95);
  border: 1px solid var(--line-subtle);
  border-radius: 8px;
  padding: 0.8rem;
  height: 240px;
  font-family: "JetBrains Mono", Consolas, Monaco, monospace;
  font-size: 0.72rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.log-line {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  line-height: 1.4;
}
.log-time { color: var(--text-faint); flex-shrink: 0; }
.log-level-tag {
  font-weight: 600;
  padding: 0 0.25rem;
  border-radius: 2px;
  flex-shrink: 0;
}
.log-level-tag.info { color: #38bdf8; background: rgba(56, 189, 248, 0.12); }
.log-level-tag.warn { color: var(--warning); background: rgba(241, 178, 74, 0.15); }
.log-level-tag.error { color: var(--danger-text); background: rgba(251, 60, 68, 0.18); }

.log-source { color: var(--nori-teal-soft); flex-shrink: 0; }
.log-msg { color: var(--text-body); word-break: break-all; }

.log-line.error .log-msg { color: #fca5a5; }

/* 底部操作 */
.log-footer-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  padding-top: 0.6rem;
  flex-wrap: wrap;
  gap: 0.8rem;
}
.redact-toggle-box {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.redact-label {
  font-size: 0.74rem;
  color: var(--text-muted);
}

.export-box {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}
.export-btn {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.74rem;
  background: rgba(94, 234, 212, 0.15);
  border: 1px solid var(--nori-teal);
  color: var(--nori-teal-bright);
  padding: 0.35rem 0.8rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}
.export-btn:hover:not(:disabled) {
  background: var(--nori-teal);
  color: var(--on-teal);
}
.export-success-msg {
  font-size: 0.72rem;
  color: var(--success);
}

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
</style>
