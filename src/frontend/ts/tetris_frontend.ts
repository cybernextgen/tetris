import '../css/dark.css'
import '../css/style.css'
import { SettingsPageController } from './web_ui/settings_page_controller'
import { GamePageController } from './web_ui/game_page_controller'
import { ScorePageController } from './web_ui/score_page_controller'

const settingsController = new SettingsPageController()
settingsController.show().then((selectedGameMode) => {
  settingsController.hide()
  const gamePageController = new GamePageController(selectedGameMode)
  gamePageController.show().then((scoreObject) => {
    gamePageController.hide()
    const scorePage = new ScorePageController(scoreObject, selectedGameMode)
    scorePage.show()
  })
})
