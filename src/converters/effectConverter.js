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
 * Convert an effect style to Figma Effect objects
 */
export function convertEffectStyle(effectStyle) {
    return effectStyle.effects.map(effect => {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
        switch (effect.type) {
            case 'DROP_SHADOW':
                return {
                    type: 'DROP_SHADOW',
                    color: Object.assign(Object.assign({}, hexToRgb(((_a = effect.color) === null || _a === void 0 ? void 0 : _a.hex) || '#000000')), { a: (_c = (_b = effect.color) === null || _b === void 0 ? void 0 : _b.opacity) !== null && _c !== void 0 ? _c : 1 }),
                    offset: effect.offset || { x: 0, y: 0 },
                    radius: effect.radius,
                    spread: (_d = effect.spread) !== null && _d !== void 0 ? _d : 0,
                    visible: (_e = effect.visible) !== null && _e !== void 0 ? _e : true,
                    blendMode: (_f = effect.blendMode) !== null && _f !== void 0 ? _f : 'NORMAL',
                };
            case 'INNER_SHADOW':
                return {
                    type: 'INNER_SHADOW',
                    color: Object.assign(Object.assign({}, hexToRgb(((_g = effect.color) === null || _g === void 0 ? void 0 : _g.hex) || '#000000')), { a: (_j = (_h = effect.color) === null || _h === void 0 ? void 0 : _h.opacity) !== null && _j !== void 0 ? _j : 1 }),
                    offset: effect.offset || { x: 0, y: 0 },
                    radius: effect.radius,
                    spread: (_k = effect.spread) !== null && _k !== void 0 ? _k : 0,
                    visible: (_l = effect.visible) !== null && _l !== void 0 ? _l : true,
                    blendMode: (_m = effect.blendMode) !== null && _m !== void 0 ? _m : 'NORMAL',
                };
            case 'LAYER_BLUR':
                return {
                    type: 'LAYER_BLUR',
                    radius: effect.radius,
                    visible: (_o = effect.visible) !== null && _o !== void 0 ? _o : true,
                };
            case 'BACKGROUND_BLUR':
                return {
                    type: 'BACKGROUND_BLUR',
                    radius: effect.radius,
                    visible: (_p = effect.visible) !== null && _p !== void 0 ? _p : true,
                };
            default:
                throw new Error(`Unsupported effect type: ${effect.type}`);
        }
    });
}
