import { Cells } from './cells'

/**
 * Render cells
 */
export interface CellsRenderer {
  set colsCount(val: number)
  set rowsCount(val: number)
  get colsCount(): number
  get rowsCount(): number
  renderCells(cells?: Cells): void
  flashRows(rowsIndexes: number[]): void
  fillRows(): Promise<void>
}
