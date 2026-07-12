import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of, Subject, throwError } from 'rxjs';
import { PokemonList } from './pokemon-list';
import { HttpPokemonService } from '../../services/http/http-pokemon/http-pokemon.service';
import { PokemonListResponseDto } from '../../services/http/http-pokemon/models/pokemon-list-response.dto';
import { TypeDto } from '../../services/http/http-pokemon/models/type.dto';

describe('PokemonList', () => {
  let getIndex: ReturnType<typeof vi.fn>;
  let getType: ReturnType<typeof vi.fn>;

  const index = PokemonListResponseDto.create({
    count: 2,
    results: [
      { name: 'bulbasaur', url: '/api/v2/pokemon/1/' },
      { name: 'charmander', url: '/api/v2/pokemon/4/' },
    ],
  });

  function wait(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  beforeEach(() => {
    getIndex = vi.fn(() => of(index));
    getType = vi.fn(() => of(TypeDto.create()));

    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: HttpPokemonService, useValue: { getIndex, getType } },
      ],
    });
  });

  it('mostra o loading e, em seguida, a grade com todos os cards', () => {
    const indexSubject = new Subject<PokemonListResponseDto>();
    getIndex.mockReturnValue(indexSubject);

    const fixture = TestBed.createComponent(PokemonList);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Carregando');

    indexSubject.next(index);
    indexSubject.complete();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('app-pokemon-card')).toHaveLength(2);
  });

  it('filtra a lista após o debounce, sem nova requisição HTTP', async () => {
    const fixture = TestBed.createComponent(PokemonList);
    fixture.detectChanges();
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    input.value = 'char';
    input.dispatchEvent(new Event('input'));

    await wait(250);
    fixture.detectChanges();

    expect(getIndex).toHaveBeenCalledTimes(1);
    expect(fixture.nativeElement.querySelectorAll('app-pokemon-card')).toHaveLength(1);
  });

  it('mostra o estado vazio quando nenhum Pokémon corresponde ao termo', async () => {
    const fixture = TestBed.createComponent(PokemonList);
    fixture.detectChanges();
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    input.value = 'zzz';
    input.dispatchEvent(new Event('input'));

    await wait(250);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Nenhum Pokémon encontrado para "zzz"');
  });

  it('mostra erro com opção de tentar novamente quando o índice falha', () => {
    getIndex.mockReturnValue(throwError(() => new Error('falhou')));

    const fixture = TestBed.createComponent(PokemonList);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Não foi possível carregar');
    expect(fixture.nativeElement.querySelector('button')).toBeTruthy();
  });
});
