# Symlinks

Skill para criar links simbólicos de `.agents/skills` para pastas de skills usadas por outras ferramentas de IA.

## Estrutura

```text
symlinks/
├── SKILL.md    # Entrada principal com frontmatter para indexação por agentes
├── README.md   # Este arquivo
└── AGENTS.md   # Guia detalhado para agentes/LLMs
```

## Objetivo

Manter `.agents/skills` como fonte única das skills e expor essa mesma pasta em:

```text
.claude/skills
.devin/skills
```

Isso evita duplicação de arquivos e mantém todas as ferramentas lendo o mesmo conjunto de skills.

## Como usar

- **Para humanos**: comece pelo [`SKILL.md`](SKILL.md) para entender o fluxo e os comandos por sistema operacional.
- **Para agentes/LLMs**: use [`AGENTS.md`](AGENTS.md) para seguir as regras de ativação, segurança e validação.

## Observações

- A skill orienta a criação de links; ela não contém scripts executáveis.
- Conflitos devem ser reportados antes de qualquer substituição.
