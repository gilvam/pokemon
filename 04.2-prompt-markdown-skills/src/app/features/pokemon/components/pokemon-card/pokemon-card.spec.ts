import { provideRouter } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import { PokemonCard } from './pokemon-card';
import { PokemonSummary } from '../../models/pokemon-summary.model';
import { PokemonType } from '../../models/pokemon-type.enum';

describe('PokemonCard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter([])],
    });
  });

  it('exibe o número, o nome e a imagem do Pokémon', () => {
    const fixture = TestBed.createComponent(PokemonCard);
    fixture.componentRef.setInput('summary', new PokemonSummary(25, 'pikachu', [PokemonType.ELECTRIC]));
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.card__number')?.textContent).toContain('#0025');
    expect(el.querySelector('.card__name')?.textContent).toContain('pikachu');
    expect(el.querySelector('img')?.getAttribute('alt')).toContain('pikachu');
    expect(el.querySelector('img')?.getAttribute('loading')).toBe('lazy');
  });

  it('usa a imagem oficial por padrão e troca para o fallback em caso de erro', () => {
    const fixture = TestBed.createComponent(PokemonCard);
    fixture.componentRef.setInput('summary', new PokemonSummary(25, 'pikachu', [PokemonType.ELECTRIC]));
    fixture.detectChanges();

    const img = fixture.nativeElement.querySelector('img') as HTMLImageElement;
    expect(img.src).toContain('official-artwork/25.png');

    img.dispatchEvent(new Event('error'));
    fixture.detectChanges();

    expect(img.src).toContain('/sprites/pokemon/25.png');
    expect(img.src).not.toContain('official-artwork');
  });

  it('aplica o gradiente pastel do tipo como background', () => {
    const fixture = TestBed.createComponent(PokemonCard);
    fixture.componentRef.setInput('summary', new PokemonSummary(25, 'pikachu', [PokemonType.ELECTRIC]));
    fixture.detectChanges();

    const link = fixture.nativeElement.querySelector('.card') as HTMLElement;
    expect(link.style.background).toContain('gradient');
  });
});
