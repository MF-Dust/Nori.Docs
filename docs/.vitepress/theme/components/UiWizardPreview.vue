<script setup lang="ts">
import { ref, computed } from 'vue'
import UiIcon from './UiIcon.vue'

const currentStep = ref(0)
const selectedLang = ref<'zh-CN' | 'en-US'>('zh-CN')
const selectedModel = ref('arg-nori')
const aiProvider = ref('openai')
const aiBaseUrl = ref('https://api.deepseek.com')
const aiKey = ref('sk-9a8b7c6d5e4f3g2h1i0j')
const aiModel = ref('deepseek-chat')
const showKey = ref(false)
const telemetry = ref(true)

const isTesting = ref(false)
const testSuccess = ref(false)
const testMessage = ref('')

const steps = [
  { key: 'welcome', label: '欢迎' },
  { key: 'language', label: '语言选择' },
  { key: 'model', label: '模型选择' },
  { key: 'ai', label: 'AI 配置' },
  { key: 'ready', label: '完成就绪' }
]

const aiPresets: Record<string, { provider: string; url: string; model: string; keyHint: string }> = {
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
  },
  anthropic: {
    provider: 'anthropic',
    url: 'https://api.anthropic.com/v1',
    model: 'claude-3-5-sonnet-20241022',
    keyHint: 'sk-ant-api03-xxxxxxxxxxxx'
  }
}

const applyAiPreset = (key: string) => {
  const p = aiPresets[key]
  if (p) {
    aiProvider.value = p.provider
    aiBaseUrl.value = p.url
    aiModel.value = p.model
    aiKey.value = p.keyHint
    testSuccess.value = false
    testMessage.value = ''
  }
}

const testConnection = () => {
  isTesting.value = true
  testSuccess.value = false
  testMessage.value = '正在向服务商发送探测数据包...'

  setTimeout(() => {
    isTesting.value = false
    testSuccess.value = true
    testMessage.value = `连接成功！延迟: 86ms | 模型: ${aiModel.value} 可用`
  }, 650)
}

const nextStep = () => {
  if (currentStep.value < steps.length - 1) {
    currentStep.value++
  }
}

const prevStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--
  }
}

const resetWizard = () => {
  currentStep.value = 0
}
</script>

