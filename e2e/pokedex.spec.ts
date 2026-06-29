import { test, expect, type Locator, type Page } from '@playwright/test';

// Hosts que NÃO podem ser acessados: o app precisa funcionar 100% offline.
const EXTERNAL = /pokeapi\.co|raw\.githubusercontent\.com/;

/** Garante que o <img> realmente baixou e decodificou bytes (naturalWidth > 0). */
async function expectImageRendered(img: Locator): Promise<void> {
  await img.scrollIntoViewIfNeeded();
  await expect(img).toBeVisible();
  await expect
    .poll(() => img.evaluate((el: HTMLImageElement) => (el.complete ? el.naturalWidth : 0)))
    .toBeGreaterThan(0);
}

/** Coleta requisições externas e respostas de /media com erro durante o teste. */
function trackNetwork(page: Page): { external: string[]; failedMedia: string[] } {
  const external: string[] = [];
  const failedMedia: string[] = [];
  page.on('request', (req) => {
    if (EXTERNAL.test(req.url())) {
      external.push(req.url());
    }
  });
  page.on('response', (res) => {
    if (res.url().includes('/media/') && !res.ok()) {
      failedMedia.push(`${res.status()} ${res.url()}`);
    }
  });
  return { external, failedMedia };
}

test.describe('Pokédex offline', () => {
  test('a lista carrega com imagens servidas do mirror local', async ({ page }) => {
    const net = trackNetwork(page);

    await page.goto('/pokedex');
    await expect(page.getByText(/\d+ Pokémon encontrados/)).toBeVisible();

    const firstImage = page.locator('img.pokemon-card__image').first();
    await expect(firstImage).toHaveAttribute('src', /\/media\/sprites\//);
    await expectImageRendered(firstImage);

    await page.waitForLoadState('networkidle');
    expect(net.failedMedia, `imagens com erro: ${net.failedMedia.join(', ')}`).toEqual([]);
    expect(net.external, `requisições externas: ${net.external.join(', ')}`).toEqual([]);
  });

  test('a tela de detalhe carrega com a artwork', async ({ page }) => {
    const net = trackNetwork(page);

    await page.goto('/pokedex/6');
    await expect(page.locator('h1.detail__name')).toHaveText('charizard');

    const artwork = page.locator('img.detail__artwork');
    await expect(artwork).toHaveAttribute('src', /\/media\/sprites\//);
    await expectImageRendered(artwork);

    await page.waitForLoadState('networkidle');
    expect(net.failedMedia, `imagens com erro: ${net.failedMedia.join(', ')}`).toEqual([]);
    expect(net.external, `requisições externas: ${net.external.join(', ')}`).toEqual([]);
  });
});
