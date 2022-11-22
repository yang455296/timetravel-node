const mysql = require('mysql2');

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    //port:'3308',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'timetravel',
    waitForConnections: true,
    connectionLimit: 10,  // 最大連線數
    queueLimit: 0 //不限制排隊數量
});
module.exports = pool.promise();  // 滙出promise pool
