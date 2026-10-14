# Vite插件  AI UI Reference

[English](./README.en.md)

本仓库是Vite 开发期 UI 编号插件。
``

## 使用插件

插件源码和完整使用文档位于 [`plugins/vite-plugin-ai-ui-reference`](./plugins/vite-plugin-ai-ui-reference/README.md)。在 Vite 配置中加入插件：

```js
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import aiUiReference from 'vite-plugin-ai-ui-reference';

export default defineConfig({
  plugins: [vue(), aiUiReference()]
});
```

在本仓库的 demo 中，`vite.config.js` 直接引用插件本地源码。插件仅在 Vite 开发服务器中运行；生产构建不包含编号浮层。


## 直接预览

<a href="https://createbyai.github.io/vite-plugin-ai-ui-reference/" target="_blank" rel="noopener noreferrer">在线预览</a>

## 本地运行 demo

要求 Node.js 20.19.0 或更新版本。在仓库根目录运行：

```sh
npm install
npm run dev
```

Vite 会在 `http://127.0.0.1:4173/` 启动页面。生产构建：

```sh
npm run build
`



### 为什么使用 UI 编号

编号引用让开发者能在页面上明确指出某个可见控件，尤其适合页面中有多个相似目标时。单项引用包含快照 ID、编号和元素语义，适合与修改要求一起发送。它可能缩短定位描述并减少误指，但不保证每次都减少总 token：完整清单会增加上下文；IDE 中已选中的源码仍是修改代码位置的直接线索。编号映射到页面元素，不映射到源码文件或行号。建议将单项编号与“改成什么”的自然语言要求组合使用。

### 当前边界

- 编号仅对当前扫描快照有效；重新扫描后请复制新引用。
- 只扫描顶层文档视口内可见的语义目标，不进入 iframe 或组件 Shadow DOM。
- 不读取表单输入值，也不连接外部 AI；复制的引用由开发者粘贴到对话中。
- 不提供组件、源码文件或代码行映射。

## 开发与验证

在插件目录运行 `npm test`；在仓库根目录运行 `npm run build`。发布前可在插件目录运行 `npm pack --dry-run --json` 检查 npm 包清单。操作步骤见插件目录的 [`RELEASE.md`](./plugins/vite-plugin-ai-ui-reference/RELEASE.md)。
