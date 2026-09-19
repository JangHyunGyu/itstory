import { DurableObject } from 'cloudflare:workers';
import assignLogic from '../scripts/presenter-assign.js';

const { applySelection, presentersForWeek } = assignLogic;
const LAST_WEEK = 21;

function deadlineForWeek(week) {
  const friday = Date.parse('2026-08-07T00:00:00+09:00') + (week - 1) * 7 * 86400000;
  return new Date(friday - 2 * 86400000 + 20 * 3600000);
}

const ALLOWED_ORIGINS = ['https://itstory.archerlab.dev'];

function corsHeaders(request) {
  const origin = request.headers.get('Origin') || '';
  const allowOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'access-control-allow-origin': allowOrigin,
    'access-control-allow-methods': 'GET, POST, OPTIONS',
    'access-control-allow-headers': 'content-type',
    'access-control-max-age': '86400',
    vary: 'Origin'
  };
}

function json(body, status, request) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      ...corsHeaders(request)
    }
  });
}

export class PresenterBoard extends DurableObject {
  async readWeek(week) {
    return (await this.ctx.storage.get(`week:${week}`)) || { week, assignments: {}, updatedAt: 0 };
  }

  async writeSelection({ week, topic, owner, topics, nowMs }) {
    if (nowMs >= deadlineForWeek(week).getTime()) {
      return { error: 'locked' };
    }
    const current = await this.readWeek(week);
    const assignments = applySelection(
      current.assignments,
      topic,
      owner,
      presentersForWeek(week),
      topics
    );
    const record = { week, assignments, updatedAt: Date.now() };
    await this.ctx.storage.put(`week:${week}`, record);
    return record;
  }
}

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders(request) });
    }

    const url = new URL(request.url);
    const match = url.pathname.match(/^\/week\/(\d+)$/);
    if (!match) return json({ error: 'not-found' }, 404, request);

    const week = Number(match[1]);
    if (!Number.isInteger(week) || week < 1 || week > LAST_WEEK) {
      return json({ error: 'bad-week' }, 400, request);
    }

    const stub = env.BOARD.getByName('presenters');

    try {
      if (request.method === 'GET') {
        const data = await stub.readWeek(week);
        return json(data, 200, request);
      }

      if (request.method === 'POST') {
        const body = await request.json();
        const topic = typeof body.topic === 'string' ? body.topic.trim() : '';
        const owner = typeof body.owner === 'string' ? body.owner.trim() : '';
        const topics = Array.isArray(body.topics) ? body.topics.map((item) => String(item).trim()).filter(Boolean) : [];
        const presenters = presentersForWeek(week);
        if (!topic || topics.length !== presenters.length) {
          return json({ error: 'bad-payload' }, 400, request);
        }
        const data = await stub.writeSelection({
          week,
          topic,
          owner,
          topics,
          nowMs: Date.now()
        });
        if (data.error === 'locked') return json({ error: 'locked' }, 409, request);
        return json(data, 200, request);
      }
    } catch (error) {
      const code = error && (error.code || error.message);
      if (code === 'unknown-topic' || code === 'unknown-person') {
        return json({ error: code }, 400, request);
      }
      return json({ error: 'server-error' }, 500, request);
    }

    return json({ error: 'method' }, 405, request);
  }
};
