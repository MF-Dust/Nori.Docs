<script setup lang="ts">
import { ref, computed } from 'vue'
import UiIcon from './UiIcon.vue'

type NavTab = 'home' | 'talk' | 'model' | 'memory' | 'settings'

const activeTab = ref<NavTab>('home')
const isSidebarCollapsed = ref(false)
const petVisible = ref(true)
const randomMotionFeedback = ref('')
let feedbackTimer: any = null

const navItems = [
  { key: 'home' as NavTab, label: '主页', icon: 'noriOS' },
  { key: 'talk' as NavTab, label: '对话', icon: 'send' },
  { key: 'model' as NavTab, label: '模型', icon: 'package' },
  { key: 'memory' as NavTab, label: '记忆', icon: 'server' },
  { key: 'settings' as NavTab, label: '设置', icon: 'settings', badge: false }
]

const stats = [
  { key: 'ai', icon: 'cpu', label: 'AI 大模型', value: '就绪', hint: 'deepseek-chat', tone: 'teal' },
  { key: 'skills', icon: 'sparkles', label: '活跃技能', value: '4 项', hint: '代码审查 / 待办管家', tone: 'teal' },
  { key: 'tools', icon: 'tool', label: '原生工具', value: '8 项', hint: '时间 / 截屏 / 音频', tone: 'teal' },
  { key: 'mcp', icon: 'server', label: 'MCP 服务', value: '3 组', hint: '文件系统 / 网页请求', tone: 'neutral' }
]

const triggerRandomMotion = () => {
  randomMotionFeedback.value = '已触发 Live2D 随机待机动作: TapHead (点头微笑)'
  if (feedbackTimer) clearTimeout(feedbackTimer)
  feedbackTimer = setTimeout(() => {
    randomMotionFeedback.value = ''
  }, 2500)
}
</script>

