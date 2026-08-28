<script setup lang="ts">
import { ref, onBeforeUnmount } from 'vue'
import UiIcon from './UiIcon.vue'

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  motion?: string
  emotion?: string
  toolCall?: { name: string; status: 'done' | 'running'; result?: string }
}

const inputPrompt = ref('')
const isStreaming = ref(false)
const isPlayingAudio = ref(false)
const audioLevel = ref(0)
let audioTimer: any = null

const messages = ref<ChatMessage[]>([
  {
    id: 'm1',
    role: 'user',
    content: '你好呀 Nori！今天有什么好玩的事情吗？'
  },
  {
    id: 'm2',
    role: 'assistant',
    content: '你好呀！今天天气很棒，我的 Live2D 渲染核心与 Living Memory 知识库也已经全部就绪啦！随时准备陪你聊天、写代码或者处理桌面事务哦~ ✨',
    motion: 'TapHead (点头微笑)',
    emotion: 'happy (开心)',
    toolCall: {
      name: 'get_system_time',
      status: 'done',
      result: '2025-05-18 15:42:08'
    }
  }
])

const quickStarters = [
  '你好呀 Nori！',
  '你能帮我做什么？',
  '做个开心的动作吧！',
  '查询一下当前系统时间'
]

const sendStarter = (text: string) => {
  inputPrompt.value = text
  sendMessage()
}

const sendMessage = () => {
  if (!inputPrompt.value.trim() || isStreaming.value) return
  const userText = inputPrompt.value.trim()
  inputPrompt.value = ''

  messages.value.push({
    id: `u_${Date.now()}`,
    role: 'user',
    content: userText
  })

  isStreaming.value = true

  setTimeout(() => {
    let replyText = '收到啦！我已经通过本地 Living Memory 检索到相关信息，并完成了指令解析~'
    let motion = 'TapBody (挥手致意)'
    let emotion = 'normal (自然)'

    if (userText.includes('时间')) {
      replyText = '当前系统本地时间为 15:42:10，距离你设定的番茄工作法休息还有 18 分钟哦！'
      motion = 'TapHead (点头)'
      emotion = 'happy (开心)'
    } else if (userText.includes('动作')) {
      replyText = '哼哼~ 给你展示一个元气满满的歪头招手动作！ Live2D 物理摆动和视线跟随也都正常运转中！'
      motion = 'PokeFace (轻微脸红)'
      emotion = 'shy (害羞)'
    } else if (userText.includes('做')) {
      replyText = '我是你的全能桌面伙伴！支持：\n- 🖥️ Live2D 视口互动与换装\n- 🧠 Living Memory 长期认知成长\n- 🎙️ 全链路语音对话与实时口型同步\n- 🔌 MCP 外部工具协议扩展'
    }

    messages.value.push({
      id: `a_${Date.now()}`,
      role: 'assistant',
      content: replyText,
      motion,
      emotion
    })
    isStreaming.value = false
  }, 700)
}

const toggleAudioPlay = () => {
  isPlayingAudio.value = !isPlayingAudio.value
  if (isPlayingAudio.value) {
    audioTimer = setInterval(() => {
      audioLevel.value = Math.random() * 0.75 + 0.2
    }, 90)
  } else {
    clearInterval(audioTimer)
    audioLevel.value = 0
  }
}

const clearChat = () => {
  messages.value = [
    {
      id: 'm1',
      role: 'assistant',
      content: '对话记录已清空。随时输入问题，我们重新开始吧！',
      motion: 'TapHead (歪头)',
      emotion: 'happy (开心)'
    }
  ]
}

onBeforeUnmount(() => {
  if (audioTimer) clearInterval(audioTimer)
})
</script>

