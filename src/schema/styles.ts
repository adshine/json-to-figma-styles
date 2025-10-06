import { z } from 'zod';

// Color schema
const ColorSchema = z.object({
  hex: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color format'),
  opacity: z.number().min(0).max(1).optional().default(1),
});

// Vector schema for gradient handles
const VectorSchema = z.object({
  x: z.number(),
  y: z.number(),
});

// Gradient stop schema
const GradientStopSchema = z.object({
  position: z.number().min(0).max(1),
  hex: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color format'),
  opacity: z.number().min(0).max(1).optional().default(1),
});

// Paint schemas
const SolidPaintSchema = z.object({
  type: z.literal('solid'),
  hex: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color format'),
  opacity: z.number().min(0).max(1).optional().default(1),
});

const GradientLinearPaintSchema = z.object({
  type: z.literal('gradient-linear'),
  stops: z.array(GradientStopSchema).min(2),
  handles: z.array(VectorSchema).length(3),
});

const GradientRadialPaintSchema = z.object({
  type: z.literal('gradient-radial'),
  stops: z.array(GradientStopSchema).min(2),
  handles: z.array(VectorSchema).length(3),
});

const GradientAngularPaintSchema = z.object({
  type: z.literal('gradient-angular'),
  stops: z.array(GradientStopSchema).min(2),
  handles: z.array(VectorSchema).length(3),
});

const GradientDiamondPaintSchema = z.object({
  type: z.literal('gradient-diamond'),
  stops: z.array(GradientStopSchema).min(2),
  handles: z.array(VectorSchema).length(3),
});

const PaintSchema = z.discriminatedUnion('type', [
  SolidPaintSchema,
  GradientLinearPaintSchema,
  GradientRadialPaintSchema,
  GradientAngularPaintSchema,
  GradientDiamondPaintSchema,
]);

// Paint style schema
const PaintStyleSchema = z.object({
  name: z.string().min(1, 'Style name is required'),
  description: z.string().optional(),
  paints: z.array(PaintSchema).min(1, 'At least one paint is required'),
});

// Font schema
const FontSchema = z.object({
  family: z.string().min(1, 'Font family is required'),
  style: z.string().min(1, 'Font style is required'),
});

// Line height schema
const LineHeightSchema = z.object({
  unit: z.enum(['PIXELS', 'PERCENT']),
  value: z.number(),
});

// Letter spacing schema
const LetterSpacingSchema = z.object({
  unit: z.enum(['PIXELS', 'PERCENT']),
  value: z.number(),
});

// Text style schema
const TextStyleSchema = z.object({
  name: z.string().min(1, 'Style name is required'),
  description: z.string().optional(),
  font: FontSchema,
  fontSize: z.number().positive('Font size must be positive'),
  lineHeight: LineHeightSchema.optional(),
  letterSpacing: LetterSpacingSchema.optional(),
  paragraphSpacing: z.number().min(0).optional().default(0),
  textCase: z.enum(['ORIGINAL', 'UPPER', 'LOWER', 'TITLE']).optional().default('ORIGINAL'),
  textDecoration: z.enum(['NONE', 'UNDERLINE', 'STRIKETHROUGH']).optional().default('NONE'),
});

// Effect schemas
const DropShadowEffectSchema = z.object({
  type: z.literal('DROP_SHADOW'),
  color: ColorSchema,
  offset: z.object({
    x: z.number(),
    y: z.number(),
  }),
  radius: z.number().min(0),
  spread: z.number().min(0).optional().default(0),
  visible: z.boolean().optional().default(true),
  blendMode: z.enum(['NORMAL', 'MULTIPLY', 'SCREEN', 'OVERLAY', 'SOFT_LIGHT', 'HARD_LIGHT', 'COLOR_DODGE', 'COLOR_BURN', 'DARKEN', 'LIGHTEN', 'DIFFERENCE', 'EXCLUSION', 'HUE', 'SATURATION', 'COLOR', 'LUMINOSITY']).optional().default('NORMAL'),
});

