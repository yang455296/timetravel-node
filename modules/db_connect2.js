const mysql = require('mysql2');

const pool = mysql.createPool({
    
    // host: process.env.DB_HOST || 'localhost',
    // user: process.env.DB_USER || 'root',
    // password: process.env.DB_PASS || '',
    // database: process.env.DB_NAME || 'ProjectAtHome1202',
    // port:'3306',
    // waitForConnections: true,
    // connectionLimit: 10,  // 最大連線數
    // queueLimit: 0 //不限制排隊數量
    host: process.env.DB_HOST || '192.168.35.119',
    user: process.env.DB_USER || 'project',
    password: process.env.DB_PASS || '123',
    database: process.env.DB_NAME || 'project',
    // port:'3306',
    waitForConnections: true,
    connectionLimit: 10,  // 最大連線數
    queueLimit: 0, //不限制排隊數量
   
});
module.exports = pool.promise();  // 滙出promise pool
