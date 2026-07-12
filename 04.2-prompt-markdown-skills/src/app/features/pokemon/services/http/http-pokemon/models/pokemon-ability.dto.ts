import { Dto } from '@decorators/class.decorator';
import { NamedResourceDto } from './named-resource.dto';

/** A Pokémon ability entry (`{ ability, is_hidden, slot }`). */
@Dto()
export class PokemonAbilityDto {
  constructor(
    public ability = new NamedResourceDto(),
    public isHidden = false,
    public slot = 0,
  ) {}

  static create(item: Partial<PokemonAbilityDto> = new this()): PokemonAbilityDto {
    return new this(NamedResourceDto.create(item.ability), item.isHidden, item.slot);
  }

  static createArray(items: Partial<PokemonAbilityDto>[] = []): PokemonAbilityDto[] {
    return items.map((item) => PokemonAbilityDto.create(item));
  }
}
