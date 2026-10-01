// Playwright smoke checks driven by the locally installed Microsoft Edge.
// Chromium download is blocked in this environment, so we use channel: 'msedge'.
// Self-contained: serves ./build itself, so there is no dependency on `serve`
// or on a dev server already running.
// Usage:  npm run verify
import { chromium } from '@playwright/test';
import { mkdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { join, extname, normalize } from 'node:path';
import { createServer } from 'node:http';

const ROOT = join(process.cwd(), 'build');
const PORT = Number(process.env.PORT || 4319);
const BASE = `http://localhost:${PORT}`;
const SHOTS = join(process.cwd(), 'screenshots', 'verify');
mkdirSync(SHOTS, { recursive: true });

// ── minimal SPA static server ───────────────────────────────────────────────
const MIME = {
  '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp',
  '.mp4': 'video/mp4', '.woff2': 'font/woff2', '.ico': 'image/x-icon',
};

const server = createServer((req, res) => {
  const url = decodeURIComponent((req.url || '/').split('?')[0]);
  // normalize() collapses ../ so a request can't escape the build dir
  let file = join(ROOT, normalize(url).replace(/^(\.\.[/\\])+/, ''));
  if (!existsSync(file) || statSync(file).isDirectory()) file = join(ROOT, 'index.html');
  try {
    const body = readFileSync(file);
    res.writeHead(200, { 'Content-Type': MIME[extname(file)] || 'application/octet-stream' });
    res.end(body);
  } catch {
    res.writeHead(404).end('not found');
  }
});
await new Promise((r) => server.listen(PORT, r));

const results = [];
const ok = (n, d = '') => results.push(['PASS', n, d]);
const bad = (n, d = '') => results.push(['FAIL', n, d]);

const browser = await chromium.launch({ channel: 'msedge' });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();

const consoleErrors = [];
page.on('console', (m) => m.type() === 'error' && consoleErrors.push(m.text()));
page.on('pageerror', (e) => consoleErrors.push('PAGEERROR: ' + e.message));

// Splash screen is skipped after first visit; clear it so runs are repeatable.
async function goto(path) {
  await page.goto(`${BASE}${path}`, { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => sessionStorage.setItem('1m_splash_seen', '1'));
  await page.waitForTimeout(3500); // splash hold (1.5s) + exit (0.8s)
}

try {
  // ---- 1. Home renders, hero + footer present -------------------------
  await goto('/');
  const homeOk = await page.locator('h1').first().isVisible();
  homeOk ? ok('home renders') : bad('home renders');

  // ---- 2. Route transitions actually animate --------------------------
  // The route <main> is keyed by pathname and carries routeVariants. Sample
  // opacity mid-navigation: if AnimatePresence is inert again, opacity stays 1.
  await page.click('a[href="/cars"]').catch(() => {});
  const samples = [];
  for (let i = 0; i < 6; i++) {
    samples.push(
      await page
        .locator('main#main-content')
        .evaluate((el) => Number(getComputedStyle(el).opacity))
        .catch(() => null)
    );
    await page.waitForTimeout(60);
  }
  const dipped = samples.some((o) => o !== null && o < 0.99);
  await page.waitForTimeout(900);
  const settled = await page
    .locator('main#main-content')
    .evaluate((el) => Number(getComputedStyle(el).opacity))
    .catch(() => null);
  dipped && settled > 0.98
    ? ok('route transition animates', `opacity ${samples.join(' ')} -> ${settled}`)
    : bad('route transition animates', `opacity ${samples.join(' ')} -> ${settled}`);

  // ---- 3. Footer exists on multiple routes (was Home-only) -----------
  for (const [name, path] of [['cars', '/cars'], ['compare', '/compare'], ['contact', '/contact']]) {
    await goto(path);
    const hasFooter = await page.locator('footer[aria-label="Site footer"]').isVisible().catch(() => false);
    const links = await page.locator('footer[aria-label="Site footer"] nav a').count().catch(() => 0);
    hasFooter && links > 0
      ? ok(`footer on /${name}`, `${links} nav links`)
      : bad(`footer on /${name}`, `visible=${hasFooter} links=${links}`);
  }

  // ---- 4. Car detail page --------------------------------------------
  // Cards navigate imperatively (onClick -> navigate('/car/:id')), so there is
  // no <a href="/car/..."> to select. Click the first card in the grid instead.
  await goto('/cars');
  const card = page.locator('[role="button"][aria-label^="View details for"]').first();
  if (await card.count()) {
    await card.click();
    await page.waitForTimeout(2600);
    const url = page.url();
    const h1 = await page.locator('main h1').first().textContent().catch(() => null);
    url.includes('/car/') && h1 && h1.trim().length > 0
      ? ok('car detail loads', `${h1.trim().slice(0, 40)} (${url.replace(BASE, '')})`)
      : bad('car detail loads', `url=${url} h1=${h1}`);
  } else bad('car detail loads', 'no car card found on /cars');

  // ---- 4b. Car cards are keyboard reachable --------------------------
  await goto('/cars');
  const kbdCard = page.locator('[role="button"][aria-label^="View details for"]').first();
  await kbdCard.focus();
  await page.keyboard.press('Enter');
  await page.waitForTimeout(2400);
  page.url().includes('/car/')
    ? ok('card keyboard-activates (Enter)')
    : bad('card keyboard-activates (Enter)', page.url());

  // ---- 5. Filtering narrows the grid ----------------------------------
  await goto('/cars');
  const before = await page.locator('main img').count();
  const makeSel = page.locator('select').first();
  if (await makeSel.count()) {
    const opts = await makeSel.locator('option').allTextContents();
    const target = opts.find((o) => o.trim() && !/all|any/i.test(o));
    if (target) {
      await makeSel.selectOption({ label: target.trim() });
      await page.waitForTimeout(900);
      const after = await page.locator('main img').count();
      after < before && after > 0
        ? ok('filter narrows results', `${before} -> ${after} (${target.trim()})`)
        : bad('filter narrows results', `${before} -> ${after} for "${target.trim()}"`);
    } else bad('filter narrows results', 'no non-default option');
  } else bad('filter narrows results', 'no <select> on /cars');

  // ---- 6. No fixed-chrome overlap: first h1 clears the navbar ----------
  await goto('/');
  const overlap = await page.evaluate(() => {
    const nav = document.querySelector('nav, header');
    const h1 = document.querySelector('main h1');
    if (!nav || !h1) return null;
    const a = nav.getBoundingClientRect();
    const b = h1.getBoundingClientRect();
    return Math.round(b.top - a.bottom);
  });
  overlap !== null && overlap >= 0
    ? ok('no navbar overlap', `${overlap}px clearance`)
    : bad('no navbar overlap', `${overlap}px`);

  // ---- 6. Reduced motion: transitions collapse, no crash -------------
  const rmCtx = await browser.newContext({ reducedMotion: 'reduce' });
  const rm = await rmCtx.newPage();
  await rm.goto(`${BASE}/`, { waitUntil: 'domcontentloaded' });
  await rm.evaluate(() => sessionStorage.setItem('1m_splash_seen', '1'));
  await rm.waitForTimeout(3200);
  const rmOpacity = await rm
    .locator('main#main-content')
    .evaluate((el) => Number(getComputedStyle(el).opacity))
    .catch(() => null);
  rmOpacity > 0.95 ? ok('reduced-motion resolves opaque', String(rmOpacity)) : bad('reduced-motion resolves opaque', String(rmOpacity));
  await rmCtx.close();

  // ---- 7. Mobile viewport --------------------------------------------
  const mCtx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const m = await mCtx.newPage();
  await m.goto(`${BASE}/`, { waitUntil: 'domcontentloaded' });
  await m.evaluate(() => sessionStorage.setItem('1m_splash_seen', '1'));
  await m.waitForTimeout(3200);
  const noHScroll = await m.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1);
  noHScroll ? ok('mobile: no horizontal scroll') : bad('mobile: no horizontal scroll');
  await m.screenshot({ path: join(SHOTS, 'mobile-home.png'), fullPage: false });
  await mCtx.close();

  // ---- screenshots ----------------------------------------------------
  await page.goto(`${BASE}/`, { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => sessionStorage.setItem('1m_splash_seen', '1'));
  await page.waitForTimeout(3500);
  await page.screenshot({ path: join(SHOTS, 'desktop-home.png') });
  await page.goto(`${BASE}/cars`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);
  await page.screenshot({ path: join(SHOTS, 'desktop-cars.png') });
} catch (e) {
  bad('harness', e.message);
} finally {
  await browser.close();
  server.close();
}

console.log('\n──────── VERIFY ────────');
for (const [s, n, d] of results) console.log(`${s === 'PASS' ? 'PASS' : 'XX  '}  ${n}${d ? '  — ' + d : ''}`);
const failed = results.filter((r) => r[0] === 'FAIL').length;
console.log(`────────────────────────`);
console.log(`${results.length - failed}/${results.length} passed`);
if (consoleErrors.length) {
  console.log(`\nconsole errors (${consoleErrors.length}):`);
  [...new Set(consoleErrors)].slice(0, 10).forEach((e) => console.log('  ' + e.slice(0, 180)));
}
process.exit(failed ? 1 : 0);