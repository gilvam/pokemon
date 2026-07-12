import { inject, Injectable, signal } from '@angular/core';
import { forkJoin } from 'rxjs';
import { HttpPokemonService } from './http/http-pokemon/http-pokemon.service';
import { PokemonListResponseDto } from './http/http-pokemon/models/pokemon-list-response.dto';
import { TypeDto } from './http/http-pokemon/models/type.dto';
import { PokemonSummary } from '../models/pokemon-summary.model';
import { PokemonType } from '../models/pokemon-type.enum';
import { PokemonIndexStatus } from '../models/pokemon-index-status.enum';
import { ResourceId } from '../models/resource-id.model';
import { TypePalette } from '../models/type-palette.model';
import { TypeSlot } from '../models/type-slot.model';

/**
 * Bootstraps the full Pokémon index once per session: one request for the name/id
 * list plus 18 parallel requests (one per type) to build the `id -> types[]` map,
 * without ever fetching a single Pokémon's own detail. Kept in signals for the list
 * page to filter/paginate entirely on the client.
 */
@Injectable({
  providedIn: 'root',
})
export class PokemonIndexStore {
  private readonly api = inject(HttpPokemonService);

  private readonly _summaries = signal<PokemonSummary[]>([]);
  private readonly _status = signal<PokemonIndexStatus>(PokemonIndexStatus.IDLE);

  readonly summaries = this._summaries.asReadonly();
  readonly status = this._status.asReadonly();

  loadIndex(): void {
    if (this._status() === PokemonIndexStatus.LOADING || this._summaries().length > 0) {
      return;
    }
    this._status.set(PokemonIndexStatus.LOADING);
    forkJoin({
      index: this.api.getIndex(),
      types: forkJoin(TypePalette.all().map((type) => this.api.getType(type))),
    }).subscribe({
      next: ({ index, types }) => {
        this._summaries.set(this.buildSummaries(index, types));
        this._status.set(PokemonIndexStatus.READY);
      },
      error: () => this._status.set(PokemonIndexStatus.ERROR),
    });
  }

  retry(): void {
    this._status.set(PokemonIndexStatus.IDLE);
    this.loadIndex();
  }

  private buildSummaries(index: PokemonListResponseDto, types: TypeDto[]): PokemonSummary[] {
    const slotsById = this.groupSlotsById(types);
    return index.results
      .map((resource) => {
        const id = ResourceId.fromUrl(resource.url);
        const sortedTypes = [...(slotsById.get(id) ?? [])]
          .sort((left, right) => left.slot - right.slot)
          .map((entry) => entry.type);
        return new PokemonSummary(id, resource.name, sortedTypes);
      })
      .filter((summary) => summary.id > 0);
  }

  private groupSlotsById(types: TypeDto[]): Map<number, TypeSlot[]> {
    const slotsById = new Map<number, TypeSlot[]>();
    types.forEach((typeDto) => {
      const type = typeDto.name as PokemonType;
      typeDto.pokemon.forEach((entry) => {
        const id = ResourceId.fromUrl(entry.pokemon.url);
        if (id <= 0) {
          return;
        }
        const list = slotsById.get(id) ?? [];
        list.push(new TypeSlot(entry.slot, type));
        slotsById.set(id, list);
      });
    });
    return slotsById;
  }
}
