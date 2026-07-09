import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import {
  NamedApiResourceList,
  Pokemon,
  PokemonListItem,
  PokemonSpecies,
} from '../models/pokemon.models';
import { cleanFlavorText, idFromUrl } from '../utils/pokemon.utils';

const BASE_URL = '/api/v2';
/** Maior que o total de Pokémon existentes (1351) — traz a lista inteira numa só página. */
const ALL_POKEMON_LIMIT = 100000;

/** Acesso aos dados da API local (mirror offline da PokeAPI) — ver api/README.md. */
@Injectable({ providedIn: 'root' })
export class PokemonApiService {
  private readonly http = inject(HttpClient);

  private allPokemon$?: Observable<PokemonListItem[]>;

  /** Lista completa (nome + id) de todos os Pokémon. Buscada e cacheada uma única vez. */
  getAllPokemon(): Observable<PokemonListItem[]> {
    this.allPokemon$ ??= this.http
      .get<NamedApiResourceList>(`${BASE_URL}/pokemon`, {
        params: { limit: ALL_POKEMON_LIMIT },
      })
      .pipe(
        map((response) =>
          response.results.map((resource) => ({
            name: resource.name,
            id: idFromUrl(resource.url),
          })),
        ),
        shareReplay({ bufferSize: 1, refCount: false }),
      );
    return this.allPokemon$;
  }

  /** Dados completos de um Pokémon pelo nome (ou id). */
  getPokemonByName(name: string): Observable<Pokemon> {
    return this.http.get<Pokemon>(`${BASE_URL}/pokemon/${encodeURIComponent(name)}`);
  }

  /** Texto de Pokédex (flavor text) em inglês da espécie — `null` se nenhum estiver disponível. */
  getSpeciesFlavorText(speciesName: string): Observable<string | null> {
    return this.http
      .get<PokemonSpecies>(`${BASE_URL}/pokemon-species/${encodeURIComponent(speciesName)}`)
      .pipe(
        map((species) => {
          const entry = species.flavor_text_entries.find((e) => e.language.name === 'en');
          return entry ? cleanFlavorText(entry.flavor_text) : null;
        }),
      );
  }
}
