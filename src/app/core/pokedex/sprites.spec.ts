import {
  formatDexNumber,
  formatName,
  idFromResourceUrl,
  officialArtworkUrl,
  spriteUrl,
} from './sprites';

describe('sprites helpers', () => {
  describe('idFromResourceUrl', () => {
    it('extracts the id from a trailing-slash url', () => {
      expect(idFromResourceUrl('https://pokeapi.co/api/v2/pokemon/25/')).toBe(25);
    });

    it('extracts the id without a trailing slash', () => {
      expect(idFromResourceUrl('https://pokeapi.co/api/v2/pokemon-species/133')).toBe(133);
    });

    it('returns NaN for a url without an id', () => {
      expect(idFromResourceUrl('https://pokeapi.co/api/v2/pokemon/')).toBeNaN();
    });
  });

  it('builds the official artwork url', () => {
    expect(officialArtworkUrl(25)).toContain('/other/official-artwork/25.png');
  });

  it('builds the default sprite url', () => {
    expect(spriteUrl(7).endsWith('/pokemon/7.png')).toBe(true);
  });

  it('formats the dex number with leading zeros', () => {
    expect(formatDexNumber(25)).toBe('#0025');
    expect(formatDexNumber(1)).toBe('#0001');
    expect(formatDexNumber(1025)).toBe('#1025');
  });

  it('formats hyphenated api names', () => {
    expect(formatName('mr-mime')).toBe('Mr Mime');
    expect(formatName('pikachu')).toBe('Pikachu');
  });
});