<template>
  <div class="nori-surface-card">
    <!-- 对话顶栏 -->
    <div class="chat-header">
      <div class="chat-header-left">
        <div class="model-badge">
          <UiIcon name="cpu" :size="13" />
          <span>deepseek-chat</span>
        </div>
        <span class="metric-tag">延迟: 86ms</span>
        <span class="metric-tag">上下文: 1.2k / 128k</span>
      </div>
      <div class="chat-header-right">
        <button class="header-action-btn" title="清空对话" @click="clearChat">
          <UiIcon name="trash" :size="13" />
        </button>
      </div>
    </div>

    <!-- 对话消息视口 -->
    <div class="chat-viewport nori-scroll">
      <div
        v-for="msg in messages"
        :key="msg.id"
        class="bubble-row"
        :class="msg.role"
      >
        <!-- 伴侣头像 -->
        <img
          v-if="msg.role === 'assistant'"
          src="/logo.png"
          class="assistant-avatar"
          alt="Nori Avatar"
        />

        <!-- 气泡内容 -->
        <div class="bubble" :class="`${msg.role}-bubble`">
          <!-- 工具调用状态条 -->
          <div v-if="msg.toolCall" class="tool-call-badge">
            <UiIcon name="tool" :size="12" />
            <span>调用工具: <code>{{ msg.toolCall.name }}</code> (返回: {{ msg.toolCall.result }})</span>
          </div>

          <div class="bubble-text">{{ msg.content }}</div>

          <!-- 动作与情绪标签 (伴侣专属) -->
          <div v-if="msg.role === 'assistant' && msg.motion" class="tag-row">
            <span class="tag-badge motion">
              <UiIcon name="activity" :size="11" /> 动作: {{ msg.motion }}
            </span>
            <span class="tag-badge emotion">
              <UiIcon name="sparkles" :size="11" /> 表情: {{ msg.emotion }}
            </span>
          </div>
        </div>
      </div>

      <div v-if="isStreaming" class="bubble-row assistant">
        <img src="/logo.png" class="assistant-avatar nori-spin" alt="Nori Avatar" />
        <div class="bubble assistant-bubble streaming-bubble">
          <span class="typing-dot"></span>
          <span class="typing-dot"></span>
          <span class="typing-dot"></span>
          <span class="typing-text">Nori 正在思考与生成回复...</span>
        </div>
      </div>
    </div>

    <!-- 引导词 Chips -->
    <div class="quick-starters-bar">
      <span class="starter-label">快捷提问:</span>
      <button
        v-for="st in quickStarters"
        :key="st"
        class="starter-chip"
        @click="sendStarter(st)"
      >
        {{ st }}
      </button>
    </div>

    <!-- 实时口型同步能量条仿真 -->
    <div class="lip-sync-bar">
      <button
        type="button"
        class="voice-toggle-btn"
        :class="{ playing: isPlayingAudio }"
        @click="toggleAudioPlay"
      >
        <UiIcon v-if="isPlayingAudio" name="pause" :size="13" />
        <UiIcon v-else name="volume" :size="13" />
        <span>{{ isPlayingAudio ? '停止口型仿真' : '播放语音 & RMS 口型同步' }}</span>
      </button>

      <div class="meter-col">
        <div class="meter-info">
          <span class="mi-title">Live2D 实时嘴形分贝 (RMS):</span>
          <span class="mi-val" v-if="isPlayingAudio">
            ParamMouthOpenY: {{ (audioLevel * 0.9).toFixed(2) }}
          </span>
          <span class="mi-val muted" v-else>静音 (闭合 0.00)</span>
        </div>
        <div class="vol-meter">
          <div class="vol-fill" :style="{ width: (audioLevel * 100) + '%' }"></div>
        </div>
      </div>
    </div>

    <!-- 底部输入框 -->
    <div class="chat-input-bar">
      <input
        type="text"
        v-model="inputPrompt"
        class="chat-input"
        placeholder="向 Nori 发送一条消息，按 Enter 发送..."
        @keydown.enter="sendMessage"
      />
      <button class="send-btn" :disabled="!inputPrompt.trim() || isStreaming" @click="sendMessage">
        <UiIcon name="send" :size="14" />
      </button>
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
  display: flex;
  flex-direction: column;
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.6rem 1rem;
  background: rgba(19, 23, 31, 0.7);
  border-bottom: 1px solid var(--line-subtle);
}
.chat-header-left {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.model-badge {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--nori-teal-bright);
  background: rgba(94, 234, 212, 0.1);
  padding: 0.15rem 0.5rem;
  border-radius: 4px;
  border: 1px solid rgba(94, 234, 212, 0.2);
}
.metric-tag {
  font-size: 0.68rem;
  color: var(--text-muted);
  background: rgba(255, 255, 255, 0.05);
  padding: 0.15rem 0.4rem;
  border-radius: 4px;
}
.header-action-btn {
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 0.2rem;
  border-radius: 4px;
}
.header-action-btn:hover { color: var(--danger-text); }

/* 消息流 */
.chat-viewport {
  padding: 1rem;
  height: 300px;
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
  background: rgba(19, 23, 31, 0.4);
}

.bubble-row {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
}
.bubble-row.user {
  justify-content: flex-end;
}
.bubble-row.assistant {
  justify-content: flex-start;
}

.assistant-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 1px solid var(--nori-teal);
  flex-shrink: 0;
  margin-top: 2px;
}

