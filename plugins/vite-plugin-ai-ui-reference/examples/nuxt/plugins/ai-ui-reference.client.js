import { installAiUiReference } from 'vite-plugin-ai-ui-reference/client';

export default defineNuxtPlugin(() => {
  if (import.meta.dev) installAiUiReference();
});
