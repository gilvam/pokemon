import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'pokedex',
    loadChildren: () =>
      import('./features/pokedex/pokedex.routes').then((m) => m.pokedexRoutes),
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'pokedex',
  },
  {
    path: '**',
    redirectTo: 'pokedex',
  },
];
