import { NoNull } from '../../../../_decorators/class.decorator';

@NoNull()
export class CriesDto {
  constructor(
    public latest = '',
    public legacy = '',
  ) {}

  static create(item: Partial<CriesDto> = new this()): CriesDto {
    return new this(item.latest, item.legacy);
  }
}
