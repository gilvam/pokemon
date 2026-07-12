# Plano — Pokédex com busca por nome (04.2-prompt-markdown-skills)

## Context

`04.2-prompt-markdown-skills` é um app Angular 22 (standalone, SSR, Vitest) recém-gerado
pelo CLI: rotas vazias, `app.config.ts` só com router + hydration, **sem** `HttpClient`,
sem pasta `environments`, sem `proxy.conf.json`, sem nenhum código de domínio. O objetivo é
implementar a Pokédex descrita no prompt (`.claude/prompts/prompt_2_final.md`): listar todos
os Pokémon da API local (mirror offline da PokeAPI), permitir busca incremental por nome no
client, e abrir um detalhe rico (stats/tipos/habilidades/sprites **+ espécie/evolução**,
confirmado com o usuário) com fundo em gradiente pastel derivado do(s) tipo(s).

Há dois projetos-irmão no mesmo repositório que já resolvem esse mesmo problema e servem de
referência arquitetural (não serão copiados literalmente, mas seus padrões serão seguidos):

- **`03-prompt-markdown-skills`** — segue exatamente as skills desta casa: `features/pokedex/`
  com DTOs `@Dto()`, serviço HTTP dedicado, `environment.ts` + `proxy.conf.json` para falar
  com a API local, e um `TypePalette`/`TypeColor` com paleta pastel acessível (WCAG AA) e
  `cardBackground()` que gera o gradiente CSS via `color-mix`/`linear-gradient`. É a base
  principal deste plano, exceto que ele usa RxJS (`forkJoin`/`switchMap`/`toSignal`) onde
  este prompt exige `resource()`/`httpResource()` e `debounced()`.
- **`01.3-prompt-simple_effort-max`** — versão mais simples/plana (interfaces em vez de DTOs
  de classe, sem seguir as skills), útil só como segunda referência de UX (paginação/infinite
  scroll, fallback de imagem, prev/next no detalhe), não como padrão de código.

Confirmado com `node_modules/@angular/core`: Angular 22 já expõe
`debounced<T>(source: () => T, wait, options?): Resource<T>` (experimental) e
`resource()`/`httpResource()` com `value()/hasValue()/isLoading()/error()/status()` — exatamente
a API que o prompt pede.

---

## 1. Wiring de infraestrutura (API local, proxy, HTTP)

- `proxy.conf.json` (novo, raiz do projeto) — igual ao de `03-prompt-markdown-skills`:
  ```json
  {
    "/api/v2": { "target": "http://localhost:4001", "secure": false, "changeOrigin": true },
    "/media": { "target": "http://localhost:4001", "secure": false, "changeOrigin": true }
  }
  ```
- `angular.json` — adicionar `"proxyConfig": "proxy.conf.json"` em `architect.serve.options`.
- `src/environments/environment.ts` (novo) — `{ production: false, pokeapiBaseUrl: '/api/v2', mediaBaseUrl: '/media' }`.
- `tsconfig.json` — adicionar `paths`: `"@environments/*": ["./src/environments/*"]` e
  `"@decorators/*": ["./src/app/_decorators/*"]` (mesmo alias de `03-prompt-markdown-skills`).
- `package.json` — adicionar scripts `mirror:download` (`node ../api/_serve/download.mjs`) e
  `serve:pokeapi` (`node ../api/_serve/serve.mjs`), e corrigir `name`/`serve:ssr:*` (hoje ainda
  aponta para `02-prompt-markdown`).
- `src/app/app.config.ts` — adicionar `provideHttpClient(withFetch())` (necessário para
  `httpResource`).
- `src/app/app.routes.server.ts` — trocar `RenderMode.Prerender` por `RenderMode.Client`
  (~1300 ids dinâmicos e dados client-only, mesmo motivo do `03-prompt-markdown-skills`).

## 2. Decorator `@Dto()` (vendorizado)

