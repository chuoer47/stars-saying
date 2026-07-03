# Stars Saying / 假设星星会说话

“假设星星会说话”是一个移动优先的儿童天文学习 Web App。孩子可以随机抽取宇宙朋友、和拟人化星体聊天、查看知识卡片、进入星空课堂，并生成星空愿望卡或在本机愿望墙展示作品。

当前版本以儿童主流程为核心；竞赛说明、模型配置和内部入口保留在密码保护的 `/settings` 区域，不出现在儿童导航里。

在线演示：

- Vercel: https://stars-saying.vercel.app

## 主要能力

- 拟人化星体聊天：太阳、月球、行星、恒星、星座、深空天体和系外行星。
- API 支持的随机抽星：服务端读取 NASA/JPL/NASA Exoplanet Archive，并生成儿童可读的科普说明和星体性格。
- 本机星体记忆库：抽到的星体会保存在浏览器本地，后续可以继续复习和聊天。
- 儿童语音体验：支持浏览器语音输入、温柔朗读和可打断播放。
- 横向拖动与折叠内容：减少长页面堆叠，更适合手机展示。
- 本地课堂记录：区分已学/未学，并支持反向修改。
- 儿童安全边界：个人信息、危险内容和不适合儿童的话题会被拦截或温柔引导。

## 技术栈

- Next.js App Router
- TypeScript
- Tailwind CSS
- Vercel AI SDK / OpenAI-compatible provider
- 本地审核知识库优先
- 服务端 NASA/JPL 官方天文数据适配层
- API 支持的随机星体探索
- 本地优先的探索记忆库

## 快速开始

```bash
npm install
cp .env.example .env
npm run dev
```

打开 `http://localhost:3000`。

没有模型密钥时，应用仍会使用本地兜底内容运行。只有需要实时大模型生成或更高 NASA API 配额时，才需要配置 `.env`。

## 常用命令

```bash
npm install
npm run dev
npm run build
```

`package.json` 里保留了 `npm run lint`，但当前 Next.js 15 项目主要通过 `npm run build` 执行类型检查和构建验证。

## 环境变量

不要提交 `.env`。公开仓库只保留 `.env.example`。

重要变量：

- `KAFU_LLM_API_KEY`, `KAFU_LLM_BASE_URL`, `KAFU_CHAT_MODEL`: OpenAI-compatible KAFU 模型服务。
- `OPENAI_API_KEY`, `OPENAI_BASE_URL`, `OPENAI_MODEL`: OpenAI-compatible 兜底模型服务。
- `GPT_API_KEY`, `GPT_BASE_URL`, `GPT_CHAT_MODEL`: 兼容旧配置名的模型服务。
- `NASA_API_KEY`: 可选 NASA API key；未配置时使用 `DEMO_KEY`。
- `SETTINGS_PASSWORD`: `/settings` 和成人/内部页面的访问密码。

## 项目结构

- `src/app`: 路由、页面、loading 状态、API routes
- `src/components`: 面向儿童主流程的交互组件
- `src/data`: 星体、知识卡片、课堂内容
- `src/lib`: 聊天约束、检索、语音、官方天文 API 适配
- `src/types`: 共享领域类型
- `docs`: 部署、架构、移动端、安全和发布文档
- `.codex`: 继续开发说明与任务状态
- `.codex/reference`: Ralph 阶段需求与计划归档，仅用于审计和历史追踪

## 关键路由

- `/`: 儿童入口
- `/explore`: API 支持的随机星体探索
- `/memory`: 已探索星体的本机记忆库
- `/chat` 和 `/chat/[id]`: 星体选择与聊天
- `/knowledge/[id]` 和 `/library`: 知识卡片与星图检索
- `/classroom` 和 `/classroom/[id]`: 短课程模块
- `/wish`: 星空愿望卡生成
- `/wish-wall`: 本地优先愿望墙
- `/settings`: 密码保护的成人配置和项目说明
- `/intro`, `/account`, `/dashboard`, `/studio`, `/lab`, `/exhibition`: 受保护的成人/内部页面

## 儿童安全

- 儿童主流程不需要账户。
- 默认不公开发布儿童输入内容。
- 愿望、记忆和聊天记录保存在当前设备浏览器里。
- 愿望墙会拦截危险内容和常见个人信息，如电话、地址、学校、邮箱或社交账号。
- 聊天范围保持在天文学习、观测引导和温柔鼓励内。

## 文档

- [架构说明](./docs/ARCHITECTURE.md) / [Architecture](./docs/ARCHITECTURE_en.md)
- [部署说明](./docs/DEPLOYMENT.md) / [Deployment](./docs/DEPLOYMENT_en.md)
- [GitHub 发布检查清单](./docs/GITHUB_RELEASE_CHECKLIST.md) / [GitHub Release Checklist](./docs/GITHUB_RELEASE_CHECKLIST_en.md)
- [手机应用打包](./docs/MOBILE_APP.md) / [Mobile App Packaging](./docs/MOBILE_APP_en.md)
- [儿童安全与隐私](./docs/SAFETY.md) / [Child Safety And Privacy](./docs/SAFETY_en.md)

推荐使用 Vercel 部署，因为项目依赖 Next.js App Router 和服务端 API routes。如果要打包为手机应用，建议先部署 Web 服务，再通过 PWA/Capacitor 包装，同时把模型密钥继续放在服务端。

## 继续开发

发生上下文切换后，建议先阅读：

1. `.codex/CHILD_APP_STRATEGY.md`
2. `.codex/TASKS.md`
3. `.codex/STATE.md`
4. `README.md`

`PRD.md` 是历史产品设想，当前方向以 `.codex` 和本 README 为准。
