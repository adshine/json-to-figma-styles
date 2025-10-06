import { TextStyle } from '../schema/styles';

/**
 * Convert a text style to Figma TextStyle properties
 */
export async function convertTextStyle(textStyle: TextStyle): Promise<{
  fontName: FontName;
  fontSize: number;
  lineHeight?: LineHeight;
  letterSpacing?: LetterSpacing;
  paragraphSpacing?: number;
  textCase?: TextCase;
  textDecoration?: TextDecoration;
}> {
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
    } as LineHeight;
  }

  // Convert letter spacing
  if (textStyle.letterSpacing) {
    result.letterSpacing = {
      unit: textStyle.letterSpacing.unit,
      value: textStyle.letterSpacing.value,
    } as LetterSpacing;
  }

  // Convert paragraph spacing
  if (textStyle.paragraphSpacing !== undefined) {
    result.paragraphSpacing = textStyle.paragraphSpacing;
  }

  // Convert text case
  if (textStyle.textCase) {
    result.textCase = textStyle.textCase as TextCase;
  }

  // Convert text decoration
  if (textStyle.textDecoration) {
    result.textDecoration = textStyle.textDecoration as TextDecoration;
  }

  return result;
}
