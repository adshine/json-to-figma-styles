// Inline types to avoid ES module imports
interface EffectStyle {
  effects: Array<{
    type: 'DROP_SHADOW' | 'INNER_SHADOW' | 'LAYER_BLUR' | 'BACKGROUND_BLUR';
    color?: { hex: string; opacity?: number };
    offset?: { x: number; y: number };
    radius: number;
    spread?: number;
    visible?: boolean;
    blendMode?: string;
  }>;
}

/**
 * Convert hex color to RGB values
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) {
    throw new Error(`Invalid hex color: ${hex}`);
  }
  
  return {
    r: parseInt(result[1], 16) / 255,
    g: parseInt(result[2], 16) / 255,
    b: parseInt(result[3], 16) / 255,
  };
}

/**
 * Convert an effect style to Figma Effect objects
 */
export function convertEffectStyle(effectStyle: EffectStyle): Record<string, unknown>[] {
  return effectStyle.effects.map(effect => {
    switch (effect.type) {
      case 'DROP_SHADOW':
        return {
          type: 'DROP_SHADOW',
          color: {
            ...hexToRgb(effect.color?.hex || '#000000'),
            a: effect.color?.opacity ?? 1,
          },
          offset: effect.offset || { x: 0, y: 0 },
          radius: effect.radius,
          spread: effect.spread ?? 0,
          visible: effect.visible ?? true,
          blendMode: effect.blendMode ?? 'NORMAL',
        };

      case 'INNER_SHADOW':
        return {
          type: 'INNER_SHADOW',
          color: {
            ...hexToRgb(effect.color?.hex || '#000000'),
            a: effect.color?.opacity ?? 1,
          },
          offset: effect.offset || { x: 0, y: 0 },
          radius: effect.radius,
          spread: effect.spread ?? 0,
          visible: effect.visible ?? true,
          blendMode: effect.blendMode ?? 'NORMAL',
        };

      case 'LAYER_BLUR':
        return {
          type: 'LAYER_BLUR',
          radius: effect.radius,
          visible: effect.visible ?? true,
        };

      case 'BACKGROUND_BLUR':
        return {
          type: 'BACKGROUND_BLUR',
          radius: effect.radius,
          visible: effect.visible ?? true,
        };

      default:
        throw new Error(`Unsupported effect type: ${(effect as Record<string, unknown>).type}`);
    }
  });
}
