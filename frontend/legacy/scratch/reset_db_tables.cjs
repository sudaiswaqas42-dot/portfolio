const pool = require('../server/db.cjs');

async function reset() {
  const conn = await pool.getConnection();
  try {
    await conn.query('DROP TABLE IF EXISTS projects;');
    await conn.query('DROP TABLE IF EXISTS about_content;');
    console.log('Old tables dropped.');
  } finally {
    conn.release();
  }
}

reset().then(() => {
  require('../server/init_db.cjs');
});
