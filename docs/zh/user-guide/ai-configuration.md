# AI 大模型接入配置

Nori 具备多模型智能 Agent 架构。本章节提供从零基础到进阶的大语言模型（LLM）对接教程，手把手带你完成常用云端服务商或本地离线大模型的接入。

---

## 1. 基础概念简述

- **服务协议 (Provider)**：大模型提供商所使用的接口通信标准（通常大多数现代大模型均兼容 `openai` 格式标准）。
- **Base URL（服务地址）**：模型提供商的 API 访问端点。
- **API Key（密钥）**：你在提供商平台申请的个人访问凭证，落盘时在本地电脑中通过 AES-256-GCM 银行级加密保存。
- **模型名称 (Model)**：要调用的具体大模型型号（如 `deepseek-chat`、`gpt-4o`、`qwen-plus` 等）。

---

## 2. 常用服务商接入指南（图文步骤）

打开主控制台，点击左侧导航栏的 **「设置」**，默认即进入 **「AI 设置」**。

<UiAiSettingsPreview />

### 方案一：DeepSeek 接入（推荐：中文极佳、性价比极高）

1. 前往 [DeepSeek 开放平台](https://platform.deepseek.com/) 注册并登录。
2. 在左侧菜单点击「API Keys」，点击「创建 API Key」，复制生成的密钥字符串（以 `sk-` 开头）。
3. 回到 Nori 的「AI 设置」面板：
   - **服务协议**：选择 `openai`。
   - **Base URL**：填入 `https://api.deepseek.com`。
   - **API Key**：粘贴复制的密钥。
   - **模型**：填入 `deepseek-chat`（日常高情商对话）或 `deepseek-reasoner`（深度思考模型）。
4. 点击右侧的 **「测试连接」** 按钮，弹出绿色成功提示即代表对接成功。

---

### 方案二：通义千问 / 阿里云百炼 或 硅基流动

1. 前往 [阿里云百炼平台](https://bailian.console.aliyun.com/) 或 [硅基流动平台](https://cloud.siliconflow.cn/) 创建 API Key。
2. 在 Nori 中填写：
   - **服务协议**：选择 `openai`。
   - **Base URL**：
     - 阿里云百炼兼容端点：`https://dashscope.aliyuncs.com/compatible-mode/v1`
     - 硅基流动端点：`https://api.siliconflow.cn/v1`
   - **API Key**：填入对应平台获取的密钥。
   - **模型**：如 `qwen-plus`、`qwen-turbo` 或 `deepseek-ai/DeepSeek-V3`。
3. 点击「测试连接」核验通过。

---

### 方案三：官方 OpenAI / Claude / Google Gemini 接入

- **OpenAI (ChatGPT)**：
  - 协议选择 `openai`，Base URL 填入 `https://api.openai.com/v1`，模型填入 `gpt-4o` 或 `gpt-4o-mini`。
- **Anthropic Claude**：
  - 协议选择 `anthropic`，Base URL 填入 `https://api.anthropic.com/v1`，模型填入 `claude-3-5-sonnet-20241022`。
- **Google Gemini**：
  - 协议选择 `google`，Base URL 填入 `https://generativelanguage.googleapis.com/v1beta`，模型填入 `gemini-2.0-flash`。

---

### 方案四：本地离线免费运行（Ollama - 完全无需网络）

如果希望完全保护隐私或在断网环境下使用：

1. 下载并安装 [Ollama 官方客户端](https://ollama.com/)。
2. 打开电脑终端（Terminal 或 cmd），执行以下命令拉取并运行本地模型：
   ```bash
   ollama run deepseek-r1:8b
   ```
3. 在 Nori「AI 设置」中填写：
   - **服务协议**：选择 `openai`。
   - **Base URL**：填入 `http://127.0.0.1:11434/v1`。
   - **API Key**：任意填入 `ollama`。
   - **模型**：填入 `deepseek-r1:8b`（或你在 Ollama 中下载的其它模型名称）。
4. 点击「测试连接」，成功后即可免费离线与 Nori 畅聊。

---

## 3. 对话交互与动作表情联动

配置完成后，点击主控制台左侧的 **「对话」** 标签页：

<UiChatPreview />

- **打字机实时呈现**：输入文字并回车，模型生成的回答会像打字一样实时输出，并支持标准 Markdown 排版、代码高亮与公式。
- **桌宠实时情绪共鸣**：当 Nori 回复包含开心、害羞、疑惑或点头动作时，桌面上的 Live2D 桌宠会同步做出肢体动作，实现真正的情感共鸣。
- **自定义人设 Prompt**：在「AI 设置」底部的「自定义人设」输入框中，你可以添加属于你们之间的专属称呼、口癖或说话风格要求。
