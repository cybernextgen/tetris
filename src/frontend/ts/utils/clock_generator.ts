/**
 * Clock generator, call callback function every defined interval
 */
export class ClockGenerator {
  private callback: Function
  private interval: number
  private timerId: ReturnType<typeof setTimeout>
  private isEnabled: boolean = false

  private clockHandler() {
    if (this.isEnabled) {
      this.callback()
      this.timerId = setTimeout(() => {
        this.clockHandler()
      }, this.interval)
    } else {
      this.isEnabled = false
    }
  }

  /**
   * Start the generator
   */
  start() {
    if (!this.isEnabled) {
      setTimeout(() => {
        this.clockHandler()
      }, this.interval)
      this.isEnabled = true
    }
  }

  /**
   * Stop the generator
   */
  stop() {
    if (this.timerId) {
      clearTimeout(this.timerId)
    }
    this.isEnabled = false
  }

  /**
   * Do clock from external source
   */
  continue() {
    if (this.isEnabled) {
      this.stop()
      this.callback()
      this.start()
    }
  }

  /**
   * Change interval
   * @param interval interval between callback calls in milliseconds
   */
  setInterval(interval: number) {
    this.interval = interval
  }

  /**
   * Sets a callback function
   * @param callback callback function
   */
  setCallback(callback: Function) {
    this.callback = callback
  }
}
