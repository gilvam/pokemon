// Servidor standalone do mirror da PokeAPI (para uso com `ng serve` via proxy).
// Sobe /api/v2 e /media na porta POKEAPI_PORT (default 4001).
//
//   node tools/pokeapi-mirror/serve.mjs

import express from 'express';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { createPokeapiMirrorRouter } from './mirror-router.mjs';

const port = Number(process.env.POKEAPI_PORT ?? 4001);
const mirrorDir = resolve(process.env.POKEAPI_MIRROR_DIR ?? './pokeapi-mirror');

if (!existsSync(mirrorDir)) {
  console.error(`✗ Pasta do mirror não encontrada: ${mirrorDir}`);
  console.error('  Rode antes: node tools/pokeapi-mirror/download.mjs');
  process.exit(1);
}

const app = express();
app.use(createPokeapiMirrorRouter({ mirrorDir }));

app.listen(port, () => {
  console.log(`PokeAPI offline servindo em http://localhost:${port}/api/v2`);
  console.log(`Imagens em http://localhost:${port}/media/sprites/...`);
});
