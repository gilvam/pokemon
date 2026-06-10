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

Arquivos de bootstrap a alterar: `src/app/app.routes.ts` (lazy → `pokedex.routes.ts`),
`src/app/app.config.ts` (`provideHttpClient(withFetch())` + `provideAnimations()` +
provider do Material), `src/app/app.routes.server.ts` (rotas da pokédex como
`RenderMode.Client` — não dá para *prerender* 1302 ids dinâmicos), `src/styles.scss` +
tema M3, e substituir o `app.html` placeholder por um `mat-toolbar` + `<router-outlet/>`.

---

## Componentes e UI (Angular Material M3)

**Setup**: `ng add @angular/material` (tema M3, tipografia, animações). Importar
`MatIconModule` (Material Symbols) e registrar tema acessível em `styles.scss`.

**`pokedex-list`**:
- `mat-toolbar` com título "Pokédex".
- Barra de filtros: `mat-form-field`+`matInput` (busca por nome, com debounce),
  `mat-select` (ordenar: Nº ↑/↓, Nome A–Z/Z–A), `mat-select multiple` ou
  `mat-chip-listbox` (tipos, múltiplos, AND), `mat-button-toggle`/`mat-select`
  (raridade: categorias + faixas). Botão "Limpar filtros".
- A filtragem aplica busca + tipos + raridade + ordenação sobre o índice; resultado
  paginado por `mat-paginator` (ex.: 24/página).
- Grid responsivo (CSS grid) de `pokemon-card`. Estados: `mat-progress-bar`
  (carregando índice/raridade), vazio ("nenhum Pokémon encontrado"), erro
  (`MatSnackBar` + botão tentar de novo).
- Sincronizar filtros/página com query params para deep-link e voltar do detalhe.

**`pokemon-card`** (recebe o resumo do Pokémon):
- `mat-card` clicável → navega para `/pokedex/:id`. Imagem grande (width/height + `alt`
  com o nome). Nº (#0001), nome capitalizado, `type-chip`s e badge de raridade.
  `loading="lazy"`, foco/teclado acessível (card é link/botão real).

**`pokemon-detail`** (rota com `:id`):
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
- Toda imagem com `alt` descritivo e `width`/`height` (sem CLS).
- Cards são elementos interativos reais (link/botão) com foco visível e navegação por teclado.
- `stat-bar` com `role="progressbar"` + `aria-valuenow/min/max` e rótulo textual.
- Filtros com `<label>`/`aria-label`; `mat-paginator` com labels em PT.
- Gerenciar foco ao navegar lista ↔ detalhe; região de status `aria-live` para
  carregamento/erros.

---

## Testes

- `sprites.ts`: monta URL correta e *fallback*.
- `rarity.ts`: categoria e faixa a partir de species mockada (limites 3/45/120).
- Lógica de filtro/ordenação (tipos múltiplos AND, busca, sort) — funções puras testáveis.
- `pokeapi.service`: asserts de URL e mapeamento de payload.
- Smoke tests de `pokedex-list` e `pokemon-detail` (render + estados de loading/erro).

---

## Verificação end-to-end

1. `ng build` — sem erros.
2. `ng lint` — sem erros.
3. `npm test` (Vitest) — verde.
4. `ng serve` e validar manualmente:
   - Lista carrega com imagens; ordenar por nº/nome funciona.
   - Filtrar por 1 e por múltiplos tipos (AND) reduz corretamente.
   - Filtro de raridade mostra progresso na 1ª vez e depois filtra (Lendário/Mítico/Bebê
     e faixas por capture_rate).
   - Clicar num card abre o detalhe com stats, evolução, sprites e cry.
   - Voltar preserva filtros/página (query params).
5. Rodar AXE (DevTools/extensão) na lista e no detalhe — zero violações; checar contraste
   das chips de tipo e foco por teclado.