<template>
  <div class="nori-window-container">
    <div class="nori-window-root">
      <!-- 窗口标题栏 (TitleBar) -->
      <div class="nori-titlebar">
        <div class="traffic-lights">
          <span class="traffic-btn close"></span>
          <span class="traffic-btn min"></span>
          <span class="traffic-btn zoom"></span>
        </div>
        <div class="window-title-box">
          <UiIcon name="noriOS" :size="15" class="title-icon" />
          <span class="window-title">首次运行向导 · First-Run Wizard</span>
        </div>
        <div class="titlebar-right">
          <span class="version-chip">v1.0.0-dust</span>
        </div>
      </div>

      <!-- 步骤指示条 (Steps Bar) -->
      <div class="nori-steps-bar">
        <div
          v-for="(step, idx) in steps"
          :key="step.key"
          class="step-item"
          :class="{
            active: currentStep === idx,
            completed: currentStep > idx
          }"
          @click="currentStep = idx"
        >
          <div class="step-num-circle">
            <UiIcon v-if="currentStep > idx" name="check" :size="12" />
            <span v-else>{{ idx + 1 }}</span>
          </div>
          <span class="step-label">{{ step.label }}</span>
          <div v-if="idx < steps.length - 1" class="step-line"></div>
        </div>
      </div>

      <!-- 步骤主体内容区 -->
      <div class="nori-step-body nori-scroll">
        <!-- 步骤 0: 欢迎 -->
        <div v-if="currentStep === 0" class="step-view welcome-step">
          <div class="logo-hero">
            <img src="/logo.png" class="nori-logo nori-breathe" alt="Nori Logo" />
          </div>
          <h2 class="hero-title">欢迎来到 Nori 的世界</h2>
          <p class="hero-subtitle">
            基于 .NET 10 + Avalonia 12 原生宿主与 Vue 3 + UnoCSS 架构的高性能 Live2D 桌面智能伴侣。
          </p>

          <div class="monologue-card">
            <div class="quote-mark">“</div>
            <div class="monologue-text">
              数据流淌的高维之海中，曾有无数漂浮的光点；而在穿透时空的这一端，她选择降落在你的桌面上。
            </div>
          </div>

          <div class="feature-chips-row">
            <span class="feature-tag"><UiIcon name="cpu" :size="14" /> Live2D 原生 OpenGL 渲染</span>
            <span class="feature-tag"><UiIcon name="sparkles" :size="14" /> Living Memory 活体记忆</span>
            <span class="feature-tag"><UiIcon name="shield" :size="14" /> AES-256 本地安全加密</span>
          </div>

          <div class="switch-row">
            <div class="switch-info">
              <span class="switch-title">匿名质量改进与遥测</span>
              <span class="switch-desc">仅上传崩溃堆栈与基础性能指标，不包含任何对话内容与个人隐私</span>
            </div>
            <label class="nori-switch">
              <input type="checkbox" v-model="telemetry" />
              <span class="slider"></span>
            </label>
          </div>
        </div>

        <!-- 步骤 1: 语言选择 -->
        <div v-if="currentStep === 1" class="step-view">
          <div class="step-header-center">
            <span class="step-badge">Language Preference</span>
            <h3 class="step-main-title">选择界面显示语言</h3>
            <p class="step-desc">选择后将作为主控制台与提示信息的首选语言，后续可在系统设置中随时热切换。</p>
          </div>

          <div class="lang-cards-grid">
            <div
              class="lang-card"
              :class="{ selected: selectedLang === 'zh-CN' }"
              @click="selectedLang = 'zh-CN'"
            >
              <div class="lang-info">
                <div class="lang-name">简体中文</div>
                <div class="lang-sub">Chinese (Simplified)</div>
              </div>
              <div class="check-circle" v-if="selectedLang === 'zh-CN'">
                <UiIcon name="check" :size="14" />
              </div>
            </div>

            <div
              class="lang-card"
              :class="{ selected: selectedLang === 'en-US' }"
              @click="selectedLang = 'en-US'"
            >
              <div class="lang-info">
                <div class="lang-name">English</div>
                <div class="lang-sub">English (United States)</div>
              </div>
              <div class="check-circle" v-if="selectedLang === 'en-US'">
                <UiIcon name="check" :size="14" />
              </div>
            </div>
          </div>
        </div>

        <!-- 步骤 2: 模型选择 -->
        <div v-if="currentStep === 2" class="step-view">
          <div class="step-header-center">
            <span class="step-badge">Live2D Companion</span>
            <h3 class="step-main-title">选择初始桌宠伴侣形象</h3>
            <p class="step-desc">选中的模型将作为默认陪伴角色加载，支持在管理面板随时导入更多模型。</p>
          </div>

          <div class="model-cards-grid">
            <div
              class="model-card"
              :class="{ selected: selectedModel === 'arg-nori' }"
              @click="selectedModel = 'arg-nori'"
            >
              <div class="model-thumb-box">
                <img src="/images/ARGNori.webp" class="model-thumb" alt="ARG Nori" />
              </div>
              <div class="model-details">
                <div class="model-name-row">
                  <span class="model-name">Nori (ARG Nori)</span>
                  <span class="model-tag-official">官方预设</span>
                </div>
                <div class="model-summary">
                  基于原生 Live2D Cubism Core 构建的标准伴侣形象，支持头发衣物物理碰撞、视线跟随与分贝驱动口型。
                </div>
                <div class="model-chips">
                  <span class="mini-chip">2048px 遮罩</span>
                  <span class="mini-chip">全量物理摆动</span>
                  <span class="mini-chip">8 组情绪动作</span>
                </div>
              </div>
              <div class="check-circle" v-if="selectedModel === 'arg-nori'">
                <UiIcon name="check" :size="14" />
              </div>
            </div>

            <div
              class="model-card"
              :class="{ selected: selectedModel === 'nori-classic' }"
              @click="selectedModel = 'nori-classic'"
            >
              <div class="model-thumb-box">
                <img src="/images/Nori.webp" class="model-thumb" alt="Nori Classic" />
              </div>
              <div class="model-details">
                <div class="model-name-row">
                  <span class="model-name">Nori Classic</span>
                  <span class="model-tag-sub">轻量经典</span>
                </div>
                <div class="model-summary">
                  经典复古造型 Live2D 形象，内存占用极低，适合低功耗设备或轻量办公场景。
                </div>
                <div class="model-chips">
                  <span class="mini-chip">超低内存</span>
                  <span class="mini-chip">经典眨眼互动</span>
                </div>
              </div>
              <div class="check-circle" v-if="selectedModel === 'nori-classic'">
                <UiIcon name="check" :size="14" />
              </div>
            </div>
          </div>
        </div>

        <!-- 步骤 3: AI 配置 -->
        <div v-if="currentStep === 3" class="step-view">
          <div class="step-header-center">
            <span class="step-badge">AI LLM Provider</span>
            <h3 class="step-main-title">配置大语言模型 (LLM) 接入</h3>
            <p class="step-desc">填写模型服务商的 API 密钥以激活桌宠智能对话，也可在右下方点击“暂不配置”。</p>
          </div>

          <!-- 预设快捷填入 -->
          <div class="preset-buttons-bar">
            <span class="preset-label">快捷预设:</span>
            <button class="preset-chip" @click="applyAiPreset('deepseek')">DeepSeek</button>
            <button class="preset-chip" @click="applyAiPreset('qwen')">通义千问 (百炼)</button>
            <button class="preset-chip" @click="applyAiPreset('ollama')">本地 Ollama</button>
            <button class="preset-chip" @click="applyAiPreset('openai')">OpenAI</button>
            <button class="preset-chip" @click="applyAiPreset('anthropic')">Claude</button>
          </div>

          <div class="form-container">
            <div class="field-item">
              <label class="field-label">服务协议类型 (Provider)</label>
              <select v-model="aiProvider" class="form-select">
                <option value="openai">OpenAI 兼容协议 (DeepSeek / Qwen / Ollama / SiliconFlow)</option>
                <option value="anthropic">Anthropic Claude Messages 协议</option>
                <option value="google">Google Gemini API 协议</option>
              </select>
            </div>

            <div class="field-item">
              <label class="field-label">接口服务地址 (Base URL)</label>
              <input type="text" v-model="aiBaseUrl" class="form-input" placeholder="https://api.deepseek.com" />
            </div>

            <div class="field-item">
              <div class="label-with-badge">
                <span class="field-label">访问密钥 (API Key)</span>
                <span class="secure-tag"><UiIcon name="shield" :size="12" /> nsec1: AES-256-GCM 平台加密存储</span>
              </div>
              <div class="input-with-action">
                <input
                  :type="showKey ? 'text' : 'password'"
                  v-model="aiKey"
                  class="form-input"
                  placeholder="sk-..."
                />
                <button class="icon-toggle-btn" @click="showKey = !showKey" type="button">
                  <UiIcon :name="showKey ? 'eye' : 'eye'" :size="16" />
                </button>
              </div>
            </div>

            <div class="field-item">
              <label class="field-label">调用大模型名称 (Model)</label>
              <input type="text" v-model="aiModel" class="form-input" placeholder="deepseek-chat" />
            </div>

            <!-- 测试连通性按钮与反馈 -->
            <div class="test-action-bar">
              <button
                type="button"
                class="test-btn"
                :disabled="isTesting"
                @click="testConnection"
              >
                <UiIcon v-if="isTesting" name="loading" :size="14" spin />
                <UiIcon v-else name="activity" :size="14" />
                <span>{{ isTesting ? '正在探测服务...' : '测试连接 (Benchmark)' }}</span>
              </button>
              <span v-if="testMessage" class="test-result-msg" :class="{ success: testSuccess }">
                {{ testMessage }}
              </span>
            </div>
          </div>
        </div>

        <!-- 步骤 4: 完成就绪 -->
        <div v-if="currentStep === 4" class="step-view ready-step">
          <div class="ready-icon-box">
            <UiIcon name="check" :size="36" class="ready-check-icon" />
          </div>
          <h2 class="hero-title">一切准备就绪！</h2>
          <p class="hero-subtitle">
            伴侣向导初始化已成功完成。以下是本次配置摘要：
          </p>

          <div class="summary-table-card">
            <div class="summary-row">
              <span class="sk">界面语言:</span>
              <span class="sv">{{ selectedLang === 'zh-CN' ? '简体中文 (zh-CN)' : 'English (en-US)' }}</span>
            </div>
            <div class="summary-row">
              <span class="sk">桌宠模型:</span>
              <span class="sv">{{ selectedModel === 'arg-nori' ? 'Nori (ARG Nori)' : 'Nori Classic' }}</span>
            </div>
            <div class="summary-row">
              <span class="sk">AI 对话核心:</span>
              <span class="sv highlight">{{ aiModel || '已跳过（可在设置中随时配置）' }}</span>
            </div>
            <div class="summary-row">
              <span class="sk">遥测改进:</span>
              <span class="sv">{{ telemetry ? '已开启（匿名脱敏）' : '已关闭' }}</span>
            </div>
          </div>

          <div class="ready-action-box">
            <button type="button" class="enter-app-btn" @click="resetWizard">
              <UiIcon name="sparkles" :size="18" />
              <span>进入桌面伴侣 (模拟启动主控制台)</span>
            </button>
          </div>
        </div>
      </div>

      <!-- 底部操作导航栏 -->
      <div class="nori-wizard-footer">
        <button
          type="button"
          class="nav-btn prev"
          :disabled="currentStep === 0"
          @click="prevStep"
        >
          <UiIcon name="arrow-left" :size="14" />
          <span>上一步</span>
        </button>

        <div class="footer-center-hint">
          <span v-if="currentStep === 3" class="skip-link" @click="nextStep">暂不配置 AI，直接跳过 →</span>
        </div>

        <button
          type="button"
          class="nav-btn next"
          v-if="currentStep < steps.length - 1"
          @click="nextStep"
        >
          <span>下一步</span>
          <UiIcon name="arrow-right" :size="14" />
        </button>
        <button
          type="button"
          class="nav-btn finish"
          v-else
          @click="resetWizard"
        >
          <UiIcon name="check" :size="14" />
          <span>完成初始化</span>
        </button>
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
  height: 580px;
  background: radial-gradient(64rem 40rem at 85% 30%, var(--glow-teal-soft), transparent 65%),
    linear-gradient(160deg, var(--bg-panel) 0%, var(--bg-deep) 55%, var(--bg-abyss) 100%);
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

