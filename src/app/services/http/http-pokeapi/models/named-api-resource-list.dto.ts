import { NoNull } from '../../../../_decorators/class.decorator';
import { NamedApiResourceDto } from './named-api-resource.dto';

@NoNull()
export class NamedApiResourceListDto {
  constructor(
    public count = 0,
    public next = '',
    public previous = '',
    public results: NamedApiResourceDto[] = [],
  ) {}

  static create(item: Partial<NamedApiResourceListDto> = new this()): NamedApiResourceListDto {
    return new this(
      item.count,
      item.next,
      item.previous,
      NamedApiResourceDto.createArray(item.results),
    );
  }
}
