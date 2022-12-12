import { ClockGenerator } from './clock_generator'
import { SettingsLoader } from './settings_loader'

/**
 * Contains level switching logic
 */
export class LevelSwitcher {
  private readonly LEVELS: { [key: string]: number }
  private readonly LINES: number[]
  private nextLevelLines: number
  public currentLevelNumber = 0

  /**
   * @param clockGeneratror game clock generator
   */
  constructor(private clockGeneratror: ClockGenerator) {
    this.LEVELS = SettingsLoader.getSettings().LEVELS
    this.LINES = Object.keys(this.LEVELS)
      .map((linesValue) => {
        return parseInt(linesValue)
      })
      .filter((linesValue) => !isNaN(linesValue))
      .sort(function (a, b) {
        return a - b
      })
    const initialInterval = this.getIntervalForLevelNumber(
      this.currentLevelNumber
    )
    this.clockGeneratror.setInterval(initialInterval)
    this.nextLevelLines = this.getLinesForLevelNumber(
      this.currentLevelNumber + 1
    )
  }

  /**
   * Sets clock generator interval based on lines count
   * @param lines lines count
   */
  setLevelForLines(lines: number) {
    if (lines >= this.nextLevelLines) {
      this.currentLevelNumber += 1
      const currentInterval = this.getIntervalForLevelNumber(
        this.currentLevelNumber
      )
      this.clockGeneratror.setInterval(currentInterval)
      this.nextLevelLines = this.getLinesForLevelNumber(
        this.currentLevelNumber + 1
      )
    }
  }

  /**
   * Returns lines count for selected level number
   * @param levelNumber requested level number
   * @returns lines count
   */
  private getLinesForLevelNumber(levelNumber: number): number {
    return this.LINES[levelNumber]
  }

  /**
   * Returns clock generator interval for selected level number
   * @param levelNumber requested level number
   * @returns interval in milliseconds
   */
  private getIntervalForLevelNumber(levelNumber: number): number {
    const scoreForLevel = this.getLinesForLevelNumber(levelNumber)
    return this.LEVELS[scoreForLevel.toString()]
  }
}
