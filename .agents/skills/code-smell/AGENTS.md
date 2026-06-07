# Code Smell — Guia para Agentes

> Este documento é otimizado para agentes/LLMs que precisam aplicar a skill `code-smell`
> ao revisar ou refatorar código TypeScript/JavaScript. Humanos também podem usar.

## Quando ativar esta skill

Ative `code-smell` quando o usuário pedir para:

- Revisar um arquivo, PR ou módulo TS/JS.
- Refatorar código existente.
- Apontar problemas de design ou de manutenção em código.
- Sugerir melhorias guiadas por Clean Code / SOLID.
- Explicar por que um trecho de código "cheira mal".

**Não ative** esta skill para tarefas puramente sintáticas (formatação, lint automático) ou
diagnósticos de runtime (bugs, performance instrumentada).

## Estrutura do catálogo

| Arquivo | Categoria | Qtd smells | Tema |
| --- | --- | --- | --- |
| `references/bloaters.md` | Bloaters | 9 | Código, métodos ou classes que cresceram a ponto de serem difíceis de trabalhar. |
| `references/change-preventers.md` | Change Preventers | 6 | Smells que fazem com que uma única mudança força modificações em muitos pontos do código. |
| `references/couplers.md` | Couplers | 7 | Smells que indicam acoplamento excessivo entre classes/módulos. |
| `references/dispensables.md` | Dispensables | 10 | Código desnecessário, redundante ou que pode ser removido sem prejuízo. |
| `references/object-orientation-abusers.md` | Object-Orientation Abusers | 13 | Aplicação incompleta ou incorreta dos princípios de orientação a objetos. |
| `references/naming-and-readability.md` | Naming & Readability | 9 | Nomes confusos, comentários ruins e formatação inconsistente que prejudicam a leitura do código. |
| `references/constants-and-magic-values.md` | Constants & Magic Values | 7 | Valores literais espalhados pelo código ou constantes mal gerenciadas. |
| `references/side-effects-and-state.md` | Side Effects & State | 4 | Funções/métodos que modificam estado inesperado ou expõem detalhes internos. |
| `references/error-handling.md` | Error Handling | 8 | Tratamento de erros excessivo, ausente, escondido ou inadequado. |
| `references/architecture-and-layering.md` | Architecture & Layering | 11 | Smells em nível de arquitetura, camadas, dependências e separação de responsabilidades. |
| `references/performance-and-resources.md` | Performance & Resources | 8 | Smells relacionados a desempenho, alocação de recursos e concorrência. |
| `references/testing-and-observability.md` | Testing & Observability | 2 | Falhas de cobertura de teste e ruído excessivo de logs/observabilidade. |

Total: **94 smells**. Veja `references/_index.md` para o índice alfabético com
descrição curta e link direto para cada smell.

## Regras de aplicação ao revisar código

Estas regras são obrigatórias ao aplicar a skill:

1. **Leia o código alvo** e procure padrões correspondentes aos smells deste catálogo.
2. **Cite o smell pelo nome em inglês** (como no catálogo) ao reportar o problema —
   o vocabulário consagrado ajuda o usuário a pesquisar e discutir.
3. **Aponte a categoria** para contextualizar a severidade:
   - _Bloaters_ e _Change Preventers_ tendem a ser críticos para manutenção.
   - _Couplers_ afetam testabilidade.
   - _Dispensables_ são geralmente seguros de remover.
   - _Naming & Readability_ tem alto impacto na produtividade do time.
4. **Mostre o antes e o depois.** Reporte um smell por achado, com o trecho problemático e a
   refatoração proposta, usando o exemplo "solução" do catálogo como base. Adapte ao contexto —
   não copie cego: o catálogo mostra **melhorias**, não verdades absolutas.
5. **Preserve o comportamento.** Garanta que a refatoração não altera o que o código faz; valide
   com testes, type-check e lint.
6. **Justifique pelo princípio** SOLID ou Clean Code aplicável sempre que relevante.

## Diretrizes de comunicação

- Prefira português ao reportar para o usuário (o catálogo é em PT-BR).
- Mantenha o **nome do smell em inglês** (Long Method, Boolean Trap, etc.).
- Cite o arquivo do catálogo, ex.: `references/bloaters.md#long-method-god-function`.
- Quando houver múltiplos smells em um trecho, priorize o que tem maior impacto na
  manutenção (bloaters/change-preventers > couplers > dispensables > naming).

## Trade-offs e contraindicações

O artigo original lembra que **as soluções propostas são apenas melhorias**. Algumas
contraindicações importantes:

- **Speculative Generality**: a recomendação contrária — abstrair antecipadamente —
  também é um smell. Refatore para abstrações apenas quando o segundo/terceiro caso
  concreto aparecer.
- **Switch Statements**: em código frio (não-hot-path) com pouca probabilidade de novos
  casos, um `switch` simples é mais legível do que uma hierarquia de strategies.
- **Primitive Obsession**: para valores efêmeros e locais, primitivos são adequados —
  o smell ocorre quando o valor primitivo carrega semântica de domínio reusada em
  vários lugares.
- **Magic Numbers/Strings**: constantes só agregam valor quando há reuso ou quando o
  número carrega um significado de domínio. `array[0]` não é um magic number.

Sempre confirme com o usuário antes de aplicar uma refatoração grande em código existente.

## Referências externas usadas no catálogo

- Martin Fowler — [_Refactoring: Improving the Design of Existing Code_](https://martinfowler.com/books/refactoring.html)
- Robert C. Martin — _Clean Code: A Handbook of Agile Software Craftsmanship_
- Rodrigo Branas — [Curso de Clean Code e Clean Architecture](https://branas.io)
- Refactoring Guru — [Code Smells](https://refactoring.guru/refactoring/smells)
- Artigo-base: Gilvam Mourão — [_Code Smell_](https://medium.com/@gilvam/code-smell-a6b42538f754)
