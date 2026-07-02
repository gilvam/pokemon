/** WCAG 2.1 relative-luminance and contrast-ratio math for hex colors. */
export class ColorContrast {
  private static channelToLinear(channel: number): number {
    const ratio = channel / 255;
    return ratio <= 0.03928 ? ratio / 12.92 : Math.pow((ratio + 0.055) / 1.055, 2.4);
  }

  private static parseHex(hex: string): [number, number, number] {
    let value = hex.trim().replace('#', '');
    if (value.length === 3) {
      value = value
        .split('')
        .map((char) => char + char)
        .join('');
    }
    const red = parseInt(value.slice(0, 2), 16);
    const green = parseInt(value.slice(2, 4), 16);
    const blue = parseInt(value.slice(4, 6), 16);
    return [red, green, blue];
  }

  static relativeLuminance(hex: string): number {
    const [red, green, blue] = ColorContrast.parseHex(hex);
    const r = ColorContrast.channelToLinear(red);
    const g = ColorContrast.channelToLinear(green);
    const b = ColorContrast.channelToLinear(blue);
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }

  /** Contrast ratio between two hex colors, from 1 (identical) to 21 (black/white). */
  static ratio(foreground: string, background: string): number {
    const first = ColorContrast.relativeLuminance(foreground);
    const second = ColorContrast.relativeLuminance(background);
    const lighter = Math.max(first, second);
    const darker = Math.min(first, second);
    return (lighter + 0.05) / (darker + 0.05);
  }
}
