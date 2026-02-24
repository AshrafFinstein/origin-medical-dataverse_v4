import { Locator } from '@playwright/test';

const DEFAULT_HIGHLIGHT_COLOR = '#FF6B00';
const DEFAULT_HIGHLIGHT_BORDER_WIDTH = 3;
const DEFAULT_HIGHLIGHT_DURATION_MS = 2000;

export interface HighlightOptions {
  durationMs?: number;
  color?: string;
  borderWidth?: number;
}

function toRgba(color: string, alpha: number): string {
  const normalized = color.trim();
  const shortHex = normalized.match(/^#([0-9a-fA-F]{3})$/);
  if (shortHex) {
    const [r, g, b] = shortHex[1].split('').map((char) => parseInt(char + char, 16));
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  const longHex = normalized.match(/^#([0-9a-fA-F]{6})$/);
  if (longHex) {
    const hex = longHex[1];
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  return `rgba(255, 107, 0, ${alpha})`;
}

export async function highlight(
  locator: Locator,
  options: HighlightOptions = {},
): Promise<void> {
  const durationMs = options.durationMs ?? DEFAULT_HIGHLIGHT_DURATION_MS;
  const color = options.color ?? DEFAULT_HIGHLIGHT_COLOR;
  const borderWidth = options.borderWidth ?? DEFAULT_HIGHLIGHT_BORDER_WIDTH;
  const shadowWidth = Math.max(borderWidth * 2, 1);
  const shadowColor = toRgba(color, 0.35);

  await locator.scrollIntoViewIfNeeded({ timeout: 5000 });
  await locator.evaluate(
    (el, values) => {
      const node = el as HTMLElement;
      const prev = { outline: node.style.outline, boxShadow: node.style.boxShadow };

      node.style.outline = `${values.borderWidth}px solid ${values.color}`;
      node.style.boxShadow = `0 0 0 ${values.shadowWidth}px ${values.shadowColor}`;

      setTimeout(() => {
        node.style.outline = prev.outline;
        node.style.boxShadow = prev.boxShadow;
      }, values.durationMs);
    },
    { durationMs, color, borderWidth, shadowWidth, shadowColor },
  );

  await new Promise((resolve) => setTimeout(resolve, durationMs));
}