const InnerShadowEffectSchema = z.object({
  type: z.literal('INNER_SHADOW'),
  color: ColorSchema,
  offset: z.object({
    x: z.number(),
    y: z.number(),
  }),
  radius: z.number().min(0),
  spread: z.number().min(0).optional().default(0),
  visible: z.boolean().optional().default(true),
  blendMode: z.enum(['NORMAL', 'MULTIPLY', 'SCREEN', 'OVERLAY', 'SOFT_LIGHT', 'HARD_LIGHT', 'COLOR_DODGE', 'COLOR_BURN', 'DARKEN', 'LIGHTEN', 'DIFFERENCE', 'EXCLUSION', 'HUE', 'SATURATION', 'COLOR', 'LUMINOSITY']).optional().default('NORMAL'),
});

const LayerBlurEffectSchema = z.object({
  type: z.literal('LAYER_BLUR'),
  radius: z.number().min(0),
  visible: z.boolean().optional().default(true),
});

const BackgroundBlurEffectSchema = z.object({
  type: z.literal('BACKGROUND_BLUR'),
  radius: z.number().min(0),
  visible: z.boolean().optional().default(true),
});

const EffectSchema = z.discriminatedUnion('type', [
  DropShadowEffectSchema,
  InnerShadowEffectSchema,
  LayerBlurEffectSchema,
  BackgroundBlurEffectSchema,
]);

// Effect style schema
const EffectStyleSchema = z.object({
  name: z.string().min(1, 'Style name is required'),
  description: z.string().optional(),
  effects: z.array(EffectSchema).min(1, 'At least one effect is required'),
});

// Grid style schemas
const UniformGridSchema = z.object({
  name: z.string().min(1, 'Style name is required'),
  description: z.string().optional(),
  gridType: z.literal('GRID'),
  size: z.number().positive('Grid size must be positive'),
  color: z.object({
    r: z.number().min(0).max(1),
    g: z.number().min(0).max(1),
    b: z.number().min(0).max(1),
    a: z.number().min(0).max(1),
  }),
});

const ColumnsGridSchema = z.object({
  name: z.string().min(1, 'Style name is required'),
  description: z.string().optional(),
  gridType: z.literal('COLUMNS'),
  count: z.number().positive('Column count must be positive'),
  gutterSize: z.number().min(0),
  margin: z.number().min(0),
  alignment: z.enum(['MIN', 'CENTER', 'MAX', 'STRETCH']).optional().default('STRETCH'),
  color: z.object({
    r: z.number().min(0).max(1),
    g: z.number().min(0).max(1),
    b: z.number().min(0).max(1),
    a: z.number().min(0).max(1),
  }),
});

const RowsGridSchema = z.object({
  name: z.string().min(1, 'Style name is required'),
  description: z.string().optional(),
  gridType: z.literal('ROWS'),
  count: z.number().positive('Row count must be positive'),
  gutterSize: z.number().min(0),
  margin: z.number().min(0),
  alignment: z.enum(['MIN', 'CENTER', 'MAX', 'STRETCH']).optional().default('STRETCH'),
  color: z.object({
    r: z.number().min(0).max(1),
    g: z.number().min(0).max(1),
    b: z.number().min(0).max(1),
    a: z.number().min(0).max(1),
  }),
});

const GridStyleSchema = z.discriminatedUnion('gridType', [
  UniformGridSchema,
  ColumnsGridSchema,
  RowsGridSchema,
]);

// Main schema
export const StylesSchema = z.object({
  paintStyles: z.array(PaintStyleSchema).optional().default([]),
  textStyles: z.array(TextStyleSchema).optional().default([]),
  effectStyles: z.array(EffectStyleSchema).optional().default([]),
  gridStyles: z.array(GridStyleSchema).optional().default([]),
});

// Export types
export type Styles = z.infer<typeof StylesSchema>;
export type PaintStyle = z.infer<typeof PaintStyleSchema>;
export type TextStyle = z.infer<typeof TextStyleSchema>;
export type EffectStyle = z.infer<typeof EffectStyleSchema>;
export type GridStyle = z.infer<typeof GridStyleSchema>;
export type Paint = z.infer<typeof PaintSchema>;
export type Effect = z.infer<typeof EffectSchema>;