.titlebar-right .version-chip {
  font-size: 0.7rem;
  background: rgba(125, 227, 255, 0.1);
  color: var(--nori-teal-soft);
  padding: 0.15rem 0.5rem;
  border-radius: 9999px;
  border: 1px solid var(--line-subtle);
}

/* 步骤指示条 */
.nori-steps-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 2rem;
  background: rgba(23, 27, 34, 0.5);
  border-bottom: 1px solid var(--line-subtle);
}

.step-item {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  cursor: pointer;
  opacity: 0.6;
  transition: all 0.2s;
  flex: 1;
}
.step-item.active { opacity: 1; color: var(--nori-teal-bright); }
.step-item.completed { opacity: 0.9; color: var(--text-primary); }

.step-num-circle {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: var(--bg-deep);
  border: 1px solid var(--line-subtle);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 600;
}
.step-item.active .step-num-circle {
  background: var(--nori-teal);
  color: var(--on-teal);
  border-color: var(--nori-teal);
}
.step-item.completed .step-num-circle {
  background: rgba(94, 234, 212, 0.2);
  color: var(--nori-teal);
  border-color: var(--nori-teal);
}

.step-label {
  font-size: 0.8rem;
  white-space: nowrap;
}

.step-line {
  flex: 1;
  height: 1px;
  background: var(--line-subtle);
  margin: 0 0.6rem;
}

