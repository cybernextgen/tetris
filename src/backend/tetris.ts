import { IncomingMessage, RequestListener, ServerResponse } from 'http'
import * as http from 'http'
import * as fs from 'fs/promises'

const parsedArgs = getArgs()
const host = parsedArgs['host'] || 'localhost'
const port = parsedArgs['port'] || 8000

/**
 * Returns process arguments
 * @returns object with process arguments
 */
function getArgs(): { [key: string]: any } {
  const args = {}
  process.argv.slice(2, process.argv.length).forEach((arg) => {
    if (arg.slice(0, 2) === '--') {
      const longArg = arg.split('=')
      const longArgFlag = longArg[0].slice(2, longArg[0].length)
      const longArgValue = longArg.length > 1 ? longArg[1] : true
      args[longArgFlag] = longArgValue
    } else if (arg[0] === '-') {
      const flags = arg.slice(1, arg.length).split('')
      flags.forEach((flag) => {
        args[flag] = true
      })
    }
  })
  return args
}

/**
 * Serves static file
 * @param res node.js response object
 * @param location file URI
 * @param contentType MIME type of file
 */
function sendFile(res: ServerResponse, location: string, contentType: string) {
  fs.readFile(__dirname + location)
    .then((contents) => {
      res.setHeader('Content-Type', contentType)
      res.writeHead(200)
      res.end(contents)
    })
    .catch((err) => {
      res.writeHead(500)
      res.end(err)
      return
    })
}

/**
 * Sends HTTP Not found status code to client
 * @param res node.js response object
 */
function sendNotFound(res: ServerResponse) {
  res.setHeader('Content-type', 'text/html')
  res.writeHead(404)
  res.end('Requested page not found!')
}

/**
 * Handles clients requests
 * @param req node.js request object
 * @param res node.js response object
 */
const requestListener: RequestListener = function (
  req: IncomingMessage,
  res: ServerResponse
) {
  const requestedUrl = req.url
  if (requestedUrl === '/') {
    sendFile(res, '/index.html', 'text/html')
  } else if (requestedUrl === '/tetris_frontend.js') {
    sendFile(res, requestedUrl, 'application/javascript')
  } else {
    sendNotFound(res)
  }
}

const server = http.createServer(requestListener)
server.listen(port, host, () => {
  console.log(`Tetris is running on http://${host}:${port}`)
})
