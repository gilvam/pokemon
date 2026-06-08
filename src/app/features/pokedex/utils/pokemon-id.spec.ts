import { extractIdFromUrl, formatPokedexNumber } from './pokemon-id';

describe('pokemon-id', () => {
  describe('extractIdFromUrl', () => {
    it('should extract the id from a trailing-slash resource URL', () => {
      expect(extractIdFromUrl('https://pokeapi.co/api/v2/pokemon/25/')).toBe(25);
    });

    it('should extract the id from a URL without a trailing slash', () => {
      expect(extractIdFromUrl('https://pokeapi.co/api/v2/pokemon/151')).toBe(151);
    });
  });

  describe('formatPokedexNumber', () => {
    it('should zero-pad to four digits', () => {
      expect(formatPokedexNumber(25)).toBe('#0025');
    });

    it('should not truncate ids longer than four digits', () => {
      expect(formatPokedexNumber(10250)).toBe('#10250');
    });
  });
});
