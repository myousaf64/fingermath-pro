// Zero-dependency dev server: serves static files + proxies OpenAI TTS
// so the API key never reaches the browser. Run: node server.js
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const PORT = process.env.PORT || 8000;

function loadEnv() {
  try {
    return Object.fromEntries(
      fs.readFileSync(path.join(ROOT, '.env'), 'utf8')
        .split('\n')
        .filter(l => l.includes('='))
        .map(l => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim()])
    );
  } catch {
    return {};
  }
}
const OPENAI_APIKEY = loadEnv().OPENAI_APIKEY;

const MIME = {
  '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript',
  '.css': 'text/css', '.json': 'application/json', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.mp3': 'audio/mpeg', '.zip': 'application/zip'
};

async function tts(req, res) {
  if (!OPENAI_APIKEY) { res.writeHead(503); return res.end('no OPENAI_APIKEY'); }
  let body = '';
  for await (const chunk of req) body += chunk;
  const { text } = JSON.parse(body || '{}');
  if (!text || text.length > 200) { res.writeHead(400); return res.end('bad text'); }

  const r = await fetch('https://api.openai.com/v1/audio/speech', {
    method: 'POST',
    headers: { Authorization: `Bearer ${OPENAI_APIKEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'gpt-4o-mini-tts',
      voice: 'onyx',
      input: text,
      instructions: 'A furious viking army drill sergeant, shouting at the top of his lungs, gravelly, theatrical, slightly unhinged.',
      response_format: 'mp3'
    })
  });
  if (!r.ok) { res.writeHead(502); return res.end('tts upstream error'); }
  res.writeHead(200, { 'Content-Type': 'audio/mpeg' });
  res.end(Buffer.from(await r.arrayBuffer()));
}

http.createServer(async (req, res) => {
  try {
    if (req.method === 'POST' && req.url === '/tts') return await tts(req, res);

    const urlPath = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    const filePath = path.normalize(path.join(ROOT, urlPath === '/' ? 'index.html' : urlPath));
    // stay inside ROOT, never serve dotfiles (.env, .git)
    if (!filePath.startsWith(ROOT) || path.basename(filePath).startsWith('.') || filePath.includes(`${path.sep}.`)) {
      res.writeHead(403); return res.end('forbidden');
    }
    const data = await fs.promises.readFile(filePath);
    res.writeHead(200, { 'Content-Type': MIME[path.extname(filePath)] || 'application/octet-stream' });
    res.end(data);
  } catch (e) {
    res.writeHead(e.code === 'ENOENT' ? 404 : 500);
    res.end(e.code === 'ENOENT' ? 'not found' : 'server error');
  }
}).listen(PORT, () => console.log(`FingerMath Pro: http://localhost:${PORT} (tts: ${OPENAI_APIKEY ? 'live' : 'DISABLED, pregenerated clips only'})`));
