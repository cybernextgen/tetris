/**
 * Singleton contains settings values
 * @example
 * Example usage:
 * ```ts
 * SettingsLoader.getSettings().FIGURE_COLORS
 * ```
 */
export class SettingsLoader {
  private static instance: SettingsLoader

  public readonly GAME_FIELD_BACKGROUND_COLOR
  /**
   * Colors for figures (HEX RGB strings). Zero indexed color are game field background color
   */
  public readonly FIGURE_COLORS: string[]
  /**
   * Available game modes. Key - game mode code, value - human readable representation
   */
  public readonly GAME_MODES: Object
  public readonly GAME_FIELD_HEIGHT_IN_CELLS: number
  public readonly GAME_FIELD_WIDTH_IN_CELLS: number
  /**
   * Rows collapse effect color
   */
  public readonly EFFECT_COLOR: string
  /**
   * Effect color for tetris (4 rows collapse)
   */
  public readonly TETRIS_EFFECT_COLOR: string
  /**
   * Levels speed settings, keys are count of rows, values are clock intervals
   */
  public readonly LEVELS: { [key: string]: number }

  constructor() {
    if (SettingsLoader.instance) {
      throw new Error('Use SettingsLoader.getSettings()')
    }
    this.GAME_FIELD_BACKGROUND_COLOR = '161f27'
    this.FIGURE_COLORS = [
      this.GAME_FIELD_BACKGROUND_COLOR,
      'FFD498',
      '047C51',
      'FE5825',
      '700414',
      'DF3D2E',
      'FEFEFE',
      '668BC4',
      '335495'
    ]
    this.GAME_MODES = {
      EASY: 'Easy mode',
      MEDIUM: 'Medium mode',
      HARD: 'Hard mode'
    }
    this.GAME_FIELD_HEIGHT_IN_CELLS = 20
    this.GAME_FIELD_WIDTH_IN_CELLS = 10
    this.EFFECT_COLOR = 'ffffff'
    this.TETRIS_EFFECT_COLOR = 'ff0000'
    this.LEVELS = {
      0: 770,
      15: 730,
      30: 680,
      45: 620,
      60: 550,
      75: 470,
      90: 380,
      100: 280,
      110: 160,
      120: 100
    }
  }

  /**
   * Loads settings from json file via http
   * @param fileURI URI for settings file
   * @returns settings object
   */
  private readSettingsFromJson(fileURI: string) {
    const request = new XMLHttpRequest()
    request.open('GET', fileURI, false)
    //request.overrideMimeType('application/json');
    request.send()
    if (request.status == 200 && request.readyState == 4) {
      return JSON.parse(request.responseText)
    }
  }

  /**
   * Return SettingsLoader instance
   * @returns SettingsLoader instance
   */
  static getSettings(): SettingsLoader {
    SettingsLoader.instance = SettingsLoader.instance || new SettingsLoader()
    return SettingsLoader.instance
  }
}
