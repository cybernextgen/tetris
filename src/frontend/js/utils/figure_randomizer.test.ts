import { FigureRandomizer } from './figure_randomizer'
import { SettingsLoader } from '../utils/settings_loader'

test('Figure randomizer API tests', () => {
  const settings = SettingsLoader.getSettings()
  const randomizerEasy = new FigureRandomizer(settings.GAME_MODES['EASY'])
  const randomizerMedium = new FigureRandomizer(settings.GAME_MODES['MEDIUM'])
  const randomizerHard = new FigureRandomizer(settings.GAME_MODES['HARD'])

  const easyModeFigures = randomizerEasy.getAvailableFigures()
  const mediumModeFigures = randomizerMedium.getAvailableFigures()
  const hardModeFigures = randomizerHard.getAvailableFigures()

  expect(easyModeFigures.length).toBeLessThan(mediumModeFigures.length)
  expect(mediumModeFigures.length).toBeLessThan(hardModeFigures.length)
})
