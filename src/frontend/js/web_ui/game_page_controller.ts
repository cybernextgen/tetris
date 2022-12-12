import { CanvasCellsRenderer } from './canvas_cells_renderer'
import { HTMLScoreRenderer } from './html_score_renderer'
import { SettingsLoader } from '../utils/settings_loader'
import { GameController } from '../controllers/game_controller'
import { Score } from '../models/score'

/**
 * Contains logic for web-ui game page
 */
export class GamePageController {
  private readonly gameController: GameController
  private pageElement: HTMLElement
  private promiseResolver: Function

  constructor(private readonly gameMode: string) {
    const settings = SettingsLoader.getSettings()
    this.pageElement = document.querySelector('.game-page') as HTMLElement

    const gameFieldRenderer = new CanvasCellsRenderer(
      '.game-field__canvas',
      true,
      true
    )
    const previewRenderer = new CanvasCellsRenderer(
      '.game-sidebar__next-figure__canvas',
      true
    )
    const scoreRenderer = new HTMLScoreRenderer(
      '.game-sidebar__score__value',
      '.game-sidebar__level__value',
      '.game-sidebar__lines__value'
    )

    this.gameController = new GameController(
      gameFieldRenderer,
      previewRenderer,
      scoreRenderer
    )

    document.addEventListener('keydown', (e: KeyboardEvent) => {
      this.handleKeyPressed(e)
    })

    this.gameController.start(gameMode).then((scoreObject: Score) => {
      if (this.promiseResolver) {
        this.promiseResolver(scoreObject)
      } else {
        document.dispatchEvent(new Event('gameFinished'))
      }
    })
  }

  /**
   * Shows game page in web-ui
   * @returns promise, which will resolved when game over
   */
  show(): Promise<Score> {
    this.pageElement.style.display = 'flex'
    return new Promise((resolve, reject) => {
      this.promiseResolver = resolve
    })
  }

  /**
   * Hides game page in web-ui
   */
  hide() {
    this.pageElement.style.display = 'none'
  }

  /**
   * Handles keys pressed by user
   * @param e
   */
  private handleKeyPressed(e: KeyboardEvent) {
    if (!e.repeat) {
      if (e.key === 'ArrowUp') {
        this.gameController.rotateClockwise()
      }
    }

    if (e.key === 'ArrowDown') {
      this.gameController.drop()
    } else if (e.key === 'ArrowRight') {
      this.gameController.moveRight()
    } else if (e.key === 'ArrowLeft') {
      this.gameController.moveLeft()
    }
  }
}
