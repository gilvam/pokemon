# Plano — Pokédex (Angular 22 + Angular Material M3 + PokeAPI v2)

## Context

O repositório é um app Angular **22** standalone com **SSR** recém-gerado pelo CLI: rotas
vazias (`app.routes.ts` → `[]`), `app.config.ts` só com `provideRouter` + hydration, sem
`HttpClient`, **sem** `@angular/material`/`@angular/cdk`, styles em **SCSS** (vazio),
**Vitest 4** disponível (`ng test` via `@angular/build:unit-test`, sem `vitest.config`
próprio), `tsconfig` **não** está em `strict: true` (mas tem vários checks Angular). Não há
nenhum código de domínio ainda.

O objetivo é construir uma **Pokédex** que consome a PokeAPI v2 com (a) lista filtrável
(ordenar nome/número, **tipo múltiplo AND**, **raridade**) com imagens grandes, (b) tela de
detalhe rica, e (c) UI em **Angular Material M3** acessível (AXE / WCAG AA). Base textual:
`.claude/prompts/prompt_26-06-06--15-55_pokedex.md`.

**Dois requisitos novos desta rodada:**
1. **Fundo de cada card colorido pelo(s) tipo(s)** — escolha do usuário: **gradiente suave
   dos 2 tipos** (versão clara/dessaturada), preservando contraste AA de texto e chips.
2. **Maximizar o uso de componentes prontos do Angular Material** em vez de UI custom.

Este plano segue as skills da casa (`angular-folder-structure`, `angular-http`,
`angular-patterns`/`angular-developer`, `typescript-patterns`, `vitest-testing`,
`code-standards-en`, `context7`) — as regras delas não são repetidas aqui, apenas aplicadas.

---

## Deliverable de planejamento (1º passo da execução)

Por convenção do usuário, ao aprovar este plano, **criar uma cópia finalizada em**
`.claude/prompts/prompt-26-06-07--21-13-pokedex.md` (mesmo conteúdo de spec deste plano,
no formato dos prompts existentes). É o primeiro arquivo a ser escrito na execução.

---

## Estratégia de dados (parte crítica de performance) — inalterada da base

1. **Índice (1 req)**: `GET /pokemon?limit=100000&offset=0` → `[{name, url}]`; `id` da URL.
   Fonte de verdade p/ nome + ordenação.
2. **Índice de tipos (18 reqs, paralelas)**: `GET /type/{name}` → mapa `id -> tipos[]` do
   dataset inteiro **sem fetch por Pokémon**. Habilita filtro de tipo (múltiplo, AND), chips
   nos cards, **cor do card por tipo** e cor do detalhe — tudo client-side e instantâneo.
3. **Imagem do card (0 req)**: derivada do `id` — official-artwork
   `.../sprites/pokemon/other/official-artwork/{id}.png`, fallback `.../pokemon/{id}.png`.
4. **Índice de raridade (lazy + cache)**: `GET /pokemon-species/{id}` (`is_baby`,
   `is_legendary`, `is_mythical`, `capture_rate`) sob demanda, fila com concorrência
   limitada (`mergeMap`, ~10), barra de progresso, persistência versionada em `localStorage`.
5. **Detalhe (3–4 reqs)**: `GET /pokemon/{id}` + `/pokemon-species/{id}` +
   `/evolution-chain/{x}`.

**Cache**: serviço dedicado `Map` em memória + `localStorage` versionado (índice, tipos,
raridade). **Raridade**: categoria (`is_mythical`→Mítico, `is_legendary`→Lendário,
`is_baby`→Bebê, senão Normal) + faixa por `capture_rate` (`<=3` Muito Raro, `4–45` Raro,
`46–120` Incomum, `>120` Comum).

---

## Estrutura de arquivos (conforme `angular-folder-structure` + `angular-http`)

Como **só a feature pokedex** consome a API, o módulo HTTP fica **dentro da feature**:

```
src/app/
├─ _decorators/class.decorator.ts          # vendorizar @NoNull se ausente (necessário)
├─ app.routes.ts                           # + rota lazy 'pokedex'
├─ app.config.ts                           # + provideHttpClient(withFetch()) + provideAnimationsAsync()
├─ app.routes.server.ts                    # rotas pokedex como RenderMode.Client (ids dinâmicos)
├─ app.ts / app.html                       # mat-toolbar + <router-outlet/> (substitui placeholder)
└─ features/pokedex/
   ├─ pokedex.routes.ts                     # '' → PokedexList ; ':id' → PokedexDetail (loadComponent)
   ├─ pages/
   │  ├─ pokedex-list/  (.ts/.html/.scss/.spec.ts)
   │  └─ pokedex-detail/(.ts/.html/.scss/.spec.ts)
   ├─ components/
   │  ├─ pokemon-card/      # card colorido por tipo
   │  ├─ pokemon-filters/   # barra de filtros (forms reativos)
   │  ├─ stat-bar/          # barra de stat acessível
   │  ├─ type-chip/         # chip de tipo reutilizável
   │  └─ rarity-badge/
   ├─ services/
   │  ├─ pokedex-store.ts        # estado em signals + computed (índice, filtros, paginação)
   │  ├─ pokedex-cache.ts        # Map + localStorage versionado
   │  └─ http/http-pokeapi/      # módulo HTTP da skill angular-http
   │     ├─ http-pokeapi.service.ts (+ .spec.ts)
   │     ├─ http-pokeapi.mock.service.ts
   │     └─ models/  *.dto.ts (@NoNull, create()/createArray()) + *.enum.ts + *.dto.spec.ts
   └─ models/
      ├─ pokemon-type.enum.ts        # 18 tipos
      ├─ rarity-category.enum.ts / rarity-tier.enum.ts
      ├─ pokemon-summary.model.ts    # id, name, types[], rarity? (lista)
      └─ type-color.model.ts         # cor de fundo + texto por tipo (contraste ≥ 4.5:1)
```

DTOs (inside-out, com `@NoNull()` + factories `create()/createArray()`, mapeamento explícito
de aninhados): `pokemon.dto.ts`, `pokemon-species.dto.ts`, `evolution-chain.dto.ts`,
`type.dto.ts`, `named-resource.dto.ts`, `pokemon-list-response.dto.ts`. **Vendorizar o
decorator `@NoNull`** em `_decorators/class.decorator.ts` (não existe hoje).

> Antes do módulo HTTP, consultar `context7` (`ctx7`) p/ confirmar padrões atuais de Angular
> 22 `HttpClient`/testing (máx. 3 chamadas).

---

## Cor por tipo (requisito novo nº 1)

- `type-color.model.ts`: para cada tipo, um par **cor base** + **cor de texto** com contraste
  AA. O fundo do card usa a **versão clara/dessaturada** (ex.: mistura da cor base com a
  surface do tema, ~12–18% de saturação) para o texto/chips Material continuarem legíveis.
- **Card com 1 tipo** → gradiente suave da mesma cor (variação clara→levemente mais saturada).
- **Card com 2 tipos** → `linear-gradient` suave entre as duas cores claras dos tipos.
- Aplicado via **`style` binding** (`background`) calculado por `computed()` no `pokemon-card`
  a partir de `input()` do resumo — nunca `ngStyle`.
- Mesma paleta reaproveitada no cabeçalho do **detalhe** e nos `type-chip`.
- **Gate de acessibilidade**: a escolha "suave/dessaturada" mantém AA; validar no AXE e por
  cálculo de contraste no `type-color` (teste unitário do par cor-fundo/cor-texto).

---

## Componentes e UI — **maximizar Angular Material M3** (requisito novo nº 2)

**Setup**: `ng add @angular/material` (tema M3 + tipografia + animações). Registrar
`MatIconModule` (Material Symbols). Preferir SEMPRE o componente Material pronto a UI custom.

| Necessidade | Componente Material pronto |
|---|---|
| App bar / título | `mat-toolbar` |
| Card do Pokémon | `mat-card` (clicável, `routerLink`) |
| Imagem | `mat-card-image` + `NgOptimizedImage` |
| Chips de tipo | `mat-chip-set` / `mat-chip` (display) e `mat-chip-listbox` (filtro multi) |
| Busca por nome | `mat-form-field` + `matInput` (debounce) |
| Ordenar | `mat-select` |
| Filtro de tipo (multi, AND) | `mat-chip-listbox multiple` ou `mat-select multiple` |
| Filtro de raridade | `mat-button-toggle-group` / `mat-select` |
| Paginação | `mat-paginator` (labels PT) |
| Loading índice/raridade | `mat-progress-bar` |
| Loading detalhe | `mat-progress-spinner` |
| Erros / retry | `MatSnackBar` |
| Badge de raridade | `matBadge` / `mat-chip` |
| Stats no detalhe | `mat-progress-bar` (determinate) dentro do `stat-bar` (role progressbar) |
| Moves longos | `mat-expansion-panel` (lazy) |
| Tabela de atributos | `mat-list` / `mat-table` |
| Botões/voltar | `mat-button` / `mat-icon-button` |
| Galeria de sprites / tabs | `mat-tab-group` ou `mat-button-toggle` |
| Tooltips | `matTooltip` |

