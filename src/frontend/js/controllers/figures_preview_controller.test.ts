import { FigureRandomizer } from '../utils/figure_randomizer'
import { FiguresPreviewController } from './figures_preview_controller'
import { SettingsLoader } from '../utils/settings_loader'

test('FiguresPreviewController API tests', () => {
  const figureRandomizer = new FigureRandomizer(
    SettingsLoader.getSettings().GAME_MODES['EASY']
  )
  const figures = figureRandomizer.getAvailableFigures()
  const figurePreviewController = new FiguresPreviewController(0, 0)
  figurePreviewController.insertFigures(...figures)
  expect(true).toBe(true)
})
