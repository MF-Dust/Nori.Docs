<script setup lang="ts">
import { ref, computed } from 'vue'
import UiIcon from './UiIcon.vue'

const selectedModelId = ref<'arg-nori' | 'nori-classic'>('arg-nori')
const scale = ref(1.0)
const opacity = ref(100)
const maxFps = ref('60')
const hitThrough = ref(true)
const eyeTracking = ref(true)
const physics = ref(true)
const lipSync = ref(true)

const activeRegion = ref<'head' | 'cheek' | 'body'>('head')
const currentMotionFeedback = ref('')
const currentEmotion = ref('happy')
let feedbackTimer: any = null

const regions = {
  head: {
    label: '摸摸头 (Head)',
    motion: 'TapHead (点头微笑)',
    emotion: 'happy (开心)',
    hint: '点击头部区域触发乖巧歪头与眯眼微笑反应。'
  },
  cheek: {
    label: '戳脸颊 (Cheek)',
    motion: 'PokeFace (轻微后缩)',
    emotion: 'shy (害羞脸红)',
    hint: '点击脸颊区域触发害羞后缩与脸红傲娇反应。'
  },
  body: {
    label: '拍拍身体 (Body)',
    motion: 'TapBody (挥手致意)',
    emotion: 'normal (自然)',
    hint: '点击身体区域触发元气满满的整理裙摆与招手动作。'
  }
}

const currentModelImg = computed(() =>
  selectedModelId.value === 'arg-nori' ? '/images/ARGNori.webp' : '/images/Nori.webp'
)

const triggerMotion = (regionKey: 'head' | 'cheek' | 'body') => {
  activeRegion.value = regionKey
  const r = regions[regionKey]
  currentMotionFeedback.value = `[动作调度] ${r.motion} | 表情: ${r.emotion}`
  if (feedbackTimer) clearTimeout(feedbackTimer)
  feedbackTimer = setTimeout(() => {
    currentMotionFeedback.value = ''
  }, 2500)
}

const triggerRandomMotion = () => {
  const keys: ('head' | 'cheek' | 'body')[] = ['head', 'cheek', 'body']
  const randomKey = keys[Math.floor(Math.random() * keys.length)]
  triggerMotion(randomKey)
}
</script>

