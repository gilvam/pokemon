# Code Smell

Skill com catálogo de **94 code smells** em TypeScript/JavaScript, adaptado do artigo [_Code Smell_ de Gilvam Mourão](https://medium.com/@gilvam/code-smell-a6b42538f754).

## Estrutura

```
code-smell/
├── SKILL.md                       # Entrada principal (com frontmatter para indexação por agentes)
├── README.md                      # Este arquivo
├── AGENTS.md                      # Guia detalhado para agentes/LLMs
└── references/
    ├── _index.md                  # Índice alfabético de todos os smells
    ├── bloaters.md
    ├── change-preventers.md
    ├── couplers.md
    ├── dispensables.md
    ├── object-orientation-abusers.md
    ├── naming-and-readability.md
    ├── constants-and-magic-values.md
    ├── side-effects-and-state.md
    ├── error-handling.md
    ├── architecture-and-layering.md
    ├── performance-and-resources.md
    └── testing-and-observability.md
```

## Categorias

- [Bloaters](references/bloaters.md) — Código, métodos ou classes que cresceram a ponto de serem difíceis de trabalhar.
- [Change Preventers](references/change-preventers.md) — Smells que fazem com que uma única mudança força modificações em muitos pontos do código.
- [Couplers](references/couplers.md) — Smells que indicam acoplamento excessivo entre classes/módulos.
- [Dispensables](references/dispensables.md) — Código desnecessário, redundante ou que pode ser removido sem prejuízo.
- [Object-Orientation Abusers](references/object-orientation-abusers.md) — Aplicação incompleta ou incorreta dos princípios de orientação a objetos.
- [Naming & Readability](references/naming-and-readability.md) — Nomes confusos, comentários ruins e formatação inconsistente que prejudicam a leitura do código.
- [Constants & Magic Values](references/constants-and-magic-values.md) — Valores literais espalhados pelo código ou constantes mal gerenciadas.
- [Side Effects & State](references/side-effects-and-state.md) — Funções/métodos que modificam estado inesperado ou expõem detalhes internos.
- [Error Handling](references/error-handling.md) — Tratamento de erros excessivo, ausente, escondido ou inadequado.
- [Architecture & Layering](references/architecture-and-layering.md) — Smells em nível de arquitetura, camadas, dependências e separação de responsabilidades.
- [Performance & Resources](references/performance-and-resources.md) — Smells relacionados a desempenho, alocação de recursos e concorrência.
- [Testing & Observability](references/testing-and-observability.md) — Falhas de cobertura de teste e ruído excessivo de logs/observabilidade.

## Como usar

- **Para humanos**: comece pelo [`SKILL.md`](SKILL.md) ou pelo [índice alfabético](references/_index.md) e navegue até a categoria relevante. Cada categoria lista os smells com exemplos em TypeScript de "má prática" + "solução".
- **Para agentes/LLMs**: o `SKILL.md` é o ponto de entrada. O frontmatter (`name`/`description`) garante que a skill seja descoberta quando o agente estiver revisando ou refatorando código TS/JS.

## Conteúdo

Cada smell inclui:

1. **Descrição** do problema em português.
2. **Exemplo de má prática** em TypeScript.
3. **Refatoração sugerida** ("solução") em TypeScript.
4. Quando aplicável, observações sobre **princípios SOLID** violados (SRP, OCP, ISP etc.) e **trade-offs**.

## Créditos

- Autor original do conteúdo: [Gilvam Mourão](https://medium.com/@gilvam) — artigo [_Code Smell_](https://medium.com/@gilvam/code-smell-a6b42538f754).
- Estrutura inspirada em [pedronauck/skills](https://github.com/pedronauck/skills).
