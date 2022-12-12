import { Cells } from '../models/cells'
import { SettingsLoader } from '../utils/settings_loader'
import { CellsRenderer } from '../models/cells_renderer'

/**
 * Two dimension point dataclass
 */
class Point {
  constructor(public readonly x: number, public readonly y: number) {}
}

/**
 * HTMLCanvas CellsRenderer implementation
 */
export class CanvasCellsRenderer implements CellsRenderer {
  private settings: SettingsLoader
  private canvas: HTMLCanvasElement
  private canvas2DContext: CanvasRenderingContext2D

  private cellWidthInPixels: number
  private cellHeightInPixels: number
  // Cell divided on 4 units both height and width
  private readonly cellUnitsCount = 6
  private cellUnitWidthInPixels: number
  private cellUnitHeightInPixels: number

  private canvasWidthInPixels: number
  private canvasHeightInPixels: number
  private xOffset = 0
  private yOffset = 0

  private colsCountInternal: number
  private rowsCountInternal: number

  private cells: Cells = new Cells(0, 0)

  /**
   * @param canvasSelector selector for HTMLCanvas instance
   * @param keepAspectRatio preserve 1:1 aspect ratio
   */
  constructor(
    private readonly canvasSelector: string,
    private readonly keepAspectRatio: boolean = false,
    private readonly renderActualBounds = false
  ) {
    this.canvas = document.querySelector(canvasSelector)
    if (this.canvas === null) {
      throw new Error(
        `Canvas with selector ${canvasSelector} not present in document!`
      )
    }

    this.canvas2DContext = this.canvas.getContext('2d')
    window.addEventListener(
      'resize',
      this.debounce(() => {
        this.calculateDimensions()
      })
    )
    this.settings = SettingsLoader.getSettings()
  }

  private debounce(func: Function, time: number = 100) {
    let timer: number
    return function (event: Event) {
      if (timer) clearTimeout(timer)
      timer = setTimeout(func, time, event)
    }
  }

  /**
   * Recalculate canvas geometric parameters
   */
  private calculateDimensions() {
    const clientWidth = this.canvas.clientWidth
    const clientHeight = this.canvas.clientHeight
    if (
      this.canvas.width != clientWidth ||
      this.canvas.height != clientHeight
    ) {
      this.canvas.width = clientWidth
      this.canvas.height = clientHeight
    }

    this.canvasWidthInPixels = clientWidth
    this.canvasHeightInPixels = clientHeight

    if (this.keepAspectRatio) {
      const cellWidth = Math.floor(
        this.canvasWidthInPixels / this.colsCountInternal
      )

      const cellHeight = Math.floor(
        this.canvasHeightInPixels / this.rowsCountInternal
      )

      let cellSize = cellWidth
      if (cellWidth > cellHeight) {
        cellSize = cellHeight
      }

      this.cellHeightInPixels = cellSize
      this.cellWidthInPixels = cellSize
      this.cellUnitWidthInPixels = Math.floor(cellSize / this.cellUnitsCount)
      this.cellUnitHeightInPixels = this.cellUnitWidthInPixels
    } else {
      this.cellWidthInPixels = Math.floor(
        this.canvasWidthInPixels / this.colsCountInternal
      )

      this.cellHeightInPixels = Math.floor(
        this.canvasHeightInPixels / this.rowsCountInternal
      )

      this.cellUnitWidthInPixels = Math.floor(
        this.cellWidthInPixels / this.cellUnitsCount
      )
      this.cellUnitHeightInPixels = Math.floor(
        this.cellHeightInPixels / this.cellUnitsCount
      )
    }

    this.renderCells()
  }

  /**
   * Canvas columns count
   */
  public set colsCount(val: number) {
    this.colsCountInternal = val
    this.calculateDimensions()
  }

  /**
   * Canvas rows count
   */
  public set rowsCount(val: number) {
    this.rowsCountInternal = val
    this.calculateDimensions()
  }

  /**
   * Canvas columns count
   */
  get colsCount() {
    return this.colsCountInternal
  }

  /**
   * Canvas rows count
   */
  get rowsCount() {
    return this.rowsCountInternal
  }

