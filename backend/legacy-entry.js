import { createRequire } from 'node:module';
const require=createRequire(import.meta.url);
const {app}=require('./server/server.cjs');
const {port}=require('./server/config.cjs');
const pool=require('./server/db.cjs');
require('./server/migrate.cjs')().then(()=>app.listen(port,'127.0.0.1',()=>console.log('Portfolio: http://localhost:'+port))).catch(e=>{console.error(e.message);process.exitCode=1;pool.end();});
