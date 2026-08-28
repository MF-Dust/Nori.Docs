<script setup lang="ts">
import { ref, onBeforeUnmount } from 'vue'
import UiIcon from './UiIcon.vue'

const volume = ref(80)
const ttsProvider = ref<'openai' | 'gemini' | 'minimax' | 'gpt_sovits' | 'custom'>('openai')
const ttsBaseUrl = ref('https://api.openai.com/v1')
const ttsModel = ref('tts-1')
const ttsApiKey = ref('sk-9a8b7c6d5e4f3g2h1i0j')
const ttsVoice = ref('nova')
const ttsSpeed = ref(1.0)
const ttsAutoPlay = ref(true)
const showKey = ref(false)

// GPT-SoVITS 专属配置
const gptBaseUrl = ref('http://127.0.0.1:9880')
const gptRefAudio = ref('C:\\Voice\\nori_sample.wav')
const gptPromptText = ref('你好呀，我是Nori！')
const gptPromptLang = ref('zh')

// 实时 RMS 口型可视化
const isSpeakingTest = ref(false)
const audioLevel = ref(0)
let audioTimer: any = null

const onProviderChange = (p: 'openai' | 'gemini' | 'minimax' | 'gpt_sovits' | 'custom') => {
  ttsProvider.value = p
  if (p === 'openai') {
    ttsBaseUrl.value = 'https://api.openai.com/v1'
    ttsModel.value = 'tts-1'
    ttsVoice.value = 'nova'
  } else if (p === 'gemini') {
    ttsBaseUrl.value = 'https://generativelanguage.googleapis.com/v1beta'
    ttsModel.value = 'gemini-3.1-flash-tts-preview'
    ttsVoice.value = 'Kore'
  } else if (p === 'minimax') {
    ttsBaseUrl.value = 'https://api.minimaxi.com/v1'
    ttsModel.value = 'speech-01-turbo'
    ttsVoice.value = 'male-qn-qingse'
  } else if (p === 'gpt_sovits') {
    ttsBaseUrl.value = 'http://127.0.0.1:9880'
  }
}

const toggleVoiceTest = () => {
  isSpeakingTest.value = !isSpeakingTest.value
  if (isSpeakingTest.value) {
    audioTimer = setInterval(() => {
      audioLevel.value = Math.random() * 0.75 + 0.2
    }, 80)
  } else {
    clearInterval(audioTimer)
    audioLevel.value = 0
  }
}

onBeforeUnmount(() => {
  if (audioTimer) clearInterval(audioTimer)
})
</script>

