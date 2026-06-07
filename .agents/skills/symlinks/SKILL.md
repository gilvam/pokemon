---
name: symlinks
description: Skill para criar, reparar ou verificar links simbólicos dos itens dentro de .agents/skills para pastas de skills de outros agentes locais, especialmente .claude/skills e .devin/skills. Use quando o usuário pedir para sincronizar, linkar, espelhar, compartilhar, "colar" ou expor as mesmas skills em múltiplas ferramentas de IA, independentemente do sistema operacional.
---

# Symlinks - Links de Skills entre Agentes

Crie links simbólicos para que múltiplas ferramentas de IA leiam os mesmos itens da pasta canônica de skills.

Origem canônica: `.agents/skills`.

Destinos padrão: `.claude/skills` e `.devin/skills`.

As pastas `.claude` e `.devin` devem ficar no mesmo diretório que contém `.agents`. Se `.agents` estiver na raiz do workspace, crie os destinos nessa mesma raiz, não dentro de subprojetos ou pastas filhas.

`.claude/skills` e `.devin/skills` devem ser diretórios reais, não links para `.agents/skills`. Cada item direto dentro de `.agents/skills` deve existir como link individual dentro de ambos os destinos.

## Quando aplicar esta skill

Use esta skill quando o usuário pedir para:

- Criar symlinks dos itens de `.agents/skills` para outras pastas de agentes.
- Sincronizar skills entre Codex, Claude, Devin ou outra ferramenta local.
- Fazer cada skill dentro de `.agents/skills` aparecer em `.claude/skills` e `.devin/skills`.
- Verificar se os links já existem e apontam para o lugar certo.
- Reparar links quebrados sem copiar as skills.

Não use esta skill para copiar arquivos entre pastas. A intenção é manter uma única fonte de verdade em `.agents/skills`.

## Fluxo recomendado

1. **Identifique a raiz do projeto**: localize o diretório que contém `.agents`; essa é a raiz onde os destinos também devem existir.
2. **Valide a origem**: confirme que `.agents/skills` existe e é um diretório dentro dessa raiz.
3. **Liste os itens da origem**: considere cada item direto dentro de `.agents/skills`, incluindo pastas de skills e arquivos soltos.
4. **Inspecione os destinos**: verifique `.claude/skills` e `.devin/skills` nessa mesma raiz antes de alterar qualquer coisa.
5. **Crie os diretórios ausentes**: crie `.claude/skills` e `.devin/skills` como diretórios reais ao lado de `.agents` quando necessário.
6. **Crie os links por item**: para cada item direto de `.agents/skills`, crie um link correspondente com o mesmo nome em `.claude/skills` e em `.devin/skills`, sem copiar arquivos.
7. **Preserve o que já está correto**: se um item de destino já é um link para o item correspondente em `.agents/skills`, não altere.
8. **Pare em conflitos**: se um item de destino existe como arquivo real, diretório real ou link para outro lugar, reporte o conflito e peça confirmação antes de substituir.
9. **Verifique o resultado**: confirme que cada item linkado resolve para o item correspondente da origem.

## Instruções para a LLM

- Escolha a ação correta para o sistema operacional atual sem expor ou sugerir código de console ao usuário.
- Prefira symlinks reais quando o ambiente permitir.
- Em Windows, se symlink real exigir permissão elevada ou Developer Mode, peça confirmação antes de usar junction como alternativa.
- Use caminhos relativos quando eles continuarem válidos dentro do layout do projeto.
- Crie somente os diretórios reais necessários para receber os links, sempre no mesmo diretório onde está `.agents`.
- Não transforme `.claude/skills` ou `.devin/skills` em link para `.agents/skills`; eles devem conter links individuais para os itens da origem.
- Se `.claude/skills` ou `.devin/skills` já existir como link ou junction para `.agents/skills`, trate como estrutura antiga e peça confirmação antes de substituir por diretório real com links por item.
- Nunca copie o conteúdo de `.agents/skills` para os destinos.

## Validação

Depois de criar os links:

- Verifique por meio das ferramentas disponíveis que cada item em `.claude/skills` e `.devin/skills` resolve para o item correspondente em `.agents/skills`.
- Confirme se os links continuam válidos quando acessados a partir da raiz do projeto.
- Reporte ao usuário quais destinos foram criados, quais já estavam corretos e quais ficaram bloqueados por conflito.

## Regras de segurança

- Não copie o conteúdo de `.agents/skills`.
- Não remova nem substitua destinos existentes sem aprovação explícita.
- Não transforme `.agents/skills` em link para outra pasta; ela é a origem canônica.
- Não linke a pasta `.agents/skills` inteira nos destinos; linke os itens internos individualmente.
- Prefira links relativos quando eles continuarem válidos dentro do layout do projeto.
- Trate symlink e junction como equivalentes apenas quando o objetivo for expor o mesmo item local para outra ferramenta.
