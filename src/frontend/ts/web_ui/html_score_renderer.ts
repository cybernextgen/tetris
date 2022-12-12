import { ScoreRenderer } from '../models/score_renderer'

/**
 * HTML score renderer implementation
 */
export class HTMLScoreRenderer implements ScoreRenderer {
  private readonly scoreElement: HTMLElement
  private readonly levelElement: HTMLElement
  private readonly linesElement: HTMLElement

  constructor(
    scoreElementSelector: string,
    levelElementSelector: string,
    linesElementSelector: string
  ) {
    this.scoreElement = document.querySelector(scoreElementSelector)
    this.levelElement = document.querySelector(levelElementSelector)
    this.linesElement = document.querySelector(linesElementSelector)
  }

  render(score: number, level: number, lines: number): void {
    this.scoreElement.textContent = score.toString()
    this.levelElement.textContent = level.toString()
    this.linesElement.textContent = lines.toString()
  }
}
