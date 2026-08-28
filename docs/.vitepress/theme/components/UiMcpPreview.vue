<script setup lang="ts">
import { ref } from 'vue'
import UiIcon from './UiIcon.vue'

const approvalStatus = ref<'pending' | 'approved' | 'rejected'>('pending')
const activeSchemaTool = ref<string | null>(null)

const servers = [
  {
    id: 'fs',
    name: 'mcp_filesystem (本地文件系统扩展)',
    transport: 'stdio / npx',
    command: 'npx -y @modelcontextprotocol/server-filesystem C:\\Workspace',
    tools: ['read_file', 'write_file', 'list_directory'],
    enabled: true,
    status: 'online'
  },
  {
    id: 'fetch',
    name: 'mcp_fetch (网页与网络请求扩展)',
    transport: 'stdio / uvx',
    command: 'uvx mcp-server-fetch',
    tools: ['fetch', 'get_html_content'],
    enabled: true,
    status: 'online'
  },
  {
    id: 'docker',
    name: 'mcp_docker_runner (沙箱容器服务)',
    transport: 'sse / http',
    command: 'http://127.0.0.1:8080/sse',
    tools: ['run_container', 'inspect_logs'],
    enabled: true,
    status: 'online'
  }
]

const schemas: Record<string, any> = {
  write_file: {
    type: 'object',
    properties: {
      path: { type: 'string', description: '文件的绝对路径' },
      content: { type: 'string', description: '要写入的文本内容' }
    },
    required: ['path', 'content']
  },
  read_file: {
    type: 'object',
    properties: {
      path: { type: 'string', description: '要读取的目标文件路径' }
    },
    required: ['path']
  },
  list_directory: {
    type: 'object',
    properties: {
      path: { type: 'string', description: '要扫描的目录路径' }
    },
    required: ['path']
  }
}

const viewSchema = (toolName: string) => {
  activeSchemaTool.value = toolName
}

const closeSchema = () => {
  activeSchemaTool.value = null
}

const approve = () => {
  approvalStatus.value = 'approved'
}

const reject = () => {
  approvalStatus.value = 'rejected'
}

const reset = () => {
  approvalStatus.value = 'pending'
}
</script>

<template>
  <div class="nori-surface-card">
    <div class="card-header">
      <div class="header-left">
        <UiIcon name="plug" :size="16" class="header-icon" />
        <span class="header-title">MCP 协议扩展服务与人工在环二次审批仿真</span>
      </div>
      <div class="header-right">
        <span class="badge-chip">Model Context Protocol 2.0</span>
      </div>
    </div>

    <div class="mcp-body-grid">
      <!-- 左侧：已连接 MCP 服务列表 -->
      <div class="servers-column">
        <div class="col-title-row">
          <span class="col-title"><UiIcon name="server" :size="14" /> 已连接的 MCP 外部服务 (3)</span>
        </div>

        <div class="server-cards-list">
          <div
            v-for="srv in servers"
            :key="srv.id"
            class="server-card"
          >
            <div class="server-card-header">
              <div class="status-dot online"></div>
              <span class="server-name">{{ srv.name }}</span>
              <span class="transport-tag">{{ srv.transport }}</span>
            </div>

            <div class="server-cmd-row">
              <span class="cmd-label">执行指令:</span>
              <code class="cmd-text">{{ srv.command }}</code>
            </div>

            <div class="server-tools-row">
              <span class="tools-label">导出工具:</span>
              <div class="tools-chips-list">
                <button
                  v-for="t in srv.tools"
                  :key="t"
                  class="tool-chip-btn"
                  @click="viewSchema(t)"
                >
                  <UiIcon name="tool" :size="11" />
                  <span>{{ t }}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧：高危操作人工在环二次审批卡片 (Human-In-The-Loop) -->
      <div class="approval-column">
        <div class="col-title-row">
          <span class="col-title"><UiIcon name="shield" :size="14" /> 对话内高危调用安全审批</span>
          <button v-if="approvalStatus !== 'pending'" class="reset-link" @click="reset">
            <UiIcon name="refresh" :size="12" /> 重置演示
          </button>
        </div>

        <div class="approval-card">
          <div class="approval-card-header">
            <div class="warning-badge">
              <UiIcon name="alert" :size="14" />
              <span>外部高危工具调用待审批</span>
            </div>
            <span class="state-indicator" :class="approvalStatus">
              {{ approvalStatus === 'pending' ? '等待用户授权' : (approvalStatus === 'approved' ? '已授权执行' : '已拒绝执行') }}
            </span>
          </div>

          <div class="approval-card-content">
            <p class="call-desc">
              伴侣试图调用工具 <code class="tool-highlight">filesystem_write_file</code> 向你的本机写入文件：
            </p>

            <div class="params-box">
              <div class="param-item">
                <span class="pk">目标路径:</span>
                <span class="pv">C:\Workspace\daily_notes.md</span>
              </div>
              <div class="param-item">
                <span class="pk">写入内容:</span>
                <pre class="pv code"># 今日待办清单
