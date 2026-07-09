# api/ — mirror offline da PokeAPI

Esta pasta guarda uma cópia local (mirror) da [PokeAPI v2](https://pokeapi.co/api/v2),
gerada a partir dos repositórios oficiais
([`api-data`](https://github.com/PokeAPI/api-data),
[`sprites`](https://github.com/PokeAPI/sprites),
[`cries`](https://github.com/PokeAPI/cries)). Ela existe para que os apps Angular deste
repositório rodem **sem internet** e sem depender da API pública.

## Estrutura

- `_serve/` — scripts versionados (`download.mjs`, `serve.mjs`, `mirror-router.mjs`) que
  baixam e servem o mirror.
- `data/`, `media/`, `index/` — dados gerados pelo download (JSON, sprites/gifs, áudios
  e índices de paginação). Ficam **fora do git** (~2,2 GB).

## Como usar

A partir de qualquer um dos projetos Angular deste repositório:

```bash
npm run mirror:download   # baixa o mirror para ../api (uma vez, numa máquina com internet)
npm run serve:pokeapi     # sobe a API local em http://localhost:4001/api/v2
```

A API local responde nos mesmos caminhos e no mesmo formato da PokeAPI real
(`/api/v2/<endpoint>` e `/api/v2/<endpoint>/<id|nome>`), com paginação via
`?limit=`/`?offset=`. Imagens, gifs e áudios ficam em `/media/...`.

## Referência completa

Todos os endpoints, variáveis de ambiente e as diferentes formas de servir (standalone,
SSR, via `ng serve` + proxy): veja [`_serve/README.md`](./_serve/README.md).
