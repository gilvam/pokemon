import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'pokemon' },
  {
    path: 'pokemon',
    loadChildren: () => import('./features/pokemon/pokemon.routes').then((m) => m.pokemonRoutes),
  },
  { path: '**', redirectTo: 'pokemon' },
];