Copiar/adaptar de `03-prompt-markdown-skills/src/app/_decorators/` (não existe em 04.2 ainda),
conforme a skill `angular-http`:
- `_decorators/_models/options.model.ts` — `Options { noNullValue = true, keyCamelCase = false }`.
- `_decorators/object.util.ts` — `ObjectUtil.toCamelCase`.
- `_decorators/class.decorator.ts` — `export function Dto(options)` (Proxy sobre o construtor +
  `create()`/`createArray()`).
- `_decorators/class.decorator.spec.ts` — testes do decorator.

## 3. Estrutura de pastas (`angular-folder-structure` + `angular-http`)

Só a feature `pokemon` consome a API → módulo HTTP fica dentro da feature:

```
src/app/features/pokemon/
├─ pokemon.routes.ts               # '' → PokemonList ; ':id' → PokemonDetail
├─ pages/
│  ├─ pokemon-list/     (.ts/.html/.scss/.spec.ts)
│  └─ pokemon-detail/   (.ts/.html/.scss/.spec.ts)
├─ components/
│  ├─ pokemon-card/     (.ts/.html/.scss/.spec.ts)   # gradiente pastel, alt, lazy
│  ├─ pokemon-search/   (.ts/.html/.scss/.spec.ts)   # input + signal + debounced()
│  └─ pagination/       (.ts/.html/.scss/.spec.ts)   # paginação client-side
├─ models/
│  ├─ pokemon-type.enum.ts             # 18 tipos
│  ├─ pokemon-summary.model.ts         # id, name, types[]
│  ├─ type-color.model.ts              # background + text
│  ├─ type-palette.model.ts            # Map<PokemonType, TypeColor> + cardBackground()
│  ├─ evolution-step.model.ts          # id, name (nó achatado da cadeia)
│  ├─ resource-id.util.ts              # extrai id de uma url NamedAPIResource
│  └─ *.spec.ts para os módulos acima com lógica
└─ services/
   ├─ pokemon-index.store.ts           # bootstrap: índice + mapa tipo→pokemon (signals)
   └─ http/http-pokemon/
      ├─ http-pokemon.service.ts (+ .spec.ts)
      ├─ http-pokemon.mock.service.ts
      ├─ jsons/get-index|get-pokemon|get-type|get-species|get-evolution-chain/*.json
      └─ models/
         ├─ named-resource.dto.ts
         ├─ pokemon-list-response.dto.ts
         ├─ pokemon-sprites-other.dto.ts / pokemon-sprites.dto.ts
         ├─ pokemon-type-slot.dto.ts / pokemon-ability.dto.ts / pokemon-stat.dto.ts
         ├─ pokemon-cries.dto.ts
         ├─ pokemon.dto.ts
         ├─ type-pokemon.dto.ts / type.dto.ts
         ├─ genus.dto.ts / flavor-text.dto.ts / pokemon-species.dto.ts
         ├─ evolution-link.dto.ts / evolution-chain-ref.dto.ts / evolution-chain.dto.ts
         └─ *.dto.spec.ts (matriz null/partial/keyCamelCase/defaultValues)
```

`src/app/app.routes.ts` — rota lazy `pokemon` (`''` redireciona para `pokemon`), mesmo padrão
de `03-prompt-markdown-skills/src/app/app.routes.ts`.

## 4. Camada HTTP (`HttpPokemonService`)

Métodos (Observable + `Dto.create()`, `inject(HttpClient)`, `providedIn: 'root'`):
- `getIndex(limit = 100000, offset = 0): Observable<PokemonListResponseDto>` → `/pokemon`.
- `getType(name: string): Observable<TypeDto>` → `/type/{name}`.
- `getPokemon(id: number): Observable<PokemonDto>` → `/pokemon/{id}` (usado por `getPokemonUrl` abaixo para o `httpResource`).
- `getSpecies(id: number): Observable<PokemonSpeciesDto>` → `/pokemon-species/{id}`.
- `getEvolutionChain(id: number): Observable<EvolutionChainDto>` → `/evolution-chain/{id}`.
- Builders de URL puros e públicos (`pokemonUrl(id)`, `speciesUrl(id)`, `evolutionChainUrl(id)`),
  reaproveitados tanto pelos métodos Observable acima (spec com `HttpTestingController`) quanto
  pelos `httpResource()` da tela de detalhe (que precisam de uma URL, não de um Observable).

