import { Cells } from '../models/cells'
import { CellsRenderer } from '../models/cells_renderer'
import { ScoreRenderer } from '../models/score_renderer'
import { ClockGenerator } from '../utils/clock_generator'
import { FigureRandomizer } from '../utils/figure_randomizer'
import { SettingsLoader } from '../utils/settings_loader'
import { LevelSwitcher } from '../utils/level_switcher'
import { Score } from '../models/score'

/**
 * Contains tetris game logic
 */
export class GameController {
  private readonly settings: SettingsLoader
  public isStarted: boolean

  private figureRandomizer: FigureRandomizer
  private readonly clockGenerator: ClockGenerator
  private readonly levelSwitcher: LevelSwitcher

  private currentFigure: Cells
  private nextFigure: Cells
  private gameField: Cells

  private currentFigureCol: number
  private currentFigureRow: number

  private score: number = 0
  private level: number = 0
  private lines: number = 0

  private promiseResolver: Function

  constructor(
    private readonly gameFieldRenderer: CellsRenderer,
    private readonly previewRenderer: CellsRenderer,
    private readonly scoreRenderer: ScoreRenderer
  ) {
    this.settings = SettingsLoader.getSettings()

    this.gameField = new Cells(
      this.settings.GAME_FIELD_WIDTH_IN_CELLS,
      this.settings.GAME_FIELD_HEIGHT_IN_CELLS
    )

    this.gameFieldRenderer.colsCount = this.gameField.colsCount
    this.gameFieldRenderer.rowsCount = this.gameField.rowsCount

    this.previewRenderer.colsCount = 4
    this.previewRenderer.rowsCount = 3

    this.clockGenerator = new ClockGenerator()
    this.clockGenerator.setCallback(() => {
      this.handleClock()
    })

    this.levelSwitcher = new LevelSwitcher(this.clockGenerator)
  }

  /**
   * Starts the game
   * @see {@link SettingsLoader}
   * @param gameMode string representation of selected game mode. Must be delivered from SettingsLoader.GAME_MODES object
   * @returns promise, which will resolved when game over
   */
  start(gameMode: string) {
    if (this.isStarted) {
      return
    }
    this.clockGenerator.start()

    this.figureRandomizer = new FigureRandomizer(gameMode)

    this.nextFigure = this.figureRandomizer.generateFigure()
    this.previewRenderer.renderCells(this.nextFigure)
    this.renderScore()

    return new Promise((resolve, reject) => {
      this.promiseResolver = resolve
    })
  }

  /**
   * Drop down current figure
   */
  drop() {
    let rows = 0
    let newFigureRow = this.currentFigureRow
    let newGameField: Cells
    try {
      while (this.currentFigureRow < this.gameField.rowsCount) {
        newGameField = this.gameField.mergeWithCells(
          this.currentFigure,
          this.currentFigureCol,
          newFigureRow
        )
        rows += 1
        newFigureRow += 1
      }
    } catch (e) {
      this.score += rows
      this.currentFigureRow = newFigureRow - 1
      this.gameFieldRenderer.renderCells(newGameField)
    }
  }

  /**
   * Rotate current figure clockwise
   */
  rotateClockwise() {
    try {
      const rotatedFigure = this.currentFigure.rotateClockwise()
      const newGameField = this.gameField.mergeWithCells(
        rotatedFigure,
        this.currentFigureCol,
        this.currentFigureRow
      )
      this.currentFigure = rotatedFigure
      this.gameFieldRenderer.renderCells(newGameField)
    } catch (e) {}
  }

  /**
   * Move current figure one cell right
   */
  moveRight() {
    this.moveHorizontal(1)
  }

  /**
   * Move current figure one cell left
   */
  moveLeft() {
    this.moveHorizontal(-1)
  }

  /**
   * Horizontal move current figure
   * @param colsCount count of cols for moving, positive value moves right, negative - left
   */
  private moveHorizontal(colsCount: number) {
    try {
      const newFigureCol = this.currentFigureCol + colsCount
      const newGameField = this.gameField.mergeWithCells(
        this.currentFigure,
        newFigureCol,
        this.currentFigureRow
      )
      this.currentFigureCol = newFigureCol
      this.gameFieldRenderer.renderCells(newGameField)
    } catch (e) {}
  }

  /**
   * Game steps handling
   */
  private handleClock() {
    if (!this.currentFigure) {
      this.currentFigure = this.nextFigure
      this.nextFigure = this.figureRandomizer.generateFigure()

      try {
        this.currentFigureCol = this.getInitialColIndex()
        this.currentFigureRow = 0

        this.gameFieldRenderer.renderCells(
          this.gameField.mergeWithCells(
            this.currentFigure,
            this.currentFigureCol,
            this.currentFigureRow
          )
        )
        this.previewRenderer.renderCells(this.nextFigure)
      } catch (e) {
        this.handleGameOver()
      }
    } else {
      try {
        const newGameField = this.gameField.mergeWithCells(
          this.currentFigure,
          this.currentFigureCol,
          this.currentFigureRow + 1
        )

        this.gameFieldRenderer.renderCells(newGameField)
        this.currentFigureRow += 1
      } catch (e) {
        const newGameField = this.gameField.mergeWithCells(
          this.currentFigure,
          this.currentFigureCol,
          this.currentFigureRow
        )
        this.gameField = newGameField
        this.currentFigure = undefined
        this.handleClock()
      }
    }
    this.handleCompleteRows()
    this.renderScore()
  }

  /**
   * Collapse complete rows, update score
   */
  private handleCompleteRows() {
    const completeRowsIndexes = []
    for (
      let currentRow = 0;
      currentRow < this.settings.GAME_FIELD_HEIGHT_IN_CELLS;
      currentRow += 1
    ) {
      let isRowComplete = true
      for (
        let currentCol = 0;
        currentCol < this.settings.GAME_FIELD_WIDTH_IN_CELLS;
        currentCol += 1
      ) {
        if (!this.gameField.getCell(currentCol, currentRow)) {
          isRowComplete = false
          break
        }
      }
      if (isRowComplete) {
        completeRowsIndexes.push(currentRow)
      }
    }
    const completedRowsCount = completeRowsIndexes.length
    this.score += completedRowsCount * completedRowsCount * 10
    this.lines += completedRowsCount

    if (completedRowsCount) {
      this.gameFieldRenderer.flashRows(completeRowsIndexes)
      this.gameField = this.gameField.removeRows(completeRowsIndexes)
      this.levelSwitcher.setLevelForLines(this.lines)
    }

    this.level = this.levelSwitcher.currentLevelNumber
  }

  private renderScore() {
    this.scoreRenderer.render(this.score, this.level, this.lines)
  }

  /**
   * Calculates initial column index for new figure (new figure will appear near
   * game field width center)
   * @returns initial column index for new figures
   */
  private getInitialColIndex(): number {
    return Math.round(
      (this.settings.GAME_FIELD_WIDTH_IN_CELLS - this.currentFigure.colsCount) /
        2
    )
  }

  /**
   * Game over handling
   */
  private handleGameOver() {
    this.clockGenerator.stop()
    this.gameFieldRenderer.fillRows().then(() => {
      this.promiseResolver(new Score(this.score, this.level, this.lines))
    })
  }
}
