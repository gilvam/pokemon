import { ResourceId } from './resource-id.model';

describe('ResourceId.fromUrl', () => {
  it('extracts the id from a pokemon url', () => {
    expect(ResourceId.fromUrl('https://pokeapi.co/api/v2/pokemon/25/')).toBe(25);
  });

  it('extracts the id from an evolution-chain url', () => {
    expect(ResourceId.fromUrl('https://pokeapi.co/api/v2/evolution-chain/10/')).toBe(10);
  });

  it('works without the trailing slash', () => {
    expect(ResourceId.fromUrl('https://pokeapi.co/api/v2/pokemon/151')).toBe(151);
  });

  it('returns 0 for an empty or malformed url', () => {
    expect(ResourceId.fromUrl('')).toBe(0);
    expect(ResourceId.fromUrl('not-a-url')).toBe(0);
  });
});
