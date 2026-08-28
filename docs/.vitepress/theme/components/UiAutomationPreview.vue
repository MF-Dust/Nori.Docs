<script setup lang="ts">
import { ref } from 'vue'
import UiIcon from './UiIcon.vue'

const masterSwitch = ref(true)
const browserAutomation = ref(true)
const desktopVision = ref(false)

const isTaskRunning = ref(true)
const taskStep = ref(2)
const taskStatusText = ref('步骤 2/3: 正在导航至目标网页并提取内容...')

const auditLogs = ref([
  { id: '1', time: '15:44:02', action: 'launch_browser', target: 'msedge (isolated temp profile)', status: 'success' },
  { id: '2', time: '15:44:05', action: 'goto_url', target: 'https://news.ycombinator.com', status: 'success' },
  { id: '3', time: '15:44:08', action: 'extract_dom', target: 'table.itemlist tr.athing', status: 'running' }
])

const stopTask = () => {
  isTaskRunning.value = false
  taskStatusText.value = '任务已由用户主动终止 (Fail-Closed 安全释放)'
}

const startTask = () => {
  isTaskRunning.value = true
  taskStep.value = 1
  taskStatusText.value = '步骤 1/3: 正在初始化隔离 Edge 浏览器 Profile...'
  setTimeout(() => {
    taskStep.value = 2
    taskStatusText.value = '步骤 2/3: 正在导航至目标网页并提取内容...'
  }, 1000)
}
</script>

<template>
  <div class="nori-surface-card">
    <div class="card-header">
      <div class="header-left">
        <UiIcon name="bot" :size="16" class="header-icon" />
        <span class="header-title">浏览器与桌面自动化执行子系统 (Playwright + Edge)</span>
      </div>
      <div class="header-right">
        <span class="badge-chip">Fail-Closed 严格受控</span>
      </div>
    </div>

    <div class="card-body nori-scroll">
      <!-- 1. 自动化总控与环境状态 -->
      <div class="section-box">
        <div class="section-heading">
          <UiIcon name="monitor" :size="14" />
          <span>自动化执行开关与环境支持</span>
        </div>

        <div class="switches-grid">
          <div class="switch-row">
            <div class="st-text">
              <span class="st-title">自动化总开关 (Master Switch)</span>
              <span class="st-desc">默认关闭，需用户显式开启后方可响应自动化指令</span>
            </div>
            <label class="nori-switch">
              <input type="checkbox" v-model="masterSwitch" />
              <span class="slider"></span>
            </label>
          </div>

          <div class="switch-row">
            <div class="st-text">
              <span class="st-title">浏览器自动化 (Microsoft Edge)</span>
              <span class="st-desc">直连本机 Edge 稳定版，使用独立临时隔离 Profile</span>
            </div>
            <label class="nori-switch">
              <input type="checkbox" v-model="browserAutomation" />
              <span class="slider"></span>
            </label>
          </div>
        </div>

        <div class="env-status-badge">
          <div class="dot-live"></div>
          <span>环境探测: Microsoft Edge x64 稳定版已就绪 | 平台: Windows 11 x64 (支持)</span>
        </div>
      </div>

      <!-- 2. 实时任务状态卡片 (Task Card) -->
      <div class="section-box">
        <div class="section-heading-row">
          <div class="section-heading">
            <UiIcon name="activity" :size="14" />
            <span>实时自动化任务调度卡片 (Task Stream)</span>
          </div>
          <button v-if="isTaskRunning" class="stop-btn" @click="stopTask">
            <UiIcon name="stop" :size="12" />
            <span>强行停止任务 (Stop All)</span>
          </button>
          <button v-else class="restart-btn" @click="startTask">
            <UiIcon name="play" :size="12" />
            <span>模拟启动新任务</span>
          </button>
        </div>

        <div class="task-card-content" :class="{ running: isTaskRunning }">
          <div class="task-header-row">
            <div class="task-title-box">
              <span class="task-badge">自动任务 #402</span>
              <span class="task-name">科技资讯检索与结构化要点提取</span>
            </div>
            <span class="task-state" :class="{ active: isTaskRunning }">
              {{ isTaskRunning ? '执行中 (Running)' : '已终止 (Stopped)' }}
            </span>
          </div>

          <!-- 分步指示器 -->
          <div class="step-progress-list">
            <div class="progress-step done">
              <div class="step-icon"><UiIcon name="check" :size="11" /></div>
              <div class="step-content">
                <span class="sc-title">步骤 1: 启动临时隔离 Edge Profile</span>
                <span class="sc-desc">无缓存与私有 Cookies 泄露风险</span>
              </div>
            </div>

            <div class="progress-step" :class="isTaskRunning ? 'current' : 'stopped'">
              <div class="step-icon">
                <UiIcon v-if="isTaskRunning" name="loading" :size="11" spin />
                <UiIcon v-else name="close" :size="11" />
              </div>
              <div class="step-content">
                <span class="sc-title">步骤 2: 导航至目标站点并解析 DOM 树</span>
                <span class="sc-desc">URL: https://news.ycombinator.com</span>
              </div>
            </div>

            <div class="progress-step pending">
              <div class="step-icon">3</div>
              <div class="step-content">
                <span class="sc-title">步骤 3: 提取结构化数据并写入 Markdown</span>
                <span class="sc-desc">等待前置步骤就绪</span>
              </div>
            </div>
          </div>

          <div class="task-status-line">
            <UiIcon name="info" :size="13" />
            <span>{{ taskStatusText }}</span>
          </div>
        </div>
      </div>

      <!-- 3. 全量审计流水日志 (Audit Log) -->
      <div class="section-box">
        <div class="section-heading">
          <UiIcon name="terminal" :size="14" />
          <span>自动化全量安全审计流 (Audit Trail)</span>
        </div>

        <div class="audit-table-wrap">
          <table class="audit-table">
            <thead>
              <tr>
                <th>时间</th>
                <th>操作类型</th>
                <th>目标端点 / 参数</th>
                <th>执行状态</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="log in auditLogs" :key="log.id">
                <td>{{ log.time }}</td>
                <td><code>{{ log.action }}</code></td>
                <td>{{ log.target }}</td>
                <td>
                  <span class="log-status" :class="log.status">
                    {{ log.status === 'success' ? '✓ 成功' : '⏳ 运行中' }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
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
  gap: 1rem;
  max-height: 540px;
}

