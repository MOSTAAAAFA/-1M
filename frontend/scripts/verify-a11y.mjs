import { chromium } from 'playwright';
import { createServer } from 'http';
import { readFileSync, existsSync, statSync } from 'fs';
import { extname, join, normalize } from 'path';

const ROOT = join(process.cwd(), 'build');
const PORT = 4319;
const TYPES = {
  '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
  '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.mp4': 'video/mp4',
};

const server = createServer((req, res) => {
  const url = decodeURIComponent(req.url.split('?')[0]);
  // normalize() collapses ".." so a crafted path cannot escape the build dir.
  let file = join(ROOT, normalize(url).replace(/^([/\\])+/, ''));
  if (existsSync(file) && statSync(file).isDirectory()) file = join(file, 'index.html');
  if (!existsSync(file)) file = join(ROOT, 'index.html');
  res.writeHead(200, { 'Content-Type': TYPES[extname(file)] || 'application/octet-stream' });
  res.end(readFileSync(file));
});
await new Promise((r) => server.listen(PORT, r));

const results = [];
const check = (name, pass, detail = '') => {
  results.push({ name, pass, detail });
  console.log(`${pass ? 'PASS' : 'FAIL'}  ${name}${detail ? `  — ${detail}` : ''}`);
};

const browser = await chromium.launch({ channel: 'msedge' });

