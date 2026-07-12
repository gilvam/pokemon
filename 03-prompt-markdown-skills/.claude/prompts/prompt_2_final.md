<task>
  Pokédex com listagem completa e busca por nome
</task>

<goal>
    O usuário abre a Pokédex, vê a listagem completa de todos os Pokémon disponíveis no
    mirror local e consegue digitar o nome (ou parte dele) para filtrar a lista e
    visualizar as informações detalhadas do Pokémon selecionado.
</goal>

<requirements>
    Negócio:
    - Listar todos os Pokémon disponíveis na API local (mirror offline da PokeAPI).
    - Permitir que o usuário digite o nome do Pokémon (ou parte dele) e filtre a lista em
      tempo real (busca parcial/incremental, sem exigir nome exato).
    - Ao selecionar um Pokémon da lista (completa ou filtrada), exibir suas informações
      detalhadas (sprites, tipos, stats, habilidades e dados de espécie/evolução).

    Arquitetura:
    - Funcionalidade implementada neste app Angular (frontend), em uma feature própria sob
      `src/app/features/`, com `pages/` para telas roteadas, `components/` para peças
      reutilizáveis e `services/`/`models/` para lógica e tipos — convenção de pastas já
      usada no projeto (skill `angular-folder-structure`).
    - O frontend busca os dados diretamente na API local (mirror offline da PokeAPI) via
      `HttpClient`, sem backend próprio no meio — usar as URLs relativas já configuradas em
      `environment.ts` (`pokeapiBaseUrl: '/api/v2'`, `mediaBaseUrl: '/media'`).
    - Camada de serviço HTTP dedicada (`services/http/http-<feature>/`) encapsula as
      chamadas e monta DTOs tipados a partir das respostas (padrão `create()`/
      `createArray()`), com um serviço mock equivalente para testes/fixtures locais —
      mesmo padrão já usado em `http-pokeapi.service.ts`.
    - Índice completo de Pokémon (nome + id) é carregado uma única vez via
      `GET /api/v2/pokemon?limit=<alto>&offset=0` e mantido em memória; a busca por nome
      filtra esse índice inteiramente no client (sem requisição por tecla digitada) — o
      endpoint de detalhe só aceita nome exato ou id, então não serve para busca
      incremental.
    - Estado dividido em serviços de responsabilidade única (ex.: um serviço só para o
      texto/filtro de busca, outro só para a seleção/detalhe atual), cada um com seus
      próprios `signal()`/`computed()` — SEM um serviço agregador único do tipo "Store"
      central concentrando todo o estado da feature.
    - O detalhe do Pokémon selecionado é buscado sob demanda por id numérico já conhecido
      pelo índice (evita o caso de o mirror local não resolver lookup por nome) apenas
      quando o usuário seleciona um item — nunca a cada tecla digitada.

    UI/UX:
    - Tela de listagem com todos os Pokémon (nome + sprite), com paginação client-side
      sobre o índice já carregado.
    - Campo de busca que filtra a lista incrementalmente (debounced) conforme o usuário
      digita; resultado vazio mostra o estado "nenhum Pokémon encontrado para '<termo>'".
    - Seleção de um item abre a tela/estado de detalhe, com indicador de carregamento
      enquanto os dados chegam.
    - Estado de erro (ex.: 404, API local indisponível) exibido sem quebrar a tela, com
      opção de voltar à listagem.
    - Imagens com `alt` descritivo e `loading="lazy"`; itens da lista são elementos
      interativos reais (link/botão), navegáveis por teclado, com foco visível —
      acessibilidade AXE/WCAG AA conforme convenção do projeto.
</requirements>

