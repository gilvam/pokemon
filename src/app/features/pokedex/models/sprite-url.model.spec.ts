import { SpriteUrl } from './sprite-url.model';

describe('SpriteUrl', () => {
  it('builds the official artwork URL from the id', () => {
    expect(SpriteUrl.artwork(25)).toBe(
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png',
    );
  });

  it('builds the default sprite fallback URL from the id', () => {
    expect(SpriteUrl.fallback(25)).toBe(
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png',
    );
  });

  it('builds the shiny artwork URL from the id', () => {
    expect(SpriteUrl.shinyArtwork(25)).toBe(
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/shiny/25.png',
    );
  });
});
