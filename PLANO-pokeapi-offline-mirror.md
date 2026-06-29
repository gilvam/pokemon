# Mirror offline completo da PokeAPI (JSON + imagens/gifs) servido pelo app

## Context

O app Angular (`src/app/features/pokedex`) consome `https://pokeapi.co/api/v2`
(baseUrl hardcoded em `HttpPokeapiService`) e referencia sprites em
`raw.githubusercontent.com/PokeAPI/sprites`. Ele precisa rodar num ambiente **sem
internet**. O objetivo é ter uma **cópia local idêntica de todos os retornos da API**
(todos os endpoints) e **todas as imagens/gifs**, mais uma forma simples de servir tudo
offline, de modo que o app funcione exatamente como hoje, só que local.

Fatos confirmados na investigação (definem o desenho):

- **JSON**: o repositório oficial `PokeAPI/api-data` (~257 MB) já é uma cópia estática
  idêntica da API. Estrutura `data/api/v2/<endpoint>/<id>/index.json`. As URLs internas da
  API são **relativas** (`/api/v2/...`), mas as URLs de sprite são **absolutas**
  (`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/...`).
- **Indexação só por ID**: `type/fire` e `pokemon/ditto` retornam **404** no mirror — só
  existem por número. O app chama `getType('fire')` **por nome**, então o servidor offline
  precisa resolver **nome→ID**.
- **Listas/paginação**: o `<endpoint>/index.json` estático não cobre `?limit=&offset=`
  arbitrário (o app pede `getIndex(limit=100000)` esperando os 1351 pokémons). A lista
  completa precisa ser servida dinamicamente.
- **Imagens**: `PokeAPI/sprites` (~1,6 GB) em `sprites/pokemon/...` e `sprites/items/...`
  (inclui `other/` artwork/home/dream-world e `versions/` com GIFs animados).
- **App**: Angular v22, Express 5 já presente em `src/server.ts` (SSR) com placeholder
  `app.get('/api/{*splat}', ...)`. `public/` é servido na raiz. Existe `HttpPokeapiMockService`.

Decisões do usuário: **sprites completos (~1,6 GB)**; **integrar a API local no SSR
existente** (mais um servidor standalone para `ng serve`); **baixar o mirror completo agora**
e validar o app 100% offline.

## Approach

1. Baixar os repositórios oficiais (cópia idêntica) para uma pasta **gitignored**
   `api/` e gerar índices auxiliares (nome→ID e lista completa por endpoint).
2. Um **router Express compartilhado** que serve `/api/v2` e `/media` a partir do mirror,
   com: paginação fiel, resolução nome→ID, reescrita on-the-fly das URLs de sprite para
   `/media/...`, CORS e `Content-Type: application/json`. Os arquivos em disco permanecem
   **byte-idênticos** ao upstream (a reescrita acontece na resposta).
3. Montar esse router em `src/server.ts` (deploy offline num único processo) e expô-lo
   também via servidor standalone + `proxy.conf.json` para o fluxo `ng serve`.
4. Apontar o app para o mirror via environment (URLs relativas), sem quebrar o código atual.

## Aquisição de dados (`api/_serve/download.mjs`)

Script Node ESM, executado **uma vez numa máquina com internet**:

- Baixa o tarball `https://github.com/PokeAPI/api-data/archive/refs/heads/master.tar.gz`,
  extrai apenas `data/api/v2/` → `api/data/api/v2/`.
- Baixa o tarball `https://github.com/PokeAPI/sprites/archive/refs/heads/master.tar.gz`,
  extrai `sprites/` → `api/media/sprites/`.
- Varre `data/api/v2/<endpoint>/*/index.json` e gera, em `api/index/`:
  - `<endpoint>.json` = `{ count, results: [{ name, url }] }` ordenado por id (lista
    completa, usada para paginação).
  - `<endpoint>.names.json` = mapa `nome → id` (usado para resolver lookups por nome).
- Imprime contagens de verificação (ex.: pokemon = 1351) e valida que arquivos-chave
  existem.

Resultado (~1,9 GB), **não versionado**:
```
api/
  data/api/v2/<endpoint>/<id>/index.json   # idêntico ao upstream
  media/sprites/...                        # idêntico ao upstream
  index/<endpoint>.json                    # lista completa p/ paginação
  index/<endpoint>.names.json              # nome→id
```

## Router do mirror (`api/_serve/mirror-router.mjs`)

Factory `createPokeapiMirrorRouter({ dataDir, mediaDir, indexDir, mediaBase = '/media' })`
que devolve um `express.Router`:

- `GET /api/v2/:endpoint` (sem id) → lê `index/<endpoint>.json`, aplica `limit`/`offset`
  (defaults iguais aos da API), monta `count/next/previous/results` e responde. Garante que
  `?limit=100000` devolva os 1351.
