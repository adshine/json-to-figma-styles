import { PaintStyle, Paint } from '../schema/styles';

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
 * Convert a paint style to Figma Paint objects
 */
export function convertPaintStyle(paintStyle: PaintStyle): readonly Paint[] {
  return paintStyle.paints.map(paint => {
    switch (paint.type) {
      case 'solid':
        const rgb = hexToRgb(paint.hex);
        return {
          type: 'SOLID',
          color: rgb,
          opacity: paint.opacity ?? 1,
        } as unknown as SolidPaint;

      case 'gradient-linear':
        return {
          type: 'GRADIENT_LINEAR',
          gradientStops: paint.stops.map(stop => ({
            position: stop.position,
            color: {
              ...hexToRgb(stop.hex),
              a: stop.opacity ?? 1,
            },
          })),
          gradientTransform: [
            [paint.handles[0].x, paint.handles[0].y, 0],
            [paint.handles[1].x, paint.handles[1].y, 0],
          ],
        } as unknown as GradientPaint;

      case 'gradient-radial':
        return {
          type: 'GRADIENT_RADIAL',
          gradientStops: paint.stops.map(stop => ({
            position: stop.position,
            color: {
              ...hexToRgb(stop.hex),
              a: stop.opacity ?? 1,
            },
          })),
          gradientTransform: [
            [paint.handles[0].x, paint.handles[0].y, 0],
            [paint.handles[1].x, paint.handles[1].y, 0],
          ],
        } as unknown as GradientPaint;

      case 'gradient-angular':
        return {
          type: 'GRADIENT_ANGULAR',
          gradientStops: paint.stops.map(stop => ({
            position: stop.position,
            color: {
              ...hexToRgb(stop.hex),
              a: stop.opacity ?? 1,
            },
          })),
          gradientTransform: [
            [paint.handles[0].x, paint.handles[0].y, 0],
            [paint.handles[1].x, paint.handles[1].y, 0],
          ],
        } as unknown as GradientPaint;

      case 'gradient-diamond':
        return {
          type: 'GRADIENT_DIAMOND',
          gradientStops: paint.stops.map(stop => ({
            position: stop.position,
            color: {
              ...hexToRgb(stop.hex),
              a: stop.opacity ?? 1,
            },
          })),
          gradientTransform: [
            [paint.handles[0].x, paint.handles[0].y, 0],
            [paint.handles[1].x, paint.handles[1].y, 0],
          ],
        } as unknown as GradientPaint;

      default:
        throw new Error(`Unsupported paint type: ${(paint as any).type}`);
    }
  }) as unknown as readonly Paint[];
}
