/** Lifecycle of an async data load in the Pokédex store. */
export enum LoadStatus {
  IDLE = 'idle',
  LOADING = 'loading',
  READY = 'ready',
  ERROR = 'error',
}
