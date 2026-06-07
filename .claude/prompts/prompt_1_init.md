<prompt>
    Implemente um painel de clima no frontend e backend existente.
    
    O usuário deve poder digitar uma cidade e ver o clima atual.
    
    Para obter os dados, utilize a API Open-Meteo (gratuita, sem necessidade de API key):
    
    - Geocoding API: https://geocoding-api.open-meteo.com/v1/search (converter cidade em coordenadas)
      - Weather API: https://api.open-meteo.com/v1/forecast (obter dados do clima)
    
    O frontend deve buscar os dados somente do backend. Opcionalmente, o frontend pode tentar obter a localização do usuário pelo navegador (geolocation) e sugerir a cidade automaticamente.
    
    Crie um endpoint no backend para o frontend consumir e exiba os dados no painel.
</prompt>

<template>
    <task>
      [Nome curto da funcionalidade]``
    </task>
    
    <goal>
        [Uma ou duas frases descrevendo o resultado para o usuário.]
    </goal>
    
    <requirements>
        Negócio:
        - [Capacidade principal 1]
        - [Capacidade principal 2]
        - [Capacidade principal 3]
    
        Arquitetura:
        - [Onde a funcionalidade deve ser implementada]
        - [Qual camada é dona de cada responsabilidade]
        - [Regra de integração, fluxo de dados ou fronteira de dependência]
    
        UI/UX:
        - [Tela/estado importante 1]
        - [Tela/estado importante 2]
        - [Interação ou feedback importante]
    </requirements>
    
    <api_contracts>
    APIs externas:
        - [Nome do serviço externo]: [endpoint ou capacidade]
    
        APIs de backend:
        - [MÉTODO] [caminho] - [propósito]
        - Resposta de sucesso: [formato ou fonte]
        - Respostas de erro: [status codes e significado]
    </api_contracts>
    
    <acceptance_criteria>
        - Dado [estado/contexto], quando [ação], então [resultado esperado].
        - Dado [estado/contexto], quando [ação], então [resultado esperado].
        - Dado [erro/caso de borda], quando [ação], então [feedback esperado].
    </acceptance_criteria>
    
    <constraints>
        - FAÇA: [decisão técnica ou de produto obrigatória]
        - NÃO FAÇA: [comportamento explicitamente proibido]
        - NUNCA: [fronteira crítica que não pode ser violada]
    </constraints>
</template>

converta o <prompt> na estrutura do <template> e salve em um arquivo prompt_2_final.md
