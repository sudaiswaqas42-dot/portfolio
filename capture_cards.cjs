const { spawn } = require('child_process');
const fs = require('fs');

async function capture() {
  const edge = spawn('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', [
    '--headless',
    '--disable-gpu',
    '--window-size=1280,900',
    '--remote-debugging-port=9222',
    'http://localhost:3000/about'
  ]);

  await new Promise(r => setTimeout(r, 2500));

  try {
    const listRes = await fetch('http://localhost:9222/json');
    const tabs = await listRes.json();
    const wsUrl = tabs[0].webSocketDebuggerUrl;
    console.log('WS URL:', wsUrl);

    const ws = new WebSocket(wsUrl);

    let id = 1;
    function send(method, params = {}) {
      return new Promise((resolve) => {
        const curId = id++;
        const handler = (event) => {
          const msg = JSON.parse(event.data);
          if (msg.id === curId) {
            ws.removeEventListener('message', handler);
            resolve(msg.result);
          }
        };
        ws.addEventListener('message', handler);
        ws.send(JSON.stringify({ id: curId, method, params }));
      });
    }

    await new Promise(r => ws.addEventListener('open', r, { once: true }));

    // Scroll to news 2
    await send('Runtime.evaluate', {
      expression: `
        const news = document.querySelectorAll('.cont-news-wrapper')[1];
        if (news) {
          news.scrollIntoView({ behavior: 'instant', block: 'center' });
        }
      `
    });

    await new Promise(r => setTimeout(r, 2000));

    const shot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('cards_screenshot.png', Buffer.from(shot.data, 'base64'));
    console.log('Saved cards_screenshot.png successfully!');

    ws.close();
  } catch (err) {
    console.error('Error during capture:', err);
  } finally {
    edge.kill();
  }
}

capture();
