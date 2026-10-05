const { spawn } = require('child_process');

async function testNav() {
  const edge = spawn('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', [
    '--headless',
    '--disable-gpu',
    '--window-size=1280,900',
    '--remote-debugging-port=9223',
    'http://localhost:3000'
  ]);

  await new Promise(r => setTimeout(r, 2000));

  try {
    const listRes = await fetch('http://localhost:9223/json');
    const tabs = await listRes.json();
    const tab = tabs.find(t => t.url.includes('localhost')) || tabs[0];
    const wsUrl = tab.webSocketDebuggerUrl;

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

    // Enable console and runtime
    await send('Console.enable');
    await send('Runtime.enable');

    ws.addEventListener('message', (event) => {
      const msg = JSON.parse(event.data);
      if (msg.method === 'Runtime.exceptionThrown') {
        console.log('EXCEPTION:', JSON.stringify(msg.params.exceptionDetails, null, 2));
      }
      if (msg.method === 'Console.messageAdded') {
        console.log('CONSOLE:', msg.params.message.text);
      }
    });

    console.log('Page loaded, waiting 2s...');
    await new Promise(r => setTimeout(r, 2000));

    console.log('Now clicking Work link...');
    await send('Runtime.evaluate', {
      expression: `document.querySelector('a[href="/work"]')?.click()`
    });
    await new Promise(r => setTimeout(r, 2500));
    console.log('Now clicking About link from Work page...');
    await send('Runtime.evaluate', {
      expression: `document.querySelector('a[href="/about"]')?.click()`
    });
    await new Promise(r => setTimeout(r, 2500));

    const evalRes = await send('Runtime.evaluate', {
      expression: `
        ({
          url: window.location.href,
          mainChildCount: document.querySelector('main')?.children.length,
          rootText: document.getElementById('root')?.innerText?.substring(0, 200)
        })
      `,
      returnByValue: true
    });
    console.log('Final page state:', evalRes);

    ws.close();
  } catch (err) {
    console.error('Error:', err);
  } finally {
    edge.kill();
  }
}

testNav();
