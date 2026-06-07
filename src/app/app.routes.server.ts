import { RenderMode, ServerRoute } from '@angular/ssr';

// The Pokédex fetches all of its data from the PokeAPI on the client. There are
// ~1300 dynamic detail routes that cannot be enumerated for prerendering, so the
// whole app is rendered on the client (still hydrated via provideClientHydration).
export const serverRoutes: ServerRoute[] = [
  {
    path: '**',
    renderMode: RenderMode.Client,
  },
];