<template>
  <div class="nori-window-container">
    <div class="nori-window-root">
      <!-- 窗口标题栏 -->
      <div class="nori-titlebar">
        <div class="traffic-lights">
          <span class="traffic-btn close"></span>
          <span class="traffic-btn min"></span>
          <span class="traffic-btn zoom"></span>
        </div>
        <div class="window-title-box">
          <UiIcon name="noriOS" :size="15" class="title-icon" />
          <span class="window-title">Nori 控制中心 · 主控制台</span>
        </div>
        <div class="titlebar-right">
          <span class="safe-badge">常驻运行</span>
          <span class="version-chip">v1.0.0-dust</span>
        </div>
      </div>

      <!-- 核心窗口主体 (侧边栏 + 内容区) -->
      <div class="main-body-layout">
        <!-- 可折叠侧边导航栏 -->
        <div class="nori-sidebar" :class="{ collapsed: isSidebarCollapsed }">
          <div class="nav-items-list">
            <button
              v-for="item in navItems"
              :key="item.key"
              class="nav-tab-btn"
              :class="{ active: activeTab === item.key }"
              @click="activeTab = item.key"
            >
              <UiIcon :name="item.icon" :size="17" />
              <span v-if="!isSidebarCollapsed" class="nav-tab-label">{{ item.label }}</span>
              <span v-if="item.badge && !isSidebarCollapsed" class="nav-dot-badge"></span>
            </button>
          </div>

          <div class="sidebar-footer">
            <button
              class="collapse-toggle-btn"
              @click="isSidebarCollapsed = !isSidebarCollapsed"
              :title="isSidebarCollapsed ? '展开侧边栏' : '折叠侧边栏'"
            >
              <UiIcon :name="isSidebarCollapsed ? 'arrow-right' : 'arrow-left'" :size="14" />
              <span v-if="!isSidebarCollapsed" class="collapse-label">收起侧栏</span>
            </button>
          </div>
        </div>

        <!-- 面板内容区 -->
        <div class="main-content-panel nori-scroll">
          <!-- 1. 主页视图 (HomePanel) -->
          <div v-if="activeTab === 'home'" class="home-view">
            <!-- 角色舞台卡片 (Character Stage) -->
            <div class="character-stage-card">
              <div class="avatar-box">
                <img src="/images/ARGNori.webp" class="stage-avatar" alt="ARG Nori" />
              </div>

              <div class="stage-info">
                <div class="model-title-row">
                  <span class="model-title-text">Nori (ARG Nori)</span>
                  <span class="status-chip active">
                    <span class="status-pulse-dot"></span>
                    <span>桌宠活跃中</span>
                  </span>
                </div>
                <div class="model-description">
                  基于原生 OpenGL ES 2.0 驱动的 Live2D 桌面智能伴侣，已激活全量动作表情与 Living Memory 长期认知库。
                </div>

                <div class="stage-actions-row">
                  <button class="stage-btn outline" @click="petVisible = !petVisible">
                    <UiIcon :name="petVisible ? 'eye' : 'eye'" :size="13" />
                    <span>{{ petVisible ? '隐藏桌宠视窗' : '召唤桌宠视窗' }}</span>
                  </button>
                  <button class="stage-btn primary" @click="triggerRandomMotion">
                    <UiIcon name="sparkles" :size="13" />
                    <span>触发随机动作</span>
                  </button>
                </div>

                <div v-if="randomMotionFeedback" class="motion-toast">
                  {{ randomMotionFeedback }}
                </div>
              </div>
            </div>

            <!-- 运行概况指标 (4 Stat Tiles) -->
            <div class="stats-grid">
              <div
                v-for="st in stats"
                :key="st.key"
                class="stat-tile"
              >
                <div class="stat-top-row">
                  <div class="stat-icon-wrap">
                    <UiIcon :name="st.icon" :size="16" />
                  </div>
                  <span class="stat-value">{{ st.value }}</span>
                </div>
                <div class="stat-label">{{ st.label }}</div>
                <div class="stat-hint">{{ st.hint }}</div>
              </div>
            </div>

            <!-- 快捷前往磁贴网格 -->
            <div class="quick-nav-section">
              <span class="section-title">快捷前往模块</span>
              <div class="quick-nav-grid">
                <div class="quick-tile" @click="activeTab = 'talk'">
                  <UiIcon name="send" :size="20" class="qt-icon" />
                  <div class="qt-text">
                    <div class="qt-title">AI 对话中心</div>
                    <div class="qt-desc">进入全功能流式交互与语音窗口</div>
                  </div>
                </div>

                <div class="quick-tile" @click="activeTab = 'model'">
                  <UiIcon name="package" :size="20" class="qt-icon" />
                  <div class="qt-text">
                    <div class="qt-title">Live2D 模型管理</div>
                    <div class="qt-desc">调整视口缩放、不透明度与触摸热区</div>
                  </div>
                </div>

                <div class="quick-tile" @click="activeTab = 'memory'">
                  <UiIcon name="server" :size="20" class="qt-icon" />
                  <div class="qt-text">
                    <div class="qt-title">Living Memory 记忆</div>
                    <div class="qt-desc">浏览结构化记忆原子与知识检索</div>
                  </div>
                </div>

                <div class="quick-tile" @click="activeTab = 'settings'">
                  <UiIcon name="settings" :size="20" class="qt-icon" />
                  <div class="qt-text">
                    <div class="qt-title">系统多维设置</div>
                    <div class="qt-desc">配置大模型、语音合成与 MCP 服务</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 2. 对话视图快捷切换提示 -->
          <div v-else-if="activeTab === 'talk'" class="tab-placeholder-view">
            <UiIcon name="send" :size="36" class="placeholder-icon" />
            <h3 class="ph-title">AI 智能对话面板</h3>
            <p class="ph-desc">支持流式打字机输出、Markdown 语法渲染、实时表情动作与高危工具人工审批。</p>
            <button class="back-home-btn" @click="activeTab = 'home'">返回主页概览</button>
          </div>

          <!-- 3. 模型视图快捷切换提示 -->
          <div v-else-if="activeTab === 'model'" class="tab-placeholder-view">
            <UiIcon name="package" :size="36" class="placeholder-icon" />
            <h3 class="ph-title">Live2D 模型与外观管理</h3>
            <p class="ph-desc">支持本地 ZIP 模型安全导入、透明穿透算法热调与三区域触摸互动编辑。</p>
            <button class="back-home-btn" @click="activeTab = 'home'">返回主页概览</button>
          </div>

          <!-- 4. 记忆视图快捷切换提示 -->
          <div v-else-if="activeTab === 'memory'" class="tab-placeholder-view">
            <UiIcon name="server" :size="36" class="placeholder-icon" />
            <h3 class="ph-title">Living Memory 活体记忆库</h3>
            <p class="ph-desc">基于 SQLite FTS5 与 Vector 向量的三路混合检索与多维度认知分类体系。</p>
            <button class="back-home-btn" @click="activeTab = 'home'">返回主页概览</button>
          </div>

          <!-- 5. 设置视图快捷切换提示 -->
          <div v-else-if="activeTab === 'settings'" class="tab-placeholder-view">
            <UiIcon name="settings" :size="36" class="placeholder-icon" />
            <h3 class="ph-title">多维系统设置中心</h3>
            <p class="ph-desc">包含 AI 大模型、语音合成 TTS、主动搭讪提醒、MCP 协议与 NPS 2.0 插件。</p>
            <button class="back-home-btn" @click="activeTab = 'home'">返回主页概览</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.nori-window-container {
  margin: 1.5rem 0;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: var(--shadow-window);
  background: var(--bg-deep);
}

