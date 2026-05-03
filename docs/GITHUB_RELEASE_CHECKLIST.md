# GitHub 发布检查清单

[English version](./GITHUB_RELEASE_CHECKLIST_en.md)

公开发布到 GitHub 前，按这个清单检查一次。

## 仓库状态

- [ ] `.env` 已被 `.gitignore` 忽略。
- [ ] `.env.example` 只包含占位值，不包含真实密钥。
- [ ] `.next/`, `node_modules/`, 日志和本地构建产物已忽略。
- [ ] Claude/Ralph 运行日志没有被纳入仓库。
- [ ] `git status --ignored --short` 确认密钥文件处于 ignored 状态。
- [ ] `git log --all -- .env` 没有输出，说明 `.env` 没有历史提交。
- [ ] `git remote -v` 指向正确的 GitHub 仓库。

## 本地验证

- [ ] `npm run build`
- [ ] `/` 可以加载。
- [ ] `/chat` 可以加载，基础问候能得到回应。
- [ ] `/explore` 可以抽取星体。
- [ ] 随机探索卡片提问会调用 `/api/explore/chat`。
- [ ] `/settings` 需要密码。

## 部署前

- [ ] 在 Vercel 或目标平台设置生产环境变量。
- [ ] 使用非默认 `SETTINGS_PASSWORD`。
- [ ] API/model keys 只保留在服务端。
- [ ] 曾经公开过的密钥已经轮换。
- [ ] README 和 `docs/` 已拆分为中文主文档与 `_en.md` 英文文档。

## 推荐 GitHub 发布步骤

```bash
git status --short --ignored
git log --all -- .env
npm run build
git remote add origin git@github.com:<owner>/<repo>.git
git push -u origin main
```

如果使用 HTTPS remote：

```bash
git remote add origin https://github.com/<owner>/<repo>.git
git push -u origin main
```