  /**
   * Renders cells instance, if supplied. If not, renders internal cells object
   * @param cells optional, cells instance
   */
  renderCells(cells?: Cells) {
    if (cells) {
      this.cells = cells
    }

    if (this.keepAspectRatio) {
      this.xOffset = Math.round(
        (this.canvasWidthInPixels - this.cellWidthInPixels * this.colsCount) / 2
      )
      this.yOffset = Math.round(
        (this.canvasHeightInPixels - this.cellHeightInPixels * this.rowsCount) /
          2
      )
    }

    this.canvas2DContext.fillStyle = this.addHashToColorString(
      this.settings.GAME_FIELD_BACKGROUND_COLOR
    )

    if (this.renderActualBounds) {
      const actualWidthInPixels = this.canvasWidthInPixels - 2 * this.xOffset
      const actualHeightInPixels = this.canvasHeightInPixels - 2 * this.yOffset

      this.canvas2DContext.clearRect(
        this.xOffset,
        this.yOffset,
        actualWidthInPixels,
        actualHeightInPixels
      )
      this.canvas2DContext.fillRect(
        this.xOffset,
        this.yOffset,
        actualWidthInPixels,
        actualHeightInPixels
      )
    } else {
      this.canvas2DContext.clearRect(
        0,
        0,
        this.canvasWidthInPixels,
        this.canvasHeightInPixels
      )
      this.canvas2DContext.fillRect(
        0,
        0,
        this.canvasWidthInPixels,
        this.canvasHeightInPixels
      )
    }

    for (let rowIndex = 0; rowIndex < this.cells.rowsCount; rowIndex++) {
      for (let colIndex = 0; colIndex < this.cells.colsCount; colIndex++) {
        this.renderSingleCell(
          colIndex,
          rowIndex,
          this.cells.getCell(colIndex, rowIndex)
        )
      }
    }
  }

  /**
   * Appends hash char to color string
   * @param colorString HEX RGB color string
   * @returns color string with leading hash char
   */
  private addHashToColorString(colorString: string): string {
    return `#${colorString}`
  }

  /**
   * Renders single cell
   * @param colIndex cell column index
   * @param rowIndex cell row index
   * @param cell color index
   */
  private renderSingleCell(colIndex: number, rowIndex: number, cell: number) {
    if (!cell) return

    const yCoord = this.getYForRow(rowIndex)
    const xCoord = this.getXForCol(colIndex)
    const baseColor = this.settings.FIGURE_COLORS[cell]

    this.canvas2DContext.fillStyle = this.addHashToColorString(baseColor)
    this.canvas2DContext.fillRect(
      xCoord,
      yCoord,
      this.cellWidthInPixels,
      this.cellHeightInPixels
    )

    const p1 = new Point(xCoord, yCoord)
    const p2 = new Point(xCoord + this.cellWidthInPixels, yCoord)
    const p3 = new Point(p2.x, yCoord + this.cellHeightInPixels)
    const p4 = new Point(xCoord, p3.y)
    const p5 = new Point(
      xCoord + this.cellUnitWidthInPixels,
      yCoord + this.cellUnitHeightInPixels
    )
    const p6 = new Point(
      xCoord + this.cellWidthInPixels - this.cellUnitWidthInPixels,
      p5.y
    )
    const p7 = new Point(
      p6.x,
      yCoord + this.cellHeightInPixels - this.cellUnitWidthInPixels
    )
    const p8 = new Point(p5.x, p7.y)

    this.drawQuadrangle(p1, p5, p8, p4, this.addAlphaToWhiteColor(0.1))
    this.drawQuadrangle(p1, p5, p6, p2, this.addAlphaToWhiteColor(0.5))
    this.drawQuadrangle(p2, p6, p7, p3, 'rgba(0,0,0, 0.1)')
    this.drawQuadrangle(p3, p7, p8, p4, 'rgba(0,0,0, 0.5)')
  }

