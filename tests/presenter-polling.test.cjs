'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { test } = require('node:test');
const study = require('../assets/js/study-week.js');
const source = fs.readFileSync(path.join(__dirname, '../assets/js/presenter-select.js'), 'utf8');
const flush = () => new Promise(resolve => setImmediate(resolve));

function harness(start = '2026-10-29T03:00:00Z') {
  let now = Date.parse(start);
  let id = 0;
  const timers = new Map();
  const calls = [];
  const events = [];
  const listeners = {};
  let respond = async () => ({ ok: true, json: async () => ({ assignments: {} }) });
  const schedule = (callback, delay, repeat = false) => {
    timers.set(++id, { callback, delay, repeat, at: now + delay });
    return id;
  };
  const document = { hidden: false, addEventListener: (name, callback) => { listeners[name] = callback; } };
  const window = {
    navigator: { onLine: true },
    dispatchEvent: event => events.push(event),
    addEventListener: (name, callback) => { listeners[name] = callback; }
  };
  class ClockDate extends Date {
    constructor(...args) { super(...(args.length ? args : [now])); }
    static now() { return now; }
  }
  vm.runInNewContext(source, {
    window, document, Date: ClockDate, AbortController, console,
    CustomEvent: class { constructor(type, options) { this.type = type; this.detail = options.detail; } },
    setTimeout: (callback, delay) => schedule(callback, delay),
    clearTimeout: timer => timers.delete(timer),
    setInterval: (callback, delay) => schedule(callback, delay, true),
    fetch: (url, options) => {
      calls.push({ url, options, at: now });
      return respond(url, options);
    }
  });
  return {
    calls, events, document, window,
    respond: callback => { respond = callback; },
    start: async () => { window.ITStoryPresenterSelect.mount([], study); await flush(); },
    emit: async name => { listeners[name](); await flush(); },
    advance: async duration => {
      const target = now + duration;
      while (true) {
        const next = [...timers.entries()].filter(([, timer]) => timer.at <= target)
          .sort((a, b) => a[1].at - b[1].at)[0];
        if (!next) break;
        const [timerId, timer] = next;
        now = timer.at;
        if (timer.repeat) timer.at += timer.delay;
        else timers.delete(timerId);
        timer.callback();
        await flush();
      }
      now = target;
      await flush();
    }
  };
}

test('uses the working host, reads the closed week once and polls only the open week', async () => {
  const h = harness();
  await h.start();
  assert.deepEqual(h.calls.map(call => call.url), [
    'https://itstory-presenters.yama5993.workers.dev/week/13',
    'https://itstory-presenters.yama5993.workers.dev/week/14'
  ]);
  await h.advance(28000);
  assert.equal(h.calls.length, 2);
  await h.advance(36000);
  assert.equal(h.calls.length, 4);
  assert.ok(h.calls.slice(2).every(call => call.url.endsWith('/14')));
});

test('hidden and offline pages pause requests, then refresh when visible or online', async () => {
  const h = harness();
  await h.start();
  h.document.hidden = true;
  await h.advance(120000);
  assert.equal(h.calls.length, 2);
  h.document.hidden = false;
  await h.emit('visibilitychange');
  assert.equal(h.calls.length, 3);
  h.window.navigator.onLine = false;
  await h.advance(120000);
  assert.equal(h.calls.length, 3);
  h.window.navigator.onLine = true;
  await h.emit('online');
  assert.equal(h.calls.length, 4);
});

test('slow responses cannot overlap polling cycles', async () => {
  const h = harness();
  let release;
  h.respond(() => new Promise(resolve => { release = resolve; }));
  await h.start();
  await h.advance(8000);
  assert.equal(h.calls.length, 1);
  h.respond(async () => ({ ok: true, json: async () => ({ assignments: {} }) }));
  release({ ok: true, json: async () => ({ assignments: {} }) });
  await flush();
  assert.equal(h.calls.length, 2);
});

test('network and HTTP failures back off, and recovery restores the normal interval', async () => {
  const h = harness();
  let fail = true;
  h.respond(async url => {
    if (fail && url.endsWith('/13')) throw new Error('network');
    return { ok: !fail, status: fail ? 503 : 200, json: async () => ({ assignments: {} }) };
  });
  await h.start();
  await h.advance(32000);
  assert.equal(h.calls.length, 4);
  await h.advance(56000);
  assert.equal(h.calls.length, 4);
  await h.advance(4000);
  assert.equal(h.calls.length, 6);
  await h.advance(116000);
  assert.equal(h.calls.length, 6);
  fail = false;
  await h.advance(4000);
  assert.equal(h.calls.length, 8);
  await h.advance(32000);
  assert.equal(h.calls.length, 9);
  assert.ok(h.calls.at(-1).url.endsWith('/14'));
});

test('hung requests abort after ten seconds and leave the scheduler able to retry', async () => {
  const h = harness();
  h.respond((url, { signal }) => new Promise((resolve, reject) => {
    signal.addEventListener('abort', () => reject(new Error('timeout')));
  }));
  await h.start();
  await h.advance(10000);
  assert.equal(h.calls[0].options.signal.aborted, true);
  assert.equal(h.calls.length, 2);
  await h.advance(10000);
  assert.equal(h.calls[1].options.signal.aborted, true);
  await h.advance(16000);
  assert.equal(h.calls.length, 2);
  h.respond(async () => ({ ok: true, json: async () => ({ assignments: {} }) }));
  await h.advance(16000);
  assert.equal(h.calls.length, 4);
});

test('deadline forces a final read and never carries assignments into the next week', async () => {
  const h = harness('2026-10-28T10:59:58Z');
  h.respond(async url => ({ ok: true, json: async () => ({
    assignments: url.endsWith('/13') ? { topic: 'owner' } : {}
  }) }));
  await h.start();
  assert.deepEqual(h.calls.map(call => call.url.split('/').pop()), ['12', '13']);
  await h.advance(4000);
  assert.deepEqual(h.calls.map(call => call.url.split('/').pop()), ['12', '13', '13', '14']);
  assert.equal(h.events.at(-1).detail.week, 14);
  assert.equal(Object.keys(h.events.at(-1).detail.assignments).length, 0);
  await h.advance(32000);
  assert.equal(h.calls.length, 5);
  assert.ok(h.calls.at(-1).url.endsWith('/14'));
});

test('the last deadline retries a failed final read with backoff, then stops fetching', async () => {
  const h = harness('2026-12-23T10:59:58Z');
  await h.start();
  assert.deepEqual(h.calls.map(call => call.url.split('/').pop()), ['20', '21']);
  h.respond(async () => { throw new Error('network'); });
  await h.advance(28000);
  assert.equal(h.calls.length, 3);
  h.respond(async () => ({ ok: true, json: async () => ({ assignments: {} }) }));
  await h.advance(8000);
  assert.equal(h.calls.length, 4);
  await h.advance(600000);
  assert.equal(h.calls.length, 4);
});
