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

// Failed subresource requests, with the offending URL. Console messages alone
// don't say *which* hotlinked asset 404s, so record the network truth too.
const netFailures = [];
const isMedia = (url, type) => /^(image|video|font)\//.test(type) || /\.(jpe?g|png|webp|avif|gif|svg|mp4|webm|woff2?)(\?|$)/i.test(url);
// ERR_BLOCKED_BY_ORB: Opaque Response Blocking. The server answered, but with a
// content-type the browser refuses to paint as an image (usually an HTML error
// page). Node fetch sees "200 OK" here, so this only shows up in a real browser.
const BROWSER_BLOCKS = /ERR_BLOCKED_BY_ORB|ERR_BLOCKED_BY_RESPONSE|ERR_BLOCKED_BY_CLIENT/;
page.on('response', (r) => {
  if (r.status() >= 400 && isMedia(r.url(), r.headers()['content-type'] || '')) {
    netFailures.push({ status: r.status(), url: r.url(), via: 'response' });
  }
});
page.on('requestfailed', (r) => {
  const u = r.url();
  const err = (r.failure()?.errorText || 'failed').slice(0, 40);
  if (isMedia(u, r.resourceType()) || BROWSER_BLOCKS.test(err)) netFailures.push({ status: err, url: u, via: 'requestfailed' });
});

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
  const cards = await page.locator('.car-card').count();
  const card = page.locator('.car-card-link').first();
  if (await card.count()) {
    await card.click();
    await page.waitForTimeout(2600);
    const url = page.url();
    const h1 = await page.locator('main h1').first().textContent().catch(() => null);
    url.includes('/car/') && h1 && h1.trim().length > 0
      ? ok('car detail loads', `${h1.trim().slice(0, 40)} (${url.replace(BASE, '')}, ${cards} cards)`)
      : bad('car detail loads', `url=${url} h1=${h1}`);
  } else bad('car detail loads', 'no .car-card-link on /cars');

  // ---- 4b. Cards are real, keyboard-reachable links -------------------
  // The card is NOT role="button": the title renders a real <a> stretched over
  // the card, so it must be focusable and Enter-activated natively.
  await goto('/cars');
  const link = page.locator('.car-card-link').first();
  const href = await link.getAttribute('href').catch(() => null);
  await link.focus();
  const focused = await page.evaluate(() => document.activeElement?.className?.includes('car-card-link'));
  await page.keyboard.press('Enter');
  await page.waitForTimeout(2400);
  href && href.startsWith('/car/') && focused && page.url().includes('/car/')
    ? ok('card is a focusable link', `href=${href} Enter -> ${page.url().replace(BASE, '')}`)
    : bad('card is a focusable link', `href=${href} focused=${focused} url=${page.url()}`);

  // ---- 4b. The whole card surface is the hit area --------------------
  // The title link's ::after is meant to stretch over the entire card. It
  // silently shrank to title-size (272x30) once a positioned ancestor
  // (the body) became its containing block, which left the photo dead to
  // clicks while every other assertion still passed.
  await goto('/cars');
  // elementFromPoint only resolves inside the viewport, and the grid starts
  // below the fold, so scroll the first card in before sampling.
  await page.locator('.car-card').first().scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  const hit = await page.locator('.car-card').first().evaluate((el) => {
    const card = el.getBoundingClientRect();
    const after = getComputedStyle(el.querySelector('.car-card-link'), '::after');
    const w = parseFloat(after.width);
    const h = parseFloat(after.height);
    // Sample the real topmost element at three points that a user would aim at.
    const at = (fx, fy) => {
      const hit = document.elementFromPoint(card.x + card.width * fx, card.y + card.height * fy);
      return hit ? hit.classList.contains('car-card-link') : false;
    };
    return {
      covers: w >= card.width - 2 && h >= card.height - 2,
      got: `overlay ${Math.round(w)}x${Math.round(h)} vs card ${Math.round(card.width)}x${Math.round(card.height)}`,
      image: at(0.5, 0.25),
      top: at(0.5, 0.03),
      body: at(0.92, 0.6),
    };
  });
  hit.covers && hit.image && hit.top && hit.body
    ? ok('whole card is clickable', `${hit.got}; image/top/body all hit the link`)
    : bad('whole card is clickable', `${hit.got}; image=${hit.image} top=${hit.top} body=${hit.body}`);

  // And prove it end to end: a real click on the photo must navigate.
  await page.locator('.car-card').first().scrollIntoViewIfNeeded();
  const box = await page.locator('.car-card').first().boundingBox();
  await page.mouse.click(box.x + box.width / 2, box.y + box.height * 0.25);
  await page.waitForTimeout(1200);
  page.url().includes('/car/')
    ? ok('clicking the photo opens the car', page.url().replace(BASE, ''))
    : bad('clicking the photo opens the car', `url=${page.url()}`);

  // ---- 4b2. View Details: dropped on /cars, kept elsewhere --------------
  // The collection grid hides the redundant link, so the count must be zero
  // there while the rest of the site still renders it.
  await goto('/cars');
  const totalCards = await page.locator('.car-card').count();
  const detailsOnCars = await page.locator('.car-card-details').count();
  totalCards > 0 && detailsOnCars === 0
    ? ok('/cars hides the redundant View Details', `0/${totalCards}`)
    : bad('/cars hides the redundant View Details', `${detailsOnCars}/${totalCards}`);

  // Checked on the home rail, not /favorites: favorites only renders cards for
  // a signed-in user with saved cars, so it is empty in a clean test profile
  // and would assert nothing.
  await goto('/');
  // Scoped to <article class="car-card">: the home rail also renders the
  // compact MiniCard, which reuses .car-card for its surface but has no
  // details control by design. Counting .car-card alone mixes the two.
  const homeCards = await page.locator('article.car-card').count();
  const detailsOnHome = await page.locator('article.car-card .car-card-details').count();
  const firstHref = await page.locator('article.car-card .car-card-details').first().getAttribute('href').catch(() => null);
  homeCards > 0 && detailsOnHome === homeCards && /^\/car\/\d+$/.test(firstHref || '')
    ? ok('every card has View Details outside /cars', `${detailsOnHome}/${homeCards}, first=${firstHref}`)
    : bad('every card has View Details outside /cars', `${detailsOnHome}/${homeCards}, first=${firstHref}`);

  // The details link must be operable, not swallowed by the stretched link.
  await page.locator('.car-card').first().scrollIntoViewIfNeeded();
  await page.locator('.car-card-details').first().click();
  await page.waitForTimeout(1200);
  page.url().includes('/car/')
    ? ok('View Details navigates', page.url().replace(BASE, ''))
    : bad('View Details navigates', `url=${page.url()}`);

  // ---- 4c. Nested controls sit above the stretched link ---------------
  // A stretched ::after overlay must not swallow the favorite / garage clicks.
  await goto('/cars');
  const fav = page.locator('.car-card-fav').first();
  const favBefore = await fav.getAttribute('aria-pressed');
  await fav.click();
  await page.waitForTimeout(400);
  const favAfter = await fav.getAttribute('aria-pressed');
  await page.waitForTimeout(400);
  const stillOnCars = page.url().endsWith('/cars');
  favBefore !== favAfter && stillOnCars
    ? ok('card favorite toggles without navigating', `aria-pressed ${favBefore} -> ${favAfter}`)
    : bad('card favorite toggles without navigating', `${favBefore} -> ${favAfter}, url=${page.url()}`);

  // ---- 4d. Every rendered card image actually decodes ----------------
  // A URL can 200 and still be unusable (wrong content-type, HTML error page,
  // or a stray control character). naturalWidth > 0 proves real pixels.
  await goto('/cars');
  await page.waitForTimeout(2500);
  await page.evaluate(() =>
    Promise.all(
      [...document.querySelectorAll('.car-card img')].map((img) =>
        img.complete
          ? null
          : new Promise((r) => {
              img.addEventListener('load', r, { once: true });
              img.addEventListener('error', r, { once: true });
            })
      )
    )
  );
  const imgReport = await page.evaluate(() => {
    const imgs = [...document.querySelectorAll('.car-card img')];
    const broken = imgs
      .filter((i) => !i.complete || i.naturalWidth === 0)
      .map((i) => i.currentSrc || i.src || i.getAttribute('data-src') || '(no src)');
    return { total: imgs.length, broken };
  });
  imgReport.broken.length === 0 && imgReport.total > 0
    ? ok('all card images decode', `${imgReport.total} images`)
    : bad(
        'all card images decode',
        `${imgReport.broken.length}/${imgReport.total} broken: ${[...new Set(imgReport.broken)].slice(0, 3).join(' | ').slice(0, 220)}`
      );

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

  // ---- 6b. Cinematic lighting: spotlight tracks, glass applied, gold halo ---
  // Pointer tracking writes CSS custom properties, so assert the vars actually
  // move on pointermove (a stubbed rAF or a missing listener would leave them
  // at their initial 50%/50%).
  await goto('/');
  // The hero is the first spotlight surface on the page; the CTA banner further
  // down is also one, so target the hero specifically rather than "any".
  const heroSel = 'main .spotlight-surface >> nth=0';
  const hasHero = await page.locator(heroSel).count();
  if (hasHero) {
    const box = await page.locator(heroSel).boundingBox();
    await page.mouse.move(box.x + box.width * 0.25, box.y + box.height * 0.3);
    await page.waitForTimeout(250);
    const at = async () =>
      page.locator(heroSel).evaluate((el) => ({
        x: parseFloat(getComputedStyle(el).getPropertyValue('--spot-x')),
        y: parseFloat(getComputedStyle(el).getPropertyValue('--spot-y')),
        active: getComputedStyle(el).getPropertyValue('--spot-active').trim(),
      }));
    const a = await at();
    await page.mouse.move(box.x + box.width * 0.8, box.y + box.height * 0.7);
    await page.waitForTimeout(250);
    const b = await at();
    const moved = Math.abs(a.x - b.x) > 20 && Math.abs(a.y - b.y) > 20;
    const lit = a.active === '1' || b.active === '1';
    moved && lit
      ? ok('hero spotlight tracks pointer', `x ${Math.round(a.x)}->${Math.round(b.x)} y ${Math.round(a.y)}->${Math.round(b.y)}`)
      : bad('hero spotlight tracks pointer', `x ${a.x}->${b.x} y ${a.y}->${b.y} active=${a.active}/${b.active}`);
  } else bad('hero spotlight tracks pointer', 'no .spotlight-surface on /');

  // Nav glass must actually be applied, not just present in the stylesheet.
  // Over the hero the nav is deliberately transparent, so scroll past the hero
  // first to reach the `solid` state where the material engages.
  const navRead = () =>
    page.evaluate(() => {
      const n = document.querySelector('.site-nav');
      if (!n) return null;
      const s = getComputedStyle(n);
      return { solid: n.dataset.solid, blur: s.backdropFilter || s.webkitBackdropFilter, bg: s.backgroundColor };
    });
  const navTop = await navRead();
  await page.evaluate(() => window.scrollTo({ top: window.innerHeight * 1.2, behavior: 'instant' }));
  await page.waitForTimeout(900);
  const navScrolled = await navRead();
  if (navTop && navTop.solid === 'false' && /none/.test(navTop.blur)) {
    navScrolled && navScrolled.solid === 'true' && /blur/.test(navScrolled.blur)
      ? ok('nav glass engages on scroll', `transparent -> ${navScrolled.blur} on ${navScrolled.bg}`)
      : bad('nav glass engages on scroll', JSON.stringify(navScrolled));
  } else {
    bad('nav glass engages on scroll', `unexpected top state: ${JSON.stringify(navTop)}`);
  }
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page.waitForTimeout(400);

  // The light layer must not sit above the hero copy (it would wash out text).
  const stacking = await page.evaluate(() => {
    const layer = document.querySelector('.spotlight-layer');
    if (!layer) return null;
    const z = Number(getComputedStyle(layer).zIndex);
    const cs = getComputedStyle(layer).pointerEvents;
    return { z, pe: cs };
  });
  stacking && stacking.pe === 'none'
    ? ok('spotlight layer is inert to pointer', `z=${stacking.z} pointer-events=${stacking.pe}`)
    : bad('spotlight layer is inert to pointer', JSON.stringify(stacking));

  // ---- 6b2. Section rhythm: adjacent sections differ, and scale is sane ---
  // A page of identical section paddings reads as a flat stack. Assert the
  // rhythm scale resolves to real values and that Home actually consumes the
  // named roles rather than hardcoded clamps.
  // The tokens are clamp() expressions, so parseFloat() on the raw value is
  // NaN. Read the *resolved* pixel value off a live element per role instead,
  // which is also the value that actually matters to layout.
  const rhythm = await page.evaluate(() => {
    const probe = document.createElement('div');
    probe.style.cssText = 'position:absolute;visibility:hidden;left:-9999px';
    document.body.appendChild(probe);
    const resolve = (cls) => {
      probe.className = cls;
      return parseFloat(getComputedStyle(probe).paddingTop) || 0;
    };
    const roles = {
      tight: resolve('rhythm rhythm--tight'),
      standard: resolve('rhythm rhythm--standard'),
      generous: resolve('rhythm rhythm--generous'),
      hero: resolve('rhythm rhythm--hero'),
    };
    // Also read the raw token text so a missing definition is distinguishable
    // from a role that resolved to 0.
    const cs = getComputedStyle(document.documentElement);
    const declared = ['--rhythm-tight', '--rhythm-standard', '--rhythm-generous', '--rhythm-hero'].map((k) =>
      cs.getPropertyValue(k).trim()
    );
    probe.remove();
    const used = [...document.querySelectorAll('main section.rhythm')].map((s) => ({
      role: (s.className.match(/rhythm--(\w+)/) || [])[1] || 'base',
      pad: Math.round(parseFloat(getComputedStyle(s).paddingTop)),
    }));
    return { roles, declared, used };
  });
  const vals = Object.values(rhythm.roles);
  const allResolved = vals.every((v) => v > 0);
  const allDeclared = rhythm.declared.every(Boolean);
  // Monotonic tight <= standard <= generous <= hero, or the names are lies.
  const [t, s, g, h] = vals;
  const ordered = t <= s && s <= g && g <= h;
  // A scale where every role is the same number is not a scale.
  const distinct = new Set(vals).size >= 3;
  allResolved && allDeclared && ordered && distinct
    ? ok(
        'rhythm scale resolves',
        `tight=${Math.round(t)} standard=${Math.round(s)} generous=${Math.round(g)} hero=${Math.round(h)}px ` +
          `| used: ${rhythm.used.map((u) => `${u.role}@${u.pad}`).join(' ')}`
      )
    : bad('rhythm scale resolves', `roles=${JSON.stringify(rhythm.roles)} declared=${JSON.stringify(rhythm.declared)}`);

  // Home should use the named classes; a leftover clamp() is a scale bypass.
  const rawClamps = await page.evaluate(
    () =>
      [...document.querySelectorAll('main section')]
        .filter((s) => /padding:\s*clamp/.test(s.getAttribute('style') || ''))
        .length
  );
  const usesRoles = await page.evaluate(() => document.querySelectorAll('main section.rhythm').length);
  usesRoles > 0
    ? ok('home sections use rhythm roles', `${usesRoles} sections on the scale, ${rawClamps} raw clamps left`)
    : bad('home sections use rhythm roles', 'no section carries a .rhythm role');

  // ---- 6c. Reduced motion pins the spotlight and does not track --------
  const rmSpotCtx = await browser.newContext({ reducedMotion: 'reduce', viewport: { width: 1440, height: 900 } });
  const rms = await rmSpotCtx.newPage();
  await rms.goto(`${BASE}/`, { waitUntil: 'domcontentloaded' });
  await rms.evaluate(() => sessionStorage.setItem('1m_splash_seen', '1'));
  await rms.waitForTimeout(3200);
  const rmBox = await rms.locator(heroSel).boundingBox().catch(() => null);
  if (rmBox) {
    await rms.mouse.move(rmBox.x + 20, rmBox.y + 20);
    await rms.waitForTimeout(250);
    const rmSpot = await rms
      .locator(heroSel)
      .evaluate((el) => ({
        active: getComputedStyle(el).getPropertyValue('--spot-active').trim(),
        x: getComputedStyle(el).getPropertyValue('--spot-x').trim(),
      }))
      .catch(() => null);
    // Under reduced motion the hook never attaches, so --spot-x keeps its
    // pinned CSS value and the layer stays statically lit rather than moving.
    rmSpot && rmSpot.active !== '1'
      ? ok('reduced motion pins spotlight', `--spot-active=${rmSpot.active} x=${rmSpot.x}`)
      : bad('reduced motion pins spotlight', JSON.stringify(rmSpot));
  } else bad('reduced motion pins spotlight', 'no .spotlight-surface');
  await rmSpotCtx.close();

  // ---- 7. Mobile viewport --------------------------------------------
  const mCtx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const m = await mCtx.newPage();
  await m.goto(`${BASE}/`, { waitUntil: 'domcontentloaded' });
  await m.evaluate(() => sessionStorage.setItem('1m_splash_seen', '1'));
  await m.waitForTimeout(3200);
  const noHScroll = await m.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1);
  noHScroll ? ok('mobile: no horizontal scroll') : bad('mobile: no horizontal scroll');

  // The menu is the only way to navigate on a phone, so it has to be inside
  // the viewport and operable. This caught a burger pushed to x=452 on a 390px
  // screen by the Garage/Admin pills.
  const burger = m.locator('button[aria-label="Open navigation menu"]');
  const bInView = await burger.evaluate((el) => {
    const r = el.getBoundingClientRect();
    return r.left >= 0 && r.right <= window.innerWidth && r.width > 0;
  });
  bInView ? ok('mobile burger is on screen') : bad('mobile burger is on screen');
  await burger.click();
  const mDialog = m.locator('[role="dialog"][aria-label="Site menu"]');
  await mDialog.waitFor({ state: 'visible', timeout: 5000 });
  ok('mobile menu opens');
  await m.screenshot({ path: join(SHOTS, 'mobile-menu.png'), fullPage: false });
  await m.keyboard.press('Escape');
  await mDialog.waitFor({ state: 'detached', timeout: 5000 });
  ok('mobile menu closes on Escape');
  await mCtx.close();

  // ---- stats strip: four equal tiles, in order, no overflow ---------------
  // These are four parallel promises, not a ranked list, so they must render
  // as four equal tiles in source order at every width.
  for (const w of [1440, 1024, 640, 390]) {
    const bCtx = await browser.newContext({ viewport: { width: w, height: 900 } });
    const bPage = await bCtx.newPage();
    await bPage.goto(`${BASE}/`, { waitUntil: 'domcontentloaded' });
    await bPage.evaluate(() => sessionStorage.setItem('1m_splash_seen', '1'));
    await bPage.waitForTimeout(600);
    const strip = await bPage.evaluate(() => {
      const g = document.querySelector('.stats-grid');
      if (!g) return null;
      const gr = g.getBoundingClientRect();
      const stripCols = getComputedStyle(g).gridTemplateColumns.split(' ').length;
      const tiles = [...g.children].map((c) => {
        const b = c.getBoundingClientRect();
        return { x: Math.round(b.x), y: Math.round(b.y), w: Math.round(b.width) };
      });
      const rows = new Set(tiles.map((t) => t.y)).size;
      return {
        count: tiles.length,
        widths: tiles.map((t) => t.w),
        // Left-to-right, then top-to-bottom: the source order as painted.
        order: [...tiles].sort((a, b) => (a.y - b.y) || (a.x - b.x)).map((t) => `${t.x},${t.y}`),
        paintOrder: tiles.map((t) => `${t.x},${t.y}`),
        rows,
        // A tile can be laid out on one column yet be much wider than the
        // track it was placed in, which is how the stacking bug hid.
        overflowsTrack: tiles.some((t) => t.w > (gr.width + 1) / stripCols),
        overflow: document.documentElement.scrollWidth > window.innerWidth + 1,
      };
    });
    if (!strip) {
      bad(`stats strip @${w}`, 'grid not found');
    } else if (strip.overflow) {
      bad(`stats strip @${w}`, 'horizontal overflow');
    } else if (strip.count !== 4) {
      bad(`stats strip @${w}`, `expected 4 tiles, got ${strip.count}`);
    } else if (new Set(strip.widths).size !== 1) {
      // Equal tiles are the requirement; a 1px rounding wobble is not.
      bad(`stats strip @${w}`, `tiles not equal: ${strip.widths.join('/')}`);
    } else if (strip.order.join('|') !== strip.paintOrder.join('|')) {
      // Reordering tiles on screen would break the promised sequence.
      bad(`stats strip @${w}`, 'tiles reordered from source order');
    } else if (w > 1024 && strip.rows > 1) {
      // "Side by side" is the actual requirement. A leftover gridColumn span
      // or a min-width that outgrows the track made these stack into one
      // column while still reporting equal widths, so check the row count.
      bad(`stats strip @${w}`, `tiles stacked over ${strip.rows} rows, expected 1`);
    } else if (w > 1024 && strip.overflowsTrack) {
      bad(`stats strip @${w}`, 'tiles wider than their grid track');
    } else {
      ok(`stats strip @${w}`, `4 equal tiles in ${strip.rows} row(s), order kept, w=${strip.widths[0]}`);
    }
    await bCtx.close();
  }

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
if (netFailures.length) {
  console.log(`\nmedia network failures (${netFailures.length}):`);
  const byStatus = new Map();
  for (const f of netFailures) {
    if (!byStatus.has(f.status)) byStatus.set(f.status, new Set());
    byStatus.get(f.status).add(f.url);
  }
  for (const [status, set] of byStatus) {
    console.log(`  ${status}  (${set.size} url(s))`);
    [...set].slice(0, 5).forEach((u) => console.log('     ' + u.slice(0, 150)));
  }
} else {
  console.log('\nmedia network failures: none');
}
process.exit(failed ? 1 : 0);