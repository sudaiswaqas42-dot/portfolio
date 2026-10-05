const { spawn } = require('child_process');

async function test() {
  const edge = spawn('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', [
    '--headless', '--disable-gpu', '--remote-debugging-port=9224', 'http://localhost:3000'
  ]);
  await new Promise(r => setTimeout(r, 2000));
  try {
    const list = await (await fetch('http://localhost:9224/json')).json();
    const tab = list.find(t => t.url.includes('localhost'));
    const ws = new WebSocket(tab.webSocketDebuggerUrl);
    await new Promise(r => ws.addEventListener('open', r, { once: true }));
    let id = 1;
    function send(method, params = {}) {
      return new Promise(res => {
        const curId = id++;
        const h = e => {
          const m = JSON.parse(e.data);
          if (m.id === curId) { ws.removeEventListener('message', h); res(m.result); }
        };
        ws.addEventListener('message', h);
        ws.send(JSON.stringify({ id: curId, method, params }));
      });
    }
    const res = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const btn = document.querySelector('.cta-button-wrapper');
          const hover = document.querySelector('.hover-main-cta');
          const talk = document.querySelector('.cta-talk');
          const email = document.querySelector('.email-cta');
          const btnComp = btn ? getComputedStyle(btn) : null;
          const hoverComp = hover ? getComputedStyle(hover) : null;
          const talkComp = talk ? getComputedStyle(talk) : null;
          const emailComp = email ? getComputedStyle(email) : null;
          return {
            btnBg: btnComp?.backgroundColor,
            hoverBg: hoverComp?.backgroundColor,
            talkColor: talkComp?.color,
            emailColor: emailComp?.color
          };
        })()
      `,
      returnByValue: true
    });
    console.log('Colors:', JSON.stringify(res.result.value, null, 2));
    ws.close();
  } finally {
    edge.kill();
  }
}
test();
