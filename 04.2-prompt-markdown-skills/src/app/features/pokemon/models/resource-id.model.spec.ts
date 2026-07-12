import { ResourceId } from './resource-id.model';

describe('ResourceId', () => {
  it('extrai o id de uma url com barra final', () => {
    expect(ResourceId.fromUrl('https://pokeapi.co/api/v2/pokemon/25/')).toBe(25);
  });

  it('extrai o id de uma url sem barra final', () => {
    expect(ResourceId.fromUrl('https://pokeapi.co/api/v2/pokemon-species/1')).toBe(1);
  });

  it('retorna 0 quando a url não contém um id numérico', () => {
    expect(ResourceId.fromUrl('https://pokeapi.co/api/v2/pokemon/')).toBe(0);
  });

  it('retorna 0 para uma url vazia', () => {
    expect(ResourceId.fromUrl('')).toBe(0);
  });
});
