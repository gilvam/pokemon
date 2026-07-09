  // Baixa uma cópia local idêntica da PokeAPI (JSON + sprites) a partir dos
// repositórios oficiais e gera índices auxiliares para o servidor offline.
//
// Uso (numa máquina COM internet):
//   node ../api/_serve/download.mjs
//
// Resultado (pasta gitignored, ~1,9 GB):
//   api/data/api/v2/<endpoint>/<id>/index.json   (idêntico ao upstream)
//   api/media/sprites/...                         (idêntico ao upstream)
//   api/index/<endpoint>.json                     (lista completa p/ paginação)
//   api/index/<endpoint>.names.json               (mapa nome -> id)

  import { spawnSync } from 'node:child_process';
  import { createWriteStream } from 'node:fs';
  import { mkdir, readdir, readFile, rename, rm, stat, writeFile } from 'node:fs/promises';
  import { join, resolve } from 'node:path';
  import { Readable } from 'node:stream';
  import { pipeline } from 'node:stream/promises';

  const MIRROR_DIR = resolve(process.env.POKEAPI_MIRROR_DIR ?? '../api');
const TMP_DIR = join(MIRROR_DIR, '.tmp');
const DATA_DIR = join(MIRROR_DIR, 'data', 'api', 'v2');
const MEDIA_DIR = join(MIRROR_DIR, 'media');
const INDEX_DIR = join(MIRROR_DIR, 'index');

// Cada fonte é um tarball do GitHub do qual extraímos uma subárvore para o destino.
// member: caminho dentro do tarball (sob a pasta raiz <repo>-<branch>/).
const SOURCES = [
  {
    name: 'api-data (JSON)',
    url: 'https://github.com/PokeAPI/api-data/archive/refs/heads/master.tar.gz',
    rootDir: 'api-data-master',
    member: ['data', 'api', 'v2'],
    dest: DATA_DIR,
  },
  {
    name: 'sprites (imagens/gifs)',
    url: 'https://github.com/PokeAPI/sprites/archive/refs/heads/master.tar.gz',
    rootDir: 'sprites-master',
    member: ['sprites'],
    dest: join(MEDIA_DIR, 'sprites'),
  },
  {
    name: 'cries (áudios)',
    url: 'https://github.com/PokeAPI/cries/archive/refs/heads/main.tar.gz',
    rootDir: 'cries-main',
    member: ['cries'],
    dest: join(MEDIA_DIR, 'cries'),
  },
];

/** Baixa uma URL para um arquivo, registrando o progresso. */
async function downloadTo({ url, destFile }) {
  console.log(`\n↓ Baixando ${url}`);
  const response = await fetch(url, { redirect: 'follow' });
  if (!response.ok || !response.body) {
    throw new Error(`Falha ao baixar ${url}: HTTP ${response.status}`);
  }

  const total = Number(response.headers.get('content-length')) || 0;
  let received = 0;
  let lastLogged = 0;
  const source = Readable.fromWeb(response.body);
  source.on('data', (chunk) => {
    received += chunk.length;
    if (received - lastLogged >= 25 * 1024 * 1024) {
      lastLogged = received;
      const mb = (received / 1024 / 1024).toFixed(0);
      const pct = total ? ` (${((received / total) * 100).toFixed(0)}%)` : '';
      process.stdout.write(`\r  ${mb} MB recebidos${pct}   `);
    }
  });

  await pipeline(source, createWriteStream(destFile));
  process.stdout.write('\n');
  const { size } = await stat(destFile);
  console.log(`  ✓ ${(size / 1024 / 1024).toFixed(1)} MB salvos em ${destFile}`);
}

/** Extrai um tar.gz usando o `tar` do sistema (bsdtar no Windows / GNU tar). */
function extractTarball({ tarFile, intoDir }) {
  console.log(`  Extraindo ${tarFile} ...`);
  const result = spawnSync('tar', ['-xzf', tarFile, '-C', intoDir], { stdio: 'inherit' });
  if (result.status !== 0) {
    throw new Error(`tar falhou (status ${result.status}). É necessário ter o "tar" no PATH.`);
  }
}

/** Move (rename) uma subárvore extraída para o destino final, substituindo o existente. */
async function moveInto({ from, to }) {
  await rm(to, { recursive: true, force: true });
  await mkdir(join(to, '..'), { recursive: true });
  await rename(from, to);
}

