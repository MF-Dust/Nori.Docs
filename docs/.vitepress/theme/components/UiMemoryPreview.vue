<script setup lang="ts">
import { ref, computed } from 'vue'
import UiIcon from './UiIcon.vue'

interface MemoryAtom {
  id: string
  kind: 'preference' | 'factual' | 'relational' | 'planned'
  tag: '[WORLD_FACT]' | '[ARCHIVE_RECORD]' | '[NORI_KNOWS]' | '[NORI_ECHO]'
  content: string
  importance: number
  confidence: number
  status: 'active' | 'dormant'
  updatedAt: string
}

const activeCategory = ref<'all' | 'preference' | 'factual' | 'relational' | 'planned'>('all')
const searchQuery = ref('')
const isReflecting = ref(false)
const reflectionToast = ref('')

const memories = ref<MemoryAtom[]>([
  {
    id: 'mem_01',
    kind: 'preference',
    tag: '[NORI_KNOWS]',
    content: '用户喜欢在午后 3 点左右喝无糖乌龙茶，写前端代码时偏好沉浸式轻音乐。',
    importance: 0.92,
    confidence: 0.96,
    status: 'active',
    updatedAt: '2025-05-18 14:30'
  },
  {
    id: 'mem_02',
    kind: 'factual',
    tag: '[NORI_KNOWS]',
    content: '开发环境主力操作系统为 Windows 11 x64，主控制台使用 .NET 10 + Vue 3 架构。',
    importance: 0.88,
    confidence: 0.99,
    status: 'active',
    updatedAt: '2025-05-17 09:12'
  },
  {
    id: 'mem_03',
    kind: 'planned',
    tag: '[NORI_KNOWS]',
    content: '明天下午 15:30 安排了 Nori 跨平台 OpenGL ES 2.0 渲染性能评审会议。',
    importance: 0.85,
    confidence: 0.90,
    status: 'active',
    updatedAt: '2025-05-18 11:20'
  },
  {
    id: 'mem_04',
    kind: 'relational',
    tag: '[NORI_KNOWS]',
    content: '用户与 Nori 是共同构建智能桌面生态的开发者与亲密伙伴。',
    importance: 0.98,
    confidence: 1.0,
    status: 'active',
    updatedAt: '2025-05-15 18:00'
  },
  {
    id: 'mem_05',
    kind: 'factual',
    tag: '[WORLD_FACT]',
    content: '高维数据海中的先驱者遗迹档案，编号 ARG-702。',
    importance: 0.70,
    confidence: 0.85,
    status: 'dormant',
    updatedAt: '2025-05-10 12:00'
  },
  {
    id: 'mem_06',
    kind: 'preference',
    tag: '[NORI_ECHO]',
    content: '似乎在雨天时更喜欢暖色调的桌宠背景与柔和雨声白噪音。',
    importance: 0.65,
    confidence: 0.72,
    status: 'active',
    updatedAt: '2025-05-16 16:45'
  }
])

const filteredMemories = computed(() => {
  let list = memories.value
  if (activeCategory.value !== 'all') {
    list = list.filter(m => m.kind === activeCategory.value)
  }
  const q = searchQuery.value.trim().toLowerCase()
  if (q) {
    list = list.filter(m => m.content.toLowerCase().includes(q) || m.tag.toLowerCase().includes(q))
  }
  return list
})

// 计算搜索模拟分数
const getRetrievalScore = (atom: MemoryAtom) => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return null
  const hasKeyword = atom.content.toLowerCase().includes(q)
  const ftsScore = hasKeyword ? 0.95 : 0.1
  const vecScore = (atom.importance * 0.5 + (hasKeyword ? 0.45 : 0.25)).toFixed(2)
  const rrfScore = (1 / (60 + (hasKeyword ? 1 : 10)) + 1 / (60 + (hasKeyword ? 2 : 15))).toFixed(4)
  return { ftsScore, vecScore, rrfScore }
}

const triggerReflection = () => {
  isReflecting.value = true
  reflectionToast.value = '后台正在执行周期反思整理 (Reflection)...'

  setTimeout(() => {
    isReflecting.value = false
    reflectionToast.value = '反思完成！已合并 2 条相关语义偏好，更新了 1 条活跃待办。'
    setTimeout(() => {
      reflectionToast.value = ''
    }, 3000)
  }, 1200)
}
</script>

