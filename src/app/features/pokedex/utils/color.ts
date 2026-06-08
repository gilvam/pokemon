/** Pure color helpers used to derive type backgrounds and verify WCAG contrast. */

interface IRgb {
  r: number;
  g: number;
  b: number;
}

const HEX_RADIX = 16;
const MAX_CHANNEL = 255;
const SRGB_THRESHOLD = 0.03928;

export function hexToRgb(hex: string): IRgb {
  const normalized = hex.replace('#', '');
  const value = Number.parseInt(normalized, HEX_RADIX);
  return {
    r: (value >> 16) & MAX_CHANNEL,
    g: (value >> 8) & MAX_CHANNEL,
    b: value & MAX_CHANNEL,
  };
}

export function rgbToHex({ r, g, b }: IRgb): string {
  const toHex = (channel: number): string =>
    Math.round(channel).toString(HEX_RADIX).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/** Mix `from` toward `to` by `ratio` (0 keeps `from`, 1 returns `to`). */
export function mixHex(from: string, to: string, ratio: number): string {
  const a = hexToRgb(from);
  const b = hexToRgb(to);
  const blend = (start: number, end: number): number => start + (end - start) * ratio;
  return rgbToHex({ r: blend(a.r, b.r), g: blend(a.g, b.g), b: blend(a.b, b.b) });
}

function relativeLuminance(hex: string): number {
  const { r, g, b } = hexToRgb(hex);
  const channel = (raw: number): number => {
    const value = raw / MAX_CHANNEL;
    return value <= SRGB_THRESHOLD ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

/** WCAG contrast ratio between two hex colors (1–21). */
export function contrastRatio(first: string, second: string): number {
  const a = relativeLuminance(first);
  const b = relativeLuminance(second);
  const lighter = Math.max(a, b);
  const darker = Math.min(a, b);
  return (lighter + 0.05) / (darker + 0.05);
}

/** Pick black or white — whichever has the higher contrast on `background`. */
export function readableTextColor(background: string): string {
  const black = '#1b1b1f';
  const white = '#ffffff';
  return contrastRatio(background, black) >= contrastRatio(background, white) ? black : white;
}