.nori-window-root {
  display: flex;
  flex-direction: column;
  height: 560px;
  background: radial-gradient(110rem 70rem at 90% 0%, var(--glow-teal-soft) 0%, transparent 60%),
    linear-gradient(165deg, var(--bg-panel) 0%, var(--bg-deep) 45%, var(--bg-abyss) 100%);
  border: 1px solid var(--line-subtle);
  border-radius: 12px;
  color: var(--text-body);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  user-select: none;
}

/* 标题栏 */
.nori-titlebar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.6rem 1rem;
  background: rgba(19, 23, 31, 0.7);
  border-bottom: 1px solid var(--line-subtle);
}
.traffic-lights {
  display: flex;
  gap: 0.45rem;
}
.traffic-btn {
  width: 11px;
  height: 11px;
  border-radius: 50%;
}
.traffic-btn.close { background: var(--traffic-close); }
.traffic-btn.min { background: var(--traffic-minimize); }
.traffic-btn.zoom { background: var(--traffic-zoom); }

.window-title-box {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}
.title-icon { color: var(--nori-teal); }
.window-title {
  font-size: 0.82rem;
  font-weight: 500;
  color: var(--text-primary);
}

.titlebar-right {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}
.safe-badge {
  font-size: 0.68rem;
  color: var(--success);
  background: rgba(32, 224, 144, 0.12);
  padding: 0.1rem 0.4rem;
  border-radius: 4px;
}
.version-chip {
  font-size: 0.7rem;
  background: rgba(125, 227, 255, 0.1);
  color: var(--nori-teal-soft);
  padding: 0.15rem 0.5rem;
  border-radius: 9999px;
  border: 1px solid var(--line-subtle);
}

/* 核心布局 */
.main-body-layout {
  display: flex;
  flex: 1;
  overflow: hidden;
}

/* 侧边栏 */
.nori-sidebar {
  width: 140px;
  background: rgba(23, 27, 34, 0.6);
  border-right: 1px solid var(--line-subtle);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 0.6rem 0.4rem;
  transition: width 0.2s ease-in-out;
}
.nori-sidebar.collapsed {
  width: 52px;
}

.nav-items-list {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}
.nav-tab-btn {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.55rem 0.7rem;
  border-radius: 6px;
  background: transparent;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.2s;
}
.nav-tab-btn:hover {
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-primary);
}
.nav-tab-btn.active {
  background: rgba(94, 234, 212, 0.15);
  color: var(--nori-teal-bright);
  font-weight: 600;
  border-left: 2px solid var(--nori-teal);
}
.nav-tab-label {
  font-size: 0.8rem;
  white-space: nowrap;
}

.sidebar-footer {
  border-top: 1px solid var(--line-subtle);
  padding-top: 0.4rem;
}
.collapse-toggle-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.4rem 0.6rem;
  background: none;
  border: none;
  color: var(--text-muted);
  font-size: 0.72rem;
  cursor: pointer;
  border-radius: 4px;
}
.collapse-toggle-btn:hover {
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-primary);
}

/* 主内容面板 */
.main-content-panel {
  flex: 1;
  padding: 1.2rem 1.6rem;
}

