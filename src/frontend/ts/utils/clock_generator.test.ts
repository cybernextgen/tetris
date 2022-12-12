import { ClockGenerator } from './clock_generator'

test('Start stop test', (done) => {
  const generator = new ClockGenerator()
  let count = 0
  let totalTime = 0
  const interval = 100
  const clockCount = 3

  let startDatetime = Date.now()
  generator.setCallback(() => {
    const intervalDatetime = Date.now()
    totalTime += intervalDatetime - startDatetime
    count += 1

    startDatetime = Date.now()
    if (count === clockCount) {
      generator.stop()
    }
  })

  generator.setInterval(interval)
  generator.start()

  setTimeout(() => {
    const intervalMeasured = totalTime / clockCount
    const result =
      interval - 0.05 * interval < intervalMeasured &&
      intervalMeasured < interval + 0.05 * interval
    expect(result).toBe(true)
    done()
  }, (clockCount + 5) * interval)
})
