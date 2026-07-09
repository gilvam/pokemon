import {
  cleanFlavorText,
  formatHeight,
  formatPokedexNumber,
  formatSlug,
  formatWeight,
  idFromUrl,
  matchesQuery,
  normalizeQuery,
  spriteUrl,
  statBarPercent,
} from './pokemon.utils';

describe('idFromUrl', () => {
  it('extracts the trailing numeric id', () => {
    expect(idFromUrl('/api/v2/pokemon/25/')).toBe(25);
    expect(idFromUrl('/api/v2/pokemon/1')).toBe(1);
  });

  it('returns 0 when there is no numeric id', () => {
    expect(idFromUrl('/api/v2/pokemon/')).toBe(0);
  });
});

describe('formatSlug', () => {
  it('capitalizes every hyphen-separated word', () => {
    expect(formatSlug('charizard-mega-x')).toBe('Charizard Mega X');
    expect(formatSlug('pikachu')).toBe('Pikachu');
  });
});

describe('formatPokedexNumber', () => {
  it('pads small ids to 3 digits', () => {
    expect(formatPokedexNumber(25)).toBe('#025');
  });

  it('does not truncate larger ids', () => {
    expect(formatPokedexNumber(10027)).toBe('#10027');
  });
});

describe('formatHeight / formatWeight', () => {
  it('converts decimetres to metres', () => {
    expect(formatHeight(4)).toBe('0.4 m');
  });

  it('converts hectograms to kilos', () => {
    expect(formatWeight(60)).toBe('6.0 kg');
  });
});

describe('cleanFlavorText', () => {
  it('replaces legacy line/page breaks with spaces', () => {
    expect(cleanFlavorText('When several of\nthese POKéMON\fgather.')).toBe(
      'When several of these POKéMON gather.',
    );
  });
});

describe('statBarPercent', () => {
  it('scales the value against the visual max', () => {
    expect(statBarPercent(100)).toBe(50);
  });

  it('clamps above the visual max at 100', () => {
    expect(statBarPercent(255)).toBe(100);
  });

  it('clamps negative values at 0', () => {
    expect(statBarPercent(-10)).toBe(0);
  });
});

describe('spriteUrl', () => {
  it('builds the mirror sprite path from an id', () => {
    expect(spriteUrl(25)).toBe('/media/sprites/pokemon/25.png');
  });
});

describe('normalizeQuery / matchesQuery', () => {
  it('normalizes casing and whitespace', () => {
    expect(normalizeQuery('  PIKA  ')).toBe('pika');
  });

  it('matches by substring of the name', () => {
    expect(matchesQuery({ name: 'pikachu', id: 25 }, 'pika')).toBe(true);
    expect(matchesQuery({ name: 'raichu', id: 26 }, 'pika')).toBe(false);
  });

  it('matches by exact id', () => {
    expect(matchesQuery({ name: 'pikachu', id: 25 }, '25')).toBe(true);
    expect(matchesQuery({ name: 'pikachu', id: 25 }, '2')).toBe(false);
  });

  it('matches everything for an empty query', () => {
    expect(matchesQuery({ name: 'pikachu', id: 25 }, '')).toBe(true);
  });
});
