# 架构说明

[English version](./ARCHITECTURE_en.md)

`stars-saying` 是一个 Next.js App Router 应用，包含儿童前端体验、服务端大模型接口、官方天文数据适配层和本地优先的学习记忆能力。

## 运行结构

- 浏览器：渲染儿童主流程，并通过 `localStorage` 保存学习进度、星体记忆、愿望和聊天历史。
- Next.js server routes：调用模型服务和官方天文 API，避免密钥进入浏览器。
- 本地兜底数据：当外部 API 或模型不可用时，聊天、知识库、课堂、愿望卡和随机探索仍可使用。

## 主要用户流程

1. 首页：`/`
2. 星体选择：`/chat`
3. 固定星体聊天：`/chat/[id]` -> `/api/chat`
4. 随机星体探索：`/explore` -> `/api/explore/random`
5. 已抽取星体聊天：`/api/explore/chat`
6. 记忆库：`/memory`, `/memory/[id]/chat`
7. 知识与课堂：`/library`, `/knowledge/[id]`, `/classroom`
8. 愿望卡和愿望墙：`/wish`, `/wish-wall`

成人/内部页面通过 `/settings` 保护，不出现在儿童主流程里。

## 关键模块

- `src/data/celestial-bodies.ts`: 固定星体角色和人设。
- `src/data/knowledge-cards.ts`: 已审核科学知识和文化/科学边界。
- `src/data/exploration-catalog.ts`: 随机探索星体目录。
- `src/lib/chat.ts`: 固定星体聊天逻辑、检索和儿童安全边界。
- `src/lib/exploration-chat.ts`: 随机抽取星体的聊天逻辑。
- `src/lib/exploration-generator.ts`: 随机星体摘要与人设生成，包含 LLM 和本地兜底。
- `src/lib/official-astronomy.ts`: 服务端 NASA/JPL/NASA Exoplanet Archive 适配层。
- `src/lib/exploration-memory.ts`: `localStorage` 记忆库封装。
- `src/lib/speech.ts`: 可打断的浏览器语音播放。
- `src/lib/model-config.ts`: 服务端环境变量读取和模型配置。

## 数据与密钥

浏览器不应接收原始服务密钥。以下变量必须只放在服务端环境变量里：

- `KAFU_LLM_API_KEY`
- `OPENAI_API_KEY`
- `GPT_API_KEY`
- `NASA_API_KEY`
- `SETTINGS_PASSWORD`

`/settings` 页面只显示脱敏状态或配置状态，不显示真实密钥。

## 设计取舍

- 儿童主流程本地优先：降低账户和隐私风险。
- 官方数据服务端适配：统一处理超时、失败和兜底文本。
- 知识库优先于模型自由发挥：减少儿童科普场景中的幻觉风险。
- 成人配置入口隔离：保持儿童导航干净，避免误触内部页面。
