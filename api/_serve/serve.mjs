// Servidor standalone do mirror da PokeAPI (para uso com `ng serve` via proxy).
// Sobe /api/v2 e /media na porta POKEAPI_PORT (default 4001).
//
//   node ../api/_serve/serve.mjs

import express from 'express';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { createPokeapiMirrorRouter } from './mirror-router.mjs';

const port = Number(process.env.POKEAPI_PORT ?? 4001);
const mirrorDir = resolve(process.env.POKEAPI_MIRROR_DIR ?? '../api');
const latencyMs = Number(process.env.POKEAPI_LATENCY_MS ?? 1000);

if (!existsSync(mirrorDir)) {
  console.error(`✗ Pasta do mirror não encontrada: ${mirrorDir}`);
  console.error('  Rode antes: node ../api/_serve/download.mjs');
  process.exit(1);
}

const app = express();

if (latencyMs > 0) {
  app.use((_req, _res, next) => setTimeout(next, latencyMs));
}

app.use(createPokeapiMirrorRouter({ mirrorDir }));

app.listen(port, () => {
  console.log(`PokeAPI offline servindo em http://localhost:${port}/api/v2`);
  console.log(`Imagens em http://localhost:${port}/media/sprites/...`);
  if (latencyMs > 0) {
    console.log(`Latência artificial: ${latencyMs}ms por requisição`);
  }
});
