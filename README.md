# Vite + Vue3 + TypeScript

# 前端项目模板

This template should help get you started developing with Vue 3 in Vite.

该模板可以帮助快速构建一个基于Vite的Vue3项目。

## Dependencies / 包含库

+ Vue3 + TypeScript + Less + Vue-Router + ESlint + Axios + Pinia
+ Element-Plus 2.2.15 + ElementPlus-Icons
+ OpenLayers 7 + ECharts 5.3.3 + turf
+ moment / nprogress / qs

## Development  Standard / 开发规范

+ 页面SFC存放于views文件夹内，组件存放于components。
+ 接口url及请求相关方法放置于services文件夹内。不同环境通过VITE_APP_ENV识别。

## Recommended IDE Setup / 推荐IDE及插件

[IntelliJ IDEA](https://www.jetbrains.com/idea/) / [WebStorm](https://www.jetbrains.com.cn/webstorm/)

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Type Support for `.vue` Imports in TS / `.vue` 文件的类型支持

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin) to make the TypeScript language service aware of `.vue` types.

If the standalone TypeScript plugin doesn't feel fast enough to you, Volar has also implemented a [Take Over Mode](https://github.com/johnsoncodehk/volar/discussions/471#discussioncomment-1361669) that is more performant. You can enable it by the following steps:

1. Disable the built-in TypeScript Extension
    1) Run `Extensions: Show Built-in Extensions` from VSCode's command palette
    2) Find `TypeScript and JavaScript Language Features`, right click and select `Disable (Workspace)`
2. Reload the VSCode window by running `Developer: Reload Window` from the command palette.

## Customize configuration / 自定义配置

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup / 安装依赖

```sh
npm install
or pnpm install
```

### Compile and Hot-Reload for Development / 编译并启动热更新服务器

```sh
npm run dev
or pnpm run dev
```

### Type-Check, Compile and Minify for Production / 类型检查并编译

```sh
npm run build
or pnpm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/) / 单元测试

```sh
npm run test:unit
or pnpm run test:unit
```

### Lint with [ESLint](https://eslint.org/) / 使用ESLint

```sh
npm run lint
or pnpm run lint
```



