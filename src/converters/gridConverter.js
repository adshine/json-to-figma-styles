/**
 * Convert a grid style to Figma GridLayoutGrid or RowsColsLayoutGrid
 */
export function convertGridStyle(gridStyle) {
    var _a, _b;
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
                alignment: (_a = gridStyle.alignment) !== null && _a !== void 0 ? _a : 'STRETCH',
                gutterSize: gridStyle.gutterSize,
                count: gridStyle.count,
                offset: gridStyle.margin,
                visible: true,
                color: gridStyle.color,
            };
        case 'ROWS':
            return {
                pattern: 'ROWS',
                alignment: (_b = gridStyle.alignment) !== null && _b !== void 0 ? _b : 'STRETCH',
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
