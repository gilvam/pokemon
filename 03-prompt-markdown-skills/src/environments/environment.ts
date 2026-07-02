/**
 * Configuração de ambiente do app.
 *
 * Por padrão o app consome a cópia LOCAL da PokeAPI (servida pelo mesmo host que
 * entrega o app — SSR offline, ou via proxy no `ng serve`). Use URLs relativas
 * para funcionar offline em qualquer porta/host.
 */
export const environment = {
  production: false,
  /** Base da PokeAPI v2 local. */
  pokeapiBaseUrl: '/api/v2',
  /** Base das imagens/gifs locais (sprites/cries) servidas pelo mirror. */
  mediaBaseUrl: '/media',
};
