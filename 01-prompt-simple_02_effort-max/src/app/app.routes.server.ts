import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '**',
    // Todo o conteúdo depende de dados buscados em tempo real na API local
    // no cliente em vez de pré-renderizar/SSR por rota.
    renderMode: RenderMode.Client,
  },
];
