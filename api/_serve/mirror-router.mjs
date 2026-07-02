// Router Express que serve uma cópia local da PokeAPI (JSON + imagens) a partir
// da pasta gerada por download.mjs. Reusado tanto pelo servidor standalone
// (serve.mjs, para `ng serve`) quanto pelo SSR (src/server.ts).
//
// - GET /api/v2/<endpoint>            -> lista paginada (limit/offset) a partir do índice
// - GET /api/v2/<endpoint>/<id|nome>  -> recurso individual (resolve nome -> id)
// - GET /api/v2/<...>/<sub>           -> sub-recursos (ex.: pokemon/1/encounters)
// - GET /media/sprites/...            -> imagens/gifs estáticos
//
// As URLs de sprite (absolutas para o GitHub) são reescritas em tempo de resposta
// para `${mediaBase}/...`, mantendo os arquivos em disco idênticos ao upstream.

import express from 'express';
import { readFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';

// Bases externas (GitHub) das mídias referenciadas nas respostas. Tudo abaixo de
// cada base é reescrito para `${mediaBase}/...` e servido localmente de /media.
// sprites/master/<sprites/...> e cries/main/<cries/...> -> /media/sprites|cries/...
const EXTERNAL_MEDIA_BASES = [
  'https://raw.githubusercontent.com/PokeAPI/sprites/master/',
  'https://raw.githubusercontent.com/PokeAPI/cries/main/',
];
const DEFAULT_LIMIT = 20;

/** @param {string | undefined} value @param {number} fallback */
function toPositiveInt(value, fallback) {
  const parsed = Number.parseInt(String(value), 10);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
}

export function createPokeapiMirrorRouter(options = {}) {
  const mirrorDir = resolve(
    options.mirrorDir ?? process.env.POKEAPI_MIRROR_DIR ?? '../api',
  );
  const mediaBase = `/${(options.mediaBase ?? process.env.POKEAPI_MEDIA_BASE ?? '/media').replace(/^\/+|\/+$/g, '')}`;

  const dataDir = join(mirrorDir, 'data', 'api', 'v2');
  const indexDir = join(mirrorDir, 'index');
  const mediaDir = join(mirrorDir, 'media');

  /** Cache de mapas nome->id por endpoint. */
  const namesCache = new Map();

  async function loadNames(endpoint) {
    if (!namesCache.has(endpoint)) {
      const names = await readFile(join(indexDir, `${endpoint}.names.json`), 'utf8')
        .then(JSON.parse)
        .catch(() => ({}));
      namesCache.set(endpoint, names);
    }
    return namesCache.get(endpoint);
  }

  /** Resolve o segmento de id/nome para o id numérico em disco; null se desconhecido. */
  async function resolveId(endpoint, identifier) {
    if (/^\d+$/.test(identifier)) {
      return identifier;
    }
    const names = await loadNames(endpoint);
    const id = names[identifier.toLowerCase()];
    return id === undefined ? null : String(id);
  }

  /** Lê um index.json, reescreve as URLs de sprite e responde como JSON. */
  async function sendResource(res, filePath) {
    try {
      const raw = await readFile(filePath, 'utf8');
      const body = EXTERNAL_MEDIA_BASES.reduce(
        (text, base) => text.split(base).join(`${mediaBase}/`),
        raw,
      );
      res.type('application/json').send(body);
    } catch {
      res.status(404).type('application/json').send('{"detail":"Not Found"}');
    }
  }

  /** Lista paginada a partir do índice completo gerado no download. */
  async function sendList(req, res, endpoint) {
    let index;
    try {
      index = JSON.parse(await readFile(join(indexDir, `${endpoint}.json`), 'utf8'));
    } catch {
      // Fallback: índice ausente -> serve o arquivo bruto do upstream, se houver.
      return sendResource(res, join(dataDir, endpoint, 'index.json'));
    }

    const limit = toPositiveInt(req.query.limit, DEFAULT_LIMIT);
    const offset = toPositiveInt(req.query.offset, 0);
    const { count, results } = index;
    const page = results.slice(offset, offset + limit);
    const nextOffset = offset + limit;
    const query = (o) => `/api/v2/${endpoint}?offset=${o}&limit=${limit}`;

    res.json({
      count,
      next: nextOffset < count ? query(nextOffset) : null,
      previous: offset > 0 ? query(Math.max(offset - limit, 0)) : null,
      results: page,
    });
  }

  const router = express.Router();

  // CORS para consumo por qualquer cliente offline.
  router.use((_req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
    next();
  });
  router.options('/{*splat}', (_req, res) => res.sendStatus(204));

  // Imagens/gifs estáticos.
  router.use(
    mediaBase,
    express.static(mediaDir, { index: false, redirect: false, maxAge: '7d' }),
  );

  // API JSON.
  router.get('/api/v2/{*splat}', async (req, res) => {
    const segments = decodeURIComponent(req.path)
      .replace(/^\/api\/v2\/?/, '')
      .split('/')
      .filter(Boolean);

    if (segments.length === 0) {
      return sendResource(res, join(dataDir, 'index.json'));
    }
    if (segments.length === 1) {
      return sendList(req, res, segments[0]);
    }

    const [endpoint, identifier, ...rest] = segments;
    const id = await resolveId(endpoint, identifier);
    if (id === null) {
      return res.status(404).type('application/json').send('{"detail":"Not Found"}');
    }
    return sendResource(res, join(dataDir, endpoint, id, ...rest, 'index.json'));
  });

  return router;
}