<template>
  <div class="nori-surface-card">
    <div class="card-header">
      <div class="header-left">
        <UiIcon name="volume" :size="16" class="header-icon" />
        <span class="header-title">语音系统、发音参数与口型同步仿真</span>
      </div>
      <div class="header-right">
        <span class="badge-chip">WebAudio 单例宿主驱动</span>
      </div>
    </div>

    <div class="card-body nori-scroll">
      <!-- 1. 全局音量 -->
      <div class="section-box">
        <div class="volume-header">
          <span class="box-title"><UiIcon name="volume" :size="14" /> 全局主发音音量</span>
          <span class="volume-val">{{ volume }}%</span>
        </div>
        <input type="range" min="0" max="100" v-model.number="volume" class="nori-slider" />
      </div>

      <!-- 2. TTS 引擎与服务商 -->
      <div class="section-box">
        <div class="box-title">
          <UiIcon name="sparkles" :size="14" />
          <span>TTS 文本转语音引擎配置</span>
        </div>

        <div class="provider-pill-bar">
          <button
            class="pill-btn"
            :class="{ active: ttsProvider === 'openai' }"
            @click="onProviderChange('openai')"
          >
            OpenAI 官方
          </button>
          <button
            class="pill-btn"
            :class="{ active: ttsProvider === 'gemini' }"
            @click="onProviderChange('gemini')"
          >
            Google Gemini
          </button>
          <button
            class="pill-btn"
            :class="{ active: ttsProvider === 'minimax' }"
            @click="onProviderChange('minimax')"
          >
            MiniMax
          </button>
          <button
            class="pill-btn"
            :class="{ active: ttsProvider === 'gpt_sovits' }"
            @click="onProviderChange('gpt_sovits')"
          >
            GPT-SoVITS 本地克隆
          </button>
          <button
            class="pill-btn"
            :class="{ active: ttsProvider === 'custom' }"
            @click="onProviderChange('custom')"
          >
            自定义端点 (Piper)
          </button>
        </div>

        <!-- 通用 TTS 表单 -->
        <div class="form-grid" v-if="ttsProvider !== 'gpt_sovits'">
          <div class="form-item">
            <label class="item-label">TTS 接口端点 (Base URL)</label>
            <input type="text" v-model="ttsBaseUrl" class="item-input" />
          </div>

          <div class="form-item">
            <div class="label-row">
              <span class="item-label">API 访问密钥</span>
              <span class="secure-tag"><UiIcon name="shield" :size="12" /> nsec1: AES-256 加密</span>
            </div>
            <div class="input-with-eye">
              <input :type="showKey ? 'text' : 'password'" v-model="ttsApiKey" class="item-input" />
              <button class="eye-btn" @click="showKey = !showKey" type="button">
                <UiIcon name="eye" :size="14" />
              </button>
            </div>
          </div>

          <div class="form-item">
            <label class="item-label">发音人音色 (Speaker / Voice)</label>
            <select v-model="ttsVoice" class="item-select">
              <option value="nova">nova (轻快少女音)</option>
              <option value="alloy">alloy (自然中性)</option>
              <option value="echo">echo (磁性男声)</option>
              <option value="shimmer">shimmer (温婉柔和)</option>
              <option value="male-qn-qingse">male-qn-qingse (MiniMax 青涩少年)</option>
              <option value="Kore">Kore (Gemini 灵动女声)</option>
            </select>
          </div>

          <div class="form-item">
            <div class="label-row">
              <span class="item-label">朗读语速 (Speed)</span>
              <span class="val-tag">{{ ttsSpeed.toFixed(1) }}x</span>
            </div>
            <input type="range" min="0.5" max="2.0" step="0.1" v-model.number="ttsSpeed" class="nori-slider" />
          </div>
        </div>

        <!-- GPT-SoVITS 专属表单 -->
        <div class="form-grid" v-else>
          <div class="form-item">
            <label class="item-label">GPT-SoVITS WebUI API 端点</label>
            <input type="text" v-model="gptBaseUrl" class="item-input" />
          </div>
          <div class="form-item">
            <label class="item-label">参考音频本地路径 (Ref Audio)</label>
            <input type="text" v-model="gptRefAudio" class="item-input" />
          </div>
          <div class="form-item">
            <label class="item-label">参考音频对应文本 (Prompt Text)</label>
            <input type="text" v-model="gptPromptText" class="item-input" />
          </div>
          <div class="form-item">
            <label class="item-label">参考文本语言</label>
            <select v-model="gptPromptLang" class="item-select">
              <option value="zh">中文 (zh)</option>
              <option value="ja">日语 (ja)</option>
              <option value="en">英语 (en)</option>
            </select>
          </div>
        </div>

        <div class="switch-row">
          <span class="item-label">生成回复后自动语音朗读 (Auto Play TTS)</span>
          <label class="nori-switch">
            <input type="checkbox" v-model="ttsAutoPlay" />
            <span class="slider"></span>
          </label>
        </div>
      </div>

      <!-- 3. 发音测试与实时 RMS 口型可视化 -->
      <div class="section-box lip-sync-box">
        <div class="box-title">
          <UiIcon name="activity" :size="14" />
          <span>实时音频振幅 (RMS) 与嘴形开合参数联动仿真</span>
        </div>

        <div class="test-visualizer-row">
          <button
            class="speak-btn"
            :class="{ active: isSpeakingTest }"
            @click="toggleVoiceTest"
          >
            <UiIcon v-if="isSpeakingTest" name="pause" :size="14" />
            <UiIcon v-else name="play" :size="14" />
            <span>{{ isSpeakingTest ? '停止试听发音' : '试听当前音色发音' }}</span>
          </button>

          <div class="meter-wrapper">
            <div class="meter-labels">
              <span class="ml-title">WebAudio RMS 分贝能量条:</span>
              <span class="ml-val" v-if="isSpeakingTest">
                ParamMouthOpenY: {{ (audioLevel * 0.95).toFixed(2) }}
              </span>
              <span class="ml-val muted" v-else>静音 (口型闭合 0.00)</span>
            </div>
            <div class="meter-track">
              <div class="meter-bar" :style="{ width: (audioLevel * 100) + '%' }"></div>
            </div>
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

.box-title {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--text-primary);
}

.volume-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.volume-val {
  color: var(--nori-teal-bright);
  font-size: 0.85rem;
  font-weight: 600;
}

.provider-pill-bar {
  display: flex;
  gap: 0.4rem;
  flex-wrap: wrap;
}
.pill-btn {
  font-size: 0.72rem;
  padding: 0.25rem 0.6rem;
  background: rgba(19, 23, 31, 0.8);
  border: 1px solid var(--line-subtle);
  border-radius: 4px;
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.2s;
}
.pill-btn:hover {
  border-color: var(--nori-teal);
  color: var(--text-primary);
}
.pill-btn.active {
  background: rgba(94, 234, 212, 0.15);
  border-color: var(--nori-teal);
  color: var(--nori-teal-bright);
  font-weight: 500;
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
.val-tag {
  font-size: 0.75rem;
  color: var(--nori-teal-bright);
  font-weight: 600;
}

.item-input, .item-select {
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
.item-input:focus, .item-select:focus {
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

.switch-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 0.4rem;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.nori-slider {
  width: 100%;
  accent-color: var(--nori-teal);
  cursor: pointer;
}

.nori-switch {
  position: relative;
  display: inline-block;
  width: 38px;
  height: 20px;
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

/* 试听与能量条 */
.test-visualizer-row {
  display: flex;
  align-items: center;
  gap: 1.2rem;
}

.speak-btn {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  background: rgba(94, 234, 212, 0.15);
  border: 1px solid rgba(94, 234, 212, 0.35);
  color: var(--nori-teal-bright);
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.78rem;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s;
}
.speak-btn:hover {
  background: var(--nori-teal);
  color: var(--on-teal);
}
.speak-btn.active {
  background: var(--warning);
  color: #03101c;
  border-color: var(--warning);
}

.meter-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}
.meter-labels {
  display: flex;
  justify-content: space-between;
  font-size: 0.72rem;
}
.ml-title { color: var(--text-muted); }
.ml-val { color: var(--nori-teal-bright); font-weight: 600; }
.ml-val.muted { color: var(--text-faint); font-weight: normal; }

.meter-track {
  height: 8px;
  background: rgba(19, 23, 31, 0.8);
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid var(--line-subtle);
}
.meter-bar {
  height: 100%;
  background: linear-gradient(90deg, var(--nori-teal) 0%, var(--nori-teal-bright) 70%, var(--warning) 100%);
  border-radius: 4px;
  transition: width 0.08s ease-out;
}
</style>
