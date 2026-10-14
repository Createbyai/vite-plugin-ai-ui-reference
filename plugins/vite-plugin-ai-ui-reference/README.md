# vite-plugin-ai-ui-reference

[English](./README.en.md)

为 Vite 开发服务器添加 UI 编号浮层，帮助开发者在页面上指明要讨论或修改的可见元素。插件只在开发环境运行，生产构建不注入客户端。

## 安装

```sh
npm install --save-dev vite-plugin-ai-ui-reference
```

插件要求 Node.js 20.19.0 或更新版本，并将 Vite 7 声明为 peer dependency。

在 `vite.config.js` 中启用：

```js
import { defineConfig } from 'vite';
import aiUiReference from 'vite-plugin-ai-ui-reference';

export default defineConfig({
  plugins: [aiUiReference()]
});
```

插件只应用于 Vite `serve` 命令；默认通过 `transformIndexHtml` 注入脚本，并由 dev server 路由提供独立客户端。客户端通过启用时扫描 DOM，不要求业务页面依赖 Vue，也不要求业务组件接入插件 API。关闭 `vite build` 环境时，开发辅助不会进入产物。

快捷键：`Alt+Shift+U` 开关，`Esc` 退出。每次扫描会生成快照 ID；请将复制的清单与 UI 修改要求一起交给 AI。

编号搜索框默认启用。在插件选项中设置 `showSearch: false` 可关闭：

```js
aiUiReference({ showSearch: false })
```

输入编号（例如 `12` 或 `#12`）会筛选清单并定位精确匹配项。

## 编号引用与 token

单项引用包含快照 ID、编号、角色、名称和页面上下文。目标不唯一时，这比“右边那个按钮”更明确，也可能减少追问和返工。短编号可缩短定位描述，但不能据此保证整个任务少用 token：复制完整清单会增加输入上下文；AI 仍需读取相关源码来实现修改。编号是页面元素的定位辅助，不替代 IDE 代码选择器，也不提供源码文件或行号映射。通常建议复制单项引用，并用自然语言说明期望的变化。

可选属性用于补充自动提取不到的语义：

```html
<div data-ai-target data-ai-name="账号卡片" data-ai-context="设置 / 账号">
  ...
</div>
```

## SSR 与自定义 HTML 入口

如果 SSR 开发服务器使用 Vite 的 `transformIndexHtml()` 处理 HTML 模板，默认注入方式可继续使用。例如，Vite SSR 中间件模式可在渲染模板时调用 `vite.transformIndexHtml(url, template)`；该调用会执行注册的 HTML 转换钩子。

如果框架自行生成 `<head>`/`<body>`，没有调用 Vite 的 HTML 转换钩子，则关闭自动注入，并在**开发环境**由框架模板或 head 钩子加入脚本：

```js
// vite.config.js
import aiUiReference from './plugins/vite-plugin-ai-ui-reference/index.js';

export default {
  plugins: [aiUiReference({ inject: false })]
};
```

```html
<!-- 仅在开发环境输出；生产 HTML 不要包含这段脚本 -->
<script
  type="module"
  src="/__ai_ui_reference/client.js"
  data-ai-ui-reference
  data-show-search="true"
></script>
```

自定义入口必须能从浏览器访问 Vite dev server 的 `endpoint`（默认 `/__ai_ui_reference/client.js`）。若 SSR 页面和 Vite dev server 使用不同 origin，请通过开发代理将该路径转发到 Vite dev server，并按需配置 Vite CORS。框架未公开 SSR HTML 钩子或无法安全添加开发期脚本时，需要由该框架的集成层完成接入；本插件不会改写框架的 SSR 流程。

扫描范围是顶层文档当前视口中可见的语义控件、文案和显式 `[data-ai-target]`。不会进入 iframe 或组件 Shadow DOM；不会读取表单输入值。

## 框架适配

Vue、React、Svelte、Solid、Preact 和原生 Vite SPA 共用同一个 HTML 入口适配器，不需要各自的框架运行时适配代码。把 `aiUiReference()` 放入对应的 `vite.config.js` 插件列表即可：

| 应用 | Vite 插件列表 |
|---|---|
| Vue | `[vue(), aiUiReference()]` |
| React | `[react(), aiUiReference()]` |
| Svelte SPA | `[svelte(), aiUiReference()]` |
| Solid | `[solid(), aiUiReference()]` |
| Preact | `[preact(), aiUiReference()]` |
| 原生 Vite | `[aiUiReference()]` |

其中 `vue()`、`react()` 等是各框架自己的 Vite 插件；UI 引用插件只需要标准 HTML 入口，不会导入这些框架运行时。常规 Vite SPA 的完整示例：

```js
plugins: [vue(), aiUiReference()]
```

SvelteKit 和 Nuxt 会自行管理 SSR HTML，使用开发服务器插件提供脚本端点，再从框架的客户端扩展点加载通用客户端适配器。接入本插件后，配置 `inject: false`，避免重复注入。这里的 import 使用已安装、workspace 链接或项目相对路径可解析到 `vite-plugin-ai-ui-reference` 的源文件；示例没有增加 Vue、React、Svelte、Solid、Preact、SvelteKit 或 Nuxt 依赖到本 demo。

**SvelteKit**（`vite.config.js`）：

```js
import { sveltekit } from '@sveltejs/kit/vite';
import aiUiReference from 'vite-plugin-ai-ui-reference';

export default {
  plugins: [sveltekit(), aiUiReference({ inject: false })]
};
```

复制 [SvelteKit 客户端 hook 示例](./examples/sveltekit/src/hooks.client.js) 到 `src/hooks.client.js`。其 `init()` 只在 `dev` 模式安装客户端。

**Nuxt**（`nuxt.config.ts`）：

```ts
import aiUiReference from 'vite-plugin-ai-ui-reference';

export default defineNuxtConfig({
  vite: { plugins: [aiUiReference({ inject: false })] }
});
```

复制 [Nuxt 客户端插件示例](./examples/nuxt/plugins/ai-ui-reference.client.js) 到 `plugins/ai-ui-reference.client.js`。`.client` 限定浏览器端，`import.meta.dev` 限定开发模式。两个框架的客户端扩展点约定见 [SvelteKit hooks 文档](https://svelte.dev/docs/kit/hooks) 和 [Nuxt plugins 文档](https://nuxt.com/docs/guide/directory-structure/plugins)。

## 在本仓库开发

本仓库根目录包含 Vue demo，Vite 配置直接加载本地插件源码。首次安装依赖并启动 demo：

```sh
# 在仓库根目录运行
npm install
npm run dev
```

在浏览器中打开终端显示的本地地址，修改插件后刷新页面即可查看效果。生产构建 demo 可用于确认开发浮层不会进入产物：

```sh
npm run build
```

插件本身的回归用例使用 Node.js 内置测试运行器，不需要额外测试依赖：

```sh
# 在 plugins/vite-plugin-ai-ui-reference 目录运行
npm test
```

发布前可在插件目录检查 npm 实际打包的文件清单，不会上传包：

```sh
npm pack --dry-run --json
```

插件入口是 `index.js`；开发期浏览器浮层在 `client.js`；SSR 框架用的客户端安装器在 `adapters/client.js`；SvelteKit 和 Nuxt 示例分别位于 `examples/`。修改扫描和交互逻辑时，应运行插件回归用例以及仓库根目录的 demo 生产构建。

