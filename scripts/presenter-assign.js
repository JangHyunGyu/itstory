'use strict';

const EARLY_PRESENTERS = ['장현규', '김유진', '김수민', '변진수'];
const FULL_PRESENTERS = EARLY_PRESENTERS.concat(['김태훈']);

function presentersForWeek(week) {
  return week <= 3 ? EARLY_PRESENTERS.slice() : FULL_PRESENTERS.slice();
}

function applySelection(assignments, topic, owner, presenters, topics) {
  if (!topics.includes(topic)) {
    const error = new Error('unknown-topic');
    error.code = 'unknown-topic';
    throw error;
  }
  if (owner && !presenters.includes(owner)) {
    const error = new Error('unknown-person');
    error.code = 'unknown-person';
    throw error;
  }

  const next = {};
  topics.forEach((name) => {
    next[name] = assignments[name] || '';
  });

  if (!owner) {
    next[topic] = '';
  } else {
    topics.forEach((name) => {
      if (next[name] === owner) next[name] = '';
    });
    next[topic] = owner;
  }

  const empty = topics.filter((name) => !next[name]);
  const used = new Set(topics.map((name) => next[name]).filter(Boolean));
  const unused = presenters.filter((name) => !used.has(name));
  if (empty.length === 1 && unused.length === 1) {
    next[empty[0]] = unused[0];
  }
  return next;
}

module.exports = {
  EARLY_PRESENTERS,
  FULL_PRESENTERS,
  presentersForWeek,
  applySelection
};