- [x] 完成 Nori 文档高保真交互演示
- [ ] 开展 Live2D 跨平台 OpenGL 测试</pre>
              </div>
            </div>

            <!-- 审批操作按钮 -->
            <div class="actions-row" v-if="approvalStatus === 'pending'">
              <button class="auth-btn allow" @click="approve">
                <UiIcon name="check" :size="14" />
                <span>允许本次执行 (Allow)</span>
              </button>
              <button class="auth-btn deny" @click="reject">
                <UiIcon name="close" :size="14" />
                <span>拒绝调用 (Deny)</span>
              </button>
            </div>

            <!-- 审批结果 -->
            <div class="result-box approved" v-else-if="approvalStatus === 'approved'">
              <UiIcon name="check" :size="16" />
              <div class="res-text">
                <strong>用户已显式批准执行。</strong>
                <span>工具已安全完成磁盘写入，伴侣将继续生成流式回复。</span>
              </div>
            </div>

            <div class="result-box rejected" v-else-if="approvalStatus === 'rejected'">
              <UiIcon name="close" :size="16" />
              <div class="res-text">
                <strong>用户已拒绝本次调用。</strong>
                <span>外部进程已被阻断并安全终止，无任何文件改动。</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Schema 检查弹窗 (Modal) -->
    <div class="schema-modal-overlay" v-if="activeSchemaTool" @click="closeSchema">
      <div class="schema-modal" @click.stop>
        <div class="modal-header">
          <div class="modal-title">
            <UiIcon name="code" :size="16" />
            <span>工具 InputSchema 检查: <code>{{ activeSchemaTool }}</code></span>
          </div>
          <button class="modal-close-btn" @click="closeSchema">
            <UiIcon name="close" :size="16" />
          </button>
        </div>
        <div class="modal-body">
          <pre class="schema-code">{{ JSON.stringify(schemas[activeSchemaTool] || {}, null, 2) }}</pre>
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

.mcp-body-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  padding: 1.2rem;
}

.col-title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.7rem;
}
.col-title {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--text-primary);
}
.reset-link {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.72rem;
  background: none;
  border: none;
  color: var(--nori-teal-soft);
  cursor: pointer;
}
.reset-link:hover { text-decoration: underline; }

.server-cards-list {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.server-card {
  background: rgba(23, 27, 34, 0.6);
  border: 1px solid var(--line-subtle);
  border-radius: 8px;
  padding: 0.7rem 0.9rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}
.server-card-header {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}
.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}
.status-dot.online { background: var(--success); box-shadow: 0 0 6px var(--success); }

.server-name {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text-primary);
}
.transport-tag {
  font-size: 0.65rem;
  margin-left: auto;
  background: rgba(125, 227, 255, 0.08);
  color: var(--nori-teal-soft);
  padding: 0.1rem 0.4rem;
  border-radius: 4px;
}

.server-cmd-row {
  font-size: 0.72rem;
  display: flex;
  gap: 0.3rem;
}
.cmd-label { color: var(--text-muted); }
.cmd-text {
  color: var(--text-body);
  background: rgba(19, 23, 31, 0.8);
  padding: 0.1rem 0.35rem;
  border-radius: 3px;
  font-family: monospace;
}

