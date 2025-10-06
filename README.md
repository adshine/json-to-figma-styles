# JSON to Figma Styles Plugin

A Figma plugin that converts JSON design tokens into Figma styles (Paint, Text, Effect, and Grid styles).

## Features

- **Paint Styles**: Convert solid colors and gradients (linear, radial, angular, diamond)
- **Text Styles**: Convert typography with font loading and validation
- **Effect Styles**: Convert shadows (drop, inner) and blur effects
- **Grid Styles**: Convert layout grids (uniform, columns, rows)
- **Idempotent**: Updates existing styles by name instead of creating duplicates
- **Validation**: Comprehensive JSON schema validation with detailed error messages
- **Sample Data**: Pre-loaded sample JSON to demonstrate all features

## Installation

1. Clone this repository
2. Install dependencies: `npm install`
3. Build the plugin: `npm run build && npm run build:ui`
4. In Figma, go to Plugins → Development → Import plugin from manifest
5. Select the `manifest.json` file

## Usage

1. Open the plugin in Figma
2. Import a JSON file using the file input or drag-and-drop
3. Validate the JSON structure
4. Preview the styles that will be created/updated
5. Click "Create/Update Styles" to process all styles
6. View the results summary

## JSON Schema

The plugin accepts a JSON file with the following structure:

```json
{
  "paintStyles": [
    {
      "name": "Brand/Primary/Blue 500",
      "description": "Main brand blue",
      "paints": [
        { "type": "solid", "hex": "#1E40AF", "opacity": 1 }
      ]
    },
    {
      "name": "Brand/Gradients/Hero Sky",
      "description": "Landing hero gradient",
      "paints": [
        {
          "type": "gradient-linear",
          "stops": [
            { "position": 0, "hex": "#60A5FA", "opacity": 1 },
            { "position": 1, "hex": "#3B82F6", "opacity": 1 }
          ],
          "handles": [
            { "x": 0, "y": 0 },
            { "x": 1, "y": 1 },
            { "x": 0, "y": 1 }
          ]
        }
      ]
    }
  ],
  "textStyles": [
    {
      "name": "Text/Heading/H1",
      "description": "Desktop H1",
      "font": { "family": "Inter", "style": "Bold" },
      "fontSize": 48,
      "lineHeight": { "unit": "PIXELS", "value": 56 },
      "letterSpacing": { "unit": "PERCENT", "value": 0 },
      "paragraphSpacing": 0,
      "textCase": "ORIGINAL",
      "textDecoration": "NONE"
    }
  ],
  "effectStyles": [
    {
      "name": "Effects/Shadows/Soft Elevation",
      "description": "Soft drop shadow",
      "effects": [
        {
          "type": "DROP_SHADOW",
          "color": { "hex": "#000000", "opacity": 0.15 },
          "offset": { "x": 0, "y": 8 },
          "radius": 24,
          "spread": 0,
          "visible": true,
          "blendMode": "NORMAL"
        }
      ]
    }
  ],
  "gridStyles": [
    {
      "name": "Grids/Desktop/12 Col",
      "description": "12-col desktop grid",
      "gridType": "COLUMNS",
      "count": 12,
      "gutterSize": 24,
      "margin": 120,
      "alignment": "STRETCH",
      "color": { "r": 0.0, "g": 0.36, "b": 1.0, "a": 0.1 }
    }
  ]
}
```

## Style Types

### Paint Styles
- **Solid**: `{ "type": "solid", "hex": "#1E40AF", "opacity": 1 }`
- **Linear Gradient**: `{ "type": "gradient-linear", "stops": [...], "handles": [...] }`
- **Radial Gradient**: `{ "type": "gradient-radial", "stops": [...], "handles": [...] }`
- **Angular Gradient**: `{ "type": "gradient-angular", "stops": [...], "handles": [...] }`
- **Diamond Gradient**: `{ "type": "gradient-diamond", "stops": [...], "handles": [...] }`

### Text Styles
- Font family and style (must be available in Figma)
- Font size, line height, letter spacing
- Text case, decoration, paragraph spacing

### Effect Styles
- **Drop Shadow**: `{ "type": "DROP_SHADOW", "color": {...}, "offset": {...}, "radius": 24, "spread": 0 }`
- **Inner Shadow**: `{ "type": "INNER_SHADOW", "color": {...}, "offset": {...}, "radius": 24, "spread": 0 }`
- **Layer Blur**: `{ "type": "LAYER_BLUR", "radius": 16 }`
- **Background Blur**: `{ "type": "BACKGROUND_BLUR", "radius": 16 }`

### Grid Styles
- **Uniform Grid**: `{ "gridType": "GRID", "size": 8, "color": {...} }`
- **Columns Grid**: `{ "gridType": "COLUMNS", "count": 12, "gutterSize": 24, "margin": 120 }`
- **Rows Grid**: `{ "gridType": "ROWS", "count": 8, "gutterSize": 20, "margin": 64 }`

## Folder Structure

Styles are organized into folders using slash-separated names:
- `Brand/Primary/Blue 500` creates a "Brand" folder with "Primary" subfolder
- `Text/Heading/H1` creates a "Text" folder with "Heading" subfolder

## Development

### Building
```bash
npm run build        # Build TypeScript
npm run build:ui     # Build React UI
npm run watch        # Watch TypeScript changes
npm run watch:ui     # Watch UI changes
```

### Project Structure
```
src/
├── schema/          # Zod validation schemas
├── converters/      # Style conversion logic
├── lib/            # Core plugin logic
├── ui/             # React UI components
└── plugin/         # Plugin entry point
```

## Known Limitations

- Fonts must be available in Figma before creating text styles
- Effect spread may not be visible on all node types
- Pattern paints are not supported
- Image and video paints are not supported

## Sample Data

The plugin includes comprehensive sample data covering:
- 25+ paint styles (brand colors, neutrals, gradients)
- 12 text styles (display, headings, body, caption)
- 10 effect styles (elevation levels, shadows, blur)
- 7 grid styles (desktop, tablet, mobile, uniform)

## License

MIT License