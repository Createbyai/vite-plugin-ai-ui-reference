import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const CLIENT_PATH = '/__ai_ui_reference/client.js';
const clientFile = fileURLToPath(new URL('./client.js', import.meta.url));

export default function aiUiReference(options = {}) {
  const endpoint = options.endpoint || CLIENT_PATH;
  const showSearch = options.showSearch !== false;
  const inject = options.inject !== false;

  return {
    name: 'vite-plugin-ai-ui-reference',
    apply: 'serve',
    enforce: 'post',
    ...(inject ? {
      transformIndexHtml() {
        return [{
          tag: 'script',
          attrs: { type: 'module', src: endpoint, 'data-ai-ui-reference': '', 'data-show-search': String(showSearch) },
          injectTo: 'body'
        }];
      }
    } : {}),
    configureServer(server) {
      server.middlewares.use(endpoint, async (_request, response, next) => {
        try {
          const source = await readFile(clientFile, 'utf8');
          response.statusCode = 200;
          response.setHeader('Content-Type', 'text/javascript; charset=utf-8');
          response.setHeader('Cache-Control', 'no-store');
          response.end(source);
        } catch (error) {
          next(error);
        }
      });
      server.config.logger.info('[ai-ui-reference] Dev overlay enabled · Alt+Shift+U');
    }
  };
}
