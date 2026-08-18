# PeterAlbus Blog 前端协作指南

本仓库是 PeterAlbus Blog 的 Vue 3 单页前端。修改代码前，先按任务读取下列权威文档：

- 涉及页面、路由、组件、状态或构建时，阅读 [`docs/architecture.md`](docs/architecture.md)。
- 涉及请求、字段、鉴权、上传或后端联调时，阅读 [`docs/backend-contract.md`](docs/backend-contract.md)，并同时核对后端仓库中的 controller/domain 实现。
- `package.json`、`vite.config.ts` 和 `.env.*` 是命令、构建配置和环境选择的权威来源；文档只负责解释它们之间的关系。

## 核心边界

- 页面级 SFC 位于 `src/views/`，跨页面组件位于 `src/components/`，路由统一在 `src/router/index.ts` 注册。
- 普通后端请求必须经 `src/services/httpConfig.ts`；路径集中在 `src/services/urlConfig.ts`，按领域拆分的调用位于 `src/services/*Api.ts`。不要新增散落在页面中的普通 API URL。
- 当前请求契约是 query 参数或 `application/x-www-form-urlencoded`，不是 JSON。除非前后端同时修改，不要只在一端改请求编码、字段名、HTTP 方法或响应结构。
- 后端统一返回 `{ code, message, data }`。`httpConfig.ts` 只把业务 `code === 200` 当作成功，并把业务失败转换为 rejected Promise；调用方拿到的是响应包本身，不是 Axios 的完整响应。
- Sa-Token 值保存在 `localStorage.token`，请求头名固定为 `satoken_peteralbus_blog`。Pinia 用户状态不持久化，由路由守卫调用 `/user/isLogin` 恢复。
- 所有后端 Snowflake ID 都必须按字符串处理。不要转成 JavaScript `number`，否则可能发生精度丢失。
- 权限必须以后端校验为准。前端的菜单和按钮条件只负责展示，不构成访问控制；当前路由本身也没有权限拦截。

## 修改要求

- 修改接口时，沿“页面/组件 → `*Api.ts` → `urlConfig.ts` → 后端 controller/domain”检查全链路，并同步更新 `docs/backend-contract.md` 与后端的 `docs/api-contract.md`。
- 修改用户会话时，同时检查 `src/services/httpConfig.ts`、`src/router/index.ts`、`src/stores/user.ts`、登录/退出页面以及直接上传组件的请求头。
- 修改上传时，注意 Element Plus 的 `<el-upload>` 直接发 multipart 请求，不经过 `httpConfig.ts`；必须单独核对 action、附加字段、token 请求头和响应包。
- 修改领域字段时，检查列表占位对象、表单对象、计算属性和模板渲染。当前项目没有共享 TypeScript 领域模型，字段重复分布在多个 SFC 中。
- 保持现有 Vue Composition API 与 `<script setup lang="ts">` 风格。不要为局部修改引入新的状态层、请求层或兼容分支。
- 不要顺手修复 `docs/backend-contract.md` 中列出的已知契约偏差；需要修复时，应把它作为明确任务并同时修改两端。

## 验证

仓库通过 `.nvmrc` 固定 Node 版本，通过 `package.json#packageManager` 固定 pnpm 版本，并以 `pnpm-lock.yaml` 为依赖锁文件。进入仓库后先让 NVM 选择项目版本，再使用 Corepack 提供的 pnpm：

```sh
nvm use
corepack enable
pnpm install --frozen-lockfile
pnpm run type-check
pnpm run build
```

存在或新增单元测试时，使用一次性运行模式：

```sh
pnpm exec vitest run --environment jsdom
```

`pnpm run lint` 带有 `--fix`，会改写整个仓库。只检查时应直接运行不带 `--fix` 的 ESLint；确需格式化时，只处理本次任务涉及的文件并检查 diff。

提交前至少确认：构建/类型检查结果、`git diff --check`、新增文档链接可达，以及接口改动已在两个仓库同步。若受网络、后端服务或依赖缺失影响无法执行验证，要明确记录未验证项和原因。
