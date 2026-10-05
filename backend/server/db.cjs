const mysql = require('mysql2/promise');
require('./config.cjs');

const railwayUrl = 'mysql://root:tusfWXiygZpcjiKwHEaUVyGOcztulCCF@acela.proxy.rlwy.net:56971/railway';
const connectionUrl = process.env.MYSQL_URL || process.env.DATABASE_URL || railwayUrl;

const pool = connectionUrl
  ? mysql.createPool(connectionUrl)
  : mysql.createPool({
      host: process.env.MYSQLHOST || process.env.DB_HOST || 'localhost',
      user: process.env.MYSQLUSER || process.env.DB_USER || 'root',
      password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD || '',
      database: process.env.MYSQLDATABASE || process.env.DB_NAME || 'sudais_portfolio',
      port: Number(process.env.MYSQLPORT || process.env.DB_PORT || 3306),
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });

module.exports = pool;
