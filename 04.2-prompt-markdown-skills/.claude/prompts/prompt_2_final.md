<task>
  Pokédex com busca por nome
</task>

<goal>
    O usuário abre a Pokédex, vê todos os Pokémon disponíveis e consegue digitar o nome
    (ou parte dele) para filtrar a lista e visualizar as informações detalhadas do
    Pokémon selecionado.
</goal>

<requirements>
    Negócio:
    - Listar todos os Pokémon disponíveis na API local.
    - Permitir que o usuário digite o nome de um Pokémon e filtre a lista em tempo real
      (busca parcial/incremental, não apenas nome exato).
    - Ao selecionar um Pokémon (da lista completa ou do resultado filtrado), exibir suas
      informações detalhadas (dados de batalha: stats, tipos, habilidades, sprites; e,
      se aplicável, dados de Pokédex como espécie/evolução).
    - Cada Pokémon exibido (card na lista e cabeçalho do detalhe) tem um background em
      gradiente cujas cores são derivadas do(s) tipo(s) do Pokémon, em tom pastel.

    Arquitetura:
    - Funcionalidade implementada no app Angular (frontend) deste diretório
      (`04.2-prompt-markdown-skills`).
    - O frontend é responsável por buscar os dados diretamente na API local
      (mirror offline da PokeAPI) via `HttpClient`/`httpResource` — não há backend
      próprio no meio.
    - Camada de serviço dedicada (ex.: `PokemonApiService`) encapsula as chamadas HTTP
      e a montagem das URLs de listagem/detalhe/mídia; componentes não chamam a API
      diretamente.
    - Índice completo (nome + id, ~1300 registros) é carregado **uma única vez**
      (`limit` alto) e mantido em memória (signal); a busca por nome filtra esse índice
      **no client**, sem requisição por tecla digitada — o endpoint de detalhe por
      nome exato não permite busca parcial, então listar/filtrar precisa do índice
      completo local.
    - O campo de busca usa um `signal` para o texto digitado; um `debounced()` (ex.:
      150–300ms) sobre esse signal alimenta o filtro, evitando recomputar a lista a
      cada tecla em uma base de ~1300 itens.
    - O detalhe do Pokémon selecionado é buscado sob demanda via `resource()`/
      `httpResource()`, reagindo ao id/nome selecionado; usar os estados
      `isLoading()` / `hasValue()` / `error()` do resource para pilotar a UI (sempre
      ler `value()` atrás de um `hasValue()` guard).
    - Índice tipo→Pokémon construído a partir de `GET /api/v2/type/<nome>` (18
      requisições, uma por tipo, em paralelo, feitas junto ao carregamento inicial) para
      montar um mapa `id -> tipos[]` de todo o dataset **sem** precisar buscar o detalhe
      de cada Pokémon individualmente; esse mapa alimenta o gradiente da listagem sem
      quebrar a regra de "detalhe sob demanda".
    - Mapa fixo `tipo -> cor pastel` (ex.: `type-pastel-color.ts`) com uma cor por tipo
      (18 tipos). Pokémon com 1 tipo: gradiente entre a cor pastel do tipo e uma
      variação mais clara/escura da mesma cor. Pokémon com 2 tipos: gradiente linear
      misturando as cores pastel do tipo primário e do secundário (ordem conforme
      `types[].slot` da API).

    UI/UX:
    - Tela de listagem com todos os Pokémon (nome + imagem), com paginação no client
      sobre o índice já carregado (não repaginar via API a cada página).
    - Campo de busca que filtra a lista incrementalmente conforme o usuário digita;
      lista vazia mostra estado "nenhum Pokémon encontrado para '<termo>'".
    - Clique/seleção em um item da lista abre a tela/estado de detalhe, com spinner
      de carregamento enquanto o `httpResource` de detalhe resolve (relevante pois a
      API local tem ~1000ms de latência artificial por requisição).
    - Estado de erro no detalhe (ex.: `404`) exibido sem quebrar a tela, com opção de
      voltar à lista.
    - Imagens com `alt` descritivo e `loading="lazy"` na listagem; itens da lista são
      elementos interativos reais (link/botão) com foco visível e navegáveis por
      teclado.
    - Cada card na listagem e o cabeçalho da tela de detalhe exibem o background em
      gradiente pastel do(s) tipo(s); enquanto o índice de tipos ainda carrega, o card
      mostra um fundo neutro (skeleton) até o gradiente ficar disponível.
</requirements>

