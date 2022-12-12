import { SettingsLoader } from './settings_loader'
import { Cells } from '../models/cells'

/**
 * Class, that produces random tetris figures
 */
export class FigureRandomizer {
  private settings: SettingsLoader
  figures: Cells[] = []
  colors: string[]

  /**
   * @param mode game mode
   */
  constructor(mode: number | string) {
    this.settings = SettingsLoader.getSettings()

    this.colors = this.settings.FIGURE_COLORS
    this.figures.push(new Cells([[1, 1, 1, 1]]))

    this.figures.push(
      new Cells([
        [1, 0, 0],
        [1, 1, 1]
      ])
    )
    this.figures.push(
      new Cells([
        [0, 0, 1],
        [1, 1, 1]
      ])
    )
    this.figures.push(
      new Cells([
        [0, 1, 0],
        [1, 1, 1]
      ])
    )
    this.figures.push(
      new Cells([
        [0, 1, 1],
        [1, 1, 0]
      ])
    )
    this.figures.push(
      new Cells([
        [1, 1, 0],
        [0, 1, 1]
      ])
    )
    this.figures.push(
      new Cells([
        [1, 1],
        [1, 1]
      ])
    )

    if (
      mode === this.settings.GAME_MODES['MEDIUM'] ||
      mode === this.settings.GAME_MODES['HARD']
    ) {
      this.figures.push(
        new Cells([
          [1, 0],
          [1, 1]
        ])
      )
      this.figures.push(
        new Cells([
          [0, 1],
          [1, 1]
        ])
      )
    }
    if (mode === this.settings.GAME_MODES['HARD']) {
      this.figures.push(
        new Cells([
          [1, 0, 1],
          [1, 1, 1]
        ])
      )
      this.figures.push(
        new Cells([
          [1, 0, 0],
          [1, 1, 1],
          [0, 0, 1]
        ])
      )
      this.figures.push(
        new Cells([
          [0, 0, 1],
          [1, 1, 1],
          [1, 0, 0]
        ])
      )
    }
  }

  /**
   * Returns random figure from internal figures array
   * @returns Cells instance
   */
  private getRandomFigure(): Cells {
    return this.figures[Math.floor(Math.random() * this.figures.length)]
  }

  /**
   * Fills figure cells with random color index
   * @param figure Cells instance for color filling
   * @returns Cells instance
   */
  private fillFigureWithRandomColor(figure: Cells): Cells {
    const selectedColorIndex =
      Math.floor(Math.random() * (this.settings.FIGURE_COLORS.length - 1)) + 1
    figure.fillWithColorIndex(selectedColorIndex)
    return figure
  }

  /**
   * Produces random figure and fills it with colors
   * @returns Cells instance
   */
  generateFigure(): Cells {
    const figure = this.fillFigureWithRandomColor(this.getRandomFigure())
    return figure
  }

  /**
   * Returns array of available figures
   * @param randomizeColors fill figures cells with random colors indexes
   * @returns array of figures Cells
   */
  getAvailableFigures(randomizeColors: boolean = false): Cells[] {
    let result: Cells[]
    if (randomizeColors) {
      result = []
      for (let figure of this.figures) {
        result.push(this.fillFigureWithRandomColor(figure.getCopy()))
      }
    } else {
      result = this.figures
    }
    return result
  }
}
