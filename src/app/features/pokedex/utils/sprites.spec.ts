import { buildArtworkUrl, buildSpriteFallbackUrl } from './sprites';

describe('sprites', () => {
  it('should build the official artwork URL for an id', () => {
    const url = buildArtworkUrl(6);

    expect(url).toBe(
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png',
    );
  });

  it('should build the default sprite fallback URL for an id', () => {
    const url = buildSpriteFallbackUrl(6);

    expect(url).toBe(
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/6.png',
    );
  });
});
