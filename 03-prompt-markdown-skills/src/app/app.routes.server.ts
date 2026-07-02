import { RenderMode, ServerRoute } from '@angular/ssr';

// The Pokédex resolves up to ~1302 dynamic ids and relies on browser-only data
// (HttpClient + localStorage cache), so it is rendered on the client rather than
// prerendered. The whole app ships a static shell hydrated in the browser.
export const serverRoutes: ServerRoute[] = [
  {
    path: '**',
    renderMode: RenderMode.Client,
  },
];