`HttpPokemonMockService` estende o real, sobrescreve os 5 métodos com fixtures de `jsons/`.

## 5. Store de bootstrap (`PokemonIndexStore`)

Signal-based, injetável, chamado uma vez (ex.: `ngOnInit`/constructor da `PokemonList`):
- `_summaries = signal<PokemonSummary[]>([])`, `status = signal<'idle'|'loading'|'ready'|'error'>()`.
- `loadIndex()`: dispara em paralelo `getIndex()` + 18× `getType(tipo)` (`forkJoin`), monta
  `id -> tipos[]` (mesma lógica de `buildSummaries` do `PokedexStore` de `03-prompt-markdown-skills`:
  agrega por `slot`, ordena, faz merge com o índice via id extraído da url) e popula `_summaries`.
- Sem cache em `localStorage` (fora de escopo — não pedido) e sem raridade/filtro por tipo
  (fora de escopo do prompt atual).

## 6. Busca incremental (signal + `debounced()`)

Na `pokemon-search` (ou diretamente na `PokemonList`):
```ts
readonly term = signal('');
readonly debouncedTerm = debounced(this.term, 200); // Resource<string>, ~150–300ms
```
`PokemonList` computa a lista filtrada a partir de `store.summaries()` + `debouncedTerm.value()`
(guardado por `debouncedTerm.hasValue()`, com fallback `''` antes do primeiro assentamento) —
filtro por substring case-insensitive no nome, **sem** nova requisição HTTP. Estado vazio:
"nenhum Pokémon encontrado para '<termo>'". Paginação client-side (`pagination` component) sobre
a lista já filtrada, tamanho de página fixo (ex. 48), sem re-buscar por página.

## 7. Paleta pastel e gradiente por tipo

`type-palette.model.ts` — mesma técnica de `03-prompt-markdown-skills/type-palette.model.ts`,
recriada do zero (18 tons pastel próprios, um por tipo, texto único com contraste AA validado
em spec via cálculo de contraste), com:
- `TypePalette.colorOf(type)`, `TypePalette.all()`.
- `TypePalette.cardBackground(types: PokemonType[])`: 0 tipos → neutro (skeleton, enquanto mapa
  de tipos ainda carrega); 1 tipo → `linear-gradient` entre a cor e `color-mix(... white)`;
  2 tipos → `linear-gradient` entre a cor do tipo primário (`slot` 1) e secundário (`slot` 2),
  nessa ordem.
- Aplicado via `[style.background]` (computed), nunca `ngStyle`, no `pokemon-card` e no cabeçalho
  de `pokemon-detail`.

## 8. Detalhe — `resource()`/`httpResource()` encadeados

`PokemonDetail` lê o id da rota (`input()` com `withComponentInputBinding()`, ou `ActivatedRoute`)
e monta 3 resources encadeados via `computed()` + guard `hasValue()` (sem RxJS):
```ts
readonly id = input.required<string>(); // route param
readonly pokemon = httpResource(() => this.api.pokemonUrl(this.id()), { parse: PokemonDto.create });

readonly speciesId = computed(() =>
  this.pokemon.hasValue() ? ResourceId.fromUrl(this.pokemon.value().species.url) : undefined,
);
readonly species = httpResource(
  () => (this.speciesId() ? this.api.speciesUrl(this.speciesId()!) : undefined),
  { parse: PokemonSpeciesDto.create },
);

readonly evolutionChainId = computed(() =>
  this.species.hasValue() ? ResourceId.fromUrl(this.species.value().evolutionChain.url) : undefined,
);
readonly evolution = httpResource(
  () => (this.evolutionChainId() ? this.api.evolutionChainUrl(this.evolutionChainId()!) : undefined),
  { parse: EvolutionChainDto.create },
);
```
- Estado de loading = `pokemon.isLoading()` (bloqueia a tela toda); `species`/`evolution` têm
  loading próprio e **não bloqueiam** a seção principal — suas seções mostram spinner local e,
  em erro, apenas ocultam a seção (não quebram a tela).
