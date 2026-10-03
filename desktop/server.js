// Serves the built web client and proxies /api/v1 to the backend, mirroring the
// rewrites in ../vercel.json. Keeping everything on one origin means the
// backend's session cookie works exactly as it does in the browser.
const http = require('http')
const https = require('https')
const fs = require('fs')
const path = require('path')

const TYPES = {
  '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.ico': 'image/x-icon',
  '.woff2': 'font/woff2', '.woff': 'font/woff', '.webp': 'image/webp',
}

function start(webRoot, apiOrigin) {
  const api = new URL(apiOrigin)
  const server = http.createServer((req, res) => {
    if (req.url.startsWith('/api/v1')) {
      const headers = { ...req.headers, host: api.host }
      delete headers.origin
      delete headers.referer
      const proxied = https.request(
        { host: api.hostname, port: api.port || 443, path: req.url, method: req.method, headers },
        (up) => { res.writeHead(up.statusCode, up.headers); up.pipe(res) },
      )
      proxied.on('error', () => { res.writeHead(502); res.end('Bad gateway') })
      req.pipe(proxied)
      return
    }
    const clean = decodeURIComponent(req.url.split('?')[0])
    let file = path.join(webRoot, clean)
    if (!file.startsWith(webRoot)) { res.writeHead(403); return res.end() }
    if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) file = path.join(webRoot, 'index.html') // SPA fallback
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' })
    const stream = fs.createReadStream(file)
    stream.on('error', () => { res.writeHead(500); res.end() })
    stream.pipe(res)
  })
  return new Promise((resolve) => server.listen(0, '127.0.0.1', () => resolve(server.address().port)))
}

module.exports = { start }
