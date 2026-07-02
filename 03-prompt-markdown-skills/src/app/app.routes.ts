import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'pokedex' },
  {
    path: 'pokedex',
    loadChildren: () => import('./features/pokedex/pokedex.routes').then((m) => m.pokedexRoutes),
  },
  { path: '**', redirectTo: 'pokedex' },
];
