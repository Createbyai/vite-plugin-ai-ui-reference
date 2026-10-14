# UU Settings Demo and AI UI Reference

[简体中文](./README.md)

This repository contains a UU Remote Companion resolution settings demo, a development-time Vite UI reference plugin, and a static preview page that can be hosted directly.

## Preview the page

Open the [standalone HTML demo](./docs/index.html) without installing dependencies. To publish it as a public preview, open **Settings → Pages** in the GitHub repository, select deployment from the intended branch, and set the folder to `/docs`. After deployment, visit `https://<username>.github.io/<repository>/`.

## Run the demo locally

Requires Node.js 20.19.0 or newer. From the repository root:

```sh
npm install
npm run dev
```

Vite serves the page at `http://127.0.0.1:4173/`. Create a production build with:

```sh
npm run build
```

## Use the plugin

The plugin source and full usage guide are in [`plugins/vite-plugin-ai-ui-reference`](./plugins/vite-plugin-ai-ui-reference/README.en.md):

```js
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import aiUiReference from 'vite-plugin-ai-ui-reference';

export default defineConfig({
  plugins: [vue(), aiUiReference()]
});
```

The demo in this repository imports the local plugin source from `vite.config.js`. The overlay runs only in the Vite development server and is excluded from production builds.

### Why use UI references?

Numbered references let a developer point to a visible control, especially when a page contains several similar targets. A copied item includes the snapshot ID, number, and semantic details, so it can accompany the requested change. This can shorten the locator phrase and reduce ambiguity, but it does not guarantee fewer total tokens: a full snapshot adds context, and a selected source block in an IDE is still a direct cue for code edits. References identify page elements; they do not map them to source files or lines. Pair a single-item reference with a natural-language description of the desired change.

### Current boundaries

- References are valid only for the current scan snapshot. Copy a fresh reference after rescanning.
- The scanner covers visible semantic targets in the top-level document; it does not enter iframes or component Shadow DOM.
- It does not read form values or connect to an external AI service. Developers paste copied references into their AI conversation.
- It does not map elements to components, source files, or line numbers.

## Development and validation

Run `npm test` in the plugin directory and `npm run build` from the repository root. Before publishing, run `npm pack --dry-run --json` from the plugin directory to inspect the npm package contents. See the plugin's [`RELEASE.md`](./plugins/vite-plugin-ai-ui-reference/RELEASE.md) for release steps.
