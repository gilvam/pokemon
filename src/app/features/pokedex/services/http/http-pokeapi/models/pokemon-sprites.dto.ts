import { NoNull } from '@decorators/class.decorator';

/** Raw nested `sprites` payload (only the fields the UI consumes). */
interface ISpritesPayload {
  front_default: string | null;
  back_default: string | null;
  front_shiny: string | null;
  back_shiny: string | null;
  other?: {
    'official-artwork'?: {
      front_default?: string | null;
    };
  };
}

/** Flattened sprite URLs for a Pokémon (`GET /pokemon/{id}` → `sprites`). */
@NoNull()
export class PokemonSpritesDto {
  constructor(
    public frontDefault = '',
    public backDefault = '',
    public frontShiny = '',
    public backShiny = '',
    public officialArtwork = '',
  ) {}

  static create(item: Partial<ISpritesPayload> = {}): PokemonSpritesDto {
    return new this(
      item.front_default ?? '',
      item.back_default ?? '',
      item.front_shiny ?? '',
      item.back_shiny ?? '',
      item.other?.['official-artwork']?.front_default ?? '',
    );
  }
}
