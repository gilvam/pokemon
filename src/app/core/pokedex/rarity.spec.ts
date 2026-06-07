import { PokemonSpeciesDto } from '../../services/http/http-pokeapi/models/pokemon-species.dto';
import { deriveCaptureTier, deriveRarity, deriveRarityCategory } from './rarity';

describe('rarity', () => {
  describe('deriveRarityCategory', () => {
    it('prioritizes mythical over legendary', () => {
      expect(
        deriveRarityCategory({ is_baby: false, is_legendary: true, is_mythical: true }),
      ).toBe('mythical');
    });

    it('detects legendary', () => {
      expect(
        deriveRarityCategory({ is_baby: false, is_legendary: true, is_mythical: false }),
      ).toBe('legendary');
    });

    it('detects baby', () => {
      expect(
        deriveRarityCategory({ is_baby: true, is_legendary: false, is_mythical: false }),
      ).toBe('baby');
    });

    it('falls back to normal', () => {
      expect(
        deriveRarityCategory({ is_baby: false, is_legendary: false, is_mythical: false }),
      ).toBe('normal');
    });
  });

  describe('deriveCaptureTier', () => {
    it('maps the boundaries of each tier', () => {
      expect(deriveCaptureTier(3)).toBe('very-rare');
      expect(deriveCaptureTier(4)).toBe('rare');
      expect(deriveCaptureTier(45)).toBe('rare');
      expect(deriveCaptureTier(46)).toBe('uncommon');
      expect(deriveCaptureTier(120)).toBe('uncommon');
      expect(deriveCaptureTier(121)).toBe('common');
      expect(deriveCaptureTier(255)).toBe('common');
    });
  });

  it('derives the full rarity info from a species', () => {
    const species = PokemonSpeciesDto.create({
      is_baby: false,
      is_legendary: true,
      is_mythical: false,
      capture_rate: 3,
    });

    expect(deriveRarity(species)).toEqual({
      category: 'legendary',
      captureTier: 'very-rare',
      captureRate: 3,
    });
  });
});
