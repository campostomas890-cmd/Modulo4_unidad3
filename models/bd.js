const mysql = require('mysql2');
const util = require('util');

const pool = mysql.createPool({
    connectionLimit: 10,
    host: process.env.MYSQL_HOST || 'localhost',
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '',
    database: process.env.MYSQL_NAME || 'personas'
});

pool.query = util.promisify(pool.query).bind(pool);

module.exports = pool;


