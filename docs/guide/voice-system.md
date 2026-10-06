# 语音系统

这页补充 Nori 2.x 语音功能的工作方式。日常配置只需要看 [开启语音](../user-guide/voice-and-speech.md)。

## 整体流程

Nori 的播放和录音都在桌面宿主中完成，不再通过 WebView 或网页播放器中转。

一次朗读大致会经过：

```text
模型回复
  ↓
TTS 服务生成 WAV
  ↓
Nori 解码为 PCM
  ↓
系统音频设备播放
  ↓
根据播放中的音量驱动 Live2D 嘴形
```

麦克风输入则由系统音频设备直接采集，再交给 Whisper 接口进行识别。

## 支持的 TTS

当前语音设置覆盖：

| 类型 | 适合的情况 |
| :--- | :--- |
| **OpenAI** | 使用 OpenAI 语音接口或对应兼容服务 |
| **Gemini** | 使用 Google Gemini 的语音生成能力 |
| **MiniMax** | 使用 MiniMax 语音接口 |
| **IndexTTS-2** | 连接兼容的 IndexTTS-2 服务 |
| **GPT-SoVITS** | 连接本机或局域网中的 GPT-SoVITS HTTP 服务 |
| **Custom HTTP** | 接入自建的简单语音服务 |

不同服务需要的字段不同，设置页会按当前类型显示对应配置。

## 各平台怎样播放和录音

| 平台 | 当前后端 |
| :--- | :--- |
| Windows | WASAPI |
| macOS | AudioQueue / AudioToolbox |
| Linux | ALSA `default` |

Linux 的 `default` 设备通常可以继续交给 dmix 或 PipeWire 的 ALSA 兼容层处理。

## 为什么要求 WAV

当前原生音频管线直接解码 RIFF/WAVE，支持常见 PCM 或浮点 WAV。

OpenAI 兼容语音请求会明确要求 WAV；GPT-SoVITS 也会请求完整 WAV。Custom HTTP 服务如果实际返回 MP3 或 OGG，即使把 Content-Type 写成 `audio/wav` 也无法正常播放。

一次格式错误只会让当前播放失败，不会破坏之后的语音设置。

## 口型同步

嘴形取自最终播放缓冲的音量变化，因此它反映的是用户真正听到的声音。

这意味着：

- 不依赖网页 `AnalyserNode`
- 不限定某一种 TTS
- 隐藏主窗口也不会改变播放方式

## 语音识别

麦克风录音会整理成适合 Whisper 的 WAV，再交给已经配置好的识别服务。

录音是否离开本机取决于你连接的是远程 Whisper 还是本地服务。Nori 本身不会把录音额外上传到其他位置。
