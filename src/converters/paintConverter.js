/**
 * Convert hex color to RGB values
 */
function hexToRgb(hex) {
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
export function convertPaintStyle(paintStyle) {
    return paintStyle.paints.map(paint => {
        var _a;
        switch (paint.type) {
            case 'solid':
                const rgb = hexToRgb(paint.hex);
                return {
                    type: 'SOLID',
                    color: rgb,
                    opacity: (_a = paint.opacity) !== null && _a !== void 0 ? _a : 1,
                };
            case 'gradient-linear':
                return {
                    type: 'GRADIENT_LINEAR',
                    gradientStops: paint.stops.map(stop => {
                        var _a;
                        return ({
                            position: stop.position,
                            color: Object.assign(Object.assign({}, hexToRgb(stop.hex)), { a: (_a = stop.opacity) !== null && _a !== void 0 ? _a : 1 }),
                        });
                    }),
                    gradientTransform: [
                        [paint.handles[0].x, paint.handles[0].y, 0],
                        [paint.handles[1].x, paint.handles[1].y, 0],
                    ],
                };
            case 'gradient-radial':
                return {
                    type: 'GRADIENT_RADIAL',
                    gradientStops: paint.stops.map(stop => {
                        var _a;
                        return ({
                            position: stop.position,
                            color: Object.assign(Object.assign({}, hexToRgb(stop.hex)), { a: (_a = stop.opacity) !== null && _a !== void 0 ? _a : 1 }),
                        });
                    }),
                    gradientTransform: [
                        [paint.handles[0].x, paint.handles[0].y, 0],
                        [paint.handles[1].x, paint.handles[1].y, 0],
                    ],
                };
            case 'gradient-angular':
                return {
                    type: 'GRADIENT_ANGULAR',
                    gradientStops: paint.stops.map(stop => {
                        var _a;
                        return ({
                            position: stop.position,
                            color: Object.assign(Object.assign({}, hexToRgb(stop.hex)), { a: (_a = stop.opacity) !== null && _a !== void 0 ? _a : 1 }),
                        });
                    }),
                    gradientTransform: [
                        [paint.handles[0].x, paint.handles[0].y, 0],
                        [paint.handles[1].x, paint.handles[1].y, 0],
                    ],
                };
            case 'gradient-diamond':
                return {
                    type: 'GRADIENT_DIAMOND',
                    gradientStops: paint.stops.map(stop => {
                        var _a;
                        return ({
                            position: stop.position,
                            color: Object.assign(Object.assign({}, hexToRgb(stop.hex)), { a: (_a = stop.opacity) !== null && _a !== void 0 ? _a : 1 }),
                        });
                    }),
                    gradientTransform: [
                        [paint.handles[0].x, paint.handles[0].y, 0],
                        [paint.handles[1].x, paint.handles[1].y, 0],
                    ],
                };
            default:
                throw new Error(`Unsupported paint type: ${paint.type}`);
        }
    });
}
