import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pokemon-list/pokemon-list').then((m) => m.PokemonList)
  },
  {
    path: 'pokemon/:name',
    loadComponent: () => import('./pokemon-detail/pokemon-detail').then((m) => m.PokemonDetail)
  },
  { path: '**', redirectTo: '' }
];
