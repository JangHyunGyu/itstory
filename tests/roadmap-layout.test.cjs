'use strict';

// Run after npm run build. Install Playwright locally or set PLAYWRIGHT_MODULE_PATH.
const { chromium, webkit, firefox, devices } = require(process.env.PLAYWRIGHT_MODULE_PATH || 'playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const { applySelection, presentersForWeek } = require('../scripts/presenter-assign');

const root = path.resolve(__dirname, '../dist');
const output = process.env.LAYOUT_ARTIFACT_DIR;
const deviceName = process.env.LAYOUT_DEVICE;
const device = deviceName ? devices[deviceName] : null;
if (deviceName && !device) throw new Error(`Unknown Playwright device: ${deviceName}`);
const sizes = device ? [[device.viewport.width, device.viewport.height],
  [device.viewport.height, device.viewport.width]] : [240, 280, 320, 360, 375, 390, 414, 430, 480, 568, 667, 700,
  759, 760, 761, 768, 820, 900, 1024, 1120, 1200, 1279, 1280, 1281, 1366,
  1440, 1600, 1920, 2560].map(width => [width, 900])
  .concat([[568, 320], [667, 375], [844, 390], [1024, 600]]);

async function main() {
  if (output) fs.mkdirSync(output, { recursive: true });
  const server = http.createServer((request, response) => {
    const file = path.resolve(root, '.' + new URL(request.url, 'http://localhost').pathname);
    if (!file.startsWith(root + path.sep) || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
      response.writeHead(404).end();
      return;
    }
    const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.woff2': 'font/woff2' };
    response.setHeader('content-type', types[path.extname(file)] || 'application/octet-stream');
    fs.createReadStream(file).pipe(response);
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  let browser;
  try {
    const engine = process.env.LAYOUT_BROWSER || device?.defaultBrowserType || 'chromium';
    browser = await ({ chromium, webkit, firefox }[engine]).launch();
    const touch = device?.hasTouch || process.env.LAYOUT_TOUCH === '1';
    const page = await browser.newPage(device || { viewport: { width: 900, height: 900 }, hasTouch: touch });
    const activate = locator => touch ? locator.tap() : locator.click();
    const pageErrors = [];
    page.on('pageerror', error => pageErrors.push(error.message));
    await page.clock.setFixedTime(new Date('2026-10-12T03:00:00Z'));
    const assignments = {};
    let posts = 0;
    let reads = 0;
    let failNextSave = false;
    let delayNextSave = false;
    await page.route(/https:\/\/itstory-presenters\.[^/]+\/week\//, async route => {
      const week = Number(new URL(route.request().url()).pathname.split('/').pop());
      if (route.request().method() === 'GET') reads++;
      if (route.request().method() === 'POST') {
        posts++;
        if (delayNextSave) { delayNextSave = false; await new Promise(resolve => setTimeout(resolve, 300)); }
        if (failNextSave) {
          failNextSave = false;
          await route.fulfill({ status: 409, contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: JSON.stringify({ error: 'conflict' }) });
          return;
        }
        const { topic, owner, topics } = route.request().postDataJSON();
        assignments[week] = applySelection(assignments[week] || {}, topic, owner, presentersForWeek(week), topics);
      }
      await route.fulfill({ status: 200, contentType: 'application/json',
        headers: { 'access-control-allow-origin': '*', 'access-control-allow-headers': 'content-type', 'access-control-allow-methods': 'GET,POST,OPTIONS' },
        body: JSON.stringify({ assignments: assignments[week] || {} }) });
    });
    await page.route(/google-analytics|googletagmanager/, route => route.abort());
    if (process.env.LAYOUT_BASELINE_HTML) {
      await page.route('**/roadmap.html', route => route.fulfill({
        contentType: 'text/html', body: fs.readFileSync(process.env.LAYOUT_BASELINE_HTML)
      }));
    }
    await page.goto(`http://127.0.0.1:${server.address().port}/roadmap.html`);
    const selects = page.locator('.part-owner-select');
    await selects.first().waitFor();
    await page.evaluate(() => document.fonts.ready);
    const active = page.locator('tr').filter({ has: page.locator('.part-owner-select') });
    if (process.env.LAYOUT_BASELINE_HTML) {
      await active.scrollIntoViewIfNeeded();
      await page.screenshot({ path: path.join(output, 'before-900.png') });
      return;
    }
    assert.equal(await selects.count(), 5);
    assert.equal(await page.locator('select').count(), 0);
    assert.equal(await selects.first().getAttribute('role'), 'combobox');

    for (const [width, height] of sizes) {
      await page.setViewportSize({ width, height });
      const failures = await page.evaluate(() => {
        const errors = [];
        const viewport = document.documentElement.clientWidth;
        if (document.documentElement.scrollWidth > viewport + 1) errors.push('page horizontal overflow');
        for (const element of document.querySelectorAll('.parts li')) {
          if (!element.getClientRects().length) continue;
          const card = element.getBoundingClientRect();
          if (card.left < -1 || card.right > viewport + 1) errors.push('card outside viewport');
          if (element.scrollWidth > element.clientWidth + 1) errors.push('card content clipped');
          const select = element.querySelector('.part-owner-select');
          const topic = element.querySelector('.part-topic');
          if (!select) continue;
          const box = select.getBoundingClientRect();
          const text = topic.getBoundingClientRect();
          if (box.height < 24) errors.push('control target too small');
          if (box.width > 77) errors.push('control too wide');
          if (box.height > 25) errors.push('control too tall');
          if (parseFloat(getComputedStyle(select).fontSize) !== 11) errors.push('control text unexpectedly enlarged');
          if (box.left < text.right - 1 && box.right > text.left + 1 && box.top < text.bottom - 1 && box.bottom > text.top + 1) errors.push('topic and select overlap');
          if (innerWidth >= 320 && innerWidth <= 480 && box.top >= text.bottom) errors.push('wide card unnecessarily stacks control');
          if (box.left < card.left || box.right > card.right) errors.push('select outside card');
          if (topic.scrollWidth > topic.clientWidth + 1 || topic.scrollHeight > topic.clientHeight + 1) errors.push('topic clipped');
          const range = document.createRange();
          range.selectNodeContents(topic);
          for (const rect of range.getClientRects()) {
            if (rect.left < card.left || rect.right > card.right) errors.push('topic glyphs outside card');
          }
          const canvas = document.createElement('canvas').getContext('2d');
          const style = getComputedStyle(select);
          if (style.appearance !== 'none') errors.push('native arrow adds unmeasured label padding');
          canvas.font = style.font;
          const labelWidth = canvas.measureText(select.textContent).width;
          if (labelWidth > box.width - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight) - 2) errors.push('selected label clipped');
        }
        return [...new Set(errors)];
      });
      assert.deepEqual(failures, [], `${engine} ${width}x${height}: ${failures.join(', ')}`);
      await activate(selects.first());
      assert.equal(await selects.first().getAttribute('aria-expanded'), 'true', `open ${width}x${height}: ${JSON.stringify(await selects.first().boundingBox())}`);
      const popupFailures = await page.evaluate(() => {
        const menu = document.querySelector('.part-owner-popup:not([hidden])');
        const rect = menu.getBoundingClientRect();
        const viewport = visualViewport;
        const errors = [];
        if (rect.left < (viewport?.offsetLeft || 0) || rect.top < (viewport?.offsetTop || 0) || rect.right > (viewport?.offsetLeft || 0) + (viewport?.width || innerWidth) + 1 || rect.bottom > (viewport?.offsetTop || 0) + (viewport?.height || innerHeight) + 1) errors.push('popup outside viewport');
        const target = document.elementFromPoint(rect.left + 15, rect.top + 15);
        if (!menu.contains(target)) errors.push('popup covered or clipped');
        if (!menu.querySelector('[aria-selected="true"]')) errors.push('selected option missing');
        return errors;
      });
      assert.deepEqual(popupFailures, [], `${engine} popup ${width}x${height}`);
      if (output && (device || ([390, 768, 900, 1440].includes(width) && height === 900))) {
        await page.screenshot({ path: path.join(output, `${deviceName || engine}${touch ? '-touch' : ''}-${width}.png`), scale: 'css' });
      }
      await page.keyboard.press('Escape');
      assert.equal(await selects.first().getAttribute('aria-expanded'), 'false');
    }

    await page.setViewportSize({ width: 390, height: 480 });
    await selects.first().evaluate(node => window.scrollTo({ top: node.getBoundingClientRect().top + scrollY - innerHeight + 40, behavior: 'instant' }));
    await activate(selects.first());
    assert.equal(await page.getByRole('listbox').getAttribute('data-placement'), 'above');
    await page.keyboard.press('Escape');
    await page.setViewportSize({ width: 390, height: 844 });
    const first = selects.first();
    await activate(first);
    const owner = await page.getByRole('option').nth(1).getAttribute('data-value');
    delayNextSave = true;
    await activate(page.getByRole('option').nth(1));
    assert.equal(await first.getAttribute('aria-busy'), 'true');
    assert.equal(await selects.nth(1).getAttribute('aria-disabled'), 'true');
    await page.waitForFunction(() => document.querySelector('.part-owner-select').value !== '');
    await page.waitForTimeout(100);
    assert.equal(posts, 1);
    await activate(first);
    await activate(page.getByRole('option').first());
    await page.waitForTimeout(100);
    assert.equal(posts, 2);
    await first.focus();
    await first.press('Tab');
    await page.keyboard.press('Shift+Tab');
    await first.press('ArrowDown');
    await first.press('End');
    const focusedOption = await first.getAttribute('aria-activedescendant');
    await page.evaluate(() => { window.testSelect = document.querySelector('.part-owner-select'); });
    const readsBeforePoll = reads;
    await page.clock.setFixedTime(new Date('2026-10-12T03:00:32Z'));
    await page.waitForTimeout(4300);
    assert.equal(reads, readsBeforePoll + 1);
    assert.equal(await first.evaluate(node => node.value), '');
    assert.equal(await first.getAttribute('aria-activedescendant'), focusedOption);
    assert.equal(await first.getAttribute('aria-expanded'), 'true');
    assert.equal(await page.evaluate(() => document.activeElement === window.testSelect && window.testSelect === document.querySelector('.part-owner-select')), true);
    assert.equal(await first.evaluate(node => getComputedStyle(node).outlineStyle), 'solid');
    await first.press('Escape');
    assert.equal(posts, 2);
    await first.press('Enter');
    await first.press('Home');
    await first.press('ArrowDown');
    await first.press('Enter');
    await page.waitForFunction(expected => document.querySelector('.part-owner-select').value === expected, owner);
    assert.equal(posts, 3);
    await activate(first);
    await first.press('Home');
    await first.press('Tab');
    await page.waitForFunction(() => document.querySelector('.part-owner-select').value === '');
    assert.equal(posts, 4);
    assert.notEqual(await page.evaluate(() => document.activeElement === window.testSelect), true);

    failNextSave = true;
    await activate(first);
    await activate(page.getByRole('option').nth(1));
    await page.locator('.part-owner-feedback:not([hidden])').waitFor();
    assert.equal(await first.evaluate(node => node.value), '');
    await activate(first);
    await activate(page.getByRole('option').nth(1));
    await page.waitForFunction(expected => document.querySelector('.part-owner-select').value === expected, owner);
    assert.equal(await page.locator('.part-owner-feedback:not([hidden])').count(), 0);
    assert.equal(posts, 6);

    // Keep both triggers visible beside the popup when switching directly.
    await page.setViewportSize({ width: 900, height: 900 });
    await activate(first);
    await activate(selects.nth(1));
    assert.equal(await page.getByRole('listbox').count(), 1, `${deviceName || engine} switch: ${await selects.nth(1).getAttribute('aria-expanded')}, focus ${await page.evaluate(() => document.activeElement?.outerHTML)}`);
    assert.equal(await first.getAttribute('aria-expanded'), 'false');
    await page.locator('#roadmap-search').click();
    assert.equal(await page.getByRole('listbox').count(), 0);

    await page.locator('#roadmap-search').fill('JavaScript');
    assert.ok(await page.locator('tbody tr:visible').count() < await page.locator('tbody tr').count());
    await page.locator('#roadmap-search').fill('');
    await page.locator('.phase-filter[data-phase="foundation"]').click();
    assert.equal(await selects.first().isVisible(), false);
    await page.locator('.phase-filter[data-phase="all"]').click();
    assert.equal(await selects.first().isVisible(), true);
    const week11 = page.locator('tbody tr').nth(10);
    await week11.locator('.question-toggle').click();
    assert.equal(await week11.locator('.question-list').isVisible(), true);
    await week11.locator('.question-toggle').click();
    assert.equal(await week11.locator('.question-list').isVisible(), false);
    // Crossing the deadline must restore the read-only card and remove its edit class.
    await page.clock.setFixedTime(new Date('2026-10-14T12:00:00Z'));
    await page.waitForTimeout(4300);
    assert.equal(await week11.locator('.parts li.is-editable').count(), 0);
    assert.equal(await week11.locator('[role="combobox"]').count(), 0);
    assert.equal(await page.locator('tbody tr').nth(11).locator('[role="combobox"]').count(), 5);
    assert.equal(await page.locator('.part-owner-popup').count(), 5);
    assert.deepEqual(pageErrors, []);
    console.log(`${deviceName || engine}${touch ? ' touch' : ''}: ${sizes.length} viewports passed; selection, unassignment, polling focus, search, filters, questions, and deadline passed.`);
  } finally {
    if (browser) await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