<template>
  <div class="nori-surface-card">
    <div class="card-header">
      <div class="header-left">
        <UiIcon name="server" :size="16" class="header-icon" />
        <span class="header-title">Living Memory 长期活体记忆与混合检索</span>
      </div>
      <div class="header-right">
        <span class="badge-chip">SQLite FTS5 + Vector (bge-m3)</span>
      </div>
    </div>

    <div class="card-body nori-scroll">
      <!-- 1. 记忆状态概览磁贴 -->
      <div class="stats-row">
        <div class="stat-box">
          <span class="stat-num">142</span>
          <span class="stat-name">总记忆原子数</span>
        </div>
        <div class="stat-box highlight">
          <span class="stat-num">6</span>
          <span class="stat-name">工作活跃记忆</span>
        </div>
        <div class="stat-box">
          <span class="stat-num">136</span>
          <span class="stat-name">情节归档库</span>
        </div>
        <div class="stat-box">
          <span class="stat-num">100%</span>
          <span class="stat-name">向量索引覆盖</span>
        </div>
      </div>

      <!-- 2. 搜索与反思触发栏 -->
      <div class="search-action-bar">
        <div class="search-input-box">
          <UiIcon name="search" :size="14" class="search-icon" />
          <input
            type="text"
            v-model="searchQuery"
            class="search-field"
            placeholder="输入检索关键词测试 RRF 混合融合得分 (如: 乌龙茶、会议、OpenGL)..."
          />
        </div>

        <button class="reflect-btn" :disabled="isReflecting" @click="triggerReflection">
          <UiIcon v-if="isReflecting" name="loading" :size="14" spin />
          <UiIcon v-else name="sparkles" :size="14" />
          <span>{{ isReflecting ? '正在反思沉淀...' : '手动反思整理 (Reflection)' }}</span>
        </button>
      </div>

      <div v-if="reflectionToast" class="reflection-alert">
        <UiIcon name="check" :size="14" />
        <span>{{ reflectionToast }}</span>
      </div>

      <!-- 3. 分类标签页 -->
      <div class="category-tabs">
        <button
          class="cat-tab"
          :class="{ active: activeCategory === 'all' }"
          @click="activeCategory = 'all'"
        >
          全部记忆 ({{ memories.length }})
        </button>
        <button
          class="cat-tab"
          :class="{ active: activeCategory === 'preference' }"
          @click="activeCategory = 'preference'"
        >
          用户偏好 (Preference)
        </button>
        <button
          class="cat-tab"
          :class="{ active: activeCategory === 'factual' }"
          @click="activeCategory = 'factual'"
        >
          客观事实 (Factual)
        </button>
        <button
          class="cat-tab"
          :class="{ active: activeCategory === 'planned' }"
          @click="activeCategory = 'planned'"
        >
          待办计划 (Planned)
        </button>
        <button
          class="cat-tab"
          :class="{ active: activeCategory === 'relational' }"
          @click="activeCategory = 'relational'"
        >
          关系认知 (Relational)
        </button>
      </div>

      <!-- 4. 记忆原子卡片列表 -->
      <div class="atoms-list">
        <div
          v-for="atom in filteredMemories"
          :key="atom.id"
          class="atom-card"
        >
          <div class="atom-header">
            <div class="atom-tags">
              <span class="kind-tag" :class="atom.kind">{{ atom.kind }}</span>
              <span class="cognitive-tag" :class="atom.tag">{{ atom.tag }}</span>
            </div>
            <span class="atom-time">{{ atom.updatedAt }}</span>
          </div>

          <div class="atom-content">
            {{ atom.content }}
          </div>

          <!-- 检索命中时的 RRF 计算分栏 -->
          <div v-if="getRetrievalScore(atom)" class="rrf-score-panel">
            <span class="score-tag">FTS5: {{ getRetrievalScore(atom)?.ftsScore }}</span>
            <span class="score-tag">Vector 相似度: {{ getRetrievalScore(atom)?.vecScore }}</span>
            <span class="score-tag rrf">RRF 融合分: {{ getRetrievalScore(atom)?.rrfScore }}</span>
          </div>

          <div class="atom-footer">
            <div class="metric-meter">
              <span class="m-label">重要度:</span>
              <div class="m-track">
                <div class="m-bar importance" :style="{ width: (atom.importance * 100) + '%' }"></div>
              </div>
              <span class="m-num">{{ atom.importance.toFixed(2) }}</span>
            </div>

            <div class="metric-meter">
              <span class="m-label">置信度:</span>
              <div class="m-track">
                <div class="m-bar confidence" :style="{ width: (atom.confidence * 100) + '%' }"></div>
              </div>
              <span class="m-num">{{ atom.confidence.toFixed(2) }}</span>
            </div>

            <span class="status-badge" :class="atom.status">
              {{ atom.status === 'active' ? '● 活跃常驻' : '○ 休眠归档' }}
            </span>
          </div>
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

