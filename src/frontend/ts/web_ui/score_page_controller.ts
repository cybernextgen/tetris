import { Score } from '../models/score'

/**
 * Contains logic for web-ui score page
 */
export class ScorePageController {
  private pageElement: HTMLElement

  /**
   * @param scoreObject displaying object
   * @param gameMode game mode human readable string representation
   */
  constructor(scoreObject: Score, gameMode: string) {
    this.pageElement = document.querySelector('.score-page')

    const gameModeElement = document.querySelector('.score-page__header__mode')
    gameModeElement.textContent = gameMode

    const currentScoreElement = document.querySelector(
      '.score-page__result__body__score'
    )
    const currentLevelElement = document.querySelector(
      '.score-page__result__body__level'
    )
    const currentLinesElement = document.querySelector(
      '.score-page__result__body__lines'
    )

    const bestScoreElement = document.querySelector(
      '.score-page__best_result__body__score'
    )
    const bestLevelElement = document.querySelector(
      '.score-page__best_result__body__level'
    )
    const bestLinesElement = document.querySelector(
      '.score-page__best_result__body__lines'
    )

    const restartElement = document.querySelector(
      '.score-page__restart__button'
    )

    const currentScoreValue = scoreObject.score
    currentScoreElement.textContent = currentScoreValue.toString()
    currentLevelElement.textContent = scoreObject.level.toString()
    currentLinesElement.textContent = scoreObject.lines.toString()

    let bestScoreValue = 0
    let bestLevelValue = 0
    let bestLinesValue = 0

    const savedScoreKey = `best_score_${gameMode}`
    const savedScoreString = localStorage.getItem(savedScoreKey)
    if (savedScoreString) {
      const savedScore: Score = JSON.parse(savedScoreString)
      bestScoreValue = savedScore.score
      bestLinesValue = savedScore.lines
      bestLevelValue = savedScore.level
    }

    bestScoreElement.textContent = bestScoreValue.toString()
    bestLinesElement.textContent = bestLinesValue.toString()
    bestLevelElement.textContent = bestLevelValue.toString()

    if (currentScoreValue > bestScoreValue) {
      this.saveScore(scoreObject, savedScoreKey)
    }

    restartElement.addEventListener('click', () => {
      location.reload()
    })
  }

  /**
   * Stores score object in localstorage
   * @param scoreObject object for saving
   * @param key string key for localstorage
   */
  private saveScore(scoreObject: Score, key: string) {
    const scoreString = JSON.stringify(scoreObject)
    localStorage.setItem(key, scoreString)
  }

  /**
   * Shows score page in web-ui
   */
  show() {
    this.pageElement.style.display = 'block'
  }

  /**
   * Hides score page in web-ui
   */
  hide() {
    this.pageElement.style.display = 'none'
  }
}