<api_contracts>
APIs externas:
    - Nenhuma. A única fonte de dados é a API local (mirror offline da PokeAPI),
      documentada em `api/README.md` (raiz do workspace) e `api/_serve/README.md`; não há
      chamada a `pokeapi.co` nem a qualquer outro serviço externo.

    APIs de backend (mirror local, base `/api/v2` e `/media`, mesmos formatos da PokeAPI
    real):
    - [GET] `/api/v2/pokemon?limit=<alto>&offset=0` - índice completo de Pokémon, chamado
      uma única vez no bootstrap da listagem/busca.
    - Resposta de sucesso: `{ count, next, previous, results: [{ name, url }] }`; o `id`
      de cada item é extraído da `url`.
    - Respostas de erro: nenhuma esperada (endpoint sempre existe).
    - [GET] `/api/v2/pokemon/<id>` - detalhe de um Pokémon buscado por id numérico (evitar
      lookup por nome: o mirror estático é indexado por id e pode não resolver nomes
      diretamente), disparado ao selecionar um item da lista.
    - Resposta de sucesso: JSON com stats, tipos, habilidades, sprites e cries do Pokémon.
    - Respostas de erro: `404` com corpo `{ "detail": "Not found." }` quando o id não
      existe; tratar como estado de erro na UI, sem quebrar a tela.
    - [GET] `/api/v2/pokemon-species/<id>` - dados de espécie (flavor text, egg groups,
      referência à cadeia evolutiva) usados na tela de detalhe.
    - Resposta de sucesso: JSON de espécie. Respostas de erro: `404` no mesmo formato
      acima.
    - [GET] `/api/v2/evolution-chain/<id>` - cadeia evolutiva do Pokémon selecionado,
      referenciada pelo retorno de `pokemon-species`.
    - Resposta de sucesso: JSON recursivo `{ id, chain: { species, evolves_to: [...] } }`.
    - Mídia: sprites/imagens retornados nos JSONs já apontam para `/media/...` no mesmo
      host da API local; usadas diretamente em `<img>`.
</api_contracts>

<acceptance_criteria>
    - Dado que a tela inicial é aberta, quando o índice completo termina de carregar,
      então todos os Pokémon são exibidos em uma lista com nome e imagem; enquanto
      carrega, um indicador de loading é exibido.
    - Dado que o usuário digita parte do nome de um Pokémon existente no campo de busca,
      quando o texto é processado (após o debounce), então a lista é filtrada
      instantaneamente, sem nova requisição HTTP, mostrando só os itens correspondentes.
    - Dado que o usuário digita um termo que não corresponde a nenhum Pokémon, então a
      lista mostra o estado "nenhum Pokémon encontrado para '<termo>'", sem quebrar a
      tela.
    - Dado que o usuário seleciona um Pokémon da lista (completa ou filtrada), quando o
      detalhe é buscado, então um indicador de carregamento é exibido até a resposta
      chegar e, em seguida, as informações detalhadas (stats, tipos, habilidades,
      sprites) são exibidas.
    - Dado que a busca do detalhe retorna erro (ex.: `404` ou API local indisponível),
      então uma mensagem de erro amigável é exibida, com opção de voltar à listagem, sem
      quebrar a tela.
</acceptance_criteria>

<constraints>
    - FAÇA: buscar os dados exclusivamente na API local (mirror offline da PokeAPI)
      descrita em `api/README.md`, usando as URLs relativas já configuradas em
      `environment.ts`.
    - FAÇA: carregar o índice de Pokémon uma única vez e filtrar por nome inteiramente no
      client; reservar a chamada de detalhe por id apenas para o item selecionado, nunca
      por tecla digitada.
    - FAÇA: dividir o estado da feature em serviços de responsabilidade única com
      signals (ex.: busca, seleção/detalhe, cache), cada um cuidando só da sua fatia de
      estado.
    - NÃO FAÇA: criar um serviço agregador único do tipo "Store" (ex.: `*Store`)
      concentrando todo o estado da feature — esse padrão não deve ser reutilizado neste
      projeto.
    - NÃO FAÇA: fazer chamadas à PokeAPI pública (pokeapi.co) ou a qualquer outra API
      externa.
    - NUNCA: hardcodar a lista de Pokémon ou seus dados no frontend — todos os dados
      exibidos devem vir da API local em tempo de execução.
</constraints>
