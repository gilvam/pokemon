import { NoNull } from '../../../../_decorators/class.decorator';
import { NamedApiResourceDto } from './named-api-resource.dto';

@NoNull()
export class PokemonAbilityDto {
  constructor(
    public is_hidden = false,
    public slot = 0,
    public ability = new NamedApiResourceDto(),
  ) {}

  static create(item: Partial<PokemonAbilityDto> = new this()): PokemonAbilityDto {
    return new this(item.is_hidden, item.slot, NamedApiResourceDto.create(item.ability));
  }

  static createArray(items: Partial<PokemonAbilityDto>[] = []): PokemonAbilityDto[] {
    return (items ?? []).map((item) => PokemonAbilityDto.create(item));
  }
}
