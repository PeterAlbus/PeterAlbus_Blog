# 前端代码结构与运行链路

本文为维护者和智能体提供代码地图。源码与配置是实现细节的权威来源；当目录、路由、状态恢复方式或构建链路变化时，应同步更新本文。

## 系统定位

本仓库是 Vue 3 + TypeScript + Vite 构建的博客 SPA。浏览器通过 Hash 路由承载页面，通过 Axios 或 Element Plus 上传组件访问独立的 Spring Boot 后端，并直接访问一言、IP 查询和静态文件服务。

主要技术栈：

- Vue 3 Composition API、Vue Router 4、Pinia；
- Element Plus、Less；
- Axios + qs；
- `@kangc/v-md-editor`/Prism 用于 Markdown 编辑和预览；
- APlayer 用于音乐播放；
- Vite 负责开发、构建、gzip 产物和组件自动导入。

## 启动与渲染链路

1. `index.html` 提供 `#app` 挂载点。
2. `src/main.ts` 创建 Vue 应用，安装 Pinia、Router、拖拽指令、Markdown 编辑/预览与社交分享插件，并全局注册 Element Plus 图标。
3. `src/App.vue` 固定渲染顶部导航、当前 `RouterView` 和页脚。
4. `src/router/index.ts` 使用 `createWebHashHistory()` 懒加载页面；全局守卫更新进度条、标题与 SEO meta，并尝试用本地 token 恢复用户状态。
5. 页面或组件通过 `src/services/` 请求后端。HTTP 和接口细节见 [`backend-contract.md`](backend-contract.md)。

## 目录职责

| 路径 | 职责 | 修改时的联动点 |
| --- | --- | --- |
| `src/views/` | 路由页面、页面级表单与数据装配 | 路由、领域 API、共享组件 |
| `src/components/` | 导航、页脚、评论、音乐、友链等跨页面 UI | props、Pinia、领域 API |
| `src/router/index.ts` | 路由表、页面元信息、会话恢复 | 新页面、标题/meta、登录态 |
| `src/stores/user.ts` | 当前用户的内存状态 | 登录响应、用户字段、退出流程 |
| `src/services/urlConfig.ts` | 环境基地址与接口路径表 | `.env.*`、后端 controller |
| `src/services/httpConfig.ts` | Axios 创建、编码、token 注入、统一错误处理 | 所有普通 API 调用 |
| `src/services/*Api.ts` | 领域请求函数 | 页面调用与后端接口 |
| `src/directives/dragMove.ts` | 全局拖动指令插件 | 使用该指令的浮层/组件 |
| `src/assets/`、`public/` | 打包资源与原样复制的静态资源 | Vite base 与部署路径 |
| `build/vite/plugins/` | Vite gzip 插件封装 | `vite.config.ts` |

## 页面与路由

所有路由都是 Hash 路由，且当前没有路由级权限标记或拦截。

| 路径 | 页面 | 主要职责 |
| --- | --- | --- |
| `/` | `Home.vue` | 置顶/最新文章、一言、个人信息、友链 |
| `/login` | `Login.vue` | 手机或邮箱密码登录 |
| `/register` | `Register.vue` | 手机或邮箱验证码注册 |
| `/userCenter` | `UserCenter.vue` | 用户资料、密码、手机、邮箱、头像 |
| `/blog?id=...` | `Blog.vue` | 文章详情、目录、分享、评论 |
| `/about` | `About.vue` | 固定文章详情式的“关于”页面 |
| `/document` | `Document.vue` | 当前为占位归档页 |
| `/photo` | `Photo.vue` | 照片墙 |
| `/types` | `Types.vue` | 按文章分类筛选列表 |
| `/editBlog?id=...` | `EditBlog.vue` | 新建或编辑文章、上传封面 |
| `/uploadPhoto` | `UploadPhoto.vue` | 上传照片及名称 |
| `/addFriendLink` | `AddFriendLink.vue` | 新增并预览友链 |

`TopNavBar.vue` 根据 `userIdentity` 控制管理入口的可见性，但这些入口并未由路由守卫保护。真正的写权限由后端控制。

## 状态与数据流

### 用户会话

- 登录接口返回 Sa-Token 信息；`Login.vue` 仅把 `data.tokenValue` 写入 `localStorage.token`。
- `src/stores/user.ts` 保存用户资料，但未启用持久化插件。
- 每次路由切换时，守卫根据 token 和 Pinia 状态调用 `/user/isLogin` 或清理状态。该调用是异步启动的，守卫不会等待其完成后再放行页面。
- 普通 Axios 请求由拦截器注入 token；头像和照片上传由组件显式构造同名请求头。

### 文章与评论

- 首页与分类页读取精简文章列表；后端会过滤隐藏文章并把 `blogContent` 置为空字符串。
- 文章页按 query `id` 拉取完整文章，再用浏览器缓存的 IP 调用浏览计数接口。
- 评论组件先取一级评论，再为每条评论分别取回复和公开用户资料，形成多次请求的装配流程。
- 匿名评论仍要求登录；前端用字符串 `"-1"` 表示隐藏评论者身份。

### 上传

封面、头像和照片上传由 `<el-upload>` 直接执行 multipart POST，不走统一 Axios 封装。上传地址目前分别硬编码在对应页面中，且照片上传使用 `/api` 代理形式；详情和已知偏差见 [`backend-contract.md`](backend-contract.md)。

## 构建与环境

- `.nvmrc` 固定本项目使用的 Node.js `24.19.0`；该版本应通过 NVM 管理，进入仓库后执行 `nvm use`。
- `package.json#packageManager` 固定 pnpm `8.15.9`，与当前 `pnpm-lock.yaml` 的 lockfile v6 匹配；不要用新版 pnpm 强制重写锁文件。
- `.env.development`、`.env.test`、`.env.production` 只设置 `VITE_APP_ENV`。
- `src/services/urlConfig.ts` 根据该值选择后端基地址；当前 dev/prod 相同，test 是占位地址。
- Vite 开发端口为 `8080`，监听 `0.0.0.0`，未启用本地代理。
- `base: './'` 使生产资源使用相对路径，适合静态目录部署。
- `pnpm run build` 并行执行 Vue 类型检查和 Vite 构建；构建产物默认位于 `dist/`。

## 外部依赖边界

除博客后端外，浏览器还直接依赖：

- `https://v1.hitokoto.cn/`：主页一言；
- `https://ip.useragentinfo.com/json`：文章访问计数使用的公网 IP；
- `https://file.peteralbus.com/assets/`：头像、封面、照片、背景等静态资源。

这些请求不经过 `httpConfig.ts`，其失败行为也不受统一错误处理控制。

## 当前验证面

仓库声明了 Vitest，但当前没有测试文件。主要自动验证是 `vue-tsc` 类型检查、Vite 构建和 ESLint。页面行为、权限显示、上传以及前后端字段绑定仍需要联调验证。
