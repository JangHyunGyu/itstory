'use strict';

(function (root) {
  let sequence = 0;
  let opened = null;

  function create({ item, topic, onChange }) {
    const id = `presenter-list-${++sequence}`;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'part-owner-select';
    button.setAttribute('role', 'combobox');
    button.setAttribute('aria-label', `${topic} 발표자`);
    button.setAttribute('aria-haspopup', 'listbox');
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-controls', id);
    const menu = document.createElement('div');
    menu.id = id;
    menu.className = 'part-owner-popup';
    menu.setAttribute('role', 'listbox');
    menu.setAttribute('aria-label', `${topic} 발표자`);
    menu.hidden = true;
    const feedback = document.createElement('span');
    feedback.className = 'part-owner-feedback';
    feedback.setAttribute('role', 'status');
    feedback.hidden = true;
    item.append(button, feedback);
    document.body.append(menu);

    let names = [];
    let value = '';
    let active = 0;
    let saving = false;
    let signature = '';
    let typed = '';
    let typedAt = 0;
    const label = name => name || '미지정';

    function highlight(index) {
      active = Math.max(0, Math.min(names.length - 1, index));
      [...menu.children].forEach((option, i) => option.classList.toggle('is-active', i === active));
      if (!menu.hidden) {
        const option = menu.children[active];
        button.setAttribute('aria-activedescendant', option.id);
        if (option.offsetTop < menu.scrollTop) menu.scrollTop = option.offsetTop;
        if (option.offsetTop + option.offsetHeight > menu.scrollTop + menu.clientHeight) {
          menu.scrollTop = option.offsetTop + option.offsetHeight - menu.clientHeight;
        }
      }
    }

    function position() {
      if (menu.hidden) return;
      const anchor = button.getBoundingClientRect();
      if (!button.isConnected || !button.getClientRects().length) { close(); return; }
      const viewport = root.visualViewport;
      const left = (viewport?.offsetLeft || 0) + 8;
      const top = (viewport?.offsetTop || 0) + 8;
      const right = left + (viewport?.width || root.innerWidth) - 16;
      const bottom = top + (viewport?.height || root.innerHeight) - 16;
      if (anchor.bottom < top || anchor.top > bottom || anchor.right < left || anchor.left > right) { close(); return; }
      const width = Math.min(164, right - left);
      menu.style.width = `${width}px`;
      const below = bottom - anchor.bottom - 5;
      const above = anchor.top - top - 5;
      const desired = Math.min(menu.scrollHeight + 2, 264);
      const up = below < desired && above > below;
      const available = Math.max(0, up ? above : below);
      if (available < 32) { close(); return; }
      menu.style.maxHeight = `${Math.min(264, available)}px`;
      const height = menu.getBoundingClientRect().height;
      menu.style.left = `${Math.max(left, Math.min(anchor.right - width, right - width))}px`;
      menu.style.top = `${up ? anchor.top - height - 5 : anchor.bottom + 5}px`;
      menu.dataset.placement = up ? 'above' : 'below';
    }

    function outside(event) {
      if (!button.contains(event.target) && !menu.contains(event.target)) close();
    }
    function scrolled(event) {
      if (menu.contains(event.target)) return;
      position();
    }
    function close(restoreFocus = false) {
      menu.hidden = true;
      button.setAttribute('aria-expanded', 'false');
      button.removeAttribute('aria-activedescendant');
      if (opened === control) opened = null;
      document.removeEventListener('pointerdown', outside, true);
      document.removeEventListener('focusin', outside);
      document.removeEventListener('scroll', scrolled, true);
      root.removeEventListener('resize', position);
      root.visualViewport?.removeEventListener('resize', position);
      root.visualViewport?.removeEventListener('scroll', position);
      if (restoreFocus && button.isConnected) button.focus({ preventScroll: true });
    }
    function open() {
      if (saving || !names.length) return;
      if (opened && opened !== control) opened.close();
      button.focus({ preventScroll: true });
      opened = control;
      menu.hidden = false;
      button.setAttribute('aria-expanded', 'true');
      position();
      if (menu.hidden) return;
      highlight(Math.max(0, names.indexOf(value)));
      document.addEventListener('pointerdown', outside, true);
      document.addEventListener('focusin', outside);
      document.addEventListener('scroll', scrolled, true);
      root.addEventListener('resize', position);
      root.visualViewport?.addEventListener('resize', position);
      root.visualViewport?.addEventListener('scroll', position);
    }
    function setSaving(pending) {
      saving = pending;
      button.setAttribute('aria-disabled', String(pending));
      button.setAttribute('aria-busy', String(pending));
      if (pending) close();
    }
    async function choose(index, restoreFocus = true) {
      if (saving || index < 0 || index >= names.length) return;
      const next = names[index];
      close(restoreFocus);
      if (next === value) return;
      feedback.hidden = true;
      setSaving(true);
      try {
        await onChange(next);
      } catch (error) {
        if (button.isConnected) {
          feedback.textContent = '저장 실패 · 다시 선택해 주세요';
          feedback.hidden = false;
        }
      } finally {
        setSaving(false);
      }
    }

    button.addEventListener('click', () => { if (!saving) menu.hidden ? open() : close(); });
    button.addEventListener('keydown', event => {
      if (saving) return;
      const key = event.key;
      const wasOpen = !menu.hidden;
      if (key === 'Tab') { if (wasOpen) choose(active, false); return; }
      if (key === 'Escape') { if (wasOpen) { event.preventDefault(); close(); } return; }
      if (['Enter', ' ', 'ArrowDown', 'ArrowUp', 'Home', 'End', 'PageUp', 'PageDown'].includes(key)) {
        event.preventDefault();
        if (key === 'Enter' || key === ' ') { wasOpen ? choose(active) : open(); return; }
        if (!wasOpen) open();
        if (key === 'Home' || key === 'PageUp') highlight(0);
        else if (key === 'End' || key === 'PageDown') highlight(names.length - 1);
        else if (wasOpen && key === 'ArrowDown') highlight(active + 1);
        else if (wasOpen && key === 'ArrowUp') { event.altKey ? choose(active) : highlight(active - 1); }
        return;
      }
      if (key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
        event.preventDefault();
        if (!wasOpen) open();
        const now = Date.now();
        typed = now - typedAt < 700 ? typed + key : key;
        typedAt = now;
        const query = [...typed].every(c => c === key) ? key : typed;
        for (let offset = 1; offset <= names.length; offset++) {
          const index = (active + offset) % names.length;
          if (label(names[index]).toLocaleLowerCase().startsWith(query.toLocaleLowerCase())) { highlight(index); break; }
        }
      }
    });
    menu.addEventListener('mousedown', event => event.preventDefault());
    menu.addEventListener('pointermove', event => {
      if (event.pointerType !== 'mouse') return;
      const option = event.target.closest('[role="option"]');
      if (option) highlight(Number(option.dataset.index));
    });
    menu.addEventListener('click', event => {
      const option = event.target.closest('[role="option"]');
      if (option) choose(Number(option.dataset.index));
    });

    const control = {
      button, close, setSaving,
      update(nextValue, nextNames, change) {
        onChange = change;
        const previousActive = names[active];
        value = nextValue;
        names = nextNames;
        button.value = value;
        button.textContent = label(value);
        const nextSignature = JSON.stringify([value, names]);
        if (signature === nextSignature) return;
        signature = nextSignature;
        menu.replaceChildren(...names.map((name, index) => {
          const option = document.createElement('div');
          option.id = `${id}-${index}`;
          option.className = 'part-owner-option';
          option.dataset.index = String(index);
          option.dataset.value = name;
          option.setAttribute('role', 'option');
          option.setAttribute('aria-selected', String(name === value));
          option.textContent = label(name);
          return option;
        }));
        if (!menu.hidden) {
          position();
          highlight(Math.max(0, names.indexOf(previousActive)));
        }
      },
      destroy() { close(); menu.remove(); feedback.remove(); button.remove(); }
    };
    return control;
  }
  root.ITStoryPresenterCombo = { create };
})(window);
