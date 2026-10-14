# vite-plugin-ai-ui-reference

[简体中文](./README.md)

A development-only UI reference overlay for Vite. It helps developers point to visible page elements when discussing a change. The client is injected only by the Vite development server and is excluded from production builds.

## Install

```sh
npm install --save-dev vite-plugin-ai-ui-reference
```

Requires Node.js 20.19.0 or newer and declares Vite 7 as a peer dependency.

Enable it in `vite.config.js`:

```js
import { defineConfig } from 'vite';
import aiUiReference from 'vite-plugin-ai-ui-reference';

export default defineConfig({
  plugins: [aiUiReference()]
});
```

The plugin applies to Vite's `serve` command. By default it injects a script through `transformIndexHtml` and serves the standalone client from the dev server. It does not require Vue or framework-specific runtime code. Production builds do not include the overlay.

Use `Alt+Shift+U` to toggle the overlay and `Esc` to close it. Each scan creates a snapshot ID. Include the copied reference or snapshot with the requested UI change.

Number search is enabled by default. Disable it with `showSearch: false`:

```js
aiUiReference({ showSearch: false })
```

Enter a number such as `12` or `#12` to filter the list; an exact match also navigates to the corresponding page element.

Optional attributes can add semantics to custom controls:

```html
<div data-ai-target data-ai-name="Account card" data-ai-context="Settings / Account">
  ...
</div>
```

## UI references and token usage

A copied item contains the snapshot ID, number, role, name, and page context. When a page has several similar controls, this can be clearer than a phrase such as “the button on the right” and may reduce clarification and rework. A short number can shorten the locator phrase, but it does not guarantee fewer tokens for the entire task: copying the full list adds input context, and the AI still needs relevant source code to implement the change. UI references help identify page elements; they do not replace IDE code selection or map an element to a source file or line. In most cases, copy one item and describe the desired change in natural language.

## SSR and custom HTML entry points

If an SSR dev server runs Vite's `transformIndexHtml()` on its HTML template, the default injection works. For example, Vite SSR middleware can call `vite.transformIndexHtml(url, template)` when rendering the template.

If a framework generates `<head>` and `<body>` itself and does not use Vite's HTML transform hook, disable automatic injection and add the script from a framework template or head hook in development only:

```js
// vite.config.js
import aiUiReference from 'vite-plugin-ai-ui-reference';

export default {
  plugins: [aiUiReference({ inject: false })]
};
```

```html
<!-- Include only in development; do not add this script to production HTML. -->
<script
  type="module"
  src="/__ai_ui_reference/client.js"
  data-ai-ui-reference
  data-show-search="true"
></script>
```

The page must be able to access the Vite dev server endpoint (default: `/__ai_ui_reference/client.js`). If the SSR page and Vite dev server use different origins, proxy this path to the Vite server and configure CORS as needed. The plugin does not rewrite framework SSR lifecycles.

The scanner covers visible semantic controls, text, and explicit `[data-ai-target]` elements in the top-level document. It does not enter iframes or component Shadow DOM and does not read form values.

## Framework compatibility

Vue, React, Svelte SPA, Solid, Preact, and vanilla Vite SPA use the same HTML-entry adapter. Add `aiUiReference()` to the framework's Vite plugin list:

| App | Vite plugin list |
|---|---|
| Vue | `[vue(), aiUiReference()]` |
| React | `[react(), aiUiReference()]` |
| Svelte SPA | `[svelte(), aiUiReference()]` |
| Solid | `[solid(), aiUiReference()]` |
| Preact | `[preact(), aiUiReference()]` |
| Vanilla Vite | `[aiUiReference()]` |

The framework plugins such as `vue()` and `react()` belong to their respective frameworks. This plugin uses the standard HTML entry and does not import their runtimes.

SvelteKit and Nuxt manage SSR HTML themselves. Use `inject: false` and install the generic client from a client-only extension point. Copy the [SvelteKit client hook](./examples/sveltekit/src/hooks.client.js) to `src/hooks.client.js`, or the [Nuxt client plugin](./examples/nuxt/plugins/ai-ui-reference.client.js) to `plugins/ai-ui-reference.client.js`. Both examples install the client only in development.

## Development in this repository

The repository root contains a Vue demo configured to load the local plugin source. From the repository root, install dependencies and start the demo:

```sh
npm install
npm run dev
```

Run the plugin's built-in regression tests from this package directory:

```sh
npm test
```

Run the demo's production build from the repository root to confirm the overlay is excluded:

```sh
npm run build
```

Inspect the npm package file list without publishing it:

```sh
npm pack --dry-run --json
```

The Vite plugin entry is `index.js`, the browser overlay is `client.js`, and the SSR client installer is `adapters/client.js`. Tests are in `test/`; framework examples are in `examples/`.
