'use strict';

const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const {
  STUDY_START_DATE,
  LAST_WEEK,
  getStudyWeek,
  getAssignmentWeek,
  getWeekToFinalize,
  deadlineForWeek
} = require('../assets/js/study-week.js');

const PRESENTER_API_URLS = [
  process.env.PRESENTER_API_URL,
  'https://itstory-presenters.archerlab.dev',
  'https://itstory-presenters.yama5993.workers.dev'
].filter(Boolean);

const EARLY_PRESENTERS = ['장현규', '김유진', '김수민', '변진수'];
const FULL_PRESENTERS = [...EARLY_PRESENTERS, '김태훈'];
const WEEK_OL_RE =
  /<th class="week-cell" scope="row"><span>회차<\/span>(\d{2})<\/th>[\s\S]*?<ol class="parts">([\s\S]*?)<\/ol>/g;

function presentersForWeek(week) {
  return week <= 3 ? EARLY_PRESENTERS : FULL_PRESENTERS;
}

function shuffle(items, randomInt = (max) => crypto.randomInt(max)) {
  const next = [...items];
  for (let index = next.length - 1; index > 0; index -= 1) {
    const swapWith = randomInt(index + 1);
    [next[index], next[swapWith]] = [next[swapWith], next[index]];
  }
  return next;
}

function parsePartItems(innerHtml) {
  return [...innerHtml.matchAll(/<li>([\s\S]*?)<\/li>/g)].map(([, inner]) => {
    const topic = inner.match(/<span class="part-topic">([\s\S]*?)<\/span>/);
    const owner = inner.match(/<span class="part-owner">([\s\S]*?)<\/span>/);
    return {
      topic: (topic ? topic[1] : inner).trim(),
      owner: owner ? owner[1].trim() : ''
    };
  });
}

function formatOl(items, multiline) {
  const lines = items.map((item) => {
    const topic = `<span class="part-topic">${item.topic}</span>`;
    const owner = item.owner ? `<span class="part-owner">${item.owner}</span>` : '';
    return `<li>${topic}${owner}</li>`;
  });
  if (!multiline) return `<ol class="parts">${lines.join('')}</ol>`;
  return [
    '<ol class="parts">',
    ...lines.map((line) => `                    ${line}`),
    '                  </ol>'
  ].join('\n');
}

function findWeekParts(html, week) {
  const label = String(week).padStart(2, '0');
  WEEK_OL_RE.lastIndex = 0;
  let match;
  while ((match = WEEK_OL_RE.exec(html))) {
    if (match[1] === label) {
      return {
        full: match[0],
        inner: match[2],
        index: match.index,
        end: match.index + match[0].length
      };
    }
  }
  return null;
}

function fillUnassignedOwners(items, week, randomInt) {
  const taken = new Set(items.map((item) => item.owner).filter(Boolean));
  const remainingPeople = shuffle(
    presentersForWeek(week).filter((name) => !taken.has(name)),
    randomInt
  );
  let nextIndex = 0;
  return items.map((item) => {
    if (item.owner) return item;
    const owner = remainingPeople[nextIndex];
    nextIndex += 1;
    if (!owner) return item;
    return { ...item, owner };
  });
}

function assignWeekOwners(html, week, randomInt, seedOwners = {}) {
  if (week < 1 || week > LAST_WEEK) {
    return { changed: false, html, week, reason: 'out-of-range', assignments: [] };
  }

  const found = findWeekParts(html, week);
  if (!found) {
    return { changed: false, html, week, reason: 'missing-week', assignments: [] };
  }

  const originalItems = parsePartItems(found.inner);
  if (!originalItems.length) {
    return { changed: false, html, week, reason: 'no-topics', assignments: [] };
  }

  const items = originalItems.map((item) => ({
    ...item,
    owner: item.owner || seedOwners[item.topic] || ''
  }));
  const assigned = fillUnassignedOwners(items, week, randomInt);
  const newlyAssigned = assigned.filter((item, index) => item.owner && item.owner !== originalItems[index].owner);
  if (!newlyAssigned.length) {
    return { changed: false, html, week, reason: 'already-assigned', assignments: assigned };
  }

  const replacement = found.full.replace(
    `<ol class="parts">${found.inner}</ol>`,
    formatOl(assigned, found.inner.includes('\n'))
  );
  return {
    changed: true,
    html: `${html.slice(0, found.index)}${replacement}${html.slice(found.end)}`,
    week,
    reason: 'assigned',
    assignments: assigned,
    newlyAssigned
  };
}

function writeGithubOutput(values) {
  const file = process.env.GITHUB_OUTPUT;
  if (!file) return;
  const body = Object.entries(values)
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');
  fs.appendFileSync(file, `${body}\n`);
}

function parseArgs(argv) {
  const options = { week: null, dryRun: false, now: null, file: path.join(__dirname, '..', 'roadmap.html') };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--week') options.week = Number(argv[++index]);
    else if (arg === '--now') options.now = argv[++index];
    else if (arg === '--file') options.file = argv[++index];
    else if (arg === '--dry-run') options.dryRun = true;
    else throw new Error(`Unknown argument: ${arg}`);
  }
  return options;
}

async function fetchRemoteOwners(week) {
  for (const base of PRESENTER_API_URLS) {
    try {
      const response = await fetch(`${base.replace(/\/$/, '')}/week/${week}`);
      if (!response.ok) continue;
      const payload = await response.json();
      if (payload.assignments && typeof payload.assignments === 'object') return payload.assignments;
    } catch (error) {
      // try the next API host
    }
  }
  return {};
}

async function main(argv = process.argv.slice(2)) {
  const options = parseArgs(argv);
  const now = options.now ? new Date(options.now) : new Date();
  const week = options.week || getWeekToFinalize(now);
  const original = fs.readFileSync(options.file, 'utf8');
  const seedOwners = await fetchRemoteOwners(week);
  const result = assignWeekOwners(original, week, undefined, seedOwners);

  const summary = result.newlyAssigned
    ? result.newlyAssigned.map((item) => `${item.topic}=${item.owner}`).join(', ')
    : result.reason;
  console.log(`week=${week} changed=${result.changed} reason=${result.reason}${summary && result.changed ? ` ${summary}` : ''}`);
  writeGithubOutput({
    week: String(week),
    changed: String(result.changed),
    reason: result.reason
  });

  if (result.changed && !options.dryRun) {
    fs.writeFileSync(options.file, result.html);
  }

  return result;
}

module.exports = {
  STUDY_START_DATE,
  LAST_WEEK,
  EARLY_PRESENTERS,
  FULL_PRESENTERS,
  getStudyWeek,
  getAssignmentWeek,
  getWeekToFinalize,
  deadlineForWeek,
  presentersForWeek,
  shuffle,
  parsePartItems,
  formatOl,
  assignWeekOwners,
  fillUnassignedOwners,
  main
};

if (require.main === module) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
