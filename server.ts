import { createServer } from 'http'
import { createServer as createViteServer } from 'vite'
import app from './api/boot.js'

const PORT = process.env.PORT || 3000

async function startServer() {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  })

  const server = createServer(async (req, res) => {
    if (req.url?.startsWith('/api/') || req.url?.startsWith('/api/trpc')) {
      const body = req.method !== 'GET' && req.method !== 'HEAD' 
        ? await new Promise<string>((resolve) => {
            let data = ''
            req.on('data', (chunk: string) => (data += chunk))
            req.on('end', () => resolve(data))
          })
        : undefined

      const headers = new Headers()
      for (const [key, value] of Object.entries(req.headers)) {
        if (value !== undefined) {
          headers.set(key, Array.isArray(value) ? value.join(', ') : String(value))
        }
      }

      const response = await app.fetch(new Request(`http://localhost:${PORT}${req.url}`, {
        method: req.method,
        headers,
        body,
      }))

      res.statusCode = response.status
      response.headers.forEach((value: string, key: string) => res.setHeader(key, value))
      const bodyText = await response.text()
      res.end(bodyText)
      return
    }

    vite.middlewares(req, res, () => {
      res.statusCode = 404
      res.end('Not found')
    })
  })

  server.listen(PORT, () => {
    console.log(`\n  StoryRealm AI Server running at http://localhost:${PORT}`)
    console.log('  Press Ctrl+C to stop\n')
  })
}

startServer().catch(console.error)
