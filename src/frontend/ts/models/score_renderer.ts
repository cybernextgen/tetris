/**
 * Renders score
 */
export interface ScoreRenderer {
  /**
   * Render current values
   * @param score current score number
   * @param level current game level
   * @param lines current lines
   */
  render(score: number, level: number, lines: number): void
}
