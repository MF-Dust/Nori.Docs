# 脱敏诊断与日志导出

Nori Desktop Pet 深度贯彻**隐私第一（Privacy-First）**准则。在遇到问题需要向开发者或社区求助时，系统提供了一键生成**严格白名单脱敏诊断包**的工具。

---

## 1. 诊断包导出与隐私白名单边界

在主控制台的 **「设置」→「调试」** 中，点击 **「导出诊断信息」** 按钮，系统将在后台自动生成大小受限的 ZIP 文件（例如 `nori-diagnostics-20250520-123456.zip`）。

```mermaid
flowchart LR
    HOST[Nori 宿主] --> GEN[诊断收集器]
    
    subgraph ALLOW[严格白名单收集内容 (允许包含)]
        V[产品与 Informational 版本号]
        OS[操作系统平台与能力快照]
        L[已脱敏运行日志 (时间/级别/组件)]
        M[Agent 阶段/延迟/Token 消耗元数据]
    end

    subgraph BLOCK[绝对排除黑名单 (物理禁止包含)]
        DB[SQLite 数据库与聊天记录]
        KEY[API 密钥 / Token / 凭据]
        PROMPT[系统提示词与自定义人设]
        AUDIO[录音文件与音频流]
        PATH[真实用户系统文件路径]
    end

    GEN --> ALLOW
    GEN x.-.x BLOCK
```

### 诊断内容白名单详细清单

| 包含条目 | 详细说明 |
| :--- | :--- |
| **版本与环境** | 完整产品 Informational 版本（如 `v1.0.0-dust+a1b2c3d`）、.NET 版本、OS 架构与 WebView 核心版本。 |
| **平台能力快照** | 是否支持原生托盘 (`supportsTray`)、透明穿透 (`supportsHitThrough`)、全局光标 (`supportsGlobalCursor`) 等能力状态。 |
| **运行日志** | 最近的有界脱敏日志（仅保留组件名、耗时与标准错误码，不含用户文本）。 |
| **Agent 指标** | 由 `AgentTraceCollector` 收集的有界内存指标（模型名称、调用耗时、输入/输出 Token 计数），**该收集器在 API 数据结构上物理不接受任何请求或返回正文**。 |

---

## 2. 实时日志与垃圾回收调试

<UiDebugPreview />

在 **「调试 (Debug)」** 面板中，还提供了以下日常排障工具：

- **日志分类过滤器**：按 `全部 (All)`、`错误 (Error)`、`警告 (Warn)`、`信息 (Info)` 快速筛选实时日志。
- **一键复制与打开日志目录**：快速将当前视口日志复制到剪贴板，或一键在系统资源管理器中打开日志存储文件夹。
- **手动触发 GC (`run_gc_collect`)**：强制执行 .NET 垃圾回收（`GC.Collect()`），并直观回显本次回收释放的物理内存容量（MB）。
