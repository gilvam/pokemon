/** Lifecycle of the once-per-session Pokémon index bootstrap. */
export enum PokemonIndexStatus {
  IDLE = 'idle',
  LOADING = 'loading',
  READY = 'ready',
  ERROR = 'error',
}