<api_contracts>
APIs externas:
    - Nenhuma (a API local já é o mirror offline da PokeAPI; não há chamada a serviço
      externo).

    APIs de backend:
    - [GET] `/api/v2/pokemon?limit=100000&offset=0` - índice completo de Pokémon
      (`{count, next, previous, results: [{name, url}]}`), chamado **uma vez** no
      bootstrap da listagem/busca; o `id` é extraído da `url` de cada item.
    - Resposta de sucesso: JSON no formato acima, idêntico ao upstream da PokeAPI v2.
    - Respostas de erro: nenhuma esperada nesta chamada (endpoint sempre existe).
    - [GET] `/api/v2/pokemon/<nome|id>` - detalhe de um Pokémon buscado por nome exato
      ou id, disparado ao selecionar um item da lista/resultado filtrado (não a cada
      tecla digitada).
    - Resposta de sucesso: JSON com stats, tipos, habilidades, sprites e cries do Pokémon.
    - Respostas de erro: `404` com corpo `{"detail":"Not Found"}` quando o nome/id não
      existe; tratar como estado de erro do `httpResource`, exibindo mensagem amigável.
    - [GET] `/api/v2/type/<nome>` - lista de Pokémon de um tipo (`pokemon[].pokemon.name`);
      chamado 18 vezes em paralelo (um por tipo) no bootstrap para montar o mapa
      `id -> tipos[]` usado no gradiente da listagem.
    - Resposta de sucesso: JSON com `pokemon: [{pokemon: {name, url}}, ...]` por tipo.
    - Respostas de erro: nenhuma esperada (os 18 nomes de tipo são fixos e sempre existem).
    - Mídia: imagens/sprites retornadas nos JSONs já apontam para `/media/...` no mesmo
      host da API local; usadas diretamente em `<img>`.
</api_contracts>

<acceptance_criteria>
    - Dado que a tela inicial é aberta, quando o índice completo termina de carregar,
      então todos os Pokémon são exibidos em uma lista com nome e imagem; enquanto
      carrega, um indicador de loading é exibido.
    - Dado que o usuário digita parte do nome de um Pokémon existente no campo de busca,
      quando o texto é processado (após o debounce), então a lista é filtrada
      instantaneamente (sem nova requisição HTTP) para mostrar só os itens correspondentes.
    - Dado que o usuário digita um termo que não corresponde a nenhum Pokémon, então a
      lista mostra o estado "nenhum Pokémon encontrado para '<termo>'", sem quebrar a tela.
    - Dado que o usuário seleciona um Pokémon da lista (completa ou filtrada), quando o
      detalhe é buscado, então um estado de carregamento é exibido até a resposta chegar
      e, em seguida, as informações detalhadas (stats, tipos, habilidades, sprites) são
      exibidas.
    - Dado que a busca do detalhe retorna `404` (nome/id inválido), então uma mensagem de
      erro amigável é exibida, com opção de voltar à lista, sem quebrar a tela.
    - Dado um Pokémon com um único tipo, quando exibido (card ou detalhe), então seu
      background é um gradiente pastel derivado da cor daquele tipo.
    - Dado um Pokémon com dois tipos, quando exibido, então o background é um gradiente
      pastel misturando as cores dos dois tipos, na ordem tipo primário → secundário.
    - Dado qualquer um dos 18 tipos de Pokémon, quando o mapa `tipo -> cor pastel` é
      consultado, então há sempre uma cor pastel definida (nenhum tipo cai em cor
      neutra/fallback por falta de mapeamento).
</acceptance_criteria>

<constraints>
    - FAÇA: buscar os dados exclusivamente na API local (mirror offline da PokeAPI)
      descrita em `api/README.md`.
    - FAÇA: carregar o índice de Pokémon uma única vez e filtrar por nome no client;
      reservar a chamada de detalhe (`/pokemon/<nome|id>`) apenas para o item
      selecionado, nunca por tecla digitada.
    - FAÇA: usar apenas cores em tom pastel (alta luminosidade, baixa saturação) na
      paleta de gradiente por tipo, e garantir contraste suficiente (WCAG AA) entre
      texto/ícones e o fundo, mesmo em tons pastel.
    - NÃO FAÇA: fazer chamadas à PokeAPI pública (pokeapi.co) ou a qualquer outra API
      externa.
    - NÃO FAÇA: usar cores saturadas/vivas na paleta de tipo — o gradiente deve ser
      inteiramente pastel.
    - NUNCA: hardcodar a lista de Pokémon ou seus dados no frontend — todos os dados
      exibidos devem vir da API local em tempo de execução.
</constraints>
