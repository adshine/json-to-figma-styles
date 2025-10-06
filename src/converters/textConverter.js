var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/**
 * Convert a text style to Figma TextStyle properties
 */
export function convertTextStyle(textStyle) {
    return __awaiter(this, void 0, void 0, function* () {
        // Load the font first
        const fontName = {
            family: textStyle.font.family,
            style: textStyle.font.style,
        };
        try {
            yield figma.loadFontAsync(fontName);
        }
        catch (error) {
            throw new Error(`Failed to load font: ${textStyle.font.family} ${textStyle.font.style}`);
        }
        const result = {
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
    });
}
