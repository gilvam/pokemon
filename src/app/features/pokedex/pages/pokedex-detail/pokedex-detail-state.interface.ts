import { IPokedexDetailData } from './pokedex-detail-data.interface';

/** Async lifecycle of the detail page load. */
export interface IPokedexDetailState {
  status: 'loading' | 'ready' | 'error';
  data: IPokedexDetailData | null;
}