/* 步骤主体内容 */
.nori-step-body {
  flex: 1;
  padding: 1.5rem 2.5rem;
}

.step-view {
  display: flex;
  flex-direction: column;
}

.welcome-step {
  align-items: center;
  text-align: center;
}

.logo-hero {
  margin: 0.5rem 0 1rem;
}
.nori-logo {
  width: 72px;
  height: 72px;
}

.hero-title {
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 0.4rem;
}

.hero-subtitle {
  font-size: 0.85rem;
  color: var(--text-muted);
  max-width: 520px;
  margin: 0 0 1.2rem;
  line-height: 1.5;
}

.monologue-card {
  position: relative;
  background: rgba(28, 35, 47, 0.65);
  border: 1px solid var(--line-subtle);
  border-radius: 8px;
  padding: 0.8rem 1.4rem;
  max-width: 500px;
  margin-bottom: 1.2rem;
  backdrop-filter: blur(10px);
}
.quote-mark {
  position: absolute;
  top: -0.2rem;
  left: 0.5rem;
  font-size: 1.8rem;
  color: var(--nori-teal-soft);
  opacity: 0.3;
}
.monologue-text {
  font-size: 0.82rem;
  font-style: italic;
  color: var(--text-body);
  line-height: 1.6;
}

.feature-chips-row {
  display: flex;
  gap: 0.6rem;
  margin-bottom: 1.2rem;
}
.feature-tag {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.75rem;
  padding: 0.3rem 0.6rem;
  background: rgba(125, 227, 255, 0.08);
  border: 1px solid var(--line-subtle);
  border-radius: 6px;
  color: var(--nori-teal-soft);
}

