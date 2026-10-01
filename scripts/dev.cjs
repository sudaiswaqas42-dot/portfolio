const {spawn}=require('node:child_process');
const path=require('node:path');
const root=path.join(__dirname,'..');
const children=[spawn(process.execPath,['--watch','backend/server/server.cjs'],{cwd:root,stdio:'inherit'}),spawn(process.execPath,['node_modules/vite/bin/vite.js','--config','frontend/vite.config.js'],{cwd:root,stdio:'inherit'})];
function stop(){for(const child of children)child.kill();}
process.on('SIGINT',stop);process.on('SIGTERM',stop);
for(const child of children)child.on('exit',code=>{stop();process.exitCode=code||0;});
