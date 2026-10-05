const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

async function capture() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const edge = spawn(edgePath, [
    '--headless=new',
    '--remote-debugging-port=9230',
    '--window-size=1440,900',
    '--disable-gpu',
    '--no-sandbox',
    'about:blank'
  ]);

  await new Promise(r => setTimeout(r, 1500));
  const listRes = await fetch('http://127.0.0.1:9230/json');
  const targets = await listRes.json();
  const page = targets.find(t => t.type === 'page');
  const ws = new WebSocket(page.webSocketDebuggerUrl);

  let id = 1;
  const callbacks = new Map();
  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.id && callbacks.has(msg.id)) {
      callbacks.get(msg.id)(msg.result, msg.error);
      callbacks.delete(msg.id);
    }
  };

  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const reqId = id++;
    callbacks.set(reqId, (res, err) => { if (err) reject(err); else resolve(res); });
    ws.send(JSON.stringify({ id: reqId, method, params }));
  });

  await new Promise((resolve) => ws.onopen = resolve);
  await send('Page.enable');
  await send('Runtime.enable');

  await send('Page.navigate', { url: 'http://localhost:3000/' });
  // Wait for initial loader
  await new Promise(r => setTimeout(r, 3000));

  // Scroll to #about
  await send('Runtime.evaluate', { expression: 'document.querySelector("#about").scrollIntoView();' });
  await new Promise(r => setTimeout(r, 1000));

  const { data } = await send('Page.captureScreenshot', { format: 'png' });
  const outPath = 'C:\\Users\\User\\.gemini\\antigravity-ide\\brain\\b06d2771-ebb7-4e57-b312-d4de34f59df5\\current_about.png';
  fs.writeFileSync(outPath, Buffer.from(data, 'base64'));
  console.log('Saved', outPath);

  ws.close();
  edge.kill();
}

capture().catch(console.error);
