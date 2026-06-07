import { Routes } from '@angular/router';

export const pokedexRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pokedex-list/pokedex-list').then((m) => m.PokedexList),
    title: 'Pokédex',
  },
  {
    path: ':id',
    loadComponent: () => import('./pokemon-detail/pokemon-detail').then((m) => m.PokemonDetail),
    title: 'Detalhes do Pokémon · Pokédex',
  },
];
