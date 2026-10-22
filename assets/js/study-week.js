'use strict';

(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) {
    module.exports = api;
  } else {
    root.ITStoryStudyWeek = api;
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  const STUDY_START_DATE = '2026-08-07';
  const LAST_WEEK = 21;
  const DEADLINE_HOUR = 20;
  const DEADLINE_WEEKDAY_OFFSET = -2;
  const EARLY_PRESENTERS = ['장현규', '김유진', '김수민', '변진수'];
  const FULL_PRESENTERS = EARLY_PRESENTERS.concat(['김태훈']);

  function seoulYmd(date) {
    return new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Seoul',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(date);
  }

  function utcMidnight(ymd) {
    const [year, month, day] = ymd.split('-').map(Number);
    return Date.UTC(year, month - 1, day);
  }

  function getStudyWeek(now = new Date(), startYmd = STUDY_START_DATE) {
    const diffDays = Math.floor((utcMidnight(seoulYmd(now)) - utcMidnight(startYmd)) / 86400000);
    if (diffDays < 0) return 0;
    return Math.floor(diffDays / 7) + 1;
  }

  function deadlineForWeek(week, startYmd = STUDY_START_DATE) {
    const friday = Date.parse(`${startYmd}T00:00:00+09:00`) + (week - 1) * 7 * 86400000;
    const wednesday = friday + DEADLINE_WEEKDAY_OFFSET * 86400000;
    return new Date(wednesday + DEADLINE_HOUR * 3600000);
  }

  function getAssignmentWeek(now = new Date(), startYmd = STUDY_START_DATE) {
    for (let week = 1; week <= LAST_WEEK; week += 1) {
      if (now.getTime() < deadlineForWeek(week, startYmd).getTime()) return week;
    }
    return 0;
  }

  function getWeekToFinalize(now = new Date(), startYmd = STUDY_START_DATE) {
    let closed = 0;
    for (let week = 1; week <= LAST_WEEK; week += 1) {
      if (now.getTime() >= deadlineForWeek(week, startYmd).getTime()) closed = week;
      else break;
    }
    return closed;
  }

  function isSelectionOpen(now = new Date(), week = getAssignmentWeek(now), startYmd = STUDY_START_DATE) {
    return Boolean(week) && week === getAssignmentWeek(now, startYmd) && now.getTime() < deadlineForWeek(week, startYmd).getTime();
  }

  function presentersForWeek(week) {
    return week <= 3 ? EARLY_PRESENTERS.slice() : FULL_PRESENTERS.slice();
  }

  function pad(value) {
    return String(value).padStart(2, '0');
  }

  function formatCountdown(ms) {
    const remain = Math.max(0, Math.floor(ms / 1000));
    const days = Math.floor(remain / 86400);
    const hours = Math.floor((remain % 86400) / 3600);
    const minutes = Math.floor((remain % 3600) / 60);
    const seconds = remain % 60;
    const clock = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    return days > 0 ? `${days}일 ${clock}` : clock;
  }

  return {
    STUDY_START_DATE,
    LAST_WEEK,
    DEADLINE_HOUR,
    EARLY_PRESENTERS,
    FULL_PRESENTERS,
    getStudyWeek,
    getAssignmentWeek,
    getWeekToFinalize,
    isSelectionOpen,
    deadlineForWeek,
    presentersForWeek,
    formatCountdown
  };
});
