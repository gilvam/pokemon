import { defineConfig, devices } from '@playwright/test';

/**
 * E2E do app rodando 100% offline.
 *
 * O `webServer` sobe os DOIS processos do fluxo dev:
 *  - o mirror da PokeAPI (JSON + imagens) na porta 4001 (`serve:pokeapi`);
 *  - o `ng serve` na 4200, com proxy de /api/v2 e /media -> 4001.
 *
 * Assim o teste valida exatamente a configuração usada no desenvolvimento e
 * evita o erro de subir o app sem o mirror (que faz as imagens não carregarem).
 */
const APP_URL = 'http://localhost:4200';
const isCI = !!process.env['CI'];

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 1 : 0,
  reporter: 'list',
  use: {
    baseURL: APP_URL,
    trace: 'on-first-retry',
  },
  expect: {
    timeout: 15_000,
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: [
    {
      command: 'npm run serve:pokeapi',
      port: 4001,
      reuseExistingServer: !isCI,
      timeout: 60_000,
    },
    {
      command: 'npm start -- --port 4200',
      url: APP_URL,
      reuseExistingServer: !isCI,
      timeout: 180_000,
    },
  ],
});
