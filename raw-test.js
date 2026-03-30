const mysql = require('mysql2/promise');
async function test() {
  try {
    const conn = await mysql.createConnection({ host: '127.0.0.1', port: 3307, user: 'root', password: 'password', database: 'fregenet_production', connectTimeout: 3000 });
    console.log("Connected to 3307!");
    conn.end();
  } catch(e) {
    console.log("3307 failed: ", e.message);
  }
  try {
    const conn = await mysql.createConnection({ host: '127.0.0.1', port: 3306, user: 'root', password: 'password', database: 'fregenet_production', connectTimeout: 3000 });
    console.log("Connected to 3306!");
    conn.end();
  } catch(e) {
    console.log("3306 failed: ", e.message);
  }
}
test();
