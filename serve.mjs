import http from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.dirname(fileURLToPath(import.meta.url))
const port = Number(process.env.PORT || 4187)
const mime = {
  '.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8',
  '.webp':'image/webp','.jpg':'image/jpeg','.jpeg':'image/jpeg','.png':'image/png','.svg':'image/svg+xml',
  '.mp4':'video/mp4','.json':'application/json; charset=utf-8'
}

function safePath(urlPath) {
  const decoded = decodeURIComponent(urlPath.split('?')[0])
  const normalized = path.normalize(decoded).replace(/^([/\\])+/, '')
  const full = path.join(root, normalized)
  if (!full.startsWith(root)) throw new Error('Invalid path')
  return full
}

const server = http.createServer(async (req, res) => {
  try {
    let file = safePath(req.url || '/')
    let info
    try { info = await stat(file) } catch {}
    if (info?.isDirectory()) file = path.join(file, 'index.html')
    if (!info && !path.extname(file)) file = path.join(file, 'index.html')
    const data = await readFile(file)
    res.writeHead(200, { 'Content-Type': mime[path.extname(file).toLowerCase()] || 'application/octet-stream', 'Cache-Control':'no-cache' })
    res.end(data)
  } catch (error) {
    res.writeHead(404, { 'Content-Type':'text/plain; charset=utf-8' })
    res.end('Not found')
  }
})
server.listen(port, '127.0.0.1', () => console.log(`WOYKE prototype: http://127.0.0.1:${port}`))
