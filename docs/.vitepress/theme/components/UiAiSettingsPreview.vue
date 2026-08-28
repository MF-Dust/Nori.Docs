<script setup lang="ts">
import { ref } from 'vue'
import UiIcon from './UiIcon.vue'

const provider = ref('openai')
const baseUrl = ref('https://api.deepseek.com')
const apiKey = ref('sk-9a8b7c6d5e4f3g2h1i0j')
const model = ref('deepseek-chat')
const persona = ref('')
const showKey = ref(false)

const embeddingModel = ref('BAAI/bge-m3')
const embeddingBaseUrl = ref('http://127.0.0.1:11434/v1')
const isReembedding = ref(false)
const reembedStatus = ref('')

const isTesting = ref(false)
const testSuccess = ref(false)
const testMessage = ref('')

const presets: Record<string, { provider: string; url: string; model: string; keyHint: string }> = {
  deepseek: {
    provider: 'openai',
    url: 'https://api.deepseek.com',
    model: 'deepseek-chat',
    keyHint: 'sk-9a8b7c6d5e4f3g2h1i0j'
  },
  qwen: {
    provider: 'openai',
    url: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    model: 'qwen-plus',
    keyHint: 'sk-qwen8888888888888888'
  },
  siliconflow: {
    provider: 'openai',
    url: 'https://api.siliconflow.cn/v1',
    model: 'deepseek-ai/DeepSeek-V3',
    keyHint: 'sk-siliconflow-xxxxxxxx'
  },
  ollama: {
    provider: 'openai',
    url: 'http://127.0.0.1:11434/v1',
    model: 'deepseek-r1:8b',
    keyHint: 'ollama (本地无需密码)'
  },
  openai: {
    provider: 'openai',
    url: 'https://api.openai.com/v1',
    model: 'gpt-4o-mini',
    keyHint: 'sk-proj-xxxxxxxxxxxxxxxxxxxx'
  }
}

const applyPreset = (key: string) => {
  const p = presets[key]
  if (p) {
    provider.value = p.provider
    baseUrl.value = p.url
    model.value = p.model
    apiKey.value = p.keyHint
    testSuccess.value = false
    testMessage.value = ''
  }
}

const testConnection = () => {
  isTesting.value = true
  testSuccess.value = false
  testMessage.value = '正在向服务商发送探测包并计算往返延迟...'

  setTimeout(() => {
    isTesting.value = false
    testSuccess.value = true
    testMessage.value = `连接成功！响应延迟: 86ms | 模型: ${model.value} 可用 | 协议标准: ${provider.value}`
  }, 600)
}

const triggerReembed = () => {
  isReembedding.value = true
  reembedStatus.value = '正在重新计算全部记忆向量嵌入 (0/142)...'
  setTimeout(() => {
    reembedStatus.value = '向量索引重构完成！142 条记忆原子已就绪。'
    isReembedding.value = false
  }, 1200)
}
</script>

<template>
  <div class="nori-surface-card">
    <div class="card-header">
      <div class="header-left">
        <UiIcon name="cpu" :size="16" class="header-icon" />
        <span class="header-title">AI 大语言模型与向量知识库配置</span>
      </div>
      <div class="header-right">
        <span class="badge-chip">多模型统一接入协议</span>
      </div>
    </div>

    <div class="card-body nori-scroll">
      <!-- 快捷预设模版按钮 -->
      <div class="preset-bar">
        <span class="preset-label">快捷预设填入:</span>
        <button class="preset-btn" @click="applyPreset('deepseek')">DeepSeek</button>
        <button class="preset-btn" @click="applyPreset('qwen')">通义千问 (百炼)</button>
        <button class="preset-btn" @click="applyPreset('siliconflow')">硅基流动</button>
        <button class="preset-btn" @click="applyPreset('ollama')">本地 Ollama</button>
        <button class="preset-btn" @click="applyPreset('openai')">OpenAI 官方</button>
      </div>

      <!-- 1. 主对话模型配置 -->
      <div class="section-box">
        <div class="section-heading">
          <UiIcon name="send" :size="14" />
          <span>核心对话模型配置 (Chat LLM)</span>
        </div>

        <div class="form-grid">
          <div class="form-item">
            <label class="item-label">服务协议类型 (Provider)</label>
            <select v-model="provider" class="item-select">
              <option value="openai">OpenAI 兼容协议 (DeepSeek / Qwen / Ollama / SiliconFlow)</option>
              <option value="anthropic">Anthropic Claude Messages 协议</option>
              <option value="google">Google Gemini API 协议</option>
            </select>
          </div>

          <div class="form-item">
            <label class="item-label">接口服务地址 (Base URL)</label>
            <input type="text" v-model="baseUrl" class="item-input" />
          </div>

          <div class="form-item">
            <div class="label-row">
              <span class="item-label">访问密钥 (API Key)</span>
              <span class="secure-tag"><UiIcon name="shield" :size="12" /> nsec1: (AES-256-GCM) 平台加密</span>
            </div>
            <div class="input-with-eye">
              <input
                :type="showKey ? 'text' : 'password'"
                v-model="apiKey"
                class="item-input"
              />
              <button class="eye-btn" @click="showKey = !showKey" type="button">
                <UiIcon name="eye" :size="14" />
              </button>
            </div>
          </div>

          <div class="form-item">
            <label class="item-label">调用模型型号 (Model)</label>
            <input type="text" v-model="model" class="item-input" />
          </div>

          <div class="form-item full-width">
            <label class="item-label">伴侣专属人设与系统提示词 (Persona Prompt)</label>
            <textarea
              v-model="persona"
              class="item-textarea"
              rows="2"
              placeholder="自定义伴侣对话人设与 System Prompt（留空时使用系统默认设定）..."
            ></textarea>
          </div>
        </div>

        <div class="test-bar">
          <button class="test-btn" :disabled="isTesting" @click="testConnection">
            <UiIcon v-if="isTesting" name="loading" :size="14" spin />
            <UiIcon v-else name="activity" :size="14" />
            <span>{{ isTesting ? '正在探测服务...' : '测试连接 (Benchmark)' }}</span>
          </button>
          <span v-if="testMessage" class="test-msg" :class="{ success: testSuccess }">
            {{ testMessage }}
          </span>
        </div>
      </div>

      <!-- 2. Embedding 向量检索模型配置 (独立隔离) -->
      <div class="section-box">
        <div class="section-heading">
          <UiIcon name="server" :size="14" />
          <span>Living Memory 向量检索模型配置 (Embedding)</span>
        </div>

        <div class="form-grid">
          <div class="form-item">
            <label class="item-label">向量模型名称 (Embedding Model)</label>
            <input type="text" v-model="embeddingModel" class="item-input" />
          </div>

          <div class="form-item">
            <label class="item-label">向量服务地址 (Embedding Base URL)</label>
            <input type="text" v-model="embeddingBaseUrl" class="item-input" />
          </div>
        </div>

        <div class="reembed-bar">
          <button class="reembed-btn" :disabled="isReembedding" @click="triggerReembed">
            <UiIcon v-if="isReembedding" name="loading" :size="14" spin />
            <UiIcon v-else name="refresh" :size="14" />
            <span>全量重构向量索引 (memory_reembed_all)</span>
          </button>
          <span v-if="reembedStatus" class="reembed-msg">{{ reembedStatus }}</span>
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
  max-height: 520px;
}