.stats-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.8rem;
}
.stat-box {
  background: rgba(23, 27, 34, 0.6);
  border: 1px solid var(--line-subtle);
  border-radius: 8px;
  padding: 0.6rem 0.8rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.stat-box.highlight {
  border-color: rgba(94, 234, 212, 0.35);
  background: rgba(94, 234, 212, 0.08);
}
.stat-num {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text-primary);
}
.stat-box.highlight .stat-num { color: var(--nori-teal-bright); }
.stat-name {
  font-size: 0.7rem;
  color: var(--text-muted);
}

.search-action-bar {
  display: flex;
  gap: 0.8rem;
  align-items: center;
}
.search-input-box {
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
}
.search-icon {
  position: absolute;
  left: 0.7rem;
  color: var(--text-muted);
}
.search-field {
  width: 100%;
  background: rgba(19, 23, 31, 0.8);
  border: 1px solid var(--line-subtle);
  color: var(--text-primary);
  padding: 0.45rem 0.8rem 0.45rem 2.2rem;
  border-radius: 6px;
  font-size: 0.8rem;
  outline: none;
  transition: border-color 0.2s;
}
.search-field:focus {
  border-color: var(--nori-teal);
}

.reflect-btn {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.76rem;
  background: rgba(94, 234, 212, 0.15);
  border: 1px solid var(--nori-teal);
  color: var(--nori-teal-bright);
  padding: 0.45rem 0.9rem;
  border-radius: 6px;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s;
}
.reflect-btn:hover:not(:disabled) {
  background: var(--nori-teal);
  color: var(--on-teal);
}

.reflection-alert {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  background: rgba(32, 224, 144, 0.12);
  border: 1px solid var(--success);
  color: var(--success);
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  font-size: 0.76rem;
}

.category-tabs {
  display: flex;
  gap: 0.4rem;
  flex-wrap: wrap;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  padding-bottom: 0.6rem;
}
.cat-tab {
  font-size: 0.72rem;
  padding: 0.25rem 0.6rem;
  background: rgba(19, 23, 31, 0.8);
  border: 1px solid var(--line-subtle);
  border-radius: 4px;
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.2s;
}
.cat-tab:hover {
  border-color: var(--nori-teal);
  color: var(--text-primary);
}
.cat-tab.active {
  background: var(--nori-teal);
  color: var(--on-teal);
  font-weight: 600;
  border-color: var(--nori-teal);
}

.atoms-list {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}
.atom-card {
  background: rgba(23, 27, 34, 0.6);
  border: 1px solid var(--line-subtle);
  border-radius: 8px;
  padding: 0.8rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.atom-card:hover {
  background: rgba(36, 47, 61, 0.7);
  border-color: var(--line-strong);
}

.atom-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.atom-tags {
  display: flex;
  gap: 0.35rem;
}
.kind-tag {
  font-size: 0.65rem;
  text-transform: uppercase;
  padding: 0.1rem 0.35rem;
  border-radius: 3px;
  font-weight: 600;
}
.kind-tag.preference { background: rgba(94, 234, 212, 0.15); color: var(--nori-teal-bright); }
.kind-tag.factual { background: rgba(125, 227, 255, 0.15); color: #7fd4e8; }
.kind-tag.planned { background: rgba(241, 178, 74, 0.15); color: var(--warning); }
.kind-tag.relational { background: rgba(236, 72, 153, 0.15); color: #f472b6; }

.cognitive-tag {
  font-size: 0.65rem;
  background: rgba(0, 0, 0, 0.3);
  color: var(--text-muted);
  padding: 0.1rem 0.35rem;
  border-radius: 3px;
}

.atom-time {
  font-size: 0.68rem;
  color: var(--text-faint);
}

.atom-content {
  font-size: 0.8rem;
  color: var(--text-primary);
  line-height: 1.4;
}

.rrf-score-panel {
  display: flex;
  gap: 0.4rem;
  padding: 0.3rem 0.5rem;
  background: rgba(19, 23, 31, 0.85);
  border-radius: 4px;
  font-size: 0.7rem;
}
.score-tag {
  color: var(--text-muted);
}
.score-tag.rrf {
  color: var(--nori-teal-bright);
  font-weight: 600;
  margin-left: auto;
}

.atom-footer {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 0.7rem;
  border-top: 1px solid rgba(255, 255, 255, 0.04);
  padding-top: 0.4rem;
}
.metric-meter {
  display: flex;
  align-items: center;
  gap: 0.3rem;
}
.m-label { color: var(--text-muted); }
.m-track {
  width: 50px;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;
}
.m-bar {
  height: 100%;
}
.m-bar.importance { background: var(--nori-teal); }
.m-bar.confidence { background: var(--success); }
.m-num { color: var(--text-body); font-weight: 500; }

.status-badge {
  margin-left: auto;
  font-size: 0.68rem;
}
.status-badge.active { color: var(--success); }
.status-badge.dormant { color: var(--text-faint); }
</style>
