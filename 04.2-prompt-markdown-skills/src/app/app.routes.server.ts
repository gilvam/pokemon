import { RenderMode, ServerRoute } from '@angular/ssr';

// A Pokédex resolve ~1300 ids dinâmicos e depende de HttpClient no browser (índice,
// tipos, detalhe), então é renderizada no client em vez de prerenderizada.
export const serverRoutes: ServerRoute[] = [
  {
    path: '**',
    renderMode: RenderMode.Client,
  },
];
