import { Routes } from '@angular/router';

export const pokedexRoutes: Routes = [
  {
    path: '',
    title: 'Pokédex',
    loadComponent: () => import('./pages/pokedex-list/pokedex-list').then((m) => m.PokedexList),
  },
  {
    path: ':id',
    title: 'Pokédex — detalhe',
    loadComponent: () =>
      import('./pages/pokedex-detail/pokedex-detail').then((m) => m.PokedexDetail),
  },
];