.switch-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: 500px;
  background: rgba(23, 27, 34, 0.6);
  padding: 0.6rem 1rem;
  border-radius: 8px;
  border: 1px solid var(--line-subtle);
}
.switch-info {
  display: flex;
  flex-direction: column;
  text-align: left;
}
.switch-title {
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--text-primary);
}
.switch-desc {
  font-size: 0.7rem;
  color: var(--text-muted);
}

/* 开关组件 */
.nori-switch {
  position: relative;
  display: inline-block;
  width: 38px;
  height: 20px;
  flex-shrink: 0;
}
.nori-switch input { opacity: 0; width: 0; height: 0; }
.nori-switch .slider {
  position: absolute;
  cursor: pointer;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: rgba(255, 255, 255, 0.15);
  transition: 0.3s;
  border-radius: 20px;
}
.nori-switch .slider:before {
  position: absolute;
  content: "";
  height: 14px;
  width: 14px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: 0.3s;
  border-radius: 50%;
}
.nori-switch input:checked + .slider { background-color: var(--nori-teal); }
.nori-switch input:checked + .slider:before { transform: translateX(18px); background-color: var(--on-teal); }

/* 步骤顶部居中标题 */
.step-header-center {
  text-align: center;
  margin-bottom: 1.2rem;
}
.step-badge {
  display: inline-block;
  font-size: 0.7rem;
  color: var(--nori-teal-bright);
  background: rgba(94, 234, 212, 0.1);
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  margin-bottom: 0.3rem;
}
.step-main-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 0.3rem;
}
.step-desc {
  font-size: 0.8rem;
  color: var(--text-muted);
  margin: 0;
}

/* 语言卡片网格 */
.lang-cards-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.2rem;
  max-width: 540px;
  margin: 0.8rem auto 0;
}

.lang-card {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 1rem;
  background: rgba(28, 35, 47, 0.65);
  border: 1px solid var(--line-subtle);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
}
.lang-card:hover {
  background: rgba(36, 47, 61, 0.78);
  border-color: var(--line-strong);
}
.lang-card.selected {
  background: rgba(36, 47, 61, 0.9);
  border-color: var(--nori-teal);
  box-shadow: 0 0 1.2rem rgba(94, 234, 212, 0.2);
}
.lang-name {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-primary);
}
.lang-sub {
  font-size: 0.72rem;
  color: var(--text-muted);
}
.check-circle {
  margin-left: auto;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--nori-teal);
  color: var(--on-teal);
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 模型卡片网格 */
.model-cards-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.2rem;
  max-width: 620px;
  margin: 0.8rem auto 0;
}

.model-card {
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 1rem;
  background: rgba(28, 35, 47, 0.65);
  border: 1px solid var(--line-subtle);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
}
.model-card:hover {
  background: rgba(36, 47, 61, 0.78);
  border-color: var(--line-strong);
}
.model-card.selected {
  background: rgba(36, 47, 61, 0.9);
  border-color: var(--nori-teal);
  box-shadow: 0 0 1.4rem rgba(94, 234, 212, 0.2);
}
.model-thumb-box {
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.6rem;
}
.model-thumb {
  max-height: 100%;
  object-fit: contain;
  filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.4));
}
.model-name-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.3rem;
}
.model-name {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-primary);
}
.model-tag-official {
  font-size: 0.68rem;
  color: var(--on-teal);
  background: var(--nori-teal);
  padding: 0.1rem 0.4rem;
  border-radius: 4px;
  font-weight: 500;
}
.model-tag-sub {
  font-size: 0.68rem;
  color: var(--text-muted);
  background: rgba(255, 255, 255, 0.08);
  padding: 0.1rem 0.4rem;
  border-radius: 4px;
}
.model-summary {
  font-size: 0.72rem;
  color: var(--text-muted);
  line-height: 1.4;
  margin-bottom: 0.6rem;
}
.model-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
}
.mini-chip {
  font-size: 0.65rem;
  background: rgba(125, 227, 255, 0.08);
  color: var(--nori-teal-soft);
  padding: 0.15rem 0.4rem;
  border-radius: 4px;
}

/* AI 配置表单 */
.preset-buttons-bar {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}
.preset-label {
  font-size: 0.75rem;
  color: var(--text-muted);
}
.preset-chip {
  font-size: 0.72rem;
  background: rgba(23, 27, 34, 0.8);
  border: 1px solid var(--line-subtle);
  color: var(--text-body);
  padding: 0.2rem 0.55rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}
