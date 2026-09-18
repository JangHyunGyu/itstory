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
  const DEADLINE_HOUR = 18;

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
    const start = Date.parse(`${startYmd}T${String(DEADLINE_HOUR).padStart(2, '0')}:00:00+09:00`);
    return new Date(start + (week - 1) * 7 * 86400000);
  }

  function getAssignmentWeek(now = new Date(), startYmd = STUDY_START_DATE) {
    const week = getStudyWeek(now, startYmd);
    if (week < 1 || week > LAST_WEEK) return 0;
    if (now.getTime() >= deadlineForWeek(week, startYmd).getTime()) {
      const next = week + 1;
      return next > LAST_WEEK ? 0 : next;
    }
    return week;
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
    getStudyWeek,
    getAssignmentWeek,
    deadlineForWeek,
    formatCountdown
  };
});