- `GET /api/v2/<path...>` (detalhe, profundidade arbitrária) → resolve o último segmento por
  **nome→id** quando não for numérico (via `index/<endpoint>.names.json`); lê
  `data/api/v2/<path>/index.json`; reescreve no corpo
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/` → `${mediaBase}/` e responde
  `application/json`.
- `GET /media/*` → `express.static(mediaDir)` (mapeia `/media/sprites/pokemon/6.png` →
  `api/media/sprites/pokemon/6.png`).
- Headers CORS em tudo, para consumo por qualquer cliente.

Reutilizado por dois pontos de entrada:

- `api/_serve/serve.mjs` — servidor standalone (porta 4001) para `ng serve` dev.
- `src/server.ts` — montar `app.use(createPokeapiMirrorRouter({...}))` **antes** do
  fallthrough do Angular SSR, resolvendo o `dataDir`/`mediaDir` por env
  (`POKEAPI_MIRROR_DIR`, default `./api`).

## Fiação do app Angular

- Criar `src/environments/environment.ts` (+ `environment.development.ts`) com
  `pokeapiBaseUrl: '/api/v2'` e `mediaBaseUrl: '/media'`; registrar `fileReplacements` em
  `angular.json` se necessário.
- Em
  `src/app/features/pokedex/services/http/http-pokeapi/http-pokeapi.service.ts`:
  trocar `baseUrl = 'https://pokeapi.co/api/v2'` por `environment.pokeapiBaseUrl`. As demais
  chamadas (`getType(name)`, `getPokemon(id)`, `getSpecies(id)`, `getEvolutionChain(id)`,
  `getIndex(limit,offset)`) permanecem iguais.
- As URLs de sprite chegam já reescritas para `/media/sprites/...` (relativas) e funcionam
  direto nos `<img>`/`NgOptimizedImage` sem mudança de código.
- `proxy.conf.json` (raiz) encaminhando `/api/v2` e `/media` → `http://localhost:4001`;
  apontar `serve.options.proxyConfig` em `angular.json`.
- `package.json` scripts:
  - `mirror:download` → `node api/_serve/download.mjs`
  - `serve:pokeapi` → `node api/_serve/serve.mjs`
  - `serve:ssr:pokemon` (já existe) passa a servir app + API + imagens, **offline-completo**.
- `.gitignore`: ignorar os dados de `/api` (`/api/data`, `/api/index`, `/api/media`, `/api/.tmp`).

## Arquivos principais

- Novos: `api/_serve/download.mjs`, `api/_serve/mirror-router.mjs`,
  `api/_serve/serve.mjs`, `src/environments/environment.ts` (+ `.development.ts`),
  `proxy.conf.json`.
- Editados: `src/server.ts` (montar router), `http-pokeapi.service.ts` (baseUrl via env),
  `angular.json` (fileReplacements + proxyConfig), `package.json` (scripts), `.gitignore`.

## Verification

1. `npm run mirror:download` → conferir `api/data/api/v2/pokemon/1/index.json`,
   `api/media/sprites/pokemon/6.png` e `api/index/pokemon.json`
   (count = 1351). Reportar tamanho total baixado.
2. Build + SSR offline: `npm run build` e `npm run serve:ssr:pokemon`. Com acesso à internet
   bloqueado/desligado, validar via `curl`:
   - `/api/v2/pokemon?limit=100000` → `count` 1351 e `results.length` 1351.
   - `/api/v2/type/fire` → resolve por nome (id 10) e responde 200.
   - `/api/v2/pokemon/6` → URLs de sprite reescritas para `/media/...` (sem
     `raw.githubusercontent.com`).
   - `/media/sprites/pokemon/6.png` → 200 (imagem) e um GIF animado de `versions/`.
3. Abrir o app servido pelo SSR e confirmar que a lista da Pokédex e a tela de detalhe
   renderizam **com imagens**, sem nenhuma requisição a `pokeapi.co` ou `githubusercontent`.
4. Fluxo dev: `npm run serve:pokeapi` + `ng serve` (proxy) renderizando igual.
5. Rodar `ng test` (specs existentes do `HttpPokeapiService` continuam verdes) e um
   smoke-test do router (paginação, nome→id, reescrita de sprite).

## Riscos / observações

- **SSR + URL relativa**: no render server-side o `HttpClient` pode exigir base absoluta.
  Mitigação: durante SSR injetar a origem (`http://localhost:${PORT}`) via interceptor/token,
  mantendo URL relativa no browser. A validar no passo 3.
- **Tamanho/tempo**: ~1,9 GB de download; a pasta `api/` é copiada junto para a
  máquina offline (ou empacotada num zip de release).
- **Atualidade**: `api-data`/`sprites` são a fonte estática oficial do próprio site; reexecutar
  `mirror:download` quando quiser atualizar.
