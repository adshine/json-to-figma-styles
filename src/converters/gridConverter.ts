import { GridStyle } from '../schema/styles';

/**
 * Convert a grid style to Figma GridLayoutGrid or RowsColsLayoutGrid
 */
export function convertGridStyle(gridStyle: GridStyle): GridLayoutGrid | RowsColsLayoutGrid {
  switch (gridStyle.gridType) {
    case 'GRID':
      return {
        pattern: 'GRID',
        sectionSize: gridStyle.size,
        visible: true,
        color: gridStyle.color,
      } as GridLayoutGrid;

    case 'COLUMNS':
      return {
        pattern: 'COLUMNS',
        alignment: gridStyle.alignment ?? 'STRETCH',
        gutterSize: gridStyle.gutterSize,
        count: gridStyle.count,
        offset: gridStyle.margin,
        visible: true,
        color: gridStyle.color,
      } as RowsColsLayoutGrid;

    case 'ROWS':
      return {
        pattern: 'ROWS',
        alignment: gridStyle.alignment ?? 'STRETCH',
        gutterSize: gridStyle.gutterSize,
        count: gridStyle.count,
        offset: gridStyle.margin,
        visible: true,
        color: gridStyle.color,
      } as RowsColsLayoutGrid;

    default:
      throw new Error(`Unsupported grid type: ${(gridStyle as any).gridType}`);
  }
}