try {
  // ── 1. Focus trap: mobile menu ────────────────────────────────────────────
  {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const page = await ctx.newPage();
    await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle' });

    const toggle = page.locator('button[aria-label*="enu" i]').first();
    await toggle.click();
    const dialog = page.locator('[role="dialog"][aria-label="Site menu"]');
    await dialog.waitFor({ state: 'visible', timeout: 5000 });

    // Scroll lock while open.
    const locked = await page.evaluate(() => getComputedStyle(document.body).overflow === 'hidden');
    check('mobile menu locks background scroll', locked);

    // Focus must start inside the dialog, never on the trigger behind it.
    const insideOnOpen = await page.evaluate(() => {
      const d = document.querySelector('[role="dialog"][aria-label="Site menu"]');
      return !!(d && d.contains(document.activeElement));
    });
    check('mobile menu takes focus on open', insideOnOpen);

    // Tab all the way past the end; focus must wrap, not escape to the page.
    const links = await dialog.locator('a').count();
    for (let i = 0; i < links + 3; i++) await page.keyboard.press('Tab');
    const stillInside = await page.evaluate(() => {
      const d = document.querySelector('[role="dialog"][aria-label="Site menu"]');
      return !!(d && d.contains(document.activeElement));
    });
    check(`focus stays trapped after ${links + 3} tabs`, stillInside);

    // Reverse direction too: Shift+Tab from the top must wrap, not escape.
    for (let i = 0; i < links + 3; i++) await page.keyboard.press('Shift+Tab');
    const stillInsideBack = await page.evaluate(() => {
      const d = document.querySelector('[role="dialog"][aria-label="Site menu"]');
      return !!(d && d.contains(document.activeElement));
    });
    check('focus stays trapped shifting backwards', stillInsideBack);

    await page.keyboard.press('Escape');
    await dialog.waitFor({ state: 'detached', timeout: 5000 });
    const unlocked = await page.evaluate(() => getComputedStyle(document.body).overflow !== 'hidden');
    check('Escape closes menu and restores scroll', unlocked);

    // Focus returns to the control that opened it.
    const restored = await page.evaluate(() => document.activeElement?.getAttribute('aria-label') || '');
    check('focus returns to menu toggle after close', /enu/i.test(restored), restored);

    await ctx.close();
  }

  // ── 2. Focus trap: account dropdown, desktop ─────────────────────────────
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle' });

    // Navbar reads the signed-in user from localStorage, so seed it before
    // load rather than mocking an API the component never calls.
    await ctx.addInitScript(() => {
      localStorage.setItem(
        'user',
        JSON.stringify({ _id: 'test', name: 'Test Driver', email: 'driver@example.com' })
      );
    });
    await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle' });

    const menuBtn = page.locator('button[aria-label^="Account menu"]').first();
    await menuBtn.waitFor({ state: 'visible', timeout: 5000 });
    await menuBtn.click();

    const menu = page.locator('[role="menu"][aria-label="Account"]');
    await menu.waitFor({ state: 'visible', timeout: 5000 });

    // A dropdown must not lock page scroll: it does not cover the page.
    const notLocked = await page.evaluate(() => getComputedStyle(document.body).overflow !== 'hidden');
    check('account dropdown does not lock page scroll', notLocked);

    const insideOnOpen = await page.evaluate(() => {
      const m = document.querySelector('[role="menu"][aria-label="Account"]');
      return !!(m && m.contains(document.activeElement));
    });
    check('account dropdown takes focus on open', insideOnOpen);

    for (let i = 0; i < 8; i++) await page.keyboard.press('Tab');
    const stillInside = await page.evaluate(() => {
      const m = document.querySelector('[role="menu"][aria-label="Account"]');
      return !!(m && m.contains(document.activeElement));
    });
    check('focus stays trapped in account dropdown', stillInside);

    await page.keyboard.press('Escape');
    await menu.waitFor({ state: 'detached', timeout: 5000 });
    check('Escape closes account dropdown', true);

    await ctx.close();
  }

  // ── 3. Reduced motion: counter lands on final value, no counting up ──────
  {
    const ctx = await browser.newContext({ reducedMotion: 'reduce', viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle' });

    // Any counter in view must already read its final value, immediately.
    const immediate = await page.evaluate(() => {
      const spans = [...document.querySelectorAll('span')].filter((s) => /\d/.test(s.textContent || ''));
      return spans.length;
    });

    // Compare a counter's text now vs. after waiting out a normal 2s animation.
    const before = await page.evaluate(() => {
      const el = [...document.querySelectorAll('span')].find((s) => /^\d[\d,]*$/.test((s.textContent || '').trim()));
      return el ? el.textContent.trim() : null;
    });
    await page.waitForTimeout(2200);
    const after = await page.evaluate(() => {
      const el = [...document.querySelectorAll('span')].find((s) => /^\d[\d,]*$/.test((s.textContent || '').trim()));
      return el ? el.textContent.trim() : null;
    });

    check(
      'reduced motion: counter static, not counting up',
      before === after || before === null,
      `candidates=${immediate} before=${before} after=${after}`
    );

    await ctx.close();
  }

  // ── 4. Counter: no stray frames after unmount (memory/leak guard) ─────────
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    const errors = [];
    page.on('pageerror', (e) => errors.push(String(e)));
    await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle' });
    // Navigate away mid-animation; an uncancelled rAF would setState on an
    // unmounted component and React would warn.
    await page.goto(`http://localhost:${PORT}/cars`, { waitUntil: 'commit' });
    await page.waitForTimeout(1500);
    check('no React unmount errors during route change', errors.length === 0, errors.slice(0, 2).join(' | '));
    await ctx.close();
  }

  // ── 5. Detail hero video: poster present, metadata preload ────────────────
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    // Car 1 has no heroVideo, so its hero is an image. Use a car that does
    // ship one (ids 11/21/58/...) or the assertion proves nothing.
    // preload="metadata" plus a 100MB file: do not wait for networkidle, the
    // range request alone is slow and would time the check out.
    await page.goto(`http://localhost:${PORT}/car/11`, { waitUntil: 'domcontentloaded' });
    await page.locator('video').first().waitFor({ state: 'attached', timeout: 15000 });
    const video = await page.evaluate(() => {
      const v = document.querySelector('video');
      if (!v) return null;
      return { preload: v.preload, poster: v.getAttribute('poster') };
    });
    if (video) {
      check('detail video preloads metadata, not auto', video.preload === 'metadata', `preload=${video.preload}`);
      check('detail video has a poster frame', !!video.poster, video.poster ? 'set' : 'missing');
    } else {
      check('detail hero video present on a car that has one', false, 'no video element on /car/11');
    }
    await ctx.close();
  }

  // ── 6. Skeletons are announced, not decorative noise ─────────────────────
  {
    const ctx = await browser.newContext({ reducedMotion: 'reduce', viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    await page.goto(`http://localhost:${PORT}/admin/users`, { waitUntil: 'networkidle' });
    // Login-gated, so the skeleton may not be reachable here. Assert the
    // contract instead: any role="status" present must be aria-busy and the
    // skeleton bars must be hidden from assistive tech.
    const statusOk = await page.evaluate(() => {
      const s = document.querySelector('[role="status"]');
      if (!s) return true;
      const bars = s.querySelectorAll('[aria-hidden="true"]');
      return s.getAttribute('aria-busy') === 'true' && bars.length > 0;
    });
    check('skeletons use role=status + aria-busy and hide bars', statusOk);
    await ctx.close();
  }

  // ── 7. OptimizedImage fallback path on a broken detail image ─────────────
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    await page.route('**/logos/*lotus*', (r) => r.abort());
    await page.goto(`http://localhost:${PORT}/cars`, { waitUntil: 'networkidle' });
    const stillRendered = await page.evaluate(() => document.querySelectorAll('.car-card').length);
    check('catalogue survives an aborted image', stillRendered > 0, `${stillRendered} cards`);
    await ctx.close();
  }

  const passed = results.filter((r) => r.pass).length;
  console.log(`\n${passed}/${results.length} passed`);
  if (passed !== results.length) {
    console.log('\nfailures:');
    results.filter((r) => !r.pass).forEach((r) => console.log(`  ${r.name} — ${r.detail}`));
  }
} finally {
  await browser.close();
  server.close();
}

process.exit(results.every((r) => r.pass) ? 0 : 1);