.bubble {
  max-width: 82%;
  padding: 0.65rem 0.9rem;
  border-radius: 10px;
  font-size: 0.82rem;
  line-height: 1.5;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
}

/* 真实样式对齐：用户 #454752 白字，伴侣 #b8d7d8 黑字 */
.user-bubble {
  background: var(--chat-user-bg);
  color: var(--chat-user-text);
  border-top-right-radius: 2px;
}
.assistant-bubble {
  background: var(--chat-ai-bg);
  color: var(--chat-ai-text);
  border-top-left-radius: 2px;
  border: 1px solid var(--chat-ai-border);
}

.tool-call-badge {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.7rem;
  background: rgba(0, 0, 0, 0.12);
  color: #1a3334;
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  margin-bottom: 0.4rem;
}
.tool-call-badge code {
  font-weight: 600;
}

.bubble-text {
  white-space: pre-wrap;
}

.tag-row {
  display: flex;
  gap: 0.4rem;
  margin-top: 0.5rem;
  flex-wrap: wrap;
}
.tag-badge {
  display: flex;
  align-items: center;
  gap: 0.2rem;
  font-size: 0.68rem;
  padding: 0.15rem 0.4rem;
  border-radius: 4px;
  font-weight: 500;
}
.tag-badge.motion {
  background: rgba(0, 60, 60, 0.15);
  color: #0b3d3e;
}
.tag-badge.emotion {
  background: rgba(180, 50, 100, 0.12);
  color: #5c1834;
}

.streaming-bubble {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}
.typing-dot {
  width: 5px;
  height: 5px;
  background: var(--chat-ai-text);
  border-radius: 50%;
  opacity: 0.6;
}
.typing-text {
  font-size: 0.75rem;
  font-style: italic;
}

/* 引导词条 */
.quick-starters-bar {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 1rem;
  background: rgba(23, 27, 34, 0.6);
  border-top: 1px solid var(--line-subtle);
  overflow-x: auto;
}
.starter-label {
  font-size: 0.72rem;
  color: var(--text-muted);
  white-space: nowrap;
}
.starter-chip {
  font-size: 0.72rem;
  background: rgba(125, 227, 255, 0.08);
  border: 1px solid var(--line-subtle);
  color: var(--text-body);
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s;
}
.starter-chip:hover {
  background: rgba(94, 234, 212, 0.15);
  border-color: var(--nori-teal);
  color: var(--nori-teal-bright);
}

/* 口型同步条 */
.lip-sync-bar {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem 1rem;
  background: rgba(19, 23, 31, 0.85);
  border-top: 1px solid var(--line-subtle);
}
.voice-toggle-btn {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.74rem;
  background: rgba(94, 234, 212, 0.12);
  border: 1px solid rgba(94, 234, 212, 0.3);
  color: var(--nori-teal-bright);
  padding: 0.35rem 0.7rem;
  border-radius: 5px;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s;
}
.voice-toggle-btn:hover {
  background: var(--nori-teal);
  color: var(--on-teal);
}
.voice-toggle-btn.playing {
  background: var(--warning);
  color: #03101c;
  border-color: var(--warning);
}

.meter-col {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
.meter-info {
  display: flex;
  justify-content: space-between;
  font-size: 0.7rem;
}
.mi-title { color: var(--text-muted); }
.mi-val { color: var(--nori-teal-bright); font-weight: 600; }
.mi-val.muted { color: var(--text-faint); font-weight: normal; }

.vol-meter {
  height: 6px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 3px;
  overflow: hidden;
}
.vol-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--nori-teal) 0%, var(--nori-teal-bright) 70%, var(--warning) 100%);
  border-radius: 3px;
  transition: width 0.09s ease-out;
}

/* 输入栏 */
.chat-input-bar {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1rem;
  background: rgba(19, 23, 31, 0.95);
  border-top: 1px solid var(--line-subtle);
}
.chat-input {
  flex: 1;
  background: rgba(28, 35, 47, 0.8);
  border: 1px solid var(--line-subtle);
  color: var(--text-primary);
  padding: 0.45rem 0.8rem;
  border-radius: 6px;
  font-size: 0.82rem;
  outline: none;
}
.chat-input:focus {
  border-color: var(--nori-teal);
}
.send-btn {
  background: var(--nori-teal);
  color: var(--on-teal);
  border: none;
  padding: 0.45rem 0.8rem;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}
.send-btn:hover:not(:disabled) {
  background: var(--nori-teal-bright);
}
.send-btn:disabled { opacity: 0.4; cursor: not-allowed; }
</style>
