
You are an expert in TypeScript, Angular, and scalable web application development. You write functional, maintainable, performant, and accessible code following Angular and TypeScript best practices.

## TypeScript Best Practices

- Use strict type checking
- Prefer type inference when the type is obvious
- Avoid the `any` type; use `unknown` when type is uncertain

## Angular Best Practices

- Always use standalone components over NgModules
- Must NOT set `standalone: true` inside Angular decorators. It's the default in Angular v20+.
- Use signals for state management
- Implement lazy loading for feature routes
- Do NOT use the `@HostBinding` and `@HostListener` decorators. Put host bindings inside the `host` object of the `@Component` or `@Directive` decorator instead
- Use `NgOptimizedImage` for all static images.
  - `NgOptimizedImage` does not work for inline base64 images.

## Accessibility Requirements

- It MUST pass all AXE checks.
- It MUST follow all WCAG AA minimums, including focus management, color contrast, and ARIA attributes.

### Components

- Keep components small and focused on a single responsibility
- Use `input()` and `output()` functions instead of decorators
- Use `computed()` for derived state
- Prefer inline templates for small components
- Prefer Reactive forms instead of Template-driven ones
- Do NOT use `ngClass`, use `class` bindings instead
- Do NOT use `ngStyle`, use `style` bindings instead
- When using external templates/styles, use paths relative to the component TS file.

## State Management

- Use signals for local component state
- Use `computed()` for derived state
- Keep state transformations pure and predictable
- Do NOT use `mutate` on signals, use `update` or `set` instead

## Templates

- Keep templates simple and avoid complex logic
- Use native control flow (`@if`, `@for`, `@switch`) instead of `*ngIf`, `*ngFor`, `*ngSwitch`
- Use the async pipe to handle observables
- Do not assume globals like (`new Date()`) are available.

## Services

- Design services around a single responsibility
- Use the `providedIn: 'root'` option for singleton services
- Use the `inject()` function instead of constructor injection

## Resumo das skills

