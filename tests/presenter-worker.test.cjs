'use strict';
const assert = require('node:assert/strict');
const test = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assignLogic = require('../scripts/presenter-assign.js');

function harness(now = '2026-10-12T12:00:00+09:00') {
  const records = new Map();
  const source = fs.readFileSync(path.join(__dirname, '../worker/presenters.js'), 'utf8')
    .replace("import { DurableObject } from 'cloudflare:workers';", 'class DurableObject { constructor(ctx) { this.ctx = ctx; } }')
    .replace("import assignLogic from '../scripts/presenter-assign.js';", '')
    .replace('export class PresenterBoard', 'class PresenterBoard')
    .replace('export default {', 'const worker = {');
  class Clock extends Date { static now() { return Date.parse(now); } }
  const context = { assignLogic, Response, Request, URL, Date: Clock };
  vm.runInNewContext(source + '\nglobalThis.exports = { PresenterBoard, worker };', context);
  const storage = {
    async get(key) { return records.has(key) ? structuredClone(records.get(key)) : undefined; },
    async put(key, value) { records.set(key, structuredClone(value)); }
  };
  let board = new context.exports.PresenterBoard({ storage });
  const env = { BOARD: { getByName(name) { assert.equal(name, 'presenters'); return board; } } };
  return {
    restart() { board = new context.exports.PresenterBoard({ storage }); },
    fetch(method, week, body) {
      return context.exports.worker.fetch(new Request(`https://itstory-presenters.archerlab.dev/week/${week}`, {
        method, headers: { 'content-type': 'application/json', origin: 'https://itstory.archerlab.dev' },
        ...(body ? { body: JSON.stringify(body) } : {})
      }), env);
    }
  };
}

const topics = ['objects', 'arrays', 'maps', 'complexity', 'structures'];
const people = assignLogic.presentersForWeek(11);

test('POST empty owner persists through GET and a new Durable Object instance', async () => {
  const h = harness();
  for (const [index, topic] of topics.entries()) {
    assert.equal((await h.fetch('POST', 11, { topic, owner: people[index], topics })).status, 200);
  }
  const original = (await (await h.fetch('GET', 11)).json()).assignments;
  const response = await h.fetch('POST', 11, { topic: topics[0], owner: '', topics });
  assert.equal(response.status, 200);
  const saved = (await response.json()).assignments;
  assert.equal(saved[topics[0]], '');
  assert.equal(Object.values(saved).filter(Boolean).length, 4);
  for (const topic of topics.slice(1)) assert.equal(saved[topic], original[topic]);
  h.restart();
  assert.deepEqual((await (await h.fetch('GET', 11)).json()).assignments, saved);
  const repeated = await h.fetch('POST', 11, { topic: topics[0], owner: '', topics });
  assert.deepEqual((await repeated.json()).assignments, saved);
});

test('the existing deadline still rejects changes after assignment closes', async () => {
  const h = harness('2026-10-14T20:00:00+09:00');
  const response = await h.fetch('POST', 11, { topic: topics[0], owner: '', topics });
  assert.equal(response.status, 409);
  assert.equal((await response.json()).error, 'locked');
  assert.deepEqual((await (await h.fetch('GET', 11)).json()).assignments, {});
});
