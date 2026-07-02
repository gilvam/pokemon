# PokeAPI offline mirror

Cópia local **idêntica** da [PokeAPI v2](https://pokeapi.co/api/v2) — todos os
endpoints JSON, todas as imagens/gifs e os áudios (cries) — para rodar o app **sem
internet**. Os dados vêm dos repositórios oficiais
([`api-data`](https://github.com/PokeAPI/api-data),
[`sprites`](https://github.com/PokeAPI/sprites),
[`cries`](https://github.com/PokeAPI/cries)).

As respostas são **fiéis ao upstream**: mesmos campos, mesma paginação, mesma resolução
por nome ou id. A única diferença é que as URLs de imagem/áudio são reescritas para
`/media/...` (servidas localmente). Para o schema completo de cada recurso, use a
[documentação oficial](https://pokeapi.co/docs/v2) como referência dos campos.

---

## Sumário

- [1. Baixar o mirror](#1-baixar-o-mirror-numa-máquina-com-internet)
- [2. Servir offline](#2-servir-offline) — as 3 formas de subir a API
- [3. Como consumir a API](#3-como-consumir-a-api) — raiz, paginação, id/nome, subrecursos, mídia, CORS
- [4. Referência de todos os endpoints](#4-referência-de-todos-os-endpoints)
- [5. Variáveis de ambiente](#5-variáveis-de-ambiente) — inclui a latência artificial
- [Como funciona](#como-funciona) · [Arquivos](#arquivos)

---

## 1. Baixar o mirror (numa máquina COM internet)

```bash
npm run mirror:download
```

Popula a pasta **`api/`** com os dados (~2,2 GB, **fora do git** — só os dados; o código
em `api/_serve/` é versionado):

```
api/
  _serve/                                  # estes scripts (versionado, NÃO gerado)
  data/api/v2/<endpoint>/<id>/index.json   # JSON idêntico ao upstream (~525 MB)
  media/sprites/...                        # imagens e gifs (~1,66 GB)
  media/cries/...                          # áudios .ogg (~20 MB)
  index/<endpoint>.json                    # lista completa p/ paginação
  index/<endpoint>.names.json              # mapa nome -> id
```

Para usar offline, copie a pasta `api/` junto com o projeto para a máquina
de destino (ou gere um zip). O caminho pode ser sobrescrito com a variável
`POKEAPI_MIRROR_DIR`.

## 2. Servir offline

Há **três formas** de subir a API local. Em todas, os caminhos são os mesmos
(`/api/v2/...` e `/media/...`); muda só a **porta base**.

| Forma | Comando | URL base | Quando usar |
|---|---|---|---|
| **SSR completo** (recomendado) | `npm run build && npm run serve:ssr:pokemon` | `http://localhost:4000` | Um único processo serve o app Angular **+** a API **+** a mídia. Produção/demo. |
| **Standalone** (só a API) | `npm run serve:pokeapi` | `http://localhost:4001` | Só a API + mídia, sem o app. Ótimo para testar com `curl`. |
| **`ng serve`** (proxy) | `npm run serve:pokeapi` **e** `ng serve` | `http://localhost:4200` | Desenvolvimento do app: `:4200` encaminha `/api/v2` e `/media` para `:4001` via `proxy.conf.json`. |

> Os exemplos abaixo usam a porta **4001** (standalone). Para o SSR, troque por `4000`;
> via `ng serve`, por `4200`.

## 3. Como consumir a API

Só há requisições **`GET`** (e `OPTIONS` para CORS). Nada de auth, nada de rate limit.

### 3.1. Endpoint raiz — lista os endpoints

```bash
curl http://localhost:4001/api/v2/
```
```json
{ "ability": "/api/v2/ability/", "berry": "/api/v2/berry/", "...": "..." }
```

### 3.2. Listagem e paginação

`GET /api/v2/<endpoint>` devolve uma lista paginada no mesmo formato da API real, com
`?limit=` (default **20**) e `?offset=` (default **0**):

```bash
curl 'http://localhost:4001/api/v2/pokemon?limit=2&offset=0'
```
```json
{
  "count": 1351,
  "next": "/api/v2/pokemon?offset=2&limit=2",
  "previous": null,
  "results": [
    { "name": "bulbasaur", "url": "/api/v2/pokemon/1/" },
    { "name": "ivysaur",   "url": "/api/v2/pokemon/2/" }
  ]
}
```

Para puxar **tudo de uma vez**, use um `limit` grande (truque fiel ao upstream):

```bash
curl 'http://localhost:4001/api/v2/type?limit=100000'   # count == nº de results
```

### 3.3. Recurso individual — por id **ou** por nome

O segmento pode ser o **id numérico** ou o **nome** (resolvido para id pelos índices):

```bash
curl http://localhost:4001/api/v2/pokemon/25          # por id
curl http://localhost:4001/api/v2/pokemon/pikachu     # por nome (== id 25)
curl http://localhost:4001/api/v2/type/fire           # por nome
```

> Alguns endpoints **não têm nome** (só id): `characteristic`, `contest-effect`,
> `super-contest-effect`, `evolution-chain` e `machine`. Acesse-os por id —
> ex.: `curl http://localhost:4001/api/v2/evolution-chain/1`.

### 3.4. Subrecursos

`GET /api/v2/pokemon/<id|nome>/encounters` — onde/como encontrar aquele Pokémon:

```bash
curl http://localhost:4001/api/v2/pokemon/1/encounters
```
```json
[ { "location_area": { "name": "cerulean-city-area", "url": "/api/v2/location-area/281/" },
    "version_details": [ /* ... */ ] } ]
```

### 3.5. Mídia (sprites, gifs e cries)

As respostas JSON já trazem as URLs de imagem/áudio apontando para `/media/...`. Você
também pode acessá-las direto:

```bash
curl -o pikachu.png http://localhost:4001/media/sprites/pokemon/25.png
curl -o bulba.ogg   http://localhost:4001/media/cries/pokemon/latest/1.ogg
```

A árvore sob `/media/sprites/...` e `/media/cries/...` é **idêntica** à dos repositórios
oficiais `sprites`/`cries`. Arquivos são servidos como estáticos com cache de 7 dias.

### 3.6. CORS e erros

- **CORS** liberado para qualquer origem (`Access-Control-Allow-Origin: *`, métodos
  `GET, OPTIONS`); requisições `OPTIONS` respondem `204`.
- **Não encontrado** → HTTP `404` com corpo `{"detail":"Not Found"}`:

```bash
curl -i http://localhost:4001/api/v2/pokemon/nao-existe   # 404 {"detail":"Not Found"}
```

## 4. Referência de todos os endpoints

A API local serve **todos os 48 endpoints da PokeAPI v2** + um endpoint extra `meta`
(metadado do mirror, inexistente no upstream). Em cada um:
`GET /api/v2/<endpoint>` lista, `GET /api/v2/<endpoint>/<id|nome>` detalha.

### Pokémon

| Endpoint | O que retorna | Ex. |
|---|---|---|
| `pokemon` | Dados de batalha: stats, tipos, habilidades, golpes, sprites, cries. | `pikachu` / `25` |
| `pokemon-species` | Dados de Pokédex: evolução, gênero, cor, habitat, *varieties*, textos de *flavor*. | `pikachu` |
| `pokemon-form` | Formas alternativas (mega, gigantamax, regionais, etc.). | `pikachu` |
| `pokemon-color` | Cor predominante do Pokémon. | `yellow` |
| `pokemon-shape` | Formato corporal. | `quadruped` |
| `pokemon-habitat` | Habitat (cave, forest, ...). | `forest` |
| `ability` | Habilidades: efeito e Pokémon que as têm. | `static` |
| `characteristic` | Característica derivada do maior IV (**só id**). | `1` |
| `egg-group` | Grupos de ovo para criação. | `monster` |
| `gender` | Gêneros e espécies por taxa de gênero. | `female` |
| `growth-rate` | Curvas de experiência (slow, fast, ...). | `medium` |
| `nature` | Naturezas: stat ↑/↓ e sabores preferidos. | `adamant` |
| `pokeathlon-stat` | Stats do Pokéathlon. | `speed` |
| `stat` | Atributos de batalha (hp, attack, ...). | `attack` |
| `type` | Tipos e a tabela de eficácia de dano. | `fire` |

Subrecurso: `pokemon/<id|nome>/encounters` → áreas onde o Pokémon aparece.

### Moves (golpes)

| Endpoint | O que retorna | Ex. |
|---|---|---|
| `move` | Golpes: poder, precisão, PP, tipo, efeitos, classe de dano. | `tackle` |
| `move-ailment` | Condições causadas por golpes (paralysis, sleep, ...). | `paralysis` |
| `move-battle-style` | Estilo de batalha p/ IA (attack/defense). | `attack` |
| `move-category` | Categoria por efeito (damage, ailment, heal, ...). | `damage` |
| `move-damage-class` | Classe de dano (physical, special, status). | `physical` |
| `move-learn-method` | Como o golpe é aprendido (level-up, machine, egg, tutor). | `level-up` |
| `move-target` | Alvo do golpe (selected-pokemon, all-opponents, ...). | `selected-pokemon` |

### Items (itens)

| Endpoint | O que retorna | Ex. |
|---|---|---|
| `item` | Itens: custo, efeitos, sprite, categoria. | `potion` |
| `item-attribute` | Atributos do item (countable, consumable, ...). | `consumable` |
| `item-category` | Categorias de item. | `healing` |
| `item-fling-effect` | Efeito do golpe *Fling* para itens. | `badly-poison` |
| `item-pocket` | Bolsos da bag (misc, medicine, pokeballs, ...). | `medicine` |

### Berries (bagas)

| Endpoint | O que retorna | Ex. |
|---|---|---|
| `berry` | Bagas: tamanho, firmeza, sabor, crescimento, efeitos. | `cheri` |
| `berry-firmness` | Firmeza da baga (very-soft, hard, ...). | `soft` |
| `berry-flavor` | Sabores (spicy, dry, sweet, bitter, sour) e potência. | `sweet` |

### Locations (locais)

| Endpoint | O que retorna | Ex. |
|---|---|---|
| `region` | Regiões (kanto, johto, ...). | `kanto` |
| `location` | Locais dos jogos (cidades, rotas). | `canalave-city` |
| `location-area` | Áreas dentro de um local, com tabelas de encontro. | `1` |
| `pal-park-area` | Áreas do Pal Park. | `forest` |

### Encounters (encontros)

| Endpoint | O que retorna | Ex. |
|---|---|---|
| `encounter-method` | Métodos de encontro (walk, surf, ...). | `walk` |
| `encounter-condition` | Condições que afetam encontros (swarm, time, ...). | `swarm` |
| `encounter-condition-value` | Valores de cada condição (swarm-yes, time-day, ...). | `swarm-yes` |

### Evolution (evolução)

| Endpoint | O que retorna | Ex. |
|---|---|---|
| `evolution-chain` | Cadeia completa de evolução (**só id**). | `1` |
| `evolution-trigger` | Gatilhos de evolução (level-up, trade, use-item, ...). | `level-up` |

### Games (jogos)

| Endpoint | O que retorna | Ex. |
|---|---|---|
| `generation` | Gerações (i, ii, ...) e o que introduziram. | `generation-i` |
| `version` | Versões dos jogos (red, blue, ...). | `red` |
| `version-group` | Grupos de versões (red-blue, ...). | `red-blue` |
| `pokedex` | Pokédexes regionais e suas entradas. | `kanto` |

### Contests (concursos)

| Endpoint | O que retorna | Ex. |
|---|---|---|
| `contest-type` | Tipos de concurso (cool, beauty, cute, smart, tough). | `cool` |
| `contest-effect` | Efeitos de golpe em concursos (**só id**). | `1` |
| `super-contest-effect` | Efeitos de super-concursos (**só id**). | `1` |

### Machines & Utility

| Endpoint | O que retorna | Ex. |
|---|---|---|
| `machine` | Relação TM/HM ↔ golpe por versão (**só id**). | `1` |
| `language` | Idiomas usados nos textos localizados. | `en` |

### Extra (exclusivo do mirror)

| Endpoint | O que retorna | Ex. |
|---|---|---|
| `meta` | Metadado de build do mirror (data de deploy, hash do commit). Aparece no índice raiz, mas a **listagem devolve `{count:0, results:[]}`** — não há recurso navegável; o conteúdo fica só no arquivo em disco. **Não existe** na PokeAPI real. | `meta/` |

## 5. Variáveis de ambiente

| Variável | Default | Onde se aplica | Para quê |
|---|---|---|---|
| `POKEAPI_PORT` | `4001` | `serve:pokeapi` | Porta do servidor standalone. |
| `PORT` | `4000` | `serve:ssr:pokemon` | Porta do servidor SSR. |
| `POKEAPI_MIRROR_DIR` | `../api` | todos | Pasta raiz do mirror (relativa ao CWD, que é a pasta do app Angular). |
| `POKEAPI_MEDIA_BASE` | `/media` | todos | Prefixo público das imagens/áudios. |
| `POKEAPI_LATENCY_MS` | `1000` | `serve:pokeapi` | **Latência artificial** por requisição (ms). Use `0` para desativar. |

### Latência artificial

O servidor standalone (`serve:pokeapi`) injeta um atraso de **1000ms** em **todas** as
requisições (API e mídia) — útil para testar *loading states* e timeouts do app. Ajuste
ou desative via `POKEAPI_LATENCY_MS`:

```bash
POKEAPI_LATENCY_MS=300 npm run serve:pokeapi   # 300ms por requisição
POKEAPI_LATENCY_MS=0   npm run serve:pokeapi   # sem atraso
```

> A latência vale apenas para o servidor standalone. O SSR (`serve:ssr:pokemon`) não a aplica.

## Como funciona

- A API é servida a partir dos arquivos estáticos de `data/api/v2`. As listas
  (`/api/v2/<endpoint>`) são paginadas dinamicamente (`?limit=&offset=`) a partir dos
  índices, então `?limit=100000` devolve tudo — fiel à API real.
- O mirror oficial é indexado **por id**; o servidor resolve **nome → id**
  (ex.: `/api/v2/type/fire`) usando os índices.
- As URLs de sprite/cry (absolutas para o GitHub) são reescritas **em tempo de
  resposta** para `/media/...`, mantendo os arquivos em disco idênticos ao upstream.

## Arquivos

Os scripts vivem em **`api/_serve/`** (versionados); os dados ficam nas demais pastas de
`api/` (geradas pelo download, fora do git).

| Arquivo (`api/_serve/`) | Papel |
|---|---|
| `download.mjs` | Baixa os 3 repositórios e gera os índices. |
| `mirror-router.mjs` | Router Express (paginação, nome→id, reescrita de mídia, CORS). |
| `mirror-router.d.mts` | Tipos do router (consumido pelo SSR em TypeScript). |
| `serve.mjs` | Servidor standalone (porta 4001, com latência artificial) para `ng serve`. |

O router também é montado no SSR em [`src/server.ts`](../../03-prompt-markdown-skills/src/server.ts).