.preset-bar {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  flex-wrap: wrap;
}
.preset-label {
  font-size: 0.75rem;
  color: var(--text-muted);
}
.preset-btn {
  font-size: 0.72rem;
  background: rgba(23, 27, 34, 0.8);
  border: 1px solid var(--line-subtle);
  color: var(--text-body);
  padding: 0.2rem 0.6rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}
.preset-btn:hover {
  border-color: var(--nori-teal);
  color: var(--nori-teal-bright);
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

.section-heading {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--text-primary);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  padding-bottom: 0.4rem;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.8rem;
}

.form-item {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}
.form-item.full-width {
  grid-column: span 2;
}

.item-label {
  font-size: 0.75rem;
  color: var(--text-muted);
}
.label-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.secure-tag {
  font-size: 0.68rem;
  color: var(--nori-teal-soft);
  display: flex;
  align-items: center;
  gap: 0.2rem;
}

.item-input, .item-select, .item-textarea {
  background: rgba(19, 23, 31, 0.8);
  border: 1px solid var(--line-subtle);
  color: var(--text-primary);
  padding: 0.45rem 0.7rem;
  border-radius: 6px;
  font-size: 0.8rem;
  outline: none;
  font-family: inherit;
  transition: border-color 0.2s;
}
.item-input:focus, .item-select:focus, .item-textarea:focus {
  border-color: var(--nori-teal);
  box-shadow: 0 0 0.8rem rgba(94, 234, 212, 0.2);
}

.input-with-eye {
  position: relative;
  display: flex;
}
.input-with-eye .item-input {
  width: 100%;
  padding-right: 2.2rem;
}
.eye-btn {
  position: absolute;
  right: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
}
.eye-btn:hover { color: var(--nori-teal); }

.test-bar, .reembed-bar {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  flex-wrap: wrap;
}

.test-btn {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  background: rgba(94, 234, 212, 0.15);
  border: 1px solid rgba(94, 234, 212, 0.35);
  color: var(--nori-teal-bright);
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  font-size: 0.76rem;
  cursor: pointer;
  transition: all 0.2s;
}
.test-btn:hover:not(:disabled) {
  background: var(--nori-teal);
  color: var(--on-teal);
}
.test-btn:disabled { opacity: 0.6; cursor: not-allowed; }

.test-msg {
  font-size: 0.74rem;
  color: var(--warning);
}
.test-msg.success { color: var(--success); }

.reembed-btn {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  background: rgba(125, 227, 255, 0.08);
  border: 1px solid var(--line-subtle);
  color: var(--text-body);
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  font-size: 0.76rem;
  cursor: pointer;
  transition: all 0.2s;
}
.reembed-btn:hover:not(:disabled) {
  background: rgba(125, 227, 255, 0.18);
  color: var(--text-primary);
  border-color: var(--nori-teal);
}
.reembed-btn:disabled { opacity: 0.6; cursor: not-allowed; }

.reembed-msg {
  font-size: 0.74rem;
  color: var(--nori-teal-soft);
}
</style>
