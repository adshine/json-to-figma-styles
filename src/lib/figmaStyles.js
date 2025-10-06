var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { convertPaintStyle } from '../converters/paintConverter';
import { convertTextStyle } from '../converters/textConverter';
import { convertEffectStyle } from '../converters/effectConverter';
import { convertGridStyle } from '../converters/gridConverter';
/**
 * Find existing style by name
 */
function findExistingStyle(styles, name) {
    return styles.find(style => style.name === name) || null;
}
/**
 * Process paint styles
 */
function processPaintStyles(paintStyles) {
    return __awaiter(this, void 0, void 0, function* () {
        const results = [];
        const existingStyles = figma.getLocalPaintStyles();
        for (const paintStyle of paintStyles) {
            try {
                const existing = findExistingStyle(existingStyles, paintStyle.name);
                const paints = convertPaintStyle(paintStyle);
                if (existing) {
                    existing.paints = paints;
                    existing.description = paintStyle.description || '';
                    results.push({
                        name: paintStyle.name,
                        type: 'paint',
                        action: 'updated',
                    });
                }
                else {
                    const newStyle = figma.createPaintStyle();
                    newStyle.name = paintStyle.name;
                    newStyle.description = paintStyle.description || '';
                    newStyle.paints = paints;
                    results.push({
                        name: paintStyle.name,
                        type: 'paint',
                        action: 'created',
                    });
                }
                // Store metadata
                const style = existing || figma.getLocalPaintStyles().find(s => s.name === paintStyle.name);
                if (style) {
                    style.setPluginData('source', JSON.stringify(paintStyle));
                    style.setPluginData('json2styles-version', '1.0.0');
                }
            }
            catch (error) {
                results.push({
                    name: paintStyle.name,
                    type: 'paint',
                    action: 'skipped',
                    error: error instanceof Error ? error.message : 'Unknown error',
                });
            }
        }
        return results;
    });
}
/**
 * Process text styles
 */
function processTextStyles(textStyles) {
    return __awaiter(this, void 0, void 0, function* () {
        const results = [];
        const existingStyles = figma.getLocalTextStyles();
        for (const textStyle of textStyles) {
            try {
                const existing = findExistingStyle(existingStyles, textStyle.name);
                const properties = yield convertTextStyle(textStyle);
                if (existing) {
                    Object.assign(existing, properties);
                    existing.description = textStyle.description || '';
                    results.push({
                        name: textStyle.name,
                        type: 'text',
                        action: 'updated',
                    });
                }
                else {
                    const newStyle = figma.createTextStyle();
                    newStyle.name = textStyle.name;
                    newStyle.description = textStyle.description || '';
                    Object.assign(newStyle, properties);
                    results.push({
                        name: textStyle.name,
                        type: 'text',
                        action: 'created',
                    });
                }
                // Store metadata
                const style = existing || figma.getLocalTextStyles().find(s => s.name === textStyle.name);
                if (style) {
                    style.setPluginData('source', JSON.stringify(textStyle));
                    style.setPluginData('json2styles-version', '1.0.0');
                }
            }
            catch (error) {
                results.push({
                    name: textStyle.name,
                    type: 'text',
                    action: 'skipped',
                    error: error instanceof Error ? error.message : 'Unknown error',
                });
            }
        }
        return results;
    });
}
/**
 * Process effect styles
 */
function processEffectStyles(effectStyles) {
    return __awaiter(this, void 0, void 0, function* () {
        const results = [];
        const existingStyles = figma.getLocalEffectStyles();
        for (const effectStyle of effectStyles) {
            try {
                const existing = findExistingStyle(existingStyles, effectStyle.name);
                const effects = convertEffectStyle(effectStyle);
                if (existing) {
                    existing.effects = effects;
                    existing.description = effectStyle.description || '';
                    results.push({
                        name: effectStyle.name,
                        type: 'effect',
                        action: 'updated',
                    });
                }
                else {
                    const newStyle = figma.createEffectStyle();
                    newStyle.name = effectStyle.name;
                    newStyle.description = effectStyle.description || '';
                    newStyle.effects = effects;
                    results.push({
                        name: effectStyle.name,
                        type: 'effect',
                        action: 'created',
                    });
                }
                // Store metadata
                const style = existing || figma.getLocalEffectStyles().find(s => s.name === effectStyle.name);
                if (style) {
                    style.setPluginData('source', JSON.stringify(effectStyle));
                    style.setPluginData('json2styles-version', '1.0.0');
                }
            }
            catch (error) {
                results.push({
                    name: effectStyle.name,
                    type: 'effect',
                    action: 'skipped',
                    error: error instanceof Error ? error.message : 'Unknown error',
                });
            }
        }
        return results;
    });
}
/**
 * Process grid styles
 */
function processGridStyles(gridStyles) {
    return __awaiter(this, void 0, void 0, function* () {
        const results = [];
        const existingStyles = figma.getLocalGridStyles();
        for (const gridStyle of gridStyles) {
            try {
                const existing = findExistingStyle(existingStyles, gridStyle.name);
                const layoutGrid = convertGridStyle(gridStyle);
                if (existing) {
                    existing.layoutGrids = [layoutGrid];
                    existing.description = gridStyle.description || '';
                    results.push({
                        name: gridStyle.name,
                        type: 'grid',
                        action: 'updated',
                    });
                }
                else {
                    const newStyle = figma.createGridStyle();
                    newStyle.name = gridStyle.name;
                    newStyle.description = gridStyle.description || '';
                    newStyle.layoutGrids = [layoutGrid];
                    results.push({
                        name: gridStyle.name,
                        type: 'grid',
                        action: 'created',
                    });
                }
                // Store metadata
                const style = existing || figma.getLocalGridStyles().find(s => s.name === gridStyle.name);
                if (style) {
                    style.setPluginData('source', JSON.stringify(gridStyle));
                    style.setPluginData('json2styles-version', '1.0.0');
                }
            }
            catch (error) {
                results.push({
                    name: gridStyle.name,
                    type: 'grid',
                    action: 'skipped',
                    error: error instanceof Error ? error.message : 'Unknown error',
                });
            }
        }
        return results;
    });
}
/**
 * Process all styles from JSON
 */
export function processStyles(styles) {
    return __awaiter(this, void 0, void 0, function* () {
        const results = [];
        // Process each style type
        const paintResults = yield processPaintStyles(styles.paintStyles || []);
        const textResults = yield processTextStyles(styles.textStyles || []);
        const effectResults = yield processEffectStyles(styles.effectStyles || []);
        const gridResults = yield processGridStyles(styles.gridStyles || []);
        results.push(...paintResults, ...textResults, ...effectResults, ...gridResults);
        // Calculate summary
        const summary = {
            created: results.filter(r => r.action === 'created').length,
            updated: results.filter(r => r.action === 'updated').length,
            skipped: results.filter(r => r.action === 'skipped').length,
            total: results.length,
        };
        return { results, summary };
    });
}
