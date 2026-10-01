const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

async function verify() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const edge = spawn(edgePath, [
    '--headless=new',
    '--remote-debugging-port=9229',
    '--window-size=1280,800',
    '--disable-gpu',
    '--no-sandbox',
    'about:blank'
  ]);

  await new Promise(r => setTimeout(r, 1500));
  const listRes = await fetch('http://127.0.0.1:9229/json');
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

  await send('Page.navigate', { url: 'http://localhost:3000/about' });
  // Wait 3.5s for initial loader curtain to lift
  await new Promise(r => setTimeout(r, 3500));

  const takeScreenshot = async (name) => {
    const { data } = await send('Page.captureScreenshot', { format: 'png' });
    const outPath = path.resolve('C:\\Users\\User\\.gemini\\antigravity-ide\\brain\\88c04f81-bd46-4346-9d02-d1853adb487e', name);
    fs.writeFileSync(outPath, Buffer.from(data, 'base64'));
    console.log('Saved', outPath);
    return outPath;
  };

  // 1. Hero text layout (3 lines)
  await takeScreenshot('final_about_hero.png');

  // 2. Scroll into circles (Check seamless background + edge-to-edge circles without cut)
  await send('Runtime.evaluate', { expression: 'window.scrollTo({ top: 950, behavior: "instant" })' });
  await new Promise(r => setTimeout(r, 800));
  await takeScreenshot('final_about_circles.png');

  // 3. Scroll to Bio section (line-by-line text reveal)
  await send('Runtime.evaluate', { expression: 'window.scrollTo({ top: 3200, behavior: "instant" })' });
  await new Promise(r => setTimeout(r, 800));
  await takeScreenshot('final_about_bio.png');

  // 4. Scroll to News section
  await send('Runtime.evaluate', { expression: 'window.scrollTo({ top: 5500, behavior: "instant" })' });
  await new Promise(r => setTimeout(r, 800));
  await takeScreenshot('final_about_news.png');

  ws.close();
  edge.kill();
  console.log('Final verification capture complete!');
}

verify().catch(console.error);
