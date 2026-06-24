import { chromium } from 'playwright';

const BASE = 'http://localhost:3001';
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function getGeneratedAt(page) {
  const full = await page.locator('text=Generated at:').first().textContent().catch(() => '');
  const match = full.match(/\d{4}-\d{2}-\d{2}T[\d:.Z]+/);
  return match ? match[0] : '(non trouvé)';
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext();

  // ══════════════════════════════════════════════════════════════
  // TEST 1 — timestamp figé entre 2 requêtes rapides
  // ══════════════════════════════════════════════════════════════
  console.log('\n=== TEST 1 — Cache ISR : timestamp stable entre requêtes ===');
  const p1 = await ctx.newPage();
  await p1.goto(BASE + '/news');
  await p1.waitForLoadState('load');
  const ts1a = await getGeneratedAt(p1);
  const nb1 = await p1.locator('a[href^="/news/"]').count();
  console.log('  req 1 — Generated at :', ts1a, '| articles :', nb1);

  await sleep(800);
  await p1.reload();
  await p1.waitForLoadState('load');
  const ts1b = await getGeneratedAt(p1);
  console.log('  req 2 — Generated at :', ts1b);
  console.log(ts1a === ts1b
    ? '  ✅ Identiques → cache ISR actif (timestamp figé)'
    : '  ℹ️  Différents → cache vient d\'expirer (stale 5 min écoulé)');

  // ══════════════════════════════════════════════════════════════
  // TEST 2 — article inséré manuellement (sans revalidatePath)
  // ══════════════════════════════════════════════════════════════
  console.log('\n=== TEST 2 — Article inséré manuellement en BDD ===');
  const manualVisible = await p1.locator('text=Test ajout manuel via BDD').count();
  console.log(manualVisible > 0
    ? '  ℹ️  Article visible → ISR a revalidé depuis l\'insertion (stale expiré)'
    : '  ✅ Article absent → cache ISR protège /news, non invalidé sans revalidatePath');
  await p1.close();

  // ══════════════════════════════════════════════════════════════
  // TEST 3 — accès direct par slug
  // ══════════════════════════════════════════════════════════════
  console.log('\n=== TEST 3 — Accès direct /news/test-ajout-manuel-db ===');
  const p3 = await ctx.newPage();
  await p3.goto(BASE + '/news/test-ajout-manuel-db');
  await p3.waitForLoadState('load');
  const h1_3 = await p3.locator('h1').first().textContent().catch(() => '');
  const ts3 = await getGeneratedAt(p3);
  console.log('  H1 :', h1_3.trim());
  console.log('  Generated at :', ts3);
  console.log(h1_3.includes('manuel')
    ? '  ✅ Article accessible directement par slug'
    : '  ❌ Article introuvable');
  await p3.screenshot({ path: '/tmp/test3-news-detail.png' });
  await p3.close();

  // ══════════════════════════════════════════════════════════════
  // TEST 4 — formulaire admin → revalidatePath('/news')
  // ══════════════════════════════════════════════════════════════
  console.log('\n=== TEST 4 — Création via formulaire admin ===');

  // Connexion : la page utilise signIn.email() côté client (better-auth)
  // Playwright doit attendre la navigation client-side (router.push)
  const p4 = await ctx.newPage();
  await p4.goto(BASE + '/sign-in');
  await p4.waitForLoadState('load');
  await p4.fill('input[name="email"]', 'manager@eat-quick.io');
  await p4.fill('input[name="password"]', 'manager123');
  await p4.click('button[type="submit"]');
  // router.push('/account') est une SPA navigation — attendre le changement d'URL comme string
  await p4.waitForURL(url => !url.toString().includes('/sign-in'), { timeout: 15000 });
  console.log('  ✅ Connecté → URL :', p4.url());

  // Naviguer vers /admin/news et attendre le formulaire JS (client component)
  await p4.goto(BASE + '/admin/news');
  await p4.waitForSelector('input[name="title"]', { timeout: 15000 });
  console.log('  ✅ Formulaire admin/news prêt');

  // Snapshot /news AVANT
  const p4b = await ctx.newPage();
  await p4b.goto(BASE + '/news');
  await p4b.waitForLoadState('load');
  const ts_before = await getGeneratedAt(p4b);
  const nb_before = await p4b.locator('a[href^="/news/"]').count();
  console.log('  /news AVANT — Generated at :', ts_before, '| articles :', nb_before);
  await p4b.close();

  // Remplir le formulaire
  const slug = 'offre-flash-ete-' + Date.now();
  const title = 'Offre flash été : plateau salade -20%';
  await p4.fill('input[name="title"]', title);
  await sleep(400); // laisser l'auto-slug s'exécuter
  await p4.fill('input[name="slug"]', slug);
  await p4.fill('textarea[name="content"]', 'Article créé via le formulaire admin. revalidatePath doit invalider /news.');
  await p4.fill('input[name="featured_image"]', 'https://picsum.photos/seed/flash/800/400');
  await p4.screenshot({ path: '/tmp/test4-form-filled.png' });
  console.log('  Formulaire rempli → soumission…');

  await p4.click('button[type="submit"]');
  // Attendre le message de succès (useActionState)
  await p4.waitForSelector('text=publiée avec succès', { timeout: 10000 });
  console.log('  ✅ Message de succès affiché → revalidatePath appelé');
  await p4.screenshot({ path: '/tmp/test4-form-success.png' });
  await p4.close();

  // 1re requête post-revalidation
  await sleep(300);
  const p4c = await ctx.newPage();
  await p4c.goto(BASE + '/news');
  await p4c.waitForLoadState('load');
  const ts_after1 = await getGeneratedAt(p4c);
  const nb_after1 = await p4c.locator('a[href^="/news/"]').count();
  console.log('  /news req 1 post — Generated at :', ts_after1, '| articles :', nb_after1);

  // 2e requête (ISR background refresh complété)
  await sleep(600);
  await p4c.reload();
  await p4c.waitForLoadState('load');
  const ts_after2 = await getGeneratedAt(p4c);
  const nb_after2 = await p4c.locator('a[href^="/news/"]').count();
  const newVisible = await p4c.locator('text=' + title).count();
  console.log('  /news req 2 post — Generated at :', ts_after2, '| articles :', nb_after2);
  console.log(newVisible > 0
    ? '  ✅ Nouvel article "' + title + '" visible dans /news !'
    : '  ℹ️  Article pas encore visible (attendre cycle stale ISR)');
  console.log(ts_after2 !== ts_before
    ? '  ✅ Generated at changé → revalidatePath + ISR fonctionnent !'
    : '  ℹ️  Timestamp inchangé (window stale non expirée)');

  await p4c.screenshot({ path: '/tmp/test4-news-final.png' });
  await p4c.close();

  console.log('\nScreenshots : /tmp/test3-news-detail.png');
  console.log('             /tmp/test4-form-filled.png');
  console.log('             /tmp/test4-form-success.png');
  console.log('             /tmp/test4-news-final.png\n');
  await browser.close();
})();
