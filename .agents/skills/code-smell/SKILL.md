---
name: code-smell
description: Catálogo de code smells em TypeScript com 94 smells organizados por categoria (Bloaters, Couplers, Dispensables, etc.). Use esta skill ao revisar, refatorar ou escrever código TypeScript/JavaScript para identificar problemas de design, sugerir refatorações e justificar mudanças com base em princípios SOLID e Clean Code. Baseado no artigo de Gilvam Mourão.
allowed-tools: Read, Grep, Glob
---

# Code Smell — Catálogo de Refatoração em TypeScript

Guia de referência com **94 code smells** identificados em código TypeScript/JavaScript, organizados em 12 categorias, com exemplos de "má prática" e a refatoração correspondente. Adaptado do artigo [_Code Smell_ de Gilvam Mourão](https://medium.com/@gilvam/code-smell-a6b42538f754).

## O que é um Code Smell?

Code smell é um sintoma no código-fonte que pode indicar problemas mais profundos. Não é um bug em si, mas sugere que o código tem baixa qualidade ou problemas potenciais de manutenção e evolução. Code smells são pistas de que o design ou a implementação precisa ser revista ou refatorada.

> _Mesmo sem afetar o funcionamento imediato, podem causar problemas de desempenho, leitura e futuros bugs._ — Branas Rodrigo (2023)

## Quando aplicar esta skill

Use esta skill quando você for:

- **Revisar código** TypeScript/JavaScript (PRs, code review, auditoria) e precisar identificar problemas de design.
- **Refatorar** módulos legados e precisar de um vocabulário comum para discutir e priorizar mudanças.
- **Escrever código novo** e quiser evitar armadilhas conhecidas (boolean trap, magic numbers, long parameter list, etc.).
- **Justificar uma refatoração** com base em princípios consagrados (SOLID, Clean Code, Refactoring de Fowler).
- **Ensinar/onboardar** desenvolvedores que estão aprendendo Clean Code e padrões de projeto.

Não use esta skill para:

- Detectar bugs funcionais (use testes, type-checker e linters para isso).
- Aplicar regras de estilo automaticamente (use ESLint, Prettier, Biome).
- Avaliar performance objetivamente (use profiling, benchmarks).

## Fluxo recomendado

1. **Identifique o smell**: percorra o [índice alfabético](references/_index.md) ou navegue por categoria abaixo.
2. **Confirme o diagnóstico**: leia a descrição do smell e compare com o exemplo "má prática".
3. **Aplique a refatoração**: siga o exemplo "solução". Adapte ao contexto — as soluções são **melhorias**, não verdades absolutas.
4. **Valide**: rode testes, type-check, lint. Verifique que o comportamento foi preservado.

## Regras de aplicação

Ao usar esta skill, siga estas regras:

1. **Cite o smell pelo nome em inglês** (Long Method, Boolean Trap, …) e indique a categoria. Usar o vocabulário consagrado facilita pesquisa e discussão.
2. **Mostre o antes e o depois.** Aponte o trecho que cheira mal e proponha a refatoração equivalente — nunca apenas "isto está ruim".
3. **Preserve o comportamento.** Refatoração muda *como* o código é estruturado, não *o que* ele faz. Valide com testes, type-check e lint.
4. **Justifique pelo princípio.** Relacione cada recomendação a um princípio SOLID (SRP, OCP, LSP, ISP, DIP) ou a uma regra de Clean Code.
5. **Priorize por impacto.** Havendo vários smells no mesmo trecho, ataque primeiro os de manutenção (Bloaters, Change Preventers), depois Couplers, Dispensables e, por fim, Naming & Readability.
6. **Refatore sob demanda, não por especulação.** Só introduza abstração quando o segundo ou terceiro caso concreto aparecer — abstrair cedo demais é o smell *Speculative Generality*.
7. **Confirme antes de mudanças grandes.** Em código existente, alinhe com o usuário antes de uma refatoração ampla; as soluções do catálogo são **melhorias**, não verdades absolutas.

## Categorias

- **[Bloaters](references/bloaters.md)** — Código, métodos ou classes que cresceram a ponto de serem difíceis de trabalhar.
- **[Change Preventers](references/change-preventers.md)** — Smells que fazem com que uma única mudança força modificações em muitos pontos do código.
- **[Couplers](references/couplers.md)** — Smells que indicam acoplamento excessivo entre classes/módulos.
- **[Dispensables](references/dispensables.md)** — Código desnecessário, redundante ou que pode ser removido sem prejuízo.
- **[Object-Orientation Abusers](references/object-orientation-abusers.md)** — Aplicação incompleta ou incorreta dos princípios de orientação a objetos.
- **[Naming & Readability](references/naming-and-readability.md)** — Nomes confusos, comentários ruins e formatação inconsistente que prejudicam a leitura do código.
- **[Constants & Magic Values](references/constants-and-magic-values.md)** — Valores literais espalhados pelo código ou constantes mal gerenciadas.
- **[Side Effects & State](references/side-effects-and-state.md)** — Funções/métodos que modificam estado inesperado ou expõem detalhes internos.
- **[Error Handling](references/error-handling.md)** — Tratamento de erros excessivo, ausente, escondido ou inadequado.
- **[Architecture & Layering](references/architecture-and-layering.md)** — Smells em nível de arquitetura, camadas, dependências e separação de responsabilidades.
- **[Performance & Resources](references/performance-and-resources.md)** — Smells relacionados a desempenho, alocação de recursos e concorrência.
- **[Testing & Observability](references/testing-and-observability.md)** — Falhas de cobertura de teste e ruído excessivo de logs/observabilidade.

## Índice rápido

Veja a lista alfabética completa com link direto para cada smell em [references/_index.md](references/_index.md).

## Referências do artigo original

- [Curso de Clean Code e Clean Architecture — Rodrigo Branas](https://branas.io)
- [Refactoring — Martin Fowler](https://martinfowler.com/books/refactoring.html)
- [Code Smell — bliki de Martin Fowler](https://martinfowler.com/bliki/CodeSmell.html)
- [Refactoring Guru — Code Smells](https://refactoring.guru/refactoring/smells)
- [Clean Code JavaScript — Ryan McDermott](https://github.com/ryanmcdermott/clean-code-javascript)
- [SOLID Principles — Gilvam Mourão](https://medium.com/@gilvam/solid-6ba55001fe7f)
- Artigo original: [Code Smell — Gilvam Mourão](https://medium.com/@gilvam/code-smell-a6b42538f754)
