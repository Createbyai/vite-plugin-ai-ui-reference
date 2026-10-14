import assert from 'node:assert/strict';
import test from 'node:test';
import aiUiReference from '../index.js';
import { installAiUiReference } from '../adapters/client.js';

test('injects a dev client script with default options', () => {
  const plugin = aiUiReference();
  const tags = plugin.transformIndexHtml();

  assert.equal(plugin.apply, 'serve');
  assert.equal(tags.length, 1);
  assert.deepEqual(tags[0], {
    tag: 'script',
    attrs: {
      type: 'module',
      src: '/__ai_ui_reference/client.js',
      'data-ai-ui-reference': '',
      'data-show-search': 'true'
    },
    injectTo: 'body'
  });
});

test('supports a custom endpoint and disabled search', () => {
  const plugin = aiUiReference({ endpoint: '/dev/ui.js', showSearch: false });
  const [tag] = plugin.transformIndexHtml();

  assert.equal(tag.attrs.src, '/dev/ui.js');
  assert.equal(tag.attrs['data-show-search'], 'false');
});

test('can disable automatic HTML injection for framework-owned templates', () => {
  const plugin = aiUiReference({ inject: false });

  assert.equal(plugin.transformIndexHtml, undefined);
  assert.equal(typeof plugin.configureServer, 'function');
});

test('serves the standalone browser client from the dev endpoint', async () => {
  const plugin = aiUiReference();
  let registeredPath;
  let middleware;
  plugin.configureServer({
    middlewares: {
      use(path, handler) {
        registeredPath = path;
        middleware = handler;
      }
    },
    config: { logger: { info() {} } }
  });

  let body = '';
  const headers = new Map();
  const response = {
    setHeader(name, value) { headers.set(name, value); },
    end(value) { body = value; }
  };
  let nextCalled = false;
  await middleware({}, response, () => { nextCalled = true; });

  assert.equal(registeredPath, '/__ai_ui_reference/client.js');
  assert.equal(response.statusCode, 200);
  assert.equal(headers.get('Content-Type'), 'text/javascript; charset=utf-8');
  assert.equal(headers.get('Cache-Control'), 'no-store');
  assert.match(body, /__AI_UI_REFERENCE_INSTALLED__/);
  assert.equal(nextCalled, false);
});

test('client adapter installs once and respects options', () => {
  const scripts = [];
  const documentRef = {
    existing: null,
    createElement(tag) {
      assert.equal(tag, 'script');
      return { dataset: {} };
    },
    querySelector() { return this.existing; },
    body: { append(script) { scripts.push(script); } }
  };

  const script = installAiUiReference({ document: documentRef, endpoint: '/framework/ui.js', showSearch: false });
  assert.equal(script.src, '/framework/ui.js');
  assert.equal(script.type, 'module');
  assert.equal(script.dataset.aiUiReference, '');
  assert.equal(script.dataset.showSearch, 'false');
  assert.equal(scripts.length, 1);

  documentRef.existing = script;
  assert.equal(installAiUiReference({ document: documentRef }), script);
  assert.equal(scripts.length, 1);
});

test('client adapter is safe when no browser document is available', () => {
  assert.equal(installAiUiReference({ document: null }), null);
});
