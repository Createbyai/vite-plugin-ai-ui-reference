const DEFAULT_ENDPOINT = '/__ai_ui_reference/client.js';

/**
 * Load the UI reference client from a framework-owned browser entry point.
 * Use from a client-only plugin/hook when the framework does not process
 * `index.html` with Vite's `transformIndexHtml` hook.
 */
export function installAiUiReference(options = {}) {
  const documentRef = options.document ?? globalThis.document;
  if (!documentRef?.createElement) return null;

  const existing = documentRef.querySelector?.('script[data-ai-ui-reference]');
  if (existing) return existing;

  const script = documentRef.createElement('script');
  script.type = 'module';
  script.src = options.endpoint || DEFAULT_ENDPOINT;
  script.dataset.aiUiReference = '';
  script.dataset.showSearch = String(options.showSearch !== false);

  const parent = documentRef.body || documentRef.head || documentRef.documentElement;
  if (!parent?.append) return null;
  parent.append(script);
  return script;
}

