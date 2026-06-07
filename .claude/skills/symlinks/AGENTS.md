# Symlinks — Guia para Agentes

> Este documento é otimizado para agentes/LLMs que precisam aplicar a skill
> `symlinks` para expor `.agents/skills` em outras pastas de agentes.

## Quando ativar esta skill

Ative `symlinks` quando o usuário pedir para:

- mensionar o `.agents/skills/symlink`.
- Sincronizar skills entre múltiplas ferramentas de IA.
- Fazer `.claude/skills` ou `.devin/skills` apontarem para `.agents/skills`.
- Reparar ou verificar links simbólicos dessas pastas.
- Evitar cópia manual de skills entre diretórios.

## Alvos padrão

| Papel | Caminho |
| --- | --- |
| Origem canônica | `.agents/skills` |
| Claude | `.claude/skills` |
| Devin | `.devin/skills` |

## Procedimento operacional

1. Detecte a raiz do projeto. Use o diretório atual se o usuário não indicar outro.
2. Verifique se `.agents/skills` existe e é diretório.
3. Liste o estado atual dos destinos antes de editar:
   - ausente;
   - link correto para `.agents/skills`;
   - link quebrado;
   - link para outro destino;
   - arquivo ou diretório real.
4. Crie diretórios pais ausentes.
5. Crie links apenas para destinos ausentes.
6. Não altere destinos que já estão corretos.
7. Pare em conflitos e peça confirmação antes de substituir qualquer coisa.
8. Valide que cada link resolve para a origem canônica.

## Escolha de comando

Use comandos nativos do sistema operacional.

No Windows PowerShell:

```powershell
New-Item -ItemType SymbolicLink -Path ".claude/skills" -Target ".agents/skills"
```

Se symlink falhar por permissão, peça autorização para usar junction:

```powershell
New-Item -ItemType Junction -Path ".claude/skills" -Target ".agents/skills"
```

Em macOS/Linux/POSIX:

```bash
ln -s ../.agents/skills .claude/skills
```

Repita para `.devin/skills`.

## Diretrizes de comunicação

- Reporte os resultados por destino.
- Diferencie "criado", "já correto" e "bloqueado por conflito".
- Explique quando for necessário pedir aprovação para substituir algo.
- Não chame cópia de sincronização; nesta skill, sincronizar significa apontar por link para a mesma origem.

## Contraindicações

Não use esta skill para:

- Copiar ou mover o conteúdo de `.agents/skills`.
- Apagar pastas de skills sem autorização explícita.
- Criar uma segunda origem canônica.
