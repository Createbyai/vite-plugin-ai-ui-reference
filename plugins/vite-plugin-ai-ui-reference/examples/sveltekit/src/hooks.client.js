import { installAiUiReference } from 'vite-plugin-ai-ui-reference/client';

export function init() {
  if (import.meta.env.DEV) installAiUiReference();
}