.server-tools-row {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.72rem;
}
.tools-label { color: var(--text-muted); }
.tools-chips-list {
  display: flex;
  gap: 0.3rem;
  flex-wrap: wrap;
}
.tool-chip-btn {
  display: flex;
  align-items: center;
  gap: 0.2rem;
  font-size: 0.68rem;
  background: rgba(94, 234, 212, 0.1);
  border: 1px solid rgba(94, 234, 212, 0.25);
  color: var(--nori-teal-bright);
  padding: 0.1rem 0.4rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}
.tool-chip-btn:hover {
  background: var(--nori-teal);
  color: var(--on-teal);
}

/* 审批卡片 */
.approval-card {
  background: rgba(23, 27, 34, 0.8);
  border: 1px solid rgba(241, 178, 74, 0.35);
  border-radius: 8px;
  overflow: hidden;
}
.approval-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0.8rem;
  background: rgba(241, 178, 74, 0.12);
  border-bottom: 1px solid rgba(241, 178, 74, 0.2);
}
.warning-badge {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.76rem;
  font-weight: 600;
  color: var(--warning);
}
.state-indicator {
  font-size: 0.68rem;
  padding: 0.1rem 0.4rem;
  border-radius: 4px;
}
.state-indicator.pending { background: rgba(241, 178, 74, 0.2); color: var(--warning); }
.state-indicator.approved { background: rgba(32, 224, 144, 0.2); color: var(--success); }
.state-indicator.rejected { background: rgba(251, 60, 68, 0.2); color: var(--danger-text); }

.approval-card-content {
  padding: 0.8rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}
.call-desc {
  font-size: 0.78rem;
  color: var(--text-body);
  margin: 0;
}
.tool-highlight {
  color: var(--nori-teal-bright);
  background: rgba(125, 227, 255, 0.1);
  padding: 0.1rem 0.35rem;
  border-radius: 3px;
  font-family: monospace;
}

.params-box {
  background: rgba(19, 23, 31, 0.9);
  border: 1px solid var(--line-subtle);
  border-radius: 6px;
  padding: 0.6rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  font-size: 0.74rem;
}
.param-item {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}
.param-item .pk { color: var(--text-muted); font-weight: 500; }
.param-item .pv { color: var(--text-primary); }
.param-item .pv.code {
  background: rgba(0, 0, 0, 0.4);
  padding: 0.4rem;
  border-radius: 4px;
  font-family: monospace;
  font-size: 0.7rem;
  margin: 0;
  white-space: pre-wrap;
}

.actions-row {
  display: flex;
  gap: 0.6rem;
  margin-top: 0.2rem;
}
.auth-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  padding: 0.45rem;
  border-radius: 6px;
  font-size: 0.76rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}
.auth-btn.allow {
  background: var(--success);
  color: #03101c;
}
.auth-btn.allow:hover { opacity: 0.9; transform: translateY(-1px); }
.auth-btn.deny {
  background: rgba(251, 60, 68, 0.18);
  border: 1px solid var(--danger);
  color: var(--danger-text);
}
.auth-btn.deny:hover { background: var(--danger); color: white; }

.result-box {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  padding: 0.6rem;
  border-radius: 6px;
  font-size: 0.75rem;
}
.result-box.approved {
  background: rgba(32, 224, 144, 0.12);
  border: 1px solid var(--success);
  color: var(--success);
}
.result-box.rejected {
  background: rgba(251, 60, 68, 0.12);
  border: 1px solid var(--danger);
  color: var(--danger-text);
}
.res-text {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

/* Modal */
.schema-modal-overlay {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  backdrop-filter: blur(4px);
}
.schema-modal {
  width: 90%;
  max-width: 440px;
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
  padding: 0.6rem 0.9rem;
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
.modal-close-btn {
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
}
.modal-close-btn:hover { color: var(--text-primary); }

.modal-body {
  padding: 0.8rem;
}
.schema-code {
  background: rgba(0, 0, 0, 0.5);
  padding: 0.8rem;
  border-radius: 6px;
  font-family: monospace;
  font-size: 0.72rem;
  color: var(--nori-teal-soft);
  margin: 0;
  max-height: 240px;
  overflow-y: auto;
}
</style>
