# PokeAPI offline mirror

Cópia local **idêntica** da [PokeAPI v2](https://pokeapi.co/api/v2) — todos os
endpoints JSON, todas as imagens/gifs e os áudios (cries) — para rodar o app **sem
internet**. Os dados vêm dos repositórios oficiais
([`api-data`](https://github.com/PokeAPI/api-data),
[`sprites`](https://github.com/PokeAPI/sprites),
[`cries`](https://github.com/PokeAPI/cries)).

## 1. Baixar o mirror (numa máquina COM internet)

```bash
npm run mirror:download
```

Gera a pasta **`pokeapi-mirror/`** (~2,2 GB, **fora do git**):

```
pokeapi-mirror/
  data/api/v2/<endpoint>/<id>/index.json   # JSON idêntico ao upstream (~525 MB)
  media/sprites/...                        # imagens e gifs (~1,66 GB)
  media/cries/...                          # áudios .ogg (~20 MB)
  index/<endpoint>.json                    # lista completa p/ paginação
  index/<endpoint>.names.json              # mapa nome -> id
```

Para usar offline, copie a pasta `pokeapi-mirror/` junto com o projeto para a máquina
de destino (ou gere um zip). O caminho pode ser sobrescrito com a variável
`POKEAPI_MIRROR_DIR`.

## 2. Servir offline

### Produção / app completo (recomendado) — um único processo

```bash
npm run build
npm run serve:ssr:pokemon
```

O servidor SSR em `http://localhost:4000` serve, sem nenhuma conexão externa:

- o app Angular;
- `GET /api/v2/...` (a API);
- `GET /media/sprites/...` e `GET /media/cries/...` (imagens, gifs e áudios).

### Desenvolvimento (`ng serve`)

Em dois terminais:

```bash
npm run serve:pokeapi   # API + mídia em http://localhost:4001
ng serve                # app em http://localhost:4200 (proxy p/ :4001)
```

O `proxy.conf.json` encaminha `/api/v2` e `/media` para o servidor do mirror.

## Como funciona

- A API é servida a partir dos arquivos estáticos de `data/api/v2`. As listas
  (`/api/v2/<endpoint>`) são paginadas dinamicamente (`?limit=&offset=`) a partir dos
  índices, então `?limit=100000` devolve tudo — fiel à API real.
- O mirror oficial é indexado **por id**; o servidor resolve **nome → id**
  (ex.: `/api/v2/type/fire`) usando os índices.
- As URLs de sprite/cry (absolutas para o GitHub) são reescritas **em tempo de
  resposta** para `/media/...`, mantendo os arquivos em disco idênticos ao upstream.

## Arquivos

| Arquivo | Papel |
|---|---|
| `download.mjs` | Baixa os 3 repositórios e gera os índices. |
| `mirror-router.mjs` | Router Express (paginação, nome→id, reescrita de mídia, CORS). |
| `serve.mjs` | Servidor standalone (porta 4001) para `ng serve`. |

O router também é montado no SSR em [`src/server.ts`](../../src/server.ts).