<template>
  <div class="nori-surface-card">
    <!-- 顶部卡片头部 -->
    <div class="card-header">
      <div class="header-left">
        <UiIcon name="package" :size="16" class="header-icon" />
        <span class="header-title">Live2D 原生渲染与模型管理视口仿真</span>
      </div>
      <div class="header-right">
        <span class="badge-chip">OpenGL ES 2.0 原生管线</span>
      </div>
    </div>

    <!-- 主体栅格布局 -->
    <div class="model-preview-grid">
      <!-- 左侧：Live2D 视口与触摸互动区域 -->
      <div class="viewport-box">
        <div class="viewport-top-bar">
          <div class="model-picker">
            <button
              class="picker-btn"
              :class="{ active: selectedModelId === 'arg-nori' }"
              @click="selectedModelId = 'arg-nori'"
            >
              Nori (ARG Nori)
            </button>
            <button
              class="picker-btn"
              :class="{ active: selectedModelId === 'nori-classic' }"
              @click="selectedModelId = 'nori-classic'"
            >
              Nori Classic
            </button>
          </div>
          <span class="fps-tag">{{ maxFps }} FPS 渲染</span>
        </div>

        <!-- 渲染画布视口 -->
        <div class="canvas-stage" :style="{ opacity: opacity / 100 }">
          <img
            :src="currentModelImg"
            class="live2d-avatar"
            :style="{ transform: `scale(${scale})` }"
            alt="Live2D Model"
          />

          <!-- 触摸区域覆盖框 (Interaction Hotspots) -->
          <div
            class="hotspot-region head-spot"
            :class="{ active: activeRegion === 'head' }"
            @click="triggerMotion('head')"
          >
            <span class="spot-tag">头部 (摸摸头)</span>
          </div>

          <div
            class="hotspot-region cheek-spot"
            :class="{ active: activeRegion === 'cheek' }"
            @click="triggerMotion('cheek')"
          >
            <span class="spot-tag">脸颊 (戳脸)</span>
          </div>

          <div
            class="hotspot-region body-spot"
            :class="{ active: activeRegion === 'body' }"
            @click="triggerMotion('body')"
          >
            <span class="spot-tag">身体 (拍拍)</span>
          </div>

          <!-- 动作反馈气泡 -->
          <div v-if="currentMotionFeedback" class="motion-feedback-bubble">
            <UiIcon name="sparkles" :size="14" />
            <span>{{ currentMotionFeedback }}</span>
          </div>
        </div>

        <div class="viewport-bottom-tip">
          <span>点击上方虚线框部位可触发专属 Live2D 动作与情绪响应</span>
        </div>
      </div>

      <!-- 右侧：属性参数控制表单 -->
      <div class="controls-column nori-scroll">
        <!-- 基础视口显示调节 -->
        <div class="control-group">
          <div class="group-title">
            <UiIcon name="monitor" :size="14" />
            <span>基础显示与视口调节</span>
          </div>

          <div class="control-item">
            <div class="item-title-row">
              <span class="item-title">模型缩放比例 (Scale)</span>
              <span class="item-val">{{ scale.toFixed(1) }}x</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="2.0"
              step="0.1"
              v-model.number="scale"
              class="nori-slider"
            />
          </div>

          <div class="control-item">
            <div class="item-title-row">
              <span class="item-title">窗口不透明度 (Opacity)</span>
              <span class="item-val">{{ opacity }}%</span>
            </div>
            <input
              type="range"
              min="20"
              max="100"
              step="5"
              v-model.number="opacity"
              class="nori-slider"
            />
          </div>

          <div class="control-item">
            <div class="item-title-row">
              <span class="item-title">最高渲染帧率限制 (FPS)</span>
            </div>
            <div class="segmented-pills">
              <button
                class="seg-pill"
                :class="{ active: maxFps === '30' }"
                @click="maxFps = '30'"
              >
                30 FPS (节能)
              </button>
              <button
                class="seg-pill"
                :class="{ active: maxFps === '60' }"
                @click="maxFps = '60'"
              >
                60 FPS (均衡)
              </button>
              <button
                class="seg-pill"
                :class="{ active: maxFps === '120' }"
                @click="maxFps = '120'"
              >
                120 FPS (极速)
              </button>
            </div>
          </div>
        </div>

        <!-- 行为与交互开关 -->
        <div class="control-group">
          <div class="group-title">
            <UiIcon name="activity" :size="14" />
            <span>原生引擎特性与物理演算</span>
          </div>

          <div class="switch-item-row">
            <div class="switch-text">
              <span class="st-title">动态 Alpha 轮廓透明穿透 (Hit-Through)</span>
              <span class="st-desc">透明像素自动穿透至下层桌面，不阻碍日常办公</span>
            </div>
            <label class="nori-switch">
              <input type="checkbox" v-model="hitThrough" />
              <span class="slider"></span>
            </label>
          </div>

          <div class="switch-item-row">
            <div class="switch-text">
              <span class="st-title">鼠标视线追踪 (Eye Tracking)</span>
              <span class="st-desc">Live2D 头部与视线自然朝向鼠标指针位置</span>
            </div>
            <label class="nori-switch">
              <input type="checkbox" v-model="eyeTracking" />
              <span class="slider"></span>
            </label>
          </div>

          <div class="switch-item-row">
            <div class="switch-text">
              <span class="st-title">头发与衣物物理演算 (Physics)</span>
              <span class="st-desc">原生计算重力、风力与惯性摆动细节</span>
            </div>
            <label class="nori-switch">
              <input type="checkbox" v-model="physics" />
              <span class="slider"></span>
            </label>
          </div>

          <div class="switch-item-row">
            <div class="switch-text">
              <span class="st-title">音频分贝驱动实时嘴形 (RMS Lip Sync)</span>
              <span class="st-desc">WebAudio 毫秒级振幅驱动 ParamMouthOpenY</span>
            </div>
            <label class="nori-switch">
              <input type="checkbox" v-model="lipSync" />
              <span class="slider"></span>
            </label>
          </div>
        </div>

        <!-- 动作触发与调试 -->
        <div class="control-group">
          <div class="group-title">
            <UiIcon name="sparkles" :size="14" />
            <span>互动动作与表情调度调试</span>
          </div>

          <div class="action-buttons-grid">
            <button class="action-btn" @click="triggerMotion('head')">
              <UiIcon name="play" :size="12" />
              <span>触发摸摸头动作</span>
            </button>
            <button class="action-btn" @click="triggerMotion('cheek')">
              <UiIcon name="play" :size="12" />
              <span>触发戳脸傲娇动作</span>
            </button>
            <button class="action-btn" @click="triggerMotion('body')">
              <UiIcon name="play" :size="12" />
              <span>触发拍身体挥手动作</span>
            </button>
            <button class="action-btn highlight" @click="triggerRandomMotion">
              <UiIcon name="sparkles" :size="12" />
              <span>触发随机闲置待机动作</span>
            </button>
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

.model-preview-grid {
  display: grid;
  grid-template-columns: 320px 1fr;
  height: 490px;
}

/* 左侧视口 */
.viewport-box {
  display: flex;
  flex-direction: column;
  background: rgba(19, 23, 31, 0.5);
  border-right: 1px solid var(--line-subtle);
  padding: 0.8rem;
}

.viewport-top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.6rem;
}

.model-picker {
  display: flex;
  gap: 0.3rem;
  background: rgba(23, 27, 34, 0.8);
  padding: 0.2rem;
  border-radius: 6px;
  border: 1px solid var(--line-subtle);
}
.picker-btn {
  font-size: 0.72rem;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  background: transparent;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.2s;
}
.picker-btn.active {
  background: var(--nori-teal);
  color: var(--on-teal);
  font-weight: 600;
}