- 404/erro em `pokemon.error()` → mensagem amigável + botão/link "Voltar" (`routerLink` para a
  lista, preservando querystring de busca/página se prático).
- `EvolutionStep`: achatamento recursivo da cadeia (`evolution.value().chain`) em lista
  `{id, name}[]`, cada item navegável (`routerLink` para `/pokemon/:id`).
- Seções da tela: header (artwork + nome + nº + gradiente por tipo), tipos, stats (barras
  acessíveis `role="progressbar"`), habilidades (com flag "oculta"), sprites (front/back/shiny),
  áudio do cry (`<audio controls>` com `cries.latest`), genus + flavor text (EN) da espécie,
  cadeia de evolução.

## 9. Componentes/páginas — UI/UX

- `pokemon-card`: `input.required<PokemonSummary>()`, imagem (`official-artwork` por id, sem
  request extra, fallback para sprite simples em `(error)`), `alt` descritivo, `loading="lazy"`,
  é `routerLink` real (`<a>`), foco visível via CSS, fundo = `TypePalette.cardBackground`;
  enquanto `PokemonIndexStore.status()` ainda não é `ready`/tipos não chegaram, mostra skeleton
  neutro.
- `pokemon-list`: chama `store.loadIndex()`, mostra loading/erro/vazio, grid de `pokemon-card`,
  `pokemon-search` acima do grid, `pagination` abaixo.
- `pagination`: componente presentational simples (botões prev/next + números), sem paginação
  via API.
- Sem Angular Material (não é exigido pelo prompt e o projeto não tem a dependência) — HTML
  semântico + CSS puro (`color-mix`, grid), consistente com `angular-patterns`.

## 10. Testes (`vitest-testing` + skill da camada)

- DTOs: matriz no-input/null/partial/nested-null/`keyCamelCase`/`defaultValues`.
- `http-pokemon.service.spec.ts`: `HttpTestingController`, asserts de URL e mapeamento, `httpMock.verify()`.
- `type-palette.model.spec.ts`: contraste AA (1 e 2 tipos), fallback neutro sem tipos.
- `pokemon-index.store.spec.ts`: monta `id -> tipos[]` a partir de fixtures de `getIndex`/`getType`.
- `pokemon-card.spec.ts`, `pokemon-search.spec.ts` (debounce), `pokemon-list.spec.ts`
  (loading/vazio/filtro), `pokemon-detail.spec.ts` (loading/erro 404/dados completos) — smoke +
  estados principais.

## Verificação end-to-end

1. `ng build` sem erros; `ng test` (Vitest) verde.
2. `npm run serve:pokeapi` (porta 4001) + `npm start` (proxy 4200) e validar manualmente:
   - Lista carrega (spinner enquanto índice+tipos chegam); cards com gradiente pastel por tipo.
   - Digitar parte de um nome filtra sem nova requisição de rede (checar Network tab); termo
     sem match mostra "nenhum Pokémon encontrado para '<termo>'".
   - Clicar em um card abre o detalhe com spinner (~1s de latência artificial), depois
     stats/tipos/habilidades/sprites/espécie/evolução; id inválido → 404 tratado com "voltar".
   - Teclado: navegar até um card só com Tab e ativar com Enter; foco visível.
3. Conferir contraste (DevTools) dos fundos pastel vs texto nos cards e no cabeçalho do detalhe.
