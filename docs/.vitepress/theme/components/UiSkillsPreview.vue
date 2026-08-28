<script setup lang="ts">
import { ref, computed } from 'vue'
import UiIcon from './UiIcon.vue'

type SkillCategory = 'all' | 'coding' | 'productivity' | 'life' | 'roleplay'

const selectedCategory = ref<SkillCategory>('all')

const skills = ref([
  {
    id: 'code_reviewer',
    name: '代码审查与重构助理 (Code Reviewer)',
    category: 'coding',
    description: '专注于深度的代码分析、潜在 Bug 诊断、复杂度审查与架构重构建议。',
    instructions: '你是一名资深软件架构师。请以严苛但富有建设性的视角审查代码...',
    tools: ['read_file', 'git_diff', 'lsp_diagnostics'],
    enabled: true
  },
  {
    id: 'task_organizer',
    name: '待办与日程管家 (Task Organizer)',
    category: 'productivity',
    description: '协助梳理每日工作计划、拆解复杂工程任务与设置关键时间节点备忘。',
    instructions: '你是一名高效的项目管理秘书。请用清晰的 Markdown Checklist 组织任务...',
    tools: ['getTime', 'set_reminder', 'write_file'],
    enabled: true
  },
  {
    id: 'gaming_partner',
    name: '游戏联机玩伴 (Gaming Partner)',
    category: 'life',
    description: '充满活力的游戏搭子模式，支持 Steam 战绩查询、游戏攻略分析与趣味吐槽。',
    instructions: '你是一名热爱各类游戏的高玩Nori，性格活泼元气...',
    tools: ['steam_status', 'search_game_wiki'],
    enabled: false
  },
  {
    id: 'translator_pro',
    name: '地道同声传译 (Translator Pro)',
    category: 'productivity',
    description: '提供精准的中/英/日双语对照互译，自动润色口语表达与行业术语解释。',
    instructions: '你是一名同声传译专家，直接输出优质译文与重点生词解析...',
    tools: ['translate_text'],
    enabled: true
  },
  {
    id: 'cyber_companion',
    name: '赛博朋克沉浸设定 (Cyber Companion)',
    category: 'roleplay',
    description: '强化高维数据海与未来科技世界观背景，沉浸式科幻伴侣人设。',
    instructions: '在对话中自然融入数据流、高维空间与神经链接等世界观术语...',
    tools: ['play_soundtrack'],
    enabled: false
  }
])

const reminders = ref([
  {
    id: 'rem_01',
    title: '补充水分与休息 (Drink Water)',
    time: '还有 18 分钟',
    desc: '已连续工作 45 分钟，喝杯温水并眺望远方放松眼睛。',
    status: 'pending'
  },
  {
    id: 'rem_02',
    title: '久坐健康关怀 (Idle Check-in)',
    time: '空闲触发 (60 分钟)',
    desc: '当检测到键盘鼠标无操作超过设定阈值时，自动轻声询问是否在休息。',
    status: 'active'
  },
  {
    id: 'rem_03',
    title: '每日早间问候 (Daily Greeting)',
    time: '每天 09:00 AM',
    desc: '每日首次回到电脑前时，桌宠主动做出招手动作并播报早间问候与天气。',
    status: 'active'
  }
])

const filteredSkills = computed(() => {
  if (selectedCategory.value === 'all') return skills.value
  return skills.value.filter(s => s.category === selectedCategory.value)
})

const snoozeReminder = (remId: string) => {
  const rem = reminders.value.find(r => r.id === remId)
  if (rem) {
    rem.time = '已推迟 10 分钟后提醒'
  }
}

const completeReminder = (remId: string) => {
  const rem = reminders.value.find(r => r.id === remId)
  if (rem) {
    rem.status = 'completed'
  }
}
</script>

