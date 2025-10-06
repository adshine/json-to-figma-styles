// This file holds the main code for plugins. Code in this file has access to
// the *figma document* via the figma global object.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (See https://www.figma.com/plugin-docs/how-plugins-run).

// This shows the HTML page in "ui.html".
figma.showUI(__html__, { width: 600, height: 800 });

// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
figma.ui.onmessage = async (msg: { type: string; data?: any }) => {
  try {
    switch (msg.type) {
      case 'validate-json':
        try {
          // Basic validation - check if it's a valid object with expected structure
          const data = msg.data;
          if (!data || typeof data !== 'object') {
            throw new Error('Invalid JSON: Expected an object');
          }
          
          // Check for required top-level keys
          const expectedKeys = ['paintStyles', 'textStyles', 'effectStyles', 'gridStyles'];
          const hasValidKeys = expectedKeys.some(key => Array.isArray(data[key]));
          
          if (!hasValidKeys) {
            throw new Error('Invalid JSON: Must contain at least one of paintStyles, textStyles, effectStyles, or gridStyles');
          }
          
          figma.ui.postMessage({
            type: 'validation-result',
            success: true,
            data: data,
          });
        } catch (error) {
          figma.ui.postMessage({
            type: 'validation-result',
            success: false,
            error: error instanceof Error ? error.message : 'Validation failed',
          });
        }
        break;

      case 'create-styles':
        try {
          const styles = msg.data;
          const result = await processStyles(styles);
          
          figma.ui.postMessage({
            type: 'styles-result',
            success: true,
            data: result,
          });
        } catch (error) {
          figma.ui.postMessage({
            type: 'styles-result',
            success: false,
            error: error instanceof Error ? error.message : 'Failed to create styles',
          });
        }
        break;

      case 'cancel':
        figma.closePlugin();
        break;

      default:
        console.warn('Unknown message type:', msg.type);
    }
  } catch (error) {
    figma.ui.postMessage({
      type: 'error',
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    });
  }
};

// Helper function to convert hex to RGB
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

// Helper function to find existing style by name
function findExistingStyle<T extends BaseStyle>(
  styles: T[],
  name: string
): T | null {
  return styles.find(style => style.name === name) || null;
}

// Process paint styles
async function processPaintStyles(paintStyles: any[]): Promise<any[]> {
  const results: any[] = [];
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

// Convert paint style to Figma Paint objects
function convertPaintStyle(paintStyle: any): any[] {
  return paintStyle.paints.map((paint: any) => {
    switch (paint.type) {
      case 'solid':
        const rgb = hexToRgb(paint.hex);
        return {
          type: 'SOLID',
          color: rgb,
          opacity: paint.opacity ?? 1,
        };

      case 'gradient-linear':
        return {
          type: 'GRADIENT_LINEAR',
          gradientStops: paint.stops.map((stop: any) => ({
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
        };

      case 'gradient-radial':
        return {
          type: 'GRADIENT_RADIAL',
          gradientStops: paint.stops.map((stop: any) => ({
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
        };

      case 'gradient-angular':
        return {
          type: 'GRADIENT_ANGULAR',
          gradientStops: paint.stops.map((stop: any) => ({
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
        };

      case 'gradient-diamond':
        return {
          type: 'GRADIENT_DIAMOND',
          gradientStops: paint.stops.map((stop: any) => ({
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
        };

      default:
        throw new Error(`Unsupported paint type: ${paint.type}`);
    }
  });
}

// Process text styles
async function processTextStyles(textStyles: any[]): Promise<any[]> {
  const results: any[] = [];
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

// Convert text style to Figma TextStyle properties
async function convertTextStyle(textStyle: any): Promise<any> {
  // Load the font first
  const fontName: FontName = {
    family: textStyle.font.family,
    style: textStyle.font.style,
  };

  try {
    await figma.loadFontAsync(fontName);
  } catch (error) {
    throw new Error(`Failed to load font: ${textStyle.font.family} ${textStyle.font.style}`);
  }

  const result: any = {
    fontName,
    fontSize: textStyle.fontSize,
  };

  // Convert line height
  if (textStyle.lineHeight) {
    result.lineHeight = {
      unit: textStyle.lineHeight.unit,
      value: textStyle.lineHeight.value,
    };
  }

  // Convert letter spacing
  if (textStyle.letterSpacing) {
    result.letterSpacing = {
      unit: textStyle.letterSpacing.unit,
      value: textStyle.letterSpacing.value,
    };
  }

  // Convert paragraph spacing
  if (textStyle.paragraphSpacing !== undefined) {
    result.paragraphSpacing = textStyle.paragraphSpacing;
  }

  // Convert text case
  if (textStyle.textCase) {
    result.textCase = textStyle.textCase;
  }

  // Convert text decoration
  if (textStyle.textDecoration) {
    result.textDecoration = textStyle.textDecoration;
  }

  return result;
}

// Process effect styles
async function processEffectStyles(effectStyles: any[]): Promise<any[]> {
  const results: any[] = [];
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

// Convert effect style to Figma Effect objects
function convertEffectStyle(effectStyle: any): any[] {
  return effectStyle.effects.map((effect: any) => {
    switch (effect.type) {
      case 'DROP_SHADOW':
        return {
          type: 'DROP_SHADOW',
          color: {
            ...hexToRgb(effect.color.hex),
            a: effect.color.opacity ?? 1,
          },
          offset: {
            x: effect.offset.x,
            y: effect.offset.y,
          },
          radius: effect.radius,
          spread: effect.spread ?? 0,
          visible: effect.visible ?? true,
          blendMode: effect.blendMode ?? 'NORMAL',
        };

      case 'INNER_SHADOW':
        return {
          type: 'INNER_SHADOW',
          color: {
            ...hexToRgb(effect.color.hex),
            a: effect.color.opacity ?? 1,
          },
          offset: {
            x: effect.offset.x,
            y: effect.offset.y,
          },
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
        throw new Error(`Unsupported effect type: ${effect.type}`);
    }
  });
}

// Process grid styles
async function processGridStyles(gridStyles: any[]): Promise<any[]> {
  const results: any[] = [];
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

// Convert grid style to Figma GridLayoutGrid or RowsColsLayoutGrid
function convertGridStyle(gridStyle: any): any {
  switch (gridStyle.gridType) {
    case 'GRID':
      return {
        pattern: 'GRID',
        sectionSize: gridStyle.size,
        visible: true,
        color: gridStyle.color,
      };

    case 'COLUMNS':
      return {
        pattern: 'COLUMNS',
        alignment: gridStyle.alignment ?? 'STRETCH',
        gutterSize: gridStyle.gutterSize,
        count: gridStyle.count,
        offset: gridStyle.margin,
        visible: true,
        color: gridStyle.color,
      };

    case 'ROWS':
      return {
        pattern: 'ROWS',
        alignment: gridStyle.alignment ?? 'STRETCH',
        gutterSize: gridStyle.gutterSize,
        count: gridStyle.count,
        offset: gridStyle.margin,
        visible: true,
        color: gridStyle.color,
      };

    default:
      throw new Error(`Unsupported grid type: ${gridStyle.gridType}`);
  }
}

// Process all styles from JSON
async function processStyles(styles: any): Promise<any> {
  const results: any[] = [];

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
