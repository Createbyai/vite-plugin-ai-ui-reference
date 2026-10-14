# Vite Plugin AI UI Reference

[简体中文](./README.md)

This repository contains a development-time UI numbering plugin for Vite. The online preview includes the plugin overlay so you can try scanning, searching, locating, and copying element references directly in the page.

## Try the online preview

Open the <a href="https://createbyai.github.io/vite-plugin-ai-ui-reference/" target="_blank" rel="noopener noreferrer">live demo</a> in a new tab. Click **AI 编号** in the lower-right corner, or press `Alt+Shift+U`, to enable the overlay. Search for a number to locate an element, then copy a single reference or the full snapshot. Press `Esc` to close the overlay.

The standalone preview is [`docs/index.html`](./docs/index.html); it embeds the browser client so it works when hosted as a static page without a Vite server.

## Use the plugin

The plugin source and full usage guide are in [`plugins/vite-plugin-ai-ui-reference`](./plugins/vite-plugin-ai-ui-reference/README.en.md). Add it to your Vite configuration:

```js
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import aiUiReference from 'vite-plugin-ai-ui-reference';

export default defineConfig({
  plugins: [vue(), aiUiReference()]
});
```

The repository demo loads the local plugin source from `vite.config.js`. The overlay runs only in the Vite development server and is excluded from production builds.

## Run the demo locally

Requires Node.js 20.19.0 or newer. From the repository root, run:

```sh
npm install
npm run dev
```

Vite serves the page at `http://127.0.0.1:4173/`. Create a production build with:

```sh
npm run build
```

## Why use UI references?

Numbered references let developers point to a visible control, especially when a page has several similar targets. A copied item includes a snapshot ID, number, and semantic details that can accompany the requested change. This can shorten the locator phrase and reduce ambiguity, but it does not guarantee fewer tokens overall: a full snapshot adds context, and source code is still needed to implement the change. References identify page elements; they do not map them to source files or lines. Pair a single-item reference with a natural-language description of the desired change.

## Current boundaries

- References are valid only for the current scan snapshot. Copy a fresh reference after rescanning.
- The scanner covers visible semantic targets in the top-level document. It does not enter iframes or component Shadow DOM.
- It does not read form values or connect to an external AI service. Developers paste copied references into their AI conversation.
- It does not map elements to components, source files, or line numbers.

## Development and validation

Run `npm test` in the plugin directory and `npm run build` from the repository root. Before publishing, run `npm pack --dry-run --json` in the plugin directory to inspect the package contents. See the plugin's [`RELEASE.md`](./plugins/vite-plugin-ai-ui-reference/RELEASE.md) for release steps.
