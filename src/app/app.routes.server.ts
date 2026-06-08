import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    // The Pokédex pages have dynamic ids (~1302) and rely on client-only
    // localStorage caches, so they are rendered on the client.
    path: 'pokedex',
    renderMode: RenderMode.Client,
  },
  {
    path: 'pokedex/**',
    renderMode: RenderMode.Client,
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
