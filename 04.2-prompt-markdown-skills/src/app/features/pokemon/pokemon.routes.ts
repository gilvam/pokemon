import { Routes } from '@angular/router';

export const pokemonRoutes: Routes = [
  {
    path: '',
    title: 'Pokédex',
    loadComponent: () => import('./pages/pokemon-list/pokemon-list').then((m) => m.PokemonList),
  },
  {
    path: ':id',
    title: 'Pokédex — detalhe',
    loadComponent: () =>
      import('./pages/pokemon-detail/pokemon-detail').then((m) => m.PokemonDetail),
  },
];
