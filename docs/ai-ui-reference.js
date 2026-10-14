(() => {
  if (window.__AI_UI_REFERENCE_INSTALLED__) return;
  window.__AI_UI_REFERENCE_INSTALLED__ = true;

  const host = document.createElement('div');
  host.id = '__ai_ui_reference_root__';
  host.style.cssText = 'all:initial;position:fixed;inset:0;z-index:2147483647;pointer-events:none';
  const shadow = host.attachShadow({ mode: 'open' });
  document.documentElement.append(host);
  const pluginScript = document.querySelector('script[data-ai-ui-reference]');
  const showSearch = pluginScript?.dataset.showSearch !== 'false';

  const style = document.createElement('style');
  style.textContent = `
    :host{all:initial;color:#202833;font:12px/1.45 Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
    *,*::before,*::after{box-sizing:border-box}
    .layer{position:fixed;inset:0;pointer-events:none}
    .trigger{position:fixed;right:18px;bottom:18px;pointer-events:auto;border:0;border-radius:999px;background:#202a38;color:#fff;padding:10px 14px;box-shadow:0 7px 22px #10182035;cursor:pointer;font:600 12px/1.2 Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;display:flex;align-items:center;gap:8px}
    .trigger kbd{font:11px/1.2 Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color:#c8d0db;background:#ffffff1c;padding:3px 6px;border-radius:4px}
    .panel{position:fixed;right:14px;top:16px;bottom:16px;width:300px;max-height:calc(100vh - 32px);pointer-events:auto;display:flex;flex-direction:column;background:#fff;border:1px solid #dfe3e8;border-radius:11px;box-shadow:0 14px 40px #17203335;overflow:hidden}
    .head{display:flex;align-items:center;padding:12px 13px 10px;border-bottom:1px solid #edf0f2;gap:8px}.head strong{font-size:13px}.snapshot{font-size:10px;color:#737c87;background:#f3f5f7;border-radius:4px;padding:4px 5px;white-space:nowrap}.close{margin-left:auto;border:0;background:transparent;font-size:19px;color:#8a929d;cursor:pointer}
    .search{padding:8px 10px 0}.search-input{width:100%;height:32px;border:1px solid #e2e6eb;border-radius:6px;padding:0 9px;background:#fff;color:#29313b;font:inherit;font-size:11px;outline:none}.search-input::placeholder{color:#a0a7b0}.search-input:focus{border-color:#79b7f5;box-shadow:0 0 0 2px #1683f71a}.search-empty{padding:12px 8px;text-align:center;color:#969da6;font-size:11px}
    .actions{display:flex;padding:8px 10px;gap:6px;border-bottom:1px solid #edf0f2}.actions button{flex:1;border:1px solid #e4e7eb;border-radius:5px;padding:7px 4px;background:#fff;color:#414955;cursor:pointer;font:inherit;font-size:11px}.actions .primary{background:#1683f7;color:#fff;border-color:#1683f7}
    .status{padding:6px 11px;color:#8a919c;font-size:10px}.status.stale{color:#ba6a13;background:#fff8ec}
    .list{overflow:auto;padding:5px;min-height:60px}.item{width:100%;display:flex;align-items:center;gap:5px;background:#fff;padding:4px;border-radius:6px;color:#313843}.item:hover,.item.selected{background:#edf6ff}.item-select{flex:1;min-width:0;display:flex;align-items:center;gap:8px;text-align:left;border:0;background:transparent;padding:3px;cursor:pointer;color:inherit;font:inherit}.number{width:28px;height:21px;display:grid;place-items:center;border-radius:4px;background:#e8f3ff;color:#0670df;font-size:10px;font-weight:700;flex:0 0 auto}.copy{min-width:0}.copy strong{display:block;font-size:11px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.copy small{display:block;margin-top:2px;color:#9299a3;font-size:10px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.item-copy{flex:0 0 auto;opacity:0;pointer-events:none;border:0;border-radius:0;padding:4px 5px;background:transparent;color:#1678df;cursor:pointer;font:inherit;font-size:10px;transition:opacity .12s ease}.item:hover .item-copy,.item:focus-within .item-copy{opacity:1;pointer-events:auto}.item-copy:hover{text-decoration:underline;color:#075eb4}
    .foot{padding:8px 11px;color:#9299a3;font-size:10px;border-top:1px solid #edf0f2}.badge{position:fixed;left:14px;bottom:14px;pointer-events:none;background:#222b38;color:#fff;border-radius:6px;padding:7px 10px;box-shadow:0 4px 18px #1114;font-size:10px}
    .outline{position:fixed;pointer-events:none;border:1px solid #f05c61b8;background:#f05c610c;border-radius:2px}.tag{position:fixed;pointer-events:auto;transform:translate(-3px,-3px);background:#fa555a;color:#fff;border:0;border-radius:3px;padding:2px 4px;font:700 9px/1.2 Inter,-apple-system,sans-serif;box-shadow:0 1px 4px #8f232344;cursor:pointer;white-space:nowrap}.tag.active{background:#e52e42;box-shadow:0 0 0 2px #fff,0 0 0 4px #ef4357}
    .toast{position:fixed;left:50%;bottom:20px;transform:translateX(-50%);pointer-events:none;padding:9px 14px;border-radius:7px;background:#222b38;color:#fff;font-size:12px;box-shadow:0 6px 20px #0003}
    @media(max-width:640px){.panel{width:min(300px,calc(100vw - 20px));right:10px;top:auto;bottom:56px;max-height:52vh}.trigger{right:10px;bottom:10px}.badge{left:10px;bottom:10px}}
    @media(hover:none){.item-copy{opacity:1;pointer-events:auto}}
  `;
  shadow.append(style);

  const layer = document.createElement('div');
  layer.className = 'layer';
  shadow.append(layer);
  let enabled = false;
  let stale = false;
  let snapshotId = '';
  let entries = [];
  let selected = 0;
  let searchQuery = '';
  let toastTimer;
  let renderFrame = 0;
  let observer;
  const targetSelector = 'button,a[href],input:not([type="hidden"]),select,textarea,[role="button"],[role="link"],[role="tab"],[role="menuitem"],[role="checkbox"],[role="radio"],[role="switch"],[role="option"],[role="combobox"],[role="textbox"],[role="region"],[role="dialog"],[contenteditable="true"],main,nav,header,footer,section[aria-label],article,h1,h2,h3,h4,p,label,[aria-label],[data-ai-target]';
  const ignored = (element) => element.closest('#__ai_ui_reference_root__,[data-ai-ui-reference],script,style,template,[aria-hidden="true"]');
  const visible = (element) => {
    const rect = element.getBoundingClientRect();
    const css = getComputedStyle(element);
    return rect.width > 1 && rect.height > 1 && css.display !== 'none' && css.visibility !== 'hidden' && Number(css.opacity) !== 0;
  };
  const clean = (value) => (value || '').replace(/\s+/g, ' ').trim();
  const getName = (element) => {
    const labelledBy = element.getAttribute('aria-labelledby')?.split(/\s+/).map((id) => document.getElementById(id)?.innerText).filter(Boolean).join(' ');
    const labelText = element.labels ? [...element.labels].map((label) => label.innerText).filter(Boolean).join(' ') : '';
    const isFormField = /^(INPUT|TEXTAREA|SELECT)$/.test(element.tagName);
    const name = element.dataset.aiName
      || element.getAttribute('aria-label')
      || labelledBy
      || labelText
      || element.getAttribute('title')
      || element.getAttribute('placeholder')
      || (!isFormField && element.innerText)
      || (element.tagName === 'INPUT' ? `input (${element.type || 'text'})` : element.tagName.toLowerCase());
    return clean(name).slice(0, 100);
  };
  const getRole = (element) => element.getAttribute('role') || ({ BUTTON: 'button', A: 'link', INPUT: element.type === 'checkbox' || element.type === 'radio' ? element.type : 'textbox', TEXTAREA: 'textbox', SELECT: 'combobox', H1: 'heading', H2: 'heading', H3: 'heading', H4: 'heading', SECTION: element.hasAttribute('aria-label') ? 'region' : 'section', MAIN: 'main', NAV: 'navigation', HEADER: 'banner', FOOTER: 'contentinfo', P: 'text', LABEL: 'label' }[element.tagName] || element.tagName.toLowerCase());
  const getContext = (element) => {
    const landmark = element.closest('main,nav,header,footer,form,section,article,[role="dialog"]');
    const heading = landmark?.querySelector('h1,h2,h3,h4') || element.parentElement?.closest('section,article')?.querySelector('h1,h2,h3,h4');
    const label = landmark?.getAttribute('aria-label') || heading?.innerText || landmark?.tagName.toLowerCase() || '';
    return clean(element.dataset.aiContext || label).slice(0, 70);
  };
  const isNestedText = (element) => element.matches('h1,h2,h3,h4,p,label') && element.closest('button,a[href],[role="button"],[role="link"]');

  function scan() {
    const candidates = [...document.querySelectorAll(targetSelector)].filter((element) => {
      if (ignored(element) || isNestedText(element) || !visible(element)) return false;
      const rect = element.getBoundingClientRect();
      if (rect.bottom <= 0 || rect.right <= 0 || rect.top >= innerHeight || rect.left >= innerWidth) return false;
      return true;
    });
    const seen = new Set();
    entries = candidates.filter((element) => {
      const key = `${getRole(element)}|${getName(element)}|${getContext(element)}`;
      if (seen.has(key) && !element.matches('input,textarea,select,button,a,[role="button"],[role="link"]')) return false;
      seen.add(key);
      return true;
    }).map((element, index) => ({ id: index + 1, element, role: getRole(element), name: getName(element), context: getContext(element) }));
    snapshotId = `ui-${new Date().toISOString().slice(0, 10).replaceAll('-', '')}-${Math.random().toString(36).slice(2, 5)}`;
    stale = false;
    render();
  }

  function toast(message) {
    const old = shadow.querySelector('.toast');
    old?.remove();
    const node = document.createElement('div');
    node.className = 'toast';
    node.textContent = message;
    layer.append(node);
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => node.remove(), 2000);
  }

  function copy(text, message) {
    const fallback = () => {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.cssText = 'position:fixed;opacity:0;pointer-events:none';
      document.body.append(textarea);
      textarea.select();
      document.execCommand('copy');
      textarea.remove();
    };
    (navigator.clipboard?.writeText ? navigator.clipboard.writeText(text).catch(fallback) : Promise.resolve(fallback())).then(() => toast(message));
  }

  function select(entry) {
    if (!entry) return;
    selected = entry.id;
    entry.element.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' });
    syncSelection();
    revealListEntry(entry.id);
  }

  function syncSelection() {
    shadow.querySelectorAll('.tag').forEach((node) => node.classList.toggle('active', Number(node.dataset.refId) === selected));
    shadow.querySelectorAll('.item').forEach((node) => node.classList.toggle('selected', Number(node.dataset.refId) === selected));
  }

  function revealListEntry(id) {
    const list = shadow.querySelector('.list');
    const row = list?.querySelector(`[data-ref-id="${id}"]`);
    if (!list || !row) return;
    const listRect = list.getBoundingClientRect();
    const rowRect = row.getBoundingClientRect();
    if (rowRect.top < listRect.top) list.scrollTop -= listRect.top - rowRect.top;
    else if (rowRect.bottom > listRect.bottom) list.scrollTop += rowRect.bottom - listRect.bottom;
  }

  function filterList(panel, query) {
    const list = panel.querySelector('.list');
    if (!list) return;
    const rows = [...list.querySelectorAll('.item')];
    let matches = 0;
    for (const row of rows) {
      const matched = !query || row.dataset.refId.startsWith(query);
      row.hidden = !matched;
      if (matched) matches += 1;
    }
    const empty = list.querySelector('.search-empty');
    if (empty) empty.hidden = matches !== 0;
    const status = panel.querySelector('.status');
    if (status && !stale) status.textContent = query ? (matches ? `${matches} 条编号匹配 · 回车定位精确编号` : '没有匹配的编号') : `${entries.length} 个可见元素 · 单击编号定位清单，双击复制`;
  }

  function copyEntry(entry) {
    copy(`${snapshotId} #${entry.id} ${entry.role}「${entry.name}」${entry.context ? `，位于「${entry.context}」` : ''}`, `#${entry.id} 引用已复制`);
  }

  function marker(className, text, entry, rect) {
    const node = document.createElement(className === 'tag' ? 'button' : 'div');
    node.className = className;
    if (className === 'tag') {
      node.type = 'button';
      node.textContent = `#${entry.id}`;
      node.dataset.refId = String(entry.id);
      node.setAttribute('aria-label', `选择 #${entry.id} ${entry.name}`);
      if (selected === entry.id) node.classList.add('active');
      node.addEventListener('click', (event) => { event.stopPropagation(); select(entry); });
      node.addEventListener('dblclick', (event) => { event.preventDefault(); event.stopPropagation(); copyEntry(entry); });
    }
    node.style.left = `${Math.max(2, rect.left)}px`;
    node.style.top = `${Math.max(2, rect.top)}px`;
    if (className === 'outline') {
      node.style.width = `${rect.width}px`;
      node.style.height = `${rect.height}px`;
    }
    layer.append(node);
    return node;
  }

  function render() {
    if (!enabled) {
      layer.replaceChildren();
      return;
    }
    const oldPanel = shadow.querySelector('.panel');
    const panel = buildPanel();
    layer.replaceChildren();
    renderMarkers();
    layer.append(panel);
    if (oldPanel) panel.querySelector('.list')?.scrollTo(0, oldPanel.querySelector('.list')?.scrollTop || 0);
    syncSelection();
    if (selected) revealListEntry(selected);
  }

  function renderMarkers() {
    layer.querySelectorAll('.outline,.tag').forEach((node) => node.remove());
    for (const entry of entries) {
      const rect = entry.element.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > innerHeight || rect.right < 0 || rect.left > innerWidth) continue;
      marker('outline', '', entry, rect);
      marker('tag', '', entry, rect);
    }
    syncSelection();
  }

  function buildPanel() {
    const panel = document.createElement('aside');
    panel.className = 'panel';
    panel.setAttribute('aria-label', '页面 UI 引用清单');
    const head = document.createElement('div');
    head.className = 'head';
    const title = document.createElement('strong');
    title.textContent = '页面 UI 引用';
    const snapshot = document.createElement('span');
    snapshot.className = 'snapshot';
    snapshot.textContent = snapshotId || '等待扫描';
    const close = document.createElement('button');
    close.className = 'close'; close.type = 'button'; close.textContent = '×'; close.setAttribute('aria-label', '关闭编号模式');
    close.addEventListener('click', disable);
    head.append(title, snapshot, close);
    panel.append(head);
    if (showSearch) {
      const searchWrap = document.createElement('div');
      searchWrap.className = 'search';
      const searchInput = document.createElement('input');
      searchInput.type = 'search';
      searchInput.inputMode = 'numeric';
      searchInput.className = 'search-input';
      searchInput.placeholder = '输入编号快速定位，例如 #12';
      searchInput.setAttribute('aria-label', '输入编号快速定位');
      searchInput.value = searchQuery ? `#${searchQuery}` : '';
      searchInput.addEventListener('input', () => {
        searchQuery = searchInput.value.trim().replace(/^#/, '');
        filterList(panel, searchQuery);
        if (/^\d+$/.test(searchQuery)) {
          const match = entries.find((entry) => entry.id === Number(searchQuery));
          if (match) select(match);
        }
      });
      searchInput.addEventListener('keydown', (event) => {
        if (event.key !== 'Enter') return;
        const match = entries.find((entry) => entry.id === Number(searchQuery));
        if (match) select(match);
      });
      searchInput.addEventListener('search', () => {
        searchQuery = '';
        filterList(panel, '');
      });
      searchWrap.append(searchInput);
      panel.append(searchWrap);
    }
    const actions = document.createElement('div');
    actions.className = 'actions';
    const refresh = document.createElement('button'); refresh.type = 'button'; refresh.textContent = '重新扫描'; refresh.addEventListener('click', scan);
    const exportButton = document.createElement('button'); exportButton.type = 'button'; exportButton.className = 'primary'; exportButton.textContent = '复制清单'; exportButton.addEventListener('click', exportSnapshot);
    actions.append(refresh, exportButton);
    const status = document.createElement('div');
    status.className = `status${stale ? ' stale' : ''}`;
    status.textContent = stale ? '页面有更新 · 请重新扫描后再引用' : `${entries.length} 个可见元素 · 单击编号定位清单，双击复制`;
    const list = document.createElement('div');
    list.className = 'list';
    list.setAttribute('role', 'list');
    for (const entry of entries) {
      const row = document.createElement('div');
      row.className = `item${selected === entry.id ? ' selected' : ''}`;
      row.dataset.refId = String(entry.id);
      row.setAttribute('role', 'listitem');
      const selectButton = document.createElement('button');
      selectButton.type = 'button'; selectButton.className = 'item-select';
      const number = document.createElement('span'); number.className = 'number'; number.textContent = `#${entry.id}`;
      const labels = document.createElement('span'); labels.className = 'copy';
      const name = document.createElement('strong'); name.textContent = entry.name;
      const meta = document.createElement('small'); meta.textContent = `${entry.role}${entry.context ? ` · ${entry.context}` : ''}`;
      labels.append(name, meta); selectButton.append(number, labels);
      const copyButton = document.createElement('button');
      copyButton.type = 'button'; copyButton.className = 'item-copy'; copyButton.textContent = '复制';
      copyButton.setAttribute('aria-label', `复制 #${entry.id} ${entry.name}`);
      copyButton.addEventListener('click', () => copyEntry(entry));
      selectButton.addEventListener('click', () => select(entry));
      selectButton.addEventListener('dblclick', () => copyEntry(entry));
      row.append(selectButton, copyButton);
      list.append(row);
    }
    const foot = document.createElement('div'); foot.className = 'foot'; foot.textContent = '引用只对当前快照有效 · 不收集输入框内容';
    const empty = document.createElement('div');
    empty.className = 'search-empty';
    empty.textContent = '没有匹配的编号';
    empty.hidden = true;
    list.append(empty);
    panel.append(actions, status, list, foot);
    if (showSearch && searchQuery) filterList(panel, searchQuery);
    const badge = document.createElement('div'); badge.className = 'badge'; badge.textContent = 'UI 引用模式 · Alt+Shift+U 开关 · Esc 退出';
    panel.append(badge);
    return panel;
  }

  function exportSnapshot() {
    const payload = {
      snapshot_id: snapshotId,
      page: `${location.pathname}${location.search}`,
      viewport: { width: innerWidth, height: innerHeight },
      stale,
      elements: entries.map((entry) => {
        const rect = entry.element.getBoundingClientRect();
        const testId = entry.element.getAttribute('data-testid');
        const locator = entry.element.id
          ? { type: 'id', value: entry.element.id }
          : testId
            ? { type: 'testid', value: testId }
            : { type: 'role-name', role: entry.role, name: entry.name };
        return { ref: `#${entry.id}`, role: entry.role, name: entry.name, context: entry.context, locator, rect: { x: Math.round(rect.x), y: Math.round(rect.y), width: Math.round(rect.width), height: Math.round(rect.height) }, state: entry.element.disabled ? 'disabled' : 'enabled' };
      })
    };
    copy(JSON.stringify(payload, null, 2), '编号清单已复制，可以粘贴给 AI');
  }

  function enable() {
    if (enabled) return;
    enabled = true;
    selected = 0;
    scan();
  }

  function disable() {
    enabled = false;
    entries = [];
    layer.replaceChildren(createTrigger());
  }

  function createTrigger() {
    const trigger = document.createElement('button');
    trigger.className = 'trigger'; trigger.type = 'button'; trigger.setAttribute('aria-label', '开启 AI UI 编号模式');
    trigger.innerHTML = '◎ AI 编号 <kbd>Alt+Shift+U</kbd>';
    trigger.addEventListener('click', () => enabled ? disable() : enable());
    return trigger;
  }

  function markStale() {
    if (!enabled || stale) return;
    stale = true;
    render();
  }

  function scheduleRender() {
    cancelAnimationFrame(renderFrame);
    renderFrame = requestAnimationFrame(() => enabled && renderMarkers());
  }

  document.addEventListener('click', (event) => {
    if (!enabled || host.contains(event.target)) return;
    const element = event.target.closest?.(targetSelector);
    const entry = entries.find((item) => item.element === element);
    if (!entry) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    select(entry);
  }, true);

  window.addEventListener('keydown', (event) => {
    if (event.altKey && event.shiftKey && event.code === 'KeyU') {
      event.preventDefault();
      enabled ? disable() : enable();
    } else if (event.key === 'Escape' && enabled) {
      disable();
    }
  });
  window.addEventListener('scroll', scheduleRender, true);
  window.addEventListener('resize', scheduleRender);
  window.addEventListener('popstate', markStale);
  observer = new MutationObserver((records) => {
    if (records.every((record) => host.contains(record.target))) return;
    markStale();
  });
  observer.observe(document.documentElement, { childList: true, subtree: true, characterData: true, attributes: true });

  layer.append(createTrigger());
})();
