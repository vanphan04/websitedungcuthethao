const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "localhost",       
  user: "root",            
  password: "",            
  database: "sportshop",
  port: 3306               
});

connection.connect((err) => {
  if (err) {
    console.error("Lỗi kết nối:", err);
  } else {
    console.log("Kết nối thành công!");
  }
});

module.exports = connection;
