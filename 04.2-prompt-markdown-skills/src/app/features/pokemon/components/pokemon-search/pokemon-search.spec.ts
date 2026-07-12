import { TestBed } from '@angular/core/testing';
import { PokemonSearch } from './pokemon-search';

describe('PokemonSearch', () => {
  it('inicia com o termo vazio', () => {
    const fixture = TestBed.createComponent(PokemonSearch);
    fixture.detectChanges();

    expect(fixture.componentInstance.term()).toBe('');
  });

  it('atualiza o signal term ao digitar', () => {
    const fixture = TestBed.createComponent(PokemonSearch);
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    input.value = 'pika';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(fixture.componentInstance.term()).toBe('pika');
  });

  it('reflete o valor do model no input', () => {
    const fixture = TestBed.createComponent(PokemonSearch);
    fixture.componentRef.setInput('term', 'char');
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    expect(input.value).toBe('char');
  });
});