**`pokedex-list`** (forms reativos p/ filtros; estado em signals + `computed` no
`pokedex-store`): toolbar, barra `pokemon-filters`, grid responsivo (CSS grid via `class`)
de `pokemon-card`, estados loading/vazio/erro, **sincronizar filtros+página com query params**
(deep-link e voltar do detalhe preserva estado).

**`pokemon-card`** (`input()` do resumo, template inline pequeno): `mat-card` clicável →
`/pokedex/:id`; **fundo gradiente por tipo**; imagem grande (`NgOptimizedImage`, width/height,
`alt`=nome, `loading="lazy"`); nº `#0001`, nome capitalizado, `type-chip`s, badge de raridade;
card é link/botão real (foco/teclado).

**`pokemon-detail`** (rota `:id`, dados via `resource()`/`httpResource`): cabeçalho com artwork,
nº, nome, genus, chips de tipo, badges de raridade (fundo na paleta do tipo); `stat-bar` p/ HP
/Atk/Def/SpA/SpD/Spd + total; medidas, base XP, habilidades (flag "oculta"), growth rate, base
happiness, capture rate (+faixa), habitat, egg groups; flavor text (EN); **cadeia de evolução**
com imagens e links navegáveis; galeria de sprites (front/back/shiny) + **áudio do cry**
(`cries.latest`, `<audio>` com controles e label); moves em `mat-expansion-panel`; tratamento
de id inválido (404 → mensagem + voltar).

---

## Acessibilidade (AXE / WCAG AA)

- `type-color` garante contraste ≥ 4.5:1 (fundo suave + texto). Toda imagem com `alt` +
  width/height (sem CLS). Cards são link/botão real com foco visível e teclado. `stat-bar`
  com `role="progressbar"` + `aria-valuenow/min/max` + rótulo. Filtros com `<label>`/`aria-label`;
  `mat-paginator` em PT. Foco gerenciado lista ↔ detalhe; região `aria-live` p/ loading/erros.

---

## Testes (Vitest — `vi`, AAA, um comportamento por teste)

- `type-color`: par cor-fundo/cor-texto respeita contraste AA (1 e 2 tipos / gradiente).
- `sprites`: URL correta + fallback. `rarity`: categoria e faixa (limites 3/45/120, species mock).
- Lógica de filtro/ordenação (tipos múltiplos AND, busca, sort) — funções puras.
- `http-pokeapi.service`: `provideHttpClient` + testing, asserts de URL e mapeamento DTO; DTOs
  com null-safety (`create()/createArray()`). Mock service.
- Smoke tests de `pokedex-list` e `pokemon-detail` (render + estados loading/erro).

---

## Critical files a tocar/criar

- `src/app/app.config.ts` — `provideHttpClient(withFetch())` + `provideAnimationsAsync()`.
- `src/app/app.routes.ts` — rota lazy `pokedex` → `features/pokedex/pokedex.routes.ts`.
- `src/app/app.routes.server.ts` — pokedex como `RenderMode.Client` (1302 ids dinâmicos não
  prerenderizam).
- `src/app/app.ts` + `src/app/app.html` — `mat-toolbar` + `<router-outlet/>` (remover placeholder).
- `src/styles.scss` — tema M3 + tokens.
- `src/app/_decorators/class.decorator.ts` — **novo** (`@NoNull`).
- Toda a árvore `src/app/features/pokedex/**` (acima).
- `.claude/prompts/prompt-26-06-07--21-13-pokedex.md` — **novo** (spec finalizada, 1º passo).

---

## Verificação end-to-end

1. `ng build` — sem erros. 2. `ng lint` — sem erros. 3. `npm test` (Vitest) — verde.
4. `ng serve` e validar manual:
   - Lista carrega com imagens; **cada card com fundo na cor do(s) tipo(s)**; ordenar nº/nome.
   - Filtrar por 1 e múltiplos tipos (AND) reduz corretamente.
   - Filtro de raridade mostra progresso na 1ª vez e depois filtra (Lendário/Mítico/Bebê + faixas).
   - Clicar abre detalhe (stats, evolução, sprites, cry). Voltar preserva filtros/página (query params).
5. AXE (DevTools) na lista e no detalhe — **zero violações**; conferir contraste dos fundos
   coloridos dos cards, das chips de tipo, e foco por teclado.