/** Lê id e name de um resource index.json. */
async function readIdAndName(file) {
  try {
    const json = JSON.parse(await readFile(file, 'utf8'));
    const id = typeof json.id === 'number' ? json.id : Number(json.id);
    const name = typeof json.name === 'string' ? json.name : undefined;
    return { id: Number.isFinite(id) ? id : undefined, name };
  } catch {
    return { id: undefined, name: undefined };
  }
}

/** Varre data/api/v2 e gera, por endpoint, a lista completa e o mapa nome->id. */
async function buildIndexes() {
  console.log('\n⚙  Gerando índices (lista completa + nome→id) por endpoint ...');
  await mkdir(INDEX_DIR, { recursive: true });
  const endpoints = (await readdir(DATA_DIR, { withFileTypes: true }))
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();

  for (const endpoint of endpoints) {
    const endpointDir = join(DATA_DIR, endpoint);
    const idDirs = (await readdir(endpointDir, { withFileTypes: true }))
      .filter((entry) => entry.isDirectory() && /^\d+$/.test(entry.name))
      .map((entry) => Number(entry.name))
      .sort((a, b) => a - b);

    const results = [];
    const names = {};
    for (const id of idDirs) {
      const { name } = await readIdAndName(join(endpointDir, String(id), 'index.json'));
      const url = `/api/v2/${endpoint}/${id}/`;
      results.push(name ? { name, url } : { url });
      if (name) {
        names[name] = id;
      }
    }

    await writeFile(
      join(INDEX_DIR, `${endpoint}.json`),
      JSON.stringify({ count: results.length, results }),
    );
    await writeFile(join(INDEX_DIR, `${endpoint}.names.json`), JSON.stringify(names));
    console.log(`  • ${endpoint}: ${results.length} recursos`);
  }
  return endpoints.length;
}

/** Soma recursiva do tamanho em disco (para o relatório final). */
async function dirSize(dir) {
  let total = 0;
  const entries = await readdir(dir, { withFileTypes: true }).catch(() => []);
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      total += await dirSize(full);
    } else {
      total += (await stat(full)).size;
    }
  }
  return total;
}

async function main() {
  const startedAt = Date.now();
  await rm(TMP_DIR, { recursive: true, force: true });
  await mkdir(TMP_DIR, { recursive: true });

  // 1) Baixa e extrai cada repositório oficial para a sua subárvore final.
  let step = 0;
  for (const source of SOURCES) {
    step += 1;
    console.log(`\n[${step}/${SOURCES.length}] ${source.name}`);
    const tarFile = join(TMP_DIR, `${source.rootDir}.tar.gz`);
    await downloadTo({ url: source.url, destFile: tarFile });
    extractTarball({ tarFile, intoDir: TMP_DIR });
    await moveInto({ from: join(TMP_DIR, source.rootDir, ...source.member), to: source.dest });
    await rm(tarFile, { force: true });
  }

  // 2) Índices auxiliares
  const endpointCount = await buildIndexes();

  // 3) Limpeza + verificação
  await rm(TMP_DIR, { recursive: true, force: true });

  const dataSize = await dirSize(join(MIRROR_DIR, 'data'));
  const mediaSize = await dirSize(MEDIA_DIR);
  const pokemonIndex = JSON.parse(await readFile(join(INDEX_DIR, 'pokemon.json'), 'utf8'));
  const elapsed = ((Date.now() - startedAt) / 1000).toFixed(0);

  console.log('\n──────────────────────────────────────────────');
  console.log('✓ Mirror da PokeAPI pronto');
  console.log(`  Endpoints:        ${endpointCount}`);
  console.log(`  Pokémon (count):  ${pokemonIndex.count}`);
  console.log(`  JSON:             ${(dataSize / 1024 / 1024).toFixed(0)} MB`);
  console.log(`  Imagens/sprites:  ${(mediaSize / 1024 / 1024).toFixed(0)} MB`);
  console.log(`  Total:            ${((dataSize + mediaSize) / 1024 / 1024).toFixed(0)} MB`);
  console.log(`  Pasta:            ${MIRROR_DIR}`);
  console.log(`  Tempo:            ${elapsed}s`);
  console.log('──────────────────────────────────────────────');
}

main().catch((error) => {
  console.error('\n✗ Erro:', error.message);
  process.exitCode = 1;
});
