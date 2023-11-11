const reset = '\x1b[0m'
const fgWhite = '\x1b[37m'
const fgGreen = '\x1b[32m'
const fgBlue = '\x1b[34m'
const fgYellow = '\x1b[33m'
const fgRed = '\x1b[31m'
const fgCyan = '\x1b[36m'
const magenta = '\x1b[35m'

const a = `${magenta}┌─[`
const b = `${magenta}──[`
const c = `${magenta}└─[`
const d = `${magenta}]`
const e = `${magenta}├─[`
const f = `${magenta}│`

let method = null

export function prompt(req, res, next) {
  makeColor(req)

  console.log(
    `\n${getTime()}${b}${fgBlue}${fgWhite}${method}${reset}${d}\n` +
      `${f}\n` +
      `${getUrl(req)}\n` +
      `${f}\n` +
      `${c}${fgGreen}${JSON.stringify(req.body, '', 4)}${d}${reset}\n`
  )
  next()
}

function makeColor(req) {
  if (req.method === 'GET') method = `${fgGreen}${req.method}`
  else if (req.method === 'POST') method = `${fgBlue}${req.method}`
  else if (req.method === 'PATCH') method = `${fgYellow}${req.method}`
  else if (req.method === 'DELETE') method = `${fgRed}${req.method}`
}

function getTime() {
  const time = new Date()
  return `${a}${fgYellow}${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}${d}`
}

function getUrl(req) {
  return `${e}${fgCyan}${req.headers.host}${req.url}${d}`
}
