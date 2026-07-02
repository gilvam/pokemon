import type { Router } from 'express';

export interface PokeapiMirrorOptions {
  /** Raiz da pasta do mirror. Default: env POKEAPI_MIRROR_DIR ou ../api. */
  mirrorDir?: string;
  /** Prefixo público das imagens. Default: env POKEAPI_MEDIA_BASE ou /media. */
  mediaBase?: string;
}

export function createPokeapiMirrorRouter(options?: PokeapiMirrorOptions): Router;