| Skill                        | O que faz                                                                                                                                                                                                                                                                       | Quando usar                                                                                                                                                                                                                          |
|------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **angular-developer**        | Gera código Angular e orienta arquitetura em toda a stack: componentes, reatividade (signals, `linkedSignal`, `resource`, `effect`), forms (signal/reactive/template), DI, routing, SSR/rendering, acessibilidade (Angular Aria), animações, estilização (component styles + Tailwind), testes e CLI/migrações. Roda `ng build` ao final. | Ao **criar projeto/componente/serviço** ou para best practices amplas (DI, routing/guards, SSR, ARIA, animações, CLI, migrations). Para regras específicas da casa: layout → `angular-folder-structure`, HTTP → `angular-http`, padrões de componente/TS → `angular-patterns`/`typescript-patterns`. |
| **angular-folder-structure** | Estrutura a árvore de pastas Angular: organização por feature sob `src/app` com camadas `core`/`_shared`/`features`, standalone, arquivos co-localizados, rotas lazy, **componentes de rota em `pages/`** e nomes com hífen. Consulta Angular CLI MCP → `ctx7`.                    | Ao **iniciar ou organizar** projeto/feature e decidir onde um arquivo vive (`core`/`_shared`/`features`); todo componente de rota em `pages/`. Em projeto existente, espelhe a convenção. Módulos HTTP → `angular-http`; padrões de componente → `angular-patterns`. |
| **angular-http**             | Cria módulos de integração HTTP padronizados em `services/http` colocado **o mais próximo do consumidor** (na feature que usa, ou na raiz se app-wide/único): serviços `HttpClient` tipados, DTOs com `@NoNull()` e `create()/createArray()`, mock service e testes. Consulta via `ctx7`.                                                                                     | Ao **criar ou padronizar** qualquer chamada REST: módulo em `services/http/http-<nome>/` com DTOs `@NoNull()` (`create()/createArray()`), mock service e specs. Não usar para lógica de UI (veja `angular-patterns`).                  |
| **angular-patterns**         | Boas práticas de Angular moderno (componentes/templates/reatividade/forms): standalone com 3 arquivos (`.ts`/`.html`/`.css`), signals p/ estado e RxJS p/ streams (async/await só one-shot), OnPush/zoneless, control flow nativo (`@if`/`@for`/`@switch`), `inject()`, forms reativos tipados. Consulta Angular CLI MCP → `ctx7`. | Ao **escrever ou revisar** componentes/diretivas/pipes, modelar estado (signals vs RxJS vs async/await), escolher construtos de template ou montar forms. Não usar para layout de pastas (`angular-folder-structure`) nem HTTP (`angular-http`). |
| **code-smell**               | Catálogo de 94 code smells em TypeScript/JS em 12 categorias, com exemplo "antes/depois" e refatoração.                                                                                                                                                                          | Ao **escrever ou revisar** código novo/refatoração: cite o smell pelo nome em inglês e justifique por SOLID/Clean Code. Não serve para detectar bugs funcionais.                                                                      |
| **code-standards-en**        | Padrões de código: identificadores em inglês, casing, funções iniciadas por verbo, parâmetros como objeto, CQS, early returns, limites de tamanho de método/classe, comentários mínimos.                                                                                          | Ao **nomear ou estruturar** funções/classes e revisar PRs: identificadores em inglês, verbo-first, params como objeto, CQS, early returns, limites de tamanho. Não usar quando a política exigir nomes localizados.                   |
| **context7**                 | Recupera documentação técnica atualizada e exemplos de código de qualquer tecnologia via CLI `ctx7`.                                                                                                                                                                             | Ao **consultar** docs/API de qualquer lib antes de codar: `ctx7 library <nome>` → `ctx7 docs <id>`. Máx. 3 chamadas; em quota, caia para os links oficiais e avise.                                                                   |
| **typescript-patterns**      | Padrões TypeScript da casa: arquivos kebab-case espelhando o símbolo, uma declaração por arquivo com sufixo (`.model.ts`/`.interface.ts`/`.enum.ts`), classes p/ modelos de domínio com `new`, interfaces com prefixo `I`, enums p/ conjuntos fechados, chaves em todo `if`, métodos de iteração de array em vez de loops, `.at()` no lugar de `[]`, teste por unidade. Consulta via `ctx7`. | Ao **escrever ou revisar** TypeScript, nomear arquivos/tipos ou modelar dados. Defere casing → `code-standards-en`, layout Angular → `angular-folder-structure`, DTOs HTTP → `angular-http`.                                          |
| **typescript-sonarqube**     | Revisa TypeScript/JS contra as regras SonarQube/SonarJS e roda análise estática estilo SonarQube localmente (via `eslint-plugin-sonarjs`, sem servidor). Reporta achados como `file:line — Sxxxx [Bug \| Code Smell \| Vulnerability \| Security Hotspot]` com correção concreta. Referências separadas para regras, segurança, taxonomia e setup de tooling.                                                                | Em **toda escrita/edição/refatoração** de `.ts`/`.tsx`/`.js`/`.jsx` e antes de commit/PR, ou quando pedirem revisão "Sonar"/"SonarLint"/"SonarJS". Dois escopos: projeto inteiro ou só código novo/alterado (default: código alterado, via `git diff`).                                              |
| **vitest-testing**           | Orienta testes unitários e de integração com Vitest: mocks com `vi`, Arrange–Act–Assert, fake timers para `Date`, testes de endpoint HTTP sem supertest, com cobertura por caso de uso e domínio.                                                                                                                          | Ao **escrever ou refatorar** testes: mocks com `vi`, Arrange–Act–Assert, um comportamento por teste, fake timers para `Date`, HTTP como integração. Não usar em projetos Jest/Sinon.                                                  |

## Skills declaradas

As skills instaladas e seus hashes estão em [`skills-lock.json`](./skills-lock.json):

- `angular-developer`
- `angular-folder-structure`
- `angular-http`
- `angular-patterns`
- `code-smell`
- `code-standards-en`
- `context7`
- `typescript-patterns`
- `typescript-sonarqube`
- `vitest-testing`

Cada skill vive em `.agents/skills/<nome>/SKILL.md`, com material de apoio em `references/`.
