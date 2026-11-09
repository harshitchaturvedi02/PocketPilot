const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const preferredPort = Number(process.env.PORT || 4173);
const root = path.join(__dirname, 'public');
let activity = [
  { icon: '✓', title: 'Workspace paired', detail: 'orbit-api • a moment ago', tone: 'success' },
  { icon: '⌘', title: 'Ready for your next instruction', detail: 'The local coding agent is standing by', tone: 'neutral' }
];
let files = [
  { name: 'src', type: 'folder' }, { name: 'app.ts', type: 'file', active: true },
  { name: 'components', type: 'folder' }, { name: 'package.json', type: 'file' },
  { name: 'README.md', type: 'file' }
];

function json(res, status, body) {
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' });
  res.end(JSON.stringify(body));
}
function serve(res, filename, contentType) {
  fs.readFile(path.join(root, filename), (err, data) => {
    if (err) return json(res, 404, { error: 'Not found' });
    res.writeHead(200, { 'content-type': contentType }); res.end(data);
  });
}
function clean(text) { return String(text || '').replace(/[<>]/g, '').slice(0, 600); }

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  if (req.method === 'GET' && url.pathname === '/api/state') return json(res, 200, { project: 'orbit-api', branch: 'feature/mobile', files, activity, online: true });
  if (req.method === 'POST' && url.pathname === '/api/request') {
    let raw = ''; req.on('data', chunk => raw += chunk); req.on('end', () => {
      const prompt = clean(JSON.parse(raw || '{}').prompt);
      if (!prompt) return json(res, 400, { error: 'Write an instruction first.' });
      activity.unshift({ icon: '✦', title: 'Agent is working', detail: prompt, tone: 'working' });
      if (!files.some(f => f.name === 'mobile-notes.md')) files.splice(3, 0, { name: 'mobile-notes.md', type: 'file' });
      setTimeout(() => activity.unshift({ icon: '✓', title: 'Draft ready to review', detail: '2 files changed • tap Changes to inspect', tone: 'success' }), 900);
      return json(res, 200, { message: 'Instruction sent to your coding agent.', changes: 2 });
    }); return;
  }
  if (req.method === 'GET' && url.pathname === '/') return serve(res, 'index.html', 'text/html; charset=utf-8');
  if (req.method === 'GET' && url.pathname === '/app.js') return serve(res, 'app.js', 'application/javascript; charset=utf-8');
  if (req.method === 'GET' && url.pathname === '/styles.css') return serve(res, 'styles.css', 'text/css; charset=utf-8');
  return json(res, 404, { error: 'Not found' });
});

function start(port, fallbackAllowed) {
  server.once('error', error => {
    if (error.code === 'EADDRINUSE' && fallbackAllowed) {
      console.log(`Port ${port} is already in use. Starting Pocket Pilot on ${port + 1} instead.`);
      start(port + 1, false);
      return;
    }
    console.error(`Could not start Pocket Pilot on port ${port}: ${error.message}`);
    process.exitCode = 1;
  });
  server.listen(port, '0.0.0.0', () => console.log(`Pocket Pilot ready at http://0.0.0.0:${port}`));
}

start(preferredPort, !process.env.PORT);
