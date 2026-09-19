'use strict';

(function (root) {
  const API_CANDIDATES = [
    'https://itstory-presenters.archerlab.dev',
    'https://itstory-presenters.yama5993.workers.dev'
  ];
  let API_URL = API_CANDIDATES[0];

  async function apiFetch(path, options) {
    let lastError;
    for (const base of API_CANDIDATES) {
      try {
        const response = await fetch(`${base}${path}`, options);
        if (response.ok || response.status === 400 || response.status === 409) {
          API_URL = base;
          return response;
        }
        lastError = new Error(`http-${response.status}`);
      } catch (error) {
        lastError = error;
      }
    }
    throw lastError || new Error('api-unreachable');
  }

  function topicOf(item) {
    const topic = item.querySelector('.part-topic');
    if (topic) return topic.textContent.trim();
    const clone = item.cloneNode(true);
    clone.querySelectorAll('.part-owner, .part-owner-select').forEach((node) => node.remove());
    return clone.textContent.replace(/\s+/g, ' ').trim();
  }

  function ensureTopic(item, topic) {
    let label = item.querySelector('.part-topic');
    if (label) {
      label.textContent = topic;
      return label;
    }
    label = document.createElement('span');
    label.className = 'part-topic';
    label.textContent = topic;
    item.textContent = '';
    item.append(label);
    return label;
  }

  function setOwnerText(item, owner) {
    item.querySelector('.part-owner-select')?.remove();
    let badge = item.querySelector('.part-owner');
    if (!owner) {
      badge?.remove();
      return;
    }
    if (!badge) {
      badge = document.createElement('span');
      badge.className = 'part-owner';
      item.append(badge);
    }
    badge.hidden = false;
    badge.textContent = owner;
  }

  function availablePeople(assignments, topic, presenters) {
    const taken = new Set(Object.values(assignments).filter(Boolean));
    const current = assignments[topic] || '';
    return presenters.filter((name) => name === current || !taken.has(name));
  }

  function renderSelect(item, topic, assignments, presenters, onChange) {
    ensureTopic(item, topic);
    item.querySelector('.part-owner')?.remove();
    let select = item.querySelector('.part-owner-select');
    if (!select) {
      select = document.createElement('select');
      select.className = 'part-owner-select';
      select.setAttribute('aria-label', `${topic} 발표자`);
      item.append(select);
      select.onchange = () => onChange(topic, select.value);
    }
    const current = assignments[topic] || '';
    const names = [''].concat(availablePeople(assignments, topic, presenters));
    const markup = names
      .map((name) => `<option value="${name}"${name === current ? ' selected' : ''}>${name || '미지정'}</option>`)
      .join('');
    if (select.innerHTML !== markup) {
      select.innerHTML = markup;
      select.value = current;
    }
    select.disabled = false;
  }

  async function readWeek(week) {
    const response = await apiFetch(`/week/${week}`, { cache: 'no-store' });
    if (!response.ok) throw new Error('load-failed');
    return response.json();
  }

  async function writeSelection(week, topic, owner, topics) {
    const response = await apiFetch(`/week/${week}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ topic, owner, topics })
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(payload.error || 'save-failed');
    return payload;
  }

  function mount(rows, study) {
    let live = {};
    let boundWeek = 0;

    const paint = (week, assignments, open) => {
      const row = rows[week - 1];
      if (!row) return;
      const items = [...row.querySelectorAll('.parts li')];
      const topics = items.map(topicOf);
      const presenters = study.presentersForWeek(week);
      if (open) {
        const onChange = async (topic, owner) => {
          try {
            const saved = await writeSelection(week, topic, owner, topics);
            live = saved.assignments || {};
            paint(week, live, true);
            root.dispatchEvent(new CustomEvent('itstory-assignments', { detail: { week, assignments: live } }));
          } catch (error) {
            console.warn(error);
            sync();
          }
        };
        items.forEach((item) => renderSelect(item, topicOf(item), assignments, presenters, onChange));
      } else {
        items.forEach((item) => {
          const topic = topicOf(item);
          setOwnerText(item, assignments[topic] || item.querySelector('.part-owner')?.textContent.trim() || '');
        });
      }
    };

    const sync = async () => {
      const now = new Date();
      const week = study.getAssignmentWeek(now);
      const closed = study.getWeekToFinalize(now);
      if (closed && closed !== week) {
        try {
          const locked = await readWeek(closed);
          paint(closed, locked.assignments || live, false);
        } catch (error) {
          paint(closed, live, false);
        }
      }
      rows.forEach((row, index) => {
        if (week && index + 1 === week) return;
        if (closed && index + 1 === closed) return;
        row.querySelectorAll('.part-owner-select').forEach((select) => {
          const item = select.closest('li');
          setOwnerText(item, select.value);
        });
      });
      if (!week) return;
      const open = study.isSelectionOpen(now, week);
      if (open || boundWeek === week) {
        try {
          const data = await readWeek(week);
          live = data.assignments || live;
        } catch (error) {
          if (open && !Object.keys(live).length) live = {};
        }
      }
      boundWeek = week;
      paint(week, live, open);
      root.dispatchEvent(new CustomEvent('itstory-assignments', { detail: { week, assignments: live, open } }));
    };

    sync();
    setInterval(sync, 4000);
  }

  root.ITStoryPresenterSelect = { mount, API_URL };
})(window);
