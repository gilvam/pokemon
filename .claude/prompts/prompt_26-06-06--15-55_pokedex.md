# Pokédex com Angular Material + PokeAPI v2

## Context

O projeto é um app Angular v22 (standalone, signals, SSR) recém-criado: rotas vazias,
sem Angular Material, sem `HttpClient`, apenas o template inicial gerado pelo CLI. O
objetivo é construir uma **Pokédex** que consome a [PokeAPI v2](https://pokeapi.co/docs/v2)
e entrega:

- Uma **lista** de Pokémon com filtros (ordenar por nome/número, **tipo (múltiplos)** e
  **raridade**) e imagens grandes e nítidas de cada Pokémon.
- Uma **tela de detalhe** ao clicar num Pokémon, mostrando o máximo de características
  possíveis (stats, habilidades, evolução, medidas, raridade, etc.) com imagens.
- UI construída com **Angular Material (M3)**, acessível (AXE / WCAG AA).

Decisões do usuário:
- **Raridade = ambos**: categorias da espécie (Normal, Bebê, Lendário, Mítico) **e** faixa
  derivada de `capture_rate` (Comum, Incomum, Raro, Muito Raro).
- **Escopo**: todos os ~1302 Pokémon, com paginação e cache.
- **Idioma da UI**: Português (BR). Identificadores no código em inglês; dados de nome/
  descrição vêm da API em inglês (a PokeAPI não tem texto em PT-BR).
- **Filtro de tipo**: múltiplos tipos simultâneos.

---

## Fase 0 — Skills & convenções (obrigatório ANTES de codar)

O `AGENTS.md` manda **acionar a skill relevante antes de escrever ou revisar código**. Este é um
passo de execução, não uma nota de rodapé. Antes de qualquer arquivo:

1. **Ler os `SKILL.md`** das áreas tocadas e seguir suas regras:
   - `folder-structure-angular` — layout `core`/`shared`/`features`, co-localização, rotas lazy.
   - `http-angular` — **toda** integração REST em `src/app/services/http/http-<nome>/` com DTOs
     `@NoNull()` (`create()/createArray()`, mapeamento explícito de aninhados), `mock.service` e
     specs (DTO null-safety + `HttpTestingController` com casos de erro). Validar/vendorizar o
     decorator `@NoNull()` em `src/app/_decorators/class.decorator.ts`.
   - `angular-material` — abrir `references/components/component-*.md` p/ confirmar a API da versão.
   - `vitest-testing` — `vi` para mocks, AAA, um comportamento por teste, HTTP como integração.
2. **`context7` (`ctx7`)** — confirmar padrões atuais de Angular v22 `HttpClient`/testing antes do
   módulo HTTP (`ctx7 library angular …` → `ctx7 docs <id> …`, máx. 3 chamadas).
3. **Revisão antes de fechar** — passada `code-smell` + `code-standards-en` (identificadores em
   inglês, verbo-first, params como objeto, CQS, early returns, limites de tamanho).
4. **Gate de verificação** — `ng build` **+ `ng lint` +** `ng test` (todos verdes).

---

## Estratégia de dados (a parte crítica de performance)

A PokeAPI lista Pokémon (`/pokemon?limit=...`) sem tipos nem raridade. Em vez de fazer
1 fetch por Pokémon, exploramos endpoints agregados:

1. **Índice (1 request)**: `GET /pokemon?limit=100000&offset=0` → `[{name, url}]`. O `id`
   sai da URL. Fonte da verdade para nome + ordenação.
2. **Índice de tipos (18 requests, em paralelo)**: `GET /type/{name}` para os 18 tipos →
   cada um devolve **todos** os Pokémon daquele tipo. Isso constrói um mapa
   `id -> tipos[]` para o dataset inteiro **sem fetch por Pokémon**. Com isso, os filtros
   de tipo (múltiplo, AND), as *chips* de tipo nos cards e a cor por tipo ficam 100%
   client-side e instantâneos. (~19 requests cobrem quase todo o app.)
3. **Imagem do card (0 requests)**: derivada do `id` —
   `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/{id}.png`,
   com *fallback* para `.../sprites/pokemon/{id}.png`.
4. **Índice de raridade (lazy + cache)**: raridade exige `GET /pokemon-species/{id}`
   (`is_baby`, `is_legendary`, `is_mythical`, `capture_rate`) e não há endpoint em lote.
   Construímos esse índice **sob demanda**, em fila com **concorrência limitada**
   (rxjs `mergeMap`, ~10 simultâneos), com **barra de progresso** e persistência em
   `localStorage` (versionada) — custo único. O filtro/badge de raridade fica disponível
   conforme o índice preenche.
5. **Detalhe (3–4 requests)**: `GET /pokemon/{id}` + `/pokemon-species/{id}` +
   `/evolution-chain/{x}` (link vem da species).

**Cache**: serviço dedicado com `Map` em memória + `localStorage` (versionado) para
índice, índice de tipos e índice de raridade. Evita refetch entre navegações.

**Mapeamento de raridade**:
- Categoria: `is_mythical` → Mítico; `is_legendary` → Lendário; `is_baby` → Bebê; senão Normal.
- Faixa por `capture_rate` (0–255, maior = mais fácil/comum): `<=3` Muito Raro,
  `4–45` Raro, `46–120` Incomum, `>120` Comum.

---

## Arquitetura de pastas (feature-first, standalone)

```
src/app/
  _decorators/
    class.decorator.ts       # @NoNull() vendorizado (+ spec) — exigido pela skill http-angular
  services/http/http-pokeapi/   # TODA a integração REST (skill http-angular)
    http-pokeapi.service.ts     # HttpClient tipado; mapeia respostas via Dto.create()/createArray()
    http-pokeapi.service.spec.ts# HttpTestingController + casos de erro (4xx/5xx)
    http-pokeapi.mock.service.ts# mock drop-in (extends + override, retorna DTOs)
    models/                     # DTOs @NoNull() (um conceito por arquivo) + *.dto.spec.ts
    mocks/<method>/             # 200-ok.json / 4xx / 5xx por método
  core/pokedex/                 # estado/domínio (NÃO-HTTP)
    pokedex-store.service.ts # signals: índice, mapa de tipos, mapa de raridade, status
    pokemon-cache.service.ts # Map + localStorage versionado
    rarity.ts                # deriva categoria + faixa a partir da species
    sprites.ts               # monta URLs de artwork/sprite a partir do id
  shared/
    type-color.ts            # tipo -> cor (contraste AA garantido)
    type-chip/               # chip de tipo reutilizável (label PT + cor)
    stat-bar/                # barra de stat acessível (aria-valuenow/min/max)
  features/pokedex/
    pokedex.routes.ts        # rotas lazy da feature
    pokedex-list/            # página: filtros + grid de cards + paginator
    pokemon-card/            # card individual (imagem grande, nome, nº, tipos, raridade)
    pokemon-detail/          # página de detalhe
```

Arquivos de bootstrap a alterar: `src/app/app.routes.ts` (lazy → `pokedex.routes.ts`),
`src/app/app.config.ts` (`provideHttpClient(withFetch())` + `provideAnimations()` +
provider do Material), `src/app/app.routes.server.ts` (rotas da pokédex como
`RenderMode.Client` — não dá para *prerender* 1302 ids dinâmicos), `src/styles.scss` +
tema M3, e substituir o `app.html` placeholder por um `mat-toolbar` + `<router-outlet/>`.

---

## Componentes e UI (Angular Material M3)

**Setup**: `ng add @angular/material` (tema M3, tipografia, animações). Importar
`MatIconModule` (Material Symbols) e registrar tema acessível em `styles.scss`.

**`pokedex-list`** (Reactive Forms para os filtros, estado em signals + `computed`):
- `mat-toolbar` com título "Pokédex".
- Barra de filtros: `mat-form-field`+`matInput` (busca por nome, com debounce),
  `mat-select` (ordenar: Nº ↑/↓, Nome A–Z/Z–A), `mat-select multiple` ou
  `mat-chip-listbox` (tipos, múltiplos, AND), `mat-button-toggle`/`mat-select`
  (raridade: categorias + faixas). Botão "Limpar filtros".
- `computed()` aplica busca + tipos + raridade + ordenação sobre o índice; resultado
  paginado por `mat-paginator` (ex.: 24/página).
- Grid responsivo (CSS grid via `style`/classe, sem `ngStyle`/`ngClass`) de
  `pokemon-card`. Estados: `mat-progress-bar` (carregando índice/raridade),
  vazio ("nenhum Pokémon encontrado"), erro (`MatSnackBar` + botão tentar de novo).
- Sincronizar filtros/página com query params para deep-link e voltar do detalhe.

**`pokemon-card`** (`input()` do resumo; template inline):
- `mat-card` clicável → navega para `/pokedex/:id`. Imagem grande via `NgOptimizedImage`
  (width/height + `alt` com o nome). Nº (#0001), nome capitalizado, `type-chip`s e badge
  de raridade. `loading="lazy"`, foco/teclado acessível (card é link/botão real).

**`pokemon-detail`** (rota com `:id`; usa `resource()`/`rxResource` ou `httpResource`):
- Cabeçalho: artwork grande, nº, nome, *genus*, `type-chip`s, badges de raridade.
- Stats base com `stat-bar` (HP, Atk, Def, SpA, SpD, Spd + total).
- Medidas (altura/peso), base experience, habilidades (com flag "oculta"),
  growth rate, base happiness, capture rate (+ faixa), habitat, egg groups.
- Texto de *flavor* (EN) da species.
- **Cadeia de evolução** com imagens e links navegáveis entre formas.
- Galeria de sprites (front/back/shiny) e **áudio do cry** (`cries.latest`, `<audio>`
  com controles e label).
- Lista de *moves* em `mat-expansion-panel` (lazy, pode ser longa).
- `mat-progress-spinner` no load, tratamento de id inválido (404 → mensagem + voltar).

---

## Acessibilidade (obrigatório: AXE / WCAG AA)

- `type-color.ts` define cor de fundo **e** cor de texto com contraste ≥ 4.5:1 por tipo.
- Toda imagem com `alt` descritivo; `NgOptimizedImage` com `width`/`height` (sem CLS).
- Cards são elementos interativos reais (link/botão) com foco visível e navegação por teclado.
- `stat-bar` com `role="progressbar"` + `aria-valuenow/min/max` e rótulo textual.
- Filtros com `<label>`/`aria-label`; `mat-paginator` com labels em PT.
- Gerenciar foco ao navegar lista ↔ detalhe; região de status `aria-live` para
  carregamento/erros.

---

## Testes (Vitest)

- `sprites.ts`: monta URL correta e *fallback*.
- `rarity.ts`: categoria e faixa a partir de species mockada (limites 3/45/120).
- Lógica de filtro/ordenação (tipos múltiplos AND, busca, sort) — funções puras testáveis.
- `pokeapi.service`: `provideHttpClient` + `provideHttpClientTesting`, asserts de URL e
  mapeamento de payload.
- Smoke tests de `pokedex-list` e `pokemon-detail` (render + estados de loading/erro).
- Usar fakes/mocks com `vi`, padrão Arrange–Act–Assert (skill `vitest-testing`).

---

## Verificação end-to-end

1. `ng build` — sem erros (rodar ao final, conforme skill angular-developer).
2. `ng lint` — sem erros (gate exigido pelo AGENTS.md).
3. `npm test` (Vitest) — verde.
4. `ng serve` e validar manualmente:
   - Lista carrega com imagens; ordenar por nº/nome funciona.
   - Filtrar por 1 e por múltiplos tipos (AND) reduz corretamente.
   - Filtro de raridade mostra progresso na 1ª vez e depois filtra (Lendário/Mítico/Bebê
     e faixas por capture_rate).
   - Clicar num card abre o detalhe com stats, evolução, sprites e cry.
   - Voltar preserva filtros/página (query params).
4. Rodar AXE (DevTools/extensão) na lista e no detalhe — zero violações; checar contraste
   das chips de tipo e foco por teclado.

---

## Notas / convenções do repositório

- Standalone + signals + `inject()`; `input()`/`output()`; controle de fluxo nativo
  (`@if`/`@for`/`@switch`); `class`/`style` bindings (nunca `ngClass`/`ngStyle`);
  sem `NgModule`; sem `standalone: true` no decorator.
- Integração HTTP isolada em `services/http/http-pokeapi/` com DTOs `@NoNull()` e factories
  `create()/createArray()` (skill `http-angular`); estado/helpers de domínio ficam em
  `core/pokedex/` (skill `folder-structure-angular`).
- Consultar a skill `angular-material` para componentes/tema M3 e a `angular-developer`
  para `resource()`/forms/SSR antes de implementar cada parte.
