import { Cells } from './cells'
import { CollisionError } from './collision_error'

function getMatrixForCells(cells: Cells): number[][] {
  let result: number[][] = []
  for (let i = 0; i < cells.rowsCount; i++) {
    result.push([])
    for (let j = 0; j < cells.colsCount; j++) {
      result[i].push(cells.getCell(j, i))
    }
  }
  return result
}

function assertCellsAreEqual(cells1: Cells, cells2: Cells | number[][]) {
  let matrix1: number[][]
  let matrix2: number[][]

  matrix1 = getMatrixForCells(cells1)
  if (Array.isArray(cells2)) {
    matrix2 = cells2
  } else {
    matrix2 = getMatrixForCells(cells2)
  }
  expect(matrix1).toEqual(matrix2)
}

test('Cells matrix constructor test', () => {
  const matrix = [
    [1, 0, 0, 0],
    [1, 1, 1, 1]
  ]
  const rowsCount = matrix.length
  const colsCount = matrix[0].length

  const cellsInstance = new Cells(matrix)

  expect(cellsInstance.rowsCount).toBe(rowsCount)
  expect(cellsInstance.colsCount).toBe(colsCount)
  assertCellsAreEqual(cellsInstance, matrix)
})

test('Cells two dimension constructor test', () => {
  const expectedMatrix = [
    [0, 0, 0],
    [0, 0, 0]
  ]
  const rowsCount = expectedMatrix.length
  const colsCount = expectedMatrix[0].length

  const cellsInstance = new Cells(colsCount, rowsCount)
  expect(cellsInstance.rowsCount).toBe(rowsCount)
  expect(cellsInstance.colsCount).toBe(colsCount)

  assertCellsAreEqual(cellsInstance, expectedMatrix)
})

function assertCellsHasColor(cells: Cells, color: number) {
  const rowsCount = cells.rowsCount
  const colsCount = cells.colsCount

  for (let rowIndex = 0; rowIndex < cells.rowsCount; rowIndex++) {
    for (let colIndex = 0; colIndex < cells.colsCount; colIndex++) {
      expect(cells.getCell(colIndex, rowIndex)).toBe(color)
    }
  }
}

test('Cells API test', () => {
  const colsCount = 5
  const rowsCount = 10
  let cellsInstance = new Cells(colsCount, rowsCount)

  assertCellsHasColor(cellsInstance, 0)
  cellsInstance = new Cells([
    [1, 0, 0],
    [1, 1, 1]
  ])
  const expectedMatrix = [
    [2, 0, 0],
    [2, 2, 2]
  ]
  cellsInstance.fillWithColorIndex(2)
  assertCellsAreEqual(cellsInstance, expectedMatrix)
})

test('Cells merge test', () => {
  const figure = new Cells([
    [2, 0, 0, 0],
    [2, 2, 2, 2]
  ])
  const field = new Cells([
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [2, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0]
  ])
  let expectedField = new Cells([
    [0, 2, 0, 0, 0],
    [0, 2, 2, 2, 2],
    [0, 0, 0, 0, 0],
    [2, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0]
  ])

  const mergedCells = field.mergeWithCells(figure, 1, 0)
  assertCellsAreEqual(expectedField, mergedCells)

  const points = [
    [2, 0],
    [-1, 0],
    [1, 5]
  ]
  for (let point of points) {
    const t = () => {
      field.mergeWithCells(figure, point[0], point[1])
    }
    expect(t).toThrow(RangeError)
  }

  const t = () => {
    field.mergeWithCells(figure, 0, 2)
  }
  expect(t).toThrow(CollisionError)
})

test('Rotation test', () => {
  const sourceMatrix = [
    [0, 1, 0],
    [1, 1, 1]
  ]
  const expectedMatrix1 = [
    [1, 0],
    [1, 1],
    [1, 0]
  ]
  const expectedMatrix2 = [
    [1, 1, 1],
    [0, 1, 0]
  ]
  const expectedMatrix3 = [
    [0, 1],
    [1, 1],
    [0, 1]
  ]

  // Rotate clockwise
  const initialCells = new Cells(sourceMatrix)
  let currentCells = initialCells
  for (let expectedMatrix of [
    expectedMatrix1,
    expectedMatrix2,
    expectedMatrix3,
    initialCells
  ]) {
    currentCells = currentCells.rotateClockwise()
    assertCellsAreEqual(currentCells, expectedMatrix)
  }

  // Rotate counter clockwise
  currentCells = initialCells
  for (let expectedMatrix of [
    expectedMatrix3,
    expectedMatrix2,
    expectedMatrix1,
    initialCells
  ]) {
    currentCells = currentCells.rotateCounterClockwise()
    assertCellsAreEqual(currentCells, expectedMatrix)
  }
})