<template>
  <div class="nori-surface-card">
    <div class="card-header">
      <div class="header-left">
        <UiIcon name="sparkles" :size="16" class="header-icon" />
        <span class="header-title">可编程技能体系 (Skills) 与主动关怀调度器</span>
      </div>
      <div class="header-right">
        <span class="badge-chip">Proactive Scheduler</span>
      </div>
    </div>

    <div class="card-body nori-scroll">
      <!-- 1. 技能市场分类 -->
      <div class="section-box">
        <div class="section-heading-row">
          <div class="heading-title">
            <UiIcon name="sparkles" :size="14" />
            <span>技能扩展库 (已启用 {{ skills.filter(s => s.enabled).length }} / {{ skills.length }})</span>
          </div>

          <div class="cat-pill-bar">
            <button
              class="cat-pill"
              :class="{ active: selectedCategory === 'all' }"
              @click="selectedCategory = 'all'"
            >
              全部
            </button>
            <button
              class="cat-pill"
              :class="{ active: selectedCategory === 'coding' }"
              @click="selectedCategory = 'coding'"
            >
              编程专精
            </button>
            <button
              class="cat-pill"
              :class="{ active: selectedCategory === 'productivity' }"
              @click="selectedCategory = 'productivity'"
            >
              生产力
            </button>
            <button
              class="cat-pill"
              :class="{ active: selectedCategory === 'life' }"
              @click="selectedCategory = 'life'"
            >
              日常陪伴
            </button>
            <button
              class="cat-pill"
              :class="{ active: selectedCategory === 'roleplay' }"
              @click="selectedCategory = 'roleplay'"
            >
              角色扮演
            </button>
          </div>
        </div>

        <div class="skills-grid">
          <div
            v-for="sk in filteredSkills"
            :key="sk.id"
            class="skill-card"
            :class="{ active: sk.enabled }"
          >
            <div class="skill-card-top">
              <div class="skill-name-col">
                <span class="skill-name">{{ sk.name }}</span>
                <span class="skill-desc">{{ sk.description }}</span>
              </div>
              <label class="nori-switch">
                <input type="checkbox" v-model="sk.enabled" />
                <span class="slider"></span>
              </label>
            </div>

            <div class="skill-tools-row">
              <span class="tools-label">权限工具:</span>
              <div class="tool-tags">
                <span v-for="t in sk.tools" :key="t" class="tool-tag">
                  <UiIcon name="tool" :size="11" /> {{ t }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 2. 主动感知与生活提醒调度器 -->
      <div class="section-box">
        <div class="section-heading-row">
          <div class="heading-title">
            <UiIcon name="bell" :size="14" />
            <span>生活关怀与定时待办调度 (Proactive Scheduler)</span>
          </div>
        </div>

        <div class="reminders-list">
          <div
            v-for="rem in reminders"
            :key="rem.id"
            class="reminder-item"
            :class="{ done: rem.status === 'completed' }"
          >
            <div class="rem-icon-box">
              <UiIcon name="clock" :size="16" />
            </div>

            <div class="rem-info">
              <div class="rem-title-row">
                <span class="rem-title">{{ rem.title }}</span>
                <span class="rem-time-tag">{{ rem.time }}</span>
              </div>
              <span class="rem-desc">{{ rem.desc }}</span>
            </div>

            <div class="rem-actions" v-if="rem.status !== 'completed'">
              <button class="rem-btn snooze" @click="snoozeReminder(rem.id)">
                推迟 10 分钟
              </button>
              <button class="rem-btn complete" @click="completeReminder(rem.id)">
                <UiIcon name="check" :size="12" /> 完成
              </button>
            </div>
            <span v-else class="done-tag">✓ 已完成</span>
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

.section-box {
  background: rgba(23, 27, 34, 0.5);
  border: 1px solid var(--line-subtle);
  border-radius: 8px;
  padding: 0.8rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.section-heading-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  padding-bottom: 0.5rem;
  flex-wrap: wrap;
  gap: 0.5rem;
}
.heading-title {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--text-primary);
}

.cat-pill-bar {
  display: flex;
  gap: 0.3rem;
}
.cat-pill {
  font-size: 0.7rem;
  padding: 0.15rem 0.5rem;
  background: rgba(19, 23, 31, 0.8);
  border: 1px solid var(--line-subtle);
  border-radius: 4px;
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.2s;
}
.cat-pill:hover { border-color: var(--nori-teal); color: var(--text-primary); }
.cat-pill.active {
  background: var(--nori-teal);
  color: var(--on-teal);
  font-weight: 600;
  border-color: var(--nori-teal);
}

.skills-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.7rem;
}
.skill-card {
  background: rgba(23, 27, 34, 0.6);
  border: 1px solid var(--line-subtle);
  border-radius: 8px;
  padding: 0.7rem 0.9rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  transition: all 0.2s;
}
.skill-card.active {
  border-color: rgba(94, 234, 212, 0.35);
  background: rgba(36, 47, 61, 0.65);
}

.skill-card-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.5rem;
}
.skill-name-col {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}
.skill-name {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text-primary);
}
.skill-desc {
  font-size: 0.72rem;
  color: var(--text-muted);
  line-height: 1.35;
}

.skill-tools-row {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.7rem;
}
.tools-label { color: var(--text-faint); }
.tool-tags {
  display: flex;
  gap: 0.3rem;
  flex-wrap: wrap;
}
.tool-tag {
  display: flex;
  align-items: center;
  gap: 0.2rem;
  font-size: 0.65rem;
  background: rgba(125, 227, 255, 0.08);
  color: var(--nori-teal-soft);
  padding: 0.1rem 0.35rem;
  border-radius: 3px;
}

/* 提醒列表 */
.reminders-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.reminder-item {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  background: rgba(23, 27, 34, 0.6);
  border: 1px solid var(--line-subtle);
  border-radius: 8px;
  padding: 0.6rem 0.9rem;
}
.reminder-item.done { opacity: 0.5; }

.rem-icon-box {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  background: rgba(94, 234, 212, 0.1);
  color: var(--nori-teal);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.rem-info {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  flex: 1;
}
.rem-title-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.rem-title {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text-primary);
}
.rem-time-tag {
  font-size: 0.68rem;
  color: var(--warning);
  background: rgba(241, 178, 74, 0.12);
  padding: 0.1rem 0.35rem;
  border-radius: 3px;
}
.rem-desc {
  font-size: 0.72rem;
  color: var(--text-muted);
}

.rem-actions {
  display: flex;
  gap: 0.4rem;
}
.rem-btn {
  font-size: 0.7rem;
  padding: 0.25rem 0.55rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}
.rem-btn.snooze {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--line-subtle);
  color: var(--text-body);
}
.rem-btn.snooze:hover { background: rgba(255, 255, 255, 0.1); color: var(--text-primary); }
.rem-btn.complete {
  background: rgba(32, 224, 144, 0.15);
  border: 1px solid var(--success);
  color: var(--success);
  display: flex;
  align-items: center;
  gap: 0.2rem;
}
.rem-btn.complete:hover { background: var(--success); color: #03101c; }
.done-tag {
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
