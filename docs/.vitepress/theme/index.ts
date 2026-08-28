/// <reference types="vitepress/client" />

import Theme from 'vitepress/theme'
import 'virtual:group-icons.css'
import './styles.css'

import UiIcon from './components/UiIcon.vue'
import UiWizardPreview from './components/UiWizardPreview.vue'
import UiModelPreview from './components/UiModelPreview.vue'
import UiAiSettingsPreview from './components/UiAiSettingsPreview.vue'
import UiVoiceSettingsPreview from './components/UiVoiceSettingsPreview.vue'
import UiMcpPreview from './components/UiMcpPreview.vue'
import UiChatPreview from './components/UiChatPreview.vue'
import UiMainControlPreview from './components/UiMainControlPreview.vue'
import UiMemoryPreview from './components/UiMemoryPreview.vue'
import UiSkillsPreview from './components/UiSkillsPreview.vue'
import UiPluginsPreview from './components/UiPluginsPreview.vue'
import UiAutomationPreview from './components/UiAutomationPreview.vue'
import UiDebugPreview from './components/UiDebugPreview.vue'

export default {
  extends: Theme,
  enhanceApp({ app }) {
    app.component('UiIcon', UiIcon)
    app.component('UiWizardPreview', UiWizardPreview)
    app.component('UiModelPreview', UiModelPreview)
    app.component('UiAiSettingsPreview', UiAiSettingsPreview)
    app.component('UiVoiceSettingsPreview', UiVoiceSettingsPreview)
    app.component('UiMcpPreview', UiMcpPreview)
    app.component('UiChatPreview', UiChatPreview)
    app.component('UiMainControlPreview', UiMainControlPreview)
    app.component('UiMemoryPreview', UiMemoryPreview)
    app.component('UiSkillsPreview', UiSkillsPreview)
    app.component('UiPluginsPreview', UiPluginsPreview)
    app.component('UiAutomationPreview', UiAutomationPreview)
    app.component('UiDebugPreview', UiDebugPreview)
  }
}
