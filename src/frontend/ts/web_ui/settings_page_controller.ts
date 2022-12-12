import { SettingsLoader } from '../utils/settings_loader'
import { CanvasCellsRenderer } from './canvas_cells_renderer'
import { FiguresPreviewController } from '../controllers/figures_preview_controller'
import { FigureRandomizer } from '../utils/figure_randomizer'

/**
 * Contains logic for web-ui settings page
 */
export class SettingsPageController {
  private readonly settings: SettingsLoader
  private readonly pageElement: HTMLElement
  private readonly gameModeSelectElement: HTMLSelectElement
  private figureRandomizer: FigureRandomizer
  private figurePreviewController: FiguresPreviewController
  private canvasRenderer: CanvasCellsRenderer
  public selectedGameModeValue: string
  private promiseResolver: Function

  constructor() {
    this.settings = SettingsLoader.getSettings()
    this.pageElement = document.querySelector('.settings-page')

    const settingsForm: HTMLFormElement =
      this.pageElement.querySelector('.settings-form')
    this.gameModeSelectElement = this.pageElement.querySelector(
      '.settings-form__game-mode-select'
    )
    const startButton = this.pageElement.querySelector(
      '.settings-form__submit-button'
    )

    this.canvasRenderer = new CanvasCellsRenderer(
      '.figures-preview__canvas',
      true
    )

    for (let mode of Object.entries(this.settings.GAME_MODES)) {
      const optionElement = document.createElement('option')
      optionElement.text = mode[1]
      optionElement.value = mode[0]
      this.gameModeSelectElement.options.add(optionElement)
    }

    if (this.gameModeSelectElement.options.length > 0) {
      this.gameModeSelectElement.options[0].selected = true
    }

    settingsForm.addEventListener('submit', (ev: SubmitEvent) => {
      this.handleSettingsFormSubmit(ev)
    })

    this.gameModeSelectElement.addEventListener('change', () => {
      this.handleGameModeChanged()
    })

    this.handleGameModeChanged()
  }

  /**
   * Shows settings page in web-ui
   * @returns promise, which will resolved when submit button pressed
   */
  show(): Promise<string> {
    this.pageElement.style.display = 'block'

    return new Promise((resolve, reject) => {
      this.promiseResolver = resolve
    })
  }

  /**
   * Hides settings page in web-ui
   */
  hide() {
    this.pageElement.style.display = 'none'
  }

  private handleSettingsFormSubmit(ev: SubmitEvent) {
    ev.preventDefault()
    if (this.promiseResolver) {
      this.promiseResolver(this.selectedGameModeValue)
    } else {
      const customEvent = new Event('gameStarted')
      document.dispatchEvent(customEvent)
    }
  }

  /**
   * Redraws figures preview area when game mode was changed 
   */
  private handleGameModeChanged() {
    const selectedGameModeKey =
      this.gameModeSelectElement.selectedOptions[0].value

    this.selectedGameModeValue = this.settings.GAME_MODES[selectedGameModeKey]
    this.figureRandomizer = new FigureRandomizer(this.selectedGameModeValue)
    this.figurePreviewController = new FiguresPreviewController()

    this.figurePreviewController.setCanvasRenderer(this.canvasRenderer)
    this.figurePreviewController.insertFigures(
      ...this.figureRandomizer.getAvailableFigures(true)
    )
  }
}
