# JSON to Figma Styles

**Sync your design tokens with Figma in seconds**

## What is this plugin?

Convert your design tokens from JSON format into native Figma styles automatically. This plugin helps you maintain consistency between your codebase and design files by importing color palettes, typography, effects, and grid systems directly into Figma.

## What can you do with it?

- **Import Paint Styles**: Convert color tokens (solid colors and gradients) into Figma paint styles
- **Import Text Styles**: Transform typography tokens into Figma text styles with fonts, sizes, line heights, and more
- **Import Effect Styles**: Create shadow and blur effects from your design system
- **Import Grid Styles**: Set up layout grids based on your grid system specifications
- **Batch Processing**: Import multiple styles at once instead of creating them manually one by one
- **Update Existing Styles**: Automatically update styles that already exist in your file

## Who is this for?

- Design system managers maintaining consistency across design and code
- Frontend developers who want to sync design tokens with Figma
- Design teams working with design-to-code workflows
- Anyone who needs to quickly create multiple Figma styles from structured data

## How to use

### 1. Open the plugin
Go to **Plugins → JSON to Figma Styles** in your Figma file

### 2. Choose your import method

**Option A: Upload File**
- Click "Upload File" tab
- Drag and drop your JSON file, or click to browse
- The plugin will automatically validate your JSON

**Option B: Paste Data**
- Click "Paste Data" tab
- Paste your JSON code into the text area
- Click "Validate JSON" to check your data

### 3. Review your styles
After validation, you'll see a summary showing:
- 🎨 Number of paint styles to create
- 📝 Number of text styles to create
- ✨ Number of effect styles to create
- 📐 Number of grid styles to create

### 4. Click "Generate Styles"
The plugin will create or update all your Figma styles automatically!

### 5. Check the results
You'll see a success message with:
- ✓ How many styles were created
- ✓ How many styles were updated
- ⚠ How many styles were skipped (if any errors occurred)

## Need help getting started?

Click **"Copy Sample Data"** in the plugin to get example JSON structure. Paste it into your code editor to see the required format, then customize it with your own design tokens.

## JSON Structure Example

```json
{
  "paintStyles": [
    {
      "name": "Brand/Primary/Blue 500",
      "description": "Main brand blue",
      "paints": [
        {
          "type": "solid",
          "hex": "#1E40AF",
          "opacity": 1
        }
      ]
    }
  ],
  "textStyles": [
    {
      "name": "Text/Heading/H1",
      "description": "Desktop H1",
      "font": {
        "family": "Inter",
        "style": "Bold"
      },
      "fontSize": 48,
      "lineHeight": {
        "unit": "PIXELS",
        "value": 56
      }
    }
  ],
  "effectStyles": [
    {
      "name": "Effects/Shadows/Soft",
      "description": "Soft drop shadow",
      "effects": [
        {
          "type": "DROP_SHADOW",
          "color": {
            "hex": "#000000",
            "opacity": 0.15
          },
          "offset": { "x": 0, "y": 8 },
          "radius": 24
        }
      ]
    }
  ],
  "gridStyles": [
    {
      "name": "Grids/Desktop/12 Col",
      "description": "12-column desktop grid",
      "gridType": "COLUMNS",
      "count": 12,
      "gutterSize": 24,
      "margin": 120
    }
  ]
}
```

## Tips

✅ **Organize with naming**: Use forward slashes (/) in style names to create organized folders (e.g., "Brand/Primary/Blue")

✅ **Update safely**: The plugin will update existing styles with matching names, so you can re-import to sync changes

✅ **Start small**: Test with a few styles first to make sure your JSON structure is correct

✅ **Check fonts**: Make sure all fonts referenced in textStyles are available in Figma

## Supported Style Types

### Paint Styles
- Solid colors
- Linear gradients
- Radial gradients
- Angular gradients
- Diamond gradients

### Text Styles
- Font family and style
- Font size
- Line height
- Letter spacing
- Paragraph spacing
- Text case
- Text decoration

### Effect Styles
- Drop shadows
- Inner shadows
- Layer blur
- Background blur

### Grid Styles
- Column grids
- Row grids
- Grid patterns
- Custom gutters and margins

---

**Questions or issues?** This plugin helps bridge the gap between your design system code and Figma, making it easier to keep your designs and development in sync.