.section-box {
  background: rgba(23, 27, 34, 0.5);
  border: 1px solid var(--line-subtle);
  border-radius: 8px;
  padding: 0.8rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
}

.section-heading-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.section-heading {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--text-primary);
}

.switches-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}
.switch-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.2rem 0;
}
.st-text {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}
.st-title { font-size: 0.78rem; font-weight: 500; color: var(--text-primary); }
.st-desc { font-size: 0.68rem; color: var(--text-muted); }

.env-status-badge {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  background: rgba(32, 224, 144, 0.1);
  border: 1px solid rgba(32, 224, 144, 0.25);
  color: var(--success);
  padding: 0.35rem 0.6rem;
  border-radius: 6px;
  font-size: 0.72rem;
}
.dot-live {
  width: 6px;
  height: 6px;
  background: var(--success);
  border-radius: 50%;
  box-shadow: 0 0 6px var(--success);
}

.stop-btn {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  background: rgba(251, 60, 68, 0.15);
  border: 1px solid var(--danger);
  color: var(--danger-text);
  padding: 0.25rem 0.6rem;
  border-radius: 4px;
  font-size: 0.72rem;
  cursor: pointer;
}
.stop-btn:hover { background: var(--danger); color: white; }

.restart-btn {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  background: rgba(94, 234, 212, 0.15);
  border: 1px solid var(--nori-teal);
  color: var(--nori-teal-bright);
  padding: 0.25rem 0.6rem;
  border-radius: 4px;
  font-size: 0.72rem;
  cursor: pointer;
}

.task-card-content {
  background: rgba(19, 23, 31, 0.8);
  border: 1px solid var(--line-subtle);
  border-radius: 8px;
  padding: 0.8rem;
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
}
.task-card-content.running {
  border-color: rgba(94, 234, 212, 0.4);
}

.task-header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.task-title-box {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}
.task-badge {
  font-size: 0.65rem;
  background: rgba(125, 227, 255, 0.1);
  color: var(--nori-teal-soft);
  padding: 0.1rem 0.35rem;
  border-radius: 3px;
}
.task-name {
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--text-primary);
}
.task-state {
  font-size: 0.7rem;
  color: var(--text-muted);
}
.task-state.active { color: var(--nori-teal-bright); }

.step-progress-list {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}
.progress-step {
  display: flex;
  align-items: flex-start;
  gap: 0.6rem;
  font-size: 0.74rem;
}
.step-icon {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.65rem;
  flex-shrink: 0;
  color: var(--text-muted);
}
.progress-step.done .step-icon { background: var(--success); color: #03101c; }
.progress-step.current .step-icon { background: var(--nori-teal); color: var(--on-teal); }
.progress-step.stopped .step-icon { background: var(--danger); color: white; }

.step-content {
  display: flex;
  flex-direction: column;
}
.sc-title { font-weight: 500; color: var(--text-primary); }
.sc-desc { font-size: 0.68rem; color: var(--text-muted); }

.task-status-line {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.72rem;
  color: var(--nori-teal-soft);
  background: rgba(0, 0, 0, 0.3);
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
}

/* 审计表格 */
.audit-table-wrap {
  overflow-x: auto;
}
.audit-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.72rem;
}
.audit-table th {
  text-align: left;
  padding: 0.4rem 0.6rem;
  color: var(--text-muted);
  border-bottom: 1px solid var(--line-subtle);
  font-weight: 500;
}
.audit-table td {
  padding: 0.4rem 0.6rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
  color: var(--text-body);
}
.audit-table code {
  color: var(--nori-teal-bright);
  background: rgba(0, 0, 0, 0.3);
  padding: 0.1rem 0.3rem;
  border-radius: 3px;
}
.log-status.success { color: var(--success); }
.log-status.running { color: var(--warning); }

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
