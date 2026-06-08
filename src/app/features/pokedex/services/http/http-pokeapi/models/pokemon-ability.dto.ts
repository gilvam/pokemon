import { NoNull } from '@decorators/class.decorator';
import { NamedResourceDto } from './named-resource.dto';

/** Raw `{ ability, is_hidden, slot }` payload as returned by the PokeAPI. */
interface IPokemonAbilityPayload {
  ability: Partial<NamedResourceDto>;
  is_hidden: boolean;
  slot: number;
}

/** One ability entry of a Pokémon (`GET /pokemon/{id}` → `abilities[]`). */
@NoNull()
export class PokemonAbilityDto {
  constructor(
    public ability = new NamedResourceDto(),
    public isHidden = false,
    public slot = 0,
  ) {}

  static create(item: Partial<IPokemonAbilityPayload> = {}): PokemonAbilityDto {
    return new this(NamedResourceDto.create(item.ability), item.is_hidden ?? false, item.slot ?? 0);
  }

  static createArray(items: Partial<IPokemonAbilityPayload>[] = []): PokemonAbilityDto[] {
    return (items ?? []).map((item) => PokemonAbilityDto.create(item));
  }
}
