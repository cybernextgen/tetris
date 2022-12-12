import { Cells } from '../models/cells'
import { CellsRenderer } from '../models/cells_renderer'

/**
 * Contains figure preview logic
 */
export class FiguresPreviewController {
  private cells: Cells
  private renderer: CellsRenderer

  constructor()
  /**
   * Construct object using predefined Cells instance
   * @param cells Cells object instance
   */
  constructor(cells: Cells)
  /**
   * Construct object using two dimentions
   * @param rowsCount
   * @param colsCount
   */
  constructor(colsCount: number, rowsCount: number)
  constructor(...args: any[]) {
    if (args.length === 1) {
      this.cells = args[0]
    } else if (args.length === 2) {
      this.cells = new Cells(args[0], args[1])
    }
  }

  /**
   * Setter for canvas renderer
   * @param renderer instance of CellsRenderer interface implementation
   */
  setCanvasRenderer(renderer: CellsRenderer) {
    this.renderer = renderer
    this.updateRendererDimensions()
  }

  /**
   * Update renderer internal dimensions
   */
  private updateRendererDimensions() {
    if (this.renderer && this.cells) {
      this.renderer.colsCount = this.cells.colsCount
      this.renderer.rowsCount = this.cells.rowsCount
    }
  }

  private render() {
    if (this.renderer) {
      this.renderer.renderCells(this.cells)
    }
  }

  /**
   * Arranges cells evenly on internal cells instance
   * @param figures array of Cells instances
   */
  insertFigures(...figures: Cells[]) {
    let maxCols = 0
    let maxRows = 0

    for (let figure of figures) {
      if (figure.colsCount > maxCols) {
        maxCols = figure.colsCount
      }
      if (figure.rowsCount > maxRows) {
        maxRows = figure.rowsCount
      }
    }

    const figuresPerCol = Math.ceil(Math.sqrt(figures.length))
    const rowsCount = Math.ceil(figures.length / figuresPerCol)

    this.cells = new Cells(
      figuresPerCol * maxCols + figuresPerCol - 1,
      rowsCount * maxRows + rowsCount - 1
    )

    let currentCol = 0
    let currentRow = 0
    let currentRowFiguresCount = 0

    for (let figureIndex = 0; figureIndex < figures.length; figureIndex++) {
      const currentFigure = figures[figureIndex]
      this.cells = this.cells.mergeWithCells(
        currentFigure,
        currentCol,
        currentRow
      )
      currentRowFiguresCount += 1

      currentCol = currentCol + maxCols + 1
      if (currentRowFiguresCount === figuresPerCol) {
        currentCol = 0
        currentRowFiguresCount = 0
        currentRow = currentRow + maxRows + 1
      }
    }

    this.updateRendererDimensions()
    this.render()
  }
}