.home-view {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

/* 角色舞台卡片 */
.character-stage-card {
  display: flex;
  align-items: center;
  gap: 1.4rem;
  background: rgba(28, 35, 47, 0.65);
  border: 1px solid var(--line-subtle);
  border-radius: 10px;
  padding: 1rem 1.2rem;
  backdrop-filter: blur(12px);
}
.avatar-box {
  width: 90px;
  height: 90px;
  border-radius: 10px;
  background: radial-gradient(circle at 50% 50%, rgba(94, 234, 212, 0.15) 0%, transparent 70%);
  border: 1px solid var(--line-subtle);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  flex-shrink: 0;
}
.stage-avatar {
  max-height: 90%;
  object-fit: contain;
  filter: drop-shadow(0 4px 10px rgba(0, 0, 0, 0.5));
}

.stage-info {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  flex: 1;
}
.model-title-row {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}
.model-title-text {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text-primary);
}
.status-chip {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.7rem;
  padding: 0.15rem 0.45rem;
  border-radius: 9999px;
  background: rgba(32, 224, 144, 0.15);
  color: var(--success);
}
.status-pulse-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--success);
  box-shadow: 0 0 6px var(--success);
}
.model-description {
  font-size: 0.78rem;
  color: var(--text-muted);
  line-height: 1.4;
}

.stage-actions-row {
  display: flex;
  gap: 0.6rem;
  margin-top: 0.2rem;
}
.stage-btn {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.75rem;
  padding: 0.35rem 0.8rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}
.stage-btn.outline {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--line-subtle);
  color: var(--text-body);
}
.stage-btn.outline:hover { background: rgba(255, 255, 255, 0.1); color: var(--text-primary); }
.stage-btn.primary {
  background: rgba(94, 234, 212, 0.15);
  border: 1px solid var(--nori-teal);
  color: var(--nori-teal-bright);
}
.stage-btn.primary:hover { background: var(--nori-teal); color: var(--on-teal); }

.motion-toast {
  font-size: 0.72rem;
  color: var(--nori-teal-bright);
  background: rgba(19, 23, 31, 0.8);
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  border-left: 2px solid var(--nori-teal);
  margin-top: 0.2rem;
}

/* 4 Stat Tiles */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.8rem;
}
.stat-tile {
  background: rgba(23, 27, 34, 0.6);
  border: 1px solid var(--line-subtle);
  border-radius: 8px;
  padding: 0.7rem 0.8rem;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  transition: all 0.2s;
}
.stat-tile:hover {
  background: rgba(36, 47, 61, 0.7);
  border-color: var(--line-strong);
}
.stat-top-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.stat-icon-wrap {
  color: var(--nori-teal);
}
.stat-value {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--text-primary);
}
.stat-label {
  font-size: 0.74rem;
  color: var(--text-muted);
}
.stat-hint {
  font-size: 0.68rem;
  color: var(--text-faint);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 快捷前往 */
.quick-nav-section {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}
.section-title {
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--text-primary);
}
.quick-nav-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.8rem;
}
.quick-tile {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  background: rgba(28, 35, 47, 0.65);
  border: 1px solid var(--line-subtle);
  border-radius: 8px;
  padding: 0.8rem 1rem;
  cursor: pointer;
  transition: all 0.2s;
}
.quick-tile:hover {
  background: rgba(36, 47, 61, 0.85);
  border-color: var(--nori-teal);
  transform: translateY(-1px);
}
.qt-icon { color: var(--nori-teal-bright); }
.qt-title {
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--text-primary);
}
.qt-desc {
  font-size: 0.72rem;
  color: var(--text-muted);
}

/* 占位子页提示 */
.tab-placeholder-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 380px;
  text-align: center;
  gap: 0.6rem;
}
.placeholder-icon {
  color: var(--nori-teal);
  margin-bottom: 0.4rem;
}
.ph-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}
.ph-desc {
  font-size: 0.8rem;
  color: var(--text-muted);
  max-width: 440px;
  margin: 0;
  line-height: 1.5;
}
.back-home-btn {
  margin-top: 0.6rem;
  background: rgba(94, 234, 212, 0.15);
  border: 1px solid var(--nori-teal);
  color: var(--nori-teal-bright);
  padding: 0.4rem 1rem;
  border-radius: 6px;
  font-size: 0.78rem;
  cursor: pointer;
}
.back-home-btn:hover {
  background: var(--nori-teal);
  color: var(--on-teal);
}
</style>
