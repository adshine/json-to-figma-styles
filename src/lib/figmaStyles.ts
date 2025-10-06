import { Styles, PaintStyle, TextStyle, EffectStyle, GridStyle } from '../schema/styles';
import { convertPaintStyle } from '../converters/paintConverter';
import { convertTextStyle } from '../converters/textConverter';
import { convertEffectStyle } from '../converters/effectConverter';
import { convertGridStyle } from '../converters/gridConverter';

export interface StyleResult {
  name: string;
  type: 'paint' | 'text' | 'effect' | 'grid';
  action: 'created' | 'updated' | 'skipped';
  error?: string;
}

export interface ProcessResult {
  results: StyleResult[];
  summary: {
    created: number;
    updated: number;
    skipped: number;
    total: number;
  };
}

/**
 * Find existing style by name
 */
function findExistingStyle<T extends BaseStyle>(
  styles: T[],
  name: string
): T | null {
  return styles.find(style => style.name === name) || null;
}

/**
 * Process paint styles
 */
async function processPaintStyles(paintStyles: PaintStyle[]): Promise<StyleResult[]> {
  const results: StyleResult[] = [];
  const existingStyles = figma.getLocalPaintStyles();

  for (const paintStyle of paintStyles) {
    try {
      const existing = findExistingStyle(existingStyles, paintStyle.name);
      const paints = convertPaintStyle(paintStyle);

      if (existing) {
        existing.paints = paints as unknown as readonly Paint[];
        existing.description = paintStyle.description || '';
        results.push({
          name: paintStyle.name,
          type: 'paint',
          action: 'updated',
        });
      } else {
        const newStyle = figma.createPaintStyle();
        newStyle.name = paintStyle.name;
        newStyle.description = paintStyle.description || '';
        newStyle.paints = paints as unknown as readonly Paint[];
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
    } catch (error) {
      results.push({
        name: paintStyle.name,
        type: 'paint',
        action: 'skipped',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  return results;
}

/**
 * Process text styles
 */
async function processTextStyles(textStyles: TextStyle[]): Promise<StyleResult[]> {
  const results: StyleResult[] = [];
  const existingStyles = figma.getLocalTextStyles();

  for (const textStyle of textStyles) {
    try {
      const existing = findExistingStyle(existingStyles, textStyle.name);
      const properties = await convertTextStyle(textStyle);

      if (existing) {
        Object.assign(existing, properties);
        existing.description = textStyle.description || '';
        results.push({
          name: textStyle.name,
          type: 'text',
          action: 'updated',
        });
      } else {
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
    } catch (error) {
      results.push({
        name: textStyle.name,
        type: 'text',
        action: 'skipped',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  return results;
}

/**
 * Process effect styles
 */
async function processEffectStyles(effectStyles: EffectStyle[]): Promise<StyleResult[]> {
  const results: StyleResult[] = [];
  const existingStyles = figma.getLocalEffectStyles();

  for (const effectStyle of effectStyles) {
    try {
      const existing = findExistingStyle(existingStyles, effectStyle.name);
      const effects = convertEffectStyle(effectStyle);

      if (existing) {
        existing.effects = effects as unknown as readonly Effect[];
        existing.description = effectStyle.description || '';
        results.push({
          name: effectStyle.name,
          type: 'effect',
          action: 'updated',
        });
      } else {
        const newStyle = figma.createEffectStyle();
        newStyle.name = effectStyle.name;
        newStyle.description = effectStyle.description || '';
        newStyle.effects = effects as unknown as readonly Effect[];
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
    } catch (error) {
      results.push({
        name: effectStyle.name,
        type: 'effect',
        action: 'skipped',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  return results;
}

/**
 * Process grid styles
 */
async function processGridStyles(gridStyles: GridStyle[]): Promise<StyleResult[]> {
  const results: StyleResult[] = [];
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
      } else {
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
    } catch (error) {
      results.push({
        name: gridStyle.name,
        type: 'grid',
        action: 'skipped',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  return results;
}

/**
 * Process all styles from JSON
 */
export async function processStyles(styles: Styles): Promise<ProcessResult> {
  const results: StyleResult[] = [];

  // Process each style type
  const paintResults = await processPaintStyles(styles.paintStyles || []);
  const textResults = await processTextStyles(styles.textStyles || []);
  const effectResults = await processEffectStyles(styles.effectStyles || []);
  const gridResults = await processGridStyles(styles.gridStyles || []);

  results.push(...paintResults, ...textResults, ...effectResults, ...gridResults);

  // Calculate summary
  const summary = {
    created: results.filter(r => r.action === 'created').length,
    updated: results.filter(r => r.action === 'updated').length,
    skipped: results.filter(r => r.action === 'skipped').length,
    total: results.length,
  };

  return { results, summary };
}
