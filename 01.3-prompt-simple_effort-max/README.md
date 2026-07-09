# Pokédex

Pokédex em Angular que lista todos os Pokémon e permite buscar um pelo nome (ou número)
para ver seus detalhes: sprite/artwork, tipos, altura, peso, habilidades, estatísticas
base e grito. Os dados vêm da API local (mirror offline da PokeAPI) — veja
[`../api/README.md`](../api/README.md).

Opcionalmente, tenta obter a localização do usuário pelo navegador (geolocation) e
sugerir a cidade automaticamente no cabeçalho — recurso best-effort, requer internet
para o reverse geocoding e não afeta o restante do app se falhar ou for negado.

## Rodando localmente

Este app **não** funciona sozinho: ele consome a API local em `/api/v2` e `/media`,
então é preciso subir os dois processos.

1. Em um terminal, suba a API: `npm run serve:pokeapi` (porta 4001)
2. Em outro terminal, suba o app: `npm start` (porta 4200, com proxy configurado em
   `proxy.conf.json` para `/api/v2` e `/media`)
3. Caso não tenha nenhum retorno da api. baixe o mirror uma vez (numa máquina com internet): `npm run mirror:download`, finalize o processo 1 e 2 e os reinicie novamente.

Alternativamente, `npm run build && npm run serve:ssr:01-prompt-simple_02_effort-max`
sobe um único processo (porta 4000) servindo o app **e** a API mirror juntos.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
