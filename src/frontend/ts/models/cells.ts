import { CollisionError } from './collision_error'

/**
 * Cells and basic cells operation representation
 */
export class Cells {
  /**
   * Holds cells state, must be filled with color index numbers
   */
  protected matrix: number[][]

  public readonly rowsCount: number
  public readonly colsCount: number

  public pivotPoint: number //TODO: implement pivot point cells rotation

  /**
   * Construct object using predefined matrix
   * @param matrix
   */
  constructor(matrix: number[][])
  /**
   * Construct zero filled object using two dimensoins
   * @param colsCount cols count
   * @param rowsCount rows count
   */
  constructor(colsCount: number, rowsCount: number)
  constructor(...args: any[]) {
    if (args.length === 1) {
      this.matrix = args[0]
      this.rowsCount = this.matrix.length
      if (this.rowsCount > 0) {
        this.colsCount = this.matrix[0].length
      } else {
        this.colsCount = 0
      }
    } else if (args.length === 2) {
      this.colsCount = args[0]
      this.rowsCount = args[1]
      this.clear()
    }
  }

  /**
   * Fills cells with zeroes
   */
  clear() {
    this.matrix = []
    for (let i = 0; i < this.rowsCount; i++) {
      const row = []
      row.length = this.colsCount
      row.fill(0)
      this.matrix.push(row)
    }
  }

  /**
   * Fill cells with selected index
   * @param colorIndex new index for cells
   */
  fillWithColorIndex(colorIndex: number) {
    for (let rowIndex = 0; rowIndex < this.rowsCount; rowIndex++) {
      for (let colIndex = 0; colIndex < this.colsCount; colIndex++) {
        if (this.matrix[rowIndex][colIndex] !== 0) {
          this.matrix[rowIndex][colIndex] = colorIndex
        }
      }
    }
  }

  /**
   * Makes deep copy of source matrix
   * @param sourceMatrix matrix for copying
   * @returns deep copy of source matrix
   */
  protected static copyMatrix(sourceMatrix: number[][]): number[][] {
    const newMatrix = []
    for (let row of sourceMatrix) {
      newMatrix.push([...row])
    }
    return newMatrix
  }

  /**
   * Produce new Cells instance by merging own cells with external cells from argument.
   * By default throws RangeError or CollisionError if external cells goes beyond border
   * or collide with internal cells
   * @param cells external cells instance
   * @param colIndex the column index where the merging will start
   * @param rowIndex the row index where the merging will start
   * @param detectCollision enable collision and bounds detection
   * @returns new Cells instance with the merging result
   */
  mergeWithCells(
    cells: Cells,
    colIndex: number = 0,
    rowIndex: number = 0,
    detectCollision = true
  ): Cells {
    if (
      detectCollision &&
      (colIndex + cells.colsCount - 1 >= this.colsCount ||
        rowIndex + cells.rowsCount - 1 >= this.rowsCount ||
        rowIndex < 0 ||
        colIndex < 0)
    ) {
      throw new RangeError('Cells goes beyond the borders!')
    }

    const newMatrix = Cells.copyMatrix(this.matrix)

    let currentColIndex: number
    let currentRowIndex: number
    for (let r = 0; r < cells.rowsCount; r++) {
      currentRowIndex = rowIndex + r
      for (let c = 0; c < cells.colsCount; c++) {
        currentColIndex = colIndex + c
        if (currentRowIndex < 0) {
          continue
        }
        const cellsValue = cells.getCell(c, r)
        if (
          detectCollision &&
          cellsValue &&
          newMatrix[currentRowIndex][currentColIndex] !== 0
        ) {
          throw new CollisionError('Cells collide with others cells!')
        }
        if (currentColIndex < 0) {
          continue
        }
        newMatrix[currentRowIndex][currentColIndex] =
          newMatrix[currentRowIndex][currentColIndex] || cellsValue
      }
    }
    return new Cells(newMatrix)
  }

  /**
   * Returns selected cell value
   * @param col column index
   * @param row row index
   * @returns selected cell value
   */
  getCell(col: number, row: number): number {
    return this.matrix[row][col]
  }

  /**
   * Set new value for selected cell
   * @param col column index
   * @param row row index
   * @param val new value for selected cell
   */
  setCell(col: number, row: number, val: number) {
    this.matrix[row][col] = val
  }

  /**
   * Return deep copy of cells instance
   * @returns deep copy of cells instance
   */
  getCopy(): Cells {
    return new Cells(Cells.copyMatrix(this.matrix))
  }

  /**
   * Removes rows and shift remaining rows down
   * @param rowsIndexes indexes of removed rows
   * @returns new Cells instance
   */
  removeRows(rowsIndexes: number[]): Cells {
    let currentMatrix: number[][] = Cells.copyMatrix(this.matrix)
    for (let currentRowIndex of rowsIndexes) {
      currentMatrix = Cells.copyMatrix(currentMatrix)
      currentMatrix.splice(currentRowIndex, 1)

      const row = []
      row.length = this.colsCount
      row.fill(0)
      currentMatrix.splice(0, 0, row)
    }
    return new Cells(currentMatrix)
  }

  /**
   * Rotate cells counter clockwise
   * @returns new Cells instance
   */
  rotateCounterClockwise() {
    return this.rotate(false)
  }

  /**
   * Rotate cells clockwise
   * @returns new Cells instance
   */
  rotateClockwise() {
    return this.rotate()
  }

  /**
   * Rotate cells
   * @param clockwise rotation direction, true if clockwise rotation
   * @returns new Cells instance
   */
  private rotate(clockwise = true) {
    const newMatrix = []
    for (let i = 0; i < this.colsCount; i++) {
      const newRow = []
      newRow.length = this.rowsCount
      newMatrix.push(newRow)
    }

    for (
      let currentRowIndex = 0;
      currentRowIndex < this.rowsCount;
      currentRowIndex++
    ) {
      for (
        let currentColIndex = 0;
        currentColIndex < this.colsCount;
        currentColIndex++
      ) {
        let newColIndex = 0
        let newRowIndex = 0
        if (clockwise) {
          newColIndex = this.rowsCount - currentRowIndex - 1
          newRowIndex = currentColIndex
        } else {
          newColIndex = currentRowIndex
          newRowIndex = this.colsCount - currentColIndex - 1
        }

        newMatrix[newRowIndex][newColIndex] =
          this.matrix[currentRowIndex][currentColIndex]
      }
    }
    return new Cells(newMatrix)
  }
}
