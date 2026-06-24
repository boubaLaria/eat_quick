import { chromium } from 'playwright';
const BASE = 'http://localhost:3000';
const sleep = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext();
  const p = await ctx.newPage();

  // Log toutes les réponses réseau
  p.on('response', r => {
    if (r.url().includes('/api/auth') || r.url().includes('sign-in')) {
      console.log('NETWORK:', r.status(), r.url());
    }
  });

  await p.goto(BASE + '/sign-in');
  await p.waitForLoadState('networkidle');
  console.log('URL avant login:', p.url());

  await p.fill('input[name="email"]', 'manager@eat-quick.io');
  await p.fill('input[name="password"]', 'manager123');
  await p.click('button[type="submit"]');

  // Attendre 5 secondes et voir où on est
  await sleep(5000);
  console.log('URL après 5s:', p.url());
  await p.screenshot({ path: '/tmp/signin-debug.png' });

  const errText = await p.locator('text=incorrect, text=erreur, text=error').first().textContent().catch(() => 'none');
  console.log('Texte erreur:', errText);
  const bodyText = await p.locator('body').textContent();
  if (bodyText.includes('Dashboard') || bodyText.includes('compte')) {
    console.log('✅ Connexion réussie (contenu auth détecté)');
  } else if (bodyText.includes('Bon retour') || bodyText.includes('Connectez-vous')) {
    console.log('❌ Toujours sur sign-in — login échoué');
  }
  await browser.close();
})();