.preset-chip:hover {
  border-color: var(--nori-teal);
  color: var(--nori-teal-bright);
}

.form-container {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  max-width: 580px;
}
.field-item {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}
.field-label {
  font-size: 0.78rem;
  color: var(--text-muted);
}
.label-with-badge {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.secure-tag {
  font-size: 0.68rem;
  color: var(--nori-teal-soft);
  display: flex;
  align-items: center;
  gap: 0.2rem;
}

.form-input, .form-select {
  background: rgba(19, 23, 31, 0.8);
  border: 1px solid var(--line-subtle);
  color: var(--text-primary);
  padding: 0.5rem 0.8rem;
  border-radius: 6px;
  font-size: 0.82rem;
  outline: none;
  transition: border-color 0.2s;
}
.form-input:focus, .form-select:focus {
  border-color: var(--nori-teal);
  box-shadow: 0 0 0.8rem rgba(94, 234, 212, 0.2);
}

.input-with-action {
  position: relative;
  display: flex;
}
.input-with-action .form-input {
  width: 100%;
  padding-right: 2.2rem;
}
.icon-toggle-btn {
  position: absolute;
  right: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
}
.icon-toggle-btn:hover { color: var(--nori-teal); }

.test-action-bar {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin-top: 0.4rem;
}
.test-btn {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  background: rgba(94, 234, 212, 0.15);
  border: 1px solid rgba(94, 234, 212, 0.35);
  color: var(--nori-teal-bright);
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  font-size: 0.78rem;
  cursor: pointer;
  transition: all 0.2s;
}
.test-btn:hover:not(:disabled) {
  background: var(--nori-teal);
  color: var(--on-teal);
}
.test-btn:disabled { opacity: 0.6; cursor: not-allowed; }
.test-result-msg {
  font-size: 0.75rem;
  color: var(--warning);
}
.test-result-msg.success { color: var(--success); }

/* 完成就绪 */
.ready-step {
  align-items: center;
  text-align: center;
}
.ready-icon-box {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: rgba(32, 224, 144, 0.15);
  border: 1px solid var(--success);
  color: var(--success);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0.8rem 0 1rem;
}

.summary-table-card {
  width: 100%;
  max-width: 480px;
  background: rgba(28, 35, 47, 0.65);
  border: 1px solid var(--line-subtle);
  border-radius: 8px;
  padding: 0.8rem 1.2rem;
  margin-bottom: 1.4rem;
  text-align: left;
}
.summary-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  padding: 0.35rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}
.summary-row:last-child { border-bottom: none; }
.summary-row .sk { color: var(--text-muted); }
.summary-row .sv { color: var(--text-primary); font-weight: 500; }
.summary-row .sv.highlight { color: var(--nori-teal-bright); }

.enter-app-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, var(--nori-teal) 0%, var(--nori-teal-bright) 100%);
  color: var(--on-teal);
  border: none;
  font-size: 0.9rem;
  font-weight: 600;
  padding: 0.65rem 1.6rem;
  border-radius: 8px;
  cursor: pointer;
  box-shadow: 0 0.4rem 1.4rem rgba(94, 234, 212, 0.35);
  transition: all 0.2s;
}
.enter-app-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 0.6rem 1.8rem rgba(94, 234, 212, 0.5);
}

/* 底部操作条 */
.nori-wizard-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.8rem 2rem;
  background: rgba(19, 23, 31, 0.8);
  border-top: 1px solid var(--line-subtle);
}

.nav-btn {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.45rem 1rem;
  border-radius: 6px;
  font-size: 0.82rem;
  cursor: pointer;
  transition: all 0.2s;
}
.nav-btn.prev {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--line-subtle);
  color: var(--text-body);
}
.nav-btn.prev:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.1);
  color: var(--text-primary);
}
.nav-btn.prev:disabled { opacity: 0.4; cursor: not-allowed; }

.nav-btn.next {
  background: var(--nori-teal);
  color: var(--on-teal);
  border: none;
  font-weight: 600;
}
.nav-btn.next:hover {
  background: var(--nori-teal-bright);
}

.nav-btn.finish {
  background: var(--success);
  color: #03101c;
  border: none;
  font-weight: 600;
}

.skip-link {
  font-size: 0.75rem;
  color: var(--text-muted);
  cursor: pointer;
}
.skip-link:hover { color: var(--nori-teal-soft); text-decoration: underline; }
</style>