  /**
   * Flash rows effect, using when rows collapsing
   * @param rowsIndexes indexes of rows to be flashed
   */
  flashRows(rowsIndexes: number[]) {
    const framesCount = 10
    const framesInterval = 7

    const minX = this.getXForCol(0)
    const maxX = this.getXForCol(this.settings.GAME_FIELD_WIDTH_IN_CELLS)
    const fieldWidth = maxX - minX

    const backgroundColor = this.addHashToColorString(
      this.settings.GAME_FIELD_BACKGROUND_COLOR
    )

    let effectColor = this.addHashToColorString(this.settings.EFFECT_COLOR)
    if (rowsIndexes.length === 4) {
      effectColor = this.addHashToColorString(this.settings.TETRIS_EFFECT_COLOR)
    }

    let framesRemain = framesCount
    const animationHandler = () => {
      const intensity = 1 - framesRemain / framesCount
      const currentX = minX + Math.round(intensity * fieldWidth)
      for (let currentRowIndex of rowsIndexes) {
        const p1 = new Point(minX, this.getYForRow(currentRowIndex))
        const p2 = new Point(currentX, p1.y)
        const p3 = new Point(currentX, p1.y + this.cellHeightInPixels)
        const p4 = new Point(minX, p3.y)
        this.drawQuadrangle(p1, p2, p3, p4, backgroundColor)

        const p5 = new Point(currentX, p1.y)
        const p6 = new Point(maxX, p1.y)
        const p7 = new Point(maxX, p3.y)
        const p8 = new Point(currentX, p3.y)
        this.drawQuadrangle(p5, p6, p7, p8, effectColor)
      }

      framesRemain -= 1

      if (framesRemain >= 0) {
        setTimeout(animationHandler, framesInterval)
      }
    }

    setTimeout(animationHandler, framesInterval)
  }

  /**
   * Filling rows effect
   * @returns promise, which will resolved when effect ended
   */
  fillRows(): Promise<void> {
    return new Promise((resolve, reject) => {
      const framesInterval = 150
      let currentCol = 0
      let currentRow = this.cells.rowsCount - 1

      const animationHandler = () => {
        if (!this.cells.getCell(currentCol, currentRow)) {
          const selectedColorIndex =
            Math.floor(
              Math.random() * (this.settings.FIGURE_COLORS.length - 1)
            ) + 1

          this.renderSingleCell(currentCol, currentRow, selectedColorIndex)
        }

        currentCol += 1
        if (currentCol === this.cells.colsCount) {
          currentCol = 0
          currentRow -= 1
        }
        if (currentRow >= 0) {
          setTimeout(animationHandler)
        } else {
          resolve()
        }
      }

      setTimeout(animationHandler, framesInterval)
    })
  }

  /**
   * Produces white color RGBA string with selected transparency level
   * @param alpha level of color transparency, valid values from 0 to 1
   * @returns RGBA white color string
   */
  private addAlphaToWhiteColor(alpha: number = 1): string {
    return `rgba(255,255,255, ${alpha})`
  }

  /**
   * Draws quadrangle on canvas
   * @param p1 upper left corner point
   * @param p2 upper right corner point
   * @param p3 bottom right corner point
   * @param p4 bottom left corner point
   * @param fillStyle Canvas2DContext fill style 
   */
  private drawQuadrangle(
    p1: Point,
    p2: Point,
    p3: Point,
    p4: Point,
    fillStyle: string
  ) {
    this.canvas2DContext.beginPath()
    this.canvas2DContext.moveTo(p1.x, p1.y)
    this.canvas2DContext.lineTo(p2.x, p2.y)
    this.canvas2DContext.lineTo(p3.x, p3.y)
    this.canvas2DContext.lineTo(p4.x, p4.y)
    this.canvas2DContext.closePath()
    this.canvas2DContext.fillStyle = fillStyle
    this.canvas2DContext.fill()
  }

  /**
   * Transform logical row index to canvas y coordinate
   * @param rowIndex row index
   * @returns canvas y coordinate for upper left row corner
   */
  private getYForRow(rowIndex: number): number {
    return this.yOffset + rowIndex * this.cellHeightInPixels
  }

  /**
   * 
   * @param colIndex Transforms logical column index to canvas x coordinate
   * @returns canvas x coordinate for upper left row corner
   */
  private getXForCol(colIndex: number): number {
    return this.xOffset + colIndex * this.cellWidthInPixels
  }
}