.fps-tag {
  font-size: 0.68rem;
  color: var(--nori-teal-soft);
  background: rgba(125, 227, 255, 0.08);
  padding: 0.15rem 0.4rem;
  border-radius: 4px;
}

.canvas-stage {
  position: relative;
  flex: 1;
  background: radial-gradient(circle at 50% 50%, rgba(94, 234, 212, 0.08) 0%, transparent 70%),
    linear-gradient(180deg, rgba(23, 27, 34, 0.6) 0%, rgba(19, 23, 31, 0.9) 100%);
  border: 1px solid var(--line-subtle);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.live2d-avatar {
  max-height: 85%;
  max-width: 85%;
  object-fit: contain;
  transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
  filter: drop-shadow(0 0.8rem 2rem rgba(0, 0, 0, 0.6));
}

/* 触摸热区 (Hotspots) */
.hotspot-region {
  position: absolute;
  border: 1.5px dashed rgba(125, 227, 255, 0.4);
  background: rgba(125, 227, 255, 0.06);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}
.hotspot-region:hover {
  border-color: var(--nori-teal);
  background: rgba(94, 234, 212, 0.18);
}
.hotspot-region.active {
  border-color: var(--nori-teal-bright);
  background: rgba(94, 234, 212, 0.25);
  box-shadow: 0 0 1rem rgba(94, 234, 212, 0.4);
}

.head-spot {
  top: 15%;
  width: 110px;
  height: 65px;
}
.cheek-spot {
  top: 32%;
  width: 90px;
  height: 45px;
}
.body-spot {
  top: 46%;
  width: 120px;
  height: 80px;
}

.spot-tag {
  font-size: 0.65rem;
  background: rgba(19, 23, 31, 0.85);
  color: var(--nori-teal-soft);
  padding: 0.1rem 0.35rem;
  border-radius: 3px;
  pointer-events: none;
}

.motion-feedback-bubble {
  position: absolute;
  bottom: 0.8rem;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  background: rgba(19, 23, 31, 0.9);
  border: 1px solid var(--nori-teal);
  color: var(--nori-teal-bright);
  padding: 0.3rem 0.7rem;
  border-radius: 6px;
  font-size: 0.72rem;
  box-shadow: 0 0.4rem 1rem rgba(0, 0, 0, 0.5);
  animation: nori-glow-pulse 2s infinite;
}

.viewport-bottom-tip {
  margin-top: 0.5rem;
  text-align: center;
  font-size: 0.7rem;
  color: var(--text-muted);
}

/* 右侧控制列 */
.controls-column {
  padding: 1rem 1.4rem;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
  background: rgba(23, 27, 34, 0.5);
  border: 1px solid var(--line-subtle);
  border-radius: 8px;
  padding: 0.8rem 1rem;
}

.group-title {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--text-primary);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  padding-bottom: 0.4rem;
}

.control-item {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}
.item-title-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
}
.item-title { color: var(--text-body); }
.item-val { color: var(--nori-teal-bright); font-weight: 600; }

.nori-slider {
  width: 100%;
  accent-color: var(--nori-teal);
  cursor: pointer;
}

.segmented-pills {
  display: flex;
  gap: 0.4rem;
}
.seg-pill {
  flex: 1;
  font-size: 0.72rem;
  padding: 0.3rem 0.5rem;
  background: rgba(19, 23, 31, 0.8);
  border: 1px solid var(--line-subtle);
  border-radius: 4px;
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.2s;
}
.seg-pill.active {
  background: rgba(94, 234, 212, 0.15);
  border-color: var(--nori-teal);
  color: var(--nori-teal-bright);
  font-weight: 500;
}

.switch-item-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.3rem 0;
}
.switch-text {
  display: flex;
  flex-direction: column;
}
.st-title {
  font-size: 0.78rem;
  color: var(--text-primary);
}
.st-desc {
  font-size: 0.68rem;
  color: var(--text-muted);
}

.action-buttons-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
}
.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  font-size: 0.74rem;
  padding: 0.45rem 0.6rem;
  background: rgba(125, 227, 255, 0.08);
  border: 1px solid var(--line-subtle);
  border-radius: 6px;
  color: var(--text-body);
  cursor: pointer;
  transition: all 0.2s;
}
.action-btn:hover {
  background: rgba(125, 227, 255, 0.18);
  border-color: var(--nori-teal);
  color: var(--text-primary);
}
.action-btn.highlight {
  grid-column: span 2;
  background: rgba(94, 234, 212, 0.15);
  border-color: var(--nori-teal);
  color: var(--nori-teal-bright);
  font-weight: 500;
}
.action-btn.highlight:hover {
  background: var(--nori-teal);
  color: var(--on-teal);
}
</style>
